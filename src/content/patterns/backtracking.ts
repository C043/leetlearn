import { definePattern } from "../types";

export default definePattern({
  slug: "backtracking",
  name: "Backtracking",
  description:
    "Build a candidate choice by choice, undo the choice when it dead-ends, and enumerate every valid combination.",
  order: 10,
  problems: [
    {
      slug: "path-sum",
      title: "Path Sum",
      difficulty: "EASY",
      leetcodeUrl: "https://leetcode.com/problems/path-sum/",
    },
    {
      slug: "binary-watch",
      title: "Binary Watch",
      difficulty: "EASY",
      leetcodeUrl: "https://leetcode.com/problems/binary-watch/",
    },
    {
      slug: "letter-combinations-of-a-phone-number",
      title: "Letter Combinations of a Phone Number",
      difficulty: "MEDIUM",
      leetcodeUrl:
        "https://leetcode.com/problems/letter-combinations-of-a-phone-number/",
    },
    {
      slug: "subsets",
      title: "Subsets",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/subsets/",
    },
    {
      slug: "permutations",
      title: "Permutations",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/permutations/",
    },
    {
      slug: "combination-sum",
      title: "Combination Sum",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/combination-sum/",
    },
    {
      slug: "palindrome-partitioning",
      title: "Palindrome Partitioning",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/palindrome-partitioning/",
    },
    {
      slug: "word-search",
      title: "Word Search",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/word-search/",
    },
    {
      slug: "restore-ip-addresses",
      title: "Restore IP Addresses",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/restore-ip-addresses/",
    },
    {
      slug: "n-queens",
      title: "N-Queens",
      difficulty: "HARD",
      leetcodeUrl: "https://leetcode.com/problems/n-queens/",
    },
  ],
});
