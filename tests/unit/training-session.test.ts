import { afterEach, describe, expect, it, vi } from "vitest";
import { PATTERNS } from "@/content";
import { getExercises } from "@/content/exercises";
import { getCode } from "@/content/solutions";
import { SESSION_SIZE, patternSession, problemSession, type TrainingItem } from "@/lib/training";

const twoPointers = PATTERNS.find((p) => p.slug === "two-pointers")!;
const palindrome = twoPointers.problems[0];
const ref = (p: { slug: string; title: string }) => ({ slug: p.slug, title: p.title });

const countBy = (items: TrainingItem[]) =>
  items.reduce<Record<string, number>>((acc, i) => ({ ...acc, [i.problemTitle]: (acc[i.problemTitle] ?? 0) + 1 }), {});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("problemSession", () => {
  it("contains each of the problem's 10 exercises exactly once", () => {
    const items = problemSession(ref(palindrome));
    expect(items).toHaveLength(10);
    expect(items.map((i) => i.id).sort()).toEqual(Array.from({ length: 10 }, (_, i) => `valid-palindrome#${i}`).sort());
    const source = getExercises(palindrome.slug)!;
    for (const item of items) {
      const original = source[Number(item.id.split("#")[1])];
      expect(item.prompt).toBe(original.prompt);
      expect(item.kind).toBe(original.kind);
    }
  });

  it("tags every item with the problem's title and summary", () => {
    for (const item of problemSession(ref(palindrome))) {
      expect(item.problemTitle).toBe("Valid Palindrome");
      expect(item.problemSummary).toBe(palindrome.summary);
    }
  });

  it("attaches the full reference solution exactly where an exercise asks for it", () => {
    const source = getExercises(palindrome.slug)!;
    for (const item of problemSession(ref(palindrome))) {
      const original = source[Number(item.id.split("#")[1])];
      if (original.solution) expect(item.code).toBe(getCode(palindrome.slug));
      else expect(item.code).toBe(original.code);
    }
  });

  it("keeps every option of a multiple-choice exercise, with exactly one correct", () => {
    const source = getExercises(palindrome.slug)!;
    for (const item of problemSession(ref(palindrome))) {
      if (item.kind !== "choice") continue;
      const original = source[Number(item.id.split("#")[1])];
      if (original.kind !== "choice") throw new Error("kind changed");
      expect(item.options.map((o) => o.text).sort()).toEqual(original.options.map((o) => o.text).sort());
      expect(item.options.filter((o) => o.correct)).toHaveLength(1);
    }
  });

  it("shuffles the exercise order and the options", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const low = problemSession(ref(palindrome));
    vi.spyOn(Math, "random").mockReturnValue(0.999);
    const high = problemSession(ref(palindrome));
    expect(low.map((i) => i.id)).not.toEqual(high.map((i) => i.id));
    const options = (items: TrainingItem[]) =>
      items.flatMap((i) => (i.kind === "choice" ? [i.options.map((o) => o.text).join("|")] : []));
    expect(options(low).sort()).not.toEqual(options(high).sort());
  });

  it("never reorders the shared content it was built from", () => {
    const before = JSON.stringify(getExercises(palindrome.slug));
    vi.spyOn(Math, "random").mockReturnValue(0);
    problemSession(ref(palindrome));
    expect(JSON.stringify(getExercises(palindrome.slug))).toBe(before);
  });

  it("is empty for a problem without exercises", () => {
    expect(problemSession({ slug: "not-a-problem", title: "Nope" })).toEqual([]);
  });
});

describe("patternSession", () => {
  it(`deals ${SESSION_SIZE} exercises`, () => {
    expect(SESSION_SIZE).toBe(10);
  });

  it("uses all 10 exercises of a single solved problem", () => {
    const items = patternSession([ref(palindrome)]);
    expect(items).toHaveLength(10);
    expect(new Set(items.map((i) => i.id)).size).toBe(10);
  });

  it("spreads exercises evenly over several problems (4/3/3)", () => {
    const items = patternSession(twoPointers.problems.slice(0, 3).map(ref));
    expect(items).toHaveLength(10);
    expect(new Set(items.map((i) => i.id)).size).toBe(10);
    expect(Object.values(countBy(items)).sort()).toEqual([3, 3, 4]);
  });

  it("takes one exercise from each of 10 problems", () => {
    const items = patternSession(twoPointers.problems.map(ref));
    expect(Object.values(countBy(items))).toEqual(Array(10).fill(1));
  });

  it("only uses the problems it's given", () => {
    const given = twoPointers.problems.slice(2, 4);
    const titles = new Set(patternSession(given.map(ref)).map((i) => i.problemTitle));
    expect([...titles].sort()).toEqual(given.map((p) => p.title).sort());
  });

  it("is empty with no problems, and ignores problems without exercises", () => {
    expect(patternSession([])).toEqual([]);
    const items = patternSession([{ slug: "not-a-problem", title: "Nope" }, ref(palindrome)]);
    expect(items).toHaveLength(10);
    expect(new Set(items.map((i) => i.problemTitle))).toEqual(new Set(["Valid Palindrome"]));
  });
});
