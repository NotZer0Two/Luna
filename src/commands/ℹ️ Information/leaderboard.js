const Discord = require('discord.js')
const moment = require('moment')
const User = require('../../database/schemas/User')

module.exports = {
  name: 'leaderboard',
  category: 'ℹ️ Information',
  description: "Display's Luna's global coding leaderboard",
  aliases: ['lb'],

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

    const users = await User.find({ hide: false })
      .sort({ wallet: 0 })
      .limit(10)

    const array = []
    let i = 1
    for (let user of users) {
      const db = client.userSettings.get(user.Id)
      let wallet = 0
      if(user.economy.wallet > 0) {
        wallet = user.economy.wallet
      } else if (user.economy.wallet > 0 && user.economy.bank > 0) {
        wallet = user.economy.wallet + user.economy.bank
      }

      if (db) {
        const fetch = client.users.cache.get(user.Id)
        if (fetch && fetch.username) {
          array.push(
            `\`${i}-\` **${fetch.username}** - \`${wallet} NETWorth\``,
          )
        } else
          array.push(
            `\`${i}-\` **Unknown User** - \`${wallet} NETWorth\` `,
          )
      } else 
        array.push(
          `\`${i}-\` **Unknown User** - \`${wallet} NETWorth\` `,
        )
      i++
    }

    const embed = new Discord.MessageEmbed()
      .setTitle(`Global Luna Leaderboard`)
      .setColor(message.guild.me.displayHexColor)
      .setFooter(`Showing Top 10 Users | ${process.env.DOMAIN}`)
      .setDescription(array.length ? array.join('\n') : 'No users found')

    message.channel.send({ embeds: [embed] })

  },
}
