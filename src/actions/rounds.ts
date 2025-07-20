"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { roundsTable } from "@/db/schema";
import { db } from "@/lib/db";
import { RoundInsertType, RoundUpdateType } from "@/lib/types";

export async function createRound(values: RoundInsertType) {
  await db.insert(roundsTable).values(values);
  revalidatePath("/create");
}

export async function updateRound(round: RoundUpdateType, id: string) {
  await db.update(roundsTable).set(round).where(eq(roundsTable.id, id));
  revalidatePath("/create");
}

export async function deleteRound(id: string) {
  await db.delete(roundsTable).where(eq(roundsTable.id, id));
  revalidatePath("/create");
}
