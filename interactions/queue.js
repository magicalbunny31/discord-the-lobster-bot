export default `queue`;
export const category = `voice`;
export const description = `View the currently playing queue 📃`;
export const showCommand = true;
export const guild = true;


/** @type {import("discord.js").ApplicationCommandData} */
export const data = {
   name: `queue`,
   description: `View the currently playing queue 📃`
};


/** @param {import("discord.js").CommandInteraction} interaction @param {import("keyv")} keyv */
export const run = async (interaction, keyv) => {
   const { Formatters: { userMention } } = await import(`discord.js`);
   const { stripIndents } = await import(`common-tags`);


   // a collection containing music data
   // this will either exist as music data or will be created and *then* exist as music data
   const data = interaction.client.music;
   let music = data.get(interaction.guild.id);


   if (music) {
      const metadata = music.player.state.resource?.metadata;
      const current = metadata
         ? `**[${metadata.title}](${metadata.url} "${metadata.url} 🔗")** : ${userMention(metadata.requestedBy)}`
         : music.queue.length
            ? `**Loading..**`
            : `**Nothing right now**`;

      const queue = music.queue
         .slice(0, 10)
         .map((track, index) => `\`${index + 1}.\` **[${track.title}](${track.url} "${track.url} 🔗")** : ${userMention(track.requestedBy)}`)
         .join(`\n`);

      await interaction.reply({
         content: stripIndents`
            **\`Now Playing\`**: ${current} ${music.loopSingle ? `🔂` : music.loopQueue ? `🔁` : ``}
            ${queue}
            ${music.queue.length > 10 ? `(Only showing the first ten tracks)` : ``}
         `,
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