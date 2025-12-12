// See https://svelte.dev/docs/kit/types#app.d.ts
import type { DrizzleClient } from "$lib/server/db";
import type { BetterAuth } from "$lib/auth";
import type { User } from "better-auth";

// for information about these interfaces
declare global {
  namespace App {
    interface Platform {
      env: Env;
      cf: CfProperties;
      ctx: ExecutionContext;
    }

    interface Locals {
      db: DrizzleClient;
      auth: BetterAuth;
      user: User | undefined;
    }
  }
}

export {};
