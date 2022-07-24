const Guild = require('../database/schemas/Guild');
const language = require("../database/language")

function getCode(desiredLang) {
  if (!desiredLang) {
      return false;
  }
  desiredLang = desiredLang.toLowerCase();

  if (language[desiredLang]) {
      return desiredLang;
  }

  var keys = Object.keys(language).filter(function (key) {
      if (typeof language[key] !== 'string') {
          return false;
      }

      return language[key].toLowerCase() === desiredLang;
  });

  return keys[0] || false;
}

/**
* Returns true if the desiredLang is supported by Google Translate and false otherwise
* @param desiredLang – the ISO 639-1 code or the name of the desired language
* @returns {boolean}
*/
function isSupported(desiredLang) {
  return Boolean(getCode(desiredLang));
}

module.exports = {
  name: 'language',
  run: async (client, interaction, container) => {
    const filter = (i) => i.user.id === interaction.user.id;

    if(!interaction.member.permissions.has('MANAGE_GUILD')) {
      return interaction.channel.send(await client.translate("> You don't have permission to use this command", interaction.guild.id));
    }

    const guildraw = await Guild.findOne({
      Id: interaction.guild.id,
    });

    const collector2 = interaction.channel.createMessageCollector(filter, { time: 15000 });

    interaction.channel.send(await client.translate("> Select the language you want use", interaction.guild.id));

    collector2.on('collect', async (collecting) => {

      if(collecting.author.bot) return;
      if(isSupported(collecting.content)) {
        guildraw.feature.Language = collecting.content;
        await guildraw.save().then(async uwu => {
          interaction.channel.send(await client.translate("> Thanks for selecting " + language[collecting.content].nativeName, interaction.guild.id));
        })
      }
      else interaction.channel.send(await client.translate("> The selected language is not correct (https://gist.github.com/piraveen/fafd0d984b2236e809d03a0e306c8a4d for see the language)", interaction.guild.id))
      return collector2.stop();
    })
  }
}