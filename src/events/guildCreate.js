const client = require("../index");
const { Discord, MessageEmbed, Guild } = require("discord.js");

try {


 client.on('guildCreate', async (guild) => {

  const adminchannel = await client.channels.fetch("975003243925110794");
  const bots = guild.members.cache.filter((m) => m.user.bot).size;
  const owner = (await guild.fetchOwner()).user.tag

  const newserver = new MessageEmbed()
  .setTitle("New Server")
  .setDescription(`${owner} - \`${guild.id}\` - **${guild.name}** - \`${guild.memberCount}\` members - \`${bots}\` bots`)
  .setColor("GREEN")
  .setTimestamp()

  const embed = new MessageEmbed()                              
  .setThumbnail("https://cdn.discordapp.com/attachments/876477209186017340/876820442562822184/Rd0c07cb2486f8c6aa515c4f9fc608357.png", {size: 1024})
  .setColor("BLURPLE")
  .setDescription([
    '**Hey there, Here is your goddess! Thanks for inviting me to your Server!** 👋',
    '',
    `Standard Prefix: **\`luna\`**`,
    `Commands: **\`luna help\`**`,
    '',
    '    🌐 **Help & Support**',
    `• **[Status](${process.env.DOMAIN}/status)**`,
    `• **[Support Server](https://discord.gg/7MEZZHD6Wh)**`,
    `• **[Contact us](${process.env.DOMAIN}/contact)**`,
    '',
    '',
    '    💠 **Other Links**',
    `• **[Dashboard](${process.env.DOMAIN}/panel)**`,
    `• **[Invite Luna](${process.env.DOMAIN})**`,
    '',
    '',
    '    🔎 **Information**',
    '•  I am here for making all kind of thing you can imagine for your server!',
    '•  With his own feature like imagine you can destroy other server or create your own character!',
    `•  You can configurate me trough my [Dashboard](${process.env.DOMAIN}/panel)`,
    '',
    '',
    '**I hope i am your favorite goddess**',
    ].join("\n"));

    // Send the Embed the Guild Owner, send a log notification to the Bot Admins.
    guild.owner.send(embed).catch(() => {})
    adminchannel.send({ content: "<@642642727237845041>"});
    adminchannel.send({ embeds: [newserver]})
  });
} catch(error) {
    console.log(error)
}