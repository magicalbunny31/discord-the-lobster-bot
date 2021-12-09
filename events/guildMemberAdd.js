export default `guildMemberAdd`;
export const once = false;


/** @param {import("discord.js").GuildMember} member @param {import("keyv")} keyv */
export const listen = async (member, keyv) => {
   const { Formatters: { channelMention } } = await import(`discord.js`);
   const { stripIndents } = await import(`common-tags`);


   const guildId = `580083229282009141`; // Mighty Lobster [OFFICIAL]

   if (member.guild.id !== guildId) return;


   const joinsChannel = await member.guild.channels.fetch(`644949542667550772`); // #entries-and-exits

   const rules = channelMention(`691341882353123428`);
   const verification = channelMention(`694174709893431297`);

   return await joinsChannel.send({
      content: stripIndents`
         Hi, ${member}! Welcome to the official Mighty Lobster Discord server!
         Check out ${rules} and ${verification} to gain access to the server!
      `
   });
};