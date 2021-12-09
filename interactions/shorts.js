export default `shorts`;
export const category = `links`;
export const description = `Mighty Lobster's YouTube Shorts 🔗`;
export const showCommand = true;


/** @type {import("discord.js").ApplicationCommandData} */
export const data = {
   name: `shorts`,
   description: `Mighty Lobster's YouTube Shorts 🔗`
};


/** @param {import("discord.js").CommandInteraction} interaction @param {import("keyv")} keyv */
export const run = async (interaction, keyv) => {
   return await interaction.reply({
      content: `https://www.youtube.com/playlist?list=UUSH8RrHircB3Iz6xjJewotaBg`
   });
};