const User = require('../../database/schemas/User')
const _ = require('lodash');
const Pages = require('../../Constructors/Pagination');
const { MessageEmbed, GuildEmoji } = require('discord.js');
const market = require('../../database/market/market.json');

module.exports = {
  name: 'buy',
  category: 'Economy',
  description: "Buy an item from the market",
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
        return message.channel.send({ content: await client.translate(`
        ❌ You don't have a wallet!
  
        **You need to do this steps to have one:**
        1. Type \`luna register\`
        2. Then your done!
  
        ⚠️ Please create the wallet and re-run the Command!
    
        `, message.guild.id)})
      }

      const id = args[0];
      let amt = args[1];
      const item = market.find(x => x.id == id);

      if (!item){
        return message.channel.send([
          await client.translate(`❌ **${message.author.tag}**, Could not find the item ${id ? `with id **${id}**` : `without id`}!`, message.guild.id),
          await client.translate(`The proper usage for this command would be \`${client.prefix}buy [item id] <amount>\`.`, message.guild.id),
          await client.translate(`Example: \`${client.prefix}buy ${Math.floor(Math.random() * market.length)}\``, message.guild.id)
        ].join('\n'));
      };

      amt = Math.floor(Math.abs(amt)) || 1;
      const total = item.price * amt;
  
      if (!item.price && amt > 1){
        return message.channel.send(`\\❌ **${message.author.tag}**, You may only have 1 free item at a time.`);
      } else if (amt > 1000){
        return message.channel.send(`\\❌ **${message.author.tag}**, You cannot purchase more than **1,000** items at once.`);
      } else if (userProfile.economy.wallet < total){
        return message.channel.send([
          `\\❌ **${message.author.tag}**, You do not have enough credits to proceed with this transaction!`,
          `You need **${commatize(total - userProfile.economy.wallet)}** more for **${amt}x ${item.name}**`
        ].join('\n'));
      } else if (userProfile.profile.inventory.find(x => x.id === item.id) && !item.price){
        return message.channel.send(`\\❌ **${message.author.tag}**, You may only have 1 free item at a time.`);
      } else {
  
        const old = userProfile.profile.inventory.find(x => x.id === item.id);
        if (old){
          const inv = userProfile.profile.inventory;
          let data = userProfile.profile.inventory.splice(inv.findIndex(x => x.id === old.id),1)[0];
          data.amount = data.amount + amt;
          userProfile.profile.inventory.push(data)
        } else {
          userProfile.profile.inventory.push({
            id: item.id,
            amount: amt
          });
        };
  
        userProfile.economy.wallet = userProfile.economy.wallet - total;
        return userProfile.save()
        .then(() => message.channel.send(`\\✔️ **${message.author.tag}**, successfully purchased **${amt}x ${item.name}!**`))
        .catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
      };
    },    
}

function commatize(number, maximumFractionDigits = 2){
  return Number(number || '')
  .toLocaleString('en-US', { maximumFractionDigits });
};
