"use server";

import { gamesTable } from "@/db/schema";
import { db } from "@/lib/db";
import { GameInsertType } from "@/lib/types";

export async function createGame(values: GameInsertType) {
  await db.insert(gamesTable).values(values);
}
