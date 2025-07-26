import { addSeconds, format } from "date-fns";

import {
  GameSelectWithRoundsWithTracksType,
  RoundSelectWithTracksType,
  TrackSelectType,
} from "@/lib/types";

export const trackDuration = (t: TrackSelectType) => t.end - t.start;

export const roundDuration = (r: RoundSelectWithTracksType) => {
  const n = r.tracks.length;
  const tracksSec = r.tracks.reduce((s, t) => s + trackDuration(t), 0);
  const gapsSec = Math.max(n - 1, 0) * r.gap;
  return tracksSec + gapsSec;
};

export const gameDuration = (g: GameSelectWithRoundsWithTracksType) => {
  const n = g.rounds.length;
  const roundsSec = g.rounds.reduce((s, r) => s + roundDuration(r), 0);
  const gapsSec = Math.max(n - 1, 0) * g.gap;
  return roundsSec + gapsSec;
};

export function formatSeconds(sec: number) {
  const d = addSeconds(new Date(0), sec);
  return format(d, sec >= 3600 ? "H:mm:ss" : "m:ss");
}
