const User = require('../database/schemas/User');

module.exports = async (options) => {
    const { client, message, title, args } = options;

    const userProfile = await User.findOne({
        Id: message.author.id,
      });

      const positions = {
        safe: '_ _                          <:fishl:986862838360453130>\n            _ _              <:cathand:986863065997910056>\n            _ _              <:catl:986863198688927794>',
        danger: '_ _                          <:bombl:986862933432737792>\n            _ _              <:cathand:986863065997910056>\n            _ _              <:catl:986863198688927794>',
        win: '_ _           :crown:**You won.**:crown:\n_ _                      <:cathand:986863065997910056>\n_ _                      <:catl:986863198688927794>',
        lose: '_ _           :skull:**You lost.**:skull:             \n_ _                      <:cathand:986863065997910056>\n_ _                      <:catl:986863198688927794>',
    };

    let randomized = Math.floor(Math.random() * 2);
    let gameEnded = false;
    let randomPos = positions[Object.keys(positions)[randomized]];
    let data = 0;

    const componentsArray = [
        {
            type: 1,
            components: [
                {
                    type: 2,
                    style: 'SECONDARY',
                    custom_id: 'e',
                    label: '\u200b',
                    disabled: true,
                },
                {
                    type: 2,
                    style: 'PRIMARY',
                    custom_id: String(Math.random()),
                    emoji: { id: '890611575227023391' },
                },
                {
                    type: 2,
                    style: 'SECONDARY',
                    custom_id: 'ee',
                    label: '\u200b',
                    disabled: true,
                },
            ],
        },
    ];

    const msg = await message.channel.send({
        content: randomPos,
        components: componentsArray,
    });

    const filter = (button => { return button.user.id === message.author.id; });
    const game = await message.channel.createMessageComponentCollector({
        filter,
        componentType: 'BUTTON',
    });

    function update(button) {
        randomized = Math.floor(Math.random() * 2);
        randomPos = positions[Object.keys(positions)[randomized]];

        if(data === 3) {
            gameEnded = true;
            game.stop();
            componentsArray[0].components[1].disabled = true;

            msg.edit({
                content: positions.win,
                components: componentsArray,
            });
            button.reply({ content: 'GG! You caught 3 fishes! your reward is 1500 coins' });
            userProfile.economy.wallet = userProfile.economy.wallet + 1500;
            userProfile.save();
        }
        else if (data <= -9) {
            gameEnded = true;
            game.stop();
            componentsArray[0].components[1].disabled = true;

            msg.edit({
                content: positions.lose,
                components: componentsArray,
            });
            button.reply({ content: 'You lost' });
        }
        else {
            if(button) return button.deferUpdate();
            msg.edit({
                content: randomPos + `           **${data}**`,
                components: componentsArray,
            });
        }
    }

    setInterval(() => {
        if(gameEnded === false) return update();
    }, 2000);

    game.on('collect', async (button) => {
        if(randomized !== 0) {
            data -= 3;
            update(button);
        }
        else {
            data++;
            update(button);
        }
    });
}