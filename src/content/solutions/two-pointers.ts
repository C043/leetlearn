import { defineSolutions } from "./types";

export default defineSolutions({
  "valid-palindrome": {
    idea: "A palindrome reads the same from both ends, so compare the outermost characters and walk inward. Skip anything that isn't a letter or digit, and compare case-insensitively. No need to build a cleaned copy of the string.",
    steps: [
      {
        text: "Put `L` at the start and `R` at the end. Conceptually we only look at alphanumeric characters, lower-cased: `\"No lemon, no melon\"` becomes the sequence below.",
        visual: {
          kind: "array",
          values: ["n", "o", "l", "e", "m", "o", "n", "n", "o", "m", "e", "l", "o", "n"],
          pointers: [{ at: 0, label: "L" }, { at: 13, label: "R" }],
          tones: { accent: [0, 13] },
          caption: "Compare s[L] and s[R]",
        },
      },
      {
        text: "If `s[L]` is not alphanumeric, move `L` right; if `s[R]` isn't, move `R` left. Otherwise compare them: a mismatch means **not** a palindrome. A match means move both inward.",
        visual: {
          kind: "array",
          values: ["n", "o", "l", "e", "m", "o", "n", "n", "o", "m", "e", "l", "o", "n"],
          pointers: [{ at: 3, label: "L" }, { at: 10, label: "R" }],
          tones: { good: [0, 1, 2, 11, 12, 13], accent: [3, 10] },
          caption: "Green pairs already matched; the pointers keep closing in",
        },
      },
      { text: "When `L >= R` every pair matched, so return `true`." },
    ],
    time: "O(n)",
    space: "O(1)",
    pitfalls: [
      "Digits count as alphanumeric: `\"0P\"` is **not** a palindrome.",
      "Guard the skip loops with `L < R` so they can't run past each other.",
    ],
  },

  "two-sum-ii-input-array-is-sorted": {
    idea: "Because the array is sorted, the sum of the two ends tells you which way to move. Too big? The right value is too large for any partner, so drop it. Too small? The left value is too small for any partner, so drop it. Each step discards one candidate for good.",
    steps: [
      {
        text: "Start with `L = 0`, `R = n - 1`. Example: `numbers = [1,3,4,5,7,11]`, `target = 9`. `1 + 11 = 12 > 9`, so `11` can't pair with anything, so `R--`.",
        visual: {
          kind: "array",
          values: [1, 3, 4, 5, 7, 11],
          pointers: [{ at: 0, label: "L" }, { at: 5, label: "R" }],
          tones: { bad: [5] },
          caption: "1 + 11 = 12 > 9, so move R left",
        },
      },
      {
        text: "Keep going: `1+7=8 < 9` so `L++`; `3+7=10 > 9` so `R--`; `3+5=8 < 9` so `L++`; `4+5=9`. Found it.",
        visual: {
          kind: "array",
          values: [1, 3, 4, 5, 7, 11],
          pointers: [{ at: 2, label: "L" }, { at: 3, label: "R" }],
          tones: { muted: [0, 1, 4, 5], good: [2, 3] },
          caption: "4 + 5 = 9, so the answer is [3, 4] (1-indexed)",
        },
      },
      { text: "Return `[L + 1, R + 1]` since the problem uses 1-based indices." },
    ],
    time: "O(n)",
    space: "O(1)",
    pitfalls: ["The answer is **1-indexed**.", "A hash map works too, but it costs O(n) space and ignores the sorted order."],
  },

  "container-with-most-water": {
    idea: "Area = `min(h[L], h[R]) * (R - L)`. Start with the widest container. To have any chance at a bigger area, you must move the **shorter** wall inward. Moving the taller one can only shrink the width while the height stays capped by the short wall.",
    steps: [
      {
        text: "Place `L` and `R` at both ends and record the area.",
        visual: {
          kind: "bars",
          values: [1, 8, 6, 2, 5, 4, 8, 3, 7],
          pointers: [{ at: 0, label: "L" }, { at: 8, label: "R" }],
          tones: { accent: [0, 8] },
          caption: "min(1, 7) × 8 = 8. The left wall is the bottleneck, so move L",
        },
      },
      {
        text: "Move whichever pointer has the shorter height. At `L = 1, R = 8` we get `min(8, 7) × 7 = 49`, the best area.",
        visual: {
          kind: "bars",
          values: [1, 8, 6, 2, 5, 4, 8, 3, 7],
          water: [0, 0, 1, 5, 2, 3, 0, 4, 0],
          pointers: [{ at: 1, label: "L" }, { at: 8, label: "R" }],
          tones: { good: [1, 8] },
          caption: "Blue is the water held between the two walls (area 49)",
        },
      },
      { text: "Repeat until the pointers meet, keeping the maximum area seen." },
    ],
    time: "O(n)",
    space: "O(1)",
    pitfalls: ["Width is `R - L`, not `R - L + 1`.", "If heights are equal, moving either one is fine."],
  },

  "3sum": {
    idea: "Sort the array, then fix the first number `nums[i]` and solve **Two Sum II** on the rest for target `-nums[i]` with two pointers. Sorting also makes duplicates adjacent, so they're easy to skip.",
    steps: [
      {
        text: "Sort: `[-1,0,1,2,-1,-4]` becomes `[-4,-1,-1,0,1,2]`. For each `i`, set `L = i + 1`, `R = n - 1`.",
        visual: {
          kind: "array",
          values: [-4, -1, -1, 0, 1, 2],
          pointers: [{ at: 1, label: "i", tone: "bad" }, { at: 2, label: "L" }, { at: 5, label: "R" }],
          tones: { bad: [1], good: [2, 5] },
          caption: "-1 + (-1) + 2 = 0, so record [-1, -1, 2]",
        },
      },
      {
        text: "If the sum is < 0 move `L` right, if > 0 move `R` left. On a hit, record it, then move both and **skip equal neighbors** so the same triplet isn't added twice.",
        visual: {
          kind: "array",
          values: [-4, -1, -1, 0, 1, 2],
          pointers: [{ at: 1, label: "i", tone: "bad" }, { at: 3, label: "L" }, { at: 4, label: "R" }],
          tones: { bad: [1], good: [3, 4] },
          caption: "-1 + 0 + 1 = 0, so record [-1, 0, 1]",
        },
      },
      { text: "Also skip `i` when `nums[i] == nums[i-1]`. You can stop early once `nums[i] > 0`, because then no three numbers can sum to zero." },
    ],
    time: "O(n²)",
    space: "O(1) extra (ignoring sort / output)",
    pitfalls: ["Forgetting to dedupe both `i` **and** `L`/`R` produces repeated triplets."],
  },

  "remove-duplicates-from-sorted-array": {
    idea: "Use a slow **write** pointer `k` and a fast **read** pointer `i`. Since the array is sorted, a value is new exactly when it differs from the last value written, `nums[k-1]`.",
    steps: [
      {
        text: "`k = 1` (the first element is always kept). Scan `i` from 1.",
        visual: {
          kind: "array",
          values: [0, 0, 1, 1, 1, 2, 2, 3, 3, 4],
          pointers: [{ at: 1, label: "k", tone: "good" }, { at: 1, label: "i" }],
          tones: { good: [0] },
        },
      },
      {
        text: "When `nums[i] != nums[k-1]`, copy it: `nums[k] = nums[i]; k++`. Otherwise just advance `i`.",
        visual: {
          kind: "array",
          values: [0, 1, 2, 3, 4, 2, 2, 3, 3, 4],
          pointers: [{ at: 5, label: "k", tone: "good" }],
          tones: { good: [0, 1, 2, 3, 4], muted: [5, 6, 7, 8, 9] },
          caption: "Final state: the first k = 5 slots hold the unique values; the rest doesn't matter",
        },
      },
      { text: "Return `k`." },
    ],
    time: "O(n)",
    space: "O(1)",
  },

  "sort-colors": {
    idea: "Dutch National Flag: keep three regions with pointers `low`, `mid`, `high`. Everything before `low` is 0, between `low` and `mid` is 1, after `high` is 2, and `mid..high` is still unknown. One pass classifies each unknown element.",
    steps: [
      {
        text: "Look at `nums[mid]`. If it's **0**, swap it with `nums[low]`, then `low++`, `mid++`. If it's **1**, `mid++`. If it's **2**, swap with `nums[high]` and `high--`. Don't move `mid` here, because the swapped-in value is unexamined.",
        visual: {
          kind: "array",
          values: [0, 0, 2, 1, 1, 2],
          pointers: [{ at: 2, label: "low", tone: "good" }, { at: 2, label: "mid" }, { at: 4, label: "high", tone: "bad" }],
          tones: { good: [0, 1], accent: [2, 3, 4], bad: [5] },
          caption: "Green = 0s placed, blue = unknown, red = 2s placed",
        },
      },
      {
        text: "Stop when `mid > high`, because then no unknown region is left.",
        visual: { kind: "array", values: [0, 0, 1, 1, 2, 2], tones: { good: [0, 1], bad: [4, 5] } },
      },
    ],
    time: "O(n), one pass",
    space: "O(1)",
    pitfalls: ["Incrementing `mid` after swapping with `high` skips an unchecked value."],
  },

  "4sum": {
    idea: "Same recipe as 3Sum with one more loop: sort, fix two numbers with nested loops `i` and `j`, then two-pointer the remainder. Skip duplicates at every level.",
    steps: [
      {
        text: "Sort `[1,0,-1,0,-2,2]` to `[-2,-1,0,0,1,2]`, target `0`. Fix `i` and `j > i`, then run `L = j+1`, `R = n-1`.",
        visual: {
          kind: "array",
          values: [-2, -1, 0, 0, 1, 2],
          pointers: [
            { at: 0, label: "i", tone: "bad" },
            { at: 1, label: "j", tone: "bad" },
            { at: 4, label: "L" },
            { at: 5, label: "R" },
          ],
          tones: { bad: [0, 1], good: [4, 5] },
          caption: "-2 + -1 + 1 + 2 = 0, a quadruplet",
        },
      },
      { text: "Compare the four-sum with the target and move `L`/`R` exactly like Two Sum II. On a hit, record and skip equal neighbors." },
      { text: "Skip `i` if `nums[i] == nums[i-1]` and skip `j` if `j > i+1 && nums[j] == nums[j-1]`." },
    ],
    time: "O(n³)",
    space: "O(1) extra",
    pitfalls: ["Sums can overflow 32-bit ints in Java/C++, so use `long`."],
  },

  "valid-triangle-number": {
    idea: "After sorting, three sides `a ≤ b ≤ c` form a triangle iff `a + b > c`. Fix the largest side `c = nums[k]` and two-pointer over the prefix. If `nums[L] + nums[R] > c`, then **every** `L' ∈ [L, R)` also works with `R`, so add `R - L` at once.",
    steps: [
      {
        text: "Sort and fix `k` from the end. `L = 0`, `R = k - 1`.",
        visual: {
          kind: "array",
          values: [2, 2, 3, 4],
          pointers: [{ at: 0, label: "L" }, { at: 2, label: "R" }, { at: 3, label: "k", tone: "bad" }],
          tones: { bad: [3], accent: [0, 1, 2] },
          caption: "2 + 3 > 4, so pairs (0,2) and (1,2) both work: count += R − L = 2",
        },
      },
      { text: "If the sum is big enough: `count += R - L; R--`. Otherwise the smallest side is too small: `L++`." },
      { text: "Repeat for every `k`. For `[2,2,3,4]` the total is 3." },
    ],
    time: "O(n²)",
    space: "O(1)",
    pitfalls: ["Zeros can never be a side; sorting handles them naturally since `0 + b > c` fails."],
  },

  "most-common-word": {
    idea: "Normalize the text (lower-case, punctuation becomes spaces), split it into words, count them in a hash map while ignoring banned words, then take the maximum.",
    steps: [
      {
        text: "Tokenize `\"Bob hit a ball, the hit BALL flew far after it was hit.\"` with `banned = [\"hit\"]`.",
        visual: {
          kind: "array",
          values: ["bob", "hit", "a", "ball", "the", "hit", "ball", "flew", "far", "after", "it", "was", "hit"],
          indices: false,
          tones: { bad: [1, 5, 12], good: [3, 6] },
          caption: "Red words are banned and skipped; green is the winner",
        },
      },
      {
        text: "Count with a map, skipping words in a `banned` **set** (O(1) lookup).",
        visual: {
          kind: "grid",
          colLabels: ["word", "count"],
          rows: [["ball", 2], ["bob", 1], ["a", 1], ["the", 1], ["…", "…"]],
          tones: { good: [[0, 0], [0, 1]] },
        },
      },
      { text: "Return the word with the highest count: `\"ball\"`." },
    ],
    time: "O(n + b)",
    space: "O(n + b)",
    pitfalls: ["Punctuation like `\"ball,\"` must become `\"ball\"`, so replace non-letters with spaces before splitting."],
  },

  "trapping-rain-water": {
    idea: "Water above bar `i` = `min(maxLeft, maxRight) - h[i]`. With two pointers you don't need both arrays: whichever side is currently **shorter** is the limiting one. Its water level is already decided, so settle that side and move inward.",
    steps: [
      {
        text: "For each bar the water level is capped by the shorter of the tallest walls on each side.",
        visual: {
          kind: "bars",
          values: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
          water: [0, 0, 1, 0, 1, 2, 1, 0, 0, 1, 0, 0],
          caption: "Total trapped water = 6",
        },
      },
      {
        text: "Keep `L`, `R`, `leftMax`, `rightMax`. If `h[L] < h[R]`, the right side has a wall at least as tall as anything on the left, so bar `L` holds `leftMax - h[L]`; then `L++`. Otherwise do the mirror on `R`.",
        visual: {
          kind: "bars",
          values: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
          pointers: [{ at: 4, label: "L" }, { at: 7, label: "R" }],
          tones: { accent: [3, 4], good: [7] },
          caption: "h[L] = 1 < h[R] = 3 and leftMax = 2, so bar 4 holds 2 − 1 = 1",
        },
      },
      { text: "Update the max **before** computing water (or clamp at 0) and accumulate until `L` meets `R`." },
    ],
    time: "O(n)",
    space: "O(1)",
    pitfalls: ["The prefix/suffix max arrays version is O(n) space and easier to reason about. Use it first if you're stuck."],
  },
});
