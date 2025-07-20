import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: { gameId: string } },
) {
  const { gameId } = await params;
  const game = await db.query.gamesTable.findFirst({
    where: (gamesTable, { eq }) => eq(gamesTable.id, gameId),
    with: {
      rounds: {
        orderBy: (roundsTable) => [roundsTable.position],
        with: {
          tracks: {
            orderBy: (tracksTable) => [tracksTable.position],
          },
        },
      },
    },
  });
  if (!game) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(game);
}
