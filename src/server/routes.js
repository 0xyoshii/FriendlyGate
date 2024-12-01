const express = require('express');
const axios = require('axios')
const router = express.Router();
const { User, Guild } = require('./models')

const clientId = PROCESS.ENV.CLIENT_ID
const clientSecret = PROCESS.ENV.CLIENT_SECRET

router.get('/auth', async (req, res) => {
    res.send(`
        <div style="margin: 300px auto;
        max-width: 400px;
        display: flex;
        flex-direction: column;
        align-items: center;
        font-family: sans-serif;"
        >
            <h3>Welcome to Discord OAuth</h3>
            <p>Click on the below button to get started!</p>
            <a 
                href="https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fdiscord&response_type=code&scope=identify%20guilds%20connections"
                style="outline: none;
                padding: 10px;
                border: none;
                font-size: 20px;
                margin-top: 20px;
                border-radius: 8px;
                background: #6D81CD;
                cursor:pointer;
                text-decoration: none;
                color: white;"
            >
            Login with Discord</a>
        </div>
    `)
  })

router.get('/auth/discord', async (req, res) => {

    const code = req.query.code;
    const params = new URLSearchParams();
    let user;

    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', "http://localhost:3000/api/auth/discord");

    try {
        const response = await axios.post('https://discord.com/api/oauth2/token', params)
        const { access_token,token_type } = response.data;
        const userDataResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: {
                authorization: `${token_type} ${access_token}`
            }
        })

        const userConnections = await axios.get('https://discord.com/api/users/@me/connections', {
            headers: {
                authorization: `${token_type} ${access_token}`
            }
        })

        const userId = userDataResponse.data.id;

        let username = ""
        

        if (userDataResponse.data.discriminator === '0') {
             username = userDataResponse.data.username
        } else {
             username = userDataResponse.data.username + "#" + userDataResponse.data.discriminator
        }

        const twitterObject = userConnections.data.find(obj => obj.type === 'twitter');
        const twitterUsername = twitterObject.name;

        const userObj = {
            userId: userId,
            username: username,
            twitterUsername: twitterUsername
        }

        const existingUser = await User.findOne({ userId: userObj.userId });

        if (existingUser) {
            existingUser.userId = userObj.userId;
            existingUser.username = userObj.username;
            existingUser.twitterUsername = userObj.twitterUsername;

            await existingUser.save();
            
        } else {
            const user = new User(userObj);
            await user.save();
        }

        user = {
            username:userDataResponse.data.username,
            avatar:`https://cdn.discordapp.com/avatars/350284820586168321/80a993756f84e94536481f3f3c1eda16.png`
        }

        return res.send(`
            <div style="margin: 300px auto;
            max-width: 400px;
            display: flex;
            flex-direction: column;
            align-items: center;
            font-family: sans-serif;"
            >
                <h3>Welcome ${user.username}</h3>
                <span>Email: ${user.email}</span>
                
                <img src="${user.avatar}"/>
            </div>
        `)
        
    } catch(error) {
        console.log('Error',error)
        return res.send('Some error occurred! ')
    } 
})

module.exports = router;