import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

type Params = { trackId: string };

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<Params> },
) {
  const { trackId } = await params;

  const track = await db.query.tracksTable.findFirst({
    where: (tracksTable, { eq }) => eq(tracksTable.id, trackId),
  });

  if (!track) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(track);
}
