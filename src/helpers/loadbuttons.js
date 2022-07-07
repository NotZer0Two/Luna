const Discord = require("discord.js")

module.exports.loadbuttons = async function(client, message, command) {
    if (!command) return;

    container = {
        Discord: Discord
    }

    command.run(client, message, container)
}