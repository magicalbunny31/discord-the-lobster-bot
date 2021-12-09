export default `join`;
export const category = `voice`;
export const description = `Join me to your voice channel 🔉`;
export const showCommand = true;
export const guild = true;


/** @type {import("discord.js").ApplicationCommandData} */
export const data = {
   name: `join`,
   description: `Join me to your voice channel 🔉`
};


/** @param {import("discord.js").CommandInteraction} interaction @param {import("keyv")} keyv */
export const run = async (interaction, keyv) => {
   const { joinVoiceChannel } = await import(`@discordjs/voice`);


   const voiceChannelToJoin = interaction.member.voice.channel;


   if (!voiceChannelToJoin)
      return await interaction.reply({
         content: `You need to be in a voice channel for me to join!`,
         ephemeral: true
      });


   if (voiceChannelToJoin.type !== `GUILD_VOICE`)
      return await interaction.reply({
         content: `I can only join normal voice channels!`,
         ephemeral: true
      });


   if (!voiceChannelToJoin.joinable)
      return await interaction.reply({
         content: `I can't join ${voiceChannelToJoin}!`,
         ephemeral: true
      });


   if (interaction.guild.me.voice.channel && interaction.guild.me.voice.channel.id === voiceChannelToJoin.id)
      return await interaction.reply({
         content: `I'm already in this channel!`,
         ephemeral: true
      });


   await interaction.deferReply();


   joinVoiceChannel({
      channelId: voiceChannelToJoin.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator
   });


   return await interaction.editReply({
      content: `Hello! 👋 I've joined ${voiceChannelToJoin}`
   });
};