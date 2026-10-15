import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getStreak, recordActivity, rememberTimeZone } from "@/lib/streak";

const bodySchema = z.object({
  solvedUnder15Min: z.boolean(),
  // Optional so older cached clients keep working
  timeZone: z.string().optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Body must be { solvedUnder15Min: boolean }" },
      { status: 400 },
    );
  }

  const problem = await prisma.problem.findUnique({ where: { id } });
  if (!problem) {
    return NextResponse.json({ error: "Problem not found" }, { status: 404 });
  }
  if (!problem.unlocked) {
    return NextResponse.json({ error: "Problem is locked" }, { status: 409 });
  }

  // Before stamping lastSolvedAt: on a fresh database the activity backfill
  // reads lastSolvedAt, and would otherwise count this solve twice
  await rememberTimeZone(parsed.data.timeZone);
  const firstToday = await recordActivity();

  const [updated] = await prisma.$transaction([
    prisma.problem.update({
      where: { id },
      data: {
        isSolved: true,
        lastSolvedAt: new Date(),
        solvedUnder15Min: parsed.data.solvedUnder15Min,
        // Re-solving a review problem takes it out of the queue
        inReview: false,
        addedToReviewAt: null,
      },
    }),
    prisma.problem.updateMany({
      where: { patternId: problem.patternId, order: problem.order + 1 },
      data: { unlocked: true },
    }),
  ]);

  const streak = await getStreak();

  return NextResponse.json({ ...updated, streak, streakExtended: firstToday });
}
