const client = require('../index')
const { Collection } = require('discord.js')
const Discord = require("discord.js")
const Timeout = new Collection()
const ms = require('ms')
const User = require('../database/schemas/User')
const Guild = require('../database/schemas/Guild')
const PermissionHandler = require('../permission_handler/CustomPermission')
const LZString = require("../dashboard/static/js/embed-builder/compression/lz-string")

client.on('messageCreate', async message => {
  if (message.author.bot) return

  let guild

  try {
    guild = message.client.guildSettings.get(message.guild.id)
  } catch (err) {
    return
  }

  if (!guild) {
    const findGuild = await Guild.findOne({ Id: message.guild.id })
    if (!findGuild) {
      const newGuild = await Guild.create({ Id: message.guild.id, prefix: client.prefix })
      message.client.guildSettings.set(message.guild.id, newGuild)
      guild = newGuild
    } else return
  }

  const prefix = guild.prefix || client.prefix

  if (!message.content.startsWith(prefix)) return
  if (!message.guild) return

  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g)
  const cmd = args.shift().toLowerCase()

  if (cmd.length == 0) return
  let command = client.commands.get(cmd)

  try {
    guild.feature.customcommand.forEach(async element => {
      if(element.Name == cmd) {
        let embedraw = element.Text.replace("https://lunabot.gq/embed-builder?data=", "") || element.Text.replace("http://localhost:8000/embed-builder?data=", "")

        const rawembedbase = LZString.decompressFromEncodedURIComponent(unescape(embedraw))
  
        //change inside the rawembedbase the descrption
        const embedbase = JSON.parse(rawembedbase)
        if(embedbase.embed) embedbase.embed.description = embedbase.embed.description.replace('{MentionJoined}', `<@${message.author.id}>`).replace('{FullNameJoined}', `${message.author.username}#${message.author.discriminator}`).replace('{UsernameJoined}', `${message.author.username}`).replace('{JoinedID}', `${message.author.id}`).replace('{TotalMember}', `${message.guild.memberCount}`).replace('{GuildName}', `${message.guild.name}`).replace('{args}', `${args[0] || 'No Arguments'}`)
        if(embedbase.content) embedbase.content = embedbase.content.replace('{MentionJoined}', `<@${message.author.id}>`).replace('{FullNameJoined}', `${message.author.username}#${message.author.discriminator}`).replace('{UsernameJoined}', `${message.author.username}`).replace('{JoinedID}', `${message.author.id}`).replace('{TotalMember}', `${message.guild.memberCount}`).replace('{GuildName}', `${message.guild.name}`).replace('{args}', `${args.join(' ') || 'No Arguments'}`)

        const row = new Discord.MessageActionRow().addComponents(
          new Discord.MessageButton()
            .setCustomId('buttonclosed')
            
            .setLabel(await client.translate("Made by " + element.Creator, message.guild.id))
            .setDisabled(true)
            .setStyle("SECONDARY")
        )
  
        if(embedbase.embed && embedbase.content) message.channel.send({ content: embedbase.content, embeds: [embedbase.embed], components: [row] })
        if(embedbase.embed && !embedbase.content) message.channel.send({ embeds: [embedbase.embed], components: [row] })
        if(!embedbase.embed && embedbase.content) message.channel.send({ content: embedbase.content, components: [row] })
        if(!embedbase.embed && !embedbase.content) return;
      }
    });
  } catch (error) {
    console.log(error)
  }

  if (!command) command = client.commands.get(client.aliases.get(cmd)) // aliases

  if (command) {
    let user = message.client.userSettings.get(message.author.id)

    if (!user) {
      const findUser = await User.findOne({ Id: message.author.id })
      if (!findUser) {
        const newUser = await User.create({ Id: message.author.id })
        message.client.userSettings.set(message.author.id, newUser)
        user = newUser
      } else return
    }

    const findUser = await User.findOne({ Id: message.author.id })

    // Fetch disabled channels and return -> doesnt send anything (commands)
    if (guild.disabledChannels.includes(message.channel.id)) return
    if (guild.disabledCommands.includes(command.name || command)) return
    if (findUser.isBanned == true) return message.channel.send({
      content: `
    ❌ You are banned!

    Reason: ${findUser.BanReason}

    ⚠️ Contact us to try to get unbanned!
    `})


    // For Bot Developers, return if the Author isn't listed under Bot Owner List
    if (command.ownerOnly) {
      if (!process.env.DEVELOPERS.includes(message.author.id))
        return message.channel.send({
          content: '**> You do not have permission to use this command**',
        })
    }

    try {
      if (command.customPermission) {
        const Permission = new PermissionHandler(message.guild.id, message.author.id)

        const permission = command.customPermission.toString()
        if (!await Permission.checkPermission(permission) && message.author.id !== message.guild.ownerId) {
          return message.channel.send({
            content: `**> You do not have permission to use this command (${permission})**`,
          })
        }
      }
    } catch (error) {
      console.log(error)
      message.channel.send({ content: 'Something went wrong.' }) // If something goes wrong, log the error and error into the Channel "Something went wrong".
    }

    try {
      if (command.StaffOnly) {
        const Permission = new PermissionHandler(process.env.SUPPORTSERVERID, message.author.id)

        if (!await Permission.checkPermission("Staffer") || !process.env.DEVELOPERS.includes(message.author.id)) {
          return message.channel.send({
            content: '**> You do not have permission to use this command**',
          })
        }
      }
    } catch (error) {
      console.log(error)
      message.channel.send({ content: 'Something went wrong.' }) // If something goes wrong, log the error and error into the Channel "Something went wrong".
    }

    // Command Cooldown, cooldown: 1000 * 60 * 60 for 1h etc...
    try {
      if (command.cooldown) {
        if (Timeout.has(`${command.name}${message.author.id}`))
          return message.channel.send(
            `You are on a \`${ms(
              Timeout.get(`${command.name}${message.author.id}`) - Date.now(),
            )}\` cooldown.`,
          )
        command.run(client, message, args, user, guild)
        Timeout.set(
          `${command.name}${message.author.id}`,
          Date.now() + command.cooldown,
        )
        setTimeout(() => {
          Timeout.delete(`${command.name}${message.author.id}`)
        }, command.cooldown)
      } else command.run(client, message, args, user, guild)
    } catch (error) {
      console.log(error)
      message.channel.send({ content: 'Something went wrong.' }) // If something goes wrong, log the error and error into the Channel "Something went wrong".
    }
  }
})
