import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: { roundId: string } },
) {
  const { roundId } = await params;
  const round = await db.query.roundsTable.findFirst({
    where: (roundsTable, { eq }) => eq(roundsTable.id, roundId),
    with: {
      tracks: {
        orderBy: (tracksTable) => [tracksTable.position],
      },
    },
  });
  if (!round) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(round);
}
