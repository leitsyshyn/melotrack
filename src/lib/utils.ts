import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getYTVideoId(url: string) {
  const videoUrl = new URL(url) ?? "";
  return (
    videoUrl.searchParams.get("v") ??
    videoUrl.pathname.split("/").pop()!.split("?")[0]
  );
}
