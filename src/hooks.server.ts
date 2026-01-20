import { redirect, type Handle, error } from "@sveltejs/kit";
import { svelteKitHandler } from "better-auth/svelte-kit";
import { getDb } from "$lib/server/db";
import { getAuth } from "$lib/auth";
import { building } from "$app/environment";

const PROTECTED_ROUTES = [
  "/app",
  "/login",
  "/register",
  "/api/images",
] as const;

function isProtectedRoute(pathname: string) {
  for (const route of PROTECTED_ROUTES) {
    if (pathname.startsWith(route)) {
      return { protected: true, path: route };
    }
  }
  return { protected: false, path: pathname };
}

export const handle: Handle = async ({ event, resolve }) => {
  //If no D1 db configured, no app will run
  if (!event.platform?.env.DB) {
    throw new Error("no database configuration found");
  }
  const db = getDb(event.platform.env.DB);
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

    if (route.path === "/api/images") {
      //If user is not logged in, throw 401 error in the API request
      if (!session) throw error(401, "Unauthorized");
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
