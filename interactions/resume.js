export default `resume`;
export const category = `voice`;
export const description = `Resume the player ⏯`;
export const showCommand = true;
export const guild = true;


/** @type {import("discord.js").ApplicationCommandData} */
export const data = {
   name: `resume`,
   description: `Resume the player ⏯`
};


/** @param {import("discord.js").CommandInteraction} interaction @param {import("keyv")} keyv */
export const run = async (interaction, keyv) => {
   const { AudioPlayerStatus } = await import(`@discordjs/voice`);
   const { stripIndents } = await import(`common-tags`);


   // a collection containing music data
   // this will either exist as music data or will be created and *then* exist as music data
   const data = interaction.client.music;
   let music = data.get(interaction.guild.id);


   if (music) {
      if (music.player.state.status !== AudioPlayerStatus.Paused) {
         return await interaction.reply({
            content: stripIndents`
               The player isn't paused!
               You can pause it again with \`/pause\`
            `,
            ephemeral: true
         });


      } else {
         music.player.unpause();

         return await interaction.reply({
            content: stripIndents`
               The player has resumed.
               You can pause it again with \`/pause\`
            `
         });
      };


   } else {
      return await interaction.reply({
         content: `There's no audio playing in this server!`,
         ephemeral: true
      });
   };
};