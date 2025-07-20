"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { tracksTable } from "@/db/schema";
import { db } from "@/lib/db";
import { TrackInsertType, TrackUpdateType } from "@/lib/types";

export async function createTrack(track: TrackInsertType) {
  await db.insert(tracksTable).values(track);
  revalidatePath("/create");
}

export async function updateTrack(track: TrackUpdateType, id: string) {
  await db.update(tracksTable).set(track).where(eq(tracksTable.id, id));
  revalidatePath("/create");
}

export async function deleteTrack(id: string) {
  await db.delete(tracksTable).where(eq(tracksTable.id, id));
  revalidatePath("/create");
}
