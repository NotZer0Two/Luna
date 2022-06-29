const Discord = require('discord.js');
const Guild = require('../../database/schemas/Guild');
const moment = require('moment');
require('moment-duration-format');
const { stripIndent } = require('common-tags');

module.exports = {
  name: 'partner',
  category: 'ℹ️ Information',
  description: "Sends you Luna's Partner",
  aliases: ['pi', 'partnerinfo'],

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args, user, guild) => {
    //find every guild with PartnerAC true
    const guilds = await Guild.find({ "partner.partnerAC": true })

    //pick them at random
    const guildr = guilds[Math.floor(Math.random() * guilds.length)]

    //find the guild
    const partnerGuild = await Guild.findOne({ Id: guildr.Id });
    //fetch the guild from discord
    const partnerDiscord = client.guilds.cache.get(guildr.Id);

    const embed = new Discord.MessageEmbed()
      .setTitle('Random Partner')
      .setColor(partnerGuild.partner.color || '#0099ff')
      .setDescription(`
      • Name: ${partnerDiscord.name}
      • Description: ${partnerGuild.partner.description || 'No Description'}
      • Invite: ${partnerGuild.partner.invite || 'No Invite'}
      • Region: ${partnerDiscord.region || "No Region"}
      `)
      .setImage(partnerGuild.partner.banner || 'https://www.sonypicturespublicity.co.nz/nz/img/no_banner_image.gif')
      .setTimestamp()
      .setFooter(
        'if you want be a partner go on the contact page',
        message.author.displayAvatarURL({ dynamic: true }),
      )

    return message.channel.send({ embeds: [embed] });
  },
};
