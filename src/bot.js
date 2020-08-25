require('dotenv').config()

const { Client } = require('discord.js')

const axios = require('axios')
const emojiURL = 'http://emoji-api.com/emojis?access_key=' + process.env.EMOJI_TOKEN

const client = new Client();
var faker = require('faker');
const PREFIX = '$$';
var rnd_number = null;
var emojiList = [];
var rnd_emoji = null;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function capitalizeFirstLetter(word) {
    letter = word.substr(0,1)
    if(letter == letter.toUpperCase()) {
        return word
    } else {
        var capitalLetter = word.charAt(0).toUpperCase()
        var newWord = capitalLetter + word.slice(1)
        return newWord 
    }
}

client.on('ready', () => {
    console.log(client.user.tag + ' has logged in MMS')
})

client.on('message', (message) => {
    if(message.author.bot) return;
    if(message.content.startsWith(PREFIX)) {
        const [CMD, ...args] = message.content
        .trim()
        .substr(PREFIX.length)
        .split(/\s+/);
        
        if (CMD == "pute") {
            message.channel.send(message.author.username + ' est une pute')
            console.log(tt)
        }
        if (CMD === "nickname" || "n") {
            axios.get(emojiURL).then( response => {
                emojiList = response.data
                rnd_number = getRandomInt(0,emojiList.length)
                rnd_emoji = emojiList[rnd_number]
                var word = faker.random.word()
                
                message.channel.send(rnd_emoji.character + ' ' + capitalizeFirstLetter(word) + ' ' + rnd_emoji.character)
            });
            
        }
    }
    console.log(message.author.tag);
    if (message.content === 'pétasse') {
        message.channel.send("j'porte pas de Philipp Plein") 
    }
})
client.login(process.env.DISCORD_BOT_TOKEN)