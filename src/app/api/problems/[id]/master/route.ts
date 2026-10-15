import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * Called when a problem's training is finished 10/10 on the first try.
 * Mastery is permanent, so the first date is kept. Training never touches
 * solved state, review or the streak.
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const problem = await prisma.problem.findUnique({ where: { id } });
  if (!problem) {
    return NextResponse.json({ error: "Problem not found" }, { status: 404 });
  }
  if (!problem.isSolved) {
    return NextResponse.json({ error: "Problem is not solved yet" }, { status: 409 });
  }

  const updated = problem.trainingMasteredAt
    ? problem
    : await prisma.problem.update({ where: { id }, data: { trainingMasteredAt: new Date() } });

  return NextResponse.json({ masteredAt: updated.trainingMasteredAt });
}
