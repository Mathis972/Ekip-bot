require("dotenv").config();
const { Client, Intents, Collection } = require("discord.js");
const { getRandomInt, loadEmojis, capitalizeFirstLetter } = require("./utils");
const axios = require("axios");
const fs = require("fs");
const https = require("https");
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });


client.commands = new Collection();
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  // Set a new item in the Collection
  // With the key as the command name and the value as the exported module
  client.commands.set(command.data.name, command);
}

const faker = require("faker");
const PREFIX = "$$";
let rnd_number = null;
let rnd_emoji = null;

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

function rerollPlayers () {
  OLD_PLAYER = CURRENT_PLAYER;
  while (CURRENT_PLAYER.id === OLD_PLAYER.id) {
    CURRENT_PLAYER = PLAYERS_ARRAY[getRandomInt(0, PLAYERS_ARRAY.length - 1)];
  }
  TARGETS_ARRAY = PLAYERS_ARRAY.filter((value) => {
    return value != CURRENT_PLAYER;
  });
  TARGET_PLAYER = TARGETS_ARRAY[getRandomInt(0, TARGETS_ARRAY.length - 1)];
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
    if (CMD == "kill" && message.member.user.tag === "EyZex972#7677") {
      message.channel.send("https://tenor.com/XVFz.gif");
      setTimeout(() => process.exit(), 500);
    } else if (CMD == "kill") {
      message.channel.send("https://tenor.com/0C6P.gif");
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
      }
      else {
        message.channel.send(
          rnd_emoji + " " + capitalizeFirstLetter(word) + " " + rnd_emoji
        );
      }
    }
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
                              rerollPlayers();

                              return;
                            } else {
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
                                rerollPlayers();
                                return;
                              } else {
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

client.on("interactionCreate", async interaction => {
  if (!interaction.isCommand()) return;
  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }


})
client.login(process.env.DISCORD_BOT_TOKEN);
