const {
    MessageActionRow,
    Modal,
    TextInputComponent,
    MessageButton,
    MessageEmbed,
    Message,
  } = require('discord.js');
  const Discord = require("discord.js")

  const Guild = require('../database/schemas/Guild');

module.exports = {
    name : 'lcustomcommand',
    run : async(client, interaction, container) => {
        if(!interaction.member.permissions.has('MANAGE_GUILD')) {
          return interaction.channel.send(await client.translate("> You don't have permission to use this command", interaction.guild.id));
          }

          const guildraw = await Guild.findOne({
            Id: interaction.guild.id,
          });

          let commandlist = []

          //push on the commandlist all the custom command name and id
          for(let i = 0; i < guildraw.feature.customcommand.length; i++) {
            commandlist.push(guildraw.feature.customcommand[i].Name + " - " + guildraw.feature.customcommand[i].Id)
          }

          const embed = new MessageEmbed()
          .setTitle(await client.translate('📬 Custom command list', interaction.guild.id))
          .setColor('#a1131d')
          //set as description the commandlist
          .setDescription(commandlist.join('\n'))
          .setFooter(await client.translate(`Requested by ${interaction.member.tag}`, interaction.guild.id))
          .setTimestamp();

          const row = new Discord.MessageActionRow().addComponents(
            new Discord.MessageButton()
              .setCustomId('rcustomcommand')
              .setLabel('Remove Custom Command')
              //check if the automod is enabled or not and set the color
              .setStyle('DANGER')
          )

          interaction.reply({ embeds: [embed], components: [row] });


    }
}