require("dotenv").config();

const { Client, Guild, VoiceChannel } = require("discord.js");

const axios = require("axios");
const https = require("https");
const emojiURL =
  "http://emoji-api.com/emojis?access_key=" + process.env.EMOJI_TOKEN;
// const translationURL =  'https://api-platform.systran.net/translation/text/translate?key=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'

const client = new Client();
var faker = require("faker");
const PREFIX = "$$";
var rnd_number = null;
var emojiList = [];
var rnd_emoji = null;
var DARE_ARRAY = [];
var TRUTH_ARRAY = [];
var game_started = false;
var PLAYERS_ARRAY = new Array();
// var PLAYERS = null;
// var CHANNEL = null;
var CURRENT_PLAYER = null;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function capitalizeFirstLetter(word) {
  letter = word.substr(0, 1);
  if (letter == letter.toUpperCase()) {
    return word;
  } else {
    var capitalLetter = word.charAt(0).toUpperCase();
    var newWord = capitalLetter + word.slice(1);
    return newWord;
  }
}

client.on("ready", () => {
  console.log(client.user.tag + " has logged in MMS");
});

// while (game_started === true) {
//   console.log("e");
//   client.on("messageReactionAdd", (messageReaction) => {
//     console.log(messageReaction);
//     if (
//       messageReaction == "🍌" &&
//       message.author.username == CURRENT_PLAYER.username
//     ) {
//       message.reply("ton action est de").then((response) => {
//         while (CURRENT_PLAYER === message.author) {
//           CURRENT_PLAYER =
//             PLAYERS_ARRAY[getRandomInt(0, PLAYERS_ARRAY.length - 1)];
//         }
//         message.channel.send("\n Action ou V?, " + CURRENT_PLAYER.username);
//       });
//     }
//     if (CMD == "👅" && message.author.username == CURRENT_PLAYER.username) {
//       message.reply("dis moi").then((response) => {
//         while (CURRENT_PLAYER === message.author) {
//           CURRENT_PLAYER =
//             PLAYERS_ARRAY[getRandomInt(0, PLAYERS_ARRAY.length - 1)];
//         }
//         message.channel.send("\n Action ou V?, " + CURRENT_PLAYER.username);
//       });
//     }
//   });
// }

