const User = require('../../database/schemas/User')
const moment = require('moment');
const market = require('../../database/market/market.json');

module.exports = {
  name: 'sell',
  category: 'Economy',
  description: "Sell the item on your inventory",
  aliases: ['sellitem', 'si'],

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

    }
    
    const id = args[0];
    let amt = args[1];

    const item = market.find(x => x.id == id);

    if (!item){
      return message.channel.send(`❌ **${message.author.tag}**, Could not find the item with id ${id}!`);
    };

    amt = Math.floor(Math.abs(amt)) || 1;
    const total = item.price * 0.7 * amt;
    const itemcount = userProfile.inventory.find(x => x.id === item.id)?.amount;

    if (!itemcount || itemcount < amt){
      return message.channel.send(`❌ **${message.author.tag}**, You do not have the necessary amount of **${item.name}** to sell.`);
    } else if (!item.price){
      return message.channel.send(`❌ **${message.author.tag}**, Unable to sell ${item.name}.`);
    } else if (userProfile.economy.bank === null){
      return message.channel.send(`❌ **${message.author.tag}**, You cannot sell items yet without a bank. Create one before selling items.`)
    } else {

      const inv = userProfile.inventory;
      const old = inv.find(x => x.id === item.id);
      let data = userProfile.inventory.splice(inv.findIndex(x => x.id === old.id),1)[0];
      data.amount = data.amount - amt;

      if (data.amount > 0){
        userProfile.inventory.push(data);
      } else if (item.assets.link === userProfile.profile[item.type]) {
        userProfile.profile[item.type] = null;
      } else {
        // Do nothing...
      };

      userProfile.economy.bank = userProfile.economy.bank + total;
      return userProfile.save()
      .then(() => message.channel.send(`✔️ **${message.author.tag}**, successfully sold **${amt}x ${item.name}** for **${commatize(total)}**`))
    }
  },
}

function commatize(number, maximumFractionDigits = 2){
  return Number(number || '')
  .toLocaleString('en-US', { maximumFractionDigits });
};
