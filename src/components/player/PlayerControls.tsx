"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Maximize,
  Pause,
  Play,
  Square,
} from "lucide-react";

import { usePlayer } from "@/components/player/PlayerContext";
import { Button } from "@/components/ui/button";

export function PrevTrackButton() {
  const { playPrevTrack, canPlayPrevTrack } = usePlayer();
  return (
    <Button
      variant={"outline"}
      size={"icon"}
      onClick={playPrevTrack}
      disabled={!canPlayPrevTrack()}
    >
      <ChevronLeft />
    </Button>
  );
}

export function PrevRoundButton() {
  const { playPrevRound, canPlayPrevRound } = usePlayer();
  return (
    <Button
      variant={"outline"}
      size={"icon"}
      onClick={playPrevRound}
      disabled={!canPlayPrevRound()}
    >
      <ChevronsLeft />
    </Button>
  );
}

export function NextTrackButton() {
  const { playNextTrack, canPlayNextTrack } = usePlayer();
  return (
    <Button
      variant={"outline"}
      size={"icon"}
      onClick={playNextTrack}
      disabled={!canPlayNextTrack()}
    >
      <ChevronRight />
    </Button>
  );
}

export function NextRoundButton() {
  const { playNextRound, canPlayNextRound } = usePlayer();
  return (
    <Button
      variant={"outline"}
      size={"icon"}
      onClick={playNextRound}
      disabled={!canPlayNextRound()}
    >
      <ChevronsRight />
    </Button>
  );
}

export function PlayPauseButton() {
  const { playerState, pause, resume } = usePlayer();
  return (
    <Button
      onClick={() => (playerState.playing ? pause() : resume())}
      variant="outline"
      size="icon"
      disabled={!playerState.src}
    >
      {playerState.playing ? <Pause /> : <Play />}
    </Button>
  );
}

export function StopButton({ className }: { className?: string }) {
  const { stop, track } = usePlayer();
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={stop}
      className={className}
      disabled={!track}
    >
      <Square />
    </Button>
  );
}

export function FullscreenButton() {
  const { track } = usePlayer();
  return (
    <Button variant="outline" size="icon" disabled={!track} onClick={() => {}}>
      <Maximize />
    </Button>
  );
}

export default function PlayerControls() {
  return (
    <div className="bg-muted flex items-center justify-between gap-2 rounded-lg rounded-t-none p-2 shadow-xs">
      <StopButton />
      <div className="flex items-center justify-center gap-2">
        <PrevTrackButton />
        <PrevRoundButton />
        <PlayPauseButton />
        <NextRoundButton />
        <NextTrackButton />
      </div>
      <FullscreenButton />
    </div>
  );
}
