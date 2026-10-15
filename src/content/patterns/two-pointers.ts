import { definePattern } from "../types";

export default definePattern({
  slug: "two-pointers",
  name: "Two Pointers",
  description:
    "Two indices walk through the input from opposite ends or in tandem, shrinking the search space instead of brute-forcing it.",
  order: 1,
  problems: [
    {
      slug: "valid-palindrome",
      title: "Valid Palindrome",
      difficulty: "EASY",
      leetcodeUrl: "https://leetcode.com/problems/valid-palindrome/",
      summary:
        "Given a string `s`, return `True` if it reads the same forwards and backwards after lower-casing it and removing everything that isn't a letter or digit.",
    },
    {
      slug: "two-sum-ii-input-array-is-sorted",
      title: "Two Sum II - Input Array Is Sorted",
      difficulty: "EASY",
      leetcodeUrl: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",
      summary:
        "Given a **sorted** array `numbers` and a `target`, return the **1-based** indices `[i, j]` (`i < j`) of the two numbers that add up to `target`. Exactly one solution exists, and only O(1) extra space is allowed.",
    },
    {
      slug: "container-with-most-water",
      title: "Container With Most Water",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/container-with-most-water/",
      summary:
        "`height[i]` is a vertical line at position `i`. Pick the two lines that, together with the x-axis, hold the most water, and return that amount: the distance between them times the shorter line.",
    },
    {
      slug: "3sum",
      title: "3Sum",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/3sum/",
      summary:
        "Given an array `nums`, return every **unique** triplet of values (from three different indices) that sums to `0`. No triplet may appear twice in the output.",
    },
    {
      slug: "remove-duplicates-from-sorted-array",
      title: "Remove Duplicates from Sorted Array",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/",
      summary:
        "Given a **sorted** array `nums`, remove duplicates **in place** so each value appears once, keeping the order. Return `k`, the number of unique values; the first `k` slots of `nums` must hold them.",
    },
    {
      slug: "sort-colors",
      title: "Sort Colors",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/sort-colors/",
      summary:
        "`nums` holds only 0s, 1s and 2s (red, white, blue). Sort it **in place** so all 0s come first, then the 1s, then the 2s, without a library sort.",
    },
    {
      slug: "4sum",
      title: "4Sum",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/4sum/",
      summary:
        "Given an array `nums` and a `target`, return every **unique** quadruplet of values (from four different indices) that sums to `target`.",
    },
    {
      slug: "valid-triangle-number",
      title: "Valid Triangle Number",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/valid-triangle-number/",
      summary:
        "Given an array of side lengths `nums`, count the triplets of indices whose values can form a triangle: each pair of sides must add up to **more** than the third.",
    },
    {
      slug: "most-common-word",
      title: "Most Common Word",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/most-common-word/",
      summary:
        "Given a `paragraph` and a list of `banned` words, return the most frequent word that isn't banned, in lower case. Words are case-insensitive and punctuation is ignored.",
    },
    {
      slug: "trapping-rain-water",
      title: "Trapping Rain Water",
      difficulty: "HARD",
      leetcodeUrl: "https://leetcode.com/problems/trapping-rain-water/",
      summary:
        "`height[i]` is the height of a bar of width 1. After it rains, return how many units of water are trapped between the bars.",
    },
  ],
});
