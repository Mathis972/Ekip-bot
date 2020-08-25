require('dotenv').config()

const { Client, Guild } = require('discord.js')

const axios = require('axios')
const https = require('https')
const emojiURL = 'http://emoji-api.com/emojis?access_key=' + process.env.EMOJI_TOKEN
// const translationURL =  'https://api-platform.systran.net/translation/text/translate?key=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'

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
    if (message.content === 'moi') {
        console.log(message.member.nickname)
        console.log(message.member.guild.me.hasPermission('MANAGE_NICKNAMES'))
        message.member.setNickname('id')
    }
    if(message.content.startsWith(PREFIX)) {
        const [CMD, ...args] = message.content
        .trim()
        .substr(PREFIX.length)
        .split(/\s+/);
        if (CMD == "help") {
            message.channel.send("$$n / $$nickname permet de générer un nickname en anglais\nRajouter f / french après pour un surnom en français")
        }
        if (CMD == "pute") {
            message.channel.send(message.author.username + ' est une pute')
            
        }
        if (CMD === "nickname" || CMD === "n") {
            axios.get(emojiURL).then( response => {
                emojiList = response.data;
                rnd_number = getRandomInt(0,emojiList.length);
                rnd_emoji = emojiList[rnd_number];
                var word = faker.random.word();
                if (args[0] === 'f' ||args[0] === 'french') {
                    const agent = new https.Agent({  
                        rejectUnauthorized: false
                      });
                    axios.post('https://frengly.com/frengly/data/translateREST', {
                        "src": 'en',
                        "dest": 'fr',
                        "text": capitalizeFirstLetter(word),
                        "email": process.env.FRENGLY_MAIL,
                        "password":process.env.FRENGLY_PSWD
                    }, { httpsAgent: agent } )
                    .then( response => {
                        var translation = response.data.translation
                        message.channel.send(rnd_emoji.character + ' ' + translation + ' ' + rnd_emoji.character);
                    }).catch(error => {
                        console.log(error.message);
                    })
                    
                } else {
                    message.channel.send(rnd_emoji.character + ' ' + capitalizeFirstLetter(word) + ' ' + rnd_emoji.character);
                }
            });
            
        }
    }
    console.log(message.author.tag);
    if (message.content === 'pétasse') {
        message.channel.send("j'porte pas de Philipp Plein") 
    }
})
client.login(process.env.DISCORD_BOT_TOKEN)