// message.channel.send("tg jeu en cours");
// if (message.content.startsWith(PREFIX)) {
//   const [CMD, ...args] = message.content
//     .trim()
//     .substr(PREFIX.length)
//     .split(/\s+/);
//   if (
//     CMD == "action" &&
//     message.author.username == CURRENT_PLAYER.username
//   ) {
//     message.reply("ton action est de").then((response) => {
//       while (CURRENT_PLAYER === message.author) {
//         CURRENT_PLAYER =
//           PLAYERS_ARRAY[getRandomInt(0, PLAYERS_ARRAY.length - 1)];
//       }
//       message.channel.send("\n Action ou V?, " + CURRENT_PLAYER.username);
//     });
//   }
//   if (
//     CMD == "vérité" &&
//     message.author.username == CURRENT_PLAYER.username
//   ) {
//     message.reply("dis moi").then((response) => {
//       while (CURRENT_PLAYER === message.author) {
//         CURRENT_PLAYER =
//           PLAYERS_ARRAY[getRandomInt(0, PLAYERS_ARRAY.length - 1)];
//       }
//       message.channel.send("\n Action ou V?, " + CURRENT_PLAYER.username);
//     });
//   }
//   if (CMD == "stop") {
//     message.channel.send("Fin de jeu");
//     game_started = false;
//   } else if (message.author.username != CURRENT_PLAYER.username) {
//     message.reply("tu es qui ?");
//   }
// }
client.on("message", (message) => {
  // EKIPAFON
  //?
  if (message.author.bot) return;

  //COMMANDS

  if (message.content === "moi") {
    console.log(message.member.nickname);
    console.log(message.member.guild.me.hasPermission("MANAGE_NICKNAMES"));
    message.member.setNickname("id");
  }
  // lyrics (on s'emmerde)
  if (message.content === "pétasse") {
    message.channel.send("j'porte pas de Philipp Plein");
  }
  if (message.content.startsWith(PREFIX)) {
    const [CMD, ...args] = message.content
      .trim()
      .substr(PREFIX.length)
      .split(/\s+/);
    if (CMD == "help") {
      message.channel.send(
        "$$n / $$nickname permet de générer un nickname en anglais\nRajouter f / french après pour un surnom en français"
      );
    }
    if (CMD == "pute") {
      message.channel.send(message.author.username + " est une pute");
    }

    // disables the bot
    if (CMD == "kill") {
      setTimeout(() => process.exit(), 500);
    }

    // generates a random nickname
    if (CMD === "nickname" || CMD === "n") {
      axios.get(emojiURL).then((response) => {
        emojiList = response.data;
        rnd_number = getRandomInt(0, emojiList.length);
        rnd_emoji = emojiList[rnd_number];
        var word = faker.random.word();

        // translates a random nickname in french
        if (args[0] === "f" || args[0] === "french") {
          const agent = new https.Agent({
            rejectUnauthorized: false,
          });
          axios
            .post(
              "https://frengly.com/frengly/data/translateREST",
              {
                src: "en",
                dest: "fr",
                text: capitalizeFirstLetter(word),
                email: process.env.FRENGLY_MAIL,
                password: process.env.FRENGLY_PSWD,
              },
              { httpsAgent: agent }
            )
            .then((response) => {
              var translation = response.data.translation;
              message.channel.send(
                rnd_emoji.character +
                  " " +
                  translation +
                  " " +
                  rnd_emoji.character
              );
            })
            .catch((error) => {
              console.log(error.message);
            });
        } else {
          message.channel.send(
            rnd_emoji.character +
              " " +
              capitalizeFirstLetter(word) +
              " " +
              rnd_emoji.character
          );
        }
      });
    }
    //ACTION/VERITE TEST
    if (CMD == "play") {
      game_started = true;
      const CHANNEL = message.member.voice.channel;
      const PLAYERS = CHANNEL.members;

      message.reply("oui, " + PLAYERS.size + " joueurs");
      console.log(PLAYERS.get(message.member.id).user.username);
      message.channel.send("Les joueurs sont : ");
      for (const value of PLAYERS.values()) {
        PLAYERS_ARRAY.push(value.user);
        message.channel.send(value.user.username);
      }
      CURRENT_PLAYER = PLAYERS_ARRAY[getRandomInt(0, PLAYERS_ARRAY.length - 1)];
      message.reply("\n Action ou V?, ").then(async (message) => {
        await message.react("👅").then(async (r) => {
          await message.react("🍌");
        });
        //AWAIT ??
        // message
        //   .awaitReactions(
        //     (reaction, user) =>
        //       user.id == CURRENT_PLAYER.id &&
        //       (reaction.emoji.name == "👅" || reaction.emoji.name == "🍌"),
        //     { max: 1, time: 30000 }
        //   )
        //   .then((collected) => {
        //     if (collected.first().emoji.name == "🍌") {
        //       message.reply("Pog");
        //       //TODO Nouveau msg redemandant
        //       message.reply("\n Action ou V?, ").then(async (message) => {
        //         await message.react("👅").then(async (r) => {
        //           await message.react("🍌");
        //         });
        //       });
        //       // client.destroy();
        //     } else message.reply("Operation canceled.");
        //   })
        //   .catch(() => {
        //     message.reply("No reaction after 30 seconds, operation canceled");
        //   });
      });
    }
  }
  // if (game_started === true) {
  //   message
  //     .awaitReactions(
  //       (reaction, user) =>
  //         user.id == CURRENT_PLAYER.id &&
  //         (reaction.emoji.name == "👅" || reaction.emoji.name == "🍌"),
  //       { max: 1, time: 30000 }
  //     )
  //     .then((collected) => {
  //       if (collected.first().emoji.name == "🍌") {
  //         message.reply("Pog");
  //         //TODO Nouveau msg redemandant
  //         // client.destroy();
  //       } else message.reply("Operation canceled.");
  //     })
  //     .catch(() => {
  //       message.reply("No reaction after 30 seconds, operation canceled");
  //     });
  // }
  console.log(message.author.tag);
});

// TRUTH OR DARE
client.on("messageReactionAdd", (messageReaction, user) => {
  if (game_started === false) return;
  if (user.bot) return;
  console.log(user.username);
  console.log(messageReaction._emoji.name);
  if (
    messageReaction._emoji.name == "🍌" &&
    user.username == CURRENT_PLAYER.username
  ) {
    messageReaction.message.channel
      .send("ton action est de")
      .then((response) => {
        response.react("👍").then((r) => {
          response.react("👎");
        });
        response
          .awaitReactions(
            (reaction, user) =>
              !user.bot &&
              (reaction.emoji.name == "👍" || reaction.emoji.name == "👎"),
            { max: 1, time: 30000 }
          )
          .then((collected) => {
            if (collected.first().emoji.name == "👍") {
              response.channel
                .send("\n Action ou V?, " + "<@" + CURRENT_PLAYER.id + ">")
                .then((message) => {
                  message.react("👅").then(async (r) => {
                    await message.react("🍌");
                  });
                });
            } else {
              response.channel.send("PARTIE TERMIN222222");
              game_started = false;
            }
          })
          .catch(() => {
            response.channel.send(
              "No reaction after 30 seconds, game canceled"
            );
            game_started = false;
          });
        // while (CURRENT_PLAYER === message.author) {
        //   CURRENT_PLAYER =
        //     PLAYERS_ARRAY[getRandomInt(0, PLAYERS_ARRAY.length - 1)];
        // }
      });
  }
  if (
    messageReaction._emoji.name == "👅" &&
    user.username == CURRENT_PLAYER.username
  ) {
    messageReaction.message.channel.send("dis moi").then((response) => {
      // while (CURRENT_PLAYER === message.author) {
      //   CURRENT_PLAYER =
      //     PLAYERS_ARRAY[getRandomInt(0, PLAYERS_ARRAY.length - 1)];
      // }
      response.channel
        .send("\n Action ou V?, " + "<@" + CURRENT_PLAYER.id + ">")
        .then((message) => {
          message.react("👅").then(async (r) => {
            await message.react("🍌");
          });
        });
    });
  }
});
client.login(process.env.DISCORD_BOT_TOKEN);
