import { findProblem } from "@/content";
import { EXERCISES_PER_PROBLEM, getExercises, type Exercise } from "@/content/exercises";
import { getCode } from "@/content/solutions";

export const SESSION_SIZE = EXERCISES_PER_PROBLEM;

/**
 * One exercise in a session, tagged with its problem so every exercise can show
 * what the problem asks. `code` already holds the full solution when the exercise asks for it.
 */
export type TrainingItem = Exercise & { id: string; problemTitle: string; problemSummary: string };

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Shuffled exercises for one problem, with choice options shuffled too. */
function shuffledItems(problem: { slug: string; title: string }): TrainingItem[] {
  const summary = findProblem(problem.slug)?.problem.summary ?? "";
  const items = (getExercises(problem.slug) ?? []).map((exercise, i) => ({
    ...exercise,
    ...(exercise.kind === "choice" ? { options: shuffle(exercise.options) } : {}),
    ...(exercise.solution ? { code: getCode(problem.slug) } : {}),
    id: `${problem.slug}#${i}`,
    problemTitle: problem.title,
    problemSummary: summary,
  }));
  return shuffle(items);
}

/** All of the problem's exercises, in random order. */
export function problemSession(problem: { slug: string; title: string }): TrainingItem[] {
  return shuffledItems(problem);
}

/**
 * SESSION_SIZE random exercises across the given problems, dealt round-robin
 * so no single problem crowds out the others.
 */
export function patternSession(problems: { slug: string; title: string }[]): TrainingItem[] {
  const decks = shuffle(problems)
    .map(shuffledItems)
    .filter((deck) => deck.length > 0);
  const picked: TrainingItem[] = [];
  for (let round = 0; picked.length < SESSION_SIZE && decks.some((d) => d.length > round); round++) {
    for (const deck of decks) {
      if (picked.length < SESSION_SIZE && deck[round]) picked.push(deck[round]);
    }
  }
  return shuffle(picked);
}
