const User = require('../../database/schemas/User')
const moment = require('moment');
const market = require('../../database/market/market.json');

module.exports = {
  name: 'pay',
  category: 'Economy',
  description: "Pay user with money",
  aliases: [],

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

    //find the user by is id
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

    } else if (userProfile.economy.bank == null ) {
      return message.channel.send({ content: `
      ❌ You have don't have a bank account inside Cosmos Bank!

      **Create an account inside the bank**
      `})
    }

    let friend = args[0]
    let amount = args[1]
    const fr = friend;
    friend = await message.guild.members.fetch(friend.match(/\d{17,19}/)?.[0]||' ')
    .catch(()=>{});

    amount = Math.round(amount.split(',').join('')) || 'Nothing';

    if (!fr){
      return message.channel.send(`\\❌ **${message.author.tag}**, please specify the user you want to give credits to!`);
    } else if (!friend){
      return message.channel.send(`\\❌ **${message.author.tag}**, I couldn't find \`${fr}\` in this server!`);
    } else if (!amount || amount === 'Nothing'){
      return message.channel.send(`\\❌ **${message.author.tag}**, **${amount}** is not a valid amount!`);
    } else if (amount < 100 || amount > 20000){
      return message.channel.send(`\\❌ **${message.author.tag}**, only valid amount to transfer is between **100** and **20,000**!`);
    } else if (Math.ceil(amount * 1.1) > userProfile.economy.bank){
      return message.channel.send(`\\❌ **${message.author.tag}**, Insuffecient credits! You only have **${commatize(userProfile.economy.bank)}** in your bank! (10% fee applies)`);
    }

    const friendName = friend.user.tag;
    friend = await User.findOne({ Id: friend.id }).catch(err => err);

    if (!friend || friend.economy.bank === null){
      return message.channel.send(`\\❌ **${message.author.tag}**, **${friendName}** doesn't have a bank yet! He is not yet eligible to receive credits!`);
    };

    userProfile.economy.bank = userProfile.economy.bank - Math.floor(amount * 1.1);
    friend.economy.bank = friend.economy.bank + amount;

    return Promise.all([ userProfile.save(), friend.save() ])
    .then(()=> message.channel.send(`\\✔️ **${message.author.tag}**, successfully transferred **${amount}** to **${friendName}**`))
    .catch(err => message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: \`${err.name}\``));
  },
}

function commatize(number, maximumFractionDigits = 2){
  return Number(number || '')
  .toLocaleString('en-US', { maximumFractionDigits });
};
