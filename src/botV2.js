require("dotenv").config();

const { Client } = require("discord.js");

const axios = require("axios");
const fs = require("fs").promises;
const https = require("https");
const emojiURL =
  "http://emoji-api.com/emojis?access_key=" + process.env.EMOJI_TOKEN;
// const translationURL =  'https://api-platform.systran.net/translation/text/translate?key=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'

const client = new Client();
var faker = require("faker");
const PREFIX = "$$";
var rnd_number = null;

var rnd_emoji = null;

//TODO JSON file au lieu d'array ?
const DARE_ARRAY_MULTI = ["Touche à ", "mange leS TéTéS DE "];
const DARE_ARRAY = ["tu es qui ?", "pisse toi dessus"];
const TRUTH_ARRAY = ["As-tu déjà baisé ?", "Quel est ton turn on spécifique ?"];
var game_started = false;
var PLAYERS_ARRAY = new Array();
var TARGETS_ARRAY = new Array();

var CURRENT_PLAYER = null;
var OLD_PLAYER = null;
var TARGET_PLAYER = null;

//loads emojis from file and injects them in emojiList
loadEmojis().then((bufferedEmojis) => {
  emojiList = bufferedEmojis.toString().split(",");
});

async function loadEmojis() {
  const data = await fs.readFile("emojis.txt");
  return data;
}
function rerollPlayers() {
  while (CURRENT_PLAYER.id === OLD_PLAYER.id) {
    CURRENT_PLAYER = PLAYERS_ARRAY[getRandomInt(0, PLAYERS_ARRAY.length - 1)];
    TARGETS_ARRAY = PLAYERS_ARRAY.filter((value) => {
      return value != CURRENT_PLAYER;
    });
    TARGET_PLAYER = TARGETS_ARRAY[getRandomInt(0, TARGETS_ARRAY.length - 1)];
  }
}
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
      //Web Scraping VER
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
              rnd_emoji + " " + translation + " " + rnd_emoji
            );
          })
          .catch((error) => {
            console.log(error.message);
          });
      } else {
        message.channel.send(
          rnd_emoji + " " + capitalizeFirstLetter(word) + " " + rnd_emoji
        );
      }
    }
    //EMOJI API VER
    // axios.get(emojiURL).then((response) => {
    //   emojiList = response.data;
    //   rnd_number = getRandomInt(0, emojiList.length);
    //   rnd_emoji = emojiList[rnd_number];
    //   var word = faker.random.word();

    //   // translates a random nickname in french
    //   if (args[0] === "f" || args[0] === "french") {
    //     const agent = new https.Agent({
    //       rejectUnauthorized: false,
    //     });
    //     axios
    //       .post(
    //         "https://frengly.com/frengly/data/translateREST",
    //         {
    //           src: "en",
    //           dest: "fr",
    //           text: capitalizeFirstLetter(word),
    //           email: process.env.FRENGLY_MAIL,
    //           password: process.env.FRENGLY_PSWD,
    //         },
    //         { httpsAgent: agent }
    //       )
    //       .then((response) => {
    //         var translation = response.data.translation;
    //         message.channel.send(
    //           rnd_emoji.character +
    //             " " +
    //             translation +
    //             " " +
    //             rnd_emoji.character
    //         );
    //       })
    //       .catch((error) => {
    //         console.log(error.message);
    //       });
    //   } else {
    //     message.channel.send(
    //       rnd_emoji.character +
    //         " " +
    //         capitalizeFirstLetter(word) +
    //         " " +
    //         rnd_emoji.character
    //     );
    //   }
    // });
    //}
    //ACTION/VERITE

    //STOP LE JEU
    if (CMD == "stop" && game_started === true) {
      game_started = false;
      message.channel.send("PARTIE TERMIN222222");
    }

    //COMMENCE LE JEU (POG !)
    if (CMD == "play") {
      const CHANNEL = message.member.voice.channel;
      if (CHANNEL === null || CHANNEL.members.size < 2) {
        message.reply(
          "Une partie nécessite à ce que à minima 2 joueurs soit dans un channel."
        );
        return;
      }
      const PLAYERS = CHANNEL.members;
      // console.log(PLAYERS.random());

      message
        .reply("La partie commence, " + PLAYERS.size + " joueurs")
        .then(async () => {
          const forLoop = async () => {
            for (const value of PLAYERS.values()) {
              PLAYERS_ARRAY.push(value.user);
              await message.channel.send(value.user.username);
            }
            game_started = true;
          };

          await forLoop();
          CURRENT_PLAYER =
            PLAYERS_ARRAY[getRandomInt(0, PLAYERS_ARRAY.length - 1)];
          TARGETS_ARRAY = PLAYERS_ARRAY.filter((value) => {
            return value != CURRENT_PLAYER;
          });
          TARGET_PLAYER =
            TARGETS_ARRAY[getRandomInt(0, TARGETS_ARRAY.length - 1)];

          while (game_started === true) {
            await message.channel
              .send("Action ou V?, " + "<@" + CURRENT_PLAYER.id + ">")
              .then(async (message) => {
                await message.react("👅").then(async (r) => {
                  await message.react("🍌");
                });

                await message
                  .awaitReactions(
                    (reaction, user) =>
                      user.id == CURRENT_PLAYER.id &&
                      (reaction.emoji.name == "👅" ||
                        reaction.emoji.name == "🍌"),
                    { max: 1, time: 30000 }
                  )
                  .then(async (collected) => {
                    if (collected.first().emoji.name == "🍌") {
                      var rnd_number = getRandomInt(0, 1);
                      var msg = "";
                      if (rnd_number === 1) {
                        msg =
                          DARE_ARRAY[getRandomInt(0, DARE_ARRAY.length - 1)];
                      } else {
                        msg =
                          DARE_ARRAY_MULTI[
                            getRandomInt(0, DARE_ARRAY.length - 1)
                          ] + TARGET_PLAYER.username;
                      }
                      await message.channel.send(msg).then(async (response) => {
                        await response.react("👍").then(async (r) => {
                          await response.react("👎");
                        });
                        await response
                          .awaitReactions(
                            (reaction, user) =>
                              !user.bot &&
                              (reaction.emoji.name == "👍" ||
                                reaction.emoji.name == "👎"),
                            { max: 1, time: 30000 }
                          )
                          .then((collected) => {
                            if (collected.first().emoji.name == "👍") {
                              OLD_PLAYER = CURRENT_PLAYER;
                              rerollPlayers();

                              return;
                            } else {
                              OLD_PLAYER = CURRENT_PLAYER;
                              rerollPlayers();
                              response.channel.send("L");
                              // game_started = false;
                            }
                          })
                          .catch((r) => {
                            console.log(r);
                            response.channel.send(
                              "No reaction after 30 seconds, game canceled"
                            );
                            game_started = false;
                          });
                      });
                    } else {
                      await message.channel
                        .send(
                          TRUTH_ARRAY[getRandomInt(0, TRUTH_ARRAY.length - 1)]
                        )
                        .then(async (response) => {
                          await response.react("👍").then(async (r) => {
                            await response.react("👎");
                          });
                          await response
                            .awaitReactions(
                              (reaction, user) =>
                                !user.bot &&
                                (reaction.emoji.name == "👍" ||
                                  reaction.emoji.name == "👎"),
                              { max: 1, time: 30000 }
                            )
                            .then((collected) => {
                              if (collected.first().emoji.name == "👍") {
                                OLD_PLAYER = CURRENT_PLAYER;
                                rerollPlayers();
                                return;
                              } else {
                                OLD_PLAYER = CURRENT_PLAYER;
                                rerollPlayers();
                                response.channel.send("L");
                                // game_started = false;
                              }
                            })
                            .catch(() => {
                              response.channel.send(
                                "No reaction after 30 seconds, game canceled"
                              );
                              game_started = false;
                            });
                        });
                    }
                  })
                  .catch((r) => {
                    console.log(r);
                    message.channel.send(
                      "No reaction after 30 seconds, game canceled"
                    );
                    game_started = false;
                  });
              });
          }
        });
    }
  }

  console.log(message.author.tag);
});
client.login(process.env.DISCORD_BOT_TOKEN);
