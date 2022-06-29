const User = require('../../database/schemas/User')
const moment = require('moment');
const market = require('../../database/market/market.json');

module.exports = {
  name: 'transfer',
  category: 'Economy',
  description: "Transfer money from your wallet to your bank",
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
    } else if (userProfile.economy.wallet < 500)  {
      return message.channel.send({ content: `
      ❌ You don't have enought money to get a Bank Account!

      **You need to have at least 500 coins get a Bank Account!**
      `})
    }

    let fee = 1.05;
    let feeper = "5%"

    if(user && user.isPremium) {
      fee = 0.50;
      feeper = "2%"
    }

    let amount = args[0]
    const amt = amount;

    if (amount?.toLowerCase() === 'all'){
      amount = Math.floor(userProfile.economy.wallet * 0.95);
    } else {
      amount = Math.round(amount?.split(',').join(''));
    };

    if (!amount){
      return message.channel.send(`\\❌ **${message.author.tag}**, [ **${amt || 0}** ] is not a valid amount!.`);
    } else if (amount < 100){
      return message.channel.send(`\\❌ **${message.author.tag}**, The amount to be deposited must be at least **100**.`);
    } else if (amount * fee > userProfile.economy.wallet){
      return message.channel.send([
        `\\❌ **${message.author.tag}**, You don't have enough credits in your wallet to proceed with this transaction.`,
        ` You only have **${commatize(userProfile.economy.wallet)}** left, **${commatize(amount - userProfile.economy.wallet + Math.ceil(amount * 0.05))}** less than the amount you want to deposit (Transaction fee of 5% included)`,
        `To deposit all credits instead, please type \`${client.prefix}deposit all\`.`
      ].join('\n'));
    };


    userProfile.economy.bank = userProfile.economy.bank + amount;
    userProfile.economy.wallet = userProfile.economy.wallet - Math.floor(amount * fee);

    return userProfile.save()
    .then(() => message.channel.send(`\\✔️ **${message.author.tag}**, you successfully deposited **${commatize(amount)}** credits to your bank! (+${feeper} fee).`))
  },
}

function commatize(number, maximumFractionDigits = 2){
  return Number(number || '')
  .toLocaleString('en-US', { maximumFractionDigits });
};
