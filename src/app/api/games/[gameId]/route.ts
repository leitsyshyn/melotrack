import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

type Params = { gameId: string };

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<Params> },
) {
  const { gameId } = await params;

  const game = await db.query.gamesTable.findFirst({
    where: (gamesTable, { eq }) => eq(gamesTable.id, gameId),
    with: {
      rounds: {
        orderBy: (roundsTable, { asc }) => [asc(roundsTable.position)],
        with: {
          tracks: {
            orderBy: (tracksTable, { asc }) => [asc(tracksTable.position)],
          },
        },
      },
    },
  });

  if (!game) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(game);
}
