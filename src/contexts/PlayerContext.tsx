"use client";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  GameSelectWithRoundsWithTracksType,
  RoundSelectWithTracksType,
  TrackSelectType,
} from "@/lib/types";

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
  state: PlayerState;
  setState: React.Dispatch<React.SetStateAction<PlayerState>>;
  playerRef: React.RefObject<HTMLVideoElement | null>;
  setPlayerRef: (player: HTMLVideoElement) => void;
  track: TrackSelectType | null;
  setTrack: React.Dispatch<React.SetStateAction<TrackSelectType | null>>;
  togglePlaying: () => void;
  playTrack: (track: TrackSelectType) => void;
  playRound: (round: RoundSelectWithTracksType) => void;
  playGame: (game: GameSelectWithRoundsWithTracksType) => void;
  handleEnded: () => void;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const playerRef = useRef<HTMLVideoElement | null>(null);

  const setPlayerRef = useCallback((player: HTMLVideoElement) => {
    if (!player) return;
    playerRef.current = player;
  }, []);

  const [state, setState] = useState<PlayerState>({
    src: undefined,
    pip: false,
    playing: false,
    controls: true,
    light: false,
    volume: 1,
    muted: false,
    played: 0,
    loaded: 0,
    duration: 0,
    playbackRate: 1.0,
    loop: false,
    seeking: false,
    loadedSeconds: 0,
    playedSeconds: 0,
  });

  const [track, setTrack] = useState<TrackSelectType | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [round, setRound] = useState<RoundSelectWithTracksType | null>(null);
  const [currentRoundIndex, setCurrentRoundIndex] = useState<number>(0);
  const [game, setGame] = useState<GameSelectWithRoundsWithTracksType | null>(
    null
  );
  const [gap, setGap] = useState<number>(5);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const togglePlaying = useCallback(() => {
    setState((prevState) => ({ ...prevState, playing: !prevState.playing }));
  }, []);

  const playTrack = useCallback((track: TrackSelectType) => {
    setTrack(track);
    setState((prevState) => ({
      ...prevState,
      src: track.url,
      playing: true,
    }));
  }, []);

  const playRound = useCallback(
    (round: RoundSelectWithTracksType) => {
      setRound(round);
      setGap(round.gap);
      const firstTrack = round.tracks[currentTrackIndex];
      playTrack(firstTrack);
    },
    [playTrack, currentTrackIndex]
  );

  const playGame = useCallback(
    (game: GameSelectWithRoundsWithTracksType) => {
      setGame(game);
      setCurrentRoundIndex(0);
      const first = game.rounds[0];
      setRound(first);
      setGap(first.gap);
      setCurrentTrackIndex(0);
      playTrack(first.tracks[0]);
    },
    [playTrack]
  );

  function handleEnded() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (!round) return;
    const nextTrackIndex = currentTrackIndex + 1;
    timerRef.current = setTimeout(() => {
      if (round.tracks[nextTrackIndex]) {
        setCurrentTrackIndex(nextTrackIndex);
        playTrack(round.tracks[nextTrackIndex]);
      } else {
        const nextRoundIndex = currentRoundIndex + 1;
        if (game?.rounds[nextRoundIndex]) {
          setCurrentRoundIndex(nextRoundIndex);
          setRound(game.rounds[nextRoundIndex]);
          setGap(game.rounds[nextRoundIndex].gap);
          setCurrentTrackIndex(0);
          playTrack(game.rounds[nextRoundIndex].tracks[0]);
        } else {
          setState((prevState) => ({ ...prevState, playing: false }));
        }
      }
    }, gap * 1000);
  }
  return (
    <PlayerContext.Provider
      value={{
        state,
        setState,
        playerRef,
        setPlayerRef,
        track,
        setTrack,
        togglePlaying,
        playTrack,
        playRound,
        playGame,
        handleEnded,
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
