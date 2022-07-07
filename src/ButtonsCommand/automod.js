const Guild = require('../database/schemas/Guild');

module.exports = {
    name : 'automod',
    run : async(client, interaction, container) => {

        const filter = (i) => i.user.id === interaction.user.id;

        const guildraw = await Guild.findOne({
            Id: interaction.guild.id,
          });
        //check if its enabled or not and then change it on the database and change color
        if (guildraw.feature.Automod) {
            guildraw.feature.Automod = false;
  
            //update the row 
            interaction.message.components[0].components[0].setStyle("DANGER")
            interaction.update({ components: interaction.message.components })

            await guildraw.save();
  
          } else {
            const collector2 = interaction.channel.createMessageCollector(filter, { time: 15000 });
  
            interaction.channel.send("> Please enter a number for the automod score (we recommend 0.5)");
  
            collector2.on('collect', async (collecting) => {
              //check if the message is a number or not
              if (isNaN(collecting.content)) return;

              let score = collecting.content || 0.5
  
              guildraw.feature.Automod = true;
              guildraw.feature.Automod_score = score;
  
              const user = await client.users.fetch(interaction.user.id);
  
              await guildraw.save().then(() => {
                client.modlogs({
                  MemberTag: user.tag,
                  MemberID: user.id,
                  MemberDisplayURL: user.displayAvatarURL(),
                  Action: `Setup Automod`,
                  Color: "GREEN",
                  Reason: "Command Execution",
                  ModeratorTag: client.user.tag,
                  ModeratorID: client.user.id,
                  ModeratorDisplayURL: client.user.displayAvatarURL(),
                }, interaction)
  
                interaction.channel.send("> Thanks for using our system you setup the score to " + score)
  
                collector2.stop();
              });
            })

            interaction.message.components[0].components[0].setStyle("SUCCESS")
            interaction.update({ components: interaction.message.components })
  
            await guildraw.save();
          }
    }
}