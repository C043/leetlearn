import { definePattern } from "../types";

export default definePattern({
  slug: "binary-search",
  name: "Binary Search",
  description:
    "Halve a sorted or monotonic search space on every step, often by binary-searching on the answer itself.",
  order: 3,
  problems: [
    {
      slug: "binary-search",
      title: "Binary Search",
      difficulty: "EASY",
      leetcodeUrl: "https://leetcode.com/problems/binary-search/",
      summary:
        "Given a sorted array `nums` of distinct integers and a `target`, return the index of `target`, or `-1` if it isn't there. Must run in O(log n).",
    },
    {
      slug: "search-insert-position",
      title: "Search Insert Position",
      difficulty: "EASY",
      leetcodeUrl: "https://leetcode.com/problems/search-insert-position/",
      summary:
        "Given a sorted array `nums` of distinct integers and a `target`, return its index if found; otherwise return the index where it would be inserted to keep the array sorted. Must run in O(log n).",
    },
    {
      slug: "search-a-2d-matrix",
      title: "Search a 2D Matrix",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/search-a-2d-matrix/",
      summary:
        "Each row of `matrix` is sorted, and each row's first value is bigger than the previous row's last value. Return `True` if `target` is in the matrix. Must run in O(log(m·n)).",
    },
    {
      slug: "search-in-rotated-sorted-array",
      title: "Search in Rotated Sorted Array",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/search-in-rotated-sorted-array/",
      summary:
        "A sorted array of distinct integers was rotated at an unknown pivot (e.g. `[0,1,2,4,5,6,7]` → `[4,5,6,7,0,1,2]`). Return the index of `target`, or `-1`. Must run in O(log n).",
    },
    {
      slug: "find-minimum-in-rotated-sorted-array",
      title: "Find Minimum in Rotated Sorted Array",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",
      summary:
        "A sorted array of **distinct** integers was rotated at an unknown pivot. Return its minimum value in O(log n).",
    },
    {
      slug: "find-peak-element",
      title: "Find Peak Element",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/find-peak-element/",
      summary:
        "A peak is a value strictly greater than its neighbours (outside the array counts as −∞). Given `nums` with no two equal neighbours, return the index of **any** peak in O(log n).",
    },
    {
      slug: "koko-eating-bananas",
      title: "Koko Eating Bananas",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/koko-eating-bananas/",
      summary:
        "Koko has `piles` of bananas and `h` hours. Each hour she picks one pile and eats up to `k` bananas from it (if the pile has fewer, she finishes it and waits). Return the minimum integer speed `k` that lets her eat everything within `h` hours.",
    },
    {
      slug: "capacity-to-ship-packages-within-d-days",
      title: "Capacity To Ship Packages Within D Days",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/",
      summary:
        "Packages with `weights` must be shipped **in order** within `days` days. Each day the ship is loaded with consecutive packages up to its capacity. Return the smallest capacity that ships everything in time.",
    },
    {
      slug: "time-based-key-value-store",
      title: "Time Based Key-Value Store",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/time-based-key-value-store/",
      summary:
        "Design `TimeMap`: `set(key, value, timestamp)` stores a value (timestamps for a key always increase), and `get(key, timestamp)` returns the value set at the latest timestamp `<= timestamp`, or `\"\"` if there is none.",
    },
    {
      slug: "median-of-two-sorted-arrays",
      title: "Median of Two Sorted Arrays",
      difficulty: "HARD",
      leetcodeUrl: "https://leetcode.com/problems/median-of-two-sorted-arrays/",
      summary:
        "Given two sorted arrays `nums1` and `nums2`, return the median of all their values combined. Must run in O(log(m + n)).",
    },
  ],
});
