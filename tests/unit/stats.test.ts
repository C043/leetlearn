import { describe, expect, it } from "vitest";
import { buildHeatmap, summarizeActivity, summarizeProblems, type StatsProblem } from "@/lib/stats";

const days = (...pairs: [string, number][]) => pairs.map(([day, solves]) => ({ day, solves }));

describe("buildHeatmap", () => {
  // 2024-05-08 is a Wednesday
  const today = "2024-05-08";

  it("lays out full Sunday-first weeks, ending with the week of today", () => {
    const { weeks } = buildHeatmap([], today, 53);
    expect(weeks).toHaveLength(53);
    expect(weeks.every((w) => w.length === 7)).toBe(true);
    expect(weeks[0][0]?.day).toBe("2023-05-07");
    expect(new Date(`${weeks[0][0]!.day}T00:00:00Z`).getUTCDay()).toBe(0);
    const last = weeks[52];
    expect(last.map((c) => c?.day ?? null)).toEqual([
      "2024-05-05", "2024-05-06", "2024-05-07", "2024-05-08", null, null, null,
    ]);
  });

  it("counts solves per day and ignores days outside the window", () => {
    const { weeks, total } = buildHeatmap(days(["2024-05-07", 3], ["2020-01-01", 9], ["2024-05-09", 4]), today, 2);
    expect(weeks.flat().find((c) => c?.day === "2024-05-07")?.solves).toBe(3);
    expect(weeks.flat().find((c) => c?.day === "2024-05-01")?.solves).toBe(0);
    expect(total).toBe(3);
  });

  it("buckets days into levels 0-4 relative to the busiest day", () => {
    const { weeks, max } = buildHeatmap(
      days(["2024-05-01", 1], ["2024-05-02", 4], ["2024-05-03", 6], ["2024-05-04", 8]),
      today,
      2,
    );
    const level = (day: string) => weeks.flat().find((c) => c?.day === day)?.level;
    expect(max).toBe(8);
    expect([level("2024-04-30"), level("2024-05-01"), level("2024-05-02"), level("2024-05-03"), level("2024-05-04")]).toEqual([
      0, 1, 2, 3, 4,
    ]);
  });

  it("labels a month on the first week that starts in it", () => {
    const { months } = buildHeatmap([], today, 53);
    expect(months[0]).toEqual({ label: "Jun", week: 4 });
    expect(months.at(-1)).toEqual({ label: "May", week: 52 });
    expect(months.map((m) => m.label)).toEqual([
      "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May",
    ]);
  });
});

describe("summarizeActivity", () => {
  it("is all zeros with no activity", () => {
    expect(summarizeActivity([], "2024-05-08")).toEqual({
      totalSolves: 0,
      activeDays: 0,
      firstDay: null,
      bestDay: null,
      last7: 0,
      last30: 0,
      avgPerActiveDay: 0,
      weekdays: [0, 0, 0, 0, 0, 0, 0],
    });
  });

  it("totals solves, finds the best day and splits by weekday", () => {
    const s = summarizeActivity(
      days(["2024-04-01", 2], ["2024-05-01", 5], ["2024-05-04", 1], ["2024-05-08", 2]),
      "2024-05-08",
    );
    expect(s).toMatchObject({ totalSolves: 10, activeDays: 4, firstDay: "2024-04-01", avgPerActiveDay: 2.5 });
    expect(s.bestDay).toEqual({ day: "2024-05-01", solves: 5 });
    // last 7 days include today: 05-02 .. 05-08
    expect(s.last7).toBe(3);
    expect(s.last30).toBe(8);
    // Mon 04-01, Wed 05-01, Sat 05-04, Wed 05-08
    expect(s.weekdays).toEqual([0, 2, 0, 7, 0, 0, 1]);
  });
});

describe("summarizeProblems", () => {
  const problem = (overrides: Partial<StatsProblem> = {}): StatsProblem => ({
    title: "Valid Palindrome",
    slug: "valid-palindrome",
    difficulty: "EASY",
    isSolved: false,
    solvedUnder15Min: false,
    lastSolvedAt: null,
    inReview: false,
    mastered: false,
    patternName: "Two Pointers",
    patternOrder: 1,
    ...overrides,
  });

  it("totals progress overall, by difficulty and by path", () => {
    const s = summarizeProblems([
      problem({ isSolved: true, solvedUnder15Min: true, mastered: true }),
      problem({ difficulty: "MEDIUM", isSolved: true, inReview: true }),
      problem({ difficulty: "HARD" }),
      problem({ patternName: "Binary Search", patternOrder: 2, isSolved: true, solvedUnder15Min: true }),
    ]);
    expect(s.totals).toEqual({
      solved: 3, total: 4, under15: 2, mastered: 1, inReview: 1, pathsCompleted: 1, pathsTotal: 2,
    });
    expect(s.difficulty).toEqual([
      { difficulty: "EASY", solved: 2, total: 2, under15: 2 },
      { difficulty: "MEDIUM", solved: 1, total: 1, under15: 0 },
      { difficulty: "HARD", solved: 0, total: 1, under15: 0 },
    ]);
    expect(s.patterns).toEqual([
      { order: 1, name: "Two Pointers", solved: 2, total: 3, under15: 1, mastered: 1 },
      { order: 2, name: "Binary Search", solved: 1, total: 1, under15: 1, mastered: 0 },
    ]);
  });

  it("does not count mastery of unsolved problems", () => {
    expect(summarizeProblems([problem({ mastered: true })]).totals.mastered).toBe(0);
  });

  it("lists the most recent solves first, at most five", () => {
    const solved = Array.from({ length: 7 }, (_, i) =>
      problem({ title: `P${i}`, isSolved: true, lastSolvedAt: new Date(Date.UTC(2024, 4, i + 1)) }),
    );
    const { recent } = summarizeProblems([problem(), ...solved]);
    expect(recent.map((r) => r.title)).toEqual(["P6", "P5", "P4", "P3", "P2"]);
    expect(recent[0]).toMatchObject({ slug: "valid-palindrome", solvedAt: "2024-05-07T00:00:00.000Z" });
  });
});
