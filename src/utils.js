const fs = require("fs");

module.exports = {
    getRandomInt: (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    capitalizeFirstLetter: (word) => {
        letter = word.substr(0, 1);
        if (letter == letter.toUpperCase()) {
            return word;
        } else {
            var capitalLetter = word.charAt(0).toUpperCase();
            var newWord = capitalLetter + word.slice(1);
            return newWord;
        }
    },

    loadEmojis: async () => {
        const data = await fs.promises.readFile("emojis.txt");
        return data;
    }
}
