"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { getTrackById } from "@/lib/fetchers/tracks";
import { TrackSelectType } from "@/lib/types";

export function useTrackById(
  trackId: string,
  options: Omit<UseQueryOptions<TrackSelectType>, "queryKey" | "queryFn"> = {},
) {
  return useQuery<TrackSelectType>({
    queryKey: ["track", trackId],
    queryFn: () => getTrackById(trackId),
    ...options,
  });
}
