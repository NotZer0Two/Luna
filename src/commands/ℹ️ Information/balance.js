const Discord = require('discord.js');
const User = require('../../database/schemas/User');

module.exports = {
  name: 'balance',
  category: 'ℹ️ Information',
  description: 'Your balance in money',
  aliases: ['bal', 'money'],

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args, user, guild) => {
    if (!message.guild.me.permissions.has('SEND_MESSAGES')) return;
    if (
      !message.guild.me.permissions.has([
        'EMBED_LINKS',
        'ADD_REACTIONS',
        'SEND_MESSAGES',
        'READ_MESSAGE_HISTORY',
        'VIEW_CHANNEL',
      ])
    ) {
      return message.channel.send({
        content: `
      ❌ I require some Permissions!

      **I need the following Permissions to work on your Server:**
      EMBED_LINKS,
      ADD_REACTIONS, 
      SEND_MESSAGES, 
      READ_MESSAGE_HISTORY,
      VIEW_CHANNEL

      ⚠️ Please add me the right Permissions and re-run this Command!
  
      `,
      });
    }

    //find the user by is id
    const userProfile = await User.findOne({
      Id: message.author.id,
    });

    if (!userProfile || userProfile.economy.wallet == null) {
      return message.channel.send({
        content: `
        ❌ You don't have a wallet!
  
        **You need to do this steps to have one:**
        1. Type \`luna register\`
        2. Then your done!
  
        ⚠️ Please create the wallet and re-run the Command!
    
        `,
      });
    }

    const dailyUsed =
      userProfile.economy.streak.timestamp !== 0 &&
      userProfile.economy.streak.timestamp - Date.now() > 0;

    function streak(cur, max) {
      const active = '<:Active:975326728962601001>',
        inactive = '<:Inactive:975326731235893248>',
        left = max - cur === 10 ? 0 : max - cur;
      if (left === 0) {
        return dailyUsed ? active.repeat(10) : inactive.repeat(10);
      } else {
        return active.repeat(cur || max) + inactive.repeat(left);
      }
    }

    return message.channel.send({
      embeds: [
        new Discord.MessageEmbed()
          .setColor('GREEN')
          .setTitle('Your Balance')
          .setTimestamp()
          .setFooter(
            'lunabot.ml',
            message.author.displayAvatarURL({ dynamic: true }),
          )
          .setDescription(
            `\u200b\n💰 **${commatize(
              userProfile.economy.wallet,
            )}** credits in wallet.\n\n${
              userProfile.economy.bank !== null
                ? `💰 **${commatize(
                    userProfile.economy.bank,
                  )}** credits in bank.`
                : `Seems like you don't have a bank yet.\nCreate one now by typing \`luna bank\``
            }\n\n━━━━━━━━━━━━━━\nDaily Streak: **${
              userProfile.economy.streak.current
            }** (All time best: **${userProfile.economy.streak.alltime}**)\n**${
              10 - (userProfile.economy.streak.current % 10)
            }** streak(s) left for **Item Reward \\✨**\n\n${streak(
              userProfile.economy.streak.current % 10,
              10,
            )}\n━━━━━━━━━━━━━━\n${
              dailyUsed
                ? '\\✔️ Daily reward already **claimed**!'
                : `\\⚠️ Daily reward is **avaliable**!`
            }`,
          ),
      ],
    });
  },
};

function commatize(number, maximumFractionDigits = 2) {
  return Number(number || '').toLocaleString('en-US', {
    maximumFractionDigits,
  });
}
