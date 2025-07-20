"use client";

import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { api } from "@/api/axios";
import { RoundSelectWithTracksType } from "@/lib/types";

export function useRoundByIdWithTracks(
  roundId: string,
  options: Omit<
    UseQueryOptions<RoundSelectWithTracksType>,
    "queryKey" | "queryFn"
  > = {},
) {
  return useQuery<RoundSelectWithTracksType>({
    queryKey: ["round", roundId],
    queryFn: () => api.get(`/rounds/${roundId}`).then((res) => res.data),
    ...options,
  });
}
