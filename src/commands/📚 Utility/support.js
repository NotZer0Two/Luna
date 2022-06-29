const { Discord, MessageEmbed } = require('discord.js')

module.exports = {
  name: 'support',
  category: '📚 Utility',
  description: "Sends you Luna's support server link.",

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
      return message.channel.send({
        content: `
      ❌ I require some Permissions!

      **I need the following Permissions to work on your Server:**
      EMBED_LINKS,
      ADD_REACTIONS, 
      SEND_MESSAGES, 
      READ_MESSAGE_HISTORY,
      VIEW_CHANNEL

      ⚠️ Please add me the right Permissions and re-run this Command!
  
      `,
      })
    }

    message.channel.send({
      embeds: [
        new Discord.MessageEmbed()
          .setTitle('Support Server')
          .setColor('GREEN')
          .setDescription(
            `[Click this to join our Support Server](${process.env.SUPPORTSERVERINVITE})`,
          ),
      ],
    })
  },
}
