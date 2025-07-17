import { db } from "@/lib/db";

export function getGamesWithRoundsWithTracks() {
  return db.query.gamesTable.findMany({
    with: {
      rounds: {
        with: {
          tracks: true,
        },
      },
    },
  });
}
