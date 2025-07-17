"use client";

import { SortableItem, SortableList } from "@/components/dnd/sortable";
import Round from "@/components/rounds/Round";
import { GameSelectWithRoundsWithTracksType } from "@/lib/types";

export interface GameProps {
  game?: GameSelectWithRoundsWithTracksType;
  className?: string;
}

export default function Game({ className, game }: GameProps) {
  return (
    <div>
      <h1>{game?.name}</h1>
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
