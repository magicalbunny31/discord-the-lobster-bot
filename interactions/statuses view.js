export default `statuses view`;
export const category = `utils`;
export const description = `View current statuses 💬`;
export const showCommand = true;


/** @param {import("discord.js").CommandInteraction} interaction @param {import("keyv")} keyv */
export const run = async (interaction, keyv) => {
   await interaction.deferReply();


   const statuses = await keyv.get(`statuses`) || [];


   if (!statuses.length)
      return await interaction.editReply({
         content: `There are no statuses to list`
      });


   const formattedStatuses = statuses.map(status => {
      const statusType = {
         PLAYING: `Playing`,
         WATCHING: `Watching`,
         LISTENING: `Listening to`,
         COMPETING: `Competing in`
      }[status.type];

      return `**\`${statusType}\`**\` ${status.name}\``;
   });


   return await interaction.editReply({
      content: formattedStatuses.join(`\n`)
   });
};