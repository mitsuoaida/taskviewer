import { handler as mainHandler } from "./src/handler.js";

export const handler = async (event, context) => {
  return await mainHandler(event, context);
};
