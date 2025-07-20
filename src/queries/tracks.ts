"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { api } from "@/api/axios";
import { TrackSelectType } from "@/lib/types";

export function useTrackById(
  trackId: string,
  options: Omit<UseQueryOptions<TrackSelectType>, "queryKey" | "queryFn"> = {},
) {
  return useQuery<TrackSelectType>({
    queryKey: ["track", trackId],
    queryFn: () => api.get(`/tracks/${trackId}`).then((res) => res.data),
    ...options,
  });
}
