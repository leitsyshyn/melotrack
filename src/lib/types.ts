import { z } from "zod/v4";

import {
  gameInsertSchema,
  gameSelectSchema,
  gameUpdateSchema,
  roundInsertSchema,
  roundSelectSchema,
  roundUpdateSchema,
  trackInsertSchema,
  trackSelectSchema,
  trackUpdateSchema,
} from "@/lib/schemas";

export type GameSelectType = z.infer<typeof gameSelectSchema>;
export type RoundSelectType = z.infer<typeof roundSelectSchema>;
export type TrackSelectType = z.infer<typeof trackSelectSchema>;

export type GameInsertType = z.infer<typeof gameInsertSchema>;
export type RoundInsertType = Omit<
  z.infer<typeof roundInsertSchema>,
  "position"
>;
export type TrackInsertType = Omit<
  z.infer<typeof trackInsertSchema>,
  "position"
>;

export type GameUpdateType = z.infer<typeof gameUpdateSchema>;
export type RoundUpdateType = z.infer<typeof roundUpdateSchema>;
export type TrackUpdateType = z.infer<typeof trackUpdateSchema>;

export type GameSelectWithRoundsWithTracksType = GameSelectType & {
  rounds: RoundSelectWithTracksType[];
};

export type RoundSelectWithTracksType = RoundSelectType & {
  tracks: TrackSelectType[];
};
