export default `statistics`;
export const category = `utils`;
export const description = `Show my statistics 📊`;
export const showCommand = true;


/** @type {import("discord.js").ApplicationCommandData} */
export const data = {
   name: `statistics`,
   description: `Show my statistics 📊`
};


/** @param {import("discord.js").CommandInteraction} interaction @param {import("keyv")} keyv */
export const run = async (interaction, keyv) => {
   // there's a lot going on here
   await interaction.deferReply();


   // actual imports
   const { default: dayjs } = await import(`dayjs`);

   // destructured imports
   const { readFileSync } = await import(`fs`);
   const { stripIndents } = await import(`common-tags`);

   // system
   const { uptime, platform } = await import(`os`);

   // exec
   const util = await import(`util`);
   const exec = util.promisify((await import(`child_process`)).exec);

   // json
   const pkg = JSON.parse(readFileSync(`./package.json`, `utf-8`));


   const formatBytes = bytes => {
      const decimals = 2;
      if (!bytes) return `0 bytes`;

      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = [ `bytes`, `KB`, `MB`, `GB`, `TB` ];
      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
   };

   const serverUptime = dayjs.duration(uptime() * 1000).format(`D[d] H[h] m[m] s[s]`);
   const botUptime    = dayjs.duration(interaction.client.uptime).format(`H[h] m[m] s[s]`);
   const memoryUsage  = `${formatBytes(process.memoryUsage().heapUsed)} / ${formatBytes(process.memoryUsage().heapTotal)}`;

   const npm                = (await exec(`npm -v`)).stdout.trim();
   const os                 = platform() === `win32` ? `Windows 10 20H2` : `Ubuntu 21.04`;
   const nodejs             = process.version.slice(1);
   const discordjs          = /~|\^/.test(pkg.dependencies[`discord.js`]) ? pkg.dependencies[`discord.js`].slice(1) : pkg.dependencies[`discord.js`];

   const gateway            = `v9`;
   const status             = [
      `READY`,              `CONNECTING`,  `RECONNECTING`,
      `IDLE`,               `NEARLY`,      `DISCONNECTED`,
      `WAITING_FOR_GUILDS`, `IDENTIFYING`, `RESUMING`
   ][interaction.client.ws.status];

   const lastRequest        = await keyv.get(`last-api-request`);
   const lastResponse       = await keyv.get(`last-api-response`);


   return await interaction.editReply({
      content: stripIndents`
         \`\`\`
         Server Uptime        :  ${serverUptime}
         Bot Uptime           :  ${botUptime}
         Memory Usage         :  ${memoryUsage}

         Bot Version          :  ${pkg.version}
         OS                   :  ${os}

         Node.js              :  ${nodejs}
         npm                  :  ${npm}
         discord.js           :  ${discordjs}

         Discord API Gateway  :  ${gateway}
         Gateway Status       :  ${status}

         Last API Request     :  ${lastRequest.timestamp} (HTTP ${lastRequest.method})
         Last API Response    :  ${lastResponse.timestamp} (STATUS ${lastResponse.status})
         \`\`\`
      `
   });
};