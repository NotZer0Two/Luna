const { Discord, MessageEmbed, Guild, MessageActionRow, MessageButton } = require("discord.js");
const User = require('../../database/schemas/User')

module.exports = {
  name: 'register',
  category: 'Economy',
  description: "Register a wallet to get money",
  aliases: ['reg'],

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

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

    //find the user by is id
    const userProfile = await User.findOne({
        Id: message.author.id,
      })

    if(!userProfile) {
      const newUser = await User.create({ Id: message.author.id })
      message.client.userSettings.set(message.author.id, newUser)
      user = newUser
    } else if (userProfile && userProfile.economy.wallet !== null) {
      return message.channel.send({ content: `
      ❌ You have already a wallet!

      **You have registred already your account**
      `})
    }

    const embed = new MessageEmbed()
      .setTitle(`Luna Banks Advice`)
      .setFooter(`Visit us at • ${process.env.DOMAIN}`)
      .setThumbnail(
        message.author.displayAvatarURL({ dynamic: true, size: 1024 }),
      )
      .setDescription("ECONOMY | Wallet Creation\n•  clicking accept you will accept the terms of service of the bot.")

      const row1 = new MessageActionRow().addComponents(
        new MessageButton().setCustomId('yeswallet').setLabel('Accept').setEmoji('✅').setStyle('SUCCESS'),
        new MessageButton().setCustomId('nowallet').setLabel('Deny').setEmoji('❌').setStyle('DANGER'),
    )

    message.channel.send({
      embeds: [embed],
      components: [row1]
  })
  },
}