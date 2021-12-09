export default `ban`;
export const category = `moderation`;
export const description = `Ban a member 🔨`;
export const showCommand = true;
export const guild = true;


/** @type {import("discord.js").ApplicationCommandPermissions[]} */
export const permissions = [{
   id: `754019782076137542`, // staff (Mighty Lobster [OFFICIAL])
   type: `ROLE`,
   permission: true
}];


/** @type {import("discord.js").ApplicationCommandData} */
export const data = {
   name: `ban`,
   description: `Ban a member 🔨`,
   options: [{
      type: `USER`,
      name: `member`,
      description: `Member to ban 👥`,
      required: true
   }, {
      type: `STRING`,
      name: `reason`,
      description: `Reason why this member will be banned 📝`,
      required: false
   }],
   defaultPermission: false
};


/** @param {import("discord.js").CommandInteraction} interaction @param {import("keyv")} keyv */
export const run = async (interaction, keyv) => {
   const user = interaction.options.getUser(`member`);
   const member = interaction.options.getMember(`member`);

   const reason = interaction.options.getString(`reason`);
   const formattedReason = `${interaction.user.tag} (${interaction.user.id}) banned this user because: ${reason || `Reason not provided.`}`;


   if (user.id === interaction.user.id)
      return await interaction.reply({
         content: `You can't ban yourself!`,
         ephemeral: true
      });


   if (user.id === interaction.client.user.id)
      return await interaction.reply({
         content: `You can't ban me!`,
         ephemeral: true
      });


   if (member && !member.bannable)
      return interaction.reply({
         content: `I cannot ban ${user}!`,
         ephemeral: true
      });


   if (formattedReason.length > 512)
      return await interaction.reply({
         content: `The \`reason\` is too long, please make it shorter.`,
         ephemeral: true
      });


   await interaction.guild.members.ban(user, { days: 0, reason: formattedReason });


   return await interaction.reply({
      content: `Banned \`${user.tag}\` from this server ✅`
   });
};