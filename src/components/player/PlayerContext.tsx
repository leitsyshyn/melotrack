import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";

import {
  Action,
  ActionType,
  Cursor,
  emptyCursor,
  isPlayableTrack,
  nextRound,
  nextTrack,
  prevRound,
  prevTrack,
  reducer,
} from "@/components/player/reducer";
import { isPlayableGame, isPlayableRound } from "@/components/player/utils";
import { useGameByIdWithRoundsWithTracks } from "@/lib/queries/games";
import { useRoundByIdWithTracks } from "@/lib/queries/rounds";
import { useTrackById } from "@/lib/queries/tracks";
import {
  GameSelectWithRoundsWithTracksType,
  RoundSelectWithTracksType,
  TrackSelectType,
} from "@/lib/types";

type PlayerState = {
  src?: string;
  playing: boolean;
  volume: number;
  muted: boolean;
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

  queue: Cursor;
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
  handleEnded: () => void;

  stop: () => void;
  pause: () => void;
  resume: () => void;
};

export function PlayerProvider({ children }: { children: ReactNode }) {
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const setPlayerRef = useCallback((player: HTMLVideoElement) => {
    if (!player) return;
    playerRef.current = player;
  }, []);

  const [playerState, setPlayerState] = useState<PlayerState>({
    src: undefined,
    playing: false,
    volume: 1,
    muted: false,
    playbackRate: 1,
    seeking: false,
    loadedSeconds: 0,
    playedSeconds: 0,
    loop: false,
  });

  const [queue, dispatch] = useReducer(reducer, emptyCursor);

  const gameId = queue.scope === "game" ? queue.gameId : "";
  const roundId =
    queue.scope === "game" || queue.scope === "round"
      ? queue.roundId
      : undefined;
  const trackId = queue.scope === "track" ? queue.trackId : undefined;

  const gameQuery = useGameByIdWithRoundsWithTracks(gameId);
  const roundQuery = useRoundByIdWithTracks(roundId!, { enabled: !!roundId });
  const trackQuery = useTrackById(trackId!, { enabled: !!trackId });

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

  const canPlayTrack = useCallback(
    (t?: TrackSelectType) => isPlayableTrack(t),
    [],
  );
  const canPlayRound = useCallback(
    (r?: RoundSelectWithTracksType) => isPlayableRound(r),
    [],
  );
  const canPlayGame = useCallback(
    (g?: GameSelectWithRoundsWithTracksType) => isPlayableGame(g),
    [],
  );

  const canPlayNextTrack = useCallback(() => {
    if (queue.scope === "round" || queue.scope === "game") {
      const nextInRound = nextTrack(currentRound?.tracks, currentTrack?.id);
      if (nextInRound) return true;
    }
    return false;
  }, [queue.scope, currentRound, currentTrack]);

  const canPlayPrevTrack = useCallback((): boolean => {
    if (queue.scope === "round" || queue.scope === "game") {
      const prevInRound = prevTrack(currentRound?.tracks, currentTrack?.id);
      if (prevInRound) return true;
    }
    return false;
  }, [queue.scope, currentRound, currentTrack]);

  const canPlayNextRound = useCallback((): boolean => {
    if (queue.scope !== "game") return false;
    const r = nextRound(currentGame?.rounds, currentRound?.id);
    return !!(r && nextTrack(r.tracks, undefined));
  }, [queue.scope, currentRound, currentGame]);

  const canPlayPrevRound = useCallback((): boolean => {
    if (queue.scope !== "game") return false;
    const r = prevRound(currentGame?.rounds, currentRound?.id);
    return !!(r && nextTrack(r.tracks, undefined));
  }, [queue.scope, currentRound, currentGame]);

  const gapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearGapTimeout = useCallback(() => {
    if (gapTimeoutRef.current != null) {
      clearTimeout(gapTimeoutRef.current);
      gapTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearGapTimeout();
    };
  }, [clearGapTimeout]);

  useEffect(() => {
    clearGapTimeout();
  }, [queue.scope, gameId, roundId, trackId, clearGapTimeout]);

  const playTrack = useCallback(
    (track: TrackSelectType) => {
      clearGapTimeout();
      dispatch({ type: ActionType.STOP });
      queueMicrotask(() => {
        dispatch({ type: ActionType.PLAY_TRACK, payload: { track } });
      });
    },
    [clearGapTimeout],
  );

  const playRound = useCallback(
    (round: RoundSelectWithTracksType) => {
      clearGapTimeout();
      dispatch({ type: ActionType.STOP });
      queueMicrotask(() => {
        dispatch({ type: ActionType.PLAY_ROUND, payload: { round } });
      });
    },
    [clearGapTimeout],
  );

  const playGame = useCallback(
    (game: GameSelectWithRoundsWithTracksType) => {
      clearGapTimeout();
      dispatch({ type: ActionType.STOP });
      queueMicrotask(() => {
        dispatch({ type: ActionType.PLAY_GAME, payload: { game } });
      });
    },
    [clearGapTimeout],
  );

  const playNextTrack = useCallback(() => {
    clearGapTimeout();
    dispatch({
      type: ActionType.NEXT_TRACK,
      payload: {
        rounds: currentGame?.rounds,
        tracks: currentRound?.tracks,
      },
    });
  }, [currentGame, currentRound, clearGapTimeout]);

  const handleEnded = useCallback(() => {
    const gap = canPlayNextTrack()
      ? currentRound?.gap
      : canPlayNextRound()
        ? currentGame?.gap
        : undefined;
    console.log("handleEnded", gap);
    gapTimeoutRef.current = setTimeout(playNextTrack, gap && gap * 1000);
  }, [
    canPlayNextRound,
    canPlayNextTrack,
    currentRound,
    currentGame,
    playNextTrack,
  ]);

  const playPrevTrack = useCallback(() => {
    clearGapTimeout();
    dispatch({
      type: ActionType.PREV_TRACK,
      payload: {
        rounds: currentGame?.rounds,
        tracks: currentRound?.tracks,
      },
    });
  }, [currentGame, currentRound, clearGapTimeout]);

  const playNextRound = useCallback(() => {
    clearGapTimeout();
    dispatch({
      type: ActionType.NEXT_ROUND,
      payload: {
        rounds: currentGame?.rounds,
      },
    });
  }, [currentGame, clearGapTimeout]);

  const playPrevRound = useCallback(() => {
    clearGapTimeout();
    dispatch({
      type: ActionType.PREV_ROUND,
      payload: {
        rounds: currentGame?.rounds,
      },
    });
  }, [currentGame, clearGapTimeout]);

  const pause = useCallback(() => {
    setPlayerState((ps) => ({ ...ps, playing: false }));
  }, []);

  const resume = useCallback(() => {
    setPlayerState((ps) => ({ ...ps, playing: true }));
  }, []);

  const stop = useCallback(() => {
    dispatch({ type: ActionType.STOP });
  }, []);

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

  const contextValue = useMemo<PlayerContextType>(
    () => ({
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
      handleEnded,
      pause,
      resume,
    }),
    [
      playerState,
      queue,
      currentGame,
      currentRound,
      currentTrack,
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
      setPlayerRef,
      handleEnded,
      pause,
      resume,
    ],
  );

  return (
    <PlayerContext.Provider value={contextValue}>
      {children}
    </PlayerContext.Provider>
  );
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be inside PlayerProvider");
  return ctx;
}
