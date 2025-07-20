import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: { trackId: string } },
) {
  const { trackId } = await params;
  const track = await db.query.tracksTable.findFirst({
    where: (tracksTable, { eq }) => eq(tracksTable.id, trackId),
  });
  if (!track) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(track);
}
