import { execFile } from "node:child_process";
import { join } from "node:path";
import { promisify } from "node:util";
import { describe, expect, it } from "vitest";
import { prisma } from "@/lib/db";
import { PATTERNS } from "@/content";

const root = join(__dirname, "..", "..");

/** Run the real seed script, the same way `npx prisma db seed` does on container boot. */
async function seed() {
  const { stdout } = await promisify(execFile)("npx", ["tsx", "prisma/seed.ts"], { cwd: root, env: process.env });
  return stdout;
}

describe("prisma/seed.ts", { timeout: 120_000 }, () => {
  it("creates all 16 patterns and 160 problems from the content corpus", async () => {
    expect(await seed()).toContain("Seeded 16 patterns & 160 problems.");
    expect(await prisma.pattern.count()).toBe(16);
    expect(await prisma.problem.count()).toBe(160);

    const patterns = await prisma.pattern.findMany({ orderBy: { order: "asc" }, include: { problems: { orderBy: { order: "asc" } } } });
    patterns.forEach((p, i) => {
      expect(p).toMatchObject({ name: PATTERNS[i].name, description: PATTERNS[i].description, order: i + 1 });
      expect(p.problems.map((q) => q.leetcodeUrl)).toEqual(PATTERNS[i].problems.map((q) => q.leetcodeUrl));
      expect(p.problems.map((q) => q.difficulty)).toEqual(PATTERNS[i].problems.map((q) => q.difficulty));
    });
  });

  it("unlocks only the first problem of every path and starts with no progress", async () => {
    await seed();
    const unlocked = await prisma.problem.findMany({ where: { unlocked: true } });
    expect(unlocked).toHaveLength(16);
    expect(unlocked.every((p) => p.order === 1)).toBe(true);
    expect(await prisma.problem.count({ where: { OR: [{ isSolved: true }, { inReview: true }] } })).toBe(0);
  });

  it("initialises the review state so the first rotation waits for Saturday", async () => {
    const before = Date.now();
    await seed();
    const state = await prisma.reviewSystemState.findUnique({ where: { id: 1 } });
    expect(state!.lastRotatedAt.getTime()).toBeGreaterThanOrEqual(before - 1000);
  });

  it("is idempotent and never overwrites progress on re-seed", async () => {
    await seed();
    const first = await prisma.problem.findFirstOrThrow({ where: { order: 1 }, include: { pattern: true }, orderBy: { pattern: { order: "asc" } } });
    const solvedAt = new Date("2024-03-03T03:03:03Z");
    await prisma.problem.update({
      where: { id: first.id },
      data: { isSolved: true, solvedUnder15Min: true, lastSolvedAt: solvedAt, inReview: true, addedToReviewAt: solvedAt },
    });
    await prisma.problem.updateMany({ where: { patternId: first.patternId, order: 2 }, data: { unlocked: true } });
    const stateBefore = await prisma.reviewSystemState.findUnique({ where: { id: 1 } });

    await seed();

    expect(await prisma.pattern.count()).toBe(16);
    expect(await prisma.problem.count()).toBe(160);
    expect(await prisma.problem.findUnique({ where: { id: first.id } })).toMatchObject({
      isSolved: true,
      solvedUnder15Min: true,
      lastSolvedAt: solvedAt,
      inReview: true,
    });
    expect((await prisma.problem.findFirstOrThrow({ where: { patternId: first.patternId, order: 2 } })).unlocked).toBe(true);
    expect(await prisma.reviewSystemState.findUnique({ where: { id: 1 } })).toEqual(stateBefore);
  });

  it("refreshes content fields (titles, URLs, descriptions) from src/content", async () => {
    await seed();
    const pattern = await prisma.pattern.findUniqueOrThrow({ where: { order: 1 } });
    await prisma.pattern.update({ where: { id: pattern.id }, data: { name: "Old name", description: "old" } });
    await prisma.problem.updateMany({ where: { patternId: pattern.id, order: 3 }, data: { title: "Old title", leetcodeUrl: "https://leetcode.com/problems/old/" } });

    await seed();

    expect(await prisma.pattern.findUnique({ where: { id: pattern.id } })).toMatchObject({
      name: PATTERNS[0].name,
      description: PATTERNS[0].description,
    });
    expect(await prisma.problem.findFirstOrThrow({ where: { patternId: pattern.id, order: 3 } })).toMatchObject({
      title: PATTERNS[0].problems[2].title,
      leetcodeUrl: PATTERNS[0].problems[2].leetcodeUrl,
    });
  });

  it("keeps the same row ids across re-seeds (so progress stays attached)", async () => {
    await seed();
    const ids = (await prisma.problem.findMany({ select: { id: true }, orderBy: { id: "asc" } })).map((p) => p.id);
    await seed();
    expect((await prisma.problem.findMany({ select: { id: true }, orderBy: { id: "asc" } })).map((p) => p.id)).toEqual(ids);
  });
});
