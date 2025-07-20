"use client";

import { useQuery } from "@tanstack/react-query";

import { api } from "@/api/axios";
import {
  GameSelectType,
  GameSelectWithRoundsWithTracksType,
} from "@/lib/types";

export function useGames() {
  return useQuery<GameSelectType[]>({
    queryKey: ["games"],
    queryFn: () => api.get("/games").then((res) => res.data),
  });
}

export function useGameByIdWithRoundsWithTracks(gameId: string) {
  return useQuery<GameSelectWithRoundsWithTracksType>({
    queryKey: ["game", gameId],
    queryFn: () => api.get(`/games/${gameId}`).then((res) => res.data),
  });
}
