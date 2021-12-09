/**
 * code by magicalbunny31 🐾
 * https://github.com/magicalbunny31
 */


// load the .env into environment variables
import dotenv from "dotenv";
dotenv.config();


// filesystem
import { readdirSync, readFileSync, writeFileSync } from "fs";


// json
const config = JSON.parse(readFileSync(`./config.json`,  `utf-8`));
const pkg    = JSON.parse(readFileSync(`./package.json`, `utf-8`));


// wrapper to interact with the Discord API and websocket events owo
import { Client, Intents, Collection } from "discord.js";
const client = new Client({
   partials: [ `CHANNEL` ],
   intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MEMBERS, // privileged
      Intents.FLAGS.GUILD_VOICE_STATES,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.DIRECT_MESSAGES
   ],
   presence: {
      status: `dnd`,
      activities: [{
         name: `loading.. 🦞`,
         type: `PLAYING`
      }]
   }
});


// twurple client for twitch irc
import { RefreshingAuthProvider } from "@twurple/auth";
import { ChatClient } from "@twurple/chat";

const tokens = JSON.parse(readFileSync(`./twitch/tokens.json`, `utf-8`));
const authProvider = new RefreshingAuthProvider({
   clientId: process.env.TWITCH_CLIENT_ID,
   clientSecret: process.env.TWITCH_CLIENT_SECRET,
   onRefresh: data => writeFileSync(`./twitch/tokens.json`, JSON.stringify(data, null, 3), `utf-8`)
}, tokens);

const twitch = new ChatClient({ authProvider, channels: [ `mighty_lobster` ] });


// database
import Keyv from "keyv";
import { KeyvFile } from "keyv-file";

const keyv = new Keyv({
   store: new KeyvFile({
      filename: `./database.json`
   })
});


// dates and heck
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration.js";
import advancedFormat from "dayjs/plugin/advancedFormat.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(duration);
dayjs.extend(advancedFormat);
dayjs.extend(timezone);


// http requests
import fetch from "node-fetch";



// initialise a collection that'll hold music queues
client.music = new Collection();


// discord events
const eventFiles = readdirSync(`./events`);
(async () => {
   for (const eventFile of eventFiles) {
      const event = await import(`./events/${eventFile}`);
      if (event.once) client.once(event.default, (...args) => event.listen(...args, keyv));
      else            client.on  (event.default, (...args) => event.listen(...args, keyv));
   };
})();


// twitch events
const twitchEvents = readdirSync(`./twitch`).filter(file => file.endsWith(`.js`));
(async () => {
   for (const eventFile of twitchEvents) {
      const event = await import(`./twitch/${eventFile}`);
      twitch[event.default]((...args) => event.listen(...args, client, keyv));
   };
})();


// poll Mighty Lobster's youtube and twitch for new uploads/streams
const pollYoutube = async () => {
   const base       = `https://youtube.googleapis.com/youtube/v3/search`;
   const part       = `id`;
   const channelId  = config.youtubeId;
   const maxResults = 1;
   const order      = `date`;
   const type       = `video`;
   const url        = `${base}?part=${part}&channelId=${channelId}&maxResults=${maxResults}&order=${order}&type=${type}&key=${process.env.YOUTUBE_DATA_API_V3}`;

   const res = await fetch(url, {
      headers: {
         "Accept": `application/json`,
         "User-Agent": `${pkg.name}/${pkg.version} (${config.github})`
      }
   })
      .then(res => res.json())
      .catch(err => console.error(err));

   const latestVideoId = res.items[0].id.videoId;
   const previousVideoId = await keyv.get(`latest-youtube-upload-id`);
   if (!latestVideoId || !previousVideoId) return;

   if (latestVideoId !== previousVideoId) {
      const channel = await (await client.guilds.fetch(config.guild.id)).channels.fetch(config.guild.channels.uploads);
      await channel.send({
         content: `https://youtu.be/${latestVideoId}`
      });
   };

   void await keyv.set(`latest-youtube-upload-id`, latestVideoId);
};

setInterval(pollYoutube, 1.8e+6); // repeat every thirty minutes


// const pollTwitch = async () => {
// todo: add this?
// };


// connect to discord and twitch
client.login(process.env.TOKEN);
twitch.connect();