export default `loop single`;
export const category = `voice`;
export const description = `Loop the currently playing track 🔂`;
export const showCommand = true;


/** @param {import("discord.js").CommandInteraction} interaction @param {import("keyv")} keyv */
export const run = async (interaction, keyv) => {
   const { stripIndents } = await import(`common-tags`);


   // a collection containing music data
   // this will either exist as music data or will be created and *then* exist as music data
   const data = interaction.client.music;
   let music = data.get(interaction.guild.id);


   if (music) {
      if (music.loopSingle) {
         return await interaction.reply({
            content: stripIndents`
               Looping is already enabled for this track!
               You can disable looping with \`/loop disable\`
            `,
            ephemeral: true
         });


      } else {
         music.loopSingle = true;
         music.loopQueue = false;

         return await interaction.reply({
            content: `Looping the current track!`
         });
      };


   } else {
      return await interaction.reply({
         content: `There's no audio playing in this server!`,
         ephemeral: true
      });
   };
};