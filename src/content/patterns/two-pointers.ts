import { definePattern } from "../types";

export default definePattern({
  slug: "two-pointers",
  name: "Two Pointers",
  description:
    "Two indices walk through the input from opposite ends or in tandem, shrinking the search space instead of brute-forcing it.",
  order: 1,
  problems: [
    { slug: "valid-palindrome", title: "Valid Palindrome", difficulty: "EASY", leetcodeUrl: "https://leetcode.com/problems/valid-palindrome/" },
    { slug: "two-sum-ii-input-array-is-sorted", title: "Two Sum II - Input Array Is Sorted", difficulty: "EASY", leetcodeUrl: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/" },
    { slug: "container-with-most-water", title: "Container With Most Water", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/container-with-most-water/" },
    { slug: "3sum", title: "3Sum", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/3sum/" },
    { slug: "remove-duplicates-from-sorted-array", title: "Remove Duplicates from Sorted Array", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/" },
    { slug: "sort-colors", title: "Sort Colors", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/sort-colors/" },
    { slug: "4sum", title: "4Sum", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/4sum/" },
    { slug: "valid-triangle-number", title: "Valid Triangle Number", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/valid-triangle-number/" },
    { slug: "most-common-word", title: "Most Common Word", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/most-common-word/" },
    { slug: "trapping-rain-water", title: "Trapping Rain Water", difficulty: "HARD", leetcodeUrl: "https://leetcode.com/problems/trapping-rain-water/" },
  ],
});
