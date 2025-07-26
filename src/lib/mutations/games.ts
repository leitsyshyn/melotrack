"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createGame, deleteGame, updateGame } from "@/lib/actions/games";
import { GameUpdateType } from "@/lib/types";

export function useCreateGame() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createGame,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
    },
  });
}

export function useUpdateGame(gameId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (game: GameUpdateType) => updateGame(game, gameId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["games"] });
      qc.invalidateQueries({ queryKey: ["game", gameId] });
    },
  });
}

export function useDeleteGame(gameId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteGame(gameId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
      queryClient.invalidateQueries({ queryKey: ["game", gameId] });
    },
  });
}
