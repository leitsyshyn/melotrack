import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function GET() {
  const games = await db.query.gamesTable.findMany({
    orderBy: (gamesTable) => [gamesTable.name],
  });
  return NextResponse.json(games);
}
