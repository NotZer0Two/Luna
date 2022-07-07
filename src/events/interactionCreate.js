const client = require('../index');
const {
  Discord,
  MessageEmbed,
  Guild,
  MessageActionRow,
  MessageButton,
  MessageAttachment,
} = require('discord.js');
const User = require('../database/schemas/User');
const Canvas = require('canvas');
<<<<<<< HEAD
=======
const { createTranscript } = require("discord-html-transcripts")
const {loadbuttons} = require("../helpers/loadbuttons");
>>>>>>> Massive Update


try {
  client.on('interactionCreate', async (interaction) => {
<<<<<<< HEAD
=======
    if(interaction.isButton()) loadbuttons(client, interaction, client.buttonCommands.get(interaction.customId));

>>>>>>> Massive Update
    if (interaction.customId === 'yeswallet') {
      const updatedEmbed = new MessageEmbed(
        interaction.message.embeds[0],
      ).setTitle(`Wallet Created.`);
      const updatedRow = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId('yeswallet')
          .setLabel('Accept')
          .setEmoji('✅')
          .setStyle('SUCCESS')
          .setDisabled(),
        new MessageButton()
          .setCustomId('nowallet')
          .setLabel('Deny')
          .setEmoji('❌')
          .setStyle('DANGER')
          .setDisabled(),
      );

      const userProfile = await User.findOne({
        Id: interaction.user.id,
      });

      userProfile.economy.wallet = 100;
      return userProfile.save().then(() => {
        interaction.update({
          embeds: [updatedEmbed],
          components: [updatedRow],
        });
      });
    } else if (interaction.customId === 'nowallet') {
      await interaction.message.delete();
      interaction.message.channel.send({
        content: ` Wallet Creation Canceled`,
      });
    }

<<<<<<< HEAD
=======
    if (interaction.customId === "ticket-open") {
      await interaction.deferReply({ ephemeral: true }) 
      if(interaction.guild.channels.cache.find(e => e.topic == interaction.user.id)) {
          return interaction.followUp({
              content: "*Bakaa~* You already have a ticket open!",
              ephemeral: true
     })
      }

      const channelMade = interaction.guild.channels.create(`${interaction.user.tag} Ticket`, {
          topic: interaction.user.id,
          permissionOverwrites: [{
              id: interaction.user.id,
              allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
          }, {
              id: client.user.id,
              allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
          }, {
              id: interaction.guild.id,
              deny: ["SEND_MESSAGES", "VIEW_CHANNEL"]
          }],
          type: "GUILD_TEXT"}).then(async c => {interaction.followUp({embeds: [new MessageEmbed()
      .setColor("PURPLE")
      .setDescription(`<@${interaction.user.id}> You have made a ticket.`)
      .setThumbnail(`${interaction.user.displayAvatarURL({ dynamic: true, size: 512 })}`)
      .setAuthor({ name: "Your ticket has been made!", iconURL: `${client.user.displayAvatarURL()}`})
      ], ephemeral: true})
      const newtic = new MessageEmbed()
      .setColor("PURPLE")
      .setAuthor({ name: `${interaction.guild.name} support!`, iconURL: `${interaction.guild.iconURL({ dynamic: true, size: 512 }) || "https://cdn.discordapp.com/embed/avatars/0.png"}`})
      .setFooter({ text: "Your ticket will be recorded in a transcript", iconURL: `${interaction.user.displayAvatarURL()}`})
      .setDescription('Hello there, \n The staff will be here as soon as possible mean while tell us about your issue!\nThank You!')
      .addField("To Create A Transcript:", "By pressing on the green button labbeld `Claiming` the channels transcript will be sent here.\n When this ticket is closed too, a copy of this tickets Transcript will be kept also.")
        
      let button1 = new MessageButton()
          .setCustomId("ticket-close")
          .setLabel("Close Ticket")
          .setEmoji("🔒")
          .setStyle("DANGER")

           let button2 =  new MessageButton()
              .setCustomId("Transcript")
              .setLabel("Claim")
              .setStyle("SUCCESS")

              let button3 = new MessageButton()
              .setCustomId("zing")
              .setDisabled(true)
              .setEmoji("🕰️")
              .setStyle("SECONDARY")

              let button4 = new MessageButton()
              .setCustomId("Lock")
              .setLabel("Archieve Ticket")
              .setStyle("DANGER")

              let button5 = new MessageButton()
              .setCustomId("Unlock")
              .setLabel("Un-Archieve Ticket")
              .setStyle("PRIMARY")


              const row = new MessageActionRow()
               .addComponents(button1, button2, button3, button4, button5)
      
      c.send({
          content: `<@${interaction.user.id}>`,
          embeds: [newtic], 
          components: [row]
      }).then(msg => msg.pin())
  })

  } else if(interaction.customId === "ticket-close" ) {
    interaction.member = interaction.guild.members.cache.get(interaction.user.id);

    if(!interaction.member.permissions.has(["MODERATE_MEMBERS"]) && !interaction.user.id === interaction.guild.ownerID) {
          interaction.reply({ content: "You do not have permissiont to close the ticket! (MODERATE_MEMBERS)", ephemeral: true})
      } else {
          
      interaction.reply({content: `Closing ticket in 3 Seconds`})
      if(((interaction.channel.topic === interaction.user.id)) === interaction.user.id && interaction.user.hasPermission("MODERATE_MEMBERS") !== interaction.user.id) {
          return interaction.followUp({
              content: `This ticket can only be closed by staff members.`,
              ephemeral: true
          })
      }
      const Trasnscript = await createTranscript(interaction.channel, {
          limit: -1,
          fileName: `${interaction.channel.topic}-Ticket-Transcript.html`,
          returnBuffer: false
      });

      interaction.channel.send({ content: `<@${interaction.user.id}>'s Ticket has been closed` })

      client.modlogs({
        MemberTag: interaction.user.tag,
        MemberID: interaction.user.id,
        MemberDisplayURL: interaction.user.displayAvatarURL(),
        Action: `Ticket closed`,
        Color: "RED",
        Reason: `Ticket closed: Transcript report`,
        ModeratorTag: client.user.tag,
        ModeratorID: client.user.id,
        ModeratorDisplayURL: client.user.displayAvatarURL(),
        Attachments: Trasnscript
      }, interaction)
setTimeout(() => {
 interaction.channel.delete()
}, 3000)
      }

  } else if(interaction.customId === 'Transcript') {

      const Trasnscript = await createTranscript(interaction.channel, {
          limit: -1,
          fileName: `${interaction.channel.topic}-Ticket-Transcript.html`,
          returnBuffer: false
      });

      interaction.reply({ content: `Here is the tickets Transcript! <@${interaction.user.id}>`, files: [Trasnscript]})
  } else if(interaction.customId === 'Lock') {
    interaction.member = interaction.guild.members.cache.get(interaction.user.id);

    if(!interaction.member.permissions.has(["MODERATE_MEMBERS"]) && !interaction.user.id === interaction.guild.ownerID) {
      console.log("Test1")
          interaction.reply({ content: "You do not have permissiont to lock the ticket! (MODERATE_MEMBERS)", ephemeral: true})
      } else {
          console.log("Test2")
          interaction.channel.permissionOverwrites[{
              id: interaction.user.id,
              deny: ["SEND_MESSAGES", "VIEW_CHANNEL"]
          }, {
              id: client.user.id,
              allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
          }, {
          }, {
              id: interaction.guild.id,
              deny: ["SEND_MESSAGES", "VIEW_CHANNEL"]
          }]

          interaction.reply({ content: `<@${interaction.user.id}> locked the channel for review`, ephemeral: true })

      }
  } else if(interaction.customId == 'Unlock') {
    interaction.member = interaction.guild.members.cache.get(interaction.user.id);

    if(!interaction.member.permissions.has(["MODERATE_MEMBERS"]) && !interaction.user.id === interaction.guild.ownerID) {
      interaction.reply({ content: "You do not have permissiont to unlock the ticket! (MODERATE_MEMBERS)", ephemeral: true})
      } else {
          interaction.channel.permissionOverwrites[{
              id: interaction.user.id,
              allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
          }, {
              id: client.user.id,
              allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
          }, {
              id: interaction.guild.id,
              deny: ["SEND_MESSAGES", "VIEW_CHANNEL"]
          }]
          
          interaction.reply({ content: `<@${interaction.user.id}> un-archived the channel`, ephemeral: true })
      }
  }

>>>>>>> Massive Update
    if (interaction.isModalSubmit()) {

      const input = interaction.fields.getTextInputValue('wordleWord');
      if (input) {
        let options = {
          yellow: `🟨`,
          grey: `⬜`,
          green: `🟩`,
          black: `⬛`,
        };
        let guess = input.toLowerCase();

        var result = '';
        let row = interaction?.message?.components;
        let solution = row[0]?.components[0]?.customId?.slice(0, 5);
        var tries = row[0]?.components[0]?.customId?.slice(5, 6);

        for (let i = 0; i < guess.length; i++) {
          let guessLetter = guess?.charAt(i);
          let solutionLetter = solution?.charAt(i);
          if (guessLetter === solutionLetter) {
            result = result.concat(options.green);
          } else if (solution?.indexOf(guessLetter) != -1) {
            result = result.concat(options.yellow);
          } else {
            result = result.concat(options.grey);
          }
        }

        var embeddesk = interaction?.message?.embeds[0]?.description;
        embeddesk = JSON.stringify(embeddesk.split('\n'));
        const gamedesc = JSON.parse(embeddesk);

        var game = interaction?.message?.embeds[0];

        if (result === '🟩🟩🟩🟩🟩') {
          gamedesc[tries] = `${result} - ${guess}`;
          await interaction
            .update({ embeds: [game.setDescription(gamedesc.join('\n'))] })
            .catch((err) => {});

            const userProfile = await User.findOne({
                Id: interaction.user.id,
              });

            if(userProfile.minigames.wordle == false) {
            
          await interaction.reply({
            content: `You Got The Correct Word Now you have +1k`,
            ephemeral: true,
          });

          userProfile.economy.wallet = userProfile.economy.wallet + 1000;
          userProfile.minigames.wordle = true;
          userProfile.save().catch((err) => {});
        }
        } else if (Number(tries) === 6 || Number(tries) + 1 === 5) {
            await interaction.reply({
                content: `You got the word wrong. The word was ${solution}`,
                ephemeral: true,
            })
        } else {
          gamedesc[tries] = `${result} - ${guess}`;
          if (!row[0]?.components[0]) return;
          row[0].components[0].customId = `${solution}${Number(tries) + 1}`;
          await interaction
            .update({
              components: row,
              embeds: [game.setDescription(gamedesc.join('\n'))],
            })
            .catch((err) => {});
        }
      }
    }
  });
} catch (error) {
  console.log(error);
}
