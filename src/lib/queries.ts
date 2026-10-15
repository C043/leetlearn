import type { Pattern, Problem } from "@prisma/client";
import { hasExercises } from "@/content/exercises";
import { slugFromUrl, videoUrlFor } from "@/content/solutions";
import { prisma } from "./db";
import type { PatternSummary, ProblemView } from "./types";

function toView(problem: Problem & { pattern: Pick<Pattern, "name"> }): ProblemView {
  const slug = slugFromUrl(problem.leetcodeUrl);
  return {
    id: problem.id,
    slug,
    title: problem.title,
    leetcodeUrl: problem.leetcodeUrl,
    videoUrl: videoUrlFor(slug, problem.title),
    difficulty: problem.difficulty,
    order: problem.order,
    isSolved: problem.isSolved,
    solvedUnder15Min: problem.solvedUnder15Min,
    lastSolvedAt: problem.lastSolvedAt?.toISOString() ?? null,
    unlocked: problem.unlocked,
    inReview: problem.inReview,
    patternName: problem.pattern.name,
    hasExercises: hasExercises(slug),
    mastered: problem.trainingMasteredAt !== null,
  };
}

export async function getPatternSummaries(): Promise<PatternSummary[]> {
  const patterns = await prisma.pattern.findMany({
    orderBy: { order: "asc" },
    include: { problems: { select: { isSolved: true } } },
  });
  return patterns.map((p) => ({
    id: p.id,
    name: p.name,
    order: p.order,
    solved: p.problems.filter((x) => x.isSolved).length,
    total: p.problems.length,
  }));
}

/** Pattern.order is a Postgres INT4; anything outside it can't match and would make the query throw. */
const isInt4 = (n: number) => Number.isInteger(n) && n >= -2_147_483_648 && n <= 2_147_483_647;

export async function getPattern(order: number) {
  if (!isInt4(order)) return null;
  const pattern = await prisma.pattern.findUnique({
    where: { order },
    include: {
      problems: { orderBy: { order: "asc" }, include: { pattern: { select: { name: true } } } },
    },
  });
  if (!pattern) return null;
  return {
    name: pattern.name,
    description: pattern.description,
    order: pattern.order,
    problems: pattern.problems.map(toView),
  };
}

export async function getReviewQueue(): Promise<ProblemView[]> {
  const problems = await prisma.problem.findMany({
    where: { inReview: true },
    orderBy: [{ addedToReviewAt: "asc" }, { title: "asc" }],
    include: { pattern: { select: { name: true } } },
  });
  return problems.map(toView);
}
