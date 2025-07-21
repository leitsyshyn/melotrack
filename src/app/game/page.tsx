"use client";

import { DragDropProvider, useDraggable } from "@dnd-kit/react";
import { Plus } from "lucide-react";

import Game from "@/components/games/Game";
import GameDialog from "@/components/games/GameDialog";
import { Player } from "@/components/player/Player";
import { Button } from "@/components/ui/button";
import { useGames } from "@/queries/games";

export default function CreatePage() {
  const { data } = useGames();
  const { ref, handleRef, isDragging } = useDraggable({ id: "player" });

  return (
    <DragDropProvider onDragEnd={(delta) => {}}>
      <div className="flex flex-col gap-4 p-4">
        <GameDialog
          dialogTitle="Create Game"
          dialogDescription="Create a new game"
        >
          <Button
            variant={"outline"}
            className="h-13.5 justify-start rounded-xl"
          >
            <Plus />
            Create Game
          </Button>
        </GameDialog>
        {data?.map((game) => (
          <Game key={game.id} game={game} />
        ))}
        <div
          className="absolute right-4 bottom-4 w-min rounded-3xl border bg-white p-4 shadow-xs"
          ref={ref}
        >
          <Player />
        </div>
      </div>
    </DragDropProvider>
  );
}
