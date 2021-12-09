export default `ping`;
export const category = `utils`;
export const description = `Check my ping ⌚`;
export const showCommand = true;


/** @type {import("discord.js").ApplicationCommandData} */
export const data = {
   name: `ping`,
   description: `Check my ping ⌚`
};


/** @param {import("discord.js").CommandInteraction} interaction @param {import("keyv")} keyv */
export const run = async (interaction, keyv) => {
   const { stripIndents } = await import(`common-tags`);


   await interaction.deferReply();
   const message = await interaction.fetchReply();


   const interactionPing = message.createdTimestamp - interaction.createdTimestamp;
   const discordPing     = interaction.client.ws.ping;


   return await interaction.editReply({
      content: stripIndents`
         \`\`\`
         Interaction  :  ${interactionPing}ms
         Discord      :  ${discordPing}ms
         \`\`\`
      `
   });
};