const axios = require('axios');

const auth = process.env.AUTHORIZATION;

async function getFtAddress(username) {
    const url = 'https://prod-api.kosetto.com/search/users?username=' + username
    const headers = {
        'Accept': 'application/json',
        'Authorization': auth,
        'Content-Type': 'application/json',
        'Referer': 'https://www.friend.tech/',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1'
    }

    try {
        const response = await axios.get(url, { headers });
        const jsonData = response.data;
        const foundObject = jsonData.users.find((obj) => obj.twitterUsername === username);

        if (foundObject) {
            return foundObject.address;
        } else {
            console.error('User not found.');
        }
    } catch (error) {
        console.error('Error getting FT address:', error);
        throw error;
    }

}

module.exports = { getFtAddress }