export default `onMessage`;


/** @param {string} channel @param {string} user @param {string} message @param {TwitchPrivateMessage} msg @param {import("discord.js").Client} discord @param {import("keyv")} keyv */
export const listen = async (channel, user, message, msg, discord, keyv) => {
   // posts twitch chat to #live-chat (918619127931875439) in Mighty Lobster [OFFICIAL]
   const guildId = `580083229282009141`;
   const channelId = `918619127931875439`;

   const liveChat = await (await discord.guilds.fetch(guildId)).channels.fetch(channelId);
   return await liveChat.send({
      content: `**\`${user}\`**: ${message}`,
      allowedMentions: {
         parse: []
      }
   });
};