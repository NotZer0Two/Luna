const { Client, Message, MessageEmbed } = require('discord.js')
let permission = [ "Guild_Server", "Start_War" ]
let permissionSpecificy = [ "Guild_Server => Permission for getting the user use the console on vps", "Start_War => Start a war event with this permission" ]
const PermissionHandler = require('../../permission_handler/CustomPermission')

module.exports = {
  name: 'permission',
  description: 'Add permission to a user or remove permission from a user',
  category: '📚 Utility',
  aliases: [ 'permission', 'permissions' ],
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (message.author.id !== message.guild.ownerId) return message.channel.send(await client.translate(`> **You are not the owner of this server!**`, message.guild.id))

    const Permission = new PermissionHandler(message.guild.id, message.author.id)

    const member = message.mentions.members.first()
    if (!member) return message.channel.send(await client.translate(`> **You need to ping a user!**`, message.guild.id))

    if(args[0] === "add"){
      if(!args[1]) return message.channel.send(await client.translate(`> **You need to specify a permission!**`, message.guild.id))
      //check if the args[1] is a permission
      if(!permission.includes(args[1])) return message.channel.send(await client.translate(`> **That is not a permission! get the list with luna permission list**`, message.guild.id))
      //check if the user already has the permission
      if(Permission.checkPermission(args[1])) return message.channel.send(await client.translate(`> **That user already has that permission!**`, message.guild.id))
      //add the permission
      Permission.addPermission(args[1])

    } else if(args[0] === "remove"){
      if(!args[1]) return message.channel.send(await client.translate(`> **You need to specify a permission!**`, message.guild.id))
      //check if the args[1] is a permission
      if(!permission.includes(args[1])) return message.channel.send(await client.translate(`> **That is not a permission! get the list with luna permission list**`, message.guild.id))
      //check if the user already has the permission
      if(!Permission.checkPermission(args[1])) return message.channel.send(await client.translate(`> **That user doesn't have that permission!**`, message.guild.id))
      //remove the permission
      Permission.removePermission(args[1])
    } else if(args[0] === "list"){
      //list all the permissions
      message.channel.send(await client.translate(`> **Here is the list of permissions:**\n${permissionSpecificy.join(", ")}`, message.guild.id))

      message.channel.send(await client.translate(`> **${member.user.tag} has the following permissions:**\n${Permission.getPermissionList()}`, message.guild.id))
    } else {
      return message.channel.send(await client.translate(`> **You need to specify a valid command!**\n> **Valid commands:**\n> add, remove, list`, message.guild.id))
    }
  },
}
