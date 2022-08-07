const { Discord, MessageEmbed, MessageAttachment } = require('discord.js')
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

module.exports = {
  name: 'serverstatistic',
  category: '📚 Utility',
  aliases: ['serverstat', 'serverinfo', 'serverstats', "sstastic"],
  description: "Sends you Luna's support server link.",

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
      return message.channel.send({
        content: `
      ❌ I require some Permissions!

      **I need the following Permissions to work on your Server:**
      EMBED_LINKS,
      ADD_REACTIONS, 
      SEND_MESSAGES, 
      READ_MESSAGE_HISTORY,
      VIEW_CHANNEL

      ⚠️ Please add me the right Permissions and re-run this Command!
  
      `,
      })
    }

    if (!message.member.permissions.has('MANAGE_GUILD')) {
      return message.channel.send(
        `You need the \`MANAGE_GUILD\` Permission to use this Command!`,
      );
    }

    const width = 1000; //px
    const height = 500; //px
    const backgroundColour = '#121212'; // Uses https://www.w3schools.com/tags/canvas_fillstyle.asp
    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour});

    //get from the cache the user joined in the month and display them on the chart
    const joinedThisMonth = message.guild.members.cache.filter(member => {
      return member.joinedAt.getMonth() === new Date().getMonth()
    }).size
    const joinedThisYear = message.guild.members.cache.filter(member => {
      return member.joinedAt.getFullYear() === new Date().getFullYear()
    }
    ).size
    const joinedAllTime = message.guild.members.cache.size
    const joinedThisMonthPercentage = (joinedThisMonth / joinedAllTime) * 100
    const joinedThisYearPercentage = (joinedThisYear / joinedAllTime) * 100
    const joinedAllTimePercentage = (joinedAllTime / joinedAllTime) * 100

    //check the bot percentage and quantity
    const botThisMonth = message.guild.members.cache.filter(member => {
      return member.user.bot && member.joinedAt.getMonth() === new Date().getMonth()
    }).size

    const botThisYear = message.guild.members.cache.filter(member => {
      return member.user.bot && member.joinedAt.getFullYear() === new Date().getFullYear()
    }).size

    const botAllTime = message.guild.members.cache.filter(member => {
      return member.user.bot
    }).size

    const botThisMonthPercentage = (botThisMonth / joinedThisMonth) * 100
    const botThisYearPercentage = (botThisYear / joinedThisYear) * 100
    const botAllTimePercentage = (botAllTime / joinedAllTime) * 100

    //create the config chart line
    const config = {
      type: 'line',
      data: {
        labels: ['This Month', 'This Year', 'All Time'],
        datasets: [
          {
            label: await client.translate('Joined Users', message.guild.id),
            data: [joinedThisMonth, joinedThisYear, joinedAllTime],
            backgroundColor: '#00ff00',
            borderColor: '#00ff00',
            fill: false,
            borderWidth: 1
          },
          {
            label: await client.translate('Joined Bot', message.guild.id),
            data: [botThisMonth, botThisYear, botAllTime],
            backgroundColor: '#831791',
            borderColor: '#831791',
            fill: false,
            borderWidth: 1
          }
        ]
      },
    }


    //create the embed
    const embed = new MessageEmbed()
      .setTitle(await client.translate('Server Statistics', message.guild.id))
      .setColor('RANDOM')
      .setDescription(await client.translate(`
      **Joined This Month:** ${joinedThisMonth + botThisMonth} | Users Percentage (${joinedThisMonthPercentage.toFixed(2)}%)
      **Joined This Year:** ${joinedThisYear} | Users Percentage (${joinedThisYearPercentage.toFixed(2)}%)
      **Joined All Time:** ${joinedAllTime} | Users Percentage (${joinedAllTimePercentage.toFixed(2)}%)
      `, message.guild.id))
      .setImage("attachment://welcome.png")

      const chart = new MessageAttachment(await chartJSNodeCanvas.renderToBuffer(config), `welcome.png`)

      message.channel.send({ embeds: [embed], files: [chart], });
  },
}
