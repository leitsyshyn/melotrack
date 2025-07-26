import { api } from "@/api/axios";

export const getTrackById = (trackId: string) =>
  api.get(`/tracks/${trackId}`).then((res) => res.data);
