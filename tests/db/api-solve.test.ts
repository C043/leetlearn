import { describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/problems/[id]/solve/route";
import { prisma } from "@/lib/db";
import { insertPatterns, markSolved, setActivityDays, setSettings } from "../helpers/db";
import { jsonRequest, routeParams } from "../helpers/http";

const NOW = new Date("2024-05-10T12:00:00Z");

function solve(id: string, body: unknown) {
  return POST(jsonRequest(`/api/problems/${id}/solve`, "POST", body), routeParams({ id }));
}

async function solveOk(id: string, body: unknown) {
  const res = await solve(id, body);
  expect(res.status).toBe(200);
  return res.json();
}

const problem = (id: string) => prisma.problem.findUniqueOrThrow({ where: { id } });

function freezeTime(at: Date) {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(at);
}

describe("POST /api/problems/[id]/solve — validation", () => {
  it.each<[string, unknown]>([
    ["no body", undefined],
    ["malformed JSON", "{solvedUnder15Min: true"],
    ["null", null],
    ["an array", [true]],
    ["an empty object", {}],
    ["a string flag", { solvedUnder15Min: "true" }],
    ["a numeric flag", { solvedUnder15Min: 1 }],
    ["a null flag", { solvedUnder15Min: null }],
    ["a non-string time zone", { solvedUnder15Min: true, timeZone: 5 }],
  ])("rejects %s with 400", async (_, body) => {
    const [p] = await insertPatterns(1);
    const res = await solve(p.problems[0].id, body);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Body must be { solvedUnder15Min: boolean }" });
    expect((await problem(p.problems[0].id)).isSolved).toBe(false);
  });

  it("returns 404 for an unknown problem", async () => {
    const res = await solve("00000000-0000-0000-0000-000000000000", { solvedUnder15Min: true });
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "Problem not found" });
  });

  it("returns 404 (not 500) for an id that isn't even a UUID", async () => {
    const res = await solve("not-a-uuid'; DROP TABLE \"Problem\"; --", { solvedUnder15Min: true });
    expect(res.status).toBe(404);
    expect(await prisma.problem.count()).toBe(0);
  });

  it("refuses to solve a locked problem with 409 and changes nothing", async () => {
    const [p] = await insertPatterns(1);
    const locked = p.problems[1];
    const res = await solve(locked.id, { solvedUnder15Min: true });
    expect(res.status).toBe(409);
    expect(await res.json()).toEqual({ error: "Problem is locked" });
    expect(await problem(locked.id)).toMatchObject({ isSolved: false, lastSolvedAt: null });
    expect((await problem(p.problems[2].id)).unlocked).toBe(false);
    expect(await prisma.activityDay.count()).toBe(0);
  });
});

describe("POST /api/problems/[id]/solve — progression", () => {
  it("marks the problem solved, records the time and flag, and unlocks the next one", async () => {
    freezeTime(NOW);
    const [p] = await insertPatterns(1);
    const body = await solveOk(p.problems[0].id, { solvedUnder15Min: true });

    expect(body).toMatchObject({ id: p.problems[0].id, isSolved: true, solvedUnder15Min: true });
    expect(new Date(body.lastSolvedAt)).toEqual(NOW);
    expect(await problem(p.problems[0].id)).toMatchObject({ isSolved: true, solvedUnder15Min: true, lastSolvedAt: NOW });
    expect((await problem(p.problems[1].id)).unlocked).toBe(true);
    expect((await problem(p.problems[2].id)).unlocked).toBe(false);
  });

  it("stores a slow solve", async () => {
    const [p] = await insertPatterns(1);
    await solveOk(p.problems[0].id, { solvedUnder15Min: false });
    expect((await problem(p.problems[0].id)).solvedUnder15Min).toBe(false);
  });

  it("walks the whole path 1 -> 10 in order", async () => {
    const [p] = await insertPatterns(1);
    for (const q of p.problems) await solveOk(q.id, { solvedUnder15Min: true });
    const rows = await prisma.problem.findMany({ where: { patternId: p.id } });
    expect(rows.every((r) => r.isSolved && r.unlocked)).toBe(true);
  });

  it("solving the last (Hard) problem unlocks nothing else", async () => {
    const [a, b] = await insertPatterns(2);
    await prisma.problem.update({ where: { id: a.problems[9].id }, data: { unlocked: true } });
    await solveOk(a.problems[9].id, { solvedUnder15Min: false });
    const unlocked = await prisma.problem.findMany({ where: { unlocked: true }, select: { id: true } });
    expect(unlocked.map((u) => u.id).sort()).toEqual([a.problems[0].id, a.problems[9].id, b.problems[0].id].sort());
  });

  it("only unlocks within the same pattern", async () => {
    const [a, b] = await insertPatterns(2);
    await solveOk(a.problems[0].id, { solvedUnder15Min: true });
    expect((await problem(b.problems[1].id)).unlocked).toBe(false);
  });

  it("lets a solved problem be solved again, updating time and flag without relocking anything", async () => {
    const [p] = await insertPatterns(1);
    freezeTime(NOW);
    await solveOk(p.problems[0].id, { solvedUnder15Min: false });
    const later = new Date("2024-05-20T09:00:00Z");
    vi.setSystemTime(later);
    await solveOk(p.problems[0].id, { solvedUnder15Min: true });
    expect(await problem(p.problems[0].id)).toMatchObject({ isSolved: true, solvedUnder15Min: true, lastSolvedAt: later });
    expect((await problem(p.problems[1].id)).unlocked).toBe(true);
  });

  it("removes a re-solved review problem from the review queue", async () => {
    const [p] = await insertPatterns(1);
    await markSolved(p.problems[0].id, new Date("2024-01-01T00:00:00Z"), { inReview: true, under15: false });
    await solveOk(p.problems[0].id, { solvedUnder15Min: true });
    expect(await problem(p.problems[0].id)).toMatchObject({ inReview: false, addedToReviewAt: null, solvedUnder15Min: true });
  });

  it("does not leak the solve to other problems in review", async () => {
    const [p] = await insertPatterns(1);
    await markSolved(p.problems[0].id, new Date("2024-01-01T00:00:00Z"), { inReview: true });
    await markSolved(p.problems[1].id, new Date("2024-01-01T00:00:00Z"), { inReview: true });
    await solveOk(p.problems[0].id, { solvedUnder15Min: true });
    expect((await problem(p.problems[1].id)).inReview).toBe(true);
  });

  it("ignores unknown extra fields in the body", async () => {
    const [p] = await insertPatterns(1);
    await solveOk(p.problems[0].id, { solvedUnder15Min: true, isSolved: false, unlocked: false, order: 7 });
    expect(await problem(p.problems[0].id)).toMatchObject({ isSolved: true, unlocked: true, order: 1 });
  });
});

