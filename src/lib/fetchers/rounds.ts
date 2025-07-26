import { api } from "@/api/axios";

export const getRoundByIdWithTracks = (roundId: string) =>
  api.get(`/rounds/${roundId}`).then((res) => res.data);
