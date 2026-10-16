import { describe, expect, it } from "vitest";
import { prisma } from "@/lib/db";
import { getPattern, getPatternSummaries, getReviewQueue } from "@/lib/queries";
import { PATTERNS } from "@/content";
import { insertPatterns, markSolved } from "../helpers/db";

describe("getPatternSummaries", () => {
  it("returns an empty list for an empty database", async () => {
    expect(await getPatternSummaries()).toEqual([]);
  });

  it("lists patterns by order with solved / total counts", async () => {
    const [a, b, c] = await insertPatterns(3);
    await markSolved(a.problems[0].id, new Date());
    await markSolved(a.problems[1].id, new Date());
    for (const p of c.problems) await markSolved(p.id, new Date());

    expect(await getPatternSummaries()).toEqual([
      { id: a.id, name: PATTERNS[0].name, order: 1, solved: 2, mastered: 0, total: 10 },
      { id: b.id, name: PATTERNS[1].name, order: 2, solved: 0, mastered: 0, total: 10 },
      { id: c.id, name: PATTERNS[2].name, order: 3, solved: 10, mastered: 0, total: 10 },
    ]);
  });

  it("counts only solved problems with training mastered as mastered", async () => {
    const [a] = await insertPatterns(1);
    await markSolved(a.problems[0].id, new Date());
    await prisma.problem.update({ where: { id: a.problems[0].id }, data: { trainingMasteredAt: new Date() } });
    await prisma.problem.update({ where: { id: a.problems[1].id }, data: { trainingMasteredAt: new Date() } });
    expect(await getPatternSummaries()).toMatchObject([{ solved: 1, mastered: 1 }]);
  });

  it("orders by pattern order even when inserted out of order", async () => {
    await prisma.pattern.create({ data: { name: "Z", description: "d", order: 9 } });
    await prisma.pattern.create({ data: { name: "A", description: "d", order: 2 } });
    await prisma.pattern.create({ data: { name: "M", description: "d", order: 5 } });
    expect((await getPatternSummaries()).map((p) => p.order)).toEqual([2, 5, 9]);
  });

  it("handles a pattern without problems", async () => {
    await prisma.pattern.create({ data: { name: "Empty", description: "d", order: 1 } });
    expect(await getPatternSummaries()).toMatchObject([{ name: "Empty", solved: 0, total: 0 }]);
  });
});

describe("getPattern", () => {
  it.each([0, -1, 17, 99, 2147483647, -2147483648])("returns null for the unknown order %j", async (order) => {
    await insertPatterns(1);
    expect(await getPattern(order)).toBeNull();
  });

  it.each([1.5, NaN, Infinity, 2147483648, 99999999999, -2147483649])(
    "returns null (instead of a database error) for the order %j",
    async (order) => {
      await insertPatterns(1);
      expect(await getPattern(order)).toBeNull();
    },
  );

  it("returns the pattern with its 10 problems sorted by order", async () => {
    await insertPatterns(2);
    const view = await getPattern(2);
    expect(view).toMatchObject({ name: PATTERNS[1].name, description: PATTERNS[1].description, order: 2 });
    expect(view!.problems.map((p) => p.order)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(view!.problems.map((p) => p.title)).toEqual(PATTERNS[1].problems.map((p) => p.title));
  });

  it("maps every problem to a serializable view", async () => {
    const [p] = await insertPatterns(1);
    const solvedAt = new Date("2024-05-01T10:20:30.000Z");
    await markSolved(p.problems[0].id, solvedAt, { under15: false, inReview: true });

    const [first, second] = (await getPattern(1))!.problems;
    const source = PATTERNS[0].problems[0];
    expect(first).toMatchObject({
      id: p.problems[0].id,
      slug: source.slug,
      title: source.title,
      leetcodeUrl: source.leetcodeUrl,
      difficulty: "EASY",
      order: 1,
      isSolved: true,
      solvedUnder15Min: false,
      lastSolvedAt: "2024-05-01T10:20:30.000Z",
      unlocked: true,
      inReview: true,
      patternName: PATTERNS[0].name,
    });
    expect(first.videoUrl).toMatch(/^https:\/\/www\.youtube\.com\/results\?search_query=/);
    expect(second).toMatchObject({ isSolved: false, unlocked: false, lastSolvedAt: null, inReview: false });
    // Must survive the server -> client component boundary
    expect(JSON.parse(JSON.stringify(first))).toEqual(first);
  });

  it("derives the slug from the stored URL even if the problem was renamed", async () => {
    const [p] = await insertPatterns(1);
    await prisma.problem.update({ where: { id: p.problems[0].id }, data: { title: "Renamed" } });
    const [first] = (await getPattern(1))!.problems;
    expect(first.slug).toBe(PATTERNS[0].problems[0].slug);
    expect(first.title).toBe("Renamed");
  });
});

describe("getReviewQueue", () => {
  it("is empty when nothing is in review", async () => {
    const [p] = await insertPatterns(1);
    await markSolved(p.problems[0].id, new Date());
    expect(await getReviewQueue()).toEqual([]);
  });

  it("lists only review problems, oldest addition first, then by title", async () => {
    const [a, b] = await insertPatterns(2);
    const t1 = new Date("2024-06-01T00:00:00Z");
    const t2 = new Date("2024-06-08T00:00:00Z");
    const set = (id: string, at: Date) =>
      prisma.problem.update({ where: { id }, data: { isSolved: true, inReview: true, addedToReviewAt: at } });
    await set(b.problems[3].id, t2);
    await set(a.problems[5].id, t1);
    await set(a.problems[2].id, t1);
    await markSolved(a.problems[0].id, t1); // solved but not in review

    const queue = await getReviewQueue();
    const expectedT1 = [a.problems[5], a.problems[2]].map((p) => p.title).sort();
    expect(queue.map((q) => q.title)).toEqual([...expectedT1, b.problems[3].title]);
    expect(queue.every((q) => q.inReview)).toBe(true);
  });

  it("includes the pattern name for each problem", async () => {
    const [, b] = await insertPatterns(2);
    await markSolved(b.problems[0].id, new Date(), { inReview: true });
    expect((await getReviewQueue())[0].patternName).toBe(PATTERNS[1].name);
  });
});
