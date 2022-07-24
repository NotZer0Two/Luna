const Discord = require('discord.js');
const Guild = require('../../database/schemas/Guild');

module.exports = {
  name: 'setup',
  category: 'moderation',
  description: 'Moderation Commands',
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

    //check if the user have Manage Guild
    if (!message.member.permissions.has('MANAGE_GUILD')) {
      return message.channel.send(
        `You need the \`MANAGE_GUILD\` Permission to use this Command!`,
      );
    }

    const guildraw = await Guild.findOne({
      Id: message.guild.id,
    });

    if (!guildraw) {
      return message.channel.send(
        await client.translate("❌ I can't find your Guild in my Database! trying using another command will fix the issues!", message.guild.id),
      );
    }

    const embed = new Discord.MessageEmbed()
      .setTitle(await client.translate('📬 Setup Moderation Commands', message.guild.id))
      .setColor('#a1131d')
      .setDescription(await client.translate(`Welcome to the Setup Command!`, message.guild.id))
      .setFooter(await client.translate(`Requested by ${message.author.tag}`, message.guild.id))
      .setTimestamp();

    const row = new Discord.MessageActionRow().addComponents(
      new Discord.MessageButton()
        .setCustomId('automod')
        .setLabel('Automod')
        //check if the automod is enabled or not and set the color
        .setStyle(guildraw.feature.Automod ? 'SUCCESS' : 'DANGER')
        .setEmoji('🤬'),

      new Discord.MessageButton()
        .setCustomId('modlogs')
        .setLabel('ModLogs')
        //check if the automod is enabled or not and set the color
        .setStyle(guildraw.feature.Modlogs.enable ? 'SUCCESS' : 'DANGER')
        .setEmoji('📝'),

      new Discord.MessageButton()
        .setCustomId('ticket')
        .setLabel('Ticket')
        //check if the automod is enabled or not and set the color
        .setStyle("SECONDARY")
        .setEmoji('🎫'),

      new Discord.MessageButton()
        .setCustomId('welcome')
        .setLabel(await client.translate('Welcome', message.guild.id))
        //check if the automod is enabled or not and set the color
        .setStyle(guildraw.feature.welcome.enable ? 'SUCCESS' : 'DANGER')
        .setEmoji('🎉'),
      
      new Discord.MessageButton()
        .setCustomId('language')
        .setLabel(await client.translate('Language', message.guild.id))
        //check if the automod is enabled or not and set the color
        .setStyle("SECONDARY")
        .setEmoji('🗣️'),
    );

    const row2 = new Discord.MessageActionRow().addComponents(
      new Discord.MessageButton()
      .setCustomId('customcommand')
      .setLabel(await client.translate('Custom command', message.guild.id))
      //check if the automod is enabled or not and set the color
      .setStyle("SECONDARY")
      .setEmoji('📝'),

      new Discord.MessageButton()
      .setCustomId('lcustomcommand')
      .setLabel(await client.translate('Custom command List', message.guild.id))
      //check if the automod is enabled or not and set the color
      .setStyle("SECONDARY")
      .setEmoji('📝'),
    )

    let displaymessage = await message.channel.send({ embeds: [embed], components: [row, row2] });
  },
}
