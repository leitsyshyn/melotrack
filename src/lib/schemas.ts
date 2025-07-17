import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { gamesTable, roundsTable, tracksTable } from "@/db/schema";

export const gameSelectSchema = createSelectSchema(gamesTable);
export const roundSelectSchema = createSelectSchema(roundsTable);
export const trackSelectSchema = createSelectSchema(tracksTable);

export const gameInsertSchema = createInsertSchema(gamesTable);
export const roundInsertSchema = createInsertSchema(roundsTable);
export const trackInsertSchema = createInsertSchema(tracksTable, {
  url: (schema) => schema.url(),
  start: (schema) => schema.min(0),
  end: (schema) => schema.min(0),
}).refine(({ start, end }) => end > start, {
  path: ["end"],
  message: "end must be greater than start",
});
