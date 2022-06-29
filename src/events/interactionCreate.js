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


try {
  client.on('interactionCreate', async (interaction) => {
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
