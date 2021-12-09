export default `play`;
export const showCommand = false;
export const guild = true;


/** @type {import("discord.js").ApplicationCommandData} */
export const data = {
   name: `play`,
   description: `Play some audio in a voice channel 🎶`,
   options: [{
      type: `SUB_COMMAND_GROUP`,
      name: `youtube`,
      description: `Play audio from a YouTube video 💻`,
      options: [{
         type: `SUB_COMMAND`,
         name: `search`,
         description: `Search YouTube and stream a video's audio 🔉`,
         options: [{
            type: `STRING`,
            name: `search-term`,
            description: `Content to search 📝`,
            required: true,
            autocomplete: true
         }]
      }, {
         type: `SUB_COMMAND`,
         name: `url`,
         description: `Stream a video's audio from a YouTube video/playlist URL 🔉`,
         options: [{
            type: `STRING`,
            name: `url`,
            description: `URL of the YouTube video/playlist to stream audio from 🔗`,
            required: true
         }]
      }]
   }, {
      type: `SUB_COMMAND_GROUP`,
      name: `spotify`,
      description: `Play audio from Spotify 🎧`,
      options: [{
         type: `SUB_COMMAND`,
         name: `url`,
         description: `Stream audio from a Spotify URL 🔉`,
         options: [{
            type: `STRING`,
            name: `url`,
            description: `URL of the Spotify track/playlist to stream audio from 🔗`,
            required: true
         }]
      }]
   }]
};