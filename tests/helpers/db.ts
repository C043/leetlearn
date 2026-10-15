import type { Difficulty } from "@prisma/client";
import { prisma } from "@/lib/db";
import { PATTERNS } from "@/content";

/** Wipe every table. Only ever run against the disposable test database. */
export async function resetDb() {
  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE "Problem", "Pattern", "ReviewSystemState", "ActivityDay", "AppSettings", "PushSubscription" CASCADE',
  );
}

/**
 * Insert real patterns from the content corpus (first `count` of them), in the
 * same initial state the seed script produces: only order 1 unlocked.
 */
export async function insertPatterns(count = 2) {
  const created = [];
  for (const p of PATTERNS.slice(0, count)) {
    const pattern = await prisma.pattern.create({
      data: {
        name: p.name,
        description: p.description,
        order: p.order,
        problems: {
          create: p.problems.map((q, i) => ({
            title: q.title,
            leetcodeUrl: q.leetcodeUrl,
            difficulty: q.difficulty as Difficulty,
            order: i + 1,
            unlocked: i === 0,
          })),
        },
      },
      include: { problems: { orderBy: { order: "asc" } } },
    });
    created.push(pattern);
  }
  return created;
}

/** One pattern with its problems; handy when a test only needs one path. */
export async function insertPattern() {
  const [pattern] = await insertPatterns(1);
  return pattern;
}

/** Mark a problem solved at `at` with the given flags (bypasses the API). */
export async function markSolved(
  id: string,
  at: Date,
  { under15 = true, inReview = false }: { under15?: boolean; inReview?: boolean } = {},
) {
  return prisma.problem.update({
    where: { id },
    data: {
      isSolved: true,
      unlocked: true,
      lastSolvedAt: at,
      solvedUnder15Min: under15,
      inReview,
      addedToReviewAt: inReview ? at : null,
    },
  });
}

export async function setActivityDays(days: string[]) {
  await prisma.activityDay.createMany({ data: days.map((day) => ({ day, solves: 1 })) });
}

export async function setSettings(data: Parameters<typeof prisma.appSettings.create>[0]["data"]) {
  return prisma.appSettings.upsert({ where: { id: 1 }, update: data, create: { id: 1, ...data } });
}
