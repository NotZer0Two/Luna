const User = require('../../database/schemas/User')

let SuccessCrime = ["You robbed some random guy and you got {money}", "you selled something from the deepweb and darkweb on some random forum and you got {money}", "You robbed someone and the police trying finding you they lost your trace and you escaped with {money}", "You no clipped to the backrooms and you find {money} but you are lost in there", "you tried making indentity theft and you made {money}", "you started an account about crypto scamming and you made {money}"]
let FailCrime = ["You tried to rob some random guy but he was too fast and you got caught and you lost {money}", "you tried to sell something from the deepweb and darkweb on some random forum but you got caught and you lost {money}", "you tried robbing someone but you nocliped on the backrooms and you lost {money}", "you tried to sell Hypixel coin from real currency and you got swatted and you lost {money}", "you tried starting a dropshipping business but you got caught not paying taxes and you lost {money}"]

module.exports = {
  name: 'rob',
  category: 'Economy',
  description: "Rob a user or rob some random guy",
  aliases: [],

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
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

    //find the user by is id
    const userProfile = await User.findOne({
        Id: message.author.id,
      })

      if(!userProfile || userProfile.economy.wallet == null) {
        return message.channel.send({ content: `
        ❌ You don't have a wallet!
  
        **You need to do this steps to have one:**
        1. Type \`luna register\`
        2. Then your done!
  
        ⚠️ Please create the wallet and re-run the Command!
    
        `})

    }
    

    //get if mention an user or not
    const userMention = message.mentions.users.first()

    if(!userMention) {
      //make a chance generator
      const chance = Math.floor(Math.random() * 100) + 1;
      if(chance <= 50) {
        message.channel.send({ content: `${FailCrime[Math.floor(Math.random() * FailCrime.length)]}`.replace("{money}", randoma) })
        userProfile.economy.wallet = userProfile.economy.wallet - randoma

        userProfile.save()
      } else if (chance <= 10) {
        message.channel.send({ content: `${FailCrime[Math.floor(Math.random() * FailCrime.length)]}, you got arrested too`.replace("{money}", randoma) })

        userProfile.economy.wallet = userProfile.economy.wallet - randoma
        userProfile.economy.isPrisoner = true

        userProfile.save()
      } else {
        //got away
        let multiplier = 1
        if(userProfile.isPremium == true) return multiplier = 2

        let randoma = Math.floor(Math.random() * 200) + 1 * multiplier;


        userProfile.economy.wallet = userProfile.economy.wallet + randoma

        userProfile.save().then(() => {
          return message.channel.send({ content: ` ${SuccessCrime[Math.floor(Math.random() * SuccessCrime.length)]}`.replace('{money}', randoma) })
        })
      }
    } else {
      //make a chance generator

      const otherUserProfile = await User.findOne({
        Id: userMention.id,
      })

      if(!otherUserProfile || otherUserProfile.economy.wallet == null) {
        return message.channel.send({ content: `
        ❌ The user doesn't have a wallet!
        `
        })
      }


      const chance = Math.floor(Math.random() * 100) + 1;
      if(chance <= 50) {
        message.channel.send({ content: `You manage to escape but you lost the money ${randoma}` })
        userProfile.economy.wallet = userProfile.economy.wallet - randoma
        otherUserProfile.economy.wallet = otherUserProfile.economy.wallet + randoma

        userProfile.save()
        otherUserProfile.save()
      } else if (chance <= 10) {
        message.channel.send({ content: `You tried escaping but you got arrested and the judge made you pay ${randoma}` })

        userProfile.economy.wallet = userProfile.economy.wallet - randoma
        otherUserProfile.economy.wallet = otherUserProfile.economy.wallet + randoma
        userProfile.economy.isPrisoner = true

        userProfile.save()
        otherUserProfile.save()
      } else {
        //got away
        let multiplier = 1
        if(userProfile.isPremium == true) return multiplier = 2

        let randoma = Math.floor(Math.random() * 200) + 1 * multiplier;


        userProfile.economy.wallet = userProfile.economy.wallet + randoma
        otherUserProfile.economy.wallet = otherUserProfile.economy.wallet - randoma

        otherUserProfile.save()
        userProfile.save().then(() => {
          return message.channel.send({ content: `You robbed <@${userMention.id}> and you escaped with ${randoma}` })
        })
      }
    }

  },
}

