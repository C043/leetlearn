import { afterAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/db";

// Runs against `next start` on a freshly seeded database (see scripts/test.sh)
const BASE = process.env.E2E_BASE_URL;
if (!BASE) throw new Error("E2E_BASE_URL must point at a running server");

const get = (path: string) => fetch(`${BASE}${path}`, { redirect: "manual" });
const post = (path: string, body: unknown, method = "POST") =>
  fetch(`${BASE}${path}`, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

describe("pages", () => {
  it("serves the path selection with all 16 paths", async () => {
    const res = await get("/");
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("Learning paths");
    expect((html.match(/href="\/patterns\/\d+"/g) ?? []).length).toBe(16);
  });

  it.each(["/patterns/1", "/patterns/16", "/review", "/stats", "/solutions/valid-palindrome"])("serves %s", async (path) => {
    expect((await get(path)).status).toBe(200);
  });

  it.each(["/patterns/0", "/patterns/abc", "/patterns/99999999999", "/solutions/nope"])("404s for %s", async (path) => {
    expect((await get(path)).status).toBe(404);
  });

  it("serves the service worker uncached and the manifest", async () => {
    const sw = await get("/sw.js");
    expect(sw.status).toBe(200);
    expect(sw.headers.get("cache-control")).toContain("no-store");
    const manifest = await (await get("/manifest.webmanifest")).json();
    expect(manifest.name).toBe("LeetLearn");
  });
});

// E2E files share one seeded database, so these tests only touch path 16
// (other files, e.g. training, rely on path 1 starting out unsolved)
describe("solving through the API", () => {
  async function problemIds() {
    const problems = await prisma.problem.findMany({ where: { pattern: { order: 16 } }, orderBy: { order: "asc" } });
    return problems.map((p) => p.id);
  }

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("rejects a bad body, a locked problem and an unknown id", async () => {
    const ids = await problemIds();
    expect(ids).toHaveLength(10);
    expect((await post(`/api/problems/${ids[0]}/solve`, { solvedUnder15Min: "yes" })).status).toBe(400);
    expect((await post(`/api/problems/${ids[1]}/solve`, { solvedUnder15Min: true })).status).toBe(409);
    expect((await post("/api/problems/00000000-0000-0000-0000-000000000000/solve", { solvedUnder15Min: true })).status).toBe(404);
  });

  it("solves the first problem, counts it toward today's streak and unlocks the next one", async () => {
    const ids = await problemIds();
    const res = await post(`/api/problems/${ids[0]}/solve`, { solvedUnder15Min: true, timeZone: "UTC" });
    expect(res.status).toBe(200);
    const body = await res.json();
    // Whether this is the day's first solve depends on which e2e file ran first
    expect(body).toMatchObject({ isSolved: true, streak: { current: 1, doneToday: true } });
    expect(typeof body.streakExtended).toBe("boolean");
    expect((await post(`/api/problems/${ids[1]}/solve`, { solvedUnder15Min: false })).status).toBe(200);
    expect((await prisma.problem.findUniqueOrThrow({ where: { id: ids[2] } })).unlocked).toBe(true);
  });

  it("validates reminder settings and push subscriptions", async () => {
    expect((await post("/api/streak/settings", { reminderHour: 8 }, "PATCH")).status).toBe(200);
    expect((await post("/api/streak/settings", { reminderHour: 23 }, "PATCH")).status).toBe(400);
    expect((await post("/api/push/subscribe", { subscription: { endpoint: "nope" } })).status).toBe(400);
    expect((await post("/api/push/test", {})).status).toBe(502); // nobody subscribed
  });
});
