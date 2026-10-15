import { definePattern } from "../types";

export default definePattern({
  slug: "dynamic-programming",
  name: "Dynamic Programming",
  description:
    "Overlapping subproblems with optimal structure: define the state, the recurrence, then fill a table bottom-up.",
  order: 12,
  problems: [
    {
      slug: "climbing-stairs",
      title: "Climbing Stairs",
      difficulty: "EASY",
      leetcodeUrl: "https://leetcode.com/problems/climbing-stairs/",
      summary:
        "You climb a staircase of `n` steps, taking 1 or 2 steps at a time. Return how many distinct ways there are to reach the top.",
    },
    {
      slug: "min-cost-climbing-stairs",
      title: "Min Cost Climbing Stairs",
      difficulty: "EASY",
      leetcodeUrl: "https://leetcode.com/problems/min-cost-climbing-stairs/",
      summary:
        "`cost[i]` is paid when you step off stair `i`, then you climb 1 or 2 stairs. You may start on stair 0 or 1. Return the minimum cost to reach the top (just past the last stair).",
    },
    {
      slug: "house-robber",
      title: "House Robber",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/house-robber/",
      summary:
        "Houses in a row hold `nums[i]` money. You can't rob two **adjacent** houses. Return the most money you can rob.",
    },
    {
      slug: "coin-change",
      title: "Coin Change",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/coin-change/",
      summary:
        "Given coin values `coins` (unlimited supply of each) and an `amount`, return the fewest coins that add up to `amount`, or `-1` if it can't be made.",
    },
    {
      slug: "longest-increasing-subsequence",
      title: "Longest Increasing Subsequence",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/longest-increasing-subsequence/",
      summary:
        "Given `nums`, return the length of the longest **strictly increasing** subsequence (elements in order, not necessarily contiguous).",
    },
    {
      slug: "unique-paths",
      title: "Unique Paths",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/unique-paths/",
      summary:
        "A robot starts at the top-left of an `m × n` grid and can only move right or down. Return how many unique paths lead to the bottom-right corner.",
    },
    {
      slug: "partition-equal-subset-sum",
      title: "Partition Equal Subset Sum",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/partition-equal-subset-sum/",
      summary:
        "Given positive integers `nums`, return `True` if they can be split into two groups with equal sums.",
    },
    {
      slug: "decode-ways",
      title: "Decode Ways",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/decode-ways/",
      summary:
        "Letters are encoded as `\"1\"` = A … `\"26\"` = Z. Given a digit string, return how many ways it can be decoded. A part with a leading zero (like `\"06\"`) is invalid.",
    },
    {
      slug: "word-break",
      title: "Word Break",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/word-break/",
      summary:
        "Given a string `s` and a list of dictionary words, return `True` if `s` can be split into a sequence of one or more dictionary words (words may be reused).",
    },
    {
      slug: "edit-distance",
      title: "Edit Distance",
      difficulty: "HARD",
      leetcodeUrl: "https://leetcode.com/problems/edit-distance/",
      summary:
        "Return the minimum number of single-character operations (insert, delete or replace) needed to turn `word1` into `word2`.",
    },
  ],
});
