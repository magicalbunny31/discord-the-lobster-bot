export default `ready`;
export const once = true;


/** @param {import("discord.js").Client} client @param {import("keyv")} keyv */
export const listen = async (client, keyv) => {
   const { readdirSync } = await import(`fs`);


   const commands = (
      await Promise.all(
         readdirSync(`./interactions`)
            .map(async command => (await import(`../interactions/${command}`)))
      )
   );

   const globalCommands = [], guildCommands = [];
   for (const command of commands.filter(command => command.data))
      !command.guild
         ? globalCommands.push(command.data)
         : guildCommands.push(command.data);

   // global commands
   await client.application.commands.set(globalCommands);

   // guild commands
   const guilds = await client.guilds.fetch();
   guilds.each(async guild => {
      const fetchedGuild = await guild.fetch();
      if (!fetchedGuild.available) return;

      const setCommands = await fetchedGuild.commands.set(guildCommands);

      const permissions = commands
         .filter(command => command.guild && command.permissions)
         .map(command => ({ name: command.default, permissions: command.permissions }));

      for (let i = 0; i < permissions.length; i ++) {
         const { name, permissions: permission } = permissions[i];

         const setCommand = setCommands.find(c => c.name === name);
         permissions.splice(i, 1, {
            id: setCommand.id,
            permissions: permission
         });
      };

      await fetchedGuild.commands.permissions.set({ fullPermissions: permissions });
   });


   // set up changing statuses at thirty minute intervals
   setInterval(async () => {
      const statuses = await keyv.get(`statuses`) || [{ type: `PLAYING`, name: `in Mighty Lobster [OFFICIAL] 🦞` }];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      client.user.setPresence({
         status: `online`,
         activities: [{
            name: status.name,
            type: status.type
         }]
      });
   }, 1.8e+6);


   // when the fox is logged, we're pretty much ready!
   return console.log(`🦊 connected to discord!`);
};