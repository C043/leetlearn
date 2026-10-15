import { describe, expect, it } from "vitest";
import { prisma } from "@/lib/db";
import { getSettings, getStreak, recordActivity, rememberTimeZone } from "@/lib/streak";
import { insertPattern, markSolved, setActivityDays, setSettings } from "../helpers/db";

const NOON = (day: string) => new Date(`${day}T12:00:00Z`);

describe("getSettings", () => {
  it("creates the single settings row with defaults on first use", async () => {
    expect(await prisma.appSettings.count()).toBe(0);
    const s = await getSettings();
    expect(s).toMatchObject({ id: 1, timeZone: "UTC", reminderHour: 20, lastReminderDay: null, lastReminderStage: 0 });
    expect(await prisma.appSettings.count()).toBe(1);
  });

  it("returns the existing row without resetting it", async () => {
    await setSettings({ timeZone: "Europe/Rome", reminderHour: 7 });
    expect(await getSettings()).toMatchObject({ timeZone: "Europe/Rome", reminderHour: 7 });
  });

  it("survives concurrent first calls", async () => {
    const results = await Promise.allSettled(Array.from({ length: 5 }, () => getSettings()));
    // Upsert races can surface as a unique violation on some calls, but the row must exist exactly once
    expect(results.some((r) => r.status === "fulfilled")).toBe(true);
    expect(await prisma.appSettings.count()).toBe(1);
  });
});

describe("rememberTimeZone", () => {
  it("stores a valid zone", async () => {
    await rememberTimeZone("Asia/Tokyo");
    expect((await getSettings()).timeZone).toBe("Asia/Tokyo");
  });

  it("creates the settings row if it doesn't exist yet", async () => {
    await rememberTimeZone("America/Denver");
    expect(await prisma.appSettings.findUnique({ where: { id: 1 } })).toMatchObject({ timeZone: "America/Denver" });
  });

  it.each([undefined, null, "", "Not/AZone", 42, "x".repeat(100)])(
    "ignores the invalid value %j and keeps the current zone",
    async (tz) => {
      await setSettings({ timeZone: "Europe/Paris" });
      await rememberTimeZone(tz);
      expect((await getSettings()).timeZone).toBe("Europe/Paris");
    },
  );

  it("does not touch other settings", async () => {
    await setSettings({ reminderHour: 9, lastReminderDay: "2024-01-01", lastReminderStage: 2 });
    await rememberTimeZone("Asia/Tokyo");
    expect(await getSettings()).toMatchObject({ reminderHour: 9, lastReminderDay: "2024-01-01", lastReminderStage: 2 });
  });
});

describe("recordActivity", () => {
  it("reports the first solve of the day, then counts further solves", async () => {
    const now = NOON("2024-05-10");
    expect(await recordActivity(now)).toBe(true);
    expect(await recordActivity(now)).toBe(false);
    expect(await recordActivity(new Date("2024-05-10T23:59:59Z"))).toBe(false);
    expect(await prisma.activityDay.findUnique({ where: { day: "2024-05-10" } })).toEqual({ day: "2024-05-10", solves: 3 });
  });

  it("starts a new row on the next day", async () => {
    await recordActivity(NOON("2024-05-10"));
    expect(await recordActivity(NOON("2024-05-11"))).toBe(true);
    expect(await prisma.activityDay.count()).toBe(2);
  });

  it("uses the user's time zone to decide which day a solve belongs to", async () => {
    await setSettings({ timeZone: "Asia/Tokyo" });
    // 2024-05-10 20:00 UTC is already 2024-05-11 05:00 in Tokyo
    await recordActivity(new Date("2024-05-10T20:00:00Z"));
    expect(await prisma.activityDay.findMany()).toEqual([{ day: "2024-05-11", solves: 1 }]);
  });

  it("splits solves around the user's midnight, not UTC midnight", async () => {
    await setSettings({ timeZone: "America/New_York" });
    await recordActivity(new Date("2024-05-11T03:30:00Z")); // 23:30 on the 10th in New York
    expect(await recordActivity(new Date("2024-05-11T04:30:00Z"))).toBe(true); // 00:30 on the 11th
    expect((await prisma.activityDay.findMany({ orderBy: { day: "asc" } })).map((d) => d.day)).toEqual([
      "2024-05-10",
      "2024-05-11",
    ]);
  });

  it("counts every solve when many land at once", async () => {
    await setActivityDays(["2024-05-01"]); // skip backfill
    const now = NOON("2024-05-10");
    const results = await Promise.all(Array.from({ length: 10 }, () => recordActivity(now).catch(() => null)));
    const row = await prisma.activityDay.findUnique({ where: { day: "2024-05-10" } });
    const succeeded = results.filter((r) => r !== null).length;
    expect(row?.solves).toBe(succeeded);
    // Exactly one call may claim "first solve of the day"
    expect(results.filter((r) => r === true)).toHaveLength(1);
  });
});

