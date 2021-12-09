export default `statuses`;
export const showCommand = false;
export const guild = true;


/** @type {import("discord.js").ApplicationCommandPermissions[]} */
export const permissions = [{
   id: `754019782076137542`, // staff (Mighty Lobster [OFFICIAL])
   type: `ROLE`,
   permission: true
}];


/** @type {import("discord.js").ApplicationCommandData} */
export const data = {
   name: `statuses`,
   description: `Manage statuses 🔧`,
   options: [{
      type: `SUB_COMMAND`,
      name: `add`,
      description: `Add a new status ➕`,
      options: [{
         type: `STRING`,
         name: `type`,
         description: `The status' type 💬`,
         required: true,
         choices: [{
            name: `Playing 🎮`,
            value: `PLAYING`
         }, {
            name: `Watching 📺`,
            value: `WATCHING`
         }, {
            name: `Listening to 👂`,
            value: `LISTENING`
         }, {
            name: `Competing in 🤺`,
            value: `COMPETING`
         }]
      }, {
         type: `STRING`,
         name: `name`,
         description: `The name of this status 📝`,
         required: true
      }]
   }, {
      type: `SUB_COMMAND`,
      name: `view`,
      description: `View current statuses 💬`
   }, {
      type: `SUB_COMMAND`,
      name: `delete`,
      description: `Delete a status ❌`,
      options: [{
         type: `STRING`,
         name: `name`,
         description: `The name of the status to delete 💬`,
         required: true,
         autocomplete: true
      }]
   }],
   defaultPermission: false
};