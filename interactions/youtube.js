export default `youtube`;
export const category = `links`;
export const description = `Mighty Lobster's YouTube 🔗`;
export const showCommand = true;


/** @type {import("discord.js").ApplicationCommandData} */
export const data = {
   name: `youtube`,
   description: `Mighty Lobster's YouTube 🔗`
};


/** @param {import("discord.js").CommandInteraction} interaction @param {import("keyv")} keyv */
export const run = async (interaction, keyv) => {
   return await interaction.reply({
      content: `https://www.youtube.com/c/MightyLobster`
   });
};