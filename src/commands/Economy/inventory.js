const User = require('../../database/schemas/User')
const _ = require('lodash');
const Pages = require('../../Constructors/Pagination');
const { MessageEmbed, GuildEmoji } = require('discord.js');
const market = require('../../database/market/market.json');

module.exports = {
  name: 'inventory',
  category: 'Economy',
  description: "See what you have inside that backpack",
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

      const pages = new Pages(_.chunk(userProfile.inventory, 25).map((chunk, i, o) => {
        return new MessageEmbed()
        .setColor('GREY')
        .setFooter(`Visit us at • ${process.env.DOMAIN}`)
        .setThumbnail(
          message.author.displayAvatarURL({ dynamic: true, size: 1024 }),
        )
        .setTitle(`${message.author.tag}'s Inventory`)
        .addFields(...chunk.sort((A,B) => A.id - B.id ).map(d => {
          const item = market.find(x => x.id == d.id);
          return {
            inline: true,
            name: `\`[${item.id}]\` x${d.amount} ${item.name}`,
            value: [
              `Type: *${item.type}*`,
              `Selling Price: *${Math.floor(item.price * 0.7)}*`,
              `Use: \`${client.prefix}use ${item.id}\``,
              `Sell: \`${client.prefix}sell ${item.id} [amount]\``
            ].join('\n')
          }
        }));
      }));
  
      if (!pages.size){
        return message.channel.send(`❌ **${message.author.tag}**, your inventory is empty.`);
      };
  
      const msg = await message.channel.send({ embeds: [pages.firstPage] });
  
      if (pages.size === 1){
        return;
      };
  
      const prev = client.emojis.cache.get('767062237722050561') || '◀';
      const next = client.emojis.cache.get('767062244034084865') || '▶';
      const terminate = client.emojis.cache.get('767062250279927818') || '❌';
  
      const filter = (_, user) => user.id === message.author.id;
      const collector = msg.createReactionCollector(filter);
      const navigators = [ prev, next, terminate ];
      let timeout = setTimeout(()=> collector.stop(), 90000);
  
      for (let i = 0; i < navigators.length; i++) {
        await msg.react(navigators[i]);
      };
  
      collector.on('collect', async reaction => {
  
        switch(reaction.emoji.name){
          case prev instanceof GuildEmoji ? prev.name : prev:
            msg.edit({ embeds: [pages.previous()] });
          break;
          case next instanceof GuildEmoji ? next.name : next:
            msg.edit({ embeds: [pages.next()]});
          break;
          case terminate instanceof GuildEmoji ? terminate.name : terminate:
            collector.stop();
          break;
        };
  
        await reaction.users.remove(message.author.id);
        timeout.refresh();
      });
  
      collector.on('end', async () => await msg.reactions.removeAll());
    }  
}
