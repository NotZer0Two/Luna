const Guild = require('../database/schemas/Guild');

module.exports = {
    name : 'welcome',
    run : async(client, interaction, container) => {
      const filter = (i) => i.user.id === interaction.user.id;

        const guildraw = await Guild.findOne({
          Id: interaction.guild.id,
        });

        if (guildraw.feature.welcome.enable) {
          guildraw.feature.welcome.enable = false;
          guildraw.feature.welcome.channel = null;
          guildraw.feature.welcome.type = null;
          guildraw.feature.welcome.message = null;

          interaction.message.components[0].components[3].setStyle("DANGER")
          interaction.update({ components: interaction.message.components })

          await guildraw.save()
        } else {
          guildraw.feature.welcome.enable = true;

          interaction.message.components[0].components[3].setStyle("SUCCESS")
          interaction.update({ components: interaction.message.components })

          interaction.channel.send("> Please enter the channel you want to use as Welcome channel");
  
          const collector2 = interaction.channel.createMessageCollector(filter, { time: 15000 });
  
          collector2.on('collect', async (collecting) => {
            //wait for the user to enter the channel and then check if its a channel or not and save everything
            if (collecting.mentions.channels.first()) {
              guildraw.feature.welcome.enable = true;
              guildraw.feature.welcome.channel = collecting.mentions.channels.first().id;
  
              //getting who made the command
              const user = await client.users.fetch(interaction.user.id);
  
              guildraw.feature.welcome.channel = collecting.mentions.channels.first().id;
  
              await guildraw.save().then(() => {
                client.modlogs({
                  MemberTag: user.tag,
                  MemberID: user.id,
                  MemberDisplayURL: user.displayAvatarURL(),
                  Action: `Setup Welcome Channel`,
                  Color: "GREEN",
                  Reason: "Command Execution",
                  ModeratorTag: client.user.tag,
                  ModeratorID: client.user.id,
                  ModeratorDisplayURL: client.user.displayAvatarURL(),
                }, collecting)
  
                interaction.channel.send("> Enter the type of welcome message you want to use (PaperPlease, Message, Embed)");
                const collector3 = interaction.channel.createMessageCollector(filter, { time: 15000 });
                collector3.on('collect', async (collecting2) => {
                  if(collecting2.content == "PaperPlease") {
                    guildraw.feature.welcome.type = "PaperPlease";
                    guildraw.feature.welcome.message = null;
  
                    await guildraw.save()
  
                    collector3.stop();
                    collector2.stop();

                    interaction.channel.send("> Thanks for using our system, your welcome message is in " + collecting.mentions.channels.first().name)
                  } else if(collecting2.content == "Message") {
                    interaction.channel.send("> Enter the text you want use for the message join ({MentionJoined}, {FullNameJoined}, {UsernameJoined}, {JoinedID})")
                    guildraw.feature.welcome.type = "Message";
                    const collector4 = interaction.channel.createMessageCollector(filter, { time: 15000 });
                    collector4.on('collect', async (collecting4) => {
                      if(collecting4.author.bot) return;
                      guildraw.feature.welcome.message = collecting4.content;
                      await guildraw.save();
                      interaction.channel.send("> Thanks for using our system, your welcome message is in " + collecting.mentions.channels.first().name)
                      collector4.stop();
                      collector3.stop();
                      collector2.stop();
                      await guildraw.save()
                    })
                  } else if(collecting2.content == "Embed") {
                    guildraw.feature.welcome.type = "Embed";
                    interaction.channel.send("> Enter the embed you want use for the message join ({MentionJoined}, {FullNameJoined}, {UsernameJoined}, {JoinedID})");
                    const collector4 = interaction.channel.createMessageCollector(filter, { time: 15000 });
                    collector4.on('collect', async (collecting4) => {
                      if(collecting4.author.bot) return;
                      guildraw.feature.welcome.message = collecting4.content;
                      await guildraw.save();
                      interaction.channel.send("> Thanks for using our system, your welcome message is in " + collecting.mentions.channels.first().name)
                      collector4.stop();
                      collector3.stop();
                      collector2.stop();
                      await guildraw.save()
                    })
                  }
                })
              });
  
              await guildraw.save();
            }
          })
        }
    }
}