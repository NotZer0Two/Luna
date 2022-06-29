const User = require('../../database/schemas/User')
const Guild = require('../../database/schemas/Guild')
const moment = require('moment');
const market = require('../../database/market/market.json');

module.exports = {
  name: 'use',
  category: 'Economy',
  description: "Use an item inside your inventory",
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

    let id = args[0];

    //find the user by is id
    const userProfile = await User.findOne({
        Id: message.author.id,
      })

    const guildraw = await Guild.findOne({
        Id: message.guild.id,
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

      const item = userProfile.profile.inventory.find(x => x.id == id);

      if (!item){
        return message.channel.send(`\\❌ **${message.author.tag}**, you do not have this item in your inventory!`);
      };
  
      const metadata = market.find(x => x.id === item.id);
  
      if (!metadata){
        return message.channel.send(`\\❌ **${message.author.tag}**, this item can no longer be used!`);
      };

      if (metadata.type === "Unique Item" && metadata.id === 95){
        console.log(message.guild.ownerId)
        if (message.author.id !== message.guild.ownerId){
          return message.channel.send(`\\❌ **${message.author.tag}**, you can't update the guild server without be an owner!`);
        }

        const badge = Math.max(...userProfile.profile.badges);
        if(badge === 3){
          guildraw.ServerWar.Server.ServerVersion = guildraw.ServerWar.Server.ServerVersion + 1
          guildraw.ServerWar.Server.ServerHealth = guildraw.ServerWar.Server.ServerHealth * 8
  
          message.channel.send("\\✅ **" + message.author.tag + "**, you have updated the server to level " + guildraw.ServerWar.Server.ServerVersion + 1 + " You have " + guildraw.ServerWar.Server.ServerHealth + " health!")
  
          return guildraw.save().then(ok => {
            message.channel.send("Server Restarted All service are now online")
          })

        } else if(badge === 3 && guildraw.ServerWar.Server.ServerVersion >= 5){
          return message.channel.send(`\\❌ **${message.author.tag}**, you can't update the server anymore!`)
        }

        if(guildraw.ServerWar.Server.ServerVersion == 4) {
          return message.channel.send(`\\❌ **${message.author.tag}**, you can't update the guild server to a higher version!`);
        }

        guildraw.ServerWar.Server.ServerVersion = guildraw.ServerWar.Server.ServerVersion + 1
        guildraw.ServerWar.Server.ServerHealth = guildraw.ServerWar.Server.ServerHealth * 8

        message.channel.send("\\✅ **" + message.author.tag + "**, you have updated the server to level " + guildraw.ServerWar.Server.ServerVersion + 1 + " You have " + guildraw.ServerWar.Server.ServerHealth + " health!")

        return guildraw.save().then(ok => {
          message.channel.send("Server Restarted All service are now online")
        })
      } else if(metadata.type === "Unique Item" && metadata.id === 96) {
        if(userProfile.profile.masking == true) return message.channel.send(`\\❌ **${message.author.tag}**, you can't use this item!`)
        userProfile.profile.masking = true
        return userProfile.save().then(ok => {
          message.channel.send(`\\✅ **${message.author.tag}**, you have used the mask item!`)
        })
      } else if(metadata.type === "Unique Item" && metadata.id === 97) {
        if(userProfile.isPremium == true && userProfile.profile.HackerLevel >= 11) return message.channel.send(`\\❌ **${message.author.tag}**, you already have the max level!`)
        else if(userProfile.isPremium == false && userProfile.profile.HackerLevel >= 10) return message.channel.send(`\\❌ **${message.author.tag}**, you already have the max level!`)

        userProfile.profile.HackerLevel = userProfile.profile.HackerLevel + 1
        return userProfile.save().then(ok => {
          message.channel.send(`\\✅ **${message.author.tag}**, you have Upgraded the computer`)
        })
      }
  
      userProfile.profile.inventory[metadata.type] = metadata.assets.link;
  
      return userProfile.save()
      .then(() => message.channel.send(`\\✔️ **${message.author.tag}**, successfully used **${metadata.name}!**`))
      .catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
  }
}

function commatize(number, maximumFractionDigits = 2){
  return Number(number || '')
  .toLocaleString('en-US', { maximumFractionDigits });
};
