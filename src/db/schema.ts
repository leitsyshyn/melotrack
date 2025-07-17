import { relations, sql } from "drizzle-orm";
import { check, integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const gamesTable = pgTable("games", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
});

export const roundsTable = pgTable("rounds", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  gameId: integer()
    .notNull()
    .references(() => gamesTable.id),
  name: varchar({ length: 255 }).notNull(),
  gap: integer().notNull().default(5),
  position: integer().notNull(),
});

export const tracksTable = pgTable(
  "tracks",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    roundId: integer()
      .notNull()
      .references(() => roundsTable.id),
    position: integer().notNull(),
    url: varchar({ length: 2048 }).notNull(),
    start: integer().notNull(),
    end: integer().notNull(),
    title: varchar({ length: 255 }).notNull(),
    artist: varchar({ length: 255 }),
  },
  (table) => ({
    urlValid: check(
      "url_valid",
      sql`${table.url} ~* '^https?://[\\w.-]+(?:\\.[\\w.-]+)+(:\\d+)?(/[^\\s]*)?$'`
    ),
    startNonNegative: check("start_non_negative", sql`${table.start} >= 0`),
    endNonNegative: check("end_non_negative", sql`${table.end} >= 0`),
    endAfterStart: check("end_after_start", sql`${table.end} > ${table.start}`),
  })
);

export const gamesRelations = relations(gamesTable, ({ many }) => ({
  rounds: many(roundsTable),
}));

export const roundsRelations = relations(roundsTable, ({ one, many }) => ({
  game: one(gamesTable, {
    fields: [roundsTable.gameId],
    references: [gamesTable.id],
  }),
  tracks: many(tracksTable),
}));

export const tracksRelations = relations(tracksTable, ({ one }) => ({
  round: one(roundsTable, {
    fields: [tracksTable.roundId],
    references: [roundsTable.id],
  }),
}));
