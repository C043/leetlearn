import { describe, expect, it } from "vitest";
import {
  DIFFICULTY_LADDER,
  PATTERN_COUNT,
  PROBLEMS_PER_PATTERN,
  assertCorpusValid,
  corpusSchema,
  patternSchema,
  problemSchema,
  type Corpus,
} from "@/content/schema";

/** A minimal valid corpus, generated so every rule holds. */
function validCorpus(): Corpus {
  return Array.from({ length: PATTERN_COUNT }, (_, p) => ({
    slug: `pattern-${p + 1}`,
    name: `Pattern ${p + 1}`,
    description: "desc",
    order: p + 1,
    problems: DIFFICULTY_LADDER.map((difficulty, i) => {
      const slug = `p${p + 1}-problem-${i + 1}`;
      return { slug, title: `Problem ${i + 1}`, leetcodeUrl: `https://leetcode.com/problems/${slug}/`, difficulty };
    }),
  }));
}

function errorOf(fn: () => void): string {
  try {
    fn();
  } catch (e) {
    return (e as Error).message;
  }
  throw new Error("expected a throw");
}

describe("constants", () => {
  it("encode the 16 x 10 path layout with a 2 Easy / 7 Medium / 1 Hard ladder", () => {
    expect(PATTERN_COUNT).toBe(16);
    expect(PROBLEMS_PER_PATTERN).toBe(10);
    expect(DIFFICULTY_LADDER).toEqual([
      "EASY", "EASY", "MEDIUM", "MEDIUM", "MEDIUM", "MEDIUM", "MEDIUM", "MEDIUM", "MEDIUM", "HARD",
    ]);
  });
});

describe("problemSchema", () => {
  const ok = {
    slug: "two-sum",
    title: "Two Sum",
    leetcodeUrl: "https://leetcode.com/problems/two-sum/",
    difficulty: "EASY",
  };

  it("accepts a valid problem, with or without optional fields", () => {
    expect(problemSchema.safeParse(ok).success).toBe(true);
    expect(problemSchema.safeParse({ ...ok, order: 3, summary: "s" }).success).toBe(true);
  });

  it.each(["Two-Sum", "two_sum", "two sum", "-two-sum", "two-sum-", "two--sum", "", "twö-sum"])(
    "rejects the non-kebab-case slug %j",
    (slug) => {
      expect(problemSchema.safeParse({ ...ok, slug }).success).toBe(false);
    },
  );

  it.each(["3sum", "a", "4sum-ii", "utf-8-validation"])("accepts the kebab-case slug %j", (slug) => {
    expect(problemSchema.safeParse({ ...ok, slug }).success).toBe(true);
  });

  it.each([
    "http://leetcode.com/problems/two-sum/",
    "https://leetcode.cn/problems/two-sum/",
    "https://evil.com/https://leetcode.com/problems/two-sum/",
    "https://leetcode.com/problem/two-sum/",
    "leetcode.com/problems/two-sum/",
    "not a url",
  ])("rejects the URL %j", (leetcodeUrl) => {
    expect(problemSchema.safeParse({ ...ok, leetcodeUrl }).success).toBe(false);
  });

  it.each(["easy", "Medium", "EXPERT", "", null])("rejects the difficulty %j", (difficulty) => {
    expect(problemSchema.safeParse({ ...ok, difficulty }).success).toBe(false);
  });

  it("rejects an empty title or summary and a fractional order", () => {
    expect(problemSchema.safeParse({ ...ok, title: "" }).success).toBe(false);
    expect(problemSchema.safeParse({ ...ok, summary: "" }).success).toBe(false);
    expect(problemSchema.safeParse({ ...ok, order: 1.5 }).success).toBe(false);
  });

  it("rejects missing required fields", () => {
    for (const key of ["slug", "title", "leetcodeUrl", "difficulty"] as const) {
      const rest: Record<string, unknown> = { ...ok };
      delete rest[key];
      expect(problemSchema.safeParse(rest).success, key).toBe(false);
    }
  });
});

describe("patternSchema", () => {
  const base = validCorpus()[0];

  it.each([0, 17, -1, 2.5])("rejects the out-of-range order %j", (order) => {
    expect(patternSchema.safeParse({ ...base, order }).success).toBe(false);
  });

  it.each([1, 16])("accepts the boundary order %j", (order) => {
    expect(patternSchema.safeParse({ ...base, order }).success).toBe(true);
  });

  it("requires exactly 10 problems", () => {
    expect(patternSchema.safeParse({ ...base, problems: base.problems.slice(0, 9) }).success).toBe(false);
    expect(patternSchema.safeParse({ ...base, problems: [...base.problems, base.problems[0]] }).success).toBe(false);
    expect(patternSchema.safeParse({ ...base, problems: [] }).success).toBe(false);
  });

  it("rejects an empty name or description", () => {
    expect(patternSchema.safeParse({ ...base, name: "" }).success).toBe(false);
    expect(patternSchema.safeParse({ ...base, description: "" }).success).toBe(false);
  });
});

describe("corpusSchema", () => {
  it("requires exactly 16 patterns", () => {
    const corpus = validCorpus();
    expect(corpusSchema.safeParse(corpus).success).toBe(true);
    expect(corpusSchema.safeParse(corpus.slice(1)).success).toBe(false);
    expect(corpusSchema.safeParse([...corpus, corpus[0]]).success).toBe(false);
    expect(corpusSchema.safeParse([]).success).toBe(false);
  });
});

describe("assertCorpusValid", () => {
  it("accepts a valid corpus", () => {
    expect(() => assertCorpusValid(validCorpus())).not.toThrow();
  });

  it("accepts problems whose explicit order matches their position", () => {
    const corpus = validCorpus();
    corpus[0].problems.forEach((p, i) => (p.order = i + 1));
    expect(() => assertCorpusValid(corpus)).not.toThrow();
  });

  it("rejects a duplicate pattern order", () => {
    const corpus = validCorpus();
    corpus[5].order = 3;
    expect(errorOf(() => assertCorpusValid(corpus))).toContain("duplicate pattern order 3");
  });

  it("rejects a duplicate pattern slug", () => {
    const corpus = validCorpus();
    corpus[7].slug = "pattern-2";
    expect(errorOf(() => assertCorpusValid(corpus))).toContain('duplicate pattern slug "pattern-2"');
  });

  it.each([0, 1, 2, 8, 9])("rejects a wrong difficulty in slot %i", (slot) => {
    const corpus = validCorpus();
    const expected = DIFFICULTY_LADDER[slot];
    corpus[0].problems[slot].difficulty = expected === "HARD" ? "MEDIUM" : "HARD";
    expect(errorOf(() => assertCorpusValid(corpus))).toMatch(
      new RegExp(`pattern-1\\[${slot + 1}\\].*expected ${expected}`),
    );
  });

  it("rejects a problem whose order disagrees with its position", () => {
    const corpus = validCorpus();
    corpus[2].problems[4].order = 7;
    expect(errorOf(() => assertCorpusValid(corpus))).toContain("order 7 does not match position 5");
  });

  it("rejects a duplicate slug within one pattern", () => {
    const corpus = validCorpus();
    const dup = corpus[0].problems[2];
    corpus[0].problems[3] = { ...corpus[0].problems[3], slug: dup.slug, leetcodeUrl: dup.leetcodeUrl };
    expect(errorOf(() => assertCorpusValid(corpus))).toContain("duplicate slug within pattern");
  });

  it("rejects a URL that points at a different problem than the slug", () => {
    const corpus = validCorpus();
    corpus[1].problems[0].leetcodeUrl = "https://leetcode.com/problems/something-else/";
    expect(errorOf(() => assertCorpusValid(corpus))).toContain('URL does not match slug "p2-problem-1"');
  });

  it("does not accept a URL that merely starts with the slug", () => {
    const corpus = validCorpus();
    const p = corpus[1].problems[0];
    p.leetcodeUrl = `https://leetcode.com/problems/${p.slug}-ii/`;
    expect(errorOf(() => assertCorpusValid(corpus))).toContain("URL does not match slug");
  });

  it("reports every problem at once, one per line", () => {
    const corpus = validCorpus();
    corpus[1].order = 1;
    corpus[3].problems[0].difficulty = "HARD";
    corpus[4].problems[9].leetcodeUrl = "https://leetcode.com/problems/x/";
    const message = errorOf(() => assertCorpusValid(corpus));
    expect(message.startsWith("Invalid content corpus:")).toBe(true);
    expect(message.split("\n  - ")).toHaveLength(4);
  });
});
