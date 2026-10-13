export type Difficulty = "EASY" | "MEDIUM" | "HARD";

/** Serializable problem shape passed from server to client components. */
export interface ProblemView {
  id: string;
  slug: string;
  title: string;
  leetcodeUrl: string;
  videoUrl: string;
  difficulty: Difficulty;
  order: number;
  isSolved: boolean;
  solvedUnder15Min: boolean;
  lastSolvedAt: string | null;
  unlocked: boolean;
  inReview: boolean;
  patternName: string;
}

export interface PatternSummary {
  id: string;
  name: string;
  order: number;
  solved: number;
  total: number;
}
