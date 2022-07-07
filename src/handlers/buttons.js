const path = require('path')
const { readdirSync } = require('fs')

module.exports = client => {
  readdirSync('./src/ButtonsCommand/').forEach(file => {
    const buttons = readdirSync('./src/ButtonsCommand/').filter(file =>
      file.endsWith('.js')
    )

    for (let file of buttons) {
      let pull = require(path.resolve(`src/ButtonsCommand/${file}`))
      client.buttonCommands.set(pull.name, pull);
    }
  })
}
