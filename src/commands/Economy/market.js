const User = require('../../database/schemas/User')
const _ = require('lodash');
const { MessageEmbed, GuildEmoji } = require('discord.js');
const Pages = require('../../Constructors/Pagination');
const market = require('../../database/market/market.json');

module.exports = {
  name: 'market',
  category: 'Economy',
  description: "Get everything what you can buy from the market",
  aliases: ['marketplace', "shop"],

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

    const type = args[0]

    let selected = market.filter(x => x.type === type?.toLowerCase());

    if (!selected.length){
      selected = market;
    };

    const pages = new Pages(_.chunk(selected, 24).map((chunk, i, o) => {
      return new MessageEmbed()
      .setColor('GREY')
      .setTitle('Luna\'s Market')
      .setDescription('You can view all of the items in the market at once on https://market.mai-san.ml/')
      .setFooter(`${process.env.DOMAIN} •\u2000\u2000Page ${i+1} of ${o.length}`)
      .addFields(...chunk.map(item => {
        return {
          inline: true,
          name: `\`[${item.id}]\` ${item.name}`,
          value: [
            item.description,
            `Type: *${item.type}*`,
            `Price: *${commatize(item.price)}*`,
            `Check Preview : \`${client.prefix}previewitem ${item.id}\``,
            `Purchase: \`${client.prefix}buy ${item.id} [amount]\``
          ].join('\n')
        };
      }));
    }));

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
          msg.edit({ embeds: [pages.next()] });
        break;
        case terminate instanceof GuildEmoji ? terminate.name : terminate:
          collector.stop();
          msg.delete();
        break;
      };

      await reaction.users.remove(message.author.id);
      timeout.refresh();
    });

    collector.on('end', async () => await msg.reactions.removeAll());
  },
}

function commatize(number, maximumFractionDigits = 2){
  return Number(number || '')
  .toLocaleString('en-US', { maximumFractionDigits });
};
