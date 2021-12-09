export default `bot-channel view`;
export const category = `utils`;
export const description = `View the channels where my commands can be used 📋`;
export const showCommand = true;


/** @param {import("discord.js").CommandInteraction} interaction @param {import("keyv")} keyv */
export const run = async (interaction, keyv) => {
   const { Formatters: { channelMention } } = await import(`discord.js`);


   await interaction.deferReply();


   const allowedChannelIds = await keyv.get(`channels`) || [];


   if (!allowedChannelIds.length)
      return await interaction.editReply({
         content: `There are no channels to list`
      });


   const channelExists = async channelId => {
      try {
         return await interaction.guild.channels.fetch(channelId);
      } catch {
         return null;
      };
   };


   const allowedChannels = await Promise.all(
      allowedChannelIds.map(async channelId => await channelExists(channelId))
   );

   const formattedAllowedChannels = await Promise.all(
      allowedChannels.map(channel => `${channel?.parent ? `**${channel.parent.name}** | ` : ``}${channel || `\`#deleted-channel\``} (\`${channel?.id || `unknown`}\`)`)
   );


   return await interaction.editReply({
      content: formattedAllowedChannels.join(`\n`)
   });
};