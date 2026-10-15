import { describe, expect, it } from "vitest";
import { PATTERNS } from "@/content";
import { getExercises, hasExercises } from "@/content/exercises";
import { matchesAnswer } from "@/content/exercises/answer";
import type { ChoiceExercise, Exercise, TypedExercise } from "@/content/exercises/types";
import { EXERCISES_PER_PROBLEM, MIN_TYPED, validateExercises } from "@/content/exercises/validate";

const typed = (overrides: Partial<TypedExercise> = {}): TypedExercise => ({
  kind: "type",
  prompt: "Fill in the blank.",
  answers: ["x"],
  explanation: "Because.",
  ...overrides,
});

const choice = (overrides: Partial<ChoiceExercise> = {}): ChoiceExercise => ({
  kind: "choice",
  prompt: "Why?",
  options: [
    { text: "Right", correct: true },
    { text: "Wrong", why: "Not this." },
  ],
  explanation: "Because.",
  ...overrides,
});

/** Seven typed + three choice, a valid set for one problem. */
const validSet = (): Exercise[] => [...Array.from({ length: 7 }, () => typed()), ...Array.from({ length: 3 }, () => choice())];

const patterns = [{ slug: "pat", problems: [{ slug: "prob", summary: "What it asks." }] }];

/** Validate a single problem's exercises, after applying `change` to a valid set. */
function errorsFor(change: (set: Exercise[]) => Exercise[]) {
  return validateExercises({ pat: { prob: change(validSet()) } }, patterns);
}

describe("validateExercises", () => {
  it("accepts a valid set", () => {
    expect(errorsFor((s) => s)).toEqual([]);
  });

  it("rejects an exercise file for an unknown pattern", () => {
    expect(validateExercises({ nope: {} }, patterns)).toEqual(['exercise file "nope" matches no pattern']);
  });

  it("requires every problem of a listed pattern to have exercises", () => {
    expect(validateExercises({ pat: {} }, patterns)).toEqual(['no exercises for "prob"']);
  });

  it("rejects exercises for a problem that doesn't exist", () => {
    const errors = validateExercises({ pat: { prob: validSet(), ghost: validSet() } }, patterns);
    expect(errors).toEqual(['exercises "ghost" match no problem']);
  });

  it("requires a summary once a problem has exercises", () => {
    const noSummary = [{ slug: "pat", problems: [{ slug: "prob" }] }];
    expect(validateExercises({ pat: { prob: validSet() } }, noSummary)).toEqual(['"prob" has exercises but no summary']);
  });

  it(`requires exactly ${EXERCISES_PER_PROBLEM} exercises`, () => {
    expect(errorsFor((s) => [...s, typed()])).toContain('"prob" has 11 exercises, expected 10');
    expect(errorsFor((s) => s.slice(1))).toContain('"prob" has 9 exercises, expected 10');
  });

  it(`requires at least ${MIN_TYPED} typed exercises`, () => {
    const set = [...Array.from({ length: 4 }, () => typed()), ...Array.from({ length: 6 }, () => choice())];
    expect(errorsFor(() => set)).toEqual(['"prob" has 4 typed exercises, expected at least 5']);
  });

  it("rejects an empty prompt or explanation", () => {
    expect(errorsFor((s) => [typed({ prompt: " " }), ...s.slice(1)])).toEqual(['"prob"[1]: empty prompt or explanation']);
    expect(errorsFor((s) => [typed({ explanation: "" }), ...s.slice(1)])).toEqual(['"prob"[1]: empty prompt or explanation']);
  });

  it("rejects a snippet and the full solution on the same exercise", () => {
    expect(errorsFor((s) => [typed({ code: "x = ___", solution: true }), ...s.slice(1)])).toEqual([
      '"prob"[1]: has both a snippet and the full solution',
    ]);
  });

  it("requires complexity questions to be multiple choice with the full solution", () => {
    const message = '"prob"[8]: complexity question must be a choice with solution: true';
    const at8 = (e: Exercise) => (s: Exercise[]) => [...s.slice(0, 7), e, ...s.slice(8)];
    expect(errorsFor(at8(choice({ prompt: "What is the time complexity?" })))).toEqual([message]);
    expect(errorsFor(at8(choice({ prompt: "What is the time complexity?", solution: true })))).toEqual([]);
    expect(errorsFor((s) => [typed({ prompt: "What is the space complexity?", solution: true }), ...s.slice(1)])).toEqual([
      '"prob"[1]: complexity question must be a choice with solution: true',
    ]);
  });

  it("requires typed exercises to have a non-empty accepted answer", () => {
    expect(errorsFor((s) => [typed({ answers: [] }), ...s.slice(1)])).toEqual(['"prob"[1]: needs non-empty answers']);
    expect(errorsFor((s) => [typed({ answers: ["  "] }), ...s.slice(1)])).toEqual(['"prob"[1]: needs non-empty answers']);
  });

  it("rejects a listed mistake that would also be accepted", () => {
    const bad = typed({ answers: ["O(n)"], mistakes: [{ answers: ["n"], why: "No." }] });
    expect(errorsFor((s) => [bad, ...s.slice(1)])).toEqual(['"prob"[1]: mistake "n" is also an accepted answer']);
  });

  it("requires every listed mistake to explain itself", () => {
    const bad = typed({ mistakes: [{ answers: ["y"], why: " " }] });
    expect(errorsFor((s) => [bad, ...s.slice(1)])).toEqual(['"prob"[1]: mistake without a why']);
  });

  it("requires exactly one correct option", () => {
    const none = choice({ options: [{ text: "A", why: "a" }, { text: "B", why: "b" }] });
    const two = choice({ options: [{ text: "A", correct: true }, { text: "B", correct: true }] });
    const at8 = (e: Exercise) => (s: Exercise[]) => [...s.slice(0, 7), e, ...s.slice(8)];
    expect(errorsFor(at8(none))).toEqual(['"prob"[8]: has 0 correct options, expected 1']);
    expect(errorsFor(at8(two))).toEqual(['"prob"[8]: has 2 correct options, expected 1']);
  });

  it("requires at least two options", () => {
    const one = choice({ options: [{ text: "A", correct: true }] });
    expect(errorsFor((s) => [...s.slice(0, 7), one, ...s.slice(8)])).toEqual(['"prob"[8]: needs at least 2 options']);
  });

  it("requires every wrong option to explain why it's wrong", () => {
    const silent = choice({ options: [{ text: "A", correct: true }, { text: "B", why: "" }] });
    expect(errorsFor((s) => [...s.slice(0, 7), silent, ...s.slice(8)])).toEqual(['"prob"[8]: wrong option "B" has no why']);
  });

  it("rejects duplicate option texts", () => {
    const dup = choice({ options: [{ text: "A", correct: true }, { text: "A", why: "a" }] });
    expect(errorsFor((s) => [...s.slice(0, 7), dup, ...s.slice(8)])).toEqual(['"prob"[8]: duplicate option text']);
  });
});

