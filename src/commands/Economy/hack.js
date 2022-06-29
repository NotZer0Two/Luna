const User = require('../../database/schemas/User');
const Guild = require('../../database/schemas/Guild');
const Discord = require('discord.js');

module.exports = {
  name: 'hack',
  category: 'Economy',
  description: 'Hack into a discord server',
  customPermission: "Start_War",
  aliases: [],

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

    if (!args[0])
      return message.channel.send({
        content: `
    ❌ You need to specify a server to hack!
    `,
      });

    let id = args[0];

    //find the user by is id
    const userProfile = await User.findOne({
      Id: message.author.id,
    });

    const guildraw = await Guild.findOne({
      Id: id,
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

    if(guildraw.ServerWar.offline == true) {
      return message.channel.send({
        content: `
        ❌ This server is offline, you can't attack a server already offline try again later!
        `,
      });
    }

    if(id == message.guild.id) return message.channel.send({ content: `❌ You can't DDOS your own server` })

    const serverLevel = guildraw.ServerWar.Server.ServerVersion;

    const UserLevel = userProfile.profile.HackerLevel;

    const Mask = userProfile.profile.masking;

    //check if the id exist
    if (!guildraw) {
      return message.channel.send(
        `\\❌ **${message.author.tag}**, this server is not registered!`,
      );
    }

    //get the server Name from the id
    const ServerHack = client.guilds.cache.get(id).name;

    if (UserLevel < serverLevel) {
      return message.channel.send({
        content: `
        ❌ You need to be at least ${serverLevel} to hack this server!
      `,
      });
    }

    let TotalPower = 0;
    let IDS = [];

    IDS.push(message.author.id);
    TotalPower += UserLevel;

    const embed = new Discord.MessageEmbed()
      .setTitle('📬 War Event STARTED')
      .setColor('#a1131d')
      .setDescription(
        `Hack event to ${ServerHack} Currently we have ${TotalPower}`,
      )
      .setFooter(`Requested by ${message.author.tag}`)
      .setTimestamp();

    const row = new Discord.MessageActionRow().addComponents(
      new Discord.MessageButton()
        .setCustomId('accept')
        .setLabel('Accept')
        //check if the automod is enabled or not and set the color
        .setStyle('DANGER')
        .setEmoji('⌨️'),
    );

    const collector = message.channel.createMessageComponentCollector({
      time: 60000,
    });

    const display = await message.channel.send({ embeds: [embed], components: [row] });

    collector.on('collect', async (button) => {
      if (button.customId === 'accept') {
        button.deferUpdate()
        const UserWar = await User.findOne({
          Id: button.user.id,
        });

        if (IDS.includes(button.user.id))
          return message.channel.send({
            content: `❌ You are already on the WAR`,
          });

        if (!UserWar)
          return message.channel.send({
            content: `❌ You don't have an account you can't join the war!`,
          });

        if (UserWar.economy.wallet == null)
          return message.channel.send({
            content: `❌ You don't have a wallet!`,
          });

        let HackerLevel = UserWar.profile.HackerLevel;

        //send in dm the message
        TotalPower += HackerLevel;
        
        embed.setDescription(
          `Hack event to ${ServerHack} Currently we have ${TotalPower}`,
        )

        display.edit({ embeds: [embed], components: [row] })

        //add the user id to the array
        IDS.push(button.user.id);

        try {
          message.author.send({
            content: `
            **You have accepted the challenge**
            > Total Power currently is: ${TotalPower}
            > Total Users: ${IDS.length}
            `,
          });

        } catch (e) {
          message.channel.send({
            content: `
                ❌ You need to enable DMs to receive the message but you joined the War!
                `,
          });
        }
      }
    });

    collector.on('end', async (collected, reason) => {
      let totalDamage = TotalPower * 40;
      message.channel.send({
        content: `**Join Closed**\n> Total USER: ${IDS.length}\n> Total Power: ${TotalPower}\nTotal Damage: ${totalDamage}`,
      });

      guildraw.ServerWar.Server.ServerHealth -= totalDamage;

      if (guildraw.ServerWar.Server.ServerHealth <= 0) {
        message.channel.send({ content: `**THE SERVER IS DOWN**` });

        guildraw.ServerWar.offline = true;
        if (Mask) {
          //generate 18 random numbers

          userProfile.profile.masking = false;

          await userProfile.save();

          let random = [];
          for (let i = 0; i < 18; i++) {
            random.push(Math.floor(Math.random() * 100));
          }

          guildraw.ServerWar.Server.LatestHacker = random;
        } else {
          guildraw.ServerWar.Server.LatestHacker = message.author.id;
        }

        //get the bounty of the server
        let bounty = guildraw.ServerWar.Server.Bounty;

        if (bounty <= 0) {
          //add for each user 5000
          for (let i = 0; i < IDS.length; i++) {
            const UserWar = await User.findOne({
              Id: IDS[i],
            });

            UserWar.economy.wallet += 5000;

            message.channel.send({ content: "The server didn't have a bounty but the master sold the data to a darkweb forum and you everyone gain 5k" })

            await UserWar.save();
          }
        } else {

        guildraw.ServerWar.Server.Bounty = 0;

        //divide the bounty by the total users
        let bountyPerUser = bounty / IDS.length;

        //add the bounty to the wallet of the user

        for (let i = 0; i < IDS.length; i++) {
          const UserWar = await User.findOne({
            Id: IDS[i],
          });

          message.channel.send({ content: `The server had a bounty ` })

          UserWar.economy.wallet += bountyPerUser;

          await UserWar.save();
        }
        }

        await guildraw.save();
      } else {
        message.channel.send({
          content: `**The attack wasn't succefull for the total, try again**`,
        });
        //make a possibility to get arrested
        let random = Math.floor(Math.random() * 100);
        if (random <= 10) {
          message.author.send({
            content: `> Your house was swatted and you got arrested!`,
          });
          userProfile.economy.isPrisoner = true
          await userProfile.save();
        }
        await guildraw.save();
      }
    });
  },
};
