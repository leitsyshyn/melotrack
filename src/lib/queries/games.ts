"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getGameByIdWithRoundsWithTracks,
  getGames,
} from "@/lib/fetchers/games";
import {
  GameSelectType,
  GameSelectWithRoundsWithTracksType,
} from "@/lib/types";

export function useGames() {
  return useQuery<GameSelectType[]>({
    queryKey: ["games"],
    queryFn: getGames,
  });
}

export function useGameByIdWithRoundsWithTracks(gameId: string) {
  return useQuery<GameSelectWithRoundsWithTracksType>({
    queryKey: ["game", gameId],
    queryFn: () => getGameByIdWithRoundsWithTracks(gameId),
  });
}
