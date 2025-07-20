import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { roundsTable, tracksTable } from "@/db/schema";
import { db } from "@/lib/db"; // drizzle instance

// ─────────────────────────────────────────────────────────────────────────
// 1. Payload validation
// ─────────────────────────────────────────────────────────────────────────
const reorderSchema = z.object({
  roundOrder: z.array(z.string().uuid()),
  tracksByRound: z.record(z.string().uuid(), z.array(z.string().uuid())),
});
type ReorderPayload = z.infer<typeof reorderSchema>;

// ─────────────────────────────────────────────────────────────────────────
// 2. Route handler (POST only)
// ─────────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  let body: ReorderPayload;
  try {
    body = reorderSchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  try {
    await db.transaction(async (tx) => {
      // 2-A  Update rounds ordering (left-to-right)
      for (const [idx, roundId] of body.roundOrder.entries()) {
        await tx
          .update(roundsTable)
          .set({ position: idx })
          .where(eq(roundsTable.id, roundId));
      }

      // 2-B  Update tracks ordering (and column moves) per round
      for (const [roundId, trackIds] of Object.entries(body.tracksByRound)) {
        for (const [idx, trackId] of trackIds.entries()) {
          await tx
            .update(tracksTable)
            .set({ position: idx, roundId })
            .where(eq(tracksTable.id, trackId));
        }
      }
    });

    // 204 = “No Content” → nothing to JSON-encode
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("Reorder failed:", err);
    return NextResponse.json(
      { error: "Failed to persist order" },
      { status: 500 },
    );
  }
}
