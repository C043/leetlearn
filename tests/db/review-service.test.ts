import { describe, expect, it } from "vitest";
import { prisma } from "@/lib/db";
import { rotateReviewQueue, rotateReviewQueueIfDue } from "@/lib/review-service";
import { insertPatterns, markSolved } from "../helpers/db";

const day = (n: number) => new Date(Date.UTC(2024, 0, n, 12));
const SATURDAY = new Date("2024-06-15T00:00:00Z");

async function reviewTitles() {
  const rows = await prisma.problem.findMany({ where: { inReview: true }, orderBy: { title: "asc" } });
  return rows.map((r) => r.title);
}

describe("rotateReviewQueue", () => {
  it("does nothing useful on an empty database but records the rotation", async () => {
    expect(await rotateReviewQueue(SATURDAY)).toEqual({ retained: 0, added: 0 });
    expect(await prisma.reviewSystemState.findUnique({ where: { id: 1 } })).toEqual({ id: 1, lastRotatedAt: SATURDAY });
  });

  it("never picks unsolved problems", async () => {
    await insertPatterns(2);
    expect(await rotateReviewQueue(SATURDAY)).toEqual({ retained: 0, added: 0 });
    expect(await reviewTitles()).toEqual([]);
  });

  it("takes all solved problems when there are fewer than 5", async () => {
    const [p] = await insertPatterns(1);
    await markSolved(p.problems[0].id, day(1));
    await markSolved(p.problems[1].id, day(2));
    expect(await rotateReviewQueue(SATURDAY)).toEqual({ retained: 0, added: 2 });
    expect(await prisma.problem.count({ where: { inReview: true } })).toBe(2);
  });

  it("fills exactly 5 slots, slow solves first, then the oldest", async () => {
    const [p] = await insertPatterns(1);
    const q = p.problems;
    // fast solves, oldest first: q0 (day 1) ... q5 (day 6)
    for (let i = 0; i < 6; i++) await markSolved(q[i].id, day(i + 1), { under15: true });
    // slow solves are always picked first, even though they are recent
    await markSolved(q[6].id, day(20), { under15: false });
    await markSolved(q[7].id, day(19), { under15: false });

    expect(await rotateReviewQueue(SATURDAY)).toEqual({ retained: 0, added: 5 });
    const picked = (await prisma.problem.findMany({ where: { inReview: true } })).map((r) => r.id).sort();
    expect(picked).toEqual([q[6].id, q[7].id, q[0].id, q[1].id, q[2].id].sort());
  });

  it("prefers a slow solve over any fast solve, regardless of age", async () => {
    const [p] = await insertPatterns(1);
    for (let i = 0; i < 9; i++) await markSolved(p.problems[i].id, day(i + 1), { under15: true });
    await markSolved(p.problems[9].id, day(30), { under15: false });
    await rotateReviewQueue(SATURDAY);
    expect((await prisma.problem.findUnique({ where: { id: p.problems[9].id } }))!.inReview).toBe(true);
  });

  it("orders slow solves by age among themselves", async () => {
    const [p] = await insertPatterns(1);
    for (let i = 0; i < 7; i++) await markSolved(p.problems[i].id, day(10 - i), { under15: false });
    await rotateReviewQueue(SATURDAY);
    const picked = await prisma.problem.findMany({ where: { inReview: true }, orderBy: { lastSolvedAt: "asc" } });
    // the 5 oldest of days 4..10 are days 4..8
    expect(picked.map((r) => r.lastSolvedAt!.getUTCDate())).toEqual([4, 5, 6, 7, 8]);
  });

  it("treats a solved problem with no date as the oldest", async () => {
    const [p] = await insertPatterns(1);
    for (let i = 0; i < 5; i++) await markSolved(p.problems[i].id, day(i + 1));
    await prisma.problem.update({ where: { id: p.problems[5].id }, data: { isSolved: true, lastSolvedAt: null, solvedUnder15Min: true } });
    await rotateReviewQueue(SATURDAY);
    expect((await prisma.problem.findUnique({ where: { id: p.problems[5].id } }))!.inReview).toBe(true);
  });

  it("retains problems still in review and only fills the free slots", async () => {
    const [p] = await insertPatterns(1);
    const q = p.problems;
    await markSolved(q[0].id, day(1), { inReview: true });
    await markSolved(q[1].id, day(2), { inReview: true });
    for (let i = 2; i < 9; i++) await markSolved(q[i].id, day(i + 1));

    expect(await rotateReviewQueue(SATURDAY)).toEqual({ retained: 2, added: 3 });
    expect(await prisma.problem.count({ where: { inReview: true } })).toBe(5);
    // the retained ones keep their original addedToReviewAt
    expect((await prisma.problem.findUnique({ where: { id: q[0].id } }))!.addedToReviewAt).toEqual(day(1));
  });

  it("adds nothing when the queue is already full", async () => {
    const [p] = await insertPatterns(1);
    for (let i = 0; i < 5; i++) await markSolved(p.problems[i].id, day(i + 1), { inReview: true });
    for (let i = 5; i < 10; i++) await markSolved(p.problems[i].id, day(i + 1));
    expect(await rotateReviewQueue(SATURDAY)).toEqual({ retained: 5, added: 0 });
  });

  it("copes with an over-full queue (e.g. data edited by hand) without going negative", async () => {
    const [p] = await insertPatterns(1);
    for (let i = 0; i < 7; i++) await markSolved(p.problems[i].id, day(i + 1), { inReview: true });
    await markSolved(p.problems[7].id, day(8));
    expect(await rotateReviewQueue(SATURDAY)).toEqual({ retained: 7, added: 0 });
  });

  it("stamps newly added problems with the rotation time", async () => {
    const [p] = await insertPatterns(1);
    await markSolved(p.problems[0].id, day(1));
    await rotateReviewQueue(SATURDAY);
    expect((await prisma.problem.findUnique({ where: { id: p.problems[0].id } }))!.addedToReviewAt).toEqual(SATURDAY);
  });

  it("draws from every pattern, not just one", async () => {
    const [a, b] = await insertPatterns(2);
    await markSolved(a.problems[0].id, day(5));
    await markSolved(b.problems[0].id, day(1), { under15: false });
    await rotateReviewQueue(SATURDAY);
    expect(await prisma.problem.count({ where: { inReview: true } })).toBe(2);
  });

  it("never exceeds 5 even when rotations race", async () => {
    const [a, b] = await insertPatterns(2);
    for (const p of [a, b]) for (let i = 0; i < 6; i++) await markSolved(p.problems[i].id, day(i + 1));
    await Promise.all([rotateReviewQueue(SATURDAY), rotateReviewQueue(SATURDAY), rotateReviewQueue(SATURDAY)]);
    expect(await prisma.problem.count({ where: { inReview: true } })).toBe(5);
  });

  it("leaves solve state untouched", async () => {
    const [p] = await insertPatterns(1);
    await markSolved(p.problems[0].id, day(3), { under15: false });
    await rotateReviewQueue(SATURDAY);
    expect(await prisma.problem.findUnique({ where: { id: p.problems[0].id } })).toMatchObject({
      isSolved: true,
      solvedUnder15Min: false,
      lastSolvedAt: day(3),
      unlocked: true,
    });
  });
});

describe("rotateReviewQueueIfDue", () => {
  async function setLastRotation(at: Date) {
    await prisma.reviewSystemState.create({ data: { id: 1, lastRotatedAt: at } });
  }

  it("rotates when the system has never rotated", async () => {
    expect(await rotateReviewQueueIfDue(new Date("2024-06-18T10:00:00Z"))).toEqual({ retained: 0, added: 0 });
  });

  it("rotates when the last rotation was before this week's Saturday", async () => {
    await setLastRotation(new Date("2024-06-14T23:59:59Z")); // Friday
    const now = new Date("2024-06-17T10:00:00Z"); // Monday
    expect(await rotateReviewQueueIfDue(now)).not.toBeNull();
    expect((await prisma.reviewSystemState.findUnique({ where: { id: 1 } }))!.lastRotatedAt).toEqual(now);
  });

  it("skips when this week's rotation already happened", async () => {
    await setLastRotation(new Date("2024-06-15T00:00:05Z"));
    expect(await rotateReviewQueueIfDue(new Date("2024-06-20T10:00:00Z"))).toBeNull();
  });

  it("treats a rotation exactly at Saturday 00:00 as done", async () => {
    await setLastRotation(SATURDAY);
    expect(await rotateReviewQueueIfDue(new Date("2024-06-15T09:00:00Z"))).toBeNull();
  });

  it("rotates once per week no matter how often it is called", async () => {
    const [p] = await insertPatterns(1);
    for (let i = 0; i < 10; i++) await markSolved(p.problems[i].id, day(i + 1));
    await setLastRotation(new Date("2024-06-08T00:00:00Z"));

    const results = [];
    for (const t of ["2024-06-15T00:00:00Z", "2024-06-15T08:00:00Z", "2024-06-18T12:00:00Z", "2024-06-21T23:59:59Z"]) {
      results.push(await rotateReviewQueueIfDue(new Date(t)));
    }
    expect(results.filter(Boolean)).toHaveLength(1);
    expect(await prisma.problem.count({ where: { inReview: true } })).toBe(5);
  });

  it("rotates again the following Saturday, keeping unsolved review items", async () => {
    const [p] = await insertPatterns(1);
    for (let i = 0; i < 10; i++) await markSolved(p.problems[i].id, day(i + 1));
    await rotateReviewQueueIfDue(SATURDAY);
    // the user re-solves two review problems during the week
    const inReview = await prisma.problem.findMany({ where: { inReview: true }, take: 2 });
    for (const r of inReview) {
      await prisma.problem.update({ where: { id: r.id }, data: { inReview: false, addedToReviewAt: null, lastSolvedAt: day(25) } });
    }
    expect(await rotateReviewQueueIfDue(new Date("2024-06-22T00:00:00Z"))).toEqual({ retained: 3, added: 2 });
  });

  it("catches up after the app was offline for weeks (one rotation, not many)", async () => {
    const [p] = await insertPatterns(1);
    for (let i = 0; i < 10; i++) await markSolved(p.problems[i].id, day(i + 1));
    await setLastRotation(new Date("2024-01-06T00:00:00Z"));
    expect(await rotateReviewQueueIfDue(new Date("2024-06-19T12:00:00Z"))).toEqual({ retained: 0, added: 5 });
    expect(await rotateReviewQueueIfDue(new Date("2024-06-19T12:05:00Z"))).toBeNull();
  });
});
