import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import Home from "@/app/page";
import PatternPage from "@/app/patterns/[order]/page";
import ReviewPage from "@/app/review/page";
import SolutionPage, { generateMetadata, generateStaticParams } from "@/app/solutions/[slug]/page";
import { prisma } from "@/lib/db";
import { PATTERNS } from "@/content";
import { getCode, getSolution } from "@/content/solutions";
import { insertPatterns, markSolved } from "../helpers/db";

/** Next signals redirect / notFound by throwing an error with a `digest`. */
async function digestOf(fn: () => Promise<unknown>) {
  try {
    await fn();
  } catch (e) {
    const digest = (e as { digest?: string }).digest;
    if (digest) return digest;
    throw e;
  }
  return null;
}

const params = <T,>(p: T) => ({ params: Promise.resolve(p) });
const decode = (html: string) =>
  html.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/<!-- -->/g, "");
/** Visible text only, so assertions don't depend on markup or syntax-highlighting spans. */
const textOf = (html: string) =>
  decode(html.replace(/<[^>]+>/g, "")).replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const STALE_ROTATION = new Date("2020-01-04T00:00:00Z");

describe("/ (path selection)", () => {
  const render = async () => decode(renderToString(await Home()));

  it("explains how to seed when the database is empty", async () => {
    const html = await render();
    expect(html).toContain("No learning paths yet");
    expect(html).toContain("npx prisma db seed");
  });

  it("shows one tile per path, linking to it, in order", async () => {
    await insertPatterns(3);
    const html = await render();
    const links = [...html.matchAll(/href="(\/patterns\/\d+)"/g)].map((m) => m[1]);
    expect(links).toEqual(["/patterns/1", "/patterns/2", "/patterns/3"]);
    for (const p of PATTERNS.slice(0, 3)) expect(html).toContain(p.name);
  });

  it("highlights the first path that still has unsolved problems", async () => {
    const [a] = await insertPatterns(3);
    for (const p of a.problems) await markSolved(p.id, new Date());
    const html = await render();
    expect(html).toContain(`Path 1: ${PATTERNS[0].name}, 10 of 10 solved, complete`);
    // "Continue" sits on path 2 only
    expect((html.match(/>Continue</g) ?? []).length).toBe(1);
    expect(html.indexOf(">Continue<")).toBeGreaterThan(html.indexOf(`Path 2: ${PATTERNS[1].name}`));
    expect(html.indexOf(">Continue<")).toBeLessThan(html.indexOf(`Path 3: ${PATTERNS[2].name}`));
  });

  it("flags no path once everything is solved", async () => {
    const patterns = await insertPatterns(2);
    for (const p of patterns.flatMap((x) => x.problems)) await markSolved(p.id, new Date());
    expect(await render()).not.toContain(">Continue<");
  });

  it("links to the review page and counts what is waiting", async () => {
    const [a] = await insertPatterns(1);
    await markSolved(a.problems[0].id, new Date(), { inReview: true });
    await markSolved(a.problems[1].id, new Date(), { inReview: true });
    await prisma.reviewSystemState.create({ data: { id: 1, lastRotatedAt: new Date() } });
    const html = await render();
    expect(html).toContain('href="/review"');
    expect(html).toContain("2 to review");
  });

  it("says the review is caught up when the queue is empty", async () => {
    await insertPatterns(1);
    await prisma.reviewSystemState.create({ data: { id: 1, lastRotatedAt: new Date() } });
    expect(await render()).toContain("All caught up!");
  });

  it("shows total progress in the header", async () => {
    const [a, b] = await insertPatterns(2);
    await markSolved(a.problems[0].id, new Date());
    await markSolved(b.problems[0].id, new Date());
    expect(await render()).toMatch(/2<span[^>]*>\/ 20<\/span>/);
  });

  it("runs a due review rotation on load (safety net for a missed cron)", async () => {
    const [a] = await insertPatterns(1);
    await markSolved(a.problems[0].id, new Date("2024-01-01T00:00:00Z"));
    await prisma.reviewSystemState.create({ data: { id: 1, lastRotatedAt: STALE_ROTATION } });
    expect(await render()).toContain("1 to review");
    expect((await prisma.problem.findUniqueOrThrow({ where: { id: a.problems[0].id } })).inReview).toBe(true);
  });

  it("does not rotate again within the same week", async () => {
    const [a] = await insertPatterns(1);
    await markSolved(a.problems[0].id, new Date("2024-01-01T00:00:00Z"));
    await prisma.reviewSystemState.create({ data: { id: 1, lastRotatedAt: new Date() } });
    await render();
    expect((await prisma.problem.findUniqueOrThrow({ where: { id: a.problems[0].id } })).inReview).toBe(false);
  });

  it("creates VAPID keys on first render so the client can subscribe", async () => {
    vi.stubEnv("VAPID_PUBLIC_KEY", "");
    vi.stubEnv("VAPID_PRIVATE_KEY", "");
    await insertPatterns(1);
    await render();
    expect((await prisma.appSettings.findUniqueOrThrow({ where: { id: 1 } })).vapidPublicKey).toMatch(/^[A-Za-z0-9_-]{80,}$/);
  });
});

