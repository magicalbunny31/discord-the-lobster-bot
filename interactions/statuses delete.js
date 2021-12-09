export default `statuses delete`;
export const category = `utils`;
export const description = `Delete a status ❌`;
export const showCommand = true;


/** @param {import("discord.js").AutocompleteInteraction} interaction */
export const autocomplete = async interaction => {
   const { default: Keyv } = await import(`keyv`);
   const { KeyvFile } = await import(`keyv-file`);
   const keyv = new Keyv({
      store: new KeyvFile({
         filename: `./database.json`
      })
   });

   const statuses = await keyv.get(`statuses`) || [];

   return statuses.map((status, i) => {
      const statusType = {
         PLAYING: `Playing`,
         WATCHING: `Watching`,
         LISTENING: `Listening to`,
         COMPETING: `Competing in`
      }[status.type];

      return {
         name: `${statusType} ${status.name}`,
         value: `${i}`
      };
   });
};


/** @param {import("discord.js").CommandInteraction} interaction @param {import("keyv")} keyv */
export const run = async (interaction, keyv) => {
   const name = +interaction.options.getString(`name`);


   await interaction.deferReply();


   const statuses = await keyv.get(`statuses`) || [];

   const status = statuses[name];

   if (!status)
      return await interaction.editReply({
         content: `That's not a status!`
      });

   const statusType = {
      PLAYING: `Playing`,
      WATCHING: `Watching`,
      LISTENING: `Listening to`,
      COMPETING: `Competing in`
   }[status.type];

   statuses.splice(name, 1);
   await keyv.set(`statuses`, statuses);


   return await interaction.editReply({
      content: `Deleted status: **\`${statusType}\`**\` ${status.name}\``
   });
};