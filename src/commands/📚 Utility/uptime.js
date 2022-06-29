const { MessageEmbed } = require('discord.js')
const { msToTimeObj } = require('../../handlers/util')

module.exports = {
  name: 'uptime',
  category: 'info',
  description: 'Whats Lunas Uptime?',

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args) => {
    try {
      const timeObj = msToTimeObj(message.client.uptime)

      const embed = new MessageEmbed()
        .setDescription(
          `**${timeObj.days}** days, **${timeObj.hours}** hours, **${timeObj.minutes}** minutes, **${timeObj.seconds}** seconds`,
        )
        .setFooter(`${process.env.DOMAIN}`)
      message.channel.send({ embeds: [embed] })
    } catch (error) {
      console.log(error)
      message.channel.send(
        { content: 'Error while executing Command! Please try again later. '},
      )
    }
  },
}