describe("activity backfill for databases from before streaks", () => {
  it("seeds one row per day from lastSolvedAt when there are no activity rows", async () => {
    const pattern = await insertPattern();
    const [a, b, c] = pattern.problems;
    await markSolved(a.id, NOON("2024-05-08"));
    await markSolved(b.id, NOON("2024-05-09"));
    await markSolved(c.id, new Date("2024-05-09T18:00:00Z"));

    const streak = await getStreak(NOON("2024-05-10"));
    expect(await prisma.activityDay.findMany({ orderBy: { day: "asc" } })).toEqual([
      { day: "2024-05-08", solves: 1 },
      { day: "2024-05-09", solves: 2 },
    ]);
    expect(streak.current).toBe(2);
    expect(streak.atRisk).toBe(true);
  });

  it("buckets backfilled solves by the user's time zone", async () => {
    await setSettings({ timeZone: "Asia/Tokyo" });
    const pattern = await insertPattern();
    await markSolved(pattern.problems[0].id, new Date("2024-05-08T20:00:00Z")); // 9th in Tokyo
    await getStreak(NOON("2024-05-09"));
    expect((await prisma.activityDay.findMany()).map((d) => d.day)).toEqual(["2024-05-09"]);
  });

  it("ignores unsolved problems", async () => {
    await insertPattern();
    await getStreak(NOON("2024-05-10"));
    expect(await prisma.activityDay.count()).toBe(0);
  });

  it("never runs once activity exists", async () => {
    const pattern = await insertPattern();
    await setActivityDays(["2024-05-01"]);
    await markSolved(pattern.problems[0].id, NOON("2024-05-09"));
    await getStreak(NOON("2024-05-10"));
    expect((await prisma.activityDay.findMany()).map((d) => d.day)).toEqual(["2024-05-01"]);
  });
});

describe("getStreak", () => {
  const today = "2024-05-10";
  const now = NOON(today);

  it("is all zeros with no activity", async () => {
    expect(await getStreak(now)).toMatchObject({ current: 0, longest: 0, doneToday: false, atRisk: false });
  });

  it("counts today as day one", async () => {
    await setActivityDays([today]);
    expect(await getStreak(now)).toMatchObject({ current: 1, longest: 1, doneToday: true, atRisk: false });
  });

  it("keeps yesterday's streak alive (but at risk) until today ends", async () => {
    await setActivityDays(["2024-05-07", "2024-05-08", "2024-05-09"]);
    expect(await getStreak(now)).toMatchObject({ current: 3, longest: 3, doneToday: false, atRisk: true });
  });

  it("breaks the streak after a full missed day", async () => {
    await setActivityDays(["2024-05-07", "2024-05-08"]);
    expect(await getStreak(now)).toMatchObject({ current: 0, longest: 2, doneToday: false, atRisk: false });
  });

  it("counts a run that includes today", async () => {
    await setActivityDays(["2024-05-08", "2024-05-09", today]);
    expect(await getStreak(now)).toMatchObject({ current: 3, doneToday: true, atRisk: false });
  });

  it("only counts the latest run as current, but remembers the longest", async () => {
    await setActivityDays([
      "2024-04-01", "2024-04-02", "2024-04-03", "2024-04-04", "2024-04-05", // 5
      "2024-05-01", // 1
      "2024-05-09", today, // 2 (current)
    ]);
    expect(await getStreak(now)).toMatchObject({ current: 2, longest: 5 });
  });

  it("counts runs across month and year boundaries", async () => {
    await setActivityDays(["2023-12-30", "2023-12-31", "2024-01-01", "2024-01-02"]);
    expect(await getStreak(NOON("2024-01-02"))).toMatchObject({ current: 4, longest: 4 });
  });

  it("counts across a leap day", async () => {
    await setActivityDays(["2024-02-28", "2024-02-29", "2024-03-01"]);
    expect((await getStreak(NOON("2024-03-01"))).current).toBe(3);
  });

  it("handles a year-long streak", async () => {
    const days: string[] = [];
    for (let d = new Date("2023-05-11T00:00:00Z"); d <= new Date(`${today}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + 1)) {
      days.push(d.toISOString().slice(0, 10));
    }
    await setActivityDays(days);
    expect(await getStreak(now)).toMatchObject({ current: 366, longest: 366, doneToday: true });
  });

  it("ignores future-dated rows for the current streak", async () => {
    await setActivityDays(["2024-05-12", "2024-05-13"]);
    expect(await getStreak(now)).toMatchObject({ current: 0, doneToday: false, atRisk: false });
  });

  it("evaluates 'today' in the user's time zone", async () => {
    await setSettings({ timeZone: "Pacific/Kiritimati" }); // UTC+14
    await setActivityDays(["2024-05-11"]);
    // Noon UTC on the 10th is already the 11th in Kiritimati
    expect(await getStreak(now)).toMatchObject({ current: 1, doneToday: true });
  });

  describe("week", () => {
    it("lists the last 7 days, oldest first, ending today", async () => {
      const { week } = await getStreak(now);
      expect(week.map((d) => d.day)).toEqual([
        "2024-05-04", "2024-05-05", "2024-05-06", "2024-05-07", "2024-05-08", "2024-05-09", "2024-05-10",
      ]);
      expect(week.map((d) => d.isToday)).toEqual([false, false, false, false, false, false, true]);
    });

    it("marks active days, including ones that aren't part of the current streak", async () => {
      await setActivityDays(["2024-05-03", "2024-05-04", "2024-05-06", today]);
      const { week } = await getStreak(now);
      expect(week.map((d) => d.active)).toEqual([true, false, true, false, false, false, true]);
    });

    it("crosses a month boundary", async () => {
      const { week } = await getStreak(NOON("2024-03-02"));
      expect(week[0].day).toBe("2024-02-25");
      expect(week[4].day).toBe("2024-02-29");
      expect(week[6].day).toBe("2024-03-02");
    });
  });
});
