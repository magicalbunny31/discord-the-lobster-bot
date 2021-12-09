export default `playlist save`;
export const category = `voice`;
export const description = `Save this server's current playlist to your collection 📥`;
export const showCommand = true;


/** @param {import("discord.js").CommandInteraction} interaction @param {import("keyv")} keyv */
export const run = async (interaction, keyv) => {
   const { stripIndents } = await import(`common-tags`);


   const name = interaction.options.getString(`name`);


   const data = interaction.client.music;
   const music = data.get(interaction.guild.id);


   if (!music)
      return await interaction.reply({
         content: `There's no currently playing playlist in this server!`,
         ephemeral: true
      });


   await interaction.deferReply();


   const playlists = await keyv.get(`playlists:${interaction.user.id}`) || [];

   if (playlists.some(playlistName => playlistName.name === name))
      return await interaction.editReply({
         content: stripIndents`
            \`${name}\` is already a saved playlist!
            Prefer to delete the playlist? Use the command \`/playlist delete\`
         `
      });


   playlists.push({
      name: name,
      tracks: music.queue.map(track => ({
         title: track.title,
         url: track.url
      }))
   });

   await keyv.set(`playlists:${interaction.user.id}`, playlists);


   return await interaction.editReply({
      content: `Saved this playlist as **\`${name}\`** with **\`${music.queue.length} ${music.queue.length === 1 ? `track` : `tracks`}\`**`
   });
};