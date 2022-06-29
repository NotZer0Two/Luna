const { MessageEmbed } = require('discord.js');
const client = require('../index')

client.on('rateLimit', (info) => {
  
    // The timeout info comes in unix epoch
   
     const HOURS = Math.floor(info.timeout / 3600000);
     const MINUTES = Math.floor((info.timeout % 3600000) / 60000);
     const SECONDS = Math.floor(((info.timeout % 3600000) % 60000) / 1000);

     if(MINUTES => 0) return;

     console.log(
       `Rate limit exceeded. rate limited for ${HOURS} hours, ${MINUTES} minutes, and ${SECONDS} seconds.
   
       global: ${info.global},
       method: ${info.method},
       Server: ${info.path},
       ServerRoute: ${info.route}
       `,
     );

     if(info.global) {
        console.log("/!\\ Can't contact the webhook for the rate limit /!\\")
     } else {
        if(MINUTES => 0) return;

        const embed = new MessageEmbed()
            .setTitle("📬 Rate Limit")
            .setColor("#a1131d")
            .setDescription(`Important Rate limit information.`)
            .addField("ℹ️ Rate Limit", `${info.global ? "Global" : "Server"}`)
            .addField("ℹ️ Method", `${info.method}`)
            .addField("🖥️ Path", `${info.path}`)
            .addField("🖥️ Route", `${info.route}`)
            .addField("🕰️ Timeout", `${HOURS} hours, ${MINUTES} minutes, and ${SECONDS} seconds.`)
            .setTimestamp();

        client.stafflogs.send({
            username: 'Rate Limit',
            embeds: [embed],
        });
     }
   });