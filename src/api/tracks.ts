import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { tracksTable } from "@/db/schema";
import { db } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: { roundId: string } }
) {
  const roundId = Number(params.roundId);
  const { order } = (await req.json()) as { order: number[] };

  try {
    await db.transaction(async (tx) => {
      for (let i = 0; i < order.length; i++) {
        await tx
          .update(tracksTable)
          .set({ position: i })
          .where(
            and(eq(tracksTable.id, order[i]), eq(tracksTable.roundId, roundId))
          );
      }
    });
    return NextResponse.json({ success: true });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
