const puppeteer = require("puppeteer");
const fs = require("fs");

var DICTIONARY_OF_EMOJIS = [];
var ARRAY_OF_EMOJIS = [];

//scrape emojis from website to get discord emojis
async function scrapeEmojis(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  await page.waitForSelector(".has-text-align-center");
  const arrayOfStringEmojis = await page.evaluate(() => {
    const txt = document.querySelectorAll(".has-text-align-center");

    const emojiArray = Array.from(txt).map((v) => v.innerHTML);

    return emojiArray;
  });

  await browser.close();
  //removes . between emojis
  arrayOfStringEmojis.forEach((value) => {
    DICTIONARY_OF_EMOJIS.push(value.split("."));
  });

  //fuse arrays
  for (i = 0; i < DICTIONARY_OF_EMOJIS.length; i++) {
    ARRAY_OF_EMOJIS = ARRAY_OF_EMOJIS.concat(DICTIONARY_OF_EMOJIS[i]);
  }

  //Write TXT file with emojsi
  fs.writeFile("emojis.txt", ARRAY_OF_EMOJIS, (err) => {
    if (err) throw err;
  });
}
//use function with website
scrapeEmojis("https://wprock.fr/blog/emoji-smiley-copier-coller/");
