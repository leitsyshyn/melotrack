"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactPlayer from "react-player";

import { PlayerProvider } from "@/components/player/PlayerContext";

// function makeQueryClient() {
//   return new QueryClient({
//     defaultOptions: {
//       queries: {
//         staleTime: 60 * 1000,
//       },
//     },
//   });
// }

// let browserQueryClient: QueryClient | undefined = undefined;

// function getQueryClient() {
//   if (isServer) {
//     return makeQueryClient();
//   } else {
//     if (!browserQueryClient) browserQueryClient = makeQueryClient();
//     return browserQueryClient;
//   }
// }

export default function Providers({ children }: { children: React.ReactNode }) {
  //   const queryClient = getQueryClient();
  const queryClient = new QueryClient({});

  return (
    <QueryClientProvider client={queryClient}>
      <PlayerProvider>
        {children}
        <div className="hidden">
          <ReactPlayer
            src="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            playing={false}
            muted={true}
            controls={true}
            config={{
              youtube: {
                rel: 0,
                enablejsapi: 1,
                start: 0,
                end: 0,
              },
            }}
          />
        </div>
      </PlayerProvider>
    </QueryClientProvider>
  );
}
