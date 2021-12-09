export default `instagram`;
export const category = `links`;
export const description = `Mighty Lobster's Instagram 🔗`;
export const showCommand = true;


/** @type {import("discord.js").ApplicationCommandData} */
export const data = {
   name: `instagram`,
   description: `Mighty Lobster's Instagram 🔗`
};


/** @param {import("discord.js").CommandInteraction} interaction @param {import("keyv")} keyv */
export const run = async (interaction, keyv) => {
   return await interaction.reply({
      content: `https://www.instagram.com/mightylobster_official`
   });
};