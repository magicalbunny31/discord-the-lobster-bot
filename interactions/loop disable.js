export default `loop disable`;
export const category = `voice`;
export const description = `Disable looping ❌`;
export const showCommand = true;


/** @param {import("discord.js").CommandInteraction} interaction @param {import("keyv")} keyv */
export const run = async (interaction, keyv) => {
   const { stripIndents } = await import(`common-tags`);


   // a collection containing music data
   // this will either exist as music data or will be created and *then* exist as music data
   const data = interaction.client.music;
   let music = data.get(interaction.guild.id);


   if (music) {
      if (!music.loopSingle && !music.loopQueue) {
         return await interaction.reply({
            content: stripIndents`
               There's currently no looping enabled!
               You can enable looping with \`/loop single\` or \`/loop queue\`
            `,
            ephemeral: true
         });


      } else {
         music.loopSingle = false;
         music.loopQueue = false;

         return await interaction.reply({
            content: `Disabled looping!`
         });
      };


   } else {
      return await interaction.reply({
         content: `There's no audio playing in this server!`,
         ephemeral: true
      });
   };
};