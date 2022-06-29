const User = require('../../database/schemas/User')
const { createCanvas, loadImage } = require('canvas');
const { MessageAttachment } = require("discord.js")
const PermissionHandler = require('../../permission_handler/CustomPermission')

module.exports = {
  name: 'profile',
  category: 'Economy',
  description: "Account Profile",
  aliases: ['account'],

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  /*
    Made by Mai Owner the desing the rest and code part was made by me
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

    let member = ''

    member = member.match(/\d{17,18}/)?.[0] || message.member.id;
    member = await message.guild.members.fetch(member).catch(() => message.member);

    //find the user by is id
    const userProfile = await User.findOne({
        Id: member.id
      })

    //permission handler to check if the user has the permission to use this command
    const permissionHandler = new PermissionHandler(client.config.SUPPORTSERVERID, message.member)



      const canvas = createCanvas(800,600);
      const ctx = canvas.getContext('2d');
      const color = userProfile.profile.color || 'rgb(182,66,245)'

      const hat = userProfile.profile.hat ? await loadImage(userProfile.profile.hat) : null;
      const emblem = userProfile.profile.emblem ? await loadImage(userProfile.profile.emblem) : null;
      const wreath = userProfile.profile.wreath ? await loadImage(userProfile.profile.wreath) :  null;
      const def = await loadImage(userProfile.profile.background || 'https://i.pinimg.com/originals/2e/5d/90/2e5d90afa454a6da4d84c7fb7ec32595.jpg');
      const defpattern = await loadImage(userProfile.profile.pattern || 'https://i.imgur.com/nx5qJUb.png' || 'https://i.imgur.com/bnLhXeW.jpg');
      const avatar = await loadImage(member.user.displayAvatarURL({format: 'png'}));
      const badge = Math.max(...userProfile.profile.badges);
      const isStaffer = permissionHandler.checkPermission("Staffer") == true || client.config.DEVELOPERS.includes(member.id)
      let badgeimage = ""
      if(badge === 0) badgeimage = "https://cdn3.emoji.gg/emojis/8859-discord-roles-from-vega.png"
      if(badge === 1) badgeimage = 'https://cdn3.emoji.gg/emojis/5444-beta-badge.png'
      if(badge === 2) badgeimage = 'https://cdn3.emoji.gg/emojis/7476-purple-star.png'
      if(badge === 3) badgeimage = 'https://cdn3.emoji.gg/emojis/7526-partner-purple.png'
      if(isStaffer) badgeimage = 'https://cdn3.emoji.gg/emojis/8744-specialroles.png'

       // add the wallpaper
       ctx.drawImage(def,300,65,495.3,250);

       // add the bio card
       ctx.beginPath();
       ctx.moveTo(300,315);
       ctx.lineTo(canvas.width-5,315);
       ctx.lineTo(canvas.width-5,canvas.height-25);
       ctx.lineTo(300, canvas.height - 25);
       ctx.fillStyle = 'rgba(255,255,255,0.8)'
       ctx.shadowColor = "rgba(0,0,0,0.5)";
       ctx.shadowBlur = 40;
       ctx.shadowOffsetX = -10;
       ctx.shadowOffsetY = -40;
       ctx.fill();
 
       // add bio outline
       ctx.beginPath();
       ctx.moveTo(370, 338);
       ctx.lineTo(canvas.width-40, 338)
       ctx.arcTo(canvas.width-20, 338, canvas.width - 20, 358, 20);
       ctx.lineTo(canvas.width-20, 378)
       ctx.arcTo(canvas.width -20, 398, canvas.width - 40, 398, 20);
       ctx.lineTo(330, 398)
       ctx.arcTo(310,398,310,378,20)
       ctx.lineTo(310, 358)
       ctx.arcTo(310,338,330,338,20)
       ctx.lineWidth = 1;
       ctx.strokeStyle = 'rgba(0,0,0,0.4)'
       ctx.stroke();
 
       // add bio title
       ctx.beginPath();
       ctx.font = 'bold 20px sans-serif'
       ctx.fillStyle = 'rgba(0,0,0,0.4)'
       ctx.fillText('BIO', 330, 345, 50)
 
       // add bio text to bio carrd
       ctx.beginPath();
       ctx.font = '15px sans-serif'
       ctx.fillStyle = 'rgba(0,0,0,0.8)'
       ctx.textAlign = 'center'
       ctx.fillText(userProfile.profile.bio, 555, 368, 490)
 
       // add birthday outline
       ctx.beginPath();
       ctx.moveTo(410, 419);
       ctx.lineTo(520,419);
       ctx.arcTo(540,419,540,439,20);
       ctx.arcTo(540,459,520,459,20);
       ctx.lineTo(330,459);
       ctx.arcTo(310,459,310,439,20);
       ctx.arcTo(310,419,320,419,20);
       ctx.stroke();
 
       // add birthday title
       ctx.beginPath();
       ctx.font = 'bold 18px sans-serif'
       ctx.fillStyle = 'rgba(0,0,0,0.4)'
       ctx.textAlign = 'left'
       ctx.fillText('BIRTHDAY', 330, 425, 80)
 
       // add birthday text to birthday card
       ctx.beginPath();
       ctx.font = '15px sans-serif'
       ctx.fillStyle = 'rgba(0,0,0,0.8)'
       ctx.fillText(userProfile.profile.birthday || 'Not Set', 330, 445, 230)
 
       // add balance outline
       ctx.beginPath();
       ctx.moveTo(410,479);
       ctx.lineTo(520,479);
       ctx.arcTo(540,479,540,499,20);
       ctx.lineTo(540,509);
       ctx.arcTo(540,529,520,529,20);
       ctx.lineTo(330,529);
       ctx.arcTo(310,529,310,509,20);
       ctx.lineTo(310,499);
       ctx.arcTo(310,479,330,479,20);
       ctx.stroke();
 
       // add balance title
       ctx.beginPath();
       ctx.font = 'bold 18px sans-serif'
       ctx.fillStyle = 'rgba(0,0,0,0.4)'
       ctx.fillText('BALANCE', 330, 485, 80)
 
       // add balance text to balance card
       ctx.beginPath();
       ctx.font = '18px sans-serif'
       ctx.fillStyle = 'rgba(0,0,0,0.8)'
       ctx.fillText(`💴: ${userProfile.economy.wallet || '0'}`, 330, 512, 80)
       ctx.fillText(`🏦: ${userProfile.economy.bank || '0'}`, 430, 512, 80)
 
       // reset shadow
       ctx.shadowOffsetY = 0;
 
       // add card on left side
       // add pattern inside card
       ctx.fillStyle = 'rgba(255,255,255,1)'
       ctx.beginPath();
       ctx.moveTo(0,65);
       ctx.lineTo(0,535);
       ctx.arcTo(0,585,50,585,50);
       ctx.lineTo(250,585);
       ctx.lineTo(300,585);
       ctx.arcTo(300,15,250,15,50);
       ctx.lineTo(50,15);
       ctx.arcTo(0,15,0,65,50);
       ctx.stroke();
       ctx.shadowBlur = 10;
       ctx.shadowOffsetX = 10;
       ctx.fill();
       ctx.save();
       ctx.clip();
       ctx.drawImage(defpattern,0,0,300,600);
       ctx.restore();
 
       // reset shadow
       ctx.shadowOffsetX = 0;
 
       // add wavy shape below the pattern
       ctx.beginPath();
       ctx.moveTo(0, 255);
       ctx.bezierCurveTo(0,265,50,265,50,255);
       ctx.bezierCurveTo(50,245,100,245,100,255);
       ctx.bezierCurveTo(100,265,150,265,150,255);
       ctx.bezierCurveTo(150,245,200,245,200,255);
       ctx.bezierCurveTo(200,265,250,265,250,255);
       ctx.bezierCurveTo(250,245,300,245,300,255);
       ctx.lineTo(300,585);
       ctx.lineTo(50,585);
       ctx.arcTo(0,585,0,535,50);
       ctx.fillStyle = color
       ctx.fill();
       ctx.shadowBlur = 0;
 
       // add name
       ctx.beginPath()
       ctx.font = 'bold 30px sans-serif'
       if(badge == 2) {
        ctx.fillStyle = '#e3c830' 
       } else if (isStaffer) {
        ctx.fillStyle = '#7a0db5'
       } else if(badge == 3) {
        ctx.fillStyle = '#501a6e'
       } else {
        ctx.fillStyle = '#ffffff'
       }
       ctx.textAlign = 'center'
       ctx.fillText(member.displayName, 150, 350, 280)
       ctx.font = '20px sans-serif'
       ctx.fillText(member.user.tag, 150, 375, 280)
 
       // add avatar
       ctx.beginPath();
       ctx.arc(150,225,75, 0, Math.PI * 2);
       ctx.lineWidth = 6;
       ctx.strokeStyle = 'rgba(0,0,0,0.6)'
       ctx.stroke();
       ctx.closePath();
       ctx.save();
       ctx.clip();
       ctx.drawImage(avatar,75,150,150,150);
       ctx.restore();
 
      //add the partner logo 
        //load the image from the let badgeimage
        let partnerlogo = await loadImage(badgeimage);
        ctx.beginPath();
        if(badge === 1) {
          ctx.drawImage(partnerlogo, 200, 250, 70, 50);
        } else {
        ctx.drawImage(partnerlogo, 200, 250, 40, 40);
        }

       // add wreath
       if (wreath){
         ctx.beginPath();
         ctx.drawImage(wreath,60,145,180,180);
       };
 
       if (hat){
         ctx.beginPath();
         ctx.drawImage(hat,0,0,300,300);
       };

     //send it to the channel
      message.channel.send({files: [new MessageAttachment(canvas.toBuffer(), `profile.png`)]});
  },
}