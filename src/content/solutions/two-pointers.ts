import { defineSolutions } from "./types";

export default defineSolutions({
  "valid-palindrome": {
    idea: "A palindrome reads the same from both ends, so compare the outermost characters and walk inward. Skip anything that isn't a letter or digit, and compare case-insensitively. No need to build a cleaned copy of the string.",
    steps: [
      {
        text: "Put `left` at the start and `right` at the end. Conceptually we only look at alphanumeric characters, lower-cased: `\"No lemon, no melon\"` becomes the sequence below.",
        visual: {
          kind: "array",
          values: ["n", "o", "l", "e", "m", "o", "n", "n", "o", "m", "e", "l", "o", "n"],
          pointers: [{ at: 0, label: "left" }, { at: 13, label: "right" }],
          tones: { accent: [0, 13] },
          caption: "Compare s[left] and s[right]",
        },
      },
      {
        text: "If `s[left]` is not alphanumeric, move `left` right; if `s[right]` isn't, move `right` left. Otherwise compare them: a mismatch means **not** a palindrome. A match means move both inward.",
        visual: {
          kind: "array",
          values: ["n", "o", "l", "e", "m", "o", "n", "n", "o", "m", "e", "l", "o", "n"],
          pointers: [{ at: 3, label: "left" }, { at: 10, label: "right" }],
          tones: { good: [0, 1, 2, 11, 12, 13], accent: [3, 10] },
          caption: "Green pairs already matched; the pointers keep closing in",
        },
      },
      { text: "When `left >= right` every pair matched, so return `True`." },
    ],
    time: "O(n)",
    space: "O(1)",
    pitfalls: [
      "Digits count as alphanumeric: `\"0P\"` is **not** a palindrome.",
      "Guard the skip loops with `left < right` so they can't run past each other.",
    ],
  },

  "two-sum-ii-input-array-is-sorted": {
    idea: "Because the array is sorted, the sum of the two ends tells you which way to move. Too big? The right value is too large for any partner, so drop it. Too small? The left value is too small for any partner, so drop it. Each step discards one candidate for good.",
    steps: [
      {
        text: "Start with `left = 0`, `right = len(numbers) - 1`. Example: `numbers = [1,3,4,5,7,11]`, `target = 9`. `1 + 11 = 12 > 9`, so `11` can't pair with anything, so `right -= 1`.",
        visual: {
          kind: "array",
          values: [1, 3, 4, 5, 7, 11],
          pointers: [{ at: 0, label: "left" }, { at: 5, label: "right" }],
          tones: { bad: [5] },
          caption: "1 + 11 = 12 > 9, so move right inward",
        },
      },
      {
        text: "Keep going: `1+7=8 < 9` so `left += 1`; `3+7=10 > 9` so `right -= 1`; `3+5=8 < 9` so `left += 1`; `4+5=9`. Found it.",
        visual: {
          kind: "array",
          values: [1, 3, 4, 5, 7, 11],
          pointers: [{ at: 2, label: "left" }, { at: 3, label: "right" }],
          tones: { muted: [0, 1, 4, 5], good: [2, 3] },
          caption: "4 + 5 = 9, so the answer is [3, 4] (1-indexed)",
        },
      },
      { text: "Return `[left + 1, right + 1]` since the problem uses 1-based indices." },
    ],
    time: "O(n)",
    space: "O(1)",
    pitfalls: ["The answer is **1-indexed**.", "A hash map works too, but it costs O(n) space and ignores the sorted order."],
  },

  "container-with-most-water": {
    idea: "Area = `min(height[left], height[right]) * (right - left)`. Start with the widest container. To have any chance at a bigger area, you must move the **shorter** wall inward. Moving the taller one can only shrink the width while the height stays capped by the short wall.",
    steps: [
      {
        text: "Place `left` and `right` at both ends and record the area.",
        visual: {
          kind: "bars",
          values: [1, 8, 6, 2, 5, 4, 8, 3, 7],
          pointers: [{ at: 0, label: "left" }, { at: 8, label: "right" }],
          tones: { accent: [0, 8] },
          caption: "min(1, 7) × 8 = 8. The left wall is the bottleneck, so move left",
        },
      },
      {
        text: "Move whichever pointer has the shorter height. At `left = 1, right = 8` we get `min(8, 7) × 7 = 49`, the best area.",
        visual: {
          kind: "bars",
          values: [1, 8, 6, 2, 5, 4, 8, 3, 7],
          water: [0, 0, 1, 5, 2, 3, 0, 4, 0],
          pointers: [{ at: 1, label: "left" }, { at: 8, label: "right" }],
          tones: { good: [1, 8] },
          caption: "Blue is the water held between the two walls (area 49)",
        },
      },
      { text: "Repeat until the pointers meet, keeping the maximum area seen." },
    ],
    time: "O(n)",
    space: "O(1)",
    pitfalls: ["Width is `right - left`, not `right - left + 1`.", "If heights are equal, moving either one is fine."],
  },

  "3sum": {
    idea: "Sort the array, then fix the first number `nums[first]` and solve **Two Sum II** on the rest for target `-nums[first]` with two pointers. Sorting also makes duplicates adjacent, so they're easy to skip.",
    steps: [
      {
        text: "Sort: `[-1,0,1,2,-1,-4]` becomes `[-4,-1,-1,0,1,2]`. For each `first`, set `left = first + 1`, `right = len(nums) - 1`.",
        visual: {
          kind: "array",
          values: [-4, -1, -1, 0, 1, 2],
          pointers: [{ at: 1, label: "first", tone: "bad" }, { at: 2, label: "left" }, { at: 5, label: "right" }],
          tones: { bad: [1], good: [2, 5] },
          caption: "-1 + (-1) + 2 = 0, so record [-1, -1, 2]",
        },
      },
      {
        text: "If the sum is < 0 move `left` right, if > 0 move `right` left. On a hit, record it, then move both and **skip equal neighbors** so the same triplet isn't added twice.",
        visual: {
          kind: "array",
          values: [-4, -1, -1, 0, 1, 2],
          pointers: [{ at: 1, label: "first", tone: "bad" }, { at: 3, label: "left" }, { at: 4, label: "right" }],
          tones: { bad: [1], good: [3, 4] },
          caption: "-1 + 0 + 1 = 0, so record [-1, 0, 1]",
        },
      },
      { text: "Also skip `first` when `nums[first] == nums[first - 1]`. You can stop early once `nums[first] > 0`, because then no three numbers can sum to zero." },
    ],
    time: "O(n²)",
    space: "O(1) extra (ignoring sort / output)",
    pitfalls: ["Forgetting to dedupe both `first` **and** `left`/`right` produces repeated triplets."],
  },

  "remove-duplicates-from-sorted-array": {
    idea: "Use a slow **write** pointer `unique_count` and a fast **read** pointer `index`. Since the array is sorted, a value is new exactly when it differs from the last value written, `nums[unique_count - 1]`.",
    steps: [
      {
        text: "`unique_count = 1` (the first element is always kept). Scan `index` from 1.",
        visual: {
          kind: "array",
          values: [0, 0, 1, 1, 1, 2, 2, 3, 3, 4],
          pointers: [{ at: 1, label: "unique_count", tone: "good" }, { at: 1, label: "index" }],
          tones: { good: [0] },
        },
      },
      {
        text: "When `nums[index] != nums[unique_count - 1]`, copy it: `nums[unique_count] = nums[index]`, then `unique_count += 1`. Otherwise just advance `index`.",
        visual: {
          kind: "array",
          values: [0, 1, 2, 3, 4, 2, 2, 3, 3, 4],
          pointers: [{ at: 5, label: "unique_count", tone: "good" }],
          tones: { good: [0, 1, 2, 3, 4], muted: [5, 6, 7, 8, 9] },
          caption: "Final state: the first unique_count = 5 slots hold the unique values; the rest doesn't matter",
        },
      },
      { text: "Return `unique_count`." },
    ],
    time: "O(n)",
    space: "O(1)",
  },

  "sort-colors": {
    idea: "Dutch National Flag: keep three regions with pointers `low`, `middle`, `high`. Everything before `low` is 0, between `low` and `middle` is 1, after `high` is 2, and `middle..high` is still unknown. One pass classifies each unknown element.",
    steps: [
      {
        text: "Look at `nums[middle]`. If it's **0**, swap it with `nums[low]`, then `low += 1`, `middle += 1`. If it's **1**, `middle += 1`. If it's **2**, swap with `nums[high]` and `high -= 1`. Don't move `middle` here, because the swapped-in value is unexamined.",
        visual: {
          kind: "array",
          values: [0, 0, 2, 1, 1, 2],
          pointers: [{ at: 2, label: "low", tone: "good" }, { at: 2, label: "middle" }, { at: 4, label: "high", tone: "bad" }],
          tones: { good: [0, 1], accent: [2, 3, 4], bad: [5] },
          caption: "Green = 0s placed, blue = unknown, red = 2s placed",
        },
      },
      {
        text: "Stop when `middle > high`, because then no unknown region is left.",
        visual: { kind: "array", values: [0, 0, 1, 1, 2, 2], tones: { good: [0, 1], bad: [4, 5] } },
      },
    ],
    time: "O(n), one pass",
    space: "O(1)",
    pitfalls: ["Incrementing `middle` after swapping with `high` skips an unchecked value."],
  },

  "4sum": {
    idea: "Same recipe as 3Sum with one more loop: sort, fix two numbers with nested loops `first` and `second`, then two-pointer the remainder. Skip duplicates at every level.",
    steps: [
      {
        text: "Sort `[1,0,-1,0,-2,2]` to `[-2,-1,0,0,1,2]`, target `0`. Fix `first` and `second > first`, then run `left = second + 1`, `right = length - 1`.",
        visual: {
          kind: "array",
          values: [-2, -1, 0, 0, 1, 2],
          pointers: [
            { at: 0, label: "first", tone: "bad" },
            { at: 1, label: "second", tone: "bad" },
            { at: 4, label: "left" },
            { at: 5, label: "right" },
          ],
          tones: { bad: [0, 1], good: [4, 5] },
          caption: "-2 + -1 + 1 + 2 = 0, a quadruplet",
        },
      },
      { text: "Compare the four-sum with the target and move `left`/`right` exactly like Two Sum II. On a hit, record and skip equal neighbors." },
      { text: "Skip `first` if `nums[first] == nums[first - 1]` and skip `second` if `second > first + 1 and nums[second] == nums[second - 1]`." },
    ],
    time: "O(n³)",
    space: "O(1) extra",
    pitfalls: ["Sums can overflow 32-bit ints in Java/C++, so use `long`."],
  },

  "valid-triangle-number": {
    idea: "After sorting, three sides `a ≤ b ≤ c` form a triangle iff `a + b > c`. Fix the largest side `c = nums[largest]` and two-pointer over the prefix. If `nums[left] + nums[right] > c`, then **every** left index in `[left, right)` also works with `right`, so add `right - left` at once.",
    steps: [
      {
        text: "Sort and fix `largest` from the end. `left = 0`, `right = largest - 1`.",
        visual: {
          kind: "array",
          values: [2, 2, 3, 4],
          pointers: [{ at: 0, label: "left" }, { at: 2, label: "right" }, { at: 3, label: "largest", tone: "bad" }],
          tones: { bad: [3], accent: [0, 1, 2] },
          caption: "2 + 3 > 4, so pairs (0,2) and (1,2) both work: count += right − left = 2",
        },
      },
      { text: "If the sum is big enough: `count += right - left`, then `right -= 1`. Otherwise the smallest side is too small: `left += 1`." },
      { text: "Repeat for every `largest`. For `[2,2,3,4]` the total is 3." },
    ],
    time: "O(n²)",
    space: "O(1)",
    pitfalls: ["Zeros can never be a side; sorting handles them naturally since `0 + b > c` fails."],
  },

  "boats-to-save-people": {
    idea: "Sort the weights. The heaviest person always needs a boat, and their best partner is the **lightest** person left: if even the lightest doesn't fit with them, nobody does. So `right` (heaviest) boards every boat, and `left` (lightest) joins whenever `people[left] + people[right] <= limit`.",
    steps: [
      {
        text: "Sort `people = [3, 2, 2, 1]` with `limit = 3`. `left` is the lightest, `right` the heaviest.",
        visual: {
          kind: "array",
          values: [1, 2, 2, 3],
          pointers: [{ at: 0, label: "left" }, { at: 3, label: "right", tone: "bad" }],
          tones: { bad: [3] },
          caption: "1 + 3 > 3: nobody fits with 3, so it sails alone and right -= 1",
        },
      },
      {
        text: "Try the lightest with the next heaviest.",
        visual: {
          kind: "array",
          values: [1, 2, 2, 3],
          pointers: [{ at: 0, label: "left" }, { at: 2, label: "right" }],
          tones: { good: [0, 2] },
          caption: "1 + 2 ≤ 3: they share a boat, so both pointers move",
        },
      },
      { text: "Now `left == right`: the last person takes a boat alone. Total: 3 boats." },
    ],
    time: "O(n log n)",
    space: "O(1) extra",
    pitfalls: ["Loop while `left <= right`, not `<`: when the pointers meet, one person is still on the shore and needs a boat."],
  },

  "trapping-rain-water": {
    idea: "Water above bar `i` = `min(tallest_left, tallest_right) - height[i]`. With two pointers you don't need both arrays: whichever side is currently **shorter** is the limiting one. Its water level is already decided, so settle that side and move inward.",
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
        text: "Keep `left`, `right`, `tallest_left`, `tallest_right`. If `height[left] < height[right]`, the right side has a wall at least as tall as anything on the left, so bar `left` holds `tallest_left - height[left]`; then `left += 1`. Otherwise do the mirror on `right`.",
        visual: {
          kind: "bars",
          values: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
          pointers: [{ at: 4, label: "left" }, { at: 7, label: "right" }],
          tones: { accent: [3, 4], good: [7] },
          caption: "height[left] = 1 < height[right] = 3 and tallest_left = 2, so bar 4 holds 2 − 1 = 1",
        },
      },
      { text: "Update the max **before** computing water (or clamp at 0) and accumulate until `left` meets `right`." },
    ],
    time: "O(n)",
    space: "O(1)",
    pitfalls: ["The prefix/suffix max arrays version is O(n) space and easier to reason about. Use it first if you're stuck."],
  },
});
