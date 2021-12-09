export default `messageCreate`;
export const once = false;


/** @param {import("discord.js").Message} message @param {import("keyv")} keyv */
export const listen = async (message, keyv) => {
   // awesome function to check if the bot was mentioned
   const botMentioned = mention => {
      if (!mention.startsWith(`<@`) && !mention.endsWith(`>`))
         return false;

      let id = mention.slice(2, -1);

      if (id.startsWith(`!`))
         id = id.slice(1);

      if (id === message.client.user.id) return true;
      else return false;
   };

   // looks like the bot *was* mentioned!
   if (botMentioned(message.content))
      return await message.reply({
         content: `> Commands: \`/help\` 🦞`,
         allowedMentions: {
            repliedUser: false
         }
      });
};