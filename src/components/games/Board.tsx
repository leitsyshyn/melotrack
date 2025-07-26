"use client";

import { CollisionPriority } from "@dnd-kit/abstract";
import { arrayMove, move } from "@dnd-kit/helpers";
import { DragDropProvider, DragOverlay } from "@dnd-kit/react";
import { isSortable, useSortable } from "@dnd-kit/react/sortable";
import { useQueryClient } from "@tanstack/react-query";
import { Edit, GripHorizontal, GripVertical, Plus } from "lucide-react";
import { forwardRef, useRef } from "react";

import DeleteDialog from "@/components/games/DeleteDialog";
import RoundDialog from "@/components/games/RoundDialog";
import TrackDialog from "@/components/games/TrackDialog";
import { PlayButton } from "@/components/player/PlayButton";
import { Button } from "@/components/ui/button";
import { formatSeconds, roundDuration } from "@/lib/duration";
import { useReorder } from "@/lib/mutations/reorder";
import { useDeleteRound } from "@/lib/mutations/rounds";
import { useDeleteTrack } from "@/lib/mutations/tracks";
import {
  GameSelectWithRoundsWithTracksType,
  RoundSelectWithTracksType,
  TrackSelectType,
} from "@/lib/types";
import { cn } from "@/lib/utils";

const toColumnMap = (rounds: RoundSelectWithTracksType[]) =>
  Object.fromEntries(rounds.map((r) => [r.id, r.tracks]));

