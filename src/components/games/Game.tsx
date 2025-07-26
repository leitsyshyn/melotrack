"use client";

import { Edit, Plus } from "lucide-react";

import { Board } from "@/components/games/Board";
import DeleteDialog from "@/components/games/DeleteDialog";
import GameDialog from "@/components/games/GameDialog";
import RoundDialog from "@/components/games/RoundDialog";
import { PlayButton } from "@/components/player/PlayButton";
import { Button } from "@/components/ui/button";
import { formatSeconds, gameDuration } from "@/lib/duration";
import { useDeleteGame } from "@/lib/mutations/games";
import { useGameByIdWithRoundsWithTracks } from "@/lib/queries/games";
import { GameSelectType } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface GameProps {
  game: GameSelectType;
  className?: string;
}

export default function Game({ className, game }: GameProps) {
  const { data, isLoading, isError } = useGameByIdWithRoundsWithTracks(game.id);
  const mutation = useDeleteGame(data?.id ?? "");

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading game</div>;
  if (!data) return <div>No game data found</div>;

  return (
    <div
      className={cn(
        "group/game flex flex-col gap-4 rounded-3xl border bg-white p-4 shadow-xs",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <PlayButton game={data} />
            <h1>{data?.name}</h1>
          </div>
          <div className="item-center flex opacity-0 transition-all duration-200 group-hover/game:opacity-100">
            <RoundDialog
              gameId={game.id}
              dialogTitle="Add Round"
              dialogDescription="Add a new round to this game"
            >
              <Button size={"icon"} variant="ghost">
                <Plus />
              </Button>
            </RoundDialog>
            <GameDialog
              {...game}
              dialogTitle="Edit Game"
              dialogDescription="Edit the details of this game"
            >
              <Button variant="ghost" size={"icon"}>
                <Edit />
              </Button>
            </GameDialog>
            <DeleteDialog
              deleteMutation={mutation}
              dialogTitle="Delete Game"
              dialogDescription="Are you sure you want to delete this game?"
            />
          </div>
          <div className="text-muted-foreground flex items-center gap-1 px-2 text-sm group-hover/game:hidden">
            <span>{formatSeconds(gameDuration(data))}</span>/{" "}
            <span>{game.gap}s</span>
          </div>
        </div>
      </div>
      <Board game={data} />
    </div>
  );
}
