import { integer, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  userName: varchar({ length: 55 }).unique().notNull(),
  gamesPlayed: integer().default(0),
  won: integer().default(0),
  loose: integer().default(0),
});
