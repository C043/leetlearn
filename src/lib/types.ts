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

export interface StreakView {
  current: number;
  longest: number;
  /** A problem was solved today (in the user's time zone). */
  doneToday: boolean;
  /** There is a streak and it ends at midnight unless something is solved. */
  atRisk: boolean;
  /** Last 7 days, oldest first, ending today. */
  week: { day: string; active: boolean; isToday: boolean }[];
}

export interface ReminderPrefs {
  reminderHour: number;
  vapidPublicKey: string;
}
