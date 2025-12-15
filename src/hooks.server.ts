import { redirect, type Handle } from "@sveltejs/kit";
import { svelteKitHandler } from "better-auth/svelte-kit";
import { env } from "$env/dynamic/private";
import { getDb } from "$lib/server/db";
import { getAuth } from "$lib/auth";
import { building } from "$app/environment";

function isProtectedRoute(pathname: string) {
  const segment = "/" + pathname.split("/")[1];
  switch (segment) {
    case "/app":
      return { protected: true, path: "/app" };
    case "/login":
      return { protected: true, path: "/login" };
    case "/register":
      return { protected: true, path: "/register" };
    default:
      return { protected: false, path: pathname };
  }
}

export const handle: Handle = async ({ event, resolve }) => {
  const db = getDb(event.platform?.env?.DB, env.DATABASE_URL);
  const auth = getAuth(db);

  event.locals.db = db;
  event.locals.auth = auth;

  const route = isProtectedRoute(event.url.pathname);

  if (route.protected) {
    const session = await auth.api.getSession({
      headers: event.request.headers,
    });

    if (route.path === "/login" || route.path === "/register") {
      //If user is logged in and access login or register page, redirect to app page
      if (session) throw redirect(303, "/app");
    }

    if (route.path === "/app") {
      //If user is not logged in, redirect to login page
      if (!session) throw redirect(303, "/login");
      event.locals.user = session.user;
    }
  }

  return svelteKitHandler({
    event,
    resolve,
    auth,
    building,
  });
};
