const User = require('../../database/schemas/User')
const moment = require('moment');
const market = require('../../database/market/market.json');

module.exports = {
  name: 'daily',
  category: 'Economy',
<<<<<<< HEAD
  description: "Register a wallet to get money",
=======
  description: "Get the daily reward",
>>>>>>> Massive Update
  aliases: ['dreward'],

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

    const now = Date.now();
    const baseamount = 500;
    const supporter = await client.guilds.cache.get('974368566470148096').members.fetch(message.author.id).then(() => true).catch(() => false)
    const previousStreak = userProfile.economy.streak.current;
    const Premium = userProfile.isPremium
    const rewardables = market.filter(x => ![1,2].includes(x.id));
    const item = rewardables[Math.floor(Math.random() * rewardables.length)];
    let overflow = false, excess = null, streakreset = false, itemreward = false;


    if (userProfile.economy.streak.timestamp !== 0 && userProfile.economy.streak.timestamp - now > 0){
      return message.channel.send(`❌ **${message.author.tag}**, You already got your daily reward!\nYou can get your next daily reward in ${moment.duration(userProfile.economy.streak.timestamp - now, 'milliseconds').format('H [hours,] m [minutes, and] s [seconds]')}`);
    };

    if ((userProfile.economy.streak.timestamp + 864e5) < now){
      userProfile.economy.streak.current = 1;
      streakreset = true;
    };

    if (!streakreset){
      userProfile.economy.streak.current++
      if (!(userProfile.economy.streak.current%10)){
        itemreward = true;
        const old = userProfile.profile.inventory.find(x => x.id === item.id);
        if (old){
          const inv = userProfile.profile.inventory;
          let data = userProfile.profile.inventory.splice(inv.findIndex(x => x.id === old.id),1)[0];
          data.amount += 1;
          userProfile.profile.inventory.push(data)
        } else {
          userProfile.profile.inventory.push({
            id: item.id,
            amount: 1
          });
        };
      };
    };

    if (userProfile.economy.streak.alltime < userProfile.economy.streak.current){
      userProfile.economy.streak.alltime = userProfile.economy.streak.current;
    };

    userProfile.economy.streak.timestamp = now + 72e6;
    const amount = baseamount + 30 * userProfile.economy.streak.current;

    if (userProfile.economy.wallet + amount > 5e4){
      overflow = true
      excess = userProfile.economy.wallet + amount - 5e4;
    };

    userProfile.economy.wallet = overflow ? 5e4 : userProfile.economy.wallet + amount + (supporter ? amount * 0.2 : 0) + (Premium == true ? amount * 20 : 0);

    // Include the streak state and overflow state in the confirmation message
    return userProfile.save()
    .then(() => message.channel.send([
      `\\✔️ **${message.author.tag}**, you got your **${commatize(amount)}** daily reward.`,
      supporter ? `\n\\✔️ **Thank you for your patronage**: You received **${commatize(amount * 0.2)}** bonus credits for being a [supporter]!` : '',
      itemreward ? `\n\\✔️ **You received a profile item!**: You received **x1 ${item.name} - ${item.description}** from daily rewards. It has been added to your inventory!` : '',
      overflow ? `\n\\⚠️ **Overflow Warning**: Your wallet just overflowed! You need to transfer some of your credits to your bank!` : '',
      Premium ? `\n\\✔️ **You are a Premium Member**: You received **${commatize(amount * 20)}** bonus credits for being a [Premium Member]!` : '',
      streakreset ? `\n\\⚠️ **Streak Lost**: You haven't got your succeeding daily reward. Your streak is reset (x1).` : `\n**Streak x${userProfile.economy.streak.current}**`,
    ].join('')))
  },
}

function commatize(number, maximumFractionDigits = 2){
  return Number(number || '')
  .toLocaleString('en-US', { maximumFractionDigits });
};
