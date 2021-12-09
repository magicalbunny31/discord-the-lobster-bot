export default `playlist`;
export const showCommand = false;
export const guild = true;


/** @type {import("discord.js").ApplicationCommandData} */
export const data = {
   name: `playlist`,
   description: `Manage your saved music playlists 📋`,
   options: [{
      type: `SUB_COMMAND`,
      name: `save`,
      description: `Save this server's currently playing playlist to your collection 📥`,
      options: [{
         type: `STRING`,
         name: `name`,
         description: `Name to save this playlist as 📝`,
         required: true
      }]
   }, {
      type: `SUB_COMMAND`,
      name: `view`,
      description: `View your saved playlists 📋`,
      options: [{
         type: `STRING`,
         name: `name`,
         description: `Name of the playlist to view 📝`,
         required: false,
         autocomplete: true
      }]
   }, {
      type: `SUB_COMMAND`,
      name: `load`,
      description: `Load a previously saved playlist and add its tracks to this server's currently playing playlist 📃`,
      options: [{
         type: `STRING`,
         name: `name`,
         description: `Name of the playlist to load 📝`,
         required: true,
         autocomplete: true
      }]
   }, {
      type: `SUB_COMMAND`,
      name: `delete`,
      description: `Delete a saved playlist ❌`,
      options: [{
         type: `STRING`,
         name: `name`,
         description: `Name of the playlist to delete 📝`,
         required: true,
         autocomplete: true
      }]
   }]
};