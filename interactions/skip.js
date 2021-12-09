export default `skip`;
export const category = `voice`;
export const description = `Skip the currently playing track ⏩`;
export const showCommand = true;
export const guild = true;


/** @type {import("discord.js").ApplicationCommandData} */
export const data = {
   name: `skip`,
   description: `Skip the currently playing track ⏩`,
   options: [{
      type: `STRING`,
      name: `remove-from-queue`,
      description: `Also remove this track from the queue? 📃`,
      required: false,
      choices: [{
         name: `Remove this track from the queue ✅`,
         value: `yes`
      }, {
         name: `Don't remove this track from the queue ❌`,
         value: `no`
      }]
   }]
};


/** @param {import("discord.js").CommandInteraction} interaction @param {import("keyv")} keyv */
export const run = async (interaction, keyv) => {
   const { AudioPlayerStatus } = await import(`@discordjs/voice`);
   const { Formatters: { userMention } } = await import(`discord.js`);
   const { Track } = await import(`../music/track.js`);


   const removeFromQueue = interaction.options.getString(`remove-from-queue`) !== `no`;


   // a collection containing music data
   // this will either exist as music data or will be created and *then* exist as music data
   const data = interaction.client.music;
   let music = data.get(interaction.guild.id);


   if (music) {
      const wasPlaying = music.player.state.resource?.metadata;

      if (!wasPlaying)
         return await interaction.reply({
            content: `Looks like nothing is currently playing.`,
            ephemeral: true
         });

      await interaction.deferReply(); // defer this reply, as it could have to re-add the track to the queue

      music.player.stop(true); // stopping the player will only put the connection on idle, which will automatically skip to the next track


      if (!removeFromQueue) { // add this track back to the end of this queue if this isn't being removed
         const track = await Track.loadTrack(wasPlaying.url, wasPlaying.requestedBy, {
            onStart(title, requesterId) {
               music.thread.send({
                  content: `**\`Now playing\`**: **${title}**, requested by ${userMention(requesterId)}`,
                  allowedMentions: {
                     parse: []
                  }
               }).catch(console.warn);
            },
            onFinish() {},
            onError(error) {
               console.error(error);
               music.thread.send({
                  content: `**\`An error has occurred\`**`
               }).catch(console.warn);
            }
         });

         music.enqueue(track); // add the track to the queue
      };

      await interaction.editReply({
         content: `Skipped **[${wasPlaying.title}](${wasPlaying.url} "${wasPlaying.url} 🔗")**`
      });

      return await (await interaction.fetchReply()).suppressEmbeds();


   } else {
      return await interaction.reply({
         content: `There's no audio playing in this server!`,
         ephemeral: true
      });
   };
};