const Discord = require('discord.js')

module.exports = {
  name: 'invite',
  category: '📚 Utility',
  description: "Sends you Luna's bot invite link.",

  run: async (client, message, args, user, guild) => {
    if (!message.guild.me.permissions.has('SEND_MESSAGES')) return
    if (
      !message.guild.me.permissions.has([
        'EMBED_LINKS',
        'ADD_REACTIONS',
        'SEND_MESSAGES',
        'READ_MESSAGE_HISTORY',
        'VIEW_CHANNEL',
      ])
    ) {
      return message.channel.send(`
        ❌ I require some Permissions!
  
        **I need the following Permissions to work on your Server:**
        EMBED_LINKS,
        ADD_REACTIONS, 
        SEND_MESSAGES, 
        READ_MESSAGE_HISTORY,
        VIEW_CHANNEL
  
        ⚠️ Please add me the right Permissions and re-run this Command!
    
        `)
    }
    message.channel.send({
      embeds: [new Discord.MessageEmbed()
        .setTitle(await client.translate('Invite Luna', message.guild.id))
        .setColor('GREEN')
        .setFooter(await client.translate(`Thanks ${message.author.username} for supporting your favorite goddess!`, message.guild.id))
        .setTimestamp()
        .setDescription(
          '[Click this to invite me](https://discord.com/oauth2/authorize?client_id=673952206663319563&scope=bot&permissions=388160)',
        ),
      ]})
  },
}
