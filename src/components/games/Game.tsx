"use client";

import { Board } from "@/components/games/Board";
import { PlayButton } from "@/components/player/PlayButton";
import { GameSelectType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useGameByIdWithRoundsWithTracks } from "@/queries/games";

export interface GameProps {
  game: GameSelectType;
  className?: string;
}

export default function Game({ className, game }: GameProps) {
  const { data, isLoading, isError } = useGameByIdWithRoundsWithTracks(game.id);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading game</div>;
  if (!data) return <div>No game data found</div>;

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-3xl border bg-white p-4 shadow-xs",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <PlayButton game={data} />
          <h1>{data?.name}</h1>
        </div>
      </div>
      <Board game={data} />
    </div>
  );
}
