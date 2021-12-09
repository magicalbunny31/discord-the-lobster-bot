export default `time-out`;
export const category = `moderation`;
export const description = `Put a member in time out 🔇`;
export const showCommand = false; // todo
export const guild = true;


/** @type {import("discord.js").ApplicationCommandPermissions[]} */
export const permissions = [{
   id: `754019782076137542`, // staff (Mighty Lobster [OFFICIAL])
   type: `ROLE`,
   permission: true
}];


/** @type {import("discord.js").ApplicationCommandData} */
export const data = {
   name: `time-out`,
   description: `Put a member in time out 🔇`,
   options: [{
      type: `USER`,
      name: `member`,
      description: `Member to time out 👥`,
      required: true
   }, {
      type: `STRING`,
      name: `duration`,
      description: `How long this member will be in time out for ⌚`,
      required: true,
      choices: [{
         name: `60 seconds ⌚`,
         value: `60`
      }, {
         name: `5 minutes ⌚`,
         value: `300`
      }, {
         name: `10 minutes ⌚`,
         value: `600`
      }, {
         name: `1 hour ⌚`,
         value: `3600`
      }, {
         name: `1 day ⌚`,
         value: `86400`
      }, {
         name: `1 week ⌚`,
         value: `604800`
      }]
   }, {
      type: `STRING`,
      name: `reason`,
      description: `Reason why this member will be put in time out 📝`,
      required: false
   }],
   defaultPermission: false
};


/** @param {import("discord.js").CommandInteraction} interaction @param {import("keyv")} keyv */
export const run = async (interaction, keyv) => {
   const user = interaction.options.getUser(`member`);
   const member = interaction.options.getMember(`member`);

   const duration = +interaction.options.getString(`duration`);

   const reason = interaction.options.getString(`reason`);
   const formattedReason = `${interaction.user.tag} (${interaction.user.id}) put this user in time out because: ${reason || `Reason not provided.`}`;


   return await interaction.reply({
      content: `This command is currently not available.`,
      ephemeral: true
   });
};