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
      summary:
        "Given the `root` of a binary tree and `targetSum`, return `True` if some **root-to-leaf** path has values adding up to `targetSum`.",
    },
    {
      slug: "binary-watch",
      title: "Binary Watch",
      difficulty: "EASY",
      leetcodeUrl: "https://leetcode.com/problems/binary-watch/",
      summary:
        "A binary watch has 4 LEDs for the hour (0–11) and 6 for the minute (0–59). Given how many LEDs are on, return every time it could show, formatted like `\"1:05\"` (no leading zero on the hour, two-digit minutes).",
    },
    {
      slug: "letter-combinations-of-a-phone-number",
      title: "Letter Combinations of a Phone Number",
      difficulty: "MEDIUM",
      leetcodeUrl:
        "https://leetcode.com/problems/letter-combinations-of-a-phone-number/",
      summary:
        "Given a string of digits `2`–`9`, return every letter combination they could spell on a phone keypad (2 = abc, 3 = def, …, 7 = pqrs, 9 = wxyz).",
    },
    {
      slug: "subsets",
      title: "Subsets",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/subsets/",
      summary:
        "Given an array of **distinct** integers, return every possible subset (the power set), with no duplicate subsets, in any order.",
    },
    {
      slug: "permutations",
      title: "Permutations",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/permutations/",
      summary:
        "Given an array of **distinct** integers, return every possible ordering of them, in any order.",
    },
    {
      slug: "combination-sum",
      title: "Combination Sum",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/combination-sum/",
      summary:
        "Given distinct positive `candidates` and a `target`, return every unique combination that sums to `target`. Each candidate may be used **any number of times**; combinations differing only in order count once.",
    },
    {
      slug: "palindrome-partitioning",
      title: "Palindrome Partitioning",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/palindrome-partitioning/",
      summary:
        "Split string `s` into pieces so that every piece is a palindrome. Return every possible way to split it.",
    },
    {
      slug: "word-search",
      title: "Word Search",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/word-search/",
      summary:
        "Given a grid of letters and a `word`, return `True` if the word can be spelled by moving between horizontally or vertically adjacent cells, using each cell at most once.",
    },
    {
      slug: "restore-ip-addresses",
      title: "Restore IP Addresses",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/restore-ip-addresses/",
      summary:
        "Given a string of digits, return every valid IPv4 address formed by inserting three dots: four parts, each between `0` and `255`, with no leading zeros (`\"0\"` is fine, `\"01\"` is not). All digits must be used.",
    },
    {
      slug: "n-queens",
      title: "N-Queens",
      difficulty: "HARD",
      leetcodeUrl: "https://leetcode.com/problems/n-queens/",
      summary:
        "Place `n` queens on an `n × n` chessboard so no two attack each other (same row, column or diagonal). Return every distinct board, drawn with `\"Q\"` and `\".\"`.",
    },
  ],
});
