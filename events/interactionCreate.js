export default `interactionCreate`;
export const once = false;


/** @param {import("discord.js").Interaction} interaction @param {import("keyv")} keyv */
export const listen = async (interaction, keyv) => {
   const { default: fuzzysort } = await import(`fuzzysort`);


   if (interaction.isSelectMenu()) return;


   const mightyLobsterGuild = `580083229282009141`; // Mighty Lobster [OFFICIAL]
   const staff = `754019782076137542`; // @staff (Mighty Lobster [OFFICIAL])
   const allowedChannels = await keyv.get(`channels`) || [];
   if (!allowedChannels.includes(interaction.channel.id) && !interaction.member.roles.cache.has(staff) && interaction.guild.id === mightyLobsterGuild && interaction.inGuild())
      return await interaction.reply({
         content: `You can only use commands in a valid bot channel.`,
         ephemeral: true
      });


   const subcommandGroup = interaction.options?.getSubcommandGroup(false);
   const subcommand      = interaction.options?.getSubcommand(false);
   const commandName     = interaction.commandName || interaction.customId;

   const command =
      subcommandGroup
         ? await import(`../interactions/${commandName} ${subcommandGroup} ${subcommand}.js`)
         : subcommand
            ? await import(`../interactions/${commandName} ${subcommand}.js`)
            : await import(`../interactions/${commandName}.js`);


   if (interaction.isApplicationCommand() || interaction.isButton()) {
      return await command.run(interaction, keyv);


   } else if (interaction.isAutocomplete()) {
      const input = interaction.options.getFocused();
      const choices = await command.autocomplete(interaction);

      const sortedChoices = fuzzysort.go(input, choices, {
         threshold: -Infinity,
         limit: 25,
         allowTypo: true,
         keys: [ `name`, `value` ]
      }).map(choice => choice.obj);

      if (input) return await interaction.respond(sortedChoices);
      else       return await interaction.respond(choices.slice(0, 25));


   } else return;
};