import { definePattern } from "../types";

export default definePattern({
  slug: "sliding-window",
  name: "Sliding Window",
  description:
    "Maintain a contiguous window over the input and grow/shrink it to satisfy a constraint, so each element is visited once.",
  order: 2,
  problems: [
    {
      slug: "contains-duplicate-ii",
      title: "Contains Duplicate II",
      difficulty: "EASY",
      leetcodeUrl: "https://leetcode.com/problems/contains-duplicate-ii/",
      summary:
        "Given `nums` and `k`, return `True` if two **different** indices `i` and `j` hold the same value and are at most `k` apart (`abs(i - j) <= k`).",
    },
    {
      slug: "maximum-average-subarray-i",
      title: "Maximum Average Subarray I",
      difficulty: "EASY",
      leetcodeUrl: "https://leetcode.com/problems/maximum-average-subarray-i/",
      summary:
        "Given `nums` and `k`, find the contiguous subarray of length exactly `k` with the largest average, and return that average.",
    },
    {
      slug: "longest-substring-without-repeating-characters",
      title: "Longest Substring Without Repeating Characters",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
      summary:
        "Given a string `s`, return the length of the longest substring (contiguous) that contains no repeated characters.",
    },
    {
      slug: "longest-repeating-character-replacement",
      title: "Longest Repeating Character Replacement",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/longest-repeating-character-replacement/",
      summary:
        "Given an upper-case string `s` and an integer `k`, you may change at most `k` characters to any letter. Return the length of the longest substring that can be turned into one repeated letter.",
    },
    {
      slug: "permutation-in-string",
      title: "Permutation in String",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/permutation-in-string/",
      summary:
        "Given `s1` and `s2`, return `True` if some permutation of `s1` appears as a contiguous substring of `s2`.",
    },
    {
      slug: "find-all-anagrams-in-a-string",
      title: "Find All Anagrams in a String",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/find-all-anagrams-in-a-string/",
      summary:
        "Given strings `s` and `p`, return every start index in `s` where the substring of length `len(p)` is an anagram of `p` (same letters, any order).",
    },
    {
      slug: "minimum-size-subarray-sum",
      title: "Minimum Size Subarray Sum",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/minimum-size-subarray-sum/",
      summary:
        "Given an array of **positive** integers `nums` and a `target`, return the length of the shortest contiguous subarray whose sum is **at least** `target`, or `0` if there is none.",
    },
    {
      slug: "fruit-into-baskets",
      title: "Fruit Into Baskets",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/fruit-into-baskets/",
      summary:
        "`fruits[i]` is the fruit type of tree `i` in a row. You have two baskets, each holding a single type. Start at any tree and pick one fruit from every tree moving right, stopping when a third type appears. Return the most fruit you can pick.",
    },
    {
      slug: "max-consecutive-ones-iii",
      title: "Max Consecutive Ones III",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/max-consecutive-ones-iii/",
      summary:
        "Given a binary array `nums` and an integer `k`, you may flip at most `k` zeros to ones. Return the length of the longest run of consecutive 1s you can get.",
    },
    {
      slug: "minimum-window-substring",
      title: "Minimum Window Substring",
      difficulty: "HARD",
      leetcodeUrl: "https://leetcode.com/problems/minimum-window-substring/",
      summary:
        "Given strings `s` and `t`, return the shortest substring of `s` that contains every character of `t` (duplicates included), or `\"\"` if there is none.",
    },
  ],
});
