export default `play youtube search`;
export const category = `voice`;
export const description = `Search YouTube and stream a video's audio 🔉`;
export const showCommand = true;


/** @param {import("discord.js").AutocompleteInteraction} interaction */
export const autocomplete = async interaction => {
   const util = await import(`util`);
   const runAutocomplete = util.promisify((await import(`youtube-autocomplete`)).default);

   const input = interaction.options.getFocused();
   if (!input) return [];

   const queries = (await runAutocomplete(input))[1];
   return  [ ...new Set([ input ].concat(queries.slice(0, 10))) ].map(result => ({
      name: result,
      value: result
   }));
};


/** @param {import("discord.js").CommandInteraction} interaction @param {import("keyv")} keyv */
export const run = async (interaction, keyv) => {
   // loading the modules will take a bit of time, so defer the reply while we wait owo
   await interaction.deferReply();


   const { joinVoiceChannel, entersState, VoiceConnectionStatus } = await import(`@discordjs/voice`);
   const { MessageActionRow, MessageSelectMenu, MessageButton, Formatters: { userMention } } = await import(`discord.js`);
   const { default: { validateURL, getInfo } } = await import(`ytdl-core`);
   const { default: fetch } = await import(`node-fetch`);
   const { stripIndents } = await import(`common-tags`);

   const { readFileSync } = await import(`fs`);
   const config = JSON.parse(readFileSync(`./config.json`, `utf-8`));
   const pkg = JSON.parse(readFileSync(`./package.json`, `utf-8`));

   const { Player } = await import(`../music/player.js`);
   const { Track } = await import(`../music/track.js`);


   // emojis
   const loading = `<a:loading:701942569210478623>`;


   const searchTerm = interaction.options.getString(`search-term`);


   await interaction.editReply({
      content: `${loading} Loading options..`
   });


   try {
      const results = await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${searchTerm}&type=video&key=${process.env.YOUTUBE_DATA_API_V3}`, {
         headers: {
            "Accept": `application/json`,
            "User-Agent": `${pkg.name}/${pkg.version} (${config.github})`
         }
      })
         .then(res => res.json())
         .then(res => res.items.map(r => ({
            title: r.snippet.title,
            channel: r.snippet.channelTitle,
            url: `https://youtu.be/${r.id.videoId}`
         })));

      const row = new MessageActionRow({
         components: [
            new MessageSelectMenu({
               customId: `${interaction.id}:search`,
               placeholder: `Select a video..`,
               options: results.map(item => [{
                  label: item.title,
                  value: item.url,
                  description: item.channel
               }])
            })
         ]
      });

      await interaction.editReply({
         content: `Choose a video from below!`,
         components: [ row ]
      });


   } catch (error) {
      return await interaction.editReply({
         content: stripIndents`
            An error occurred trying to fetch videos.
            If this problem doesn't fix itself, use \`/play youtube url\`
         `
      });
   };


   let urls;
   try {
      const selectMenuInteraction = await interaction.channel.awaitMessageComponent({
         filter: i => i.customId.startsWith(interaction.id),
         time: 120000 // 2 minutes
      });

      await selectMenuInteraction.deferUpdate();
      urls = selectMenuInteraction.values;


   } catch {
      const [ row ] = (await interaction.fetchReply()).components;
      row.components[0].disabled = true;

      return await interaction.editReply({
         components: [ row ]
      });
   };


   await interaction.editReply({
      content: `${loading} Loading player..`,
      components: []
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