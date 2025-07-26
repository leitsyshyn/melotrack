"use client";
import { castDraft } from "immer";
import { createRef } from "react";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import {
  GameSelectWithRoundsWithTracksType,
  RoundSelectWithTracksType,
  TrackSelectType,
} from "@/lib/types";

type PlayerState = {
  src?: string;
  playing: boolean;
  // pip: boolean;
  // controls: boolean;
  // light: boolean;
  // volume: number;
  // muted: boolean;
  // played: number;
  // loaded: number;
  // duration: number;
  // playbackRate: number;
  // loop: boolean;
  // seeking: boolean;
  // loadedSeconds: number;
  // playedSeconds: number;
};

const initialPlayerState: PlayerState = {
  src: undefined,
  playing: false,
  // duration: 0,
  // played: 0,
  // loaded: 0,
  // volume: 1,
  // muted: false,
  // playbackRate: 1,
  // seeking: false,
  // loadedSeconds: 0,
  // playedSeconds: 0,
  // controls: false,
  // loop: false,
  // light: false,
  // pip: false,
};

export type GameScope = {
  scope: "game";
  gameId: string;
  roundId: string;
  trackId: string;
};
export type RoundScope = { scope: "round"; roundId: string; trackId: string };
export type TrackScope = { scope: "track"; trackId: string };
export type EmptyScope = { scope: "empty" };
export type ScopeState = GameScope | RoundScope | TrackScope | EmptyScope;
export const emptyScope: EmptyScope = { scope: "empty" };

export const canPlayTrack = (t?: TrackSelectType) => !!t?.url;
export const canPlayRound = (r?: RoundSelectWithTracksType) =>
  !!r && r.tracks.some(canPlayTrack);
export const canPlayGame = (g?: GameSelectWithRoundsWithTracksType) =>
  !!g && g.rounds.some(canPlayRound);

function findPlayable<T extends { id: string }>(
  items: readonly T[] | undefined,
  currentId: string | undefined,
  direction: 1 | -1,
  canPlay: (item: T) => boolean,
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
    if (canPlay(items[i])) return items[i];
  }
  return null;
}

export function findNextPlayableTrack(
  tracks: TrackSelectType[] | undefined,
  currentTrackId?: string | undefined,
): TrackSelectType | null {
  return findPlayable(tracks, currentTrackId, 1, canPlayTrack);
}

export function findPrevPlayableTrack(
  tracks: TrackSelectType[] | undefined,
  currentTrackId?: string | undefined,
): TrackSelectType | null {
  return findPlayable(tracks, currentTrackId, -1, canPlayTrack);
}

export function findNextPlayableRound(
  rounds: RoundSelectWithTracksType[] | undefined,
  currentRoundId?: string | undefined,
): RoundSelectWithTracksType | null {
  return findPlayable(rounds, currentRoundId, 1, canPlayRound);
}

export function findPrevPlayableRound(
  rounds: RoundSelectWithTracksType[] | undefined,
  currentRoundId?: string | undefined,
): RoundSelectWithTracksType | null {
  return findPlayable(rounds, currentRoundId, -1, canPlayRound);
}

type Store = {
  playerRef: React.RefObject<HTMLVideoElement | null>;
  playerState: PlayerState;
  scopeState: ScopeState;

  setPlayerRef: (el: HTMLVideoElement | null) => void;
  setPlayerState: (s: Partial<PlayerState>) => void;

  stopPlaying: () => void;

  playGame: (g: GameSelectWithRoundsWithTracksType) => void;
  playRound: (r: RoundSelectWithTracksType) => void;
  playTrack: (t: TrackSelectType) => void;
  playNextTrack: (ctx: {
    r: RoundSelectWithTracksType;
    g?: GameSelectWithRoundsWithTracksType;
  }) => void;
};

export const usePlayerStore = create<Store>()(
  immer((set, get) => ({
    playerRef: createRef<HTMLVideoElement>(),
    playerState: initialPlayerState,
    scopeState: emptyScope,

    setPlayerRef: (el) =>
      set((draft) => {
        draft.playerRef.current = castDraft(el);
      }),

    setPlayerState: (patch) =>
      set((draft) => {
        Object.assign(draft.playerState, patch);
      }),

    stopPlaying: () =>
      set({
        scopeState: emptyScope,
        playerState: initialPlayerState,
      }),

    playGame: (game: GameSelectWithRoundsWithTracksType) => {
      const stop = get().stopPlaying;

      const firstRound = findNextPlayableRound(game.rounds);
      if (!firstRound) {
        stop();
        return;
      }

      const firstTrack = findNextPlayableTrack(firstRound.tracks);
      if (!firstTrack) {
        stop();
        return;
      }

      set((draft) => {
        draft.scopeState = {
          scope: "game",
          gameId: game.id,
          roundId: firstRound.id,
          trackId: firstTrack.id,
        };
      });
    },

    playRound: (round: RoundSelectWithTracksType) => {
      const stop = get().stopPlaying;

      const firstTrack = findNextPlayableTrack(round.tracks);
      if (!firstTrack) {
        stop();
        return;
      }

      set((draft) => {
        draft.scopeState = {
          scope: "round",
          roundId: round.id,
          trackId: firstTrack.id,
        };
      });
    },

    playTrack: (track: TrackSelectType) => {
      const stop = get().stopPlaying;
      if (!canPlayTrack(track)) {
        stop();
        return;
      }

      set((draft) => {
        draft.scopeState = { scope: "track", trackId: track.id };
      });
    },

    playNextTrack: (ctx: {
      r: RoundSelectWithTracksType;
      g?: GameSelectWithRoundsWithTracksType;
    }) => {
      const { scopeState, stopPlaying } = get();
      if (scopeState.scope === "empty" || scopeState.scope === "track") {
        stopPlaying();
        return;
      }

      if (scopeState.scope === "round") {
        const nextTrack = findNextPlayableTrack(
          ctx.r.tracks,
          scopeState.trackId,
        );

        if (!nextTrack) {
          stopPlaying();
          return;
        }

        set((draft) => {
          if (draft.scopeState.scope !== "round") return;
          draft.scopeState.trackId = nextTrack?.id;
        });
      }

      if (scopeState.scope === "game" && ctx.g) {
        const nextTrack = findNextPlayableTrack(
          ctx.g.rounds.find((r) => r.id === scopeState.roundId)?.tracks,
          scopeState.trackId,
        );

        if (nextTrack) {
          set((draft) => {
            if (draft.scopeState.scope !== "game") return;
            draft.scopeState.trackId = nextTrack?.id;
          });
          return;
        }

        const nextRound = findNextPlayableRound(
          ctx.g.rounds,
          scopeState.roundId,
        );

        if (!nextRound) {
          stopPlaying();
          return;
        }

        const firstTrack = findNextPlayableTrack(nextRound.tracks);

        if (!firstTrack) {
          stopPlaying();
          return;
        }

        set((draft) => {
          if (draft.scopeState.scope !== "game") return;
          draft.scopeState.roundId = nextRound.id;
          draft.scopeState.trackId = firstTrack.id;
        });
      }
    },
  })),
);
