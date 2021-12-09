export default `bot-channel`;
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
   name: `bot-channel`,
   description: `Edit the channels where my commands can be used 💬`,
   options: [{
      type: `SUB_COMMAND`,
      name: `add`,
      description: `Add a channel where my commands can be used ➕`,
      options: [{
         type: `CHANNEL`,
         name: `channel`,
         description: `Channel to add 💬`,
         required: true,
         channelTypes: [ `GUILD_TEXT` ]
      }]
   }, {
      type: `SUB_COMMAND`,
      name: `view`,
      description: `View the channels where my commands can be used 📋`
   }, {
      type: `SUB_COMMAND`,
      name: `remove`,
      description: `Remove a channel from the list of channels where my commands can be used ➖`,
      options: [{
         type: `STRING`,
         name: `channel`,
         description: `Channel to remove 💬`,
         required: true,
         autocomplete: true
      }]
   }],
   defaultPermission: false
};