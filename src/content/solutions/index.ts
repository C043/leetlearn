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

// Fail fast, like the corpus: every problem needs a walkthrough and every walkthrough a problem.
{
  const problemSlugs = new Set(PATTERNS.flatMap((p) => p.problems.map((q) => q.slug)));
  const missing = [...problemSlugs].filter((s) => !SOLUTIONS[s]);
  const orphaned = Object.keys(SOLUTIONS).filter((s) => !problemSlugs.has(s));
  const empty = Object.entries(SOLUTIONS)
    .filter(([, s]) => !s.idea.trim() || s.steps.length === 0)
    .map(([slug]) => slug);
  const errors = [
    ...missing.map((s) => `no solution for problem "${s}"`),
    ...orphaned.map((s) => `solution "${s}" matches no problem`),
    ...empty.map((s) => `solution "${s}" has no idea or steps`),
  ];
  if (errors.length > 0) {
    throw new Error(`Invalid solutions:\n  - ${errors.join("\n  - ")}`);
  }
}

export function getSolution(slug: string): Solution | undefined {
  return SOLUTIONS[slug];
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
