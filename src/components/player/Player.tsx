"use client";
import ReactPlayer from "react-player";

import { usePlayer } from "@/components/player/PlayerContext";
import PlayerControls from "@/components/player/PlayerControls";
import { cn } from "@/lib/utils";

interface PlayerProps {
  className?: string;
}

export function Player({ className }: PlayerProps) {
  const { track, playerState, setPlayerRef, playNextTrack } = usePlayer();
  const { src, playing, controls } = playerState;

  return (
    <div
      className={cn(
        "w-100 overflow-hidden rounded-xl border shadow-xs",
        className,
      )}
    >
      <ReactPlayer
        key={`${track?.id}-${track?.start}-${track?.end}`}
        ref={setPlayerRef}
        style={{ width: "100%", height: "auto", aspectRatio: "16/9" }}
        src={src}
        playing={playing}
        controls={controls}
        config={{
          youtube: {
            start: track?.start,
            end: track?.end,
            rel: 0,
            enablejsapi: 1,
          },
          spotify: {
            startAt: track?.start,
          },
        }}
        onEnded={playNextTrack}
        className="rounded-xl rounded-b-none"
      />
      <PlayerControls />
    </div>
  );
}
