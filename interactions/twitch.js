export default `twitch`;
export const category = `links`;
export const description = `Mighty Lobster's Twitch 🔗`;
export const showCommand = true;


/** @type {import("discord.js").ApplicationCommandData} */
export const data = {
   name: `twitch`,
   description: `Mighty Lobster's Twitch 🔗`
};


/** @param {import("discord.js").CommandInteraction} interaction @param {import("keyv")} keyv */
export const run = async (interaction, keyv) => {
   return await interaction.reply({
      content: `https://www.twitch.tv/mighty_lobster`
   });
};