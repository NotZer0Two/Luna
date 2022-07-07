const { Collection, Client, WebhookClient, MessageEmbed } = require('discord.js')
const Discord = require('discord.js')
const Guild = require('./database/schemas/Guild')
const Bot = require("./database/schemas/Bot");
const client = new Client({
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.GUILD_BANS,
    Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
    Discord.Intents.FLAGS.GUILD_WEBHOOKS,
    Discord.Intents.FLAGS.GUILD_INVITES,
    Discord.Intents.FLAGS.GUILD_VOICE_STATES,
    Discord.Intents.FLAGS.GUILD_PRESENCES,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
    Discord.Intents.FLAGS.DIRECT_MESSAGES,
    Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING
  ],
  partials: ['USER', 'CHANNEL', 'GUILD_MEMBER', 'MESSAGE'],
  allowedMentions: {
    parse: ['roles', 'users', 'everyone'],
    repliedUser: true,
  },
})

// Require Modules and Init the Client
const mongoose = require('./database/mongoose')
const path = require('path')
const fs = require('fs')

require("dotenv").config();
module.exports = client

// Require the Bots Collections and Settings
client.commands = new Collection()
client.prefix = process.env.PREFIX
client.aliases = new Collection()
client.guildSettings = new Collection()
<<<<<<< HEAD
client.userSettings = new Collection()
client.stafflogs = new WebhookClient({ url: process.env.STAFFERLOGS });
client.modlogs = async function({ MemberTag, MemberID, MemberDisplayURL, Action, Color, Reason, ModeratorTag, ModeratorID, ModeratorDisplayURL}, interaction) {
  const data = await Guild.findOne({ Id: interaction.guild.id }); 
  if(!data) return;
  if(!data.feature.Modlogs.channel || !data.feature.Modlogs.webhook) return;
=======
client.buttonCommands = new Collection();
client.userSettings = new Collection()
client.stafflogs = new WebhookClient({ url: process.env.STAFFERLOGS });
client.modlogs = async function({ MemberTag, MemberID, MemberDisplayURL, Action, Color, Reason, ModeratorTag, ModeratorID, ModeratorDisplayURL, Attachments}, interaction) {
  const data = await Guild.findOne({ Id: interaction.guild.id }); 
  if(!data) return;
  if(!data.feature.Modlogs.channel || data.feature.Modlogs.enable === false) return;
>>>>>>> Massive Update
 
  const channel = interaction.guild.channels.cache.get(data.feature.Modlogs.channel);

  const logsembed = new MessageEmbed()
  .setColor(Color)
  .setDescription(`**Member**: \`${MemberTag}\` (${MemberID}) 
  **Action**: ${Action}
  **Reason**: ${Reason}`) 
  .setThumbnail(MemberDisplayURL)
  .setAuthor({name: `${ModeratorTag} (${ModeratorID})`, iconURL: `${ModeratorDisplayURL}`})
  .setTimestamp()

<<<<<<< HEAD
  channel.send({ embeds: [logsembed] });
=======

  //check if attachment is empty or not
  if(Attachments) {
    const display = await channel.send({ embeds: [logsembed], files: [Attachments] }).catch(err => console.log(err));
  } else {
    const display = await channel.send({ embeds: [logsembed] }).catch(err => console.log(err));
  }
>>>>>>> Massive Update
}

// load the Command and Handlers for the Bot, commands not in these paths, won't work.
client.categories = fs.readdirSync(path.resolve('src/commands'))
;['command'].forEach(handler => {
  require(path.resolve(`src/handlers/${handler}`))(client)
})

<<<<<<< HEAD
=======
//Same as the upper one
;['buttons'].forEach(handler => {
  require(path.resolve(`src/handlers/${handler}`))(client)
})

>>>>>>> Massive Update
// Init the Database and login the Bot
mongoose.init()
client.login(process.env.TOKEN)
require('./dashboard/index')(client)

process.on('unhandledRejection', (error) => {
  client.stafflogs.send(`\`\`\`js\n${error.stack}\`\`\``)
});
process.on("uncaughtException", (err, origin) => {
  client.stafflogs.send(`\`\`\`js\n${err.stack}\`\`\``)
})
process.on('uncaughtExceptionMonitor', (err, origin) => {
  client.stafflogs.send(`\`\`\`js\n${err.stack}\`\`\``)
});
process.on('beforeExit', (code) => {
  client.stafflogs.send(`\`\`\`js\n${code}\`\`\``)
});
process.on('exit', (code) => {
  client.stafflogs.send(`\`\`\`js\n${code}\`\`\``)
});
