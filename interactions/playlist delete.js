export default `playlist delete`;
export const category = `voice`;
export const description = `Delete a saved playlist ❌`;
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
   const playlistIndex = +interaction.options.getString(`name`);


   await interaction.deferReply();


   const playlists = await keyv.get(`playlists:${interaction.user.id}`) || [];
   const playlist = playlists[playlistIndex];


   if (!playlist)
      return await interaction.editReply({
         content: `That's not a saved playlist!`
      });


   const [{ name: playlistName, tracks: playlistTracks }] = playlists.splice(playlistIndex, 1);
   await keyv.set(`playlists:${interaction.user.id}`, playlists);


   return await interaction.editReply({
      content: `Deleted playlist: **\`${playlistName}\`**, with **\`${playlistTracks.length} ${playlistTracks.length === 1 ? `track` : `tracks`}\`**`
   });
};