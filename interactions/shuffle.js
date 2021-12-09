export default `shuffle`;
export const category = `voice`;
export const description = `Shuffle the currently playing playlist 🔀`;
export const showCommand = true;
export const guild = true;


/** @type {import("discord.js").ApplicationCommandData} */
export const data = {
   name: `shuffle`,
   description: `Shuffle the currently playing playlist 🔀`
};


/** @param {import("discord.js").CommandInteraction} interaction @param {import("keyv")} keyv */
export const run = async (interaction, keyv) => {
   // a collection containing music data
   // this will either exist as music data or will be created and *then* exist as music data
   const data = interaction.client.music;
   let music = data.get(interaction.guild.id);


   if (music) {
      await interaction.deferReply();

      music.queue = music.queue.sort(() => 0.5 - Math.random()); // i know this is *slightly* biased, but it's good enough man

      return await interaction.editReply({
         content: `Shuffled queue!`
      });


   } else {
      return await interaction.reply({
         content: `There's no audio playing in this server!`,
         ephemeral: true
      });
   };
};