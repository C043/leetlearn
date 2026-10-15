import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import Home from "@/app/page";
import PatternPage from "@/app/patterns/[order]/page";
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
const decode = (html: string) => html.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/<!-- -->/g, "");

describe("/ (home)", () => {
  it("explains how to seed when the database is empty", async () => {
    const html = renderToString(await Home());
    expect(html).toContain("No learning paths yet");
    expect(html).toContain("npx prisma db seed");
  });

  it("redirects to the first path", async () => {
    await insertPatterns(3);
    expect(await digestOf(() => Home())).toMatch(/^NEXT_REDIRECT;\w+;\/patterns\/1;307;/);
  });

  it("skips paths that are fully solved", async () => {
    const [a, b] = await insertPatterns(3);
    for (const p of [...a.problems, ...b.problems]) await markSolved(p.id, new Date());
    expect(await digestOf(() => Home())).toContain(";/patterns/3;");
  });

  it("falls back to the first path when everything is solved", async () => {
    const patterns = await insertPatterns(2);
    for (const p of patterns.flatMap((x) => x.problems)) await markSolved(p.id, new Date());
    expect(await digestOf(() => Home())).toContain(";/patterns/1;");
  });

  it("stays on a path that is only partly solved", async () => {
    const [a] = await insertPatterns(2);
    await markSolved(a.problems[0].id, new Date());
    expect(await digestOf(() => Home())).toContain(";/patterns/1;");
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

  it("is a 404 (not a server error) for a number too large for the database", async () => {
    await insertPatterns(1);
    expect(await digestOf(() => PatternPage(params({ order: "99999999999" })))).toMatch(/404/);
  });

  it("renders the path header, all 10 nodes, the switcher and the review panel", async () => {
    await insertPatterns(2);
    const html = await render("1");
    expect(html).toContain(PATTERNS[0].name);
    expect(html).toContain(PATTERNS[0].description);
    expect(html).toContain("Path 1 · 0/10 solved");
    for (const p of PATTERNS[0].problems) expect(html).toContain(p.title);
    expect(html).toContain(PATTERNS[1].name); // in the switcher
    expect(html).toContain("Saturday Review");
    expect((html.match(/\(locked\)/g) ?? []).length).toBe(9);
    expect((html.match(/\(available\)/g) ?? []).length).toBe(1);
  });

  it("shows progress counts across the header and the path", async () => {
    const [a, b] = await insertPatterns(2);
    await markSolved(a.problems[0].id, new Date());
    await markSolved(a.problems[1].id, new Date());
    await markSolved(b.problems[0].id, new Date());
    const html = await render("1");
    expect(html).toContain("Path 1 · 2/10 solved");
    expect(html).toMatch(/3<span[^>]*>\/ 20<\/span>/);
  });

  it("parses orders with a leading zero or whitespace like Number() does", async () => {
    await insertPatterns(1);
    expect(await render("01")).toContain(PATTERNS[0].name);
  });

  it("runs a due review rotation on page load (safety net for a missed cron)", async () => {
    const [a] = await insertPatterns(1);
    await markSolved(a.problems[0].id, new Date("2024-01-01T00:00:00Z"));
    await prisma.reviewSystemState.create({ data: { id: 1, lastRotatedAt: new Date("2020-01-04T00:00:00Z") } });
    const html = await render("1");
    expect(html).toContain("1/5");
    expect((await prisma.problem.findUniqueOrThrow({ where: { id: a.problems[0].id } })).inReview).toBe(true);
  });

  it("does not rotate again when this week's rotation already happened", async () => {
    const [a] = await insertPatterns(1);
    await markSolved(a.problems[0].id, new Date("2024-01-01T00:00:00Z"));
    await prisma.reviewSystemState.create({ data: { id: 1, lastRotatedAt: new Date() } });
    await render("1");
    expect((await prisma.problem.findUniqueOrThrow({ where: { id: a.problems[0].id } })).inReview).toBe(false);
  });

  it("creates VAPID keys on first render so the client can subscribe", async () => {
    vi.stubEnv("VAPID_PUBLIC_KEY", "");
    vi.stubEnv("VAPID_PRIVATE_KEY", "");
    await insertPatterns(1);
    await render("1");
    expect((await prisma.appSettings.findUniqueOrThrow({ where: { id: 1 } })).vapidPublicKey).toMatch(/^[A-Za-z0-9_-]{80,}$/);
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
    expect(html).toContain("Valid Palindrome");
    expect(html).toContain("Two Pointers · #1");
    expect(html).toContain('href="https://leetcode.com/problems/valid-palindrome/"');
    expect(html).toContain('href="/patterns/1"');
    expect(html).toContain("The idea");
    expect((html.match(/<li class="flex gap-4">/g) ?? []).length).toBe(s.steps.length);
    expect(html).toContain("def isPalindrome");
    expect(html).toContain(s.time);
    expect(html).toContain("Watch out for");
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

  it("renders every one of the 160 solution pages without throwing", async () => {
    for (const p of PATTERNS) {
      for (const [i, q] of p.problems.entries()) {
        const html = await render(q.slug);
        expect(html, q.slug).toContain(`${p.name} · #${i + 1}`);
        expect(html, q.slug).not.toContain("NaN");
        // The full code survives highlighting
        const text = html.replace(/<[^>]+>/g, "").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
        expect(text, q.slug).toContain(getCode(q.slug)!.split("\n")[0]);
      }
    }
  });
});
