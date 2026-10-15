import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";
import ProblemTrainingPage, { generateMetadata } from "@/app/train/[slug]/page";
import PatternTrainingPage from "@/app/patterns/[order]/train/page";
import type { MasteryTarget } from "@/components/training/TrainingSession";
import type { TrainingItem } from "@/lib/training";
import { slugFromUrl } from "@/content/solutions";
import { getPattern } from "@/lib/queries";
import { prisma } from "@/lib/db";
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
const SOLVED_AT = new Date("2024-05-01T10:00:00Z");

type SessionProps = { items: TrainingItem[]; title: string; backHref: string; mastery?: MasteryTarget };
const propsOf = (element: unknown) => (element as ReactElement<SessionProps>).props;

describe("/train/[slug] (one problem)", () => {
  it("is a 404 for an unknown problem", async () => {
    await insertPatterns(1);
    expect(await digestOf(() => ProblemTrainingPage(params({ slug: "not-a-problem" })))).toMatch(/404/);
  });

  it("sends an unsolved problem back to its path", async () => {
    await insertPatterns(1);
    const digest = await digestOf(() => ProblemTrainingPage(params({ slug: "valid-palindrome" })));
    expect(digest).toMatch(/^NEXT_REDIRECT/);
    expect(digest).toContain("/patterns/1");
  });

  it("serves the problem's 10 exercises once it's solved, with a mastery target", async () => {
    const [p] = await insertPatterns(1);
    await markSolved(p.problems[0].id, SOLVED_AT);
    const props = propsOf(await ProblemTrainingPage(params({ slug: "valid-palindrome" })));

    expect(props.title).toBe("Valid Palindrome");
    expect(props.backHref).toBe("/patterns/1");
    expect(props.items).toHaveLength(10);
    expect(new Set(props.items.map((i) => i.problemTitle))).toEqual(new Set(["Valid Palindrome"]));
    expect(props.mastery).toEqual({ problemId: p.problems[0].id, alreadyMastered: false });
  });

  it("tells the session when the problem is already mastered", async () => {
    const [p] = await insertPatterns(1);
    await markSolved(p.problems[0].id, SOLVED_AT);
    await prisma.problem.update({ where: { id: p.problems[0].id }, data: { trainingMasteredAt: SOLVED_AT } });
    const props = propsOf(await ProblemTrainingPage(params({ slug: "valid-palindrome" })));
    expect(props.mastery).toEqual({ problemId: p.problems[0].id, alreadyMastered: true });
  });

  it("works for a problem in a later path", async () => {
    const [, second] = await insertPatterns(2);
    await markSolved(second.problems[3].id, SOLVED_AT);
    const slug = slugFromUrl(second.problems[3].leetcodeUrl);
    const props = propsOf(await ProblemTrainingPage(params({ slug })));
    expect(props.backHref).toBe("/patterns/2");
    expect(props.mastery?.problemId).toBe(second.problems[3].id);
  });

  it("reshuffles on every visit", async () => {
    const [p] = await insertPatterns(1);
    await markSolved(p.problems[0].id, SOLVED_AT);
    const orders = new Set<string>();
    for (let i = 0; i < 5; i++) {
      const props = propsOf(await ProblemTrainingPage(params({ slug: "valid-palindrome" })));
      orders.add(props.items.map((item) => item.id).join(","));
    }
    expect(orders.size).toBeGreaterThan(1);
  });

  it("titles the page after the problem", async () => {
    expect(await generateMetadata(params({ slug: "valid-palindrome" }))).toEqual({ title: "Train: Valid Palindrome · LeetLearn" });
    expect(await generateMetadata(params({ slug: "nope" }))).toEqual({ title: "LeetLearn" });
  });
});

describe("/patterns/[order]/train (pattern mix)", () => {
  it.each(["abc", "1.5", "99"])("is a 404 for the order %j", async (order) => {
    await insertPatterns(1);
    expect(await digestOf(() => PatternTrainingPage(params({ order })))).toMatch(/404/);
  });

  it("sends the user back to the path when nothing is solved yet", async () => {
    await insertPatterns(1);
    const digest = await digestOf(() => PatternTrainingPage(params({ order: "1" })));
    expect(digest).toMatch(/^NEXT_REDIRECT/);
    expect(digest).toContain("/patterns/1");
  });

  it("deals 10 exercises from solved problems only, without a mastery target", async () => {
    const [p] = await insertPatterns(1);
    await markSolved(p.problems[0].id, SOLVED_AT);
    await markSolved(p.problems[1].id, SOLVED_AT);
    const props = propsOf(await PatternTrainingPage(params({ order: "1" })));

    expect(props.title).toBe("Two Pointers mix");
    expect(props.items).toHaveLength(10);
    expect(new Set(props.items.map((i) => i.problemTitle))).toEqual(
      new Set([p.problems[0].title, p.problems[1].title]),
    );
    expect(props.mastery).toBeUndefined();
  });
});

describe("problem views", () => {
  it("report exercises for every problem and mastery only once recorded", async () => {
    const [p] = await insertPatterns(1);
    await markSolved(p.problems[0].id, SOLVED_AT);
    await prisma.problem.update({ where: { id: p.problems[0].id }, data: { trainingMasteredAt: SOLVED_AT } });
    const view = await getPattern(1);
    expect(view!.problems.every((q) => q.hasExercises)).toBe(true);
    expect(view!.problems.map((q) => q.mastered)).toEqual([true, ...Array(9).fill(false)]);
  });
});
