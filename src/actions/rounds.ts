"use server";

import { roundsTable } from "@/db/schema";
import { db } from "@/lib/db";
import { RoundInsertType } from "@/lib/types";

export async function createRound(values: RoundInsertType) {
  await db.insert(roundsTable).values(values);
}
