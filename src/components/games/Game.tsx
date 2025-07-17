"use client";

import Round from "@/components/rounds/Round";
import { Button } from "@/components/ui/button";
import { SortableItem, SortableList } from "@/components/ui/sortable";
import { usePlayer } from "@/contexts/PlayerContext";
import { GameSelectWithRoundsWithTracksType } from "@/lib/types";

export interface GameProps {
  game: GameSelectWithRoundsWithTracksType;
  className?: string;
}

export default function Game({ className, game }: GameProps) {
  const { playGame } = usePlayer();
  return (
    <div>
      <h1>{game?.name}</h1>
      <Button onClick={() => playGame(game)}>Play Game</Button>
      <SortableList className={className}>
        {game?.rounds?.map((round, index) => (
          <SortableItem key={index} id={index} index={index}>
            <Round round={round} />
          </SortableItem>
        ))}
      </SortableList>
    </div>
  );
}
