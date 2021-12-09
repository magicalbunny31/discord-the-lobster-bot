export default `loop`;
export const showCommand = false;
export const guild = true;


/** @type {import("discord.js").ApplicationCommandData} */
export const data = {
   name: `loop`,
   description: `Loop controls 🔁`,
   options: [{
      type: `SUB_COMMAND`,
      name: `disable`,
      description: `Disable looping ❌`
   }, {
      type: `SUB_COMMAND`,
      name: `queue`,
      description: `Loop the currently playing queue 🔁`
   }, {
      type: `SUB_COMMAND`,
      name: `single`,
      description: `Loop the currently playing track 🔂`
   }]
};