import { definePattern } from "../types";

export default definePattern({
  slug: "tries",
  name: "Tries",
  description:
    "A tree of characters turns prefix search into a walk down the branch — autocomplete, dictionaries and word boards.",
  order: 16,
  problems: [
    { slug: "longest-common-prefix", title: "Longest Common Prefix", difficulty: "EASY", leetcodeUrl: "https://leetcode.com/problems/longest-common-prefix/" },
    { slug: "check-if-a-word-occurs-as-a-prefix-of-a-word-in-a-sentence", title: "Check if Word Occurs As a Prefix of a Word in a Sentence", difficulty: "EASY", leetcodeUrl: "https://leetcode.com/problems/check-if-a-word-occurs-as-a-prefix-of-a-word-in-a-sentence/" },
    { slug: "implement-trie-prefix-tree", title: "Implement Trie (Prefix Tree)", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/implement-trie-prefix-tree/" },
    { slug: "design-add-and-search-words-data-structure", title: "Design Add and Search Words Data Structure", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/design-add-and-search-words-data-structure/" },
    { slug: "search-suggestions-system", title: "Search Suggestions System", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/search-suggestions-system/" },
    { slug: "replace-words", title: "Replace Words", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/replace-words/" },
    { slug: "map-sum-pairs", title: "Map Sum Pairs", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/map-sum-pairs/" },
    { slug: "stream-of-characters", title: "Stream of Characters", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/stream-of-characters/" },
    { slug: "maximum-xor-of-two-numbers-in-an-array", title: "Maximum XOR of Two Numbers in an Array", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/" },
    { slug: "word-search-ii", title: "Word Search II", difficulty: "HARD", leetcodeUrl: "https://leetcode.com/problems/word-search-ii/" },
  ],
});
