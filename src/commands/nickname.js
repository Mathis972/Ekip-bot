const { SlashCommandBuilder } = require('@discordjs/builders');
const { getRandomInt, capitalizeFirstLetter, loadEmojis } = require("../utils");
var faker = require("faker");


loadEmojis().then((bufferedEmojis) => {
    emojiList = bufferedEmojis.toString().split(",");
});
module.exports = {
    data: new SlashCommandBuilder()
        .setName('nickname')
        .setDescription('Replies with a custom nickame!'),
    async execute (interaction) {
        const rnd_number = getRandomInt(0, emojiList.length);
        const rnd_emoji = emojiList[rnd_number];
        var word = faker.random.word();
        await interaction.reply(rnd_emoji + " " + capitalizeFirstLetter(word) + " " + rnd_emoji);
    },
};
