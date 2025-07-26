import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import type {
  GameSelectWithRoundsWithTracksType,
  RoundSelectWithTracksType,
} from "@/lib/types";

export function useReorder(gameId: string) {
  const qc = useQueryClient();
  const queryKey = ["game", gameId];

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

    onMutate: async (newRounds) => {
      await qc.cancelQueries({ queryKey });

      const previous =
        qc.getQueryData<GameSelectWithRoundsWithTracksType>(queryKey);

      qc.setQueryData<GameSelectWithRoundsWithTracksType>(queryKey, (old) =>
        old ? { ...old, rounds: newRounds } : old,
      );

      return { previous };
    },

    onError: (_err, _newRounds, context) => {
      if (context?.previous) {
        qc.setQueryData(queryKey, context.previous);
      }
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey });
    },
  });
}