/** Same spans Rich renders: code first (it may contain `**`), then bold; nothing may be left over. */
function markupBalanced(text: string) {
  const withoutCode = text.replace(/`[^`]+`/g, "");
  return !withoutCode.includes("`") && (withoutCode.match(/\*\*/g) ?? []).length % 2 === 0;
}

const all = PATTERNS.flatMap((p) =>
  p.problems.flatMap((q) => (getExercises(q.slug) ?? []).map((e, i) => ({ where: `${q.slug}[${i + 1}]`, e }))),
);

describe("the exercise corpus", () => {
  it("covers every problem of every pattern with 10 exercises and a summary", () => {
    for (const p of PATTERNS) {
      for (const q of p.problems) {
        expect(hasExercises(q.slug), q.slug).toBe(true);
        expect(getExercises(q.slug), q.slug).toHaveLength(EXERCISES_PER_PROBLEM);
        expect(q.summary?.trim(), q.slug).toBeTruthy();
      }
    }
    expect(all).toHaveLength(160 * EXERCISES_PER_PROBLEM);
  });

  it("passes the validator", () => {
    const byPattern = Object.fromEntries(
      PATTERNS.map((p) => [p.slug, Object.fromEntries(p.problems.map((q) => [q.slug, getExercises(q.slug)!]))]),
    );
    expect(validateExercises(byPattern, PATTERNS)).toEqual([]);
  });

  it("has nothing for unknown slugs", () => {
    expect(hasExercises("not-a-problem")).toBe(false);
    expect(getExercises("not-a-problem")).toBeUndefined();
  });

  it("accepts each typed exercise's own canonical answer", () => {
    for (const { where, e } of all) {
      if (e.kind === "type") expect(matchesAnswer(e.answers[0], e.answers), where).toBe(true);
    }
  });

  it("has a blank in every snippet that asks to fill one in", () => {
    for (const { where, e } of all) {
      if (/fill in/i.test(e.prompt)) expect(e.code, where).toMatch(/_{3,}/);
    }
  });

  it("uses balanced `code` and **bold** markup everywhere", () => {
    for (const { where, e } of all) {
      const texts = [e.prompt, e.explanation];
      if (e.kind === "type") texts.push(...(e.mistakes ?? []).map((m) => m.why));
      else texts.push(...e.options.flatMap((o) => [o.text, o.correct ? "" : o.why]));
      for (const text of texts) expect(markupBalanced(text), `${where}: ${text}`).toBe(true);
    }
    for (const p of PATTERNS) for (const q of p.problems) expect(markupBalanced(q.summary!), q.slug).toBe(true);
  });
});
