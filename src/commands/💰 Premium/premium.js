const Discord = require('discord.js')

module.exports = {
  name: 'premium',
  category: '💰 Premium',
  description: 'Displays what includes in Stellar',

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
      return message.channel.send({ content: `
      ❌ I require some Permissions!

      **I need the following Permissions to work on your Server:**
      EMBED_LINKS,
      ADD_REACTIONS, 
      SEND_MESSAGES, 
      READ_MESSAGE_HISTORY,
      VIEW_CHANNEL

      ⚠️ Please add me the right Permissions and re-run this Command!
  
      `})
    }

    const embed = new Discord.MessageEmbed()
      .setColor(message.guild.me.displayHexColor)
      .setTitle('Luna Premium')
      .setTimestamp()
      .setDescription(
        'Welcome to Star Premium!\n With this package you get access a different features in Luna!\n\n1. Get more money on the bot\n2. Preview on the last feature\n3. You get a badge on your profile\n4.You get a priority on support',
      )
    message.channel.send({ embeds: [embed] })
  },
}
