const {
    MessageActionRow,
    Modal,
    TextInputComponent,
    MessageButton,
    MessageEmbed,
    Message,
  } = require('discord.js');

module.exports = {
    name : 'rcustomcommand',
    run : async(client, interaction, container) => {
        if(!interaction.member.permissions.has('MANAGE_GUILD')) {
          return interaction.channel.send(await client.translate("> You don't have permission to use this command", interaction.guild.id));
          }
          
        const modal = new Modal().setCustomId('rcustomcommand').setTitle('Custom command remover');

        const name = new TextInputComponent()
          .setCustomId('rcc-name')
          .setLabel("What's the id of the command to remove")
          .setStyle('SHORT')
          .setMinLength(4)
          .setMaxLength(10)
          .setRequired(true);

          const firstActionRow = new MessageActionRow().addComponents(name)

          modal.addComponents(firstActionRow);

          await interaction.showModal(modal);
    }
}