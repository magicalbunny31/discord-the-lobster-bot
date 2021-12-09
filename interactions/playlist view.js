export default `playlist view`;
export const category = `voice`;
export const description = `View your saved playlists 📋`;
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
   const { stripIndents } = await import(`common-tags`);


   const playlistIndex = interaction.options.getString(`name`);


   await interaction.deferReply();


   const playlists = await keyv.get(`playlists:${interaction.user.id}`) || [];
   const playlist = playlists[+playlistIndex];


   if (!playlists.length)
      return await interaction.editReply({
         content: `You have no saved playlists!`
      });


   if (playlistIndex === null) { // view all playlists
      const formattedPlaylists = playlists.map(playlist => `**\`${playlist.name}\`** : **\`${playlist.tracks.length} ${playlist.tracks.length === 1 ? `track` : `tracks`}\`**`);

      return await interaction.editReply({
         content: formattedPlaylists.join(`\n`)
      });


   } else { // view a specific playlist
      const formattedPlaylistTracks = playlist.tracks.map(({ title, url }, i) => `\`${i + 1}.\` **[${title}](${url} "${url} 🔗")**`);

      await interaction.editReply({
         content: stripIndents`
            **\`${playlist.name}\`**
            ${formattedPlaylistTracks.join(`\n`)}
         `
      });

      return await (await interaction.fetchReply()).suppressEmbeds();
   };
};