import { prisma } from "./db";

export const REVIEW_QUEUE_SIZE = 5;

/** Start of the most recent Saturday (00:00 UTC) at or before `now`. */
export function lastScheduledRotation(now: Date = new Date()): Date {
  const d = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
  const daysSinceSaturday = (d.getUTCDay() + 1) % 7; // Sat -> 0, Sun -> 1, ...
  d.setUTCDate(d.getUTCDate() - daysSinceSaturday);
  return d;
}

export function nextScheduledRotation(now: Date = new Date()): Date {
  const d = lastScheduledRotation(now);
  d.setUTCDate(d.getUTCDate() + 7);
  return d;
}

/**
 * Refill the review queue up to REVIEW_QUEUE_SIZE:
 *  1. Problems already in review (not yet re-solved) are retained.
 *  2. Free slots go to solved problems not in review, ranked by
 *     solvedUnder15Min == false first, then oldest lastSolvedAt.
 */
export async function rotateReviewQueue(now: Date = new Date()) {
  return prisma.$transaction(async (tx) => {
    const retained = await tx.problem.count({ where: { inReview: true } });
    const slots = Math.max(0, REVIEW_QUEUE_SIZE - retained);

    let added = 0;
    if (slots > 0) {
      const candidates = await tx.problem.findMany({
        where: { isSolved: true, inReview: false },
        orderBy: [
          { solvedUnder15Min: "asc" },
          { lastSolvedAt: { sort: "asc", nulls: "first" } },
        ],
        take: slots,
        select: { id: true },
      });
      const { count } = await tx.problem.updateMany({
        where: { id: { in: candidates.map((c) => c.id) } },
        data: { inReview: true, addedToReviewAt: now },
      });
      added = count;
    }

    await tx.reviewSystemState.upsert({
      where: { id: 1 },
      update: { lastRotatedAt: now },
      create: { id: 1, lastRotatedAt: now },
    });

    return { retained, added };
  });
}

/** Rotate only if this week's Saturday rotation hasn't happened yet. */
export async function rotateReviewQueueIfDue(now: Date = new Date()) {
  const state = await prisma.reviewSystemState.findUnique({ where: { id: 1 } });
  if (state && state.lastRotatedAt >= lastScheduledRotation(now)) {
    return null;
  }
  return rotateReviewQueue(now);
}
