export default `leave`;
export const category = `voice`;
export const description = `Disconnect me from my voice channel 📲`;
export const showCommand = true;
export const guild = true;


/** @type {import("discord.js").ApplicationCommandData} */
export const data = {
   name: `leave`,
   description: `Disconnect me from my voice channel 📲`
};


/** @param {import("discord.js").CommandInteraction} interaction @param {import("keyv")} keyv */
export const run = async (interaction, keyv) => {
   const { getVoiceConnection } = await import(`@discordjs/voice`);


   const connection = getVoiceConnection(interaction.guild.id);


   if (!connection)
      return await interaction.reply({
         content: `I'm not connected to a voice channel in this server!`,
         ephemeral: true
      });


   await interaction.deferReply();


   connection.destroy();


   return await interaction.editReply({
      content: `I'm now leaving ${interaction.guild.me.voice.channel} 👋`
   });
};