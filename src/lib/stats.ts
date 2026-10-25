import { addDays } from "./streak";
import type { Difficulty } from "./types";

export interface ActivityRow {
  day: string; // YYYY-MM-DD
  solves: number;
}

export interface HeatmapCell {
  day: string;
  solves: number;
  /** 0 = nothing solved, 1-4 = quarters of the busiest day in the window. */
  level: 0 | 1 | 2 | 3 | 4;
}

export interface Heatmap {
  /** Columns of 7 days, Sunday first; days after today are null. */
  weeks: (HeatmapCell | null)[][];
  /** A label on the first week that starts in each month (the first column is never labelled). */
  months: { label: string; week: number }[];
  total: number;
  max: number;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const weekday = (day: string) => new Date(`${day}T00:00:00Z`).getUTCDay();

/** GitHub-style contribution grid of the last `weeks` weeks, ending with the week of `today`. */
export function buildHeatmap(activity: ActivityRow[], today: string, weeks = 53): Heatmap {
  const start = addDays(today, -weekday(today) - (weeks - 1) * 7);
  const solves = new Map(activity.filter((a) => a.day >= start && a.day <= today).map((a) => [a.day, a.solves]));
  const max = Math.max(0, ...solves.values());

  const grid = Array.from({ length: weeks }, (_, w) =>
    Array.from({ length: 7 }, (_, d): HeatmapCell | null => {
      const day = addDays(start, w * 7 + d);
      if (day > today) return null;
      const n = solves.get(day) ?? 0;
      const level = (n === 0 ? 0 : Math.min(4, Math.ceil((n / max) * 4))) as HeatmapCell["level"];
      return { day, solves: n, level };
    }),
  );

  const months: Heatmap["months"] = [];
  for (let w = 1; w < weeks; w++) {
    const month = grid[w][0]!.day.slice(5, 7);
    if (month !== grid[w - 1][0]!.day.slice(5, 7)) months.push({ label: MONTHS[Number(month) - 1], week: w });
  }

  return { weeks: grid, months, total: [...solves.values()].reduce((a, b) => a + b, 0), max };
}

export interface ActivitySummary {
  totalSolves: number;
  activeDays: number;
  firstDay: string | null;
  bestDay: ActivityRow | null;
  /** Solves in the 7 / 30 days ending today. */
  last7: number;
  last30: number;
  avgPerActiveDay: number;
  /** Solves per weekday, Sunday first. */
  weekdays: number[];
}

export function summarizeActivity(activity: ActivityRow[], today: string): ActivitySummary {
  const sorted = [...activity].sort((a, b) => a.day.localeCompare(b.day));
  const sinceDay = (from: string) =>
    sorted.filter((a) => a.day >= from && a.day <= today).reduce((n, a) => n + a.solves, 0);
  const totalSolves = sorted.reduce((n, a) => n + a.solves, 0);
  const weekdays = [0, 0, 0, 0, 0, 0, 0];
  let bestDay: ActivityRow | null = null;
  for (const a of sorted) {
    weekdays[weekday(a.day)] += a.solves;
    if (!bestDay || a.solves > bestDay.solves) bestDay = { day: a.day, solves: a.solves };
  }
  return {
    totalSolves,
    activeDays: sorted.length,
    firstDay: sorted[0]?.day ?? null,
    bestDay,
    last7: sinceDay(addDays(today, -6)),
    last30: sinceDay(addDays(today, -29)),
    avgPerActiveDay: sorted.length === 0 ? 0 : totalSolves / sorted.length,
    weekdays,
  };
}

export interface StatsProblem {
  title: string;
  slug: string;
  difficulty: Difficulty;
  isSolved: boolean;
  solvedUnder15Min: boolean;
  lastSolvedAt: Date | null;
  inReview: boolean;
  mastered: boolean;
  patternName: string;
  patternOrder: number;
}

export interface ProblemSummary {
  totals: {
    solved: number;
    total: number;
    under15: number;
    /** Solved and trained 10/10 on the first try. */
    mastered: number;
    inReview: number;
    pathsCompleted: number;
    pathsTotal: number;
  };
  difficulty: { difficulty: Difficulty; solved: number; total: number; under15: number }[];
  patterns: { order: number; name: string; solved: number; total: number; under15: number; mastered: number }[];
  recent: {
    title: string;
    slug: string;
    difficulty: Difficulty;
    patternName: string;
    solvedAt: string;
    under15: boolean;
  }[];
}

const RECENT_LIMIT = 5;

export function summarizeProblems(problems: StatsProblem[]): ProblemSummary {
  const tally = (list: StatsProblem[]) => {
    const solved = list.filter((p) => p.isSolved);
    return {
      solved: solved.length,
      total: list.length,
      under15: solved.filter((p) => p.solvedUnder15Min).length,
      mastered: solved.filter((p) => p.mastered).length,
    };
  };

  const byPattern = new Map<number, StatsProblem[]>();
  for (const p of problems) byPattern.set(p.patternOrder, [...(byPattern.get(p.patternOrder) ?? []), p]);
  const patterns = [...byPattern]
    .sort(([a], [b]) => a - b)
    .map(([order, list]) => ({ order, name: list[0].patternName, ...tally(list) }));

  const difficulty = (["EASY", "MEDIUM", "HARD"] as const).map((d) => {
    const { solved, total, under15 } = tally(problems.filter((p) => p.difficulty === d));
    return { difficulty: d, solved, total, under15 };
  });

  const recent = problems
    .filter((p) => p.isSolved && p.lastSolvedAt)
    .sort((a, b) => b.lastSolvedAt!.getTime() - a.lastSolvedAt!.getTime())
    .slice(0, RECENT_LIMIT)
    .map((p) => ({
      title: p.title,
      slug: p.slug,
      difficulty: p.difficulty,
      patternName: p.patternName,
      solvedAt: p.lastSolvedAt!.toISOString(),
      under15: p.solvedUnder15Min,
    }));

  return {
    totals: {
      ...tally(problems),
      inReview: problems.filter((p) => p.inReview).length,
      pathsCompleted: patterns.filter((p) => p.total > 0 && p.solved === p.total).length,
      pathsTotal: patterns.length,
    },
    difficulty,
    patterns,
    recent,
  };
}
