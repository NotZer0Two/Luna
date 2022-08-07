const { Client, Message, MessageEmbed } = require('discord.js')
const Discord = require("discord.js")
const WomboDream = require('dream-api');
const fetch = require('node-fetch')

module.exports = {
  name: 'art',
  description: 'Create your own Art by an ai',
  category: '📚 Utility',
  aliases: 'artgen',
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.member

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

    const zerotwo = await fetch('https://paint.api.wombo.ai/api/styles/').then(res => res.json())
    //for each 24 style get the id and name
    //get each style and name
    const style = zerotwo.map(style => {
      return {
        id: style.id,
        name: style.name,
      }
    })

    if(!args[0]) return message.channel.send(await client.translate('Please specify a style!' + "\n" + style.map(style => `\`${style.id}\` = \`${style.name}\``).join('\n'), message.guild.id))
    if(isNaN(args[0])) return message.channel.send(await client.translate("The number is not valid!", message.guild.id))

    if(!args[1]) return message.channel.send(await client.translate("Please specify something for the ai to create", message.channel.id))

    message.channel.send(await client.translate("> **This action can take some minutes many people are doing request please wait**", message.guild.id))

    let image = await WomboDream.generateImage(args[0], args[1]);

    let embed = new MessageEmbed()
      .setColor('RANDOM')
      .setTitle(await client.translate(`${member.user.username}'s Art`, message.guild.id))
      .setImage(image.result.final)
      .setFooter(await client.translate(`Requested by ${message.author.tag}`, message.guild.id))
      .setTimestamp()

      const row = new Discord.MessageActionRow().addComponents(
        new Discord.MessageButton()
        .setLabel(await client.translate('Download', message.guild.id))
        //get the image sended on the embed
        .setURL(image.result.final)
        .setStyle('LINK'),
  
        new Discord.MessageButton()
        .setLabel(await client.translate('AI TOS', message.guild.id))
        .setURL("https://www.w.ai/terms-of-service-wombo-dream")
        .setStyle('LINK')
      )
    message.channel.send({ embeds: [embed], components: [row] })
  },
}
