import { defineSolutions } from "./types";

export default defineSolutions({
  "contains-duplicate-ii": {
    idea: "We only care about equal values at most `k` apart, so keep a **set of the last k elements**. That set is the window. If the incoming value is already in it, we found a close duplicate.",
    steps: [
      {
        text: "Walk `i` through the array. Before adding `nums[i]`, check the set.",
        visual: {
          kind: "array",
          values: [1, 2, 3, 1],
          window: [0, 2],
          pointers: [{ at: 3, label: "i" }],
          tones: { good: [0, 3] },
          caption: "k = 3: window {1, 2, 3} already contains 1, so return true",
        },
      },
      { text: "Add `nums[i]`; if the set now has more than `k` items, remove `nums[i - k]`, which just fell out of range." },
    ],
    time: "O(n)",
    space: "O(min(n, k))",
    pitfalls: ["A map of value to last index works too: check `i - last[v] <= k`."],
  },

  "maximum-average-subarray-i": {
    idea: "A fixed-size window: compute the first `k`-sum, then slide one step at a time. **Add** the entering element and **subtract** the leaving one, so each move is O(1).",
    steps: [
      {
        text: "Sum the first `k` elements. Then for `i = k..n-1`: `sum += nums[i] - nums[i - k]` and track the max.",
        visual: {
          kind: "array",
          values: [1, 12, -5, -6, 50, 3],
          window: [1, 4],
          tones: { good: [1, 2, 3, 4] },
          caption: "k = 4: best window sums to 51, so the average is 12.75",
        },
      },
      { text: "Return `maxSum / k`. Divide once at the end to avoid repeated floating-point work." },
    ],
    time: "O(n)",
    space: "O(1)",
  },

  "longest-substring-without-repeating-characters": {
    idea: "Grow the window to the right. When the new character already appears inside the window, jump the left edge just past its previous occurrence. Remembering each character's **last index** makes that jump O(1).",
    steps: [
      {
        text: "`s = \"abcabcbb\"`. Expand `R`; the window `[L, R]` always has unique characters.",
        visual: {
          kind: "array",
          values: ["a", "b", "c", "a", "b", "c", "b", "b"],
          window: [0, 2],
          pointers: [{ at: 0, label: "L" }, { at: 2, label: "R" }],
          tones: { good: [0, 1, 2] },
          caption: "\"abc\": length 3",
        },
      },
      {
        text: "At `R = 3` we see `a` again (last seen at 0), so `L = max(L, last['a'] + 1) = 1`.",
        visual: {
          kind: "array",
          values: ["a", "b", "c", "a", "b", "c", "b", "b"],
          window: [1, 3],
          pointers: [{ at: 1, label: "L" }, { at: 3, label: "R" }],
          tones: { muted: [0], good: [1, 2, 3] },
          caption: "Window \"bca\", still unique",
        },
      },
      { text: "Update `last[s[R]] = R` and `best = max(best, R - L + 1)` each step." },
    ],
    time: "O(n)",
    space: "O(min(n, alphabet))",
    pitfalls: ["Use `max(L, …)` so L never moves **backwards** to a stale index (e.g. `\"abba\"`)."],
  },

  "longest-repeating-character-replacement": {
    idea: "A window can be made all one letter if `length - maxFreq ≤ k`: keep the most common letter and replace the rest. Expand right; when the window breaks that rule, shrink from the left.",
    steps: [
      {
        text: "`s = \"AABABBA\"`, `k = 1`. Track letter counts in the window and the highest count seen.",
        visual: {
          kind: "array",
          values: ["A", "A", "B", "A", "B", "B", "A"],
          window: [0, 3],
          pointers: [{ at: 0, label: "L" }, { at: 3, label: "R" }],
          tones: { good: [0, 1, 3], bad: [2] },
          caption: "\"AABA\": 4 − 3 (A's) = 1 ≤ k. Valid, length 4",
        },
      },
      {
        text: "Adding `B` at `R = 4` gives `5 - 3 = 2 > k`, so move `L` right by one (decrementing its count).",
        visual: {
          kind: "array",
          values: ["A", "A", "B", "A", "B", "B", "A"],
          window: [1, 4],
          pointers: [{ at: 1, label: "L" }, { at: 4, label: "R" }],
          tones: { muted: [0] },
        },
      },
      { text: "The answer is the largest valid window length, which is `4` here." },
    ],
    time: "O(n)",
    space: "O(26)",
    pitfalls: ["`maxFreq` doesn't need to decrease when shrinking: the answer only grows when a truly higher frequency appears."],
  },

  "permutation-in-string": {
    idea: "A permutation of `s1` is any substring of `s2` with **the same letter counts**. Slide a window of length `len(s1)` across `s2` and compare its 26-letter count array to `s1`'s.",
    steps: [
      {
        text: "Count `s1 = \"ab\"`. Slide a length-2 window over `s2 = \"eidbaooo\"`, adding the entering letter and removing the leaving one.",
        visual: {
          kind: "array",
          values: ["e", "i", "d", "b", "a", "o", "o", "o"],
          window: [3, 4],
          tones: { good: [3, 4] },
          caption: "\"ba\" has counts {a:1, b:1}, the same as s1, so return true",
        },
      },
      { text: "To make the comparison O(1), maintain `matches`: how many of the 26 letters currently have equal counts. The window is a permutation when `matches == 26`." },
    ],
    time: "O(n)",
    space: "O(26)",
  },

  "find-all-anagrams-in-a-string": {
    idea: "This is the same as Permutation in String, but instead of returning on the first match, record **every** window start whose letter counts equal `p`'s.",
    steps: [
      {
        text: "Slide a window of size `len(p)` over `s`. `s = \"cbaebabacd\"`, `p = \"abc\"`.",
        visual: {
          kind: "array",
          values: ["c", "b", "a", "e", "b", "a", "b", "a", "c", "d"],
          window: [6, 8],
          tones: { good: [0, 1, 2, 6, 7, 8] },
          caption: "Windows starting at 0 (\"cba\") and 6 (\"bac\") are anagrams, so the answer is [0, 6]",
        },
      },
      { text: "Each slide: increment the count of `s[R]`, decrement the count of `s[R - len(p)]`, then compare." },
    ],
    time: "O(n)",
    space: "O(26)",
  },

  "minimum-size-subarray-sum": {
    idea: "All numbers are positive, so growing a window increases its sum and shrinking decreases it. Expand right until the sum reaches the target, then shrink from the left as far as possible while it still holds, recording the length.",
    steps: [
      {
        text: "`target = 7`, `nums = [2,3,1,2,4,3]`. Expanding to `[2,3,1,2]` hits sum 8. Shrink: drop `2`, then sum 6 < 7, so stop shrinking.",
        visual: {
          kind: "array",
          values: [2, 3, 1, 2, 4, 3],
          window: [0, 3],
          pointers: [{ at: 0, label: "L" }, { at: 3, label: "R" }],
          tones: { accent: [0, 1, 2, 3] },
          caption: "Sum 8 ≥ 7, length 4",
        },
      },
      {
        text: "Continue. The best window is `[4,3]`.",
        visual: {
          kind: "array",
          values: [2, 3, 1, 2, 4, 3],
          window: [4, 5],
          pointers: [{ at: 4, label: "L" }, { at: 5, label: "R" }],
          tones: { good: [4, 5] },
          caption: "Sum 7, length 2: the answer",
        },
      },
      { text: "Return 0 if no window ever reaches the target." },
    ],
    time: "O(n)",
    space: "O(1)",
    pitfalls: ["This trick needs **positive** numbers. With negatives, use prefix sums + a deque instead."],
  },

  "fruit-into-baskets": {
    idea: "Translated: find the longest subarray with **at most 2 distinct values**. Keep counts per fruit type in the window; when a third type appears, shrink from the left until only two remain.",
    steps: [
      {
        text: "`fruits = [1,2,3,2,2]`. When `3` arrives the window `{1,2,3}` has three types, so drop from the left until the `1` is gone.",
        visual: {
          kind: "array",
          values: [1, 2, 3, 2, 2],
          window: [1, 4],
          pointers: [{ at: 1, label: "L" }, { at: 4, label: "R" }],
          tones: { muted: [0], good: [1, 2, 3, 4] },
          caption: "Best window [2,3,2,2]: 4 fruits",
        },
      },
      { text: "Delete a type from the map when its count hits 0, so `map.size` is the distinct count." },
    ],
    time: "O(n)",
    space: "O(1), at most 3 keys",
  },

  "max-consecutive-ones-iii": {
    idea: "Flipping up to `k` zeros means finding the longest window containing **at most k zeros**. Expand right; if zeros exceed `k`, shrink from the left.",
    steps: [
      {
        text: "`k = 2`. Count zeros in the window. When the count hits 3, move `L` past the oldest zero.",
        visual: {
          kind: "array",
          values: [1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0],
          window: [5, 10],
          pointers: [{ at: 5, label: "L" }, { at: 10, label: "R" }],
          tones: { bad: [5, 10], good: [6, 7, 8, 9] },
          caption: "Flip the two red zeros: 6 consecutive ones",
        },
      },
      { text: "Answer = the max window length seen." },
    ],
    time: "O(n)",
    space: "O(1)",
  },

  "minimum-window-substring": {
    idea: "Expand right until the window contains every character of `t` (with multiplicity). Then shrink from the left while it still does, recording the smallest. Track how many required characters are currently satisfied so validity is O(1).",
    steps: [
      {
        text: "`need = {A:1, B:1, C:1}`, `formed = 0`. Expand `R`; when a char's window count reaches its need, `formed++`.",
        visual: {
          kind: "array",
          values: ["A", "D", "O", "B", "E", "C", "O", "D", "E", "B", "A", "N", "C"],
          window: [0, 5],
          pointers: [{ at: 0, label: "L" }, { at: 5, label: "R" }],
          tones: { accent: [0, 3, 5] },
          caption: "\"ADOBEC\" is the first valid window (length 6)",
        },
      },
      {
        text: "While `formed == required`, record the window and shrink from `L`. Removing a needed char breaks validity, so go back to expanding.",
        visual: {
          kind: "array",
          values: ["A", "D", "O", "B", "E", "C", "O", "D", "E", "B", "A", "N", "C"],
          window: [9, 12],
          pointers: [{ at: 9, label: "L" }, { at: 12, label: "R" }],
          tones: { good: [9, 10, 11, 12] },
          caption: "\"BANC\" is the smallest valid window",
        },
      },
    ],
    time: "O(|s| + |t|)",
    space: "O(alphabet)",
    pitfalls: ["`t` can have duplicates (`\"AA\"`), so compare counts, not just presence.", "Store the best `(start, length)`, not the substring, to avoid O(n) copies."],
  },
});
