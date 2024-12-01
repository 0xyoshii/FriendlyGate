
const { Client, Collection, Intents, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');
const { checkSharesBalance } = require('./utils/shareChecker');
const { getFtAddress } = require('./utils/getFtAddress');
const { User, Guild } = require('./server/models');
const fs = require('node:fs')
const mongooseConnection = require('./server/database');

const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages
    ]
  });

const channelId = process.env.CHANNEL_ID;
const token = process.env.TOKEN;

client.once('ready', async () => {
	console.log('Ready!');
	const channel = await client.channels.fetch(channelId);

	const exampleEmbed = new EmbedBuilder()
	.setColor(0x0099FF)
	.setTitle('FriendlyGate - **Verify your assets**')
	.setDescription('*Make sure your X (twitter) account is connected to your discord account*')
	.setImage('https://cdn-longterm.mee6.xyz/plugins/embeds/images/896008528827920386/3c9e9a27d9fabc5217907c181ee408c58df48301358dedf20ff5276ae41e236f.png')
	.setFooter({ text: 'FriendlyGate Helper', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

	const verify = new ButtonBuilder()
	.setLabel('Verify')
	.setURL('http://localhost:3000/api/auth')
	.setStyle(ButtonStyle.Link);

	const getRoles = new ButtonBuilder()
	.setCustomId('success')
	.setLabel('Get Role')
	.setStyle(ButtonStyle.Success);

	const row = new ActionRowBuilder()
		.addComponents(verify, getRoles);

	channel.send({ embeds: [exampleEmbed], components: [row]  });
});


client.on('interactionCreate', async interaction => {
	if (!interaction.isButton()) return;

	if (interaction.customId === 'success') {

		const users = await User.find();
		const userObject = users.find((obj) => obj.userId === interaction.member.id);
	
		if (!userObject) {
			await interaction.reply({ content: 'Please verify', ephemeral: true });
			return
		}
	    
		const address = await getFtAddress(userObject.twitterUsername);
		const guilds = await Guild.find();
		const guildObject = guilds.find((obj) => obj.guildId === interaction.guildId);
		const sharesSubject = guildObject.sharesSubject;
		const roleId = guildObject.roleId;

		const isElegible = await checkSharesBalance(sharesSubject, address);

		if (isElegible === true) {
			const role = interaction.guild.roles.cache.get(roleId);
			await interaction.member.roles.add(role)
			await interaction.reply({ content: 'Successfully added role! ', ephemeral: true });

			return;
		} else {
			await interaction.reply({ content: 'You re not elegible for this role', ephemeral: true });
			return;
		}
	}

});

client.login(token);
