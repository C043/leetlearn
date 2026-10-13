import { definePattern } from "../types";

export default definePattern({
  slug: "heap",
  name: "Heap / Priority Queue",
  description:
    "A priority queue always hands you the current best candidate — top-K, scheduling and merging streams become O(n log k).",
  order: 9,
  problems: [
    { slug: "kth-largest-element-in-a-stream", title: "Kth Largest Element in a Stream", difficulty: "EASY", leetcodeUrl: "https://leetcode.com/problems/kth-largest-element-in-a-stream/" },
    { slug: "last-stone-weight", title: "Last Stone Weight", difficulty: "EASY", leetcodeUrl: "https://leetcode.com/problems/last-stone-weight/" },
    { slug: "kth-largest-element-in-an-array", title: "Kth Largest Element in an Array", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/kth-largest-element-in-an-array/" },
    { slug: "top-k-frequent-elements", title: "Top K Frequent Elements", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/top-k-frequent-elements/" },
    { slug: "k-closest-points-to-origin", title: "K Closest Points to Origin", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/k-closest-points-to-origin/" },
    { slug: "task-scheduler", title: "Task Scheduler", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/task-scheduler/" },
    { slug: "kth-smallest-element-in-a-sorted-matrix", title: "Kth Smallest Element in a Sorted Matrix", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/" },
    { slug: "reorganize-string", title: "Reorganize String", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/reorganize-string/" },
    { slug: "single-threaded-cpu", title: "Single-Threaded CPU", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/single-threaded-cpu/" },
    { slug: "find-median-from-data-stream", title: "Find Median from Data Stream", difficulty: "HARD", leetcodeUrl: "https://leetcode.com/problems/find-median-from-data-stream/" },
  ],
});
