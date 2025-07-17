"use client";
import ReactPlayer from "react-player";

import { usePlayer } from "@/contexts/PlayerContext";

interface PlayerProps {
  className?: string;
}

export function Player({ className }: PlayerProps) {
  const { track, state, setPlayerRef, handleEnded } = usePlayer();
  const { src, playing, controls } = state;
  if (!track || !track.start) return null;
  console.log("Player", track);

  return (
    <ReactPlayer
      key={`${track.id}-${track.start}-${track.end}`}
      ref={setPlayerRef}
      style={{ width: "100%", height: "auto", aspectRatio: "16/9" }}
      src={src}
      playing={playing}
      controls={controls}
      config={{
        youtube: {
          start: track.start,
          end: track.end,
          rel: 0,
        },
        spotify: {
          startAt: track.start,
        },
      }}
      //   onTimeUpdate={handleTimeUpdate}
      onEnded={handleEnded}
      className={className}
    />
  );
}
