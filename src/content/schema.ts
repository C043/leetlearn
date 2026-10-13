import { z } from "zod";

export const PATTERN_COUNT = 16;
export const PROBLEMS_PER_PATTERN = 10;

/** Required difficulty for each slot: 2 Easy -> 7 Medium -> 1 Hard. */
export const DIFFICULTY_LADDER = [
  "EASY",
  "EASY",
  ...Array<"MEDIUM">(7).fill("MEDIUM"),
  "HARD",
] as const;

const slug = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "must be kebab-case");

export const problemSchema = z.object({
  slug,
  title: z.string().min(1),
  leetcodeUrl: z.string().url().startsWith("https://leetcode.com/problems/"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  order: z.number().int().optional(),
});

export const patternSchema = z.object({
  slug,
  name: z.string().min(1),
  description: z.string().min(1),
  order: z.number().int().min(1).max(PATTERN_COUNT),
  problems: z.array(problemSchema).length(PROBLEMS_PER_PATTERN),
});

export const corpusSchema = z.array(patternSchema).length(PATTERN_COUNT);

export type Corpus = z.infer<typeof corpusSchema>;

/** Cross-entry rules that a per-item schema can't express. */
export function assertCorpusValid(corpus: Corpus): void {
  const errors: string[] = [];
  const seenOrders = new Set<number>();
  const seenSlugs = new Set<string>();

  for (const pattern of corpus) {
    if (seenOrders.has(pattern.order)) {
      errors.push(`duplicate pattern order ${pattern.order}`);
    }
    seenOrders.add(pattern.order);
    if (seenSlugs.has(pattern.slug)) {
      errors.push(`duplicate pattern slug "${pattern.slug}"`);
    }
    seenSlugs.add(pattern.slug);

    const problemSlugs = new Set<string>();
    pattern.problems.forEach((problem, i) => {
      const where = `${pattern.slug}[${i + 1}] "${problem.title}"`;
      if (problem.difficulty !== DIFFICULTY_LADDER[i]) {
        errors.push(`${where}: expected ${DIFFICULTY_LADDER[i]}, got ${problem.difficulty}`);
      }
      if (problem.order !== undefined && problem.order !== i + 1) {
        errors.push(`${where}: order ${problem.order} does not match position ${i + 1}`);
      }
      if (problemSlugs.has(problem.slug)) {
        errors.push(`${where}: duplicate slug within pattern`);
      }
      problemSlugs.add(problem.slug);
      if (!problem.leetcodeUrl.includes(`/problems/${problem.slug}/`)) {
        errors.push(`${where}: URL does not match slug "${problem.slug}"`);
      }
    });
  }

  if (errors.length > 0) {
    throw new Error(`Invalid content corpus:\n  - ${errors.join("\n  - ")}`);
  }
}
