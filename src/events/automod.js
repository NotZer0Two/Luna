const client = require('../index')
const {google} = require('googleapis');
const Guild = require('../database/schemas/Guild')

client.on("messageCreate", async message => {
    const guildraw = await Guild.findOne({
        Id: message.guild.id
    })

    if(!guildraw) return 

    if(guildraw.feature.Automod == true){
      if (message.author.bot) return
      if (message.channel.nsfw) return 

    API_KEY = process.env.PERSPECTIVEAPI;
    DISCOVERY_URL =
        'https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1';
    
    google.discoverAPI(DISCOVERY_URL)
        .then(google => {
          const analyzeRequest = {
            comment: {
              text: message.content,
            },
            requestedAttributes: {
              TOXICITY: {},
            },
          };
    
          google.comments.analyze(
              {
                key: API_KEY,
                resource: analyzeRequest,
              },
              async (err, response) => {
                if(err) return;
                if(response.data.attributeScores.TOXICITY.summaryScore.value >= guildraw.feature.Automod_score){
                    message.delete()
                    message.channel.send(`> **Please do not use toxic language >w< <@${message.author.id}>**`);
                    
                    if(guildraw.feature.Modlogs.enable == true) {

                      client.modlogs({
                        MemberTag: message.author.tag,
                        MemberID: message.author.id,
                        MemberDisplayURL: message.author.displayAvatarURL(),
                        Action: 'Removed Message',
                        Color: "RED",
                        Reason: `Toxic Language \`\`\`Phrase: ${message.content}, Toxic Score: ${response.data.attributeScores.TOXICITY.summaryScore.value}, Possible Language: ${response.data.detectedLanguages}\`\`\`` ,
                        ModeratorTag: client.user.tag,
                        ModeratorID: client.user.id,
                        ModeratorDisplayURL: client.user.displayAvatarURL(),
                      }, message)
                    }
                }
              });
        })
        .catch(err => {
          throw err;
        });
    } else {
        //nothing uwu...
    }
})