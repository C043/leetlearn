import { definePattern } from "../types";

export default definePattern({
  slug: "sliding-window",
  name: "Sliding Window",
  description:
    "Maintain a contiguous window over the input and grow/shrink it to satisfy a constraint, so each element is visited once.",
  order: 2,
  problems: [
    { slug: "contains-duplicate-ii", title: "Contains Duplicate II", difficulty: "EASY", leetcodeUrl: "https://leetcode.com/problems/contains-duplicate-ii/" },
    { slug: "maximum-average-subarray-i", title: "Maximum Average Subarray I", difficulty: "EASY", leetcodeUrl: "https://leetcode.com/problems/maximum-average-subarray-i/" },
    { slug: "longest-substring-without-repeating-characters", title: "Longest Substring Without Repeating Characters", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
    { slug: "longest-repeating-character-replacement", title: "Longest Repeating Character Replacement", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/longest-repeating-character-replacement/" },
    { slug: "permutation-in-string", title: "Permutation in String", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/permutation-in-string/" },
    { slug: "find-all-anagrams-in-a-string", title: "Find All Anagrams in a String", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/find-all-anagrams-in-a-string/" },
    { slug: "minimum-size-subarray-sum", title: "Minimum Size Subarray Sum", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/minimum-size-subarray-sum/" },
    { slug: "fruit-into-baskets", title: "Fruit Into Baskets", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/fruit-into-baskets/" },
    { slug: "max-consecutive-ones-iii", title: "Max Consecutive Ones III", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/max-consecutive-ones-iii/" },
    { slug: "minimum-window-substring", title: "Minimum Window Substring", difficulty: "HARD", leetcodeUrl: "https://leetcode.com/problems/minimum-window-substring/" },
  ],
});
