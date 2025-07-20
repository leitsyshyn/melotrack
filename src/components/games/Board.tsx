"use client";

import { CollisionPriority } from "@dnd-kit/abstract";
import { arrayMove, move } from "@dnd-kit/helpers";
import { DragDropProvider, DragOverlay } from "@dnd-kit/react";
import { isSortable, useSortable } from "@dnd-kit/react/sortable";
import { addSeconds, format } from "date-fns";
import { GripHorizontal, GripVertical, Plus } from "lucide-react";
import { forwardRef, useRef, useState } from "react";

import { deleteTrack } from "@/actions/tracks";
import { DeleteButton } from "@/components/games/DeleteButton";
import { EditButton } from "@/components/games/EditButton";
import TrackDialog from "@/components/games/TrackDialog";
import { PlayButton } from "@/components/player/PlayButton";
import { Button } from "@/components/ui/button";
import {
  GameSelectWithRoundsWithTracksType,
  RoundSelectWithTracksType,
  TrackSelectType,
} from "@/lib/types";
import { cn } from "@/lib/utils";
import { useReorder } from "@/mutations/reorder";

const toColumnMap = (rounds: RoundSelectWithTracksType[]) =>
  Object.fromEntries(rounds.map((r) => [r.id, r.tracks]));

export function Board({ game }: { game: GameSelectWithRoundsWithTracksType }) {
  const [data, setData] = useState(game.rounds);
  const previous = useRef(data);
  const mutation = useReorder(game.id);

  if (!data) return null;

  return (
    <div>
      <DragDropProvider
        onDragStart={() => {
          previous.current = data;
        }}
        onDragOver={(event) => {
          const { source } = event.operation;
          if (source?.type === "column") return;
          setData((current) => {
            const columns = toColumnMap(current);
            const moved = move(columns, event);
            return current.map((round) => ({
              ...round,
              tracks: moved[round.id],
            }));
          });
        }}
        onDragEnd={(event) => {
          const { source, target } = event.operation;
          if (event.canceled) {
            setData(previous.current);
            return;
          }
          if (isSortable(source) && isSortable(target)) {
            const newData =
              source.type === "column" && target.type === "column"
                ? arrayMove(
                    data,
                    source.sortable.initialIndex,
                    target.sortable.index,
                  )
                : data;
            setData(newData);
            mutation.mutate(newData);
          }
        }}
      >
        <div className="flex flex-row flex-wrap gap-4">
          {data.map((round, columnIndex) => (
            <RoundColumn key={round.id} index={columnIndex} round={round} />
          ))}
        </div>
        <DragOverlay>
          {(source) => {
            if (source.type === "column") {
              const round = data.find((r) => r.id === source.id);
              if (!round) return null;
              return (
                <Round
                  round={round}
                  isDragging={source.isDragging}
                  className="data-[dragging=true]:scale-102"
                />
              );
            } else if (source.type === "item") {
              const track = data
                .flatMap((r) => r.tracks)
                .find((t) => t.id === source.id);
              if (!track) return null;
              return (
                <Track
                  track={track}
                  isDragging={source.isDragging}
                  className="data-[dragging=true]:scale-102"
                />
              );
            } else return null;
          }}
        </DragOverlay>
      </DragDropProvider>
    </div>
  );
}

export interface RoundColumnProps {
  index: number;
  round: RoundSelectWithTracksType;
  className?: string;
}

export function RoundColumn({ index, round, className }: RoundColumnProps) {
  const { ref, handleRef, isDragging } = useSortable({
    id: round.id,
    index,
    type: "column",
    collisionPriority: CollisionPriority.Low,
    accept: ["item", "column"],
  });

  return (
    <Round
      round={round}
      ref={ref}
      handleRef={handleRef}
      isDragging={isDragging}
      className={cn("data-[dragging=true]:opacity-50", className)}
    />
  );
}
export interface RoundProps {
  round: RoundSelectWithTracksType;
  className?: string;
  handleRef?: (node: HTMLElement | null) => void;
  isDragging?: boolean;
}

const Round = forwardRef<HTMLDivElement, RoundProps>(function Round(
  { round, className, handleRef, isDragging },
  ref,
) {
  return (
    <section
      ref={ref}
      data-dragging={isDragging}
      className={cn(
        "bg-muted flex min-w-100 flex-col gap-4 rounded-xl border p-4",
        "ease scale-100 shadow-xs transition-all duration-200",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <PlayButton round={round} />
          <h3>{round.name}</h3>
        </div>
        <Button
          variant={"ghost"}
          size={"icon"}
          ref={handleRef}
          className="w-min p-1"
        >
          <GripHorizontal />
        </Button>
      </div>
      <ul className="flex flex-col gap-2">
        {round.tracks.map((track, index) => (
          <TrackItem
            key={track.id}
            index={index}
            column={round.id}
            track={track}
          />
        ))}
        <TrackDialog
          roundId={round.id}
          dialogTitle={`Add Track`}
          dialogDescription={`Add a new track to ${round.name}`}
        >
          <Button className="h-13.5 justify-start" variant={"outline"}>
            <Plus /> Add Track
          </Button>
        </TrackDialog>
      </ul>
    </section>
  );
});

function formatSeconds(sec: number) {
  const d = addSeconds(new Date(0), sec);
  return format(d, sec >= 3600 ? "H:mm:ss" : "m:ss");
}

export interface TrackProps {
  track: TrackSelectType;
  className?: string;
  handleRef?: (node: HTMLElement | null) => void;
  isDragging?: boolean;
}

export const Track = forwardRef<HTMLLIElement, TrackProps>(function Track(
  { track, className, handleRef, isDragging },
  ref,
) {
  return (
    <li
      ref={ref}
      data-dragging={isDragging}
      className={cn(
        "group flex items-center justify-between rounded-md border bg-white p-2",
        "ease scale-100 shadow-xs transition-all duration-200",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <PlayButton track={track} />
        <div>{track.title}</div>
      </div>
      <div className="flex items-center">
        <div className="ease flex items-center opacity-0 transition-all duration-200 group-hover:opacity-100">
          <div className="hidden items-center group-hover:flex">
            <TrackDialog
              {...track}
              dialogTitle="Edit Track"
              dialogDescription="Edit the details of this track"
            >
              <EditButton />
            </TrackDialog>
            <DeleteButton onClick={() => deleteTrack(track.id)} />
          </div>
        </div>
        <div className="text-muted-foreground flex items-center px-2 text-sm group-hover:hidden">
          {formatSeconds(track.start)} – {formatSeconds(track.end)}
        </div>
        <Button
          variant="ghost"
          size="icon"
          ref={handleRef}
          className="w-min px-1"
        >
          <GripVertical />
        </Button>
      </div>
    </li>
  );
});

export interface TrackItemProps {
  index: number;
  column?: string;
  track: TrackSelectType;
  className?: string;
}

export function TrackItem({ index, column, track, className }: TrackItemProps) {
  const { ref, handleRef, isDragging } = useSortable({
    id: track.id,
    index,
    type: "item",
    group: column,
    accept: "item",
  });

  return (
    <Track
      track={track}
      ref={ref}
      handleRef={handleRef}
      isDragging={isDragging}
      className={cn("data-[dragging=true]:opacity-50", className)}
    />
  );
}
