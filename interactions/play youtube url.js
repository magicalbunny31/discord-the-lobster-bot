export default `play youtube url`;
export const category = `voice`;
export const description = `Stream a video's audio from a YouTube URL 🔉`;


// import Player from "../music/player.js";
// import Track from "../music/track.js";
/** @param {import("discord.js").CommandInteraction} interaction @param {import("keyv")} keyv */
export const run = async (interaction, keyv) => {
   // loading the modules will take a bit of time, so defer the reply while we wait owo
   await interaction.deferReply();


   const { joinVoiceChannel, entersState, VoiceConnectionStatus } = await import(`@discordjs/voice`);
   const { MessageActionRow, MessageButton, Formatters: { userMention } } = await import(`discord.js`);
   const { default: { validateURL, getInfo } } = await import(`ytdl-core`);
   const { default: fetch } = await import(`node-fetch`);

   const { readFileSync } = await import(`fs`);
   const config = JSON.parse(readFileSync(`./config.json`, `utf-8`));
   const pkg = JSON.parse(readFileSync(`./package.json`, `utf-8`));


   const { Player } = await import(`../music/player.js`);
   const { Track } = await import(`../music/track.js`);


   // emojis
   const loading = `<a:loading:701942569210478623>`;


   await interaction.editReply({
      content: `${loading} Fetching info on link..`
   });


   // check if this is a valid youtube url
   const urls = [ interaction.options.getString(`url`) ];

   const isVideo = validateURL(urls[0]); // will also be true for playlist urls
   const playlistRegex = /^.*(youtu.be\/|youtube.com\/)(playlist\?list=)([^#\&\?]*).*/;
   const isPlaylist = playlistRegex.test(urls[0]);

   if (isPlaylist) {
      try {
         const playlistId = urls[0].match(playlistRegex)[3];
         const listOfVideoURLs = await fetch(`https://youtube.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=50&playlistId=${playlistId}&key=${process.env.YOUTUBE_DATA_API_V3}`, {
            headers: {
               "Accept": `application/json`,
               "User-Agent": `${pkg.name}/${pkg.version} (${config.github})`
            }
         })
            .then(res => res.json())
            .then(res => res.items.map(r => `https://youtu.be/${r.contentDetails.videoId}`));

         urls.splice(0, 1, ...listOfVideoURLs);

      } catch {
         return await interaction.editReply({
            content: `**\`${urls[0]}\`** isn't a valid YouTube URL!`,
            components: [
               new MessageActionRow({
                  components: [
                     new MessageButton({
                        label: `Go to YouTube`,
                        style: `LINK`,
                        url: `https://www.youtube.com`
                     })
                  ]
               })
            ]
         });
      };


   } else if (!isVideo) { // this isn't a valid url
      return await interaction.editReply({
         content: `**\`${urls[0]}\`** isn't a valid YouTube URL!`,
         components: [
            new MessageActionRow({
               components: [
                  new MessageButton({
                     label: `Go to YouTube`,
                     style: `LINK`,
                     url: `https://www.youtube.com`
                  })
               ]
            })
         ]
      });
   };


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