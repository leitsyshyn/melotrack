"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { PlayerProvider } from "@/components/player/PlayerContext";
import { queryClient } from "@/lib/queryClient";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <PlayerProvider>{children}</PlayerProvider>
      {/* {children} */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
