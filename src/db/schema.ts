import { relations, sql } from "drizzle-orm";
import {
  check,
  integer,
  pgTable,
  serial,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const gamesTable = pgTable("games", {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  gap: integer().notNull().default(5),
});

export const roundsTable = pgTable(
  "rounds",
  {
    id: uuid().defaultRandom().primaryKey(),
    gameId: uuid()
      .notNull()
      .references(() => gamesTable.id, { onDelete: "cascade" }),

    name: varchar({ length: 255 }).notNull(),
    gap: integer().notNull().default(3),
    position: serial().notNull(),
  },
  (table) => ({
    roundPosUnique: unique().on(table.gameId, table.position), // Deferred in pg
    roundPosNonNegative: check(
      "round_pos_non_negative",
      sql`${table.position} >= 0`,
    ),
  }),
);

export const tracksTable = pgTable(
  "tracks",
  {
    id: uuid().defaultRandom().primaryKey(),
    roundId: uuid()
      .notNull()
      .references(() => roundsTable.id, { onDelete: "cascade" }),
    position: serial().notNull(),
    url: varchar({ length: 2048 }).notNull(),
    start: integer().notNull(),
    end: integer().notNull(),
    title: varchar({ length: 255 }).notNull(),
    artist: varchar({ length: 255 }),
  },
  (table) => ({
    trackPosUnique: unique().on(table.roundId, table.position), // Deferred in pg
    trackPosNonNegative: check(
      "track_pos_non_negative",
      sql`${table.position} >= 0`,
    ),
    urlValid: check(
      "url_valid",
      sql`${table.url} ~* '^https?://[\\w.-]+(?:\\.[\\w.-]+)+(:\\d+)?(/[^\\s]*)?$'`,
    ),
    startNonNegative: check("start_non_negative", sql`${table.start} >= 0`),
    endNonNegative: check("end_non_negative", sql`${table.end} >= 0`),
    endAfterStart: check("end_after_start", sql`${table.end} > ${table.start}`),
  }),
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
