const { MessageEmbed } = require('discord.js')
const User = require('../../database/schemas/User')

module.exports = {
  name: 'gban',
  category: '👑 Owner',
  description: 'Ban a user globaly',
  ownerOnly: true,

  run: async (client, message, args, user, guild) => {

    //pick the user id
    const userId = args[0]
    let reason = args.slice(1).join(' ')

    if(!userId) {
      return message.channel.send({ content: `
      ❌ You need to provide a user id!

      ⚠️ Please provide a user id and re-run the Command!
  
      `})
    }

    if(!reason) return reason = "No reason provided"
    else reason = reason + " | Contact us on our discord server"

    const userProfile = await User.findOne({
      Id: userId,
    })

    if(userProfile.isBanned) {
      return message.channel.send({ content: `
      ❌ This user is already banned!

      Reason: ${userProfile.BanReason}

      ⚠️ Please unban this user and re-run the Command!
  
      `})
    }

    userProfile.isBanned = true
    userProfile.BanReason = reason

    userProfile.save().then( 
      message.channel.send({ content: `
      ✅ The user has been banned!
      `})
    )
  },
}
