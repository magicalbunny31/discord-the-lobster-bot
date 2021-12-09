export default `medal`;
export const category = `links`;
export const description = `Mighty Lobster's Medal 🔗`;
export const showCommand = true;


/** @type {import("discord.js").ApplicationCommandData} */
export const data = {
   name: `medal`,
   description: `Mighty Lobster's Medal 🔗`
};


/** @param {import("discord.js").CommandInteraction} interaction @param {import("keyv")} keyv */
export const run = async (interaction, keyv) => {
   return await interaction.reply({
      content: `https://medal.tv/users/21201365`
   });
};