const HypixelUtils = require('../../HypixelUtils/BazaarFlip');
const { stripIndent } = require('common-tags')
const Discord = require('discord.js');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const moment = require('moment');

module.exports = {
  name: 'hypixel',
  category: 'ℹ️ Information',
  description: 'Get information and utility for hypixel server',

  run: async (client, message, args, user, guild) => {
    let choice = ["flip", "history"]

    if (!args[0]) return message.channel.send('Please specify a command! `flip` or `history`')
    if (!choice.includes(args[0])) return message.channel.send('Please specify a command! `flip` or `history`')

    if (args[0] === "flip") {
      let flip = await HypixelUtils.calculate(5)
      let info = stripIndent`
      ${flip.join("\n")}
      `
      let embed = new Discord.MessageEmbed()
        .setTitle('Bazaar Flip')
        .setColor('RANDOM')
        .setDescription(info)
      
      message.channel.send({ embeds: [embed] })
    } else if (args[0] === "history") {
      let choiceItem = args[1]
      if(!choiceItem) choiceItem = await HypixelUtils.bestid()



      const axios = require('axios');
      const res = await axios.get(`https://sky.coflnet.com/api/bazaar/${choiceItem}/history`);
      const data = res.data;
      if(res.data === []) return message.channel.send('No history found for this item')

      //pick the first 10 items on the array timestamp sell and buy
      const items = data.slice(0, 20);
      const timestampraw = items.map(item => item.timestamp);
      const sell = items.map(item => item.sell);
      const buy = items.map(item => item.buy);
      
      //pick from the timestampraw the day like sunday and lunday
      const timestamp = timestampraw.map(item => moment(item).format('dddd'));

      const width = 1000; //px
      const height = 500; //px
      const backgroundColour = '#121212'; // Uses https://www.w3schools.com/tags/canvas_fillstyle.asp
      const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour});


      //create a new chartjs instance with all the data
      const config = {
        type: 'line',
        data: {
          labels: timestamp,
          datasets: [
            {
              label: 'Sell',
              data: sell,
              backgroundColor: '#ff0000',
              borderColor: '#ff0000',
              fill: false,
              borderWidth: 1
            },
            {
              label: 'Buy',
              data: buy,
              backgroundColor: '#00ff00',
              borderColor: '#00ff00',
              fill: false,
              borderWidth: 1
            }
          ]
        },
      }

      const info = await axios.get("https://api.slothpixel.me/api/skyblock/items")
      const infoData = info.data;

      //find the choiceItem in the infoData
      let item = infoData[choiceItem] || "Item not found"

      const embed = new Discord.MessageEmbed()
        .setTitle(`Bazaar History for ${choiceItem}`)
        .setColor("GOLD")
        .setDescription(`
        • __**Item Name**__: ${item.name || "No data recorded for this item"}
        • __**Item ID**__: ${choiceItem}
        • __**Number ID**__: ${item.item_id || "No data recorded for this item"}

        • __**Category**__: ${item.category || "No data recorded for this item"}
        • __**Tier**__: ${item.tier || "No data recorded for this item"}

        **Record About the item in the last 20 days**
        `)
        .setImage("attachment://welcome.png")

      const chart = new Discord.MessageAttachment(await chartJSNodeCanvas.renderToBuffer(config), `welcome.png`)

      message.channel.send({ embeds: [embed], files: [chart], });
    }
  }
}
