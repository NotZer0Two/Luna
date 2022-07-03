const Guild = require('../../database/schemas/Guild')
const Discord = require("discord.js")
const Canvas = require('canvas')

module.exports = {
  name: 'server',
  category: 'Economy',
  description: "Buy an item from the market",
  customPermission: "Guild_Server",
  aliases: [],

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
    const Guildraw = await Guild.findOne({
        Id: message.guild.id,
      })

      let i = 0

      const filter = (i) => i.user.id === message.author.id;

    if(!Guildraw) {
        return message.channel.send({ content: `❌ The server is not in the database run a command or re-run this one!`})
    }

    let choice = args[0]

    if(!choice) return message.channel.send({ content: `❌ Please select Status or Console!`})

    if(choice === "Status") {
        //check if the guildraw.ServerWar.offline is true or false if its true https://i.imgur.com/MJJBNuH.png use this one or else https://i.imgur.com/Q76leyS.png
        let imageStatus = ""

        if(Guildraw.ServerWar.offline === true) {
            imageStatus = "https://i.imgur.com/MJJBNuH.png"
        } else {
            imageStatus = "https://i.imgur.com/Q76leyS.png"
        }

        const embed = new Discord.MessageEmbed()
        .setTitle(`${message.guild.name} | Server Room`)
        .setDescription(`
        **Status:** ${Guildraw.ServerWar.offline === true ? "Offline" : "Online"}
        **Health:** ${Guildraw.ServerWar.Server.ServerHealth}
        **Bounty:** ${Guildraw.ServerWar.Server.Bounty}
        `)
        .setColor(Guildraw.ServerWar.offline === true ? "#bd1111" : "#1c913d")
        .setImage(imageStatus)

        const row = new Discord.MessageActionRow().addComponents(
            new Discord.MessageButton()
              .setCustomId('restart')
              .setLabel('Restart')
              //check if the automod is enabled or not and set the color
              .setStyle(Guildraw.ServerWar.offline ? 'DANGER' : 'SUCCESS')
              .setEmoji('🧑‍🔧'),
            new Discord.MessageButton()
              .setCustomId('shutdown')
              .setLabel('Shutdown')
              //check if the automod is enabled or not and set the color
              .setStyle(Guildraw.ServerWar.offline ? 'SUCCESS' : 'DANGER')
              .setEmoji('⏹️'),
          );

        const collector = message.channel.createMessageComponentCollector({
          filter,
          time: 30000,
        });

        const messagedisplay = await message.channel.send({ embeds: [embed], components: [row] })

        let iu = 0

        collector.on('collect', async (button) => {
            if (button.customId === 'restart') {
                button.deferUpdate()
                let health = 20


                Guildraw.ServerWar.offline = false
                //make the health to 20 foreach level up for *8
                while(iu < Guildraw.ServerWar.Server.ServerVersion) {
                    health = health * 8
                    iu++
                }
                
                Guildraw.ServerWar.Server.ServerHealth = health

                await Guildraw.save().then(status => {
                    message.channel.send({ content: `✅ The server is online now!`})

                    embed.setDescription(`
                    **Status:** ${Guildraw.ServerWar.offline === true ? "Offline" : "Online"}
                    **Health:** ${Guildraw.ServerWar.Server.ServerHealth}
                    **Bounty:** ${Guildraw.ServerWar.Server.Bounty}
                    `)
                    messagedisplay.edit({ embeds: [embed], components: [row] })
                })
            } else if(button.customId === 'shutdown') {
                button.deferUpdate()
                Guildraw.ServerWar.offline = true
                await Guildraw.save().then(status => {
                    message.channel.send({ content: `✅ The server is down now!`})

                    let imageServer = ""

                    if(Guildraw.ServerWar.offline === true) {
                        imageServer = "https://i.imgur.com/MJJBNuH.png"
                    } else {
                        imageServer = "https://i.imgur.com/Q76leyS.png"
                    }

                    embed.setDescription(`
                    **Status:** ${Guildraw.ServerWar.offline === true ? "Offline" : "Online"}
                    **Health:** ${Guildraw.ServerWar.Server.ServerHealth}
                    **Bounty:** ${Guildraw.ServerWar.Server.Bounty}
                    `)
                    embed.setColor(Guildraw.ServerWar.offline === true ? "#bd1111" : "#1c913d")
                    embed.setImage(imageServer)
                    messagedisplay.edit({ embeds: [embed], components: [row] })
                })
            }
        });
    } else if(choice === "Console") {
        if(Guildraw.ServerWar.offline === true) {
            return message.channel.send({ content: `❌ The server is offline restart it before use this command!`})
        }

        const embedConsole = new Discord.MessageEmbed()
        .setTitle(`${message.guild.name} | Console`)
        .setImage(`attachment://welcome.png`);
        
        const canvas = Canvas.createCanvas(700, 250);
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#080707';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const displayMessage = await message.channel.send({embeds: [embedConsole], files: [new Discord.MessageAttachment(canvas.toBuffer(), `console-${i}.png`)]})

        function BaseConsole() {
            ctx.fillStyle = '#080707';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
    
            //create a new text
            ctx.font = '28px Arial';
            ctx.fillStyle = '#2fcc41';
            //on the left add the text
            ctx.fillText(`${message.guild.name} | Server Room`, 10, 30);
            //under it add the text
            ctx.fillText(`Console`, 10, 60);
    
            //create a new text
            ctx.fillText(">", 10, 200)
            i++


        embedConsole.setImage(`attachment://console-${i}.png`);
        displayMessage.edit({ embeds: [embedConsole], files: [new Discord.MessageAttachment(canvas.toBuffer(), `console-${i}.png`)] })
        }

        BaseConsole()

        const collectorMSG = message.channel.createMessageCollector(filter);

        message.channel.send({ content: `> Welcome to the console you can type help to get the commands!`})
        collectorMSG.on('collect', async (collecting) => {
            //collect the text and see if it is help
            if(collecting.content === "help") {
                BaseConsole()

                i++

                ctx.font = '28px Arial';
                ctx.fillStyle = '#2fcc41';

                ctx.fillText(`- help | Get the command`, 10, 90);
                ctx.fillText(`- shutdown | shutdown the server`, 10, 120);
                ctx.fillText(`- track | Get the command`, 10, 160);

                displayMessage.removeAttachments()

                embedConsole.setImage(`attachment://console-${i}.png`);
                displayMessage.edit({ embeds: [embedConsole], files: [new Discord.MessageAttachment(canvas.toBuffer(), `console-${i}.png`)] })
            } else if(collecting.content === "shutdown") {
                BaseConsole()

                i++

                ctx.font = '28px Arial';
                ctx.fillStyle = '#2fcc41';

                ctx.fillText(`Shutdown the console, Goodbye!`, 10, 170);

                collectorMSG.stop()

                displayMessage.removeAttachments()

                embedConsole.setImage(`attachment://console-${i}.png`);
                displayMessage.edit({ embeds: [embedConsole], files: [new Discord.MessageAttachment(canvas.toBuffer(), `console-${i}.png`)] })
            } else if(collecting.content === "track") {
                BaseConsole()

                i++

                //make an ip generator that will be used on the image
                function ipGenerator() {
                    let ip = "";
                    for(let i = 0; i < 4; i++) {
                        ip += Math.floor(Math.random() * 255) + ".";
                    }
                    return ip.substring(0, ip.length - 1);
                }

                displayMessage.removeAttachments()

                let IP = ipGenerator()

                ctx.font = '28px Arial';
                ctx.fillStyle = '#2fcc41';

                ctx.fillText(`Traking Down the hacker`, 10, 90);
                ctx.fillText(`Hacker: ${Guildraw.ServerWar.Server.LatestHacker || "None hacked the server"} | Masked Idk?`, 10, 140);
                ctx.fillText(`Ip: ${IP}`, 10 , 170);

                displayMessage.removeAttachments()

                embedConsole.setImage(`attachment://console-${i}.png`);
                displayMessage.edit({ embeds: [embedConsole], files: [new Discord.MessageAttachment(canvas.toBuffer(), `console-${i}.png`)] })
            }
        })

    } 

    },    
}

