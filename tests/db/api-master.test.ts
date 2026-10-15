import { describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/problems/[id]/master/route";
import { prisma } from "@/lib/db";
import { insertPatterns, markSolved } from "../helpers/db";
import { jsonRequest, routeParams } from "../helpers/http";

const NOW = new Date("2024-05-10T12:00:00Z");
const LATER = new Date("2024-06-01T09:00:00Z");

function master(id: string) {
  return POST(jsonRequest(`/api/problems/${id}/master`, "POST"), routeParams({ id }));
}

const problem = (id: string) => prisma.problem.findUniqueOrThrow({ where: { id } });

function freezeTime(at: Date) {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(at);
}

describe("POST /api/problems/[id]/master", () => {
  it("returns 404 for an unknown problem", async () => {
    const res = await master("00000000-0000-0000-0000-000000000000");
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "Problem not found" });
  });

  it("returns 404 (not 500) for an id that isn't a UUID", async () => {
    const res = await master("not-a-uuid");
    expect(res.status).toBe(404);
  });

  it("refuses an unsolved problem with 409 and changes nothing", async () => {
    const [p] = await insertPatterns(1);
    const res = await master(p.problems[0].id);
    expect(res.status).toBe(409);
    expect(await res.json()).toEqual({ error: "Problem is not solved yet" });
    expect((await problem(p.problems[0].id)).trainingMasteredAt).toBeNull();
  });

  it("records when a solved problem was mastered", async () => {
    const [p] = await insertPatterns(1);
    await markSolved(p.problems[0].id, new Date("2024-05-01T10:00:00Z"));
    freezeTime(NOW);
    const res = await master(p.problems[0].id);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ masteredAt: NOW.toISOString() });
    expect((await problem(p.problems[0].id)).trainingMasteredAt).toEqual(NOW);
  });

  it("keeps the first mastery date when mastered again", async () => {
    const [p] = await insertPatterns(1);
    await markSolved(p.problems[0].id, new Date("2024-05-01T10:00:00Z"));
    freezeTime(NOW);
    await master(p.problems[0].id);
    freezeTime(LATER);
    const res = await master(p.problems[0].id);
    expect(await res.json()).toEqual({ masteredAt: NOW.toISOString() });
    expect((await problem(p.problems[0].id)).trainingMasteredAt).toEqual(NOW);
  });

  it("touches nothing else: solved state, review, unlocking or the streak", async () => {
    const [p] = await insertPatterns(1);
    const solvedAt = new Date("2024-05-01T10:00:00Z");
    await markSolved(p.problems[0].id, solvedAt, { under15: false, inReview: true });
    const before = await problem(p.problems[0].id);
    freezeTime(NOW);
    await master(p.problems[0].id);

    const after = await problem(p.problems[0].id);
    expect(after).toEqual({ ...before, trainingMasteredAt: NOW });
    expect((await problem(p.problems[1].id)).unlocked).toBe(false);
    expect(await prisma.activityDay.count()).toBe(0);
  });

  it("only affects the problem it was called for", async () => {
    const [p] = await insertPatterns(1);
    await markSolved(p.problems[0].id, NOW);
    await markSolved(p.problems[1].id, NOW);
    await master(p.problems[0].id);
    expect((await problem(p.problems[1].id)).trainingMasteredAt).toBeNull();
  });
});
