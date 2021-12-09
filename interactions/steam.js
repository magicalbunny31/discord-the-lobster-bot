export default `steam`;
export const category = `links`;
export const description = `Mighty Lobster's Steam 🔗`;
export const showCommand = true;


/** @type {import("discord.js").ApplicationCommandData} */
export const data = {
   name: `steam`,
   description: `Mighty Lobster's Steam 🔗`
};


/** @param {import("discord.js").CommandInteraction} interaction @param {import("keyv")} keyv */
export const run = async (interaction, keyv) => {
   return await interaction.reply({
      content: `https://steamcommunity.com/profiles/76561199045817710`
   });
};