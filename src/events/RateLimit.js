const { MessageEmbed } = require('discord.js');
const client = require('../index')

client.on('rateLimit', (info) => {
  
    // The timeout info comes in unix epoch
   
     const HOURS = Math.floor(info.timeout / 3600000);
     const MINUTES = Math.floor((info.timeout % 3600000) / 60000);
     const SECONDS = Math.floor(((info.timeout % 3600000) % 60000) / 1000);

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
     }
   });