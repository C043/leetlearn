import { definePattern } from "../types";

export default definePattern({
  slug: "tries",
  name: "Tries",
  description:
    "A tree of characters turns prefix search into a walk down the branch — autocomplete, dictionaries and word boards.",
  order: 16,
  problems: [
    {
      slug: "longest-common-prefix",
      title: "Longest Common Prefix",
      difficulty: "EASY",
      leetcodeUrl: "https://leetcode.com/problems/longest-common-prefix/",
      summary:
        "Given a list of strings, return the longest prefix that **all** of them share, or `\"\"` if there is none.",
    },
    {
      slug: "check-if-a-word-occurs-as-a-prefix-of-any-word-in-a-sentence",
      title: "Check If a Word Occurs As a Prefix of Any Word in a Sentence",
      difficulty: "EASY",
      leetcodeUrl: "https://leetcode.com/problems/check-if-a-word-occurs-as-a-prefix-of-any-word-in-a-sentence/",
      summary:
        "Given a `sentence` of words separated by single spaces and a `searchWord`, return the 1-based position of the **first** word that starts with `searchWord`, or `-1`.",
    },
    {
      slug: "implement-trie-prefix-tree",
      title: "Implement Trie (Prefix Tree)",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/implement-trie-prefix-tree/",
      summary:
        "Implement a trie with `insert(word)`, `search(word)` (was this exact word inserted?) and `startsWith(prefix)` (does any inserted word start with it?).",
    },
    {
      slug: "design-add-and-search-words-data-structure",
      title: "Design Add and Search Words Data Structure",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/design-add-and-search-words-data-structure/",
      summary:
        "Design `WordDictionary` with `addWord(word)` and `search(word)`, where the search pattern may contain `.` to match **any single** letter.",
    },
    {
      slug: "search-suggestions-system",
      title: "Search Suggestions System",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/search-suggestions-system/",
      summary:
        "As each character of `searchWord` is typed, suggest up to three `products` that start with the typed prefix, choosing the lexicographically smallest. Return the suggestions after each character.",
    },
    {
      slug: "replace-words",
      title: "Replace Words",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/replace-words/",
      summary:
        "Given a dictionary of roots and a `sentence`, replace every word that starts with a root by the **shortest** such root, and return the new sentence.",
    },
    {
      slug: "map-sum-pairs",
      title: "Map Sum Pairs",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/map-sum-pairs/",
      summary:
        "Design `MapSum`: `insert(key, val)` sets a key's value (overwriting an old one), and `sum(prefix)` returns the total value of all keys that start with `prefix`.",
    },
    {
      slug: "stream-of-characters",
      title: "Stream of Characters",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/stream-of-characters/",
      summary:
        "Given a list of `words`, `StreamChecker.query(letter)` receives letters one at a time and returns `True` if some word is a **suffix** of the letters received so far.",
    },
    {
      slug: "maximum-xor-of-two-numbers-in-an-array",
      title: "Maximum XOR of Two Numbers in an Array",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/",
      summary:
        "Given non-negative integers `nums`, return the maximum value of `nums[i] XOR nums[j]` over all pairs.",
    },
    {
      slug: "word-search-ii",
      title: "Word Search II",
      difficulty: "HARD",
      leetcodeUrl: "https://leetcode.com/problems/word-search-ii/",
      summary:
        "Given a grid of letters and a list of `words`, return every word that can be spelled by moving between horizontally or vertically adjacent cells, using each cell at most once per word.",
    },
  ],
});
