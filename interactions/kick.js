export default `kick`;
export const category = `moderation`;
export const description = `Kick a member 🔨`;
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
   name: `kick`,
   description: `Kick a member 🔨`,
   options: [{
      type: `USER`,
      name: `member`,
      description: `Member to kick 👥`,
      required: true
   }, {
      type: `STRING`,
      name: `reason`,
      description: `Reason why this member will be kicked 📝`,
      required: false
   }],
   defaultPermission: false
};


/** @param {import("discord.js").CommandInteraction} interaction @param {import("keyv")} keyv */
export const run = async (interaction, keyv) => {
   const user = interaction.options.getUser(`member`);
   const member = interaction.options.getMember(`member`);

   const reason = interaction.options.getString(`reason`);
   const formattedReason = `${interaction.user.tag} (${interaction.user.id}) kicked this user because: ${reason || `Reason not provided.`}`;


   if (!member)
      return interaction.reply({
         content: `${user} isn't a part of this server!`,
         ephemeral: true
      });


   if (user.id === interaction.user.id)
      return await interaction.reply({
         content: `You can't kick yourself!`,
         ephemeral: true
      });


   if (user.id === interaction.client.user.id)
      return await interaction.reply({
         content: `You can't kick me!`,
         ephemeral: true
      });


   if (!member.kickable)
      return interaction.reply({
         content: `I cannot kick ${user}!`,
         ephemeral: true
      });


   if (formattedReason.length > 512)
      return await interaction.reply({
         content: `The \`reason\` is too long, please make it shorter.`,
         ephemeral: true
      });


   await member.kick(formattedReason);


   return await interaction.reply({
      content: `Kicked \`${user.tag}\` from this server ✅`
   });
};