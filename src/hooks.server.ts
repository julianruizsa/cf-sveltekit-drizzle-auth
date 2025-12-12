import type { Handle } from "@sveltejs/kit";
import { svelteKitHandler } from "better-auth/svelte-kit";
import { env } from "$env/dynamic/private";
import { getDb } from "$lib/server/db";
import { getAuth } from "$lib/auth";
import { building } from "$app/environment";

export const handle: Handle = async ({ event, resolve }) => {
  const db = getDb(event.platform?.env?.DB, env.DATABASE_URL);
  const auth = getAuth(db);

  const session = await auth.api.getSession({
    headers: event.request.headers,
  });

  event.locals.db = db;
  event.locals.auth = auth;
  event.locals.user = session?.user;

  if (session) {
  }

  if (event.url.pathname === "/login") {
    console.log(session);
  }

  return svelteKitHandler({
    event,
    resolve,
    auth,
    building,
  });
};
