export default `guildMemberRemove`;
export const once = false;


/** @param {import("discord.js").GuildMember} member @param {import("keyv")} keyv */
export const listen = async (member, keyv) => {


   const guildId = `580083229282009141`; // Mighty Lobster [OFFICIAL]

   if (member.guild.id !== guildId) return;


   const leavesChannel = await member.guild.channels.fetch(`644949542667550772`); // #entries-and-exits

   return await leavesChannel.send({
      content: `\`${member.user.tag}\` wasn't cool enough and left the server..`
   });
};