"use server";

import { tracksTable } from "@/db/schema";
import { db } from "@/lib/db";
import { TrackInsertType } from "@/lib/types";

export async function createTrack(track: TrackInsertType) {
  await db.insert(tracksTable).values(track);
}
