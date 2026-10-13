import { assertCorpusValid, corpusSchema } from "./schema";

import twoPointers from "./patterns/two-pointers";
import slidingWindow from "./patterns/sliding-window";
import binarySearch from "./patterns/binary-search";
import fastSlowPointers from "./patterns/fast-slow-pointers";
import linkedList from "./patterns/linked-list";
import stackQueue from "./patterns/stack-queue";
import treesDfs from "./patterns/trees-dfs";
import treesBfs from "./patterns/trees-bfs";
import heap from "./patterns/heap";
import backtracking from "./patterns/backtracking";
import graphs from "./patterns/graphs";
import dynamicProgramming from "./patterns/dynamic-programming";
import greedy from "./patterns/greedy";
import intervals from "./patterns/intervals";
import bitManipulation from "./patterns/bit-manipulation";
import tries from "./patterns/tries";

/**
 * Every pattern file must be imported here explicitly.
 * Bundlers can't glob server-side files at runtime, and a static import
 * means a broken pattern file fails `next build`, not just `npm start`.
 */
const raw = [
  twoPointers,
  slidingWindow,
  binarySearch,
  fastSlowPointers,
  linkedList,
  stackQueue,
  treesDfs,
  treesBfs,
  heap,
  backtracking,
  graphs,
  dynamicProgramming,
  greedy,
  intervals,
  bitManipulation,
  tries,
];

// Fail fast: throws with a readable message at build / seed / boot time.
const parsed = corpusSchema.parse(raw);
assertCorpusValid(parsed);

/** All 16 patterns, sorted by `order` (1..16). */
export const PATTERNS = [...parsed].sort((a, b) => a.order - b.order);

/** Total exercises in the corpus (160). */
export const PROBLEM_COUNT = PATTERNS.reduce(
  (sum, p) => sum + p.problems.length,
  0,
);

export type { PatternInput, ProblemInput } from "./types";
