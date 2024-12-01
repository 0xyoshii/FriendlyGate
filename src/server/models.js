const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: String,
  username: String,
  twitterUsername: String,
});

const guildSchema = new mongoose.Schema({
    guildId: String,
    guildName: String,
    sharesSubject: String,
    roleId: String,
})

const User = mongoose.model('User', userSchema);
const Guild = mongoose.model('Guild', guildSchema);

module.exports = { User, Guild };