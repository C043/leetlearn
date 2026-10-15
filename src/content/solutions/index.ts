import { PATTERNS } from "..";
import type { Solution } from "./types";

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

import twoPointersCode from "./code/two-pointers";
import slidingWindowCode from "./code/sliding-window";
import binarySearchCode from "./code/binary-search";
import fastSlowPointersCode from "./code/fast-slow-pointers";
import linkedListCode from "./code/linked-list";
import stackQueueCode from "./code/stack-queue";
import treesDfsCode from "./code/trees-dfs";
import treesBfsCode from "./code/trees-bfs";
import heapCode from "./code/heap";
import backtrackingCode from "./code/backtracking";
import graphsCode from "./code/graphs";
import dynamicProgrammingCode from "./code/dynamic-programming";
import greedyCode from "./code/greedy";
import intervalsCode from "./code/intervals";
import bitManipulationCode from "./code/bit-manipulation";
import triesCode from "./code/tries";

const SOLUTIONS: Record<string, Solution> = {
  ...twoPointers,
  ...slidingWindow,
  ...binarySearch,
  ...fastSlowPointers,
  ...linkedList,
  ...stackQueue,
  ...treesDfs,
  ...treesBfs,
  ...heap,
  ...backtracking,
  ...graphs,
  ...dynamicProgramming,
  ...greedy,
  ...intervals,
  ...bitManipulation,
  ...tries,
};

const CODE: Record<string, string> = {
  ...twoPointersCode,
  ...slidingWindowCode,
  ...binarySearchCode,
  ...fastSlowPointersCode,
  ...linkedListCode,
  ...stackQueueCode,
  ...treesDfsCode,
  ...treesBfsCode,
  ...heapCode,
  ...backtrackingCode,
  ...graphsCode,
  ...dynamicProgrammingCode,
  ...greedyCode,
  ...intervalsCode,
  ...bitManipulationCode,
  ...triesCode,
};

// Fail fast, like the corpus: every problem needs a walkthrough and code, and each of those a problem.
{
  const problemSlugs = new Set(PATTERNS.flatMap((p) => p.problems.map((q) => q.slug)));
  const missing = [...problemSlugs].filter((s) => !SOLUTIONS[s]);
  const orphaned = Object.keys(SOLUTIONS).filter((s) => !problemSlugs.has(s));
  const empty = Object.entries(SOLUTIONS)
    .filter(([, s]) => !s.idea.trim() || s.steps.length === 0)
    .map(([slug]) => slug);
  const noCode = [...problemSlugs].filter((s) => !CODE[s]?.trim());
  const orphanedCode = Object.keys(CODE).filter((s) => !problemSlugs.has(s));
  const errors = [
    ...missing.map((s) => `no solution for problem "${s}"`),
    ...orphaned.map((s) => `solution "${s}" matches no problem`),
    ...empty.map((s) => `solution "${s}" has no idea or steps`),
    ...noCode.map((s) => `no code for problem "${s}"`),
    ...orphanedCode.map((s) => `code "${s}" matches no problem`),
  ];
  if (errors.length > 0) {
    throw new Error(`Invalid solutions:\n  - ${errors.join("\n  - ")}`);
  }
}

export function getSolution(slug: string): Solution | undefined {
  return SOLUTIONS[slug];
}

/** The Python reference solution for the problem. */
export function getCode(slug: string): string | undefined {
  return CODE[slug];
}

/** The problem's curated video, or a YouTube search for walkthroughs of it. */
export function videoUrlFor(slug: string, title: string): string {
  return (
    SOLUTIONS[slug]?.videoUrl ??
    `https://www.youtube.com/results?search_query=${encodeURIComponent(`leetcode ${title} solution explained`)}`
  );
}

/** The slug is the path segment after /problems/ in a LeetCode URL. */
export function slugFromUrl(leetcodeUrl: string): string {
  return leetcodeUrl.match(/\/problems\/([^/]+)/)?.[1] ?? "";
}
