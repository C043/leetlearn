export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface ProblemInput {
  slug: string;
  title: string;
  leetcodeUrl: string;
  difficulty: Difficulty;
  order?: number;
  /** What the problem asks, in 1-2 sentences. Required once the problem has training exercises. */
  summary?: string;
}

export interface PatternInput {
  slug: string;
  name: string;
  description: string;
  order: number;
  problems: ProblemInput[];
}

export function definePattern(pattern: PatternInput) {
  return pattern;
}
