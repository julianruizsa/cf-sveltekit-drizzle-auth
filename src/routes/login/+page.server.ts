import type { PageServerLoad } from "./$types";

//Route require a load function in order to hooks.server.ts to work and redirect user if is already logged in
export const load: PageServerLoad = async ({}) => {
  return {};
};
