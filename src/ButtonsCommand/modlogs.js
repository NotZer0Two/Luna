const Guild = require('../database/schemas/Guild');

module.exports = {
    name : 'modlogs',
    run : async(client, interaction, container) => {

        const filter = (i) => i.user.id === interaction.user.id;

        if(!interaction.member.permissions.has('MANAGE_GUILD')) {
          return interaction.channel.send(await client.translate("> You don't have permission to use this command", interaction.guild.id));
        }

        const guildraw = await Guild.findOne({
            Id: interaction.guild.id,
          });
        //check if its enabled or not and then change it on the database and change color
        if (guildraw.feature.Modlogs.enable) {
          guildraw.feature.Modlogs.enable = false;
          guildraw.feature.Modlogs.channel = null;

          interaction.message.components[0].components[1].setStyle("DANGER")
          interaction.update({ components: interaction.message.components })


          await guildraw.save();
        } else {

          interaction.message.components[0].components[0].setStyle("SUCCESS")
          interaction.update({ components: interaction.message.components })

          const collector2 = interaction.channel.createMessageCollector(filter, { time: 15000 });

          interaction.channel.send(await client.translate("> Please enter the channel you want to use for ModLogs", interaction.guild.id));

          collector2.on('collect', async (collecting) => {
            //wait for the user to enter the channel and then check if its a channel or not and save everything
            if (collecting.mentions.channels.first()) {
              guildraw.feature.Modlogs.enable = true;
              guildraw.feature.Modlogs.channel = collecting.mentions.channels.first().id;

              //getting who made the command
              const user = await client.users.fetch(interaction.user.id);

              await guildraw.save().then(async () => {
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
                }, interaction)

                interaction.channel.send({ content: `${await client.translate(`> Thanks for using our system, your modlog channel is in ${collecting.mentions.channels.first().name}`, interaction.guild.id)}` });

                collector2.stop();
              });

              await guildraw.save();
            }
          })

        }
    }
}