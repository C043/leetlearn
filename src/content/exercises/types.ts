/**
 * Training exercises: 10 per problem, Duolingo style.
 *
 * Text fields support `inline code` and **bold**. In `code`, a run of three
 * or more underscores (`___`) is the blank the user fills in.
 *
 * Every exercise is shown under its problem's `summary`. Use `code` for a
 * focused snippet, or `solution: true` to show the full reference solution
 * (required for complexity questions, which are always multiple choice, and
 * for anything that traces the code).
 */

interface ExerciseBase {
  prompt: string;
  code?: string;
  solution?: true;
  explanation: string;
}

/** The user types the answer. Checked with `normalizeAnswer`, so keep answers short. */
export interface TypedExercise extends ExerciseBase {
  kind: "type";
  /** Accepted answers. The first is the one shown as "correct answer". */
  answers: string[];
  /** Likely wrong answers with feedback specific to that mistake. */
  mistakes?: { answers: string[]; why: string }[];
}

/** The user picks one option. Every wrong option explains why it is wrong. */
export interface ChoiceExercise extends ExerciseBase {
  kind: "choice";
  options: ({ text: string; correct: true } | { text: string; correct?: false; why: string })[];
}

export type Exercise = TypedExercise | ChoiceExercise;

export function defineExercises(exercises: Record<string, Exercise[]>) {
  return exercises;
}
