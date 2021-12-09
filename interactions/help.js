export default `help`;
export const category = `utils`;
export const description = `Help with The Lobster Bot 🦞`;
export const showCommand = true;


/** @type {import("discord.js").ApplicationCommandData} */
export const data = {
   name: `help`,
   description: `Help with The Lobster Bot 🦞`
};


/** @param {import("discord.js").CommandInteraction} interaction @param {import("keyv")} keyv */
export const run = async (interaction, keyv) => {
   const { MessageActionRow, MessageSelectMenu, MessageEmbed, Formatters } = await import(`discord.js`);
   const { stripIndents } = await import(`common-tags`);
   const { readdirSync, readFileSync } = await import(`fs`);
   const { default: emoji } = await import(`../assets/emoji.js`);

   const config = JSON.parse(readFileSync(`./config.json`, `utf-8`));


   const commands = (
      await Promise.all(
         readdirSync(`./interactions`)
            .map(async command => (await import(`../interactions/${command}`)))
      )
   )
      .filter(command => command.showCommand);


   const row = new MessageActionRow({
      components: [
         new MessageSelectMenu({
            customId: `${interaction.id}:help`,
            placeholder: `Change category`,
            options: [{
               label: `Moderation`,
               value: `moderation`,
               emoji: `🔧`
            }, {
               label: `Utils`,
               value: `utils`,
               emoji: `📦`
            }, {
               label: `Links`,
               value: `links`,
               emoji: `🔗`
            }, {
               label: `Voice`,
               value: `voice`,
               emoji: `🔉`
            }]
         })
      ]
   });


   const developer = Formatters.userMention(config.developer);
   const happ = `<:happ:906683365791502366>`;

   const embed = new MessageEmbed({
      color: `#003eff`,
      description: stripIndents`
         ${interaction.client.user} : **[Mighty Lobster [OFFICIAL]](${config.invite} "${config.invite} 🔗")**

         **Commands** 📘
         › **\`View via the select menu\`**

         \`developer\` › ${developer} 2021-present ${happ}
         \`github\` › [link to repository](${config.github} "${config.github} 🔗")
      `
   });


   await interaction.reply({
      embeds: [ embed ],
      components: [ row ]
   });


   const menu = interaction.channel.createMessageComponentCollector({
      filter: i => i.customId.startsWith(interaction.id),
      time: 900000 - (Date.now() - interaction.createdTimestamp),
      idle: 120000
   });


   menu.on(`collect`, async selectMenuInteraction => {
      if (selectMenuInteraction.user.id !== interaction.user.id)
         return await selectMenuInteraction.reply({
            content: `This isn't your select menu, use \`/help\` to open your own.`,
            ephemeral: true
         });

      const [ category ] = selectMenuInteraction.values;

      for (const option of row.components[0].options)
         option.default = false;

      const options = row.components[0].options;
      const i = options.findIndex(option => option.value === category);
      options[i].default = true;

      const commandsInThisCategory = commands
         .filter(command => command.category === category)
         .map(command => `› \`/${command.default}\` - ${command.description.replace(emoji, e => `\\${e}`)}`);

      embed.description = stripIndents`
         ${interaction.client.user} : **[Mighty Lobster [OFFICIAL]](${config.invite} "${config.invite} 🔗")**

         **Commands** 📘
         ${commandsInThisCategory.join(`\n`)}

         \`developer\` › ${developer} 2021-present ${happ}
         \`github\` › [link to repository](${config.github} "${config.github} 🔗")
      `;

      return await selectMenuInteraction.update({
         embeds: [ embed ],
         components: [ row ]
      });
   });


   menu.on(`end`, async (collected, reason) => {
      if (![ `time`, `idle` ].includes(reason)) return;

      row.components[0].disabled = true;

      embed.footer = {
         text: `This menu has timed out ⌚`
      };

      return await interaction.editReply({
         embeds: [ embed ],
         components: [ row ]
      });
   });
};