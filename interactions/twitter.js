export default `twitter`;
export const category = `links`;
export const description = `Mighty Lobster's Twitter 🔗`;
export const showCommand = true;


/** @type {import("discord.js").ApplicationCommandData} */
export const data = {
   name: `twitter`,
   description: `Mighty Lobster's Twitter 🔗`
};


/** @param {import("discord.js").CommandInteraction} interaction @param {import("keyv")} keyv */
export const run = async (interaction, keyv) => {
   return await interaction.reply({
      content: `https://twitter.com/LobsterMighty`
   });
};