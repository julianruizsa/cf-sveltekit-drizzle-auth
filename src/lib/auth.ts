import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { type DrizzleClient } from "./server/db";
import { env } from "$env/dynamic/private";

export function getAuth(db: DrizzleClient) {
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite", // or "mysql", "sqlite"
    }),
    emailAndPassword: {
      enabled: true,
    },
    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
    },
  });
}

export type BetterAuth = ReturnType<typeof getAuth>;
