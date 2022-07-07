const Discord = require('discord.js');
const Guild = require('../../database/schemas/Guild');

module.exports = {
  name: 'setup',
  category: 'moderation',
  description: 'Moderation Commands',
  aliases: [],

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args, user, guild) => {
    if (!message.guild.me.permissions.has('SEND_MESSAGES')) return;
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
      });
    }

    //check if the user have Manage Guild
    if (!message.member.permissions.has('MANAGE_GUILD')) {
      return message.channel.send(
        `You need the \`MANAGE_GUILD\` Permission to use this Command!`,
      );
    }

    const guildraw = await Guild.findOne({
      Id: message.guild.id,
    });

    if (!guildraw) {
      return message.channel.send(
        "❌ I can't find your Guild in my Database! trying using another command will fix the issues!",
      );
    }

<<<<<<< HEAD
=======

    /*Fixing the issues for the double commands and crash*/
    const random = Math.floor(Math.random() * 300) + 1;


>>>>>>> Massive Update
    const embed = new Discord.MessageEmbed()
      .setTitle('📬 Setup Moderation Commands')
      .setColor('#a1131d')
      .setDescription(`Welcome to the Setup Command!`)
<<<<<<< HEAD
      //for eache feature and make in small the text after |
      .addField('Automod', "Ai moderation")
=======
>>>>>>> Massive Update
      .setFooter(`Requested by ${message.author.tag}`)
      .setTimestamp();

    const row = new Discord.MessageActionRow().addComponents(
      new Discord.MessageButton()
        .setCustomId('automod')
        .setLabel('Automod')
        //check if the automod is enabled or not and set the color
        .setStyle(guildraw.feature.Automod ? 'SUCCESS' : 'DANGER')
        .setEmoji('🤬'),

<<<<<<< HEAD
        new Discord.MessageButton()
=======
      new Discord.MessageButton()
>>>>>>> Massive Update
        .setCustomId('modlogs')
        .setLabel('ModLogs')
        //check if the automod is enabled or not and set the color
        .setStyle(guildraw.feature.Modlogs.enable ? 'SUCCESS' : 'DANGER')
        .setEmoji('📝'),
<<<<<<< HEAD
=======

      new Discord.MessageButton()
        .setCustomId('ticket')
        .setLabel('Ticket')
        //check if the automod is enabled or not and set the color
        .setStyle("SECONDARY")
        .setEmoji('🎫'),

      new Discord.MessageButton()
        .setCustomId('welcome')
        .setLabel('Welcome')
        //check if the automod is enabled or not and set the color
        .setStyle(guildraw.feature.welcome.enable ? 'SUCCESS' : 'DANGER')
        .setEmoji('🎉'),
>>>>>>> Massive Update
    );

    const filter = (i) => i.user.id === message.author.id;

<<<<<<< HEAD
    const collector = message.channel.createMessageComponentCollector({
      filter, time: 30000 
    });

    let displaymessage = await message.channel.send({ embeds: [embed], components: [row] });

    collector.on('collect', async (button) => {
      if (button.customId === 'automod') {
        //check if its enabled or not and then change it on the database and change color
        if (guildraw.feature.Automod) {
          guildraw.feature.Automod = false;

          await guildraw.save();

          row.components[0].setStyle('DANGER');
          row.components[0].setDisabled(true);

          button.update({
            components: [row]
            })
        } else {
          guildraw.feature.Automod = true;

          await guildraw.save();

          row.components[0].setStyle('SUCCESS');
          row.components[0].setDisabled(true);

          button.update({
            components: [row]
            })
        }

        return collector.stop();
      } else if (button.customId === 'modlogs') {
        //check if its enabled or not and then change it on the database and change color
        if (guildraw.feature.Modlogs.enable) {
          guildraw.feature.Modlogs.enable = false;
          guildraw.feature.Modlogs.channel = null;

          row.components[1].setStyle('DANGER');
          row.components[1].setDisabled(true);

            button.update({
                components: [row]
            })

            await guildraw.save();
        } else {

          row.components[1].setStyle('SUCCESS');
          row.components[1].setDisabled(true);

          button.update({
            components: [row]
            })
            const collector2 = message.channel.createMessageCollector(filter, { time: 15000 });

            message.channel.send("> Please enter the channel you want to use for ModLogs");

            collector2.on('collect', async (collecting) => {
                //wait for the user to enter the channel and then check if its a channel or not and save everything
                if (collecting.mentions.channels.first()) {
                    guildraw.feature.Modlogs.enable = true;
                    guildraw.feature.Modlogs.channel = collecting.mentions.channels.first().id;

                    //getting who made the command
                    const user = await client.users.fetch(message.author.id);

                    await guildraw.save().then(() => {
                        client.modlogs({
                            MemberTag: user.tag,
                            MemberID: user.id,
                            MemberDisplayURL: user.displayAvatarURL(),
                            Action: `Changed ModLogs Channel`,
                            Color: "GREEN",
                            Reason: "Command Execution",
                            ModeratorTag: client.user.tag,
                            ModeratorID: client.user.id,
                            ModeratorDisplayURL: client.user.displayAvatarURL(),
                          }, collecting )
                        collector2.stop();
                    });
                }

                await guildraw.save();
            })

        }

        return collector.stop();
      }
    });

    collector.on("end", collected => {
      row.components[0].setDisabled(true);
      row.components[1].setDisabled(true);

    //console log hello world
      displaymessage.edit({ components: [row] });
    })
  },
};
=======
    let displaymessage = await message.channel.send({ embeds: [embed], components: [row] });
  },
}
>>>>>>> Massive Update
