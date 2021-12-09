export default `playlist load`;
export const category = `voice`;
export const description = `Load a previously saved playlist and add its tracks to this server's currently playing playlist 📃`;
export const showCommand = true;


/** @param {import("discord.js").AutocompleteInteraction} interaction */
export const autocomplete = async interaction => {
   const { default: Keyv } = await import(`keyv`);
   const { KeyvFile } = await import(`keyv-file`);
   const keyv = new Keyv({
      store: new KeyvFile({
         filename: `./database.json`
      })
   });

   const playlists = await keyv.get(`playlists:${interaction.user.id}`) || [];
   return playlists.map((playlist, i) => ({
      name: playlist.name,
      value: `${i}`
   }));
};


/** @param {import("discord.js").CommandInteraction} interaction @param {import("keyv")} keyv */
export const run = async (interaction, keyv) => {
   // loading the modules will take a bit of time, so defer the reply while we wait owo
   await interaction.deferReply();


   const { joinVoiceChannel, entersState, VoiceConnectionStatus } = await import(`@discordjs/voice`);
   const { Formatters: { userMention } } = await import(`discord.js`);
   const { default: { getInfo } } = await import(`ytdl-core`);

   const { Player } = await import(`../music/player.js`);
   const { Track } = await import(`../music/track.js`);


   const playlistIndex = +interaction.options.getString(`name`);


   const playlists = await keyv.get(`playlists:${interaction.user.id}`) || [];
   const playlist = playlists[playlistIndex];


   if (!playlist)
      return await interaction.editReply({
         content: `That's not a saved playlist!`
      });


   const urls = playlist.tracks.map(track => track.url);

   // emojis
   const loading = `<a:loading:701942569210478623>`;


   await interaction.editReply({
      content: `${loading} Loading player..`
   });


   // a collection containing music data
   // this will either exist as music data or will be created and *then* exist as music data
   const data = interaction.client.music;
   let music = data.get(interaction.guild.id);


   // there's currently no music data
   const voiceChannelToJoin = interaction.member.voice.channel;

   if (!music) {
      if (!voiceChannelToJoin)
         return await interaction.editReply({
            content: `You need to be in a voice channel for me to join!`
         });

      if (voiceChannelToJoin.type !== `GUILD_VOICE`)
         return await interaction.editReply({
            content: `I can only join normal voice channels!`
         });

      if (!voiceChannelToJoin.joinable)
         return await interaction.editReply({
            content: `I can't join ${voiceChannelToJoin}!`
         });


      // create the now playing thread
      const thread = await (await interaction.fetchReply()).startThread({ name: `Now Playing 🎶` });

      // set music data
      music = new Player(
         joinVoiceChannel({
            channelId: voiceChannelToJoin.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator
         }),
         thread
      );

      music.connection.on(`error`, console.error);
      data.set(interaction.guild.id, music);
   };


   await interaction.editReply({
      content: `${loading} Connecting to ${voiceChannelToJoin}..`
   });


   // wait for the bot to be fully connected
   try {
      await entersState(music.connection, VoiceConnectionStatus.Ready, 15000); // attempt to connect in fifteen seconds, if it hasn't then the promise will reject
   } catch {
      return await interaction.followUp({ // couldn't connect, stop the connection
         content: `An error occurred trying to connect to ${voiceChannelToJoin}, please try again later.`
      });
   };


   // try to load this video id
   try {
      await interaction.editReply({
         content: `${loading} Loading tracks to the playlist..`
      });


      for (const url of urls) {
         const track = await Track.loadTrack(url, interaction.user.id, {
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

      const added = urls.length === 1
         ? `[${(await getInfo(urls[0])).videoDetails.title}](${urls[0]} "${urls[0]} 🔗")`
         : `\`${urls.length} tracks\``;

      await interaction.editReply({
         content: `Added **${added}** to the queue!`
      });

      return await (await interaction.fetchReply()).suppressEmbeds();

   } catch { // an error occurred
      return await interaction.followUp({ // couldn't connect, stop the connection
         content: `An error occurred, make sure the link is correct or try again later.`
      });
   };
};