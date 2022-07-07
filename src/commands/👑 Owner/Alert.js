const { Client, Message, MessageEmbed } = require('discord.js')
const Bot = require("../../database/schemas/Bot")

module.exports = {
  name: 'alert',
  category: 'secret',
  description: 'Let you make an alert for all the user',
  ownerOnly: true,
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const bot = await Bot.findOne({ Id: client.user.id });
    const arguments = args.join(" ")
    if (!arguments) return message.channel.send(`> **Please specify a message!**`)


    bot.Alert = arguments;
    bot.AlertTimestamp = Math.floor(Date.now()/1000)
    await bot.save().then(uwu => {
      message.channel.send(`> **Alert set!**`)
    })

  },
}
