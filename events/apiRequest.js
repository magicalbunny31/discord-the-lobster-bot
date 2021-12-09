export default `apiRequest`;
export const once = false;


/** @param {import("discord.js").APIRequest} request @param {import("keyv")} keyv */
export const listen = async (request, keyv) => {
   const { default: dayjs } = await import(`dayjs`);


   return await keyv.set(`last-api-request`, {
      timestamp: dayjs().format(`HH:mm:ss DD-MMM-YYYY z ([UTC]ZZ)`),
      method: request.method.toUpperCase()
   });
};