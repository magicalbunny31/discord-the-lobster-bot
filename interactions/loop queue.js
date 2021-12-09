export default `loop queue`;
export const category = `voice`;
export const description = `Loop the currently playing playlist 🔁`;
export const showCommand = true;


/** @param {import("discord.js").CommandInteraction} interaction @param {import("keyv")} keyv */
export const run = async (interaction, keyv) => {
   const { stripIndents } = await import(`common-tags`);


   // a collection containing music data
   // this will either exist as music data or will be created and *then* exist as music data
   const data = interaction.client.music;
   let music = data.get(interaction.guild.id);


   if (music) {
      if (music.loopQueue) {
         return await interaction.reply({
            content: stripIndents`
               Looping is already enabled for the whole queue!
               You can disable looping with \`/loop disable\`
            `,
            ephemeral: true
         });


      } else {
         music.loopSingle = false;
         music.loopQueue = true;

         return await interaction.reply({
            content: `Looping the whole queue!`
         });
      };


   } else {
      return await interaction.reply({
         content: `There's no audio playing in this server!`,
         ephemeral: true
      });
   };
};