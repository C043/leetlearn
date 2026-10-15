import { normalizeAnswer } from "./answer";
import type { Exercise } from "./types";

export const EXERCISES_PER_PROBLEM = 10;
/** Typing is the point of the mode; multiple choice is for "why" and complexity questions. */
export const MIN_TYPED = 5;

interface PatternShape {
  slug: string;
  problems: { slug: string; summary?: string }[];
}

/**
 * Every rule the exercise corpus must follow, as a list of readable errors
 * (empty when valid). Pure, so each rule can be tested with a failing case.
 */
export function validateExercises(
  byPattern: Record<string, Record<string, Exercise[]>>,
  patterns: PatternShape[],
): string[] {
  const errors: string[] = [];
  const problems = new Map(patterns.flatMap((p) => p.problems.map((q) => [q.slug, q] as const)));

  for (const [patternSlug, exercisesBySlug] of Object.entries(byPattern)) {
    const pattern = patterns.find((p) => p.slug === patternSlug);
    if (!pattern) {
      errors.push(`exercise file "${patternSlug}" matches no pattern`);
      continue;
    }
    for (const problem of pattern.problems) {
      if (!exercisesBySlug[problem.slug]) errors.push(`no exercises for "${problem.slug}"`);
    }
  }

  for (const [slug, exercises] of Object.entries(Object.assign({}, ...Object.values(byPattern)) as Record<string, Exercise[]>)) {
    const problem = problems.get(slug);
    if (!problem) errors.push(`exercises "${slug}" match no problem`);
    else if (!problem.summary?.trim()) errors.push(`"${slug}" has exercises but no summary`);
    if (exercises.length !== EXERCISES_PER_PROBLEM) {
      errors.push(`"${slug}" has ${exercises.length} exercises, expected ${EXERCISES_PER_PROBLEM}`);
    }
    const typed = exercises.filter((e) => e.kind === "type").length;
    if (typed < MIN_TYPED) errors.push(`"${slug}" has ${typed} typed exercises, expected at least ${MIN_TYPED}`);

    exercises.forEach((exercise, i) => {
      const where = `"${slug}"[${i + 1}]`;
      if (!exercise.prompt.trim() || !exercise.explanation.trim()) errors.push(`${where}: empty prompt or explanation`);
      if (exercise.code && exercise.solution) errors.push(`${where}: has both a snippet and the full solution`);
      // Complexity is picked from options, and you can't judge it without reading the code
      if (/complexity/i.test(exercise.prompt) && (exercise.kind !== "choice" || !exercise.solution)) {
        errors.push(`${where}: complexity question must be a choice with solution: true`);
      }
      if (exercise.kind === "type") {
        const accepted = new Set(exercise.answers.map(normalizeAnswer));
        if (accepted.size === 0 || accepted.has("")) errors.push(`${where}: needs non-empty answers`);
        for (const mistake of exercise.mistakes ?? []) {
          if (!mistake.why.trim()) errors.push(`${where}: mistake without a why`);
          for (const wrong of mistake.answers) {
            if (accepted.has(normalizeAnswer(wrong))) errors.push(`${where}: mistake "${wrong}" is also an accepted answer`);
          }
        }
      } else {
        if (exercise.options.length < 2) errors.push(`${where}: needs at least 2 options`);
        const correct = exercise.options.filter((o) => o.correct).length;
        if (correct !== 1) errors.push(`${where}: has ${correct} correct options, expected 1`);
        for (const option of exercise.options) {
          if (!option.correct && !option.why?.trim()) errors.push(`${where}: wrong option "${option.text}" has no why`);
        }
        if (new Set(exercise.options.map((o) => o.text)).size !== exercise.options.length) {
          errors.push(`${where}: duplicate option text`);
        }
      }
    });
  }

  return errors;
}
