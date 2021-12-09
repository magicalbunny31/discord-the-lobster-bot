export default `bot-channel add`;
export const category = `utils`;
export const description = `Add a channel where my commands can be used ➕`;
export const showCommand = true;


/** @param {import("discord.js").CommandInteraction} interaction @param {import("keyv")} keyv */
export const run = async (interaction, keyv) => {
   const channel = interaction.options.getChannel(`channel`);


   await interaction.deferReply();


   const allowedChannels = await keyv.get(`channels`) || [];


   if (allowedChannels.includes(channel.id))
      return await interaction.editReply({
         content: `${channel} is already on the list!`
      });


   allowedChannels.push(channel.id);
   await keyv.set(`channels`, allowedChannels);


   return await interaction.editReply({
      content: `Added ${channel} to the list!`
   });
};