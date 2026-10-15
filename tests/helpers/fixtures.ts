import type { ProblemView, StreakView } from "@/lib/types";

export function problemView(overrides: Partial<ProblemView> = {}): ProblemView {
  const id = overrides.id ?? "p1";
  return {
    id,
    slug: "valid-palindrome",
    title: "Valid Palindrome",
    leetcodeUrl: "https://leetcode.com/problems/valid-palindrome/",
    videoUrl: "https://www.youtube.com/results?search_query=leetcode%20Valid%20Palindrome",
    difficulty: "EASY",
    order: 1,
    isSolved: false,
    solvedUnder15Min: false,
    lastSolvedAt: null,
    unlocked: true,
    inReview: false,
    patternName: "Two Pointers",
    hasExercises: false,
    mastered: false,
    ...overrides,
  };
}

/** Ten problems of one path: the first `solved` solved, the next one unlocked, the rest locked. */
export function pathProblems(solved = 0): ProblemView[] {
  const difficulties = ["EASY", "EASY", "MEDIUM", "MEDIUM", "MEDIUM", "MEDIUM", "MEDIUM", "MEDIUM", "MEDIUM", "HARD"] as const;
  return difficulties.map((difficulty, i) =>
    problemView({
      id: `p${i + 1}`,
      slug: `problem-${i + 1}`,
      title: `Problem ${i + 1}`,
      order: i + 1,
      difficulty,
      isSolved: i < solved,
      solvedUnder15Min: i < solved,
      lastSolvedAt: i < solved ? "2024-05-01T10:00:00.000Z" : null,
      unlocked: i <= solved,
    }),
  );
}

export function streakView(overrides: Partial<StreakView> = {}): StreakView {
  const days = ["2024-05-04", "2024-05-05", "2024-05-06", "2024-05-07", "2024-05-08", "2024-05-09", "2024-05-10"];
  return {
    current: 3,
    longest: 5,
    doneToday: true,
    atRisk: false,
    week: days.map((day, i) => ({ day, active: i >= 4, isToday: i === 6 })),
    ...overrides,
  };
}

/** A fetch Response-like object for stubbing `fetch`. */
export function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}
