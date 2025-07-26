"use client";

import {
  isPlayableTrack,
  nextRound,
  nextTrack,
  prevRound,
  prevTrack,
} from "@/components/player/utils";
import {
  GameSelectWithRoundsWithTracksType,
  RoundSelectWithTracksType,
  TrackSelectType,
} from "@/lib/types";

type Cursor =
  | { scope: "empty" }
  | { scope: "track"; trackId: string }
  | { scope: "round"; roundId: string; trackId: string }
  | { scope: "game"; gameId: string; roundId: string; trackId: string };

function assertNever(x: never): never {
  throw new Error(`Unexpected case: ${JSON.stringify(x)}`);
}

enum ActionType {
  PLAY_GAME = "PLAY_GAME",
  PLAY_ROUND = "PLAY_ROUND",
  PLAY_TRACK = "PLAY_TRACK",
  NEXT_TRACK = "NEXT_TRACK",
  PREV_TRACK = "PREV_TRACK",
  NEXT_ROUND = "NEXT_ROUND",
  PREV_ROUND = "PREV_ROUND",
  PAUSE = "PAUSE",
  RESUME = "RESUME",
  STOP = "STOP",
}

type Action =
  | {
      type: ActionType.PLAY_GAME;
      payload: { game: GameSelectWithRoundsWithTracksType };
    }
  | {
      type: ActionType.PLAY_ROUND;
      payload: { round: RoundSelectWithTracksType };
    }
  | { type: ActionType.PLAY_TRACK; payload: { track: TrackSelectType } }
  | {
      type: ActionType.NEXT_TRACK;
      payload: {
        rounds?: RoundSelectWithTracksType[];
        tracks?: TrackSelectType[];
      };
    }
  | {
      type: ActionType.PREV_TRACK;
      payload: {
        rounds?: RoundSelectWithTracksType[];
        tracks?: TrackSelectType[];
      };
    }
  | {
      type: ActionType.NEXT_ROUND;
      payload: {
        rounds?: RoundSelectWithTracksType[];
      };
    }
  | {
      type: ActionType.PREV_ROUND;
      payload: {
        rounds?: RoundSelectWithTracksType[];
      };
    }
  | { type: ActionType.PAUSE }
  | { type: ActionType.RESUME }
  | { type: ActionType.STOP };

const emptyCursor: Cursor = { scope: "empty" };

function reducer(state: Cursor, action: Action): Cursor {
  switch (action.type) {
    case ActionType.PLAY_GAME: {
      const g = action.payload.game;
      const r = nextRound(g.rounds);
      if (!r) return emptyCursor;
      const t = nextTrack(r.tracks);
      if (!t) return emptyCursor;
      return { scope: "game", gameId: g.id, roundId: r.id, trackId: t.id };
    }
    case ActionType.PLAY_ROUND: {
      const r = action.payload.round;
      const t = nextTrack(r.tracks);
      if (!t) return emptyCursor;
      return { scope: "round", roundId: r.id, trackId: t.id };
    }
    case ActionType.PLAY_TRACK:
      return { scope: "track", trackId: action.payload.track.id };

    case ActionType.NEXT_TRACK: {
      if (state.scope === "round") {
        const t = nextTrack(action.payload.tracks, state.trackId);
        return t ? { ...state, trackId: t.id } : emptyCursor;
      }
      if (state.scope === "game") {
        const tr = nextTrack(action.payload.tracks, state.trackId);
        if (tr) return { ...state, trackId: tr.id };
        const r = nextRound(action.payload.rounds, state.roundId);
        if (!r) return emptyCursor;
        const t = nextTrack(r.tracks);
        return t ? { ...state, roundId: r.id, trackId: t.id } : emptyCursor;
      }
      return emptyCursor;
    }

    case ActionType.PREV_TRACK: {
      if (state.scope === "round") {
        const t = prevTrack(action.payload.tracks, state.trackId);
        return t ? { ...state, trackId: t.id } : state;
      }
      if (state.scope === "game") {
        const tr = prevTrack(action.payload.tracks, state.trackId);
        if (tr) return { ...state, trackId: tr.id };
        const r = prevRound(action.payload.rounds, state.roundId);
        if (!r) return state;
        const last = prevTrack(r.tracks, undefined);
        return last ? { ...state, roundId: r.id, trackId: last.id } : state;
      }
      return state;
    }

    case ActionType.NEXT_ROUND: {
      if (state.scope !== "game") return state;
      const r = nextRound(action.payload.rounds, state.roundId);
      if (!r) return state;
      const t = nextTrack(r.tracks, undefined);
      return t ? { ...state, roundId: r.id, trackId: t.id } : state;
    }

    case ActionType.PREV_ROUND: {
      if (state.scope !== "game") return state;
      const r = prevRound(action.payload.rounds, state.roundId);
      if (!r) return state;
      const t = nextTrack(r.tracks, undefined);
      return t ? { ...state, roundId: r.id, trackId: t.id } : state;
    }

    case ActionType.STOP:
      return emptyCursor;

    default:
      assertNever(action as never);
  }
}
export {
  ActionType,
  assertNever,
  emptyCursor,
  isPlayableTrack,
  nextRound,
  nextTrack,
  prevRound,
  prevTrack,
  reducer,
  type Action,
  type Cursor,
};
