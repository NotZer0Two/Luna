const { Client, Message, MessageEmbed } = require('discord.js')
const CustomPermission = require('../../permission_handler/CustomPermission')

module.exports = {
  name: 'addstaffer',
  category: 'secret',
  description: 'Let you add staffer to luna bot',
  ownerOnly: true,
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const Permission = new CustomPermission(client.config.SUPPORTSERVERID, message.author.id)

    const member = message.mentions.members.first()
    if (!member) return message.channel.send(`> **You need to ping a user!**`)

    if(args[0] === "add"){
        if(Permission.checkPermission("Staffer")) return message.channel.send(`> **That user already has that permission!**`)
        //add the permission
        Permission.addPermission("Staffer")
    
        }
    else if(args[0] === "remove"){
        if(!Permission.checkPermission("Staffer")) return message.channel.send(`> **That user doesn't have that permission!**`)
        //remove the permission
        Permission.removePermission("Staffer")
    } else {
      //say hello in console
      console.log(`${message.author.username} has used the addstaffer command!`)
        return message.channel.send(`> **Please specify add or remove!**`)
    }
  },
}
