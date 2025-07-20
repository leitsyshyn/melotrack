import { Disc3, Play } from "lucide-react";
import { ComponentProps, useCallback, useMemo } from "react";

import { usePlayer } from "@/components/player/PlayerContext";
import { Button } from "@/components/ui/button";
import {
  GameSelectWithRoundsWithTracksType,
  RoundSelectWithTracksType,
  TrackSelectType,
} from "@/lib/types";
import { cn } from "@/lib/utils";

type ButtonProps = Omit<
  ComponentProps<typeof Button>,
  "track" | "round" | "game"
>;

type ExclusiveTarget =
  | { track: TrackSelectType; round?: never; game?: never }
  | { round: RoundSelectWithTracksType; track?: never; game?: never }
  | { game: GameSelectWithRoundsWithTracksType; track?: never; round?: never }
  | { track?: never; round?: never; game?: never };

export type PlayButtonProps = ButtonProps & ExclusiveTarget;

export function PlayButton({
  track: propTrack,
  round: propRound,
  game: propGame,
  className,
  ...props
}: PlayButtonProps) {
  const {
    playerState,
    track,
    round,
    game,
    canPlayTrack,
    canPlayRound,
    canPlayGame,
    playTrack,
    playRound,
    playGame,
  } = usePlayer();

  const isTargetPlaying = useMemo(() => {
    if (!playerState.playing) return false;
    if (propTrack) return propTrack.id === track?.id;
    if (propRound) return propRound.id === round?.id;
    if (propGame) return propGame.id === game?.id;
    return false;
  }, [playerState.playing, propTrack, track, propRound, round, propGame, game]);

  const disabled = useMemo(() => {
    if (propTrack) return !canPlayTrack(propTrack);
    if (propRound) return !canPlayRound(propRound);
    if (propGame) return !canPlayGame(propGame);
    return true;
  }, [propTrack, propRound, propGame, canPlayTrack, canPlayRound, canPlayGame]);

  const handleClick = useCallback(() => {
    if (propTrack) playTrack(propTrack);
    else if (propRound) playRound(propRound);
    else if (propGame) playGame(propGame);
  }, [propTrack, propRound, propGame, playTrack, playRound, playGame]);

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      size="icon"
      className={cn("group/playpause", className)}
      disabled={disabled}
      {...props}
    >
      {isTargetPlaying ? (
        <>
          <Disc3 className="animate-spin duration-1000 group-hover/playpause:hidden" />
          <Play className="hidden group-hover/playpause:block" />
        </>
      ) : (
        <Play />
      )}
    </Button>
  );
}