describe("/review", () => {
  const render = async () => decode(renderToString(await ReviewPage()));

  it("shows the empty state when nothing is due", async () => {
    await insertPatterns(1);
    await prisma.reviewSystemState.create({ data: { id: 1, lastRotatedAt: new Date() } });
    const html = await render();
    expect(html).toContain("Saturday Review");
    expect(html).toContain("Spaced repetition · 0/5");
    expect(html).toContain("All caught up!");
    expect(html).toContain('href="/"'); // back to paths
  });

  it("lists every problem in the queue with its path", async () => {
    const [a, b] = await insertPatterns(2);
    await markSolved(a.problems[2].id, new Date("2024-01-01T00:00:00Z"), { inReview: true });
    await markSolved(b.problems[0].id, new Date("2024-01-02T00:00:00Z"), { inReview: true, under15: false });
    await prisma.reviewSystemState.create({ data: { id: 1, lastRotatedAt: new Date() } });
    const html = await render();
    expect(html).toContain("Spaced repetition · 2/5");
    expect(html).toContain(`${PATTERNS[0].problems[2].title} · ${PATTERNS[0].name}`);
    expect(html).toContain(`${PATTERNS[1].problems[0].title} · ${PATTERNS[1].name}`);
    expect((html.match(/Over 15 minutes last time/g) ?? []).length).toBe(1);
  });

  it("fills the queue on load when this week's rotation is due", async () => {
    const [a] = await insertPatterns(1);
    for (let i = 0; i < 7; i++) await markSolved(a.problems[i].id, new Date(Date.UTC(2024, 0, i + 1)));
    await prisma.reviewSystemState.create({ data: { id: 1, lastRotatedAt: STALE_ROTATION } });
    expect(await render()).toContain("Spaced repetition · 5/5");
  });
});

describe("/patterns/[order]", () => {
  const render = async (order: string) => decode(renderToString(await PatternPage(params({ order }))));

  it.each(["abc", "1.5", "", "1e1x", "NaN", "Infinity"])("is a 404 for the non-integer order %j", async (order) => {
    await insertPatterns(1);
    expect(await digestOf(() => PatternPage(params({ order })))).toMatch(/404/);
  });

  it.each(["0", "-1", "17", "99"])("is a 404 for the unknown path %j", async (order) => {
    await insertPatterns(1);
    expect(await digestOf(() => PatternPage(params({ order })))).toMatch(/404/);
  });

  it.each(["99999999999", "2147483648", "-99999999999"])(
    "is a 404 (not a server error) for %s, which is too large for the database",
    async (order) => {
      await insertPatterns(1);
      expect(await digestOf(() => PatternPage(params({ order })))).toMatch(/404/);
    },
  );

  it("renders the path header, a way back, and all 10 nodes in their initial state", async () => {
    await insertPatterns(2);
    const html = await render("1");
    expect(html).toContain(PATTERNS[0].name);
    expect(html).toContain(PATTERNS[0].description);
    expect(html).toContain("Path 1 · 0/10 solved");
    expect(html).toContain("Back to paths");
    for (const p of PATTERNS[0].problems) expect(html).toContain(p.title);
    expect((html.match(/\(locked\)/g) ?? []).length).toBe(9);
    expect((html.match(/\(available\)/g) ?? []).length).toBe(1);
    expect(html).not.toContain(PATTERNS[1].problems[0].title);
  });

  it("reflects progress in the header, the path and the node states", async () => {
    const [a, b] = await insertPatterns(2);
    await markSolved(a.problems[0].id, new Date());
    await markSolved(a.problems[1].id, new Date(), { under15: false });
    await prisma.problem.update({ where: { id: a.problems[2].id }, data: { unlocked: true } });
    await markSolved(b.problems[0].id, new Date());
    const html = await render("1");
    expect(html).toContain("Path 1 · 2/10 solved");
    expect(html).toMatch(/3<span[^>]*>\/ 20<\/span>/);
    expect((html.match(/\(completed\)/g) ?? []).length).toBe(2);
    expect((html.match(/\(available\)/g) ?? []).length).toBe(1);
    expect((html.match(/Took longer than 15 minutes/g) ?? []).length).toBe(1);
  });

  it("parses orders with a leading zero like Number() does", async () => {
    await insertPatterns(1);
    expect(await render("01")).toContain(PATTERNS[0].name);
  });
});

describe("/solutions/[slug]", () => {
  const render = async (slug: string) => decode(renderToString(await SolutionPage(params({ slug }))));

  it("pre-renders a page for each of the 160 problems", () => {
    const slugs = generateStaticParams().map((p) => p.slug);
    expect(slugs).toHaveLength(160);
    expect(new Set(slugs).size).toBe(160);
  });

  it("titles the page after the problem", async () => {
    expect(await generateMetadata(params({ slug: "3sum" }))).toEqual({ title: "3Sum · LeetLearn" });
    expect(await generateMetadata(params({ slug: "nope" }))).toEqual({ title: "LeetLearn" });
  });

  it.each(["nope", "", "VALID-PALINDROME", "two-pointers"])("is a 404 for %j", async (slug) => {
    expect(await digestOf(() => SolutionPage(params({ slug })))).toMatch(/404/);
  });

  it("renders the idea, every step, the code, complexity and pitfalls", async () => {
    const slug = "valid-palindrome";
    const s = getSolution(slug)!;
    const html = await render(slug);
    const text = textOf(html);
    expect(text).toContain("Valid Palindrome");
    expect(text).toContain("Two Pointers · #1");
    expect(html).toContain('href="https://leetcode.com/problems/valid-palindrome/"');
    expect(html).toContain('href="/patterns/1"');
    expect(text).toContain("The idea");
    expect((html.match(/<li class="flex gap-4">/g) ?? []).length).toBe(s.steps.length);
    expect(text).toContain("def isPalindrome(self, s: str) -> bool:");
    expect(text).toContain(s.time);
    expect(text).toContain("Watch out for");
  });

  it("opens external links in a new tab without leaking the opener", async () => {
    const html = await render("3sum");
    const external = html.match(/<a [^>]*href="https:[^"]*"[^>]*>/g) ?? [];
    expect(external.length).toBeGreaterThanOrEqual(2);
    for (const a of external) {
      expect(a).toContain('target="_blank"');
      expect(a).toContain('rel="noopener noreferrer"');
    }
  });

  it("renders every one of the 160 solution pages with the full code intact", async () => {
    for (const p of PATTERNS) {
      for (const [i, q] of p.problems.entries()) {
        const html = await render(q.slug);
        const text = textOf(html);
        expect(text, q.slug).toContain(`${p.name} · #${i + 1}`);
        expect(html, q.slug).not.toContain("NaN");
        // Highlighting must not drop or alter a single character of the code
        expect(text, q.slug).toContain(getCode(q.slug)!);
      }
    }
  });
});
