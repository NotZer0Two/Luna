const {
    MessageActionRow,
    Modal,
    TextInputComponent,
    MessageButton,
    MessageEmbed,
    Message,
  } = require('discord.js');

module.exports = {
    name : 'customcommand',
    run : async(client, interaction, container) => {
        if(!interaction.member.permissions.has('MANAGE_GUILD')) {
          return interaction.channel.send(await client.translate("> You don't have permission to use this command", interaction.guild.id));
          }
          
        const modal = new Modal().setCustomId('customcommand').setTitle('CC-Creator');

        const name = new TextInputComponent()
          .setCustomId('cc-name')
          .setLabel("What's the name of the command")
          .setStyle('SHORT')
          .setMinLength(4)
          .setMaxLength(10)
          .setRequired(true);

        const text = new TextInputComponent()
          .setCustomId('cc-text')
          .setLabel("Tutorial: https://pastebin.com/cfXHKiWh")
          .setStyle('PARAGRAPH')
          .setMinLength(2)
          .setMaxLength(4000)
          .setRequired(true);

          const firstActionRow = new MessageActionRow().addComponents(name)
          const secondActionRow = new MessageActionRow().addComponents(text)

          modal.addComponents(firstActionRow);
          modal.addComponents(secondActionRow);

          await interaction.showModal(modal);
    }
}