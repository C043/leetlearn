import { PATTERNS } from "..";
import type { Exercise } from "./types";
import { validateExercises } from "./validate";

import twoPointers from "./two-pointers";
import slidingWindow from "./sliding-window";
import binarySearch from "./binary-search";
import fastSlowPointers from "./fast-slow-pointers";
import linkedList from "./linked-list";
import stackQueue from "./stack-queue";
import treesDfs from "./trees-dfs";
import treesBfs from "./trees-bfs";
import heap from "./heap";
import backtracking from "./backtracking";
import graphs from "./graphs";
import dynamicProgramming from "./dynamic-programming";
import greedy from "./greedy";
import intervals from "./intervals";
import bitManipulation from "./bit-manipulation";
import tries from "./tries";

/** Exercise files keyed by pattern slug. A pattern listed here must cover all of its problems. */
const BY_PATTERN: Record<string, Record<string, Exercise[]>> = {
  "two-pointers": twoPointers,
  "sliding-window": slidingWindow,
  "binary-search": binarySearch,
  "fast-slow-pointers": fastSlowPointers,
  "linked-list": linkedList,
  "stack-queue": stackQueue,
  "trees-dfs": treesDfs,
  "trees-bfs": treesBfs,
  heap,
  backtracking,
  graphs,
  "dynamic-programming": dynamicProgramming,
  greedy,
  intervals,
  "bit-manipulation": bitManipulation,
  tries,
};

const EXERCISES: Record<string, Exercise[]> = Object.assign({}, ...Object.values(BY_PATTERN));

// Fail fast, like the solutions: a broken exercise fails `next build`.
{
  const errors = validateExercises(BY_PATTERN, PATTERNS);
  if (errors.length > 0) {
    throw new Error(`Invalid exercises:\n  - ${errors.join("\n  - ")}`);
  }
}

export function getExercises(slug: string): Exercise[] | undefined {
  return EXERCISES[slug];
}

export function hasExercises(slug: string): boolean {
  return slug in EXERCISES;
}

export { EXERCISES_PER_PROBLEM } from "./validate";
export type { ChoiceExercise, Exercise, TypedExercise } from "./types";
