export default `statuses add`;
export const category = `utils`;
export const description = `Add a new status ➕`;
export const showCommand = true;


/** @param {import("discord.js").CommandInteraction} interaction @param {import("keyv")} keyv */
export const run = async (interaction, keyv) => {
   const type = interaction.options.getString(`type`);
   const name = interaction.options.getString(`name`);


   await interaction.deferReply();


   const statuses = await keyv.get(`statuses`) || [];
   statuses.push({ type: type, name: name });
   await keyv.set(`statuses`, statuses);


   const statusType = {
      PLAYING: `Playing`,
      WATCHING: `Watching`,
      LISTENING: `Listening to`,
      COMPETING: `Competing in`
   }[type];


   return await interaction.editReply({
      content: `Added status: **\`${statusType}\`**\` ${name}\``
   });
};