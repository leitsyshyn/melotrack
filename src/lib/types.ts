import { z } from "zod/v4";

import {
  gameInsertSchema,
  gameSelectSchema,
  roundInsertSchema,
  roundSelectSchema,
  trackInsertSchema,
  trackSelectSchema,
} from "@/lib/schemas";

export type GameSelectType = z.infer<typeof gameSelectSchema>;
export type RoundSelectType = z.infer<typeof roundSelectSchema>;
export type TrackSelectType = z.infer<typeof trackSelectSchema>;

export type GameInsertType = z.infer<typeof gameInsertSchema>;
export type RoundInsertType = z.infer<typeof roundInsertSchema>;
export type TrackInsertType = z.infer<typeof trackInsertSchema>;

export type GameSelectWithRoundsWithTracksType = GameSelectType & {
  rounds: RoundSelectWithTracksType[];
};

export type RoundSelectWithTracksType = RoundSelectType & {
  tracks: TrackSelectType[];
};
