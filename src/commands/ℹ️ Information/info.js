const { Client, Message, MessageEmbed, Discord } = require('discord.js')

module.exports = {
  name: 'info',
  category: 'ℹ️ Information',
  description: 'Dunno what to do?',
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

    const infoembed = new MessageEmbed()
      .setTitle('Luna Information')
      .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
      .setColor('RANDOM')
      .setTimestamp()
      .setDescription(
        await client.translate(`Welcome ${message.author.username}, Welcome To **Luna** one of the perfect goddess you can have on your discord,\n\n**__why Luna is different?__**\n\nLuna have is own Moderation System that none have and is the first bot in the market to have the war between server and with Custom Permission to help make your staff use the war command only if you give them the permission and simple to use for people who don't know commands\n\n **Why i need to buy Star?**\nStar is a subscription to help us on the hosting of the bot but we don't obbligate users to buy it you can see more on "luna premium"\n\n**The bot is open source?**\nYes, we want our bot to be transparent as we say`, message.guild.id ) + `\n\n[Invite](https://discord.com/oauth2/authorize?client_id=673952206663319563&scope=bot&permissions=270126169&response_type=code&redirect_uri=${process.env.DOMAIN}/dashboard) | [Dashboard](${process.env.DOMAIN}/panel) | [Status](${process.env.DOMAIN}/status)`,
      )

    message.channel.send({ embeds: [infoembed] })
  },
}
