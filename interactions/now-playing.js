export default `now-playing`;
export const category = `voice`;
export const description = `View information about the track that's currently playing 📃`;
export const showCommand = true;
export const guild = true;


/** @type {import("discord.js").ApplicationCommandData} */
export const data = {
   name: `now-playing`,
   description: `View information about the track that's currently playing 📃`
};


/** @param {import("discord.js").CommandInteraction} interaction @param {import("keyv")} keyv */
export const run = async (interaction, keyv) => {
   const { Formatters: { userMention } } = await import(`discord.js`);


   // a collection containing music data
   // this will either exist as music data or will be created and *then* exist as music data
   const data = interaction.client.music;
   let music = data.get(interaction.guild.id);


   if (music) {
      const metadata = music.player.state.resource?.metadata;
      const current = metadata
         ? `**\`Now Playing\`**: **[${music.player.state.resource.metadata.title}](${music.player.state.resource.metadata.url} "${music.player.state.resource.metadata.url} 🔗")** : ${userMention(music.player.state.resource.metadata.requestedBy)}`
         : music.queue.length
            ? `**\`Now Playing\`**: **Loading..**`
            : `**\`Now Playing\`**: **Nothing right now**`;

      await interaction.reply({
         content: current,
         allowedMentions: {
            parse: []
         }
      });

      return await (await interaction.fetchReply()).suppressEmbeds();


   } else {
      return await interaction.reply({
         content: `There's no audio playing in this server!`,
         ephemeral: true
      });
   };
};