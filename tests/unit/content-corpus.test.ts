import { describe, expect, it } from "vitest";
import { PATTERNS, PROBLEM_COUNT, findProblem } from "@/content";
import { DIFFICULTY_LADDER } from "@/content/schema";

const allProblems = PATTERNS.flatMap((p) => p.problems.map((q, i) => ({ pattern: p, problem: q, order: i + 1 })));

describe("PATTERNS (the shipped corpus)", () => {
  it("has 16 patterns sorted by order 1..16", () => {
    expect(PATTERNS.map((p) => p.order)).toEqual(Array.from({ length: 16 }, (_, i) => i + 1));
  });

  it("has 160 problems in total", () => {
    expect(PROBLEM_COUNT).toBe(160);
    expect(allProblems).toHaveLength(160);
  });

  it("follows the difficulty ladder in every pattern", () => {
    for (const p of PATTERNS) {
      expect(p.problems.map((q) => q.difficulty), p.slug).toEqual([...DIFFICULTY_LADDER]);
    }
  });

  it("has unique pattern slugs and names", () => {
    expect(new Set(PATTERNS.map((p) => p.slug)).size).toBe(16);
    expect(new Set(PATTERNS.map((p) => p.name)).size).toBe(16);
  });

  it("has globally unique problem slugs (solutions and exercises are keyed by slug)", () => {
    const seen = new Map<string, string>();
    const dupes: string[] = [];
    for (const { pattern, problem } of allProblems) {
      if (seen.has(problem.slug)) dupes.push(`${problem.slug} in ${seen.get(problem.slug)} and ${pattern.slug}`);
      seen.set(problem.slug, pattern.slug);
    }
    expect(dupes).toEqual([]);
  });

  it("has globally unique problem titles", () => {
    const titles = allProblems.map((x) => x.problem.title);
    expect(titles.length - new Set(titles).size).toBe(0);
  });

  it("uses the canonical https://leetcode.com/problems/<slug>/ URL for every problem", () => {
    for (const { problem } of allProblems) {
      expect(problem.leetcodeUrl).toBe(`https://leetcode.com/problems/${problem.slug}/`);
    }
  });

  it("has no blank or padded text fields", () => {
    for (const p of PATTERNS) {
      expect(p.name.trim()).toBe(p.name);
      expect(p.description.trim().length).toBeGreaterThan(20);
      for (const q of p.problems) {
        expect(q.title.trim(), q.slug).toBe(q.title);
        expect(q.title.length).toBeGreaterThan(0);
        if (q.summary !== undefined) expect(q.summary.trim().length, q.slug).toBeGreaterThan(10);
      }
    }
  });

  it("has balanced `code` and **bold** markup in summaries", () => {
    for (const { problem } of allProblems) {
      if (!problem.summary) continue;
      const withoutCode = problem.summary.replace(/`[^`]+`/g, "");
      expect(withoutCode, problem.slug).not.toContain("`");
      expect((withoutCode.match(/\*\*/g) ?? []).length % 2, problem.slug).toBe(0);
    }
  });
});

describe("findProblem", () => {
  it("finds every problem with its pattern and 1-based order", () => {
    for (const { pattern, problem, order } of allProblems) {
      const found = findProblem(problem.slug);
      expect(found?.pattern.slug).toBe(pattern.slug);
      expect(found?.problem).toBe(problem);
      expect(found?.order).toBe(order);
    }
  });

  it("finds the first and last problem of the corpus", () => {
    const first = PATTERNS[0].problems[0];
    const last = PATTERNS[15].problems[9];
    expect(findProblem(first.slug)?.order).toBe(1);
    expect(findProblem(last.slug)?.order).toBe(10);
    expect(findProblem(last.slug)?.pattern.order).toBe(16);
  });

  it.each(["", "does-not-exist", "Valid-Palindrome", " valid-palindrome", "valid-palindrome/", "two-pointers"])(
    "returns null for %j",
    (slug) => {
      expect(findProblem(slug)).toBeNull();
    },
  );
});