export function Board({ game }: { game: GameSelectWithRoundsWithTracksType }) {
  const qc = useQueryClient();
  const key = ["game", game.id] as const;
  const mutation = useReorder(game.id);
  const previous = useRef(game.rounds);

  const rounds =
    qc.getQueryData<GameSelectWithRoundsWithTracksType>(key)?.rounds ?? [];

  return (
    <div>
      <DragDropProvider
        onDragStart={() => {
          previous.current = rounds;
        }}
        onDragOver={(event) => {
          const { source } = event.operation;
          if (source?.type === "column") return;

          qc.setQueryData<GameSelectWithRoundsWithTracksType>(key, (old) => {
            if (!old) return old;
            const moved = move(toColumnMap(old.rounds), event);
            return {
              ...old,
              rounds: old.rounds.map((r) => ({
                ...r,
                tracks: moved[r.id],
              })),
            };
          });
        }}
        onDragEnd={(event) => {
          const { source, target } = event.operation;

          if (event.canceled) {
            qc.setQueryData<GameSelectWithRoundsWithTracksType>(key, (old) =>
              old ? { ...old, rounds: previous.current } : old,
            );
            return;
          }

          if (isSortable(source) && isSortable(target)) {
            const newRounds =
              source.type === "column" && target.type === "column"
                ? arrayMove(
                    rounds,
                    source.sortable.initialIndex,
                    target.sortable.index,
                  )
                : rounds;

            qc.setQueryData<GameSelectWithRoundsWithTracksType>(key, (old) =>
              old ? { ...old, rounds: newRounds } : old,
            );

            mutation.mutate(newRounds);
          }
        }}
      >
        <div className="flex flex-row gap-4 overflow-x-auto pb-4">
          {rounds.map((round, idx) => (
            <RoundColumn key={round.id} index={idx} round={round} />
          ))}

          <div className="flex-1">
            <RoundDialog
              gameId={game.id}
              dialogTitle="Add Round"
              dialogDescription="Add a new round to this game"
            >
              <Button
                className="h-full w-full min-w-100 flex-col justify-center rounded-xl"
                variant="outline"
              >
                <Plus />
                Add Round
              </Button>
            </RoundDialog>
          </div>
        </div>

        <DragOverlay>
          {(source) => {
            if (source.type === "column") {
              const round = rounds.find((r) => r.id === source.id);
              return (
                round && (
                  <Round
                    round={round}
                    isDragging={source.isDragging}
                    className="data-[dragging=true]:scale-102 data-[dragging=true]:shadow-2xl"
                  />
                )
              );
            }
            if (source.type === "item") {
              const track = rounds
                .flatMap((r) => r.tracks)
                .find((t) => t.id === source.id);
              return (
                track && (
                  <Track
                    track={track}
                    gameId={game.id}
                    isDragging={source.isDragging}
                    className="data-[dragging=true]:scale-102 data-[dragging=true]:shadow-2xl"
                  />
                )
              );
            }
            return null;
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
      className={cn("flex-1 data-[dragging=true]:opacity-50", className)}
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
  const mutation = useDeleteRound(round.gameId, round.id);
  return (
    <section
      ref={ref}
      data-dragging={isDragging}
      className={cn(
        "bg-muted group/round flex min-w-100 flex-col gap-4 rounded-xl border p-4",
        "ease scale-100 shadow-xs transition-all duration-200",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <PlayButton round={round} />
          <h3>{round.name}</h3>
        </div>
        <div className="flex items-center">
          <div className="item-center flex opacity-0 transition-all duration-200 group-hover/round:opacity-100">
            <TrackDialog
              gameId={round.gameId}
              roundId={round.id}
              dialogTitle={`Add Track`}
              dialogDescription={`Add a new track to ${round.name}`}
            >
              <Button variant="ghost" size={"icon"}>
                <Plus />
              </Button>
            </TrackDialog>
            <RoundDialog
              {...round}
              dialogTitle="Edit Round"
              dialogDescription="Edit the details of this round"
            >
              <Button variant="ghost" size={"icon"}>
                <Edit />
              </Button>
            </RoundDialog>
            <DeleteDialog
              deleteMutation={mutation}
              dialogTitle="Delete Round"
              dialogDescription="Are you sure you want to delete this round?"
            />
          </div>
          <div className="text-muted-foreground flex items-center gap-1 px-2 text-sm group-hover/round:hidden">
            <span>{formatSeconds(roundDuration(round))}</span>/
            <span>{round.gap}s</span>
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
      </div>
      <ul className="flex flex-col gap-2">
        {round.tracks.map((track, index) => (
          <TrackItem
            key={track.id}
            index={index}
            column={round.id}
            track={track}
            gameId={round.gameId}
          />
        ))}
        <TrackDialog
          gameId={round.gameId}
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

export interface TrackProps {
  track: TrackSelectType;
  gameId: string;
  className?: string;
  handleRef?: (node: HTMLElement | null) => void;
  isDragging?: boolean;
}

export const Track = forwardRef<HTMLLIElement, TrackProps>(function Track(
  { track, className, handleRef, isDragging, gameId },
  ref,
) {
  const mutation = useDeleteTrack(gameId, track.roundId, track.id);
  return (
    <li
      ref={ref}
      data-dragging={isDragging}
      className={cn(
        "group/track flex items-center justify-between rounded-md border bg-white p-2",
        "ease scale-100 shadow-xs transition-all duration-200",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <PlayButton track={track} />
        <div>{track.title}</div>
      </div>
      <div className="flex items-center">
        <div className="ease flex items-center opacity-0 transition-all duration-200 group-hover/track:opacity-100">
          <div className="hidden items-center group-hover/track:flex">
            <TrackDialog
              {...track}
              gameId={gameId}
              dialogTitle="Edit Track"
              dialogDescription="Edit the details of this track"
            >
              <Button variant="ghost" size={"icon"}>
                <Edit />
              </Button>
            </TrackDialog>
            <DeleteDialog
              deleteMutation={mutation}
              dialogTitle="Delete Track"
              dialogDescription="Are you sure you want to delete this track?"
            />
          </div>
        </div>
        <div className="text-muted-foreground flex items-center px-2 text-sm group-hover/track:hidden">
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
  gameId: string;
  className?: string;
}

export function TrackItem({
  index,
  column,
  track,
  gameId,
  className,
}: TrackItemProps) {
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
      gameId={gameId}
      ref={ref}
      handleRef={handleRef}
      isDragging={isDragging}
      className={cn("data-[dragging=true]:opacity-50", className)}
    />
  );
}
