export default `play spotify url`;
export const category = `voice`;
export const description = `Stream audio from a Spotify URL 🔉`;
export const showCommand = false;


/** @param {import("discord.js").CommandInteraction} interaction @param {import("keyv")} keyv */
export const run = async (interaction, keyv) => {
   return await interaction.reply({
      content: `This command is currently not available.`,
      ephemeral: true
   });
};