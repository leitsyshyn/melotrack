"use client";
import { useCallback, useRef, useState } from "react";
import ReactPlayer from "react-player";

import { RoundSelectWithTracksType } from "@/lib/types";

interface RoundPlayerProps {
  round: RoundSelectWithTracksType;
  className?: string;
}

export function RoundPlayer({ round, className }: RoundPlayerProps) {
  const playerRef = useRef<HTMLVideoElement | null>(null);

  const setPlayerRef = useCallback((player: HTMLVideoElement) => {
    if (!player) return;
    playerRef.current = player;
    console.log(player);
  }, []);

  const initialState = {
    src: round.tracks[0]?.url,
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
  };

  type PlayerState = Omit<typeof initialState, "src"> & {
    src?: string;
  };

  const [state, setState] = useState<PlayerState>(initialState);
  const [current, setCurrent] = useState<number>(0);

  const load = (src?: string) => {
    setState((prevState) => ({
      ...prevState,
      src,
      played: 0,
      loaded: 0,
      playing: true,
    }));
  };

  const handleEnded = () => {
    console.log("onEnded");
    setState((prevState) => ({ ...prevState, playing: prevState.loop }));
    if (current + 1 < round.tracks.length) {
      setCurrent(current + 1);
      load(round.tracks[current + 1]?.url);
    }
  };

  const handleTimeUpdate = () => {
    const player = playerRef.current;
    if (!player || !player.duration || state.seeking) return;
    setState((prevState) => ({
      ...prevState,
      playedSeconds: player.currentTime,
      played: player.currentTime / player.duration,
      playing: true,
    }));
    if (player.currentTime > round.tracks[current]?.end) {
      handleEnded();
    }
  };

  const { src, playing, controls } = state;

  return (
    <ReactPlayer
      key={`${round.id}-${current}`}
      ref={setPlayerRef}
      className={className}
      style={{ width: "100%", height: "auto", aspectRatio: "16/9" }}
      src={src}
      playing={playing}
      controls={controls}
      config={{
        youtube: {
          start: round.tracks[current]?.start,
          end: round.tracks[current]?.end,
          rel: 0,
        },
        spotify: {
          startAt: round.tracks[current]?.start,
        },
      }}
      onTimeUpdate={handleTimeUpdate}
      onEnded={handleEnded}
    />
  );
}
