import { api } from "@/api/axios";

export const getGames = () => api.get("/games").then((res) => res.data);

export const getGameByIdWithRoundsWithTracks = (gameId: string) =>
  api.get(`/games/${gameId}`).then((res) => res.data);
