"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createTrack, deleteTrack, updateTrack } from "@/actions/tracks";
import { TrackUpdateType } from "@/lib/types";

export function useCreateTrack(gameId?: string, roundId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTrack,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["game", gameId] });
      queryClient.invalidateQueries({ queryKey: ["round", roundId] });
      queryClient.invalidateQueries({ queryKey: ["tracks"] });
    },
  });
}

export function useUpdateTrack(
  gameId: string,
  roundId: string,
  trackId: string,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (track: TrackUpdateType) => updateTrack(track, trackId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["game", gameId] });
      queryClient.invalidateQueries({ queryKey: ["round", roundId] });
      queryClient.invalidateQueries({ queryKey: ["tracks"] });
      queryClient.invalidateQueries({ queryKey: ["track", trackId] });
    },
  });
}

export function useDeleteTrack(
  gameId: string,
  roundId: string,
  trackId: string,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteTrack(trackId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["game", gameId] });
      queryClient.invalidateQueries({ queryKey: ["round", roundId] });
      queryClient.invalidateQueries({ queryKey: ["tracks"] });
      queryClient.invalidateQueries({ queryKey: ["track", trackId] });
    },
  });
}
