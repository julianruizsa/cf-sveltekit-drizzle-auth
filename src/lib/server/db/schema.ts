import { sql, type InferSelectModel } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "./better-auth-schema";

// export const user = sqliteTable("user", {
//   id: text("id")
//     .primaryKey()
//     .$defaultFn(() => crypto.randomUUID()),
//   age: integer("age"),
// });

export const guestbookMessages = sqliteTable("guestbook_messages", {
  id: integer().primaryKey(),
  message: text().notNull(),
  country: text(),
  image: text(),
  createdAt: text("created_at", { mode: "text" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export type GuestbookMessage = InferSelectModel<typeof guestbookMessages>;

export * from "./better-auth-schema";
