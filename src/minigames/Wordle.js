const {
  MessageActionRow,
  Modal,
  TextInputComponent,
  MessageButton,
  MessageEmbed,
} = require('discord.js');

const User = require('../database/schemas/User');

const { words } = require('../database/minigame/words');

/* Code made by Shinpi#6183 */
module.exports = async (options) => {
  const { client, message, title, args, doc } = options;

  const userProfile = await User.findOne({
    Id: message.author.id,
  });

  if(userProfile.minigames.wordle === true) return message.channel.send('You already have a Wordle game running!')

  let errEmbed = new MessageEmbed().setColor('#6F8FAF');
  //return interaction.reply({ content: 'This command has been disabled. For more info join the support server', ephemeral: true })
  const gamedesc = [
    `⬛⬛⬛⬛⬛ - Empty`,
    `⬛⬛⬛⬛⬛ - Empty`,
    `⬛⬛⬛⬛⬛ - Empty`,
    `⬛⬛⬛⬛⬛ - Empty`,
    `⬛⬛⬛⬛⬛ - Empty`,
    `⬛⬛⬛⬛⬛ - Empty`,
  ];

  const modal = new Modal().setCustomId('wordle').setTitle('Wordle');

  const word = new TextInputComponent()
    .setCustomId('wordleWord')
    .setLabel("What's your word?")
    .setStyle('SHORT')
    .setMinLength(5)
    .setMaxLength(5)
    .setRequired(true);

  const firstActionRow = new MessageActionRow().addComponents(word);

  modal.addComponents(firstActionRow);

  let solution = words[Math.floor(Math.random() * words.length)];

  console.log(solution)

  const row = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId(`${solution}0`)
      .setLabel('Guess')
      .setStyle('PRIMARY'),
  );

  let game = new MessageEmbed()
    .setTitle(`🧐 | Wordle`)
    .setDescription(gamedesc.join('\n'))
    .setFooter({ text: `You Have 6 Tries To Guess The Word` })
    .setColor('#6F8FAF');

  message.reply({ embeds: [game], components: [row] });
  const filter = (i) =>
    i.customId.slice(0, 5) === solution && i.user.id === message.author.id;
  const collector = message.channel.createMessageComponentCollector({
    time: 65000,
    filter,
  });

  collector.on('collect', async (i) => {
    if (i.user.id !== message.author.id)
      return i.reply({ content: 'This is not for you.', ephemeral: true });
    if (i.customId.slice(0, 5) === solution) {
      await i.showModal(modal);
    }
  });

  collector.on('end', async (i, reason) => {
    if (reason === 'time') {
      await message.channel.send({
        content: `Times Up! The Correct Word Was **\`${solution}\`**`,
      });
      userProfile.minigames.wordle = false;
      userProfile.save();
    }
  });
};
