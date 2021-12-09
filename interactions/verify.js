export default `verify`;
export const showCommand = false;


/** @param {import("discord.js").ButtonInteraction} interaction @param {import("keyv")} keyv */
export const run = async (interaction, keyv) => {
   const unverified = `589183752811446317`; // @unverified


   if (interaction.member.roles.cache.has(unverified)) {
      await interaction.deferReply({
         ephemeral: true
      });

      await interaction.member.roles.remove(unverified);

      return await interaction.editReply({
         content: `Welcome to the server, ${interaction.user}! 🦞`,
         allowedMentions: {
            parse: []
         }
      });


   } else return await interaction.deferUpdate();
};