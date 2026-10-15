/**
 * Training against a real `next start` server and the seeded database
 * (E2E_BASE_URL and DATABASE_URL are set by scripts/test.sh).
 */
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/db";

const BASE = process.env.E2E_BASE_URL;
const get = (path: string) => fetch(`${BASE}${path}`, { redirect: "manual" });
const post = (path: string, body?: unknown) =>
  fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
const text = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/&#x27;/g, "'").replace(/\s+/g, " ");

let palindromeId: string;
let twoSumId: string;

beforeAll(async () => {
  if (!BASE) throw new Error("E2E_BASE_URL must point at a running `next start`");
  const problems = await prisma.problem.findMany({ where: { pattern: { order: 1 } }, orderBy: { order: "asc" } });
  palindromeId = problems[0].id;
  twoSumId = problems[1].id;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("training end to end", () => {
  it("keeps an unsolved problem's training locked", async () => {
    const res = await get("/train/valid-palindrome");
    expect([303, 307, 308]).toContain(res.status);
    expect(res.headers.get("location")).toContain("/patterns/1");
    expect((await get("/patterns/1/train")).headers.get("location")).toContain("/patterns/1");
  });

  it("opens training once the problem is solved", async () => {
    expect((await post(`/api/problems/${palindromeId}/solve`, { solvedUnder15Min: true, timeZone: "UTC" })).status).toBe(200);
    const res = await get("/train/valid-palindrome");
    expect(res.status).toBe(200);
    const page = text(await res.text());
    expect(page).toContain("Valid Palindrome");
    expect(page).toContain("reads the same forwards and backwards");
    expect(page).toMatch(/0 \/ 10/);
    expect(page).toContain("Check");
  });

  it("offers the pattern mix once a problem is solved", async () => {
    const res = await get("/patterns/1/train");
    expect(res.status).toBe(200);
    expect(text(await res.text())).toMatch(/0 \/ 10/);
  });

  it("shows the Train entry point on the path", async () => {
    const page = text(await (await get("/patterns/1")).text());
    expect(page).toContain("Train 10 random");
  });

  it("refuses to master an unsolved problem", async () => {
    expect((await post(`/api/problems/${twoSumId}/master`)).status).toBe(409);
  });

  it("marks a mastered problem on the path, without touching the streak count", async () => {
    const activityBefore = await prisma.activityDay.findMany();
    const res = await post(`/api/problems/${palindromeId}/master`);
    expect(res.status).toBe(200);
    expect((await res.json()).masteredAt).toEqual(expect.any(String));

    const page = await (await get("/patterns/1")).text();
    expect(page).toContain("(mastered)");
    expect(await prisma.activityDay.findMany()).toEqual(activityBefore);
  });
});
