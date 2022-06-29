const { Client, Message, MessageEmbed, Discord } = require('discord.js')
const Bot = require("../../database/schemas/Bot")

module.exports = {
  name: 'inbox',
  category: 'ℹ️ Information',
  description: 'Display the newest Messages',
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (!message.guild.me.permissions.has('SEND_MESSAGES')) return
    if (
      !message.guild.me.permissions.has([
        'EMBED_LINKS',
        'SEND_MESSAGES',
        'READ_MESSAGE_HISTORY',
        'VIEW_CHANNEL',
      ])
    ) {
      return message.channel.send({ content: `
      ❌ I require some Permissions!

      **I need the following Permissions to work on your Server:**
      EMBED_LINKS,
      SEND_MESSAGES, 
      READ_MESSAGE_HISTORY,
      VIEW_CHANNEL

      ⚠️ Please add me the right Permissions and re-run this Command!
  
      `})
    }

    const bot = await Bot.findOne({ Id: client.user.id });

    const infoembed = new MessageEmbed()
      .setTitle('Luna Information')
      .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
      .setColor('RANDOM')
      .setTimestamp()
      .setDescription(
        `Welcome ${
          message.author.username
        }!\nLast update: <t:${bot.AlertTimestamp || Math.floor(Date.now()/1000)}:R>\n\n📥 **Inbox:**\n${bot.Alert || "No Alert yet!"}`,
      )
      .setFooter(`${message.author.username}`)

    message.channel.send({ embeds: [infoembed] })
  },
}
