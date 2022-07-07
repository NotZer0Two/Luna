const User = require('../../database/schemas/User')

module.exports = {
  name: 'badges',
  category: '👑 Owner',
<<<<<<< HEAD
  description: 'Generates a premium code',
=======
  description: 'Give a badge to users',
>>>>>>> Massive Update
  ownerOnly: true,

  run: async (client, message, args, user, guild) => {
    const userId = args[0]

    if(!userId) {
      return message.channel.send({ content: `
      ❌ You need to provide a user id!

      ⚠️ Please provide a user id and re-run the Command!
  
      `})
    }

    const userProfile = await User.findOne({
      Id: userId,
    })

    const badges = {
      1: 1,
      2: 2,
      3: 3,
    };

    const badge = badges[args[1]];
    //check if the badges contains the badge
    if(!badges[args[1]]) {
      return message.channel.send({ content: `
      ❌ You need to provide a badge!

      list of badges:
      1 = Beta_Tester,
      2 = Premium_Member,
      3 = Partner,

      ⚠️ Please provide a badge and re-run the Command!
  
      `})
    }

    if(userProfile.profile.badges.includes(badge)) {
      return message.channel.send({ content: `
      ❌ This user already has this badge!

      ⚠️ Please remove this badge and re-run the Command!
  
      `})
    }

    userProfile.profile.badges.push(badge)
      
    return userProfile.save().then(
      message.channel.send({ content: `
      ✅ The user has been given the badge!
      `})
    )

  }
}
