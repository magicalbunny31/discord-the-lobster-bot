export default `bot-channel remove`;
export const category = `utils`;
export const description = `Remove a channel from the list of channels where my commands can be used ➖`;
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

   const allowedChannelIds = await keyv.get(`channels`) || [];
   const allowedChannels = await Promise.all(
      allowedChannelIds.map(async channelId => {
         try {
            return await interaction.guild.channels.fetch(channelId);
         } catch {
            return null;
         };
      })
   );

   return allowedChannels.map((channel, i) => ({
      name: `${channel?.parent ? `${channel.parent.name} | ` : ``}#${channel?.name || `deleted-channel`} (${channel?.id || `unknown`})`,
      value: `${i}`
   }));
};


/** @param {import("discord.js").CommandInteraction} interaction @param {import("keyv")} keyv */
export const run = async (interaction, keyv) => {
   const { Formatters: { channelMention } } = await import(`discord.js`);
   const channelIndex = +interaction.options.getString(`name`);


   await interaction.deferReply();


   const channels = await keyv.get(`channels`) || [];
   const channel = channels[channelIndex];

   if (!channel)
      return await interaction.editReply({
         content: `This channel isn't on the list!`
      });

   const [ channelId ] = channels.splice(channelIndex, 1);
   await keyv.set(`channels`, channels);


   const channelExists = async () => {
      try {
         return await interaction.guild.channels.fetch(channelId);
      } catch {
         return null;
      };
   };


   return await interaction.editReply({
      content: `Deleted channel: ${await channelExists() ? channelMention(channelId) : `\`#deleted-channel\``} (\`${await channelExists() ? channelId : `unknown`}\`)`
   });
};