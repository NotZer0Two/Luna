const Guild = require('../../database/schemas/Guild');
const User = require('../../database/schemas/User');
const Discord = require('discord.js');

module.exports = {
  name: 'partnersetup',
  category: 'moderation',
<<<<<<< HEAD
  description: 'Moderation Commands',
=======
  description: 'Setup Partner for your server (ONLY PARTNER WITH BADGE)',
>>>>>>> Massive Update
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

    //check if the owner of the server has the partner badge
    const OwnerProfile = await User.findOne({
        Id: message.guild.ownerId,
    });

    if (!OwnerProfile) {
        return message.channel.send({
            content: `
      ❌ I can't find the owner on the Database!
        `,
        });
    }

    const badge = Math.max(...OwnerProfile.profile.badges);
    if(badge < 3 || badge == undefined) {
        return message.channel.send({
            content: `
      ❌ The owner of this Server needs to have the Partner Badge!
        `,
        });
    }

    const guildraw = await Guild.findOne({
        Id: message.guild.id,
      });
  
      if (!guildraw) {
        return message.channel.send(
          "❌ I can't find your Guild in my Database! trying using another command will fix the issues!",
        );
      }

      if (!message.member.permissions.has('MANAGE_GUILD')) {
        return message.channel.send(
          `You need the \`MANAGE_GUILD\` Permission to use this Command!`,
        );
      }

      const embed = new Discord.MessageEmbed()
      .setTitle('📬 Setup Partner')
      .setColor('#a1131d')
      .setDescription(`Thanks for be our partner and with this simple menu you can setup up our bump system for partner server`)
      .setFooter(`Requested by ${message.author.tag}`)
      .setTimestamp();

      const row = new Discord.MessageActionRow().addComponents(
        new Discord.MessageButton()
          .setCustomId('description')
          .setLabel('Description')
          //check if the automod is enabled or not and set the color
          .setStyle("SUCCESS")
          .setEmoji('📝'),

          new Discord.MessageButton()
          .setCustomId('invite')
          .setLabel('Invite')
          //check if the automod is enabled or not and set the color
          .setStyle("SUCCESS")
          .setEmoji('📝'),

          new Discord.MessageButton()
          .setCustomId('color')
          .setLabel('Color')
          //check if the automod is enabled or not and set the color
          .setStyle("SUCCESS")
          .setEmoji('🌈'),

          new Discord.MessageButton()
          .setCustomId('banner')
          .setLabel('Banner')
          //check if the automod is enabled or not and set the color
          .setStyle("SUCCESS")
          .setEmoji('🤳'),
  
      );
  
      const filter = (i) => i.user.id === message.author.id;
  
      const collector = message.channel.createMessageComponentCollector({
        filter, time: 30000 
      });
  
      let displaymessage = await message.channel.send({ embeds: [embed], components: [row] });
  
      collector.on('collect', async (button) => {
          if(button.customId == "description") {
              if(guildraw.partner.partnerAC == false) guildraw.partner.partnerAC = true
              message.channel.send("> Please enter the new description").then(async uwu => {
                const collector2 = await message.channel.createMessageCollector(filter, { time: 15000 });
              collector2.on('collect', async (collecting) => {
                console.log(collecting.content);
                  guildraw.partner.description = collecting.content;
                  
                  const user = await client.users.fetch(message.author.id);

                  await guildraw.save().then(() => {
                    client.modlogs({
                        MemberTag: user.tag,
                        MemberID: user.id,
                        MemberDisplayURL: user.displayAvatarURL(),
                        Action: `New Description ${collecting.content}`,
                        Color: "GREEN",
                        Reason: "Changed Description",
                        ModeratorTag: user.tag,
                        ModeratorID: user.id,
                        ModeratorDisplayURL: user.displayAvatarURL(),
                      }, collecting )
                    collector2.stop();
                });
              })
              })
          } else if(button.customId == "invite") {
            
            if(guildraw.partner.partnerAC == false) guildraw.partner.partnerAC = true
            message.channel.send("> Please enter the channel for the preview").then(async uwu => {
            const collector2 = message.channel.createMessageCollector(filter, { time: 15000 });
            collector2.on('collect', async (collecting) => {
                if (collecting.mentions.channels.first()) {
                    guildraw.partner.channel = collecting.mentions.channels.first().id;
                    guildraw.partner.invite = await client.channels.cache.get(collecting.mentions.channels.first().id).createInvite({ maxAge: 0, maxUses: 0 });

                
                const user = await client.users.fetch(message.author.id);

                await guildraw.save().then(() => {
                  client.modlogs({
                      MemberTag: user.tag,
                      MemberID: user.id,
                      MemberDisplayURL: user.displayAvatarURL(),
                      Action: `New Channel <#${collecting.mentions.channels.first().id}>`,
                      Color: "GREEN",
                      Reason: "Changed Channel Partner",
                      ModeratorTag: user.tag,
                      ModeratorID: user.id,
                      ModeratorDisplayURL: user.displayAvatarURL(),
                    }, collecting )
                  collector2.stop();
              });
            }
            })
            })
          } else if(button.customId == "color") {
            
            if(guildraw.partner.partnerAC == false) guildraw.partner.partnerAC = true
            message.channel.send("> Please enter the new color").then(async uwu => {
            const collector2 = message.channel.createMessageCollector(filter, { time: 15000 });
            collector2.on('collect', async (collecting) => {
                //check if collecting contain #
                if(!collecting.startsWith('#')) message.channel.send("> This color is not valid you can use only Hex Color")
                
                const user = await client.users.fetch(message.author.id);

                guildraw.partner.color = collecting;

                await guildraw.save().then(() => {
                  client.modlogs({
                      MemberTag: user.tag,
                      MemberID: user.id,
                      MemberDisplayURL: user.displayAvatarURL(),
                      Action: `New Color ${collecting}`,
                      Color: "GREEN",
                      Reason: "Changed Color",
                      ModeratorTag: user.tag,
                      ModeratorID: user.id,
                      ModeratorDisplayURL: user.displayAvatarURL(),
                    }, collecting )
                  collector2.stop();
              });
            })
            })
          } else if(button.customId == "banner") {
            
            if(guildraw.partner.partnerAC == false) guildraw.partner.partnerAC = true
            message.channel.send("> Please enter the new banner").then(async uwu => {
            const collector2 = message.channel.createMessageCollector(filter, { time: 15000 });
            collector2.on('collect', async (collecting) => {
                //how i can write i
                if(!collecting.content.split(" ").includes("i.imgur.com")) message.channel.send("> This url is not valid you can only input from raw imgur image upload it there")
                
                const user = await client.users.fetch(message.author.id);

                guildraw.partner.banner = collecting;

                await guildraw.save().then(() => {
                  client.modlogs({
                      MemberTag: user.tag,
                      MemberID: user.id,
                      MemberDisplayURL: user.displayAvatarURL(),
                      Action: `New Banner ${collecting}`,
                      Color: "GREEN",
                      Reason: "Changed banner",
                      ModeratorTag: user.tag,
                      ModeratorID: user.id,
                      ModeratorDisplayURL: user.displayAvatarURL(),
                    }, collecting )
                  collector2.stop();
              });
            })
            })
          }
      })

      collector.on("end", collected => {
        row.components[0].setDisabled(true);
        row.components[1].setDisabled(true);
        row.components[2].setDisabled(true);
        row.components[3].setDisabled(true);

      //make the embed component update
        displaymessage.edit({ components: [row] });
      })
    },
  }