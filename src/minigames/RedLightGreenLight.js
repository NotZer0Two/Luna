const User = require('../database/schemas/User');

module.exports = async (options) => {
    const { client, message, title, args } = options;

    const userProfile = await User.findOne({
        Id: message.author.id,
      });

      const grass = '<:grassuwu:986865533318217749>';
      const square = '<:squidgamesquare:986865532101885972>';
      const greenGirl = '<:girlfromback:986865525399355442>';
      const redGirl = '<:girlfromfront:986865523662938122>';
      const greenLine = '<:greenline:986865521335078912>';
      const redLine = '<:redline:986865519682535444>';
      const you = '<:mainchar:986865848310464553>';
      const triangle = '<:squidgametriangle:986865517920940092>'; 
      const colors = ['red', 'green'];

      const positions = {
          green: [`${grass + square + grass + greenGirl + grass + triangle + grass}`,
              `${greenLine + grass.repeat(5) + greenLine}`,
              `${greenLine + grass.repeat(5) + greenLine}`,
              `${greenLine + grass.repeat(5) + greenLine}`,
              `${greenLine + grass.repeat(5) + greenLine}`,
              `${greenLine + grass.repeat(5) + greenLine}`,
              `${greenLine + grass.repeat(5) + greenLine}`,
              [greenLine, grass.repeat(2), you, grass.repeat(2), greenLine]],
          red: [`${grass + square + grass + redGirl + grass + triangle + grass}`,
              `${redLine + grass.repeat(5) + redLine}`,
              `${redLine + grass.repeat(5) + redLine}`,
              `${redLine + grass.repeat(5) + redLine}`,
              `${redLine + grass.repeat(5) + redLine}`,
              `${redLine + grass.repeat(5) + redLine}`,
              `${redLine + grass.repeat(5) + redLine}`,
              [redLine, grass.repeat(2), you, grass.repeat(2), redLine]],
      };

      const move = String(Math.random());
      const data = { left: 6, color: colors[Math.floor(Math.random() * 2) ] };
      let gameEnded = false;

      const componentsArray = [
          {
              type: 1,
              components: [
                  {
                      type: 2,
                      style: 'SECONDARY',
                      custom_id: 'xd',
                      disabled: true,
                      label: '\u200b',
                  },
                  {
                      type: 2,
                      style: 'PRIMARY',
                      custom_id: move,
                      label: 'Move',
                  },
                  {
                      type: 2,
                      style: 'SECONDARY',
                      custom_id: 'dx',
                      disabled: true,
                      label: '\u200b',
                  },
              ],
          },
      ];

      const msg = await message.channel.send({
          content: positions[data.color].join('\n').replace(/,/g, ''),
          components: componentsArray,
      });

      const filter = (button => { return button.user.id === message.author.id; });
      const game = message.channel.createMessageComponentCollector({
          filter,
          componentType: 'BUTTON',
      });

      function update(die, win) {
          if(win === true) {
              game.stop();
              gameEnded = true;
              componentsArray[0].components[1].disabled = true;

              userProfile.economy.wallet = userProfile.economy.wallet + 1500;
              userProfile.save();
              message.channel.send('You won! added to your wallet 1500 coins');
          }
          if(die === true) {
              game.stop();
              gameEnded = true;
              componentsArray[0].components[1].disabled = true;

              message.channel.send('you lost, be proud');
          }
          msg.edit({
                content: positions[data.color].join('\n').replace(/,/g, ''),
               components: componentsArray,
           });
      }
      setInterval(() => {
          if(gameEnded === false) data.color = colors[Math.floor(Math.random() * 2) ];
          update();
      }, 2000);
      game.on('collect', async button => {
          button.deferUpdate();
          if(data.color === 'red') return update(true);
          if(data.left === 1) update(false, true);

          colors.forEach((color) => {
              const thearraytofind = positions[color].filter(x => Array.isArray(x));
              const i = positions[color].filter(x => Array.isArray(x)).map(x => positions[color].indexOf(x))[0];

              const dataBefore = positions[color][i - 1];
              positions[color][i - 1] = thearraytofind;
              positions[color][i] = dataBefore;
          });

          data.left--;
          update();
      });
}