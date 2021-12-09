export default `voiceStateUpdate`;
export const once = false;


/** @param {import("discord.js").VoiceState} oldState @param {import("discord.js").VoiceState} newState @param {import("keyv")} keyv */
export const listen = async (oldState, newState, keyv) => {
   const client = newState.client;

   const music = client.music.get(newState.guild.id);


   if (music && !newState.channel)
      client.music.delete(newState.guild.id);
};