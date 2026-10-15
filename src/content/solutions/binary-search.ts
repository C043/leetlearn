import { defineSolutions } from "./types";

export default defineSolutions({
  "binary-search": {
    idea: "In a sorted array, comparing the target with the middle element tells you which half **cannot** contain it. Discard that half and repeat. The range halves every step.",
    steps: [
      {
        text: "`low = 0`, `high = len(nums) - 1`. `middle = (low + high) // 2`. Target `9`: `nums[2] = 3 < 9`, so the answer is right of middle: `low = middle + 1`.",
        visual: {
          kind: "array",
          values: [-1, 0, 3, 5, 9, 12],
          pointers: [{ at: 0, label: "low" }, { at: 2, label: "middle", tone: "bad" }, { at: 5, label: "high" }],
          tones: { muted: [0, 1, 2] },
          caption: "The grey half is eliminated",
        },
      },
      {
        text: "Now `low = 3`, `high = 5`, `middle = 4`, and `nums[4] = 9`. Found it.",
        visual: {
          kind: "array",
          values: [-1, 0, 3, 5, 9, 12],
          pointers: [{ at: 3, label: "low" }, { at: 4, label: "middle", tone: "good" }, { at: 5, label: "high" }],
          tones: { muted: [0, 1, 2], good: [4] },
        },
      },
      { text: "Loop while `low <= high`; if it ends without a match, return `-1`." },
    ],
    time: "O(log n)",
    space: "O(1)",
    pitfalls: ["Python ints never overflow, but in fixed-width ints `(low + high) / 2` can, so use `low + (high - low) / 2` there."],
  },

  "search-insert-position": {
    idea: "We want the **first index whose value is ≥ target** (the lower bound). If the target exists, that's its index; if not, it's where it would go.",
    steps: [
      {
        text: "Use a half-open range `[low, high)` with `high = len(nums)`. If `nums[middle] >= target`, the answer is at `middle` or left of it: `high = middle`. Else `low = middle + 1`.",
        visual: {
          kind: "array",
          values: [1, 3, 5, 6],
          pointers: [{ at: 1, label: "insert 2 here", tone: "good" }],
          tones: { good: [1] },
          caption: "Target 2: the first value ≥ 2 is 3 at index 1",
        },
      },
      { text: "When `low == high`, return `low`. It may equal `len(nums)` (insert at the end)." },
    ],
    time: "O(log n)",
    space: "O(1)",
  },

  "search-a-2d-matrix": {
    idea: "Each row is sorted and starts after the previous row ends, so the matrix is really **one sorted array of length row_count · column_count** laid out in rows. Binary search over a virtual index `middle` and map it to `(middle // column_count, middle % column_count)`.",
    steps: [
      {
        text: "Search `middle ∈ [0, row_count · column_count - 1]`. Element at `middle` is `matrix[middle // column_count][middle % column_count]`.",
        visual: {
          kind: "grid",
          rows: [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]],
          colLabels: ["0", "1", "2", "3"],
          rowLabels: ["0", "1", "2"],
          tones: { accent: [[1, 1]], good: [[0, 1]] },
          caption: "First middle = 5 is (1, 1) = 11 > 3, so go left; we end at middle = 1, which is (0, 1) = 3",
        },
      },
      { text: "Standard binary search otherwise." },
    ],
    time: "O(log(m·n))",
    space: "O(1)",
  },

  "search-in-rotated-sorted-array": {
    idea: "After a rotation, **one half around `middle` is always sorted**. Check which half is sorted. If the target lies within that half's range, search there; otherwise search the other half.",
    steps: [
      {
        text: "`nums = [4,5,6,7,0,1,2]`, target `0`. `middle = 3` (7). `nums[low] = 4 ≤ 7`, so the **left half is sorted**: `[4..7]`. 0 isn't in it, so `low = middle + 1`.",
        visual: {
          kind: "array",
          values: [4, 5, 6, 7, 0, 1, 2],
          pointers: [{ at: 0, label: "low" }, { at: 3, label: "middle", tone: "bad" }, { at: 6, label: "high" }],
          tones: { muted: [0, 1, 2, 3] },
          caption: "The left half is sorted and doesn't contain 0, so discard it",
        },
      },
      {
        text: "Now `[0,1,2]`: `middle = 5` (1). Left part `[0,1]` is sorted and `0 ≤ 0 < 1`, so `high = middle - 1`. Then `middle = 4` holds 0.",
        visual: {
          kind: "array",
          values: [4, 5, 6, 7, 0, 1, 2],
          pointers: [{ at: 4, label: "found", tone: "good" }],
          tones: { muted: [0, 1, 2, 3, 5, 6], good: [4] },
        },
      },
    ],
    time: "O(log n)",
    space: "O(1)",
    pitfalls: ["Use `nums[low] <= nums[middle]` (with `=`) so a 2-element range is handled correctly."],
  },

  "find-minimum-in-rotated-sorted-array": {
    idea: "Compare `nums[middle]` to `nums[high]`. If `nums[middle] > nums[high]`, the drop (the minimum) is to the right of middle. Otherwise `middle..high` is sorted, so the minimum is at `middle` or left of it.",
    steps: [
      {
        text: "`[3,4,5,1,2]`: `middle = 2` (5) > `nums[high]` (2), so `low = middle + 1`.",
        visual: {
          kind: "array",
          values: [3, 4, 5, 1, 2],
          pointers: [{ at: 0, label: "low" }, { at: 2, label: "middle", tone: "bad" }, { at: 4, label: "high" }],
          tones: { muted: [0, 1, 2] },
        },
      },
      {
        text: "`low = 3`, `high = 4`, `middle = 3` (1) < 2, so `high = middle`. Loop ends at `low == high == 3`.",
        visual: {
          kind: "array",
          values: [3, 4, 5, 1, 2],
          pointers: [{ at: 3, label: "low = high", tone: "good" }],
          tones: { muted: [0, 1, 2], good: [3] },
          caption: "Minimum = 1",
        },
      },
    ],
    time: "O(log n)",
    space: "O(1)",
    pitfalls: ["Loop with `low < high` and use `high = middle` (not `middle - 1`), since middle might be the minimum."],
  },

  "find-peak-element": {
    idea: "If `nums[middle] < nums[middle + 1]`, you're on an **upward slope**, and a peak must exist to the right (the values can't rise forever; treat the position past the end as `-∞`). Otherwise a peak is at `middle` or to the left.",
    steps: [
      {
        text: "`middle = 3` (3) < `nums[4]` (5): climbing, so `low = middle + 1`.",
        visual: {
          kind: "bars",
          values: [1, 2, 1, 3, 5, 6, 4],
          pointers: [{ at: 3, label: "middle" }],
          tones: { accent: [3, 4] },
          caption: "Rising to the right, so a peak is guaranteed on that side",
        },
      },
      {
        text: "Repeat until `low == high`. Here we land on index 5 (value 6).",
        visual: {
          kind: "bars",
          values: [1, 2, 1, 3, 5, 6, 4],
          pointers: [{ at: 5, label: "peak", tone: "good" }],
          tones: { good: [5] },
        },
      },
    ],
    time: "O(log n)",
    space: "O(1)",
  },

  "koko-eating-bananas": {
    idea: "**Binary search on the answer.** If Koko can finish at `speed`, she can at any faster speed. The predicate is monotonic, so find the smallest `speed ∈ [1, max(piles)]` where total hours `Σ ceil(pile / speed) ≤ h`.",
    steps: [
      {
        text: "`piles = [3,6,7,11]`, `h = 8`. Hours per speed:",
        visual: {
          kind: "grid",
          colLabels: ["speed", "hours", "ok?"],
          rows: [[1, 27, "✗"], [2, 15, "✗"], [3, 10, "✗"], [4, 8, "✓"], [5, 8, "✓"], [11, 4, "✓"]],
          tones: { bad: [[0, 2], [1, 2], [2, 2]], good: [[3, 0], [3, 1], [3, 2]] },
          caption: "False…False, True…True: binary search finds the first True, speed = 4",
        },
      },
      { text: "If `hours <= h`, then `high = speed` (try slower); else `low = speed + 1`." },
    ],
    time: "O(n · log(max pile))",
    space: "O(1)",
    pitfalls: ["`ceil(pile / speed)` in integer math is `(pile + speed - 1) // speed`."],
  },

  "capacity-to-ship-packages-within-d-days": {
    idea: "Binary search the ship capacity between `max(weights)` (must fit the heaviest package) and `sum(weights)` (one day). For a candidate capacity, greedily load packages in order and count the days needed.",
    steps: [
      {
        text: "`weights = 1..10`, `days = 5`. Capacity 15 loads as:",
        visual: {
          kind: "grid",
          rowLabels: ["day 1", "day 2", "day 3", "day 4", "day 5"],
          rows: [[1, 2, 3, 4, 5], [6, 7], [8], [9], [10]],
          tones: { good: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]] },
          caption: "5 days, which fits. Capacity 14 would need 6 days, so the answer is 15",
        },
      },
      { text: "If `days_needed(middle) <= days`, then `high = middle`, else `low = middle + 1`. Return `low`." },
    ],
    time: "O(n · log(sum))",
    space: "O(1)",
  },

  "time-based-key-value-store": {
    idea: "Timestamps for each key arrive in **increasing order**, so `set` just appends to that key's lists. `get(key, timestamp)` binary-searches for the **last stored time ≤ timestamp**.",
    steps: [
      {
        text: "Store `times[key]` and `values[key]` as parallel lists, already sorted by time.",
        visual: {
          kind: "array",
          values: ["1:bar", "4:bar2", "7:baz", "10:qux"],
          pointers: [{ at: 2, label: "get(foo, 8)", tone: "good" }],
          tones: { good: [2], muted: [3] },
          caption: "Last timestamp ≤ 8 is 7, so return \"baz\"",
        },
      },
      { text: "`bisect_right` finds the first time `> timestamp` (upper bound); step back one. If that's index `-1`, return `\"\"`." },
    ],
    time: "set O(1), get O(log n)",
    space: "O(total sets)",
  },

  "median-of-two-sorted-arrays": {
    idea: "Cut both arrays so the **left parts together hold half** of all elements and every left element ≤ every right element. Then the median comes from the four values around the cuts. Binary search the cut position `take_from_nums1` in the **shorter** array; `take_from_nums2 = half - take_from_nums1` is forced.",
    steps: [
      {
        text: "A cut is valid when `nums1_left <= nums2_right` and `nums2_left <= nums1_right` (the values on either side of each cut). If `nums1_left > nums2_right`, take fewer from `nums1`; if `nums2_left > nums1_right`, take more.",
        visual: {
          kind: "array",
          values: [1, 3, 8, 9, 15],
          pointers: [{ at: 4, label: "take 4" }],
          tones: { good: [0, 1, 2, 3] },
          caption: "nums1: left part [1,3,8,9]",
        },
      },
      {
        text: "With `half = 6`, `take_from_nums2 = 2`: nums2's left part is `[7, 11]`. Check: `9 ≤ 18` ✓ and `11 ≤ 15` ✓, so the cut is valid.",
        visual: {
          kind: "array",
          values: [7, 11, 18, 19, 21, 25],
          pointers: [{ at: 2, label: "take 2" }],
          tones: { good: [0, 1] },
          caption: "nums2: left part [7,11]",
        },
      },
      { text: "Total is odd (11), so median = `max(nums1_left, nums2_left) = max(9, 11) = 11`. For even totals, average that with `min(nums1_right, nums2_right)`. Use ±∞ for out-of-range indices." },
    ],
    time: "O(log(min(m, n)))",
    space: "O(1)",
    pitfalls: ["Always binary-search the **shorter** array, or `take_from_nums2` can go out of bounds."],
  },
});
