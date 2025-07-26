"use client";
import ReactPlayer from "react-player";

import { usePlayer } from "@/components/player/PlayerContext";
import PlayerControls from "@/components/player/PlayerControls";
import { cn } from "@/lib/utils";

// import { usePlayerStore } from "@/stores/playerStore";

interface PlayerProps {
  className?: string;
}

export function Player({ className }: PlayerProps) {
  const { playerRef, playerState, setPlayerRef, handleEnded, track } =
    usePlayer();
  const { src, playing } = playerState;

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
        style={{
          width: "100%",
          height: "auto",
          aspectRatio: "16/9",
        }}
        src={src}
        playing={playing}
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
        onReady={() => {
          if (track?.start && playerRef.current) {
            playerRef.current.currentTime = track.start;
          }
        }}
        onTimeUpdate={() => {
          if (
            playerRef?.current?.currentTime &&
            track?.end &&
            playerRef.current.currentTime >= track.end
          ) {
            handleEnded();
          }
        }}
        // onEnded={playNextTrack}
        className="aspect-16/9 w-full rounded-xl rounded-b-none"
      />
      <PlayerControls />
    </div>
  );
}
