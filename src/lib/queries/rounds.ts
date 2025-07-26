"use client";

import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { getRoundByIdWithTracks } from "@/lib/fetchers/rounds";
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
    queryFn: () => getRoundByIdWithTracks(roundId),
    ...options,
  });
}
