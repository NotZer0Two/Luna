const client = require('../index')
const guild = require('../database/schemas/Guild')
const Discord = require("discord.js")
const Canvas = require("canvas")
const LZString = require("../dashboard/static/js/embed-builder/compression/lz-string")

client.on('guildMemberAdd', async member => {
  //get the guild id for the db
  const guildraw = await guild.findOne({
    Id: member.guild.id
  })

  if(guildraw.feature == null || !guildraw.feature) return;
  if(guildraw.feature.welcome.enable == false || !guildraw.feature.welcome.enable) return;
  //Fixing the welcome bug spam for not setting up things
  if(guildraw.feature.welcome.type == null || !guildraw.feature.welcome.type) return;

  if(guildraw.feature.welcome.type === "PaperPlease") {
    Canvas.registerFont("./src/assets/font/PaperPlease.TTF", { family: 'PaperPlease' })

    const canvas = Canvas.createCanvas(260, 321)
    const ctx = canvas.getContext('2d')
  
    ctx.font = '15px "PaperPlease"'
  
    const background = await Canvas.loadImage('https://i.imgur.com/MiPkeVZ.png')
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
  
    const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'png', dynamic: false, size: 1024 }))
    ctx.drawImage(avatar, 15, 190, 80, 100)
  
    //make the text of the message
    ctx.fillStyle = '#574848'
    ctx.fillText(member.user.tag, 15, 182)
  
    ctx.fillStyle = '#574848'
    ctx.fillText(member.guild.name, 139.5, 240, 110)
  
    var Code1 = Array(5).fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ").map(function(x) { return x[Math.floor(Math.random() * x.length)] }).join('');
    var Code2 = Array(5).fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ").map(function(x) { return x[Math.floor(Math.random() * x.length)] }).join('');
  
    ctx.font = '20px "PaperPlease"'
    ctx.fillStyle = '#574848'
    ctx.fillText(Code1+"-"+Code2, 15.5, 310)
  
    //send to the channel the image
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'alert.png')

    const channelraw = guildraw.feature.welcome.channel
    const channel = member.guild.channels.cache.get(channelraw)
  
    channel.send({ files: [attachment] })

  } else if(guildraw.feature.welcome.type === "Message") {
    const messageraw = guildraw.feature.welcome.message

    const message = messageraw.replace('{MentionJoined}', `<@${member.id}>`).replace('{FullNameJoined}', `${member.user.username}#${member.user.discriminator}`).replace('{UsernameJoined}', `${member.user.username}`).replace('{JoinedID}', `${member.id}`).replace('{TotalMembers}', `${member.guild.memberCount}`).replace('{GuildName}', `${member.guild.name}`)

    //get the channel id from the db
    const channelraw = guildraw.feature.welcome.channel
    const channel = member.guild.channels.cache.get(channelraw)

    //send the message
    channel.send(message)

  } else if(guildraw.feature.welcome.type === "Embed") {

    const messageraw = guildraw.feature.welcome.message

    const rawembedbase = LZString.decompressFromEncodedURIComponent(unescape(messageraw))

    //change inside the rawembedbase the descrption
    const embedbase = JSON.parse(rawembedbase)
    if(embedbase.embed) embedbase.embed.description = embedbase.embed.description.replace('{MentionJoined}', `<@${member.id}>`).replace('{FullNameJoined}', `${member.user.username}#${member.user.discriminator}`).replace('{UsernameJoined}', `${member.user.username}`).replace('{JoinedID}', `${member.id}`).replace('{TotalMember}', `${member.guild.memberCount}`).replace('{GuildName}', `${member.guild.name}`)
    if(embedbase.content) embedbase.content = embedbase.content.replace('{MentionJoined}', `<@${member.id}>`).replace('{FullNameJoined}', `${member.user.username}#${member.user.discriminator}`).replace('{UsernameJoined}', `${member.user.username}`).replace('{JoinedID}', `${member.id}`).replace('{TotalMember}', `${member.guild.memberCount}`).replace('{GuildName}', `${member.guild.name}`)

    const channelraw = guildraw.feature.welcome.channel
    const channel = member.guild.channels.cache.get(channelraw)

    /*
    Debbuging stuff remove the brackets and you will see the raw stuff lol
    //log the embed inside the rawembed as jsonData
    console.log(embedbase)
    //get the embed inside the rawembed as embed
    console.log(embedbase.embed)
    */

    if(embedbase.embed && embedbase.content) channel.send({ content: embedbase.content, embeds: [embedbase.embed] })
    if(embedbase.embed && !embedbase.content) channel.send({ embeds: [embedbase.embed] })
    if(!embedbase.embed && embedbase.content) channel.send({ content: embedbase.content })
    if(!embedbase.embed && !embedbase.content) return;
  }
  
})
