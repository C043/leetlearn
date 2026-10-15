import { definePattern } from "../types";

export default definePattern({
  slug: "heap",
  name: "Heap / Priority Queue",
  description:
    "A priority queue always hands you the current best candidate — top-K, scheduling and merging streams become O(n log k).",
  order: 9,
  problems: [
    {
      slug: "kth-largest-element-in-a-stream",
      title: "Kth Largest Element in a Stream",
      difficulty: "EASY",
      leetcodeUrl: "https://leetcode.com/problems/kth-largest-element-in-a-stream/",
      summary:
        "Design `KthLargest(k, nums)`: each call to `add(val)` adds a value to the stream and returns the `k`th largest value seen so far (counting duplicates).",
    },
    {
      slug: "last-stone-weight",
      title: "Last Stone Weight",
      difficulty: "EASY",
      leetcodeUrl: "https://leetcode.com/problems/last-stone-weight/",
      summary:
        "Each turn, smash the two heaviest stones `x <= y`: if equal, both are destroyed; otherwise the lighter one is destroyed and the other becomes `y - x`. Return the last stone's weight, or `0` if none are left.",
    },
    {
      slug: "kth-largest-element-in-an-array",
      title: "Kth Largest Element in an Array",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/kth-largest-element-in-an-array/",
      summary:
        "Given `nums` and `k`, return the `k`th largest element in sorted order (not the `k`th distinct one). Try to avoid fully sorting.",
    },
    {
      slug: "top-k-frequent-elements",
      title: "Top K Frequent Elements",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/top-k-frequent-elements/",
      summary:
        "Given `nums` and `k`, return the `k` most frequent values, in any order. The answer is guaranteed to be unique. Aim for better than O(n log n).",
    },
    {
      slug: "k-closest-points-to-origin",
      title: "K Closest Points to Origin",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/k-closest-points-to-origin/",
      summary:
        "Given `points` `[x, y]` on a plane and `k`, return the `k` points closest to `(0, 0)` by Euclidean distance, in any order.",
    },
    {
      slug: "task-scheduler",
      title: "Task Scheduler",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/task-scheduler/",
      summary:
        "CPU tasks are labelled `A`–`Z`; each takes one interval. Two runs of the **same** task must be at least `n` intervals apart, and the CPU may idle. Return the minimum number of intervals to finish all tasks.",
    },
    {
      slug: "kth-smallest-element-in-a-sorted-matrix",
      title: "Kth Smallest Element in a Sorted Matrix",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/",
      summary:
        "In an `n × n` matrix where every row and every column is sorted ascending, return the `k`th smallest element (counting duplicates).",
    },
    {
      slug: "reorganize-string",
      title: "Reorganize String",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/reorganize-string/",
      summary:
        "Rearrange the letters of `s` so no two adjacent letters are the same, and return any valid result, or `\"\"` if it's impossible.",
    },
    {
      slug: "single-threaded-cpu",
      title: "Single-Threaded CPU",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/single-threaded-cpu/",
      summary:
        "`tasks[i] = [enqueueTime, processingTime]`. A single CPU, when free, runs the available task with the **shortest** processing time (ties → smaller index), to completion. If nothing is available it waits. Return the order in which task indices run.",
    },
    {
      slug: "find-median-from-data-stream",
      title: "Find Median from Data Stream",
      difficulty: "HARD",
      leetcodeUrl: "https://leetcode.com/problems/find-median-from-data-stream/",
      summary:
        "Design `MedianFinder`: `addNum(num)` adds a number from a stream, and `findMedian()` returns the median of all numbers so far (the average of the two middle values when the count is even).",
    },
  ],
});
