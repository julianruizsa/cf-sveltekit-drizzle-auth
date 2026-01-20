import { drizzle } from "drizzle-orm/d1";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import * as schema from "./schema";

export function getDb(db: D1Database) {
  return drizzle(db, { schema });

  //This is for the D1 db instance
  // if (db) {
  //   return drizzleD1(db, { schema });
  // }

  //This is for the local file db, not the local D1 instance
  // if (databaseUrl) {
  //   const client = createClient({ url: databaseUrl });
  //   return drizzleLibSql(client, { schema });
  // }
}

// export type DrizzleClient = ReturnType<typeof getDb>;
export type DrizzleClient = DrizzleD1Database<typeof schema>;
