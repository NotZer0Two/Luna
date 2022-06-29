const { Discord, MessageEmbed, Guild, MessageActionRow, MessageButton } = require("discord.js");
const User = require('../../database/schemas/User')
const market = require('../../database/market/market.json');

module.exports = {
  name: 'previewitem',
  category: 'Economy',
  description: "View an item by its ID",
  aliases: ['pi', "preview"],

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

    const id = args[0]

    if(!id) {
      return message.channel.send({ content: `
      ❌ You need to provide an ID!
      `})
    }

    let selected = market.find(x => x.id == id);

    if(!selected) {
      return message.channel.send({ content: `
      ❌ The ID provided is not valid!
      `})
    }

    console.log(selected.assets.link)

    //make an embed with info's
    const embed = new MessageEmbed()
    .setColor(9807270)
    .setImage(selected.assets.link)
    .setDescription(`
    **ID:** ${selected.id}
    **Name:** ${selected.name}
    **Type:** ${selected.type}
    **Price:** ${commatize(selected.price)}
    `)
    .setTimestamp()

    message.channel.send({ embeds: [embed] })

  },
}

function commatize(number, maximumFractionDigits = 2){
  return Number(number || '')
  .toLocaleString('en-US', { maximumFractionDigits });
};