"use client";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";

import {
  GameSelectWithRoundsWithTracksType,
  RoundSelectWithTracksType,
  TrackSelectType,
} from "@/lib/types";
import { useGameByIdWithRoundsWithTracks } from "@/queries/games";
import { useRoundByIdWithTracks } from "@/queries/rounds";
import { useTrackById } from "@/queries/tracks";

type PlayerState = {
  src?: string;
  pip: boolean;
  playing: boolean;
  controls: boolean;
  light: boolean;
  volume: number;
  muted: boolean;
  played: number;
  loaded: number;
  duration: number;
  playbackRate: number;
  loop: boolean;
  seeking: boolean;
  loadedSeconds: number;
  playedSeconds: number;
};

type PlayerContextType = {
  playerState: PlayerState;
  setPlayerState: React.Dispatch<React.SetStateAction<PlayerState>>;
  playerRef: React.RefObject<HTMLVideoElement | null>;
  setPlayerRef: (player: HTMLVideoElement) => void;
  queue: QueueScope;
  dispatch: React.Dispatch<Action>;
  game?: GameSelectWithRoundsWithTracksType;
  round?: RoundSelectWithTracksType;
  track?: TrackSelectType;
  canPlayTrack: (track?: TrackSelectType) => boolean;
  canPlayRound: (round?: RoundSelectWithTracksType) => boolean;
  canPlayGame: (game?: GameSelectWithRoundsWithTracksType) => boolean;
  canPlayNextTrack: () => boolean;
  canPlayPrevTrack: () => boolean;
  canPlayNextRound: () => boolean;
  canPlayPrevRound: () => boolean;
  playGame: (game: GameSelectWithRoundsWithTracksType) => void;
  playRound: (round: RoundSelectWithTracksType) => void;
  playTrack: (track: TrackSelectType) => void;
  playNextTrack: () => void;
  playPrevTrack: () => void;
  playNextRound: () => void;
  playPrevRound: () => void;
  stop: () => void;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export type GameScope = {
  scope: "game";
  gameId: string;
  roundId: string;
  trackId: string;
};
export type RoundScope = {
  scope: "round";
  roundId: string;
  trackId: string;
};
export type TrackScope = { scope: "track"; trackId: string };
export type EmptyScope = { scope: "empty" };

export type QueueScope = GameScope | RoundScope | TrackScope | EmptyScope;
export const emptyScope: EmptyScope = { scope: "empty" };

export const ACTIONS = {
  PLAY_GAME: "PLAY_GAME",
  PLAY_ROUND: "PLAY_ROUND",
  PLAY_TRACK: "PLAY_TRACK",
  PLAY_NEXT_TRACK: "PLAY_NEXT_TRACK",
  PLAY_PREV_TRACK: "PLAY_PREV_TRACK",
  PLAY_NEXT_ROUND: "PLAY_NEXT_ROUND",
  PLAY_PREV_ROUND: "PLAY_PREV_ROUND",

  STOP: "STOP",
} as const;

export type Action =
  | {
      type: typeof ACTIONS.PLAY_GAME;
      payload: { game: GameSelectWithRoundsWithTracksType };
    }
  | {
      type: typeof ACTIONS.PLAY_ROUND;
      payload: { round: RoundSelectWithTracksType };
    }
  | { type: typeof ACTIONS.PLAY_TRACK; payload: { track: TrackSelectType } }
  | {
      type: typeof ACTIONS.PLAY_NEXT_TRACK;
    }
  | {
      type: typeof ACTIONS.PLAY_PREV_TRACK;
    }
  | {
      type: typeof ACTIONS.PLAY_NEXT_ROUND;
    }
  | {
      type: typeof ACTIONS.PLAY_PREV_ROUND;
    }
  | { type: typeof ACTIONS.STOP };

export function PlayerProvider({ children }: { children: ReactNode }) {
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const currentGameRef = useRef<GameSelectWithRoundsWithTracksType | undefined>(
    undefined,
  );
  const currentRoundRef = useRef<RoundSelectWithTracksType | undefined>(
    undefined,
  );

  const setPlayerRef = useCallback((player: HTMLVideoElement) => {
    if (!player) return;
    playerRef.current = player;
  }, []);

  const [playerState, setPlayerState] = useState<PlayerState>({
    src: undefined,
    duration: 0,
    playing: false,
    played: 0,
    loaded: 0,
    volume: 1,
    muted: false,
    playbackRate: 1.0,
    seeking: false,
    loadedSeconds: 0,
    playedSeconds: 0,
    controls: false,
    loop: false,
    light: false,
    pip: false,
  });

  const canPlayTrack = useCallback((t?: TrackSelectType) => {
    return !!t?.url;
  }, []);

  const canPlayRound = useCallback(
    (r?: RoundSelectWithTracksType) => {
      return !!r && r.tracks.some(canPlayTrack);
    },
    [canPlayTrack],
  );

  const findNextPlayableTrack = useCallback(
    (
      round: RoundSelectWithTracksType | undefined = currentRoundRef.current,
      currentTrackId?: string,
    ) => {
      if (!round) return null;
      const startIdx =
        currentTrackId == null
          ? -1
          : round.tracks.findIndex((t) => t.id === currentTrackId);

      for (let i = startIdx + 1; i < round.tracks.length; i++) {
        if (canPlayTrack(round.tracks[i])) return round.tracks[i];
      }
      return null;
    },
    [canPlayTrack],
  );

  const findNextPlayableRound = useCallback(
    (
      game:
        | GameSelectWithRoundsWithTracksType
        | undefined = currentGameRef.current,
      currentRoundId?: string,
    ) => {
      if (!game) return null;
      const startIdx =
        currentRoundId == null
          ? -1
          : game.rounds.findIndex((r) => r.id === currentRoundId);

      for (let i = startIdx + 1; i < game.rounds.length; i++) {
        if (canPlayRound(game.rounds[i])) return game.rounds[i];
      }
      return null;
    },
    [canPlayRound],
  );

  const findPrevPlayableTrack = useCallback(
    (
      round: RoundSelectWithTracksType | undefined = currentRoundRef.current,
      currentTrackId?: string,
    ) => {
      if (!round) return null;
      const startIdx =
        currentTrackId == null
          ? round.tracks.length
          : round.tracks.findIndex((t) => t.id === currentTrackId);

      for (let i = startIdx - 1; i >= 0; i--) {
        if (canPlayTrack(round.tracks[i])) return round.tracks[i];
      }
      return null;
    },
    [canPlayTrack],
  );

  const findPrevPlayableRound = useCallback(
    (
      game:
        | GameSelectWithRoundsWithTracksType
        | undefined = currentGameRef.current,
      currentRoundId?: string,
    ) => {
      if (!game) return null;
      const startIdx =
        currentRoundId == null
          ? game.rounds.length
          : game.rounds.findIndex((r) => r.id === currentRoundId);

      for (let i = startIdx - 1; i >= 0; i--) {
        if (canPlayRound(game.rounds[i])) return game.rounds[i];
      }
      return null;
    },
    [canPlayRound],
  );

  const reducer = (state: QueueScope, action: Action): QueueScope => {
    switch (action.type) {
      case ACTIONS.PLAY_GAME: {
        const firstRound = findNextPlayableRound(action.payload.game);
        if (!firstRound) {
          console.warn("No playable round found in game", action.payload.game);
          return emptyScope;
        }
        const firstTrack = findNextPlayableTrack(firstRound);
        if (!firstTrack) {
          console.warn("No playable track found in round", firstRound);
          return emptyScope;
        }
        return {
          scope: "game",
          gameId: action.payload.game.id,
          roundId: firstRound.id,
          trackId: firstTrack.id,
        };
      }
      case ACTIONS.PLAY_ROUND: {
        const firstTrack = findNextPlayableTrack(action.payload.round);
        if (!firstTrack) {
          console.warn(
            "No playable track found in round",
            action.payload.round,
          );
          return emptyScope;
        }
        return {
          scope: "round",
          roundId: action.payload.round.id,
          trackId: firstTrack.id,
        };
      }
      case ACTIONS.PLAY_TRACK:
        return {
          scope: "track",
          trackId: action.payload.track.id,
        };
      case ACTIONS.PLAY_NEXT_TRACK: {
        if (state.scope === "empty" || state.scope === "track") return state;

        if (state.scope === "round") {
          const nextTrack = findNextPlayableTrack(undefined, state.trackId);
          return nextTrack ? { ...state, trackId: nextTrack.id } : emptyScope;
        }

        if (state.scope === "game") {
          const nextTrack = findNextPlayableTrack(undefined, state.trackId);
          if (nextTrack) return { ...state, trackId: nextTrack.id };

          const nextRound = findNextPlayableRound(undefined, state.roundId);
          if (!nextRound) return state;

          const firstTrack = findNextPlayableTrack(nextRound);
          return firstTrack
            ? { ...state, roundId: nextRound.id, trackId: firstTrack.id }
            : emptyScope;
        }

        return state;
      }
      case ACTIONS.PLAY_PREV_TRACK: {
        if (state.scope === "empty" || state.scope === "track") return state;

        if (state.scope === "round") {
          const prevTrack = findPrevPlayableTrack(undefined, state.trackId);
          return prevTrack ? { ...state, trackId: prevTrack.id } : state;
        }

        if (state.scope === "game") {
          const prevTrack = findPrevPlayableTrack(undefined, state.trackId);
          if (prevTrack) return { ...state, trackId: prevTrack.id };

          const prevRound = findPrevPlayableRound(undefined, state.roundId);
          if (!prevRound) return state;

          const lastTrack = findPrevPlayableTrack(prevRound);
          return lastTrack
            ? { ...state, roundId: prevRound.id, trackId: lastTrack.id }
            : state;
        }

        return state;
      }
      case ACTIONS.PLAY_NEXT_ROUND: {
        if (state.scope === "empty" || state.scope === "round") return state;
        if (state.scope === "game") {
          const nextRound = findNextPlayableRound(undefined, state.roundId);
          if (!nextRound) return state;

          const firstTrack = findNextPlayableTrack(nextRound);
          return firstTrack
            ? { ...state, roundId: nextRound.id, trackId: firstTrack.id }
            : state;
        }
      }
      case ACTIONS.PLAY_PREV_ROUND: {
        if (state.scope === "empty" || state.scope === "round") return state;
        if (state.scope === "game") {
          const prevRound = findPrevPlayableRound(undefined, state.roundId);
          if (!prevRound) return state;

          const lastTrack = findPrevPlayableTrack(prevRound);
          return lastTrack
            ? { ...state, roundId: prevRound.id, trackId: lastTrack.id }
            : state;
        }
      }

      case ACTIONS.STOP:
        return emptyScope;

      default:
        return state;
    }
  };

  const [queue, dispatch] = useReducer(reducer, emptyScope);

  const gameId = queue.scope === "game" ? queue.gameId : "";
  const roundId =
    queue.scope === "game" || queue.scope === "round"
      ? queue.roundId
      : undefined;
  const trackId = queue.scope === "track" ? queue.trackId : undefined;

  const gameQuery = useGameByIdWithRoundsWithTracks(gameId);
  const roundQuery = useRoundByIdWithTracks(roundId!, {
    enabled: !!roundId,
  });
  const trackQuery = useTrackById(trackId!, {
    enabled: !!trackId,
  });

  const currentGame = queue.scope === "game" ? gameQuery.data : undefined;

  const currentRound =
    queue.scope === "round"
      ? roundQuery.data
      : queue.scope === "game"
        ? currentGame?.rounds.find((r) => r.id === queue.roundId)
        : undefined;

  const currentTrack =
    queue.scope === "track"
      ? trackQuery.data
      : queue.scope !== "empty"
        ? currentRound?.tracks.find((t) => t.id === queue.trackId)
        : undefined;

  currentGameRef.current = currentGame;
  currentRoundRef.current = currentRound;

  const canPlayGame = useCallback(
    (g?: GameSelectWithRoundsWithTracksType) => {
      return !!g && g.rounds.some((r) => canPlayRound(r));
    },
    [canPlayRound],
  );

  const canPlayNextRound = useCallback(() => {
    if (queue.scope === "game") {
      return currentGame?.rounds.some((r) => canPlayRound(r)) ?? false;
    }
    return false;
  }, [canPlayRound, currentGame, queue.scope]);

  const canPlayNextTrack = useCallback(() => {
    if (queue.scope === "round") {
      return currentRound?.tracks.some(canPlayTrack) ?? false;
    }
    if (queue.scope === "game") {
      return (
        currentGame?.rounds.some((r) => r.tracks.some(canPlayTrack)) ?? false
      );
    }
    return false;
  }, [canPlayTrack, currentRound, currentGame, queue.scope]);

  const canPlayPrevRound = useCallback(() => {
    if (queue.scope === "game") {
      return currentGame?.rounds.some((r) => canPlayRound(r)) ?? false;
    }
    return false;
  }, [canPlayRound, currentGame, queue.scope]);

  const canPlayPrevTrack = useCallback(() => {
    if (queue.scope === "round") {
      return currentRound?.tracks.some(canPlayTrack) ?? false;
    }
    if (queue.scope === "game") {
      return (
        currentGame?.rounds.some((r) => r.tracks.some(canPlayTrack)) ?? false
      );
    }
    return false;
  }, [canPlayTrack, currentRound, currentGame, queue.scope]);

  const playTrack = useCallback(
    (track: TrackSelectType) => {
      dispatch({
        type: ACTIONS.STOP,
      });
      queueMicrotask(() => {
        dispatch({
          type: ACTIONS.PLAY_TRACK,
          payload: { track },
        });
      });
    },
    [dispatch],
  );

  const playRound = useCallback(
    (round: RoundSelectWithTracksType) => {
      dispatch({
        type: ACTIONS.STOP,
      });
      queueMicrotask(() => {
        dispatch({
          type: ACTIONS.PLAY_ROUND,
          payload: { round },
        });
      });
    },
    [dispatch],
  );

  const playGame = useCallback(
    (game: GameSelectWithRoundsWithTracksType) => {
      dispatch({
        type: ACTIONS.STOP,
      });
      queueMicrotask(() => {
        dispatch({
          type: ACTIONS.PLAY_GAME,
          payload: { game },
        });
      });
    },
    [dispatch],
  );

  const playNextTrack = useCallback(() => {
    dispatch({ type: ACTIONS.PLAY_NEXT_TRACK });
  }, [dispatch]);

  const playPrevTrack = useCallback(() => {
    dispatch({ type: ACTIONS.PLAY_PREV_TRACK });
  }, [dispatch]);

  const playNextRound = useCallback(() => {
    dispatch({ type: ACTIONS.PLAY_NEXT_ROUND });
  }, [dispatch]);

  const playPrevRound = useCallback(() => {
    dispatch({ type: ACTIONS.PLAY_PREV_ROUND });
  }, [dispatch]);

  const stop = useCallback(() => {
    dispatch({ type: ACTIONS.STOP });
  }, [dispatch]);

  useEffect(() => {
    if (currentTrack && canPlayTrack(currentTrack)) {
      setPlayerState((ps) => ({
        ...ps,
        src: currentTrack.url,
        playing: true,
      }));
    } else {
      setPlayerState((ps) => ({
        ...ps,
        src: undefined,
        playing: false,
      }));
    }
  }, [currentTrack, canPlayTrack, setPlayerState]);

  return (
    <PlayerContext.Provider
      value={{
        playerState,
        setPlayerState,
        playerRef,
        setPlayerRef,
        queue,
        dispatch,
        game: currentGame,
        round: currentRound,
        track: currentTrack,
        canPlayTrack,
        canPlayRound,
        canPlayGame,
        canPlayNextTrack,
        canPlayPrevTrack,
        canPlayNextRound,
        canPlayPrevRound,
        playGame,
        playRound,
        playTrack,
        playNextTrack,
        playPrevTrack,
        playNextRound,
        playPrevRound,
        stop,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be inside PlayerProvider");
  return ctx;
}
