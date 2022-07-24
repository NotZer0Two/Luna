module.exports = {
    name : 'ticket',
    run : async(client, interaction, container) => {
      const filter = (i) => i.user.id === interaction.user.id;

      if(!interaction.member.permissions.has('MANAGE_GUILD')) {
        return interaction.channel.send(await client.translate("> You don't have permission to use this command", interaction.guild.id));
      }

        const collector2 = interaction.channel.createMessageCollector(filter, { time: 15000 });

        interaction.channel.send("> Please select the color for the embed (Use hex color)");

        collector2.on('collect', async (collecting) => {
          //check if the color is an hex
          if (!collecting.content.startsWith('#')) return;

          //get the guild image and the name
          const guild = await client.guilds.fetch(interaction.guild.id);

          const OpenTicket = new container.Discord.MessageEmbed()
            .setColor(collecting.content)
            .setAuthor({ name: `${guild.name} support!` })
            .setDescription(await client.translate("Click on the button below to make a support thread.", interaction.guild.id))
            .setTitle('__**Ticket Support**__')
            .setThumbnail(`${guild.iconURL({ dynamic: true, size: 512 }) || "https://cdn.discordapp.com/embed/avatars/0.png"} `)


          const row = new container.Discord.MessageActionRow()
            .addComponents
            (
              new container.Discord.MessageButton()
                .setLabel(await client.translate("Click me!", interaction.guild.id))
                .setCustomId("ticket-open")
                .setEmoji('994135167587340330')
                .setStyle('SUCCESS')
            )

          const collector3 = interaction.channel.createMessageCollector(filter, { time: 15000 });

          interaction.channel.send(await client.translate("> Please send the channel where to send the embed", interaction.guild.id));

          collector3.on('collect', async (collecting2) => {
            if (collecting2.mentions.channels.first()) {
              //get the channel mention and send there the message
              const channel = collecting2.mentions.channels.first();

              channel.send({ embeds: [OpenTicket], components: [row] })
              interaction.channel.send(await client.translate("> thanks for setting up the ticket system", interaction.guild.id))
            }
          })

          collector3.stop();
        })
    }
}