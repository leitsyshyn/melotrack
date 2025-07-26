import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

type Params = { roundId: string };

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<Params> },
) {
  const { roundId } = await params;

  const round = await db.query.roundsTable.findFirst({
    where: (roundsTable, { eq }) => eq(roundsTable.id, roundId),
    with: {
      tracks: {
        orderBy: (tracksTable, { asc }) => [asc(tracksTable.position)],
      },
    },
  });

  if (!round) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(round);
}
