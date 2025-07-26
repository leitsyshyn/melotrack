import {
  GameSelectWithRoundsWithTracksType,
  RoundSelectWithTracksType,
  TrackSelectType,
} from "@/lib/types";

export const isPlayableTrack = (t?: TrackSelectType): t is TrackSelectType =>
  !!t && !!t.url;

export const isPlayableRound = (r?: RoundSelectWithTracksType) =>
  !!r && r.tracks.some(isPlayableTrack);

export const isPlayableGame = (g?: GameSelectWithRoundsWithTracksType) =>
  !!g && g.rounds.some(isPlayableRound);

export function findPlayable<T extends { id: string }>(
  items: readonly T[] | undefined,
  currentId: string | undefined,
  direction: 1 | -1,
  isPlayable: (item: T) => boolean,
): T | null {
  if (!items?.length) return null;
  const startIdx =
    currentId == null
      ? direction === 1
        ? -1
        : items.length
      : items.findIndex((i) => i.id === currentId);
  for (
    let i = startIdx + direction;
    i >= 0 && i < items.length;
    i += direction
  ) {
    if (isPlayable(items[i])) return items[i];
  }
  return null;
}

export const nextTrack = (
  tracks?: TrackSelectType[],
  currentId?: string | undefined,
) => findPlayable(tracks, currentId, 1, isPlayableTrack);

export const prevTrack = (
  tracks?: TrackSelectType[],
  currentId?: string | undefined,
) => findPlayable(tracks, currentId, -1, isPlayableTrack);

export const nextRound = (
  rounds?: RoundSelectWithTracksType[],
  currentId?: string | undefined,
) => findPlayable(rounds, currentId, 1, isPlayableRound);

export const prevRound = (
  rounds?: RoundSelectWithTracksType[],
  currentId?: string | undefined,
) => findPlayable(rounds, currentId, -1, isPlayableRound);
