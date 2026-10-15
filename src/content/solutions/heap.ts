import { defineSolutions } from "./types";

export default defineSolutions({
  "kth-largest-element-in-a-stream": {
    idea: "Keep a **min-heap of size k** holding the k largest values seen. Its root is the smallest of those k, which is exactly the k-th largest overall.",
    steps: [
      {
        text: "`k = 3`, initial `[4,5,8,2]`. Push everything, popping whenever size exceeds 3.",
        visual: { kind: "tree", values: [4, 5, 8], tones: { good: [0] }, caption: "Min-heap {4, 5, 8}; 2 was evicted. Root 4 = 3rd largest" },
      },
      { text: "`add(val)`: push, pop if size > k, return the root. `add(3)` returns 4; `add(10)` evicts 4 and returns 5." },
    ],
    time: "O(log k) per add",
    space: "O(k)",
  },

  "last-stone-weight": {
    idea: "Each turn you need the two heaviest stones, which is a **max-heap**. Pop two, push back the difference if it's non-zero, and repeat until at most one stone remains.",
    steps: [
      {
        text: "Heapify `[2,7,4,1,8,1]`:",
        visual: { kind: "tree", values: [8, 7, 4, 1, 2, 1], tones: { bad: [0, 1] }, caption: "Smash 8 and 7, push 1" },
      },
      { text: "Continue: (4,2) gives 2, (2,1) gives 1, (1,1) gives 0, leaving `1`." },
    ],
    time: "O(n log n)",
    space: "O(n)",
    pitfalls: ["Python's `heapq` is a min-heap, so push negated values."],
  },

  "kth-largest-element-in-an-array": {
    idea: "Two good options. A **min-heap of size k** (O(n log k)): its root ends as the k-th largest. Or **Quickselect** (average O(n)): partition around a pivot and recurse only into the side containing index `n - k`.",
    steps: [
      {
        text: "`[3,2,1,5,6,4]`, `k = 2`. Size-2 min-heap after the scan:",
        visual: { kind: "tree", values: [5, 6], tones: { good: [0] }, caption: "Root 5 = 2nd largest" },
      },
      {
        text: "Quickselect view: in sorted order the answer sits at index `n - k = 4`.",
        visual: { kind: "array", values: [1, 2, 3, 4, 5, 6], tones: { good: [4] }, pointers: [{ at: 4, label: "len(nums) − k", tone: "good" }] },
      },
    ],
    time: "O(n log k) heap / O(n) avg quickselect",
    space: "O(k) / O(1)",
    pitfalls: ["Randomize the pivot in quickselect to avoid O(n²) on sorted input."],
  },

  "top-k-frequent-elements": {
    idea: "Count frequencies with a hash map. Then either keep a size-k min-heap keyed by count, or use **bucket sort**: frequencies are at most `n`, so put each number in `buckets[count]` and read buckets from high to low.",
    steps: [
      {
        text: "`[1,1,1,2,2,3]`: counts `{1:3, 2:2, 3:1}`. Bucket by frequency:",
        visual: {
          kind: "grid",
          rowLabels: ["count 3", "count 2", "count 1"],
          rows: [[1], [2], [3]],
          tones: { good: [[0, 0], [1, 0]] },
          caption: "Read from the top until k = 2 numbers are collected: [1, 2]",
        },
      },
    ],
    time: "O(n) bucket / O(n log k) heap",
    space: "O(n)",
  },

  "k-closest-points-to-origin": {
    idea: "Keep a **max-heap of size k** by distance. If a new point is closer than the farthest in the heap, swap it in. Compare **squared** distances, since `sqrt` doesn't change the order.",
    steps: [
      {
        text: "`k = 2`:",
        visual: {
          kind: "grid",
          colLabels: ["point", "x²+y²"],
          rows: [["(3,3)", 18], ["(5,−1)", 26], ["(−2,4)", 20]],
          tones: { good: [[0, 0], [0, 1], [2, 0], [2, 1]], bad: [[1, 0], [1, 1]] },
          caption: "(5,−1) is the farthest, so it's evicted",
        },
      },
      { text: "Quickselect on distance also gives average O(n)." },
    ],
    time: "O(n log k)",
    space: "O(k)",
  },

  "task-scheduler": {
    idea: "The most frequent task dictates the layout. Its copies split time into `highest_frequency - 1` frames of length `n + 1`, plus a final frame holding every task tied for the highest count (`tasks_with_highest`). Answer = `max(len(tasks), (highest_frequency - 1) * (n + 1) + tasks_with_highest)`.",
    steps: [
      {
        text: "`tasks = AAABBB`, `n = 2`. Frames:",
        visual: {
          kind: "grid",
          rowLabels: ["frame 1", "frame 2", "last"],
          rows: [["A", "B", "idle"], ["A", "B", "idle"], ["A", "B"]],
          tones: { muted: [[0, 2], [1, 2]] },
          caption: "(3 − 1) × 3 + 2 = 8 intervals",
        },
      },
      { text: "If there are enough distinct tasks to fill every idle slot, there's no idle time at all, so the answer is `len(tasks)`." },
      { text: "Simulation alternative: max-heap of counts plus a cooldown queue." },
    ],
    time: "O(n)",
    space: "O(26)",
  },

  "kth-smallest-element-in-a-sorted-matrix": {
    idea: "Like merging `n` sorted rows: put each row's first element in a **min-heap**, pop `k - 1` times (pushing the popped element's right neighbor each time), and the root is the k-th smallest.",
    steps: [
      {
        text: "`k = 8`. The first eight pops come out in this order:",
        visual: {
          kind: "grid",
          rows: [[1, 5, 9], [10, 11, 13], [12, 13, 15]],
          tones: { accent: [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [2, 0], [1, 2]], good: [[2, 1]] },
          caption: "1, 5, 9, 10, 11, 12, 13, 13, so the 8th smallest is 13",
        },
      },
      { text: "Faster in theory: **binary search on the value**, counting elements ≤ mid with a staircase walk from the bottom-left (O(n) per count)." },
    ],
    time: "O(k log n) heap / O(n log(max − min)) value search",
    space: "O(n) / O(1)",
  },

  "reorganize-string": {
    idea: "It's impossible exactly when some letter appears more than `(length + 1) // 2` times. Otherwise, place letters at **even indices first** (most frequent letter first), then odd indices. No two equal letters end up adjacent.",
    steps: [
      {
        text: "`\"aaabbc\"`: `a` (×3) fills indices 0, 2, 4; then `b` continues at 1, 3; `c` at 5.",
        visual: { kind: "array", values: ["a", "b", "a", "b", "a", "c"], tones: { accent: [0, 2, 4], good: [1, 3] } },
      },
      { text: "Heap alternative: repeatedly pop the two most frequent letters, append both, and push back if counts remain." },
    ],
    time: "O(n)",
    space: "O(26)",
  },

  "single-threaded-cpu": {
    idea: "Simulate time. Sort tasks by enqueue time. Push every task that has arrived by `time` into a **min-heap keyed by (processingTime, index)**. Run the root. If the heap is empty, jump `time` to the next arrival.",
    steps: [
      {
        text: "`tasks = [[1,2],[2,4],[3,2],[4,1]]` as `[enqueue, duration]`. The CPU timeline:",
        visual: {
          kind: "intervals",
          items: [
            { start: 1, end: 3, label: "task 0" },
            { start: 3, end: 5, label: "task 2", tone: "good" },
            { start: 5, end: 6, label: "task 3", tone: "good" },
            { start: 6, end: 10, label: "task 1", tone: "bad" },
          ],
          caption: "At t = 3, tasks 1 (4) and 2 (2) are waiting, so the shorter one (2) runs first",
        },
      },
      { text: "Order: `[0, 2, 3, 1]`." },
    ],
    time: "O(n log n)",
    space: "O(n)",
    pitfalls: ["Time can exceed 2³¹, so use 64-bit integers."],
  },

  "find-median-from-data-stream": {
    idea: "Split the numbers into two halves: a **max-heap** `low` for the smaller half and a **min-heap** `high` for the larger half, with sizes equal or `low` one bigger. The median is the top of `low` (`-self.low[0]`, stored negated), or the average of both tops.",
    steps: [
      {
        text: "After adding 1..5: the low half has max 3 on top; the high half has min 4 on top.",
        visual: { kind: "array", values: [1, 2, 3, "|", 4, 5], indices: false, tones: { accent: [0, 1, 2], good: [4, 5], muted: [3] }, caption: "low (max-heap) | high (min-heap): median = 3" },
      },
      { text: "`addNum`: push to `low`, move the top of `low` to `high` (keeps the order), and if `high` is larger, move its top back to `low`." },
    ],
    time: "O(log n) add, O(1) median",
    space: "O(n)",
  },
});
