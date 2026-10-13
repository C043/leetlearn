export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface ProblemInput {
  slug: string;
  title: string;
  leetcodeUrl: string;
  difficulty: Difficulty;
  order?: number;
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
