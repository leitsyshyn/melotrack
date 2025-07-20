"use server";

import { eq } from "drizzle-orm";

import { gamesTable } from "@/db/schema";
import { db } from "@/lib/db";
import { GameInsertType, GameUpdateType } from "@/lib/types";

export async function createGame(values: GameInsertType) {
  await db.insert(gamesTable).values(values);
}

export async function updateGame(game: GameUpdateType, id: string) {
  await db.update(gamesTable).set(game).where(eq(gamesTable.id, id));
}
export async function deleteGame(id: string) {
  await db.delete(gamesTable).where(eq(gamesTable.id, id));
}
