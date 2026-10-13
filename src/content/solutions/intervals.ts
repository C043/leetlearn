import { defineSolutions } from "./types";

export default defineSolutions({
  "summary-ranges": {
    idea: "The array is sorted and unique, so a range continues as long as `nums[i] == nums[i-1] + 1`. When the run breaks, emit `\"start->end\"` (or just `\"start\"` for a single number).",
    steps: [
      {
        text: "`[0,1,2,4,5,7]`:",
        visual: {
          kind: "array",
          values: [0, 1, 2, 4, 5, 7],
          tones: { accent: [0, 1, 2], good: [3, 4], bad: [5] },
          caption: "[\"0->2\", \"4->5\", \"7\"]",
        },
      },
    ],
    time: "O(n)",
    space: "O(1) extra",
  },

  "teemo-attacking": {
    idea: "Each attack poisons `[t, t + duration)`. Overlapping poison doesn't stack, so each attack contributes `min(duration, nextAttack - t)`, and the last one contributes the full duration.",
    steps: [
      {
        text: "`timeSeries = [1, 2]`, `duration = 2`:",
        visual: {
          kind: "intervals",
          items: [
            { start: 1, end: 3, label: "attack 1" },
            { start: 2, end: 4, label: "attack 2", tone: "good" },
          ],
          caption: "Overlap [2,3) counts once: 1 + 2 = 3 seconds",
        },
      },
    ],
    time: "O(n)",
    space: "O(1)",
  },

  "merge-intervals": {
    idea: "Sort by start. Then overlapping intervals are **adjacent**. Walk through: if the next interval starts at or before the current merged end, extend the end; otherwise close the current one and start a new one.",
    steps: [
      {
        text: "Sorted input:",
        visual: {
          kind: "intervals",
          items: [
            { start: 1, end: 3 },
            { start: 2, end: 6 },
            { start: 8, end: 10, tone: "good" },
            { start: 15, end: 18, tone: "bad" },
          ],
        },
      },
      {
        text: "Merged:",
        visual: {
          kind: "intervals",
          items: [
            { start: 1, end: 6 },
            { start: 8, end: 10, tone: "good" },
            { start: 15, end: 18, tone: "bad" },
          ],
        },
      },
    ],
    time: "O(n log n)",
    space: "O(n) for the output",
    pitfalls: ["Use `end = max(end, next.end)`, since the next interval may be fully inside."],
  },

  "insert-interval": {
    idea: "The input is already sorted and non-overlapping, so it's three linear phases: copy intervals that end **before** the new one, merge every interval that **overlaps** it, then copy the rest.",
    steps: [
      {
        text: "Insert `[4,8]`:",
        visual: {
          kind: "intervals",
          items: [
            { start: 1, end: 2, tone: "muted" },
            { start: 3, end: 5 },
            { start: 4, end: 8, label: "new", tone: "good" },
            { start: 6, end: 7 },
            { start: 8, end: 10 },
            { start: 12, end: 16, tone: "muted" },
          ],
          caption: "Blue intervals overlap the new one",
        },
      },
      {
        text: "Merged: `start = min(...)`, `end = max(...)` over the overlapping group.",
        visual: {
          kind: "intervals",
          items: [
            { start: 1, end: 2, tone: "muted" },
            { start: 3, end: 10, tone: "good" },
            { start: 12, end: 16, tone: "muted" },
          ],
        },
      },
    ],
    time: "O(n)",
    space: "O(n)",
  },

  "non-overlapping-intervals": {
    idea: "Removing the fewest means **keeping the most** non-overlapping intervals. That's activity selection: sort by end and always keep the interval that ends earliest, since it leaves the most room for the rest.",
    steps: [
      {
        text: "Sorted by end. Keep an interval if it starts at or after the last kept end.",
        visual: {
          kind: "intervals",
          items: [
            { start: 1, end: 2, tone: "good" },
            { start: 2, end: 3, tone: "good" },
            { start: 1, end: 3, tone: "bad" },
            { start: 3, end: 4, tone: "good" },
          ],
          caption: "Remove [1,3]: answer 1",
        },
      },
    ],
    time: "O(n log n)",
    space: "O(1)",
  },

  "remove-covered-intervals": {
    idea: "Sort by start ascending, and for equal starts by **end descending** (so the bigger one comes first). Then an interval is covered iff its end ≤ the max end seen so far.",
    steps: [
      {
        text: "`[[1,4],[3,6],[2,8]]` sorted gives `[1,4], [2,8], [3,6]`.",
        visual: {
          kind: "intervals",
          items: [
            { start: 1, end: 4, tone: "good" },
            { start: 2, end: 8, tone: "good" },
            { start: 3, end: 6, tone: "bad" },
          ],
          caption: "[3,6] ends at 6 ≤ maxEnd 8, so it's covered. 2 remain",
        },
      },
    ],
    time: "O(n log n)",
    space: "O(1)",
  },

  "find-right-interval": {
    idea: "For each interval, find the interval with the **smallest start ≥ its end**. Sort the starts (remembering original indices) and binary-search each end.",
    steps: [
      {
        text: "`[[3,4],[2,3],[1,2]]`: sorted starts with original index:",
        visual: {
          kind: "array",
          values: ["1 (#2)", "2 (#1)", "3 (#0)"],
          indices: false,
          pointers: [{ at: 2, label: "end 3 → #0", tone: "good" }],
          tones: { good: [2] },
        },
      },
      { text: "Ends 4, 3, 2 map to `-1`, `0`, `1`." },
    ],
    time: "O(n log n)",
    space: "O(n)",
  },

  "interval-list-intersections": {
    idea: "Two pointers, one per list. The overlap of `A[i]` and `B[j]` is `[max(starts), min(ends)]` if non-empty. Then advance whichever interval **ends first**, since it can't intersect anything else.",
    steps: [
      {
        text: "Blue = A, green = B:",
        visual: {
          kind: "intervals",
          items: [
            { start: 0, end: 2 },
            { start: 1, end: 5, tone: "good" },
            { start: 5, end: 10 },
            { start: 8, end: 12, tone: "good" },
            { start: 13, end: 23 },
            { start: 15, end: 24, tone: "good" },
          ],
          caption: "First three pairs of A = [[0,2],[5,10],[13,23],[24,25]] and B = [[1,5],[8,12],[15,24],[25,26]]",
        },
      },
      { text: "Result: `[1,2], [5,5], [8,10], [15,23], [24,24], [25,25]`." },
    ],
    time: "O(m + n)",
    space: "O(1) extra",
  },

  "car-pooling": {
    idea: "Only the **net change** at each location matters: `+passengers` at pickup, `-passengers` at dropoff. Sweep locations in order with a running sum (a difference array, since locations ≤ 1000). If it ever exceeds capacity, fail.",
    steps: [
      {
        text: "`trips = [[2,1,5],[3,3,7]]`:",
        visual: {
          kind: "intervals",
          items: [
            { start: 1, end: 5, label: "2 passengers" },
            { start: 3, end: 7, label: "3 passengers", tone: "good" },
          ],
        },
      },
      {
        text: "Load after each location:",
        visual: {
          kind: "bars",
          values: [0, 2, 2, 5, 5, 3, 3, 0],
          tones: { bad: [3, 4] },
          caption: "Load 5 > capacity 4 at locations 3–4, so false",
        },
      },
    ],
    time: "O(n + maxLocation)",
    space: "O(maxLocation)",
    pitfalls: ["Drop-off happens **before** pickup at the same location: subtract at `to`, not `to + 1`."],
  },

  "minimum-interval-to-include-each-query": {
    idea: "Process **queries in sorted order** (remember original positions). Sort intervals by start and push each with `start ≤ q` into a min-heap keyed by `size`. Pop entries whose `end < q`. The heap top is the smallest interval covering `q`.",
    steps: [
      {
        text: "`intervals = [[1,4],[2,4],[3,6],[4,4]]`:",
        visual: {
          kind: "intervals",
          items: [
            { start: 1, end: 4, label: "size 4" },
            { start: 2, end: 4, label: "size 3" },
            { start: 3, end: 6, label: "size 4" },
            { start: 4, end: 4.15, label: "[4,4] size 1", tone: "good" },
          ],
          caption: "Query 4 → 1 (only [4,4]), query 5 → 4 ([3,6])",
        },
      },
      { text: "Answers for `[2,3,4,5]`: `[3,3,1,4]`. An expired interval stays expired for all later queries, so popping is safe." },
    ],
    time: "O((n + q) log n)",
    space: "O(n + q)",
  },
});
