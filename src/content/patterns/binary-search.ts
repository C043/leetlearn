import { definePattern } from "../types";

export default definePattern({
  slug: "binary-search",
  name: "Binary Search",
  description:
    "Halve a sorted or monotonic search space on every step, often by binary-searching on the answer itself.",
  order: 3,
  problems: [
    { slug: "binary-search", title: "Binary Search", difficulty: "EASY", leetcodeUrl: "https://leetcode.com/problems/binary-search/" },
    { slug: "search-insert-position", title: "Search Insert Position", difficulty: "EASY", leetcodeUrl: "https://leetcode.com/problems/search-insert-position/" },
    { slug: "search-a-2d-matrix", title: "Search a 2D Matrix", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/search-a-2d-matrix/" },
    { slug: "search-in-rotated-sorted-array", title: "Search in Rotated Sorted Array", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/search-in-rotated-sorted-array/" },
    { slug: "find-minimum-in-rotated-sorted-array", title: "Find Minimum in Rotated Sorted Array", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/" },
    { slug: "find-peak-element", title: "Find Peak Element", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/find-peak-element/" },
    { slug: "koko-eating-bananas", title: "Koko Eating Bananas", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/koko-eating-bananas/" },
    { slug: "capacity-to-ship-packages-within-d-days", title: "Capacity To Ship Packages Within D Days", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/" },
    { slug: "time-based-key-value-store", title: "Time Based Key-Value Store", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/time-based-key-value-store/" },
    { slug: "median-of-two-sorted-arrays", title: "Median of Two Sorted Arrays", difficulty: "HARD", leetcodeUrl: "https://leetcode.com/problems/median-of-two-sorted-arrays/" },
  ],
});
