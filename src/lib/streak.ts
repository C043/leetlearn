import { prisma } from "./db";
import type { StreakView } from "./types";

/** Valid IANA zone or null, so a bad client value can't poison the settings row. */
export function normalizeTimeZone(tz: unknown): string | null {
  if (typeof tz !== "string" || tz.length === 0 || tz.length > 64) return null;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return tz;
  } catch {
    return null;
  }
}

/** Calendar day (YYYY-MM-DD) of `date` in `timeZone`. */
export function dayKey(date: Date, timeZone: string): string {
  // en-CA formats as YYYY-MM-DD
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/** Hour of day (0-23) of `date` in `timeZone`. */
export function localHour(date: Date, timeZone: string): number {
  const h = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    hourCycle: "h23",
  }).format(date);
  return Number(h) % 24;
}

export function addDays(day: string, n: number): string {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/**
 * Create the single settings row if it's missing. Prisma's upsert runs as a
 * read then an insert, so parallel first requests on an empty database both
 * insert id 1 and one fails with P2002. `skipDuplicates` is a single
 * INSERT ... ON CONFLICT DO NOTHING, which is safe to race.
 */
export async function ensureSettings() {
  await prisma.appSettings.createMany({ data: [{ id: 1 }], skipDuplicates: true });
}

export async function getSettings() {
  await ensureSettings();
  return prisma.appSettings.findUniqueOrThrow({ where: { id: 1 } });
}

/** Remember the user's zone so "today" and reminders follow their clock. */
export async function rememberTimeZone(tz: unknown) {
  const timeZone = normalizeTimeZone(tz);
  if (!timeZone) return;
  await ensureSettings();
  await prisma.appSettings.update({ where: { id: 1 }, data: { timeZone } });
}

/**
 * Databases from before streaks existed have no activity rows. Seed them once
 * from each problem's lastSolvedAt, which is a lower bound on real history
 * (only a review re-solve overwrites an older date).
 */
async function backfillActivityIfEmpty(timeZone: string) {
  if ((await prisma.activityDay.count()) > 0) return;
  const solved = await prisma.problem.findMany({
    where: { lastSolvedAt: { not: null } },
    select: { lastSolvedAt: true },
  });
  const counts = new Map<string, number>();
  for (const { lastSolvedAt } of solved) {
    const day = dayKey(lastSolvedAt!, timeZone);
    counts.set(day, (counts.get(day) ?? 0) + 1);
  }
  await prisma.activityDay.createMany({
    data: [...counts].map(([day, solves]) => ({ day, solves })),
    skipDuplicates: true,
  });
}

/** Count a solve toward today's activity. Returns true if it was the first today. */
export async function recordActivity(now: Date = new Date()): Promise<boolean> {
  const { timeZone } = await getSettings();
  const day = dayKey(now, timeZone);
  await backfillActivityIfEmpty(timeZone);
  const row = await prisma.activityDay.upsert({
    where: { day },
    update: { solves: { increment: 1 } },
    create: { day, solves: 1 },
  });
  return row.solves === 1;
}

export async function getStreak(now: Date = new Date()): Promise<StreakView> {
  const { timeZone } = await getSettings();
  const today = dayKey(now, timeZone);
  await backfillActivityIfEmpty(timeZone);
  const days = (
    await prisma.activityDay.findMany({ orderBy: { day: "asc" }, select: { day: true } })
  ).map((d) => d.day);
  const active = new Set(days);

  const doneToday = active.has(today);
  // Today isn't over, so an empty today doesn't break the streak yet
  let cursor = doneToday ? today : addDays(today, -1);
  let current = 0;
  while (active.has(cursor)) {
    current++;
    cursor = addDays(cursor, -1);
  }

  let longest = 0;
  let run = 0;
  let prev: string | null = null;
  for (const day of days) {
    run = prev && addDays(prev, 1) === day ? run + 1 : 1;
    longest = Math.max(longest, run);
    prev = day;
  }

  const week = Array.from({ length: 7 }, (_, i) => {
    const day = addDays(today, i - 6);
    return { day, active: active.has(day), isToday: day === today };
  });

  return { current, longest, doneToday, atRisk: !doneToday && current > 0, week };
}
