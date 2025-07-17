"use client";

import Track from "@/components/tracks/Track";
import { Button } from "@/components/ui/button";
import { SortableItem, SortableList } from "@/components/ui/sortable";
import { usePlayer } from "@/contexts/PlayerContext";
import { RoundSelectWithTracksType } from "@/lib/types";

export interface RoundProps {
  round: RoundSelectWithTracksType;
  className?: string;
}

export default function Round({ className, round }: RoundProps) {
  const { playRound } = usePlayer();

  return (
    <div>
      <h2>{round?.name}</h2>
      <Button
        onClick={() => {
          playRound(round);
        }}
      >
        Play Round
      </Button>
      <SortableList className={className}>
        {round?.tracks?.map((track, index) => (
          <SortableItem key={index} id={index} index={index}>
            <Track {...track} />
          </SortableItem>
        ))}
      </SortableList>
    </div>
  );
}
