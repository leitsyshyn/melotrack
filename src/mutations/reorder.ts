import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import { RoundSelectWithTracksType } from "@/lib/types";

export function useReorder(gameId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: RoundSelectWithTracksType[]) => {
      const payload = {
        roundOrder: data.map((r) => r.id),
        tracksByRound: Object.fromEntries(
          data.map((r) => [r.id, r.tracks.map((t) => t.id)]),
        ),
      };
      return axios.post("/api/reorder", payload);
    },

    onSuccess: () => {
      console.log("Reorder successful");
      qc.invalidateQueries({ queryKey: ["game", gameId] });
    },
  });
}
