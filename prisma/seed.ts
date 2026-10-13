import { PrismaClient } from "@prisma/client";
import { PATTERNS, PROBLEM_COUNT } from "../src/content";

const prisma = new PrismaClient();

/**
 * Idempotent: content fields are refreshed from src/content, but progress
 * (isSolved, unlocked, review state, ...) is never overwritten on re-seed.
 */
async function main() {
  for (const patternData of PATTERNS) {
    const pattern = await prisma.pattern.upsert({
      where: { order: patternData.order },
      update: {
        name: patternData.name,
        description: patternData.description,
      },
      create: {
        name: patternData.name,
        description: patternData.description,
        order: patternData.order,
      },
    });

    for (const [i, prob] of patternData.problems.entries()) {
      const order = i + 1;
      await prisma.problem.upsert({
        where: { patternId_order: { patternId: pattern.id, order } },
        update: {
          title: prob.title,
          leetcodeUrl: prob.leetcodeUrl,
          difficulty: prob.difficulty,
        },
        create: {
          title: prob.title,
          leetcodeUrl: prob.leetcodeUrl,
          difficulty: prob.difficulty,
          order,
          patternId: pattern.id,
          // Only the first problem of every pattern starts unlocked
          unlocked: order === 1,
        },
      });
    }
  }

  await prisma.reviewSystemState.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, lastRotatedAt: new Date() },
  });

  console.log(
    `Seeded ${PATTERNS.length} patterns & ${PROBLEM_COUNT} problems.`,
  );
}

main()
  .catch((e) => {
    console.error("Error during database seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
