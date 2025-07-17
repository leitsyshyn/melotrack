"use client";

import { SortableItem, SortableList } from "@/components/dnd/sortable";
import Track from "@/components/tracks/Track";
import { RoundSelectWithTracksType } from "@/lib/types";

export interface RoundProps {
  round?: RoundSelectWithTracksType;
  className?: string;
}

export default function Round({ className, round }: RoundProps) {
  return (
    <div>
      <h2>{round?.name}</h2>
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
