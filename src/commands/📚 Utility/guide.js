const { Client, Message, MessageEmbed } = require('discord.js')

module.exports = {
  name: 'guide',
  description: 'Guide how the Bot works.',
  category: 'ð Utility',
  aliases: 'av',
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
      â I require some Permissions!

      **I need the following Permissions to work on your Server:**
      EMBED_LINKS,
      ADD_REACTIONS, 
      SEND_MESSAGES, 
      READ_MESSAGE_HISTORY,
      VIEW_CHANNEL

      â ï¸ Please add me the right Permissions and re-run this Command!
  
      `})
    }

    const infoembed = new MessageEmbed()
      .setTitle(`Luna's Advice`)
      .setFooter(`Visit us at â¢ ${process.env.DOMAIN}`)
      .setThumbnail(
        message.author.displayAvatarURL({ dynamic: true, size: 1024 }),
      )
      .setDescription([
        '    ðBot Guide',
        'â¢  To start you can setup the moderation with "luna setup" or starting farming on the economy.',
        'â¢  After that, you can start exploring our features and see how they works.',
        `â¢  By the way, you can use my dashboard [here](${process.env.DOMAIN})`,
        '',
        '',
        'Have a good exploration ð',
      ].join("\n"))

    //.setTimestamp()

    await message.channel.send({ embeds: [infoembed] }).then(m => { 
    m.react('ð±') 
    m.react("ðº")
    m.react("ð³")
    m.react("ð¦")
    m.react("ð")
  })
  },
}
