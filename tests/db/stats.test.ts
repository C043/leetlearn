import { describe, expect, it, vi } from "vitest";
import { prisma } from "@/lib/db";
import { getStats } from "@/lib/queries";
import { insertPatterns, markSolved, setActivityDays, setSettings } from "../helpers/db";

describe("getStats", () => {
  it("works on an empty database", async () => {
    const stats = await getStats(new Date("2024-05-08T12:00:00Z"));
    expect(stats.totals).toMatchObject({ solved: 0, total: 0, pathsTotal: 0 });
    expect(stats.activity.totalSolves).toBe(0);
    expect(stats.heatmap.weeks).toHaveLength(53);
    expect(stats.streak.current).toBe(0);
  });

  it("combines problem progress, training mastery and activity", async () => {
    const [a, b] = await insertPatterns(2);
    await markSolved(a.problems[0].id, new Date("2024-05-07T10:00:00Z"));
    await markSolved(a.problems[1].id, new Date("2024-05-08T10:00:00Z"), { under15: false, inReview: true });
    await markSolved(b.problems[0].id, new Date("2024-05-06T10:00:00Z"));
    await prisma.problem.update({ where: { id: a.problems[0].id }, data: { trainingMasteredAt: new Date() } });
    await setActivityDays(["2024-05-06", "2024-05-07", "2024-05-08"]);

    const stats = await getStats(new Date("2024-05-08T12:00:00Z"));
    expect(stats.totals).toEqual({
      solved: 3, total: 20, under15: 2, mastered: 1, inReview: 1, pathsCompleted: 0, pathsTotal: 2,
    });
    expect(stats.patterns.map((p) => [p.order, p.solved])).toEqual([[1, 2], [2, 1]]);
    expect(stats.recent.map((r) => r.title)).toEqual([a.problems[1].title, a.problems[0].title, b.problems[0].title]);
    expect(stats.activity).toMatchObject({ totalSolves: 3, activeDays: 3, last7: 3 });
    expect(stats.heatmap.total).toBe(3);
    expect(stats.streak).toMatchObject({ current: 3, doneToday: true });
  });

  it("ends the graph on today in the user's time zone", async () => {
    await setSettings({ timeZone: "Asia/Tokyo" });
    // Already the 9th in Tokyo
    const stats = await getStats(new Date("2024-05-08T20:00:00Z"));
    expect(stats.heatmap.weeks.flat().filter(Boolean).at(-1)?.day).toBe("2024-05-09");
  });

  it("backfills activity from solve dates on databases from before streaks", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2024-05-08T12:00:00Z"));
    const [a] = await insertPatterns(1);
    await markSolved(a.problems[0].id, new Date("2024-05-01T10:00:00Z"));
    const stats = await getStats();
    expect(stats.activity).toMatchObject({ totalSolves: 1, firstDay: "2024-05-01" });
  });
});
