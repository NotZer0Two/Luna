const User = require('../database/schemas/User');
const TicTacToe = require('discord-tictactoe');
const game = new TicTacToe({ language: 'en' })

module.exports = async (options) => {
    const { client, message, title, args } = options;

    const userProfile = await User.findOne({
        Id: message.author.id,
      });

      game.handleMessage(message);

      game.on('win', data => {
        if(data.winner.id == message.author.id) {
          message.channel.send(`Added to your account 1500 coins!`);
          userProfile.economy.wallet = userProfile.economy.wallet + 1500;
          userProfile.save();
        }
      });
 
}