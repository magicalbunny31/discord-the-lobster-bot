export default `apiResponse`;
export const once = false;


/** @param {import("discord.js").APIRequest} request @param {Response} response @param {import("keyv")} keyv */
export const listen = async (request, response, keyv) => {
   const { default: dayjs } = await import(`dayjs`);


   return await keyv.set(`last-api-response`, {
      timestamp: dayjs().format(`HH:mm:ss DD-MMM-YYYY z ([UTC]ZZ)`),
      status: response.status
   });
};