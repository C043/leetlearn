import { definePattern } from "../types";

export default definePattern({
  slug: "dynamic-programming",
  name: "Dynamic Programming",
  description:
    "Overlapping subproblems with optimal structure: define the state, the recurrence, then fill a table bottom-up.",
  order: 12,
  problems: [
    { slug: "climbing-stairs", title: "Climbing Stairs", difficulty: "EASY", leetcodeUrl: "https://leetcode.com/problems/climbing-stairs/" },
    { slug: "min-cost-climbing-stairs", title: "Min Cost Climbing Stairs", difficulty: "EASY", leetcodeUrl: "https://leetcode.com/problems/min-cost-climbing-stairs/" },
    { slug: "house-robber", title: "House Robber", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/house-robber/" },
    { slug: "coin-change", title: "Coin Change", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/coin-change/" },
    { slug: "longest-increasing-subsequence", title: "Longest Increasing Subsequence", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/longest-increasing-subsequence/" },
    { slug: "unique-paths", title: "Unique Paths", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/unique-paths/" },
    { slug: "partition-equal-subset-sum", title: "Partition Equal Subset Sum", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/partition-equal-subset-sum/" },
    { slug: "decode-ways", title: "Decode Ways", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/decode-ways/" },
    { slug: "word-break", title: "Word Break", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/word-break/" },
    { slug: "edit-distance", title: "Edit Distance", difficulty: "HARD", leetcodeUrl: "https://leetcode.com/problems/edit-distance/" },
  ],
});
