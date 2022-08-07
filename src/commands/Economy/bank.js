const User = require('../../database/schemas/User')
const moment = require('moment');
const market = require('../../database/market/market.json');

module.exports = {
  name: 'bank',
  category: 'Economy',
  description: "Register a bank account to transfer money from it",
  aliases: ['cosmosbank'],

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
        return message.channel.send({ content: await client.translate(`
        ❌ You don't have a wallet!
  
        **You need to do this steps to have one:**
        1. Type \`luna register\`
        2. Then your done!
  
        ⚠️ Please create the wallet and re-run the Command!
    
        `, message.guild.id)})

    } else if (userProfile.economy.bank !== null ) {
      return message.channel.send({ content: await client.translate(`
      ❌ You have already a bank account inside Cosmos Bank!

      **You have registred already your account**
      `, message.guild.id)})
    } else if (userProfile.economy.wallet < 500)  {
      return message.channel.send({ content: await client.translate(`
      ❌ You don't have enought money to get a Bank Account!

      **You need to have at least 500 coins get a Bank Account!**
      `, message.guild.id)})
    }

    userProfile.economy.wallet = userProfile.economy.wallet - 500;
    userProfile.economy.bank = 500;
    
    message.channel.send(await client.translate(`✔️ **${message.author.tag}**, Registered to a bank! The **500** fee was transferred to your bank. To check your balance, type \`${client.prefix}balance\``, message.guild.id))
    if(user && user.isPremium) {
      userProfile.economy.wallet = userProfile.economy.wallet + 500;
      message.channel.send({ content: await client.translate(`Thanks for be a Premium Member! You got your 500 coins back and your Welcome Money!`, message.guild.id)})
    }

    return userProfile.save()
  },
}

function commatize(number, maximumFractionDigits = 2){
  return Number(number || '')
  .toLocaleString('en-US', { maximumFractionDigits });
};
