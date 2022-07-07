const { Collection } = require('discord.js');
const { readdirSync } = require('fs');
const { option } = require('grunt');
const { join } = require('path');
const list = new Intl.ListFormat('en');

const User = require('../../database/schemas/User');

const files = readdirSync(join(__dirname, '../../minigames'));
const jsfiles = files.filter(ext => ext.split('.').pop() === 'js');

const games = jsfiles.map(x => {
  return { [x.split('.')[0]]: require(`../../minigames/${x}`)};
});

/*Credit to the owner of mai san for the games handler*/

module.exports = {
  name: 'minigames',
  category: 'Economy',
  description: "play some minigame",
  cooldown: 1000,
  aliases: ["minigame"],

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args, user, guild) => {
    if (!message.guild.me.permissions.has('SEND_MESSAGES')) return
    if (
      !message.guild.me.permissions.has([
        'EMBED_LINKS',
        'ADD_REACTIONS',
        'SEND_MESSAGES',
        'READ_MESSAGE_HISTORY',
        'VIEW_CHANNEL',
      ])
    ) {
      return message.channel.send({ content: `
      ❌ I require some Permissions!

      **I need the following Permissions to work on your Server:**
      EMBED_LINKS,
      ADD_REACTIONS, 
      SEND_MESSAGES, 
      READ_MESSAGE_HISTORY,
      VIEW_CHANNEL

      ⚠️ Please add me the right Permissions and re-run this Command!
  
      `})
    }

    const categories = joinArray(jsfiles.map(x => x.split('.')[0]));
 
    const userProfile = await User.findOne({
      Id: message.author.id,
    })

    if(!userProfile || userProfile.economy.wallet == null) {
      return message.channel.send({ content: `
      ❌ You don't have a wallet!

      **You need to do this steps to have one:**
      1. Type \`luna register\`
      2. Then your done!

      ⚠️ Please create the wallet and re-run the Command!
  
      `})

  }

  let title = args[0] || "Not Specified"

  const playGame = games.find(x => x[title])?.[title];


  if (!playGame){
    return message.channel.send(`\\❌ **${message.author.tag}**, ${title} isn't a playable game. Please select from one below:\n\n${categories}`);
  };

  let options = {
    client,
    message,
    title,
    args,
    userProfile,
  };

  //user mentioned someone
  if (args[1] && message.mentions.users.size > 0) {
    const userMention = message.mentions.users.first();
    const OtherUserProfile = await User.findOne({
      Id: userMention.id,
    })
    option.OtherUserProfile = OtherUserProfile;
  }

  return playGame(options);

  },
}

function joinArray(array = []){
  return list.format(array.map(x => String(x)));
};
