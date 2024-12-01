const mongooseConnection = require('./database');
const { User, Guild } = require('./models');

export async function addGuild (guildId, guildName, sharesSubject, roleId) {
    //function to add guild to database
    const guild = {
        guildId: '',
        guildName: '',
        sharesSubject: '',
        roleId: '',
    }

    const obj = new Guild(guild);
    await obj.save()
}