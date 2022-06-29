const { MessageAttachment, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
const Canvas = require('canvas');
const User = require('../../database/schemas/User')
const { generate } = require('../../Constructors/maze');

module.exports = {
  name: 'escape',
  category: 'Economy',
  description: "Escape from prison.",
  aliases: ['prisonescape'],

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args, user, guild) => {
    let usercoordinate = []
    let i = 0

    const userProfile = await User.findOne({
      Id: message.author.id,
    })


    if(!userProfile.economy.isPrisoner) {
      return message.channel.send({ content: `
    ❌ You are not in prison!
    `})
    }

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
  
      `})
    }

    //create an array map with x and y coordinates
    const map = [
      [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9, 0], [10, 0], [11, 0], [12, 0], [13, 0], [14, 0],
      [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1], [8, 1], [9, 1], [10, 1], [11, 1], [12, 1], [13, 1], [14, 1],
      [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2], [8, 2], [9, 2], [10, 2], [11, 2], [12, 2], [13, 2], [14, 2],
      [0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3], [8, 3], [9, 3], [10, 3], [11, 3], [12, 3], [13, 3], [14, 3],
      [0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4], [8, 4], [9, 4], [10, 4], [11, 4], [12, 4], [13, 4], [14, 4],
      [0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5], [7, 5], [8, 5], [9, 5], [10, 5], [11, 5], [12, 5], [13, 5], [14, 5],
      [0, 6], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6], [7, 6], [8, 6], [9, 6], [10, 6], [11, 6], [12, 6], [13, 6], [14, 6],
      [0, 7], [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7], [7, 7], [8, 7], [9, 7], [10, 7], [11, 7], [12, 7], [13, 7], [14, 7],
      [0, 8], [1, 8], [2, 8], [3, 8], [4, 8], [5, 8], [6, 8], [7, 8], [8, 8], [9, 8], [10, 8], [11, 8], [12, 8], [13, 8], [14, 8],
      [0, 9], [1, 9], [2, 9], [3, 9], [4, 9], [5, 9], [6, 9], [7, 9], [8, 9], [9, 9], [10, 9], [11, 9], [12, 9], [13, 9], [14, 9],
      [0, 10], [1, 10], [2, 10], [3, 10], [4, 10], [5, 10], [6, 10], [7, 10], [8, 10], [9, 10], [10, 10], [11, 10], [12, 10], [13, 10], [14, 10],
      [0, 11], [1, 11], [2, 11], [3, 11], [4, 11], [5, 11], [6, 11], [7, 11], [8, 11], [9, 11], [10, 11], [11, 11], [12, 11], [13, 11], [14, 11],
      [0, 12], [1, 12], [2, 12], [3, 12], [4, 12], [5, 12], [6, 12], [7, 12], [8, 12], [9, 12], [10, 12], [11, 12], [12, 12], [13, 12], [14, 12],
      [0, 13], [1, 13], [2, 13], [3, 13], [4, 13], [5, 13], [6, 13], [7, 13], [8, 13], [9, 13], [10, 13], [11, 13], [12, 13], [13, 13], [14, 13],
      [0, 14], [1, 14], [2, 14], [3, 14], [4, 14], [5, 14], [6, 14], [7, 14], [8, 14], [9, 14], [10, 14], [11, 14], [12, 14], [13, 14], [14, 14],
    ]

    const walls = [
    ]

    const maze = generate({ width: 14, height: 14 });

    for (let i = 0; i < maze.length; i++) {
      for (let j = 0; j < maze[i].length; j++) {
        if (maze[i][j] === 1) {
          walls.push([i, j])
        } else if (i == 0 && j == 0) return 
      }
    }

    //pick a random x and y from map without walls and check it
    let xs = map[Math.floor(Math.random() * map.length)][0]
    let ys = map[Math.floor(Math.random() * map.length)][1]
    if (walls.includes([xs, ys])) {
      xs = map[Math.floor(Math.random() * map.length)][0]
      ys = map[Math.floor(Math.random() * map.length)][1]
    }

    let xe = map[Math.floor(Math.random() * map.length)][0]
    let ye = map[Math.floor(Math.random() * map.length)][1]
    if (walls.includes([xe, ye])) {
      xe = map[Math.floor(Math.random() * map.length)][0]
      ye = map[Math.floor(Math.random() * map.length)][1]
    }

    if(xe == 14) {
      xe = 13
    } else if(ye == 14) {
      ye = 13
    }

    //create a canvas
    const canvas = Canvas.createCanvas(700, 700)
    const ctx = canvas.getContext('2d')

    //draw the map
    map.forEach(([x, y]) => {
      ctx.fillStyle = '#918f8a'
      ctx.fillRect(x * 50, y * 50, 50, 50)
    })

    walls.forEach(([x, y]) => {
      ctx.fillStyle = '#5e5c5b'
      ctx.fillRect(x * 50, y * 50, 50, 50)
    })

    //draw the exit zone
    ctx.fillStyle = 'green'
    ctx.fillRect(xe * 50, ye * 50, 50, 50)

    //create and embed
    const embed = new MessageEmbed()
      .setTitle('Prison Escape')
      .setDescription(`
      You are currently **Spawning**
        `)
      .setFooter('Escape from the prison')
      .setImage(`attachment://welcome.png`);

      const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('down')
					.setLabel('Down')
					.setStyle('SUCCESS'),
        new MessageButton()
					.setCustomId('left')
					.setLabel('Left')
					.setStyle('SUCCESS'),
        new MessageButton()
					.setCustomId('right')
					.setLabel('Right')
					.setStyle('SUCCESS'),
        new MessageButton()
					.setCustomId('up')
					.setLabel('Up')
					.setStyle('SUCCESS'),
        new MessageButton()
          .setCustomId('quit')
          .setLabel('Quit')
          .setStyle('DANGER'),
			);


    const displayMessage = await message.channel.send({ embeds: [embed], files: [new MessageAttachment(canvas.toBuffer(), `welcome.png`)], components: [row] })

    const filter = i => i.user.id === message.author.id;

    const collector = message.channel.createMessageComponentCollector({ filter, time: 600000 });

    //create the movement system
    const movement = (x, y) => {
      //check if the coordinate are undefined and NaN and push a new coordinate
      if (x == undefined || y == undefined || isNaN(x) || isNaN(y)) {
        x = map[Math.floor(Math.random() * map.length)][0]
        y = map[Math.floor(Math.random() * map.length)][1]

        console.log("Fixed")
      }

      if(y >= 14 || x >= 14 || x <= -1 || y <= -1) {
        return
      }

      console.log(x, y)
      console.log("Check " , x == NaN || y == undefined || x == undefined || y == NaN)

      if(walls.some(([wallsX, wallsY]) => wallsX === x && wallsY === y)) {
        if(x === xe && y === ye) {
                  //disable all buttons 
        row.components[0].setDisabled(true);
        row.components[1].setDisabled(true);
        row.components[2].setDisabled(true);
        row.components[3].setDisabled(true);
        row.components[4].setDisabled(true);

        //end the collection
        collector.stop();

        embed.setDescription(`**You escaped**`)

        ctx.fillStyle = "green";
        ctx.fillRect(0, 0, canvas.width, canvas.height);


        //write a text on the center
        ctx.font = "90px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("You escaped", canvas.width / 2, canvas.height / 2);
        ctx.fillText(`Move: ${i}` , canvas.width / 2, canvas.height / 2 + 80);
        } else {
          return
        }
      }

      //check for each walls if some of the coordinate are the same of the y or x

      if(y == ye && x == xe) {
        //disable all buttons 
        row.components[0].setDisabled(true);
        row.components[1].setDisabled(true);
        row.components[2].setDisabled(true);
        row.components[3].setDisabled(true);
        row.components[4].setDisabled(true);

        //end the collection
        collector.stop();

        embed.setDescription(`**You escaped**`)
        escaped = true;

        ctx.fillStyle = "green";
        ctx.fillRect(0, 0, canvas.width, canvas.height);


        //write a text on the center
        ctx.font = "90px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("You escaped", canvas.width / 2, canvas.height / 2);
        ctx.fillText(`Move: ${i}` , canvas.width / 2, canvas.height / 2 + 80);

        message.channel.send("> You escaped now you are free to go")
        userProfile.economy.isPrisoner = false;
  
        userProfile.save();
      } else {

        ctx.fillStyle = '#ffffff'
        ctx.fillRect(x * 50, y * 50, 50, 50)
  
        ctx.fillStyle = '#918f8a'
        ctx.fillRect(usercoordinate[0] * 50, usercoordinate[1] * 50, 50, 50)
      }
      //delete everything from the array and put the new coordinate
      usercoordinate = []
      usercoordinate = [x, y]
      //update i every time to make it +1
      i++

      displayMessage.removeAttachments()

      embed.setDescription(`
      You are currently at **${usercoordinate[0]}, ${usercoordinate[1]}**
      `)
      embed.setImage(`attachment://welcome-${i}.png`);
      displayMessage.edit({ embeds: [embed], files: [new MessageAttachment(canvas.toBuffer(), `welcome-${i}.png`)], components: [row] })
    }

    setTimeout(() => {
      movement(xs, ys)
    }, 1000)

  collector.on('collect', async button => {
	  if (button.customId === 'down') {
      button.deferUpdate()
		  movement(usercoordinate[0], usercoordinate[1] + 1)
	  } else if (button.customId === 'left') {
      button.deferUpdate()
		  movement(usercoordinate[0]- 1, usercoordinate[1])
	  } else if (button.customId === 'right') {
      button.deferUpdate()
		  movement(usercoordinate[0]+ 1, usercoordinate[1])
	  } else if (button.customId === 'up') {
      button.deferUpdate()
		  movement(usercoordinate[0], usercoordinate[1]- 1)
	  } else if (button.customId === 'quit') {
      button.deferUpdate()
      collector.stop()
      displayMessage.delete()
    }
});

  collector.on('end', async collected => {
    row.components[0].setDisabled(true);
    row.components[1].setDisabled(true);
    row.components[2].setDisabled(true);
    row.components[3].setDisabled(true);
    row.components[4].setDisabled(true);

  })

  },
}
