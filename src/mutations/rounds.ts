"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createRound, deleteRound, updateRound } from "@/actions/rounds";
import { RoundUpdateType } from "@/lib/types";

export function useCreateRound(gameId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRound,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["game", gameId] });
      queryClient.invalidateQueries({ queryKey: ["rounds"] });
    },
  });
}

export function useUpdateRound(gameId: string, roundId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (round: RoundUpdateType) => updateRound(round, roundId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["game", gameId] });
      queryClient.invalidateQueries({ queryKey: ["rounds"] });
      queryClient.invalidateQueries({ queryKey: ["round", roundId] });
    },
  });
}

export function useDeleteRound(gameId: string, roundId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteRound(roundId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["game", gameId] });
      queryClient.invalidateQueries({ queryKey: ["rounds"] });
      queryClient.invalidateQueries({ queryKey: ["round", roundId] });
    },
  });
}