describe("POST /api/problems/[id]/solve — streak", () => {
  it("extends the streak on the first solve of the day and returns it", async () => {
    freezeTime(NOW);
    await setActivityDays(["2024-05-08", "2024-05-09"]);
    const [p] = await insertPatterns(1);
    const body = await solveOk(p.problems[0].id, { solvedUnder15Min: true });
    expect(body.streakExtended).toBe(true);
    expect(body.streak).toMatchObject({ current: 3, longest: 3, doneToday: true, atRisk: false });
    expect(body.streak.week).toHaveLength(7);
  });

  it("does not extend twice on the same day", async () => {
    freezeTime(NOW);
    await setActivityDays(["2024-05-09"]);
    const [p] = await insertPatterns(1);
    await solveOk(p.problems[0].id, { solvedUnder15Min: true });
    const second = await solveOk(p.problems[1].id, { solvedUnder15Min: true });
    expect(second.streakExtended).toBe(false);
    expect(second.streak.current).toBe(2);
    expect(await prisma.activityDay.findUnique({ where: { day: "2024-05-10" } })).toMatchObject({ solves: 2 });
  });

  it("celebrates the very first solve on a fresh install", async () => {
    freezeTime(NOW);
    const [p] = await insertPatterns(1);
    const body = await solveOk(p.problems[0].id, { solvedUnder15Min: true });
    expect(body.streak.current).toBe(1);
    expect(await prisma.activityDay.findUnique({ where: { day: "2024-05-10" } })).toMatchObject({ solves: 1 });
    expect(body.streakExtended).toBe(true);
  });

  it("counts a review re-solve toward the streak", async () => {
    freezeTime(NOW);
    await setActivityDays(["2024-05-09"]);
    const [p] = await insertPatterns(1);
    await markSolved(p.problems[0].id, new Date("2024-01-01T00:00:00Z"), { inReview: true });
    const body = await solveOk(p.problems[0].id, { solvedUnder15Min: true });
    expect(body.streakExtended).toBe(true);
  });

  it("remembers the client's time zone and uses it for today's date", async () => {
    // 20:00 UTC on the 10th is already the 11th in Tokyo
    freezeTime(new Date("2024-05-10T20:00:00Z"));
    await setActivityDays(["2024-05-10"]);
    const [p] = await insertPatterns(1);
    const body = await solveOk(p.problems[0].id, { solvedUnder15Min: true, timeZone: "Asia/Tokyo" });
    expect((await prisma.appSettings.findUnique({ where: { id: 1 } }))!.timeZone).toBe("Asia/Tokyo");
    expect(await prisma.activityDay.findUnique({ where: { day: "2024-05-11" } })).not.toBeNull();
    expect(body.streak.current).toBe(2);
  });

  it("ignores a bogus time zone instead of failing the solve", async () => {
    await setSettings({ timeZone: "Europe/Rome" });
    const [p] = await insertPatterns(1);
    await solveOk(p.problems[0].id, { solvedUnder15Min: true, timeZone: "Nowhere/Land" });
    expect((await prisma.appSettings.findUnique({ where: { id: 1 } }))!.timeZone).toBe("Europe/Rome");
    expect((await problem(p.problems[0].id)).isSolved).toBe(true);
  });

  it("keeps working for older clients that don't send a time zone", async () => {
    await setSettings({ timeZone: "Europe/Rome" });
    const [p] = await insertPatterns(1);
    await solveOk(p.problems[0].id, { solvedUnder15Min: false });
    expect((await prisma.appSettings.findUnique({ where: { id: 1 } }))!.timeZone).toBe("Europe/Rome");
  });

  it("handles double-clicks: two concurrent solves both succeed and count once as the first of the day", async () => {
    freezeTime(NOW);
    await setActivityDays(["2024-05-09"]);
    const [p] = await insertPatterns(1);
    const [a, b] = await Promise.all([
      solveOk(p.problems[0].id, { solvedUnder15Min: true }),
      solveOk(p.problems[0].id, { solvedUnder15Min: true }),
    ]);
    expect([a.streakExtended, b.streakExtended].filter(Boolean)).toHaveLength(1);
    expect((await problem(p.problems[1].id)).unlocked).toBe(true);
  });
});
