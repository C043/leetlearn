import { defineSolutions } from "./types";

export default defineSolutions({
  "binary-search": {
    idea: "In a sorted array, comparing the target with the middle element tells you which half **cannot** contain it. Discard that half and repeat. The range halves every step.",
    steps: [
      {
        text: "`lo = 0`, `hi = n - 1`. `mid = lo + (hi - lo) / 2`. Target `9`: `nums[2] = 3 < 9`, so the answer is right of mid: `lo = mid + 1`.",
        visual: {
          kind: "array",
          values: [-1, 0, 3, 5, 9, 12],
          pointers: [{ at: 0, label: "lo" }, { at: 2, label: "mid", tone: "bad" }, { at: 5, label: "hi" }],
          tones: { muted: [0, 1, 2] },
          caption: "The grey half is eliminated",
        },
      },
      {
        text: "Now `lo = 3`, `hi = 5`, `mid = 4`, and `nums[4] = 9`. Found it.",
        visual: {
          kind: "array",
          values: [-1, 0, 3, 5, 9, 12],
          pointers: [{ at: 3, label: "lo" }, { at: 4, label: "mid", tone: "good" }, { at: 5, label: "hi" }],
          tones: { muted: [0, 1, 2], good: [4] },
        },
      },
      { text: "Loop while `lo <= hi`; if it ends without a match, return `-1`." },
    ],
    time: "O(log n)",
    space: "O(1)",
    pitfalls: ["`(lo + hi) / 2` can overflow in fixed-width ints, so use `lo + (hi - lo) / 2`."],
  },

  "search-insert-position": {
    idea: "We want the **first index whose value is ≥ target** (the lower bound). If the target exists, that's its index; if not, it's where it would go.",
    steps: [
      {
        text: "Use a half-open range `[lo, hi)` with `hi = n`. If `nums[mid] >= target`, the answer is at `mid` or left of it: `hi = mid`. Else `lo = mid + 1`.",
        visual: {
          kind: "array",
          values: [1, 3, 5, 6],
          pointers: [{ at: 1, label: "insert 2 here", tone: "good" }],
          tones: { good: [1] },
          caption: "Target 2: the first value ≥ 2 is 3 at index 1",
        },
      },
      { text: "When `lo == hi`, return `lo`. It may equal `n` (insert at the end)." },
    ],
    time: "O(log n)",
    space: "O(1)",
  },

  "search-a-2d-matrix": {
    idea: "Each row is sorted and starts after the previous row ends, so the matrix is really **one sorted array of length m·n** laid out in rows. Binary search over virtual index `k` and map it to `(k / n, k % n)`.",
    steps: [
      {
        text: "Search `k ∈ [0, m·n - 1]`. Element at `k` is `matrix[k / n][k % n]`.",
        visual: {
          kind: "grid",
          rows: [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]],
          colLabels: ["0", "1", "2", "3"],
          rowLabels: ["0", "1", "2"],
          tones: { accent: [[1, 1]], good: [[0, 1]] },
          caption: "First mid k = 5 is (1, 1) = 11 > 3, so go left; we end at k = 1 (0, 1) = 3",
        },
      },
      { text: "Standard binary search otherwise." },
    ],
    time: "O(log(m·n))",
    space: "O(1)",
  },

  "search-in-rotated-sorted-array": {
    idea: "After a rotation, **one half around `mid` is always sorted**. Check which half is sorted. If the target lies within that half's range, search there; otherwise search the other half.",
    steps: [
      {
        text: "`nums = [4,5,6,7,0,1,2]`, target `0`. `mid = 3` (7). `nums[lo] = 4 ≤ 7`, so the **left half is sorted**: `[4..7]`. 0 isn't in it, so `lo = mid + 1`.",
        visual: {
          kind: "array",
          values: [4, 5, 6, 7, 0, 1, 2],
          pointers: [{ at: 0, label: "lo" }, { at: 3, label: "mid", tone: "bad" }, { at: 6, label: "hi" }],
          tones: { muted: [0, 1, 2, 3] },
          caption: "The left half is sorted and doesn't contain 0, so discard it",
        },
      },
      {
        text: "Now `[0,1,2]`: `mid = 5` (1). Left part `[0,1]` is sorted and `0 ≤ 0 < 1`, so `hi = mid - 1`. Then `mid = 4` holds 0.",
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
    pitfalls: ["Use `nums[lo] <= nums[mid]` (with `=`) so a 2-element range is handled correctly."],
  },

  "find-minimum-in-rotated-sorted-array": {
    idea: "Compare `nums[mid]` to `nums[hi]`. If `nums[mid] > nums[hi]`, the drop (the minimum) is to the right of mid. Otherwise `mid..hi` is sorted, so the minimum is at `mid` or left of it.",
    steps: [
      {
        text: "`[3,4,5,1,2]`: `mid = 2` (5) > `nums[hi]` (2), so `lo = mid + 1`.",
        visual: {
          kind: "array",
          values: [3, 4, 5, 1, 2],
          pointers: [{ at: 0, label: "lo" }, { at: 2, label: "mid", tone: "bad" }, { at: 4, label: "hi" }],
          tones: { muted: [0, 1, 2] },
        },
      },
      {
        text: "`lo = 3`, `hi = 4`, `mid = 3` (1) < 2, so `hi = mid`. Loop ends at `lo == hi = 3`.",
        visual: {
          kind: "array",
          values: [3, 4, 5, 1, 2],
          pointers: [{ at: 3, label: "lo = hi", tone: "good" }],
          tones: { muted: [0, 1, 2], good: [3] },
          caption: "Minimum = 1",
        },
      },
    ],
    time: "O(log n)",
    space: "O(1)",
    pitfalls: ["Loop with `lo < hi` and use `hi = mid` (not `mid - 1`), since mid might be the minimum."],
  },

  "find-peak-element": {
    idea: "If `nums[mid] < nums[mid + 1]`, you're on an **upward slope**, and a peak must exist to the right (the values can't rise forever; `nums[n] = -∞`). Otherwise a peak is at `mid` or to the left.",
    steps: [
      {
        text: "`mid = 3` (3) < `nums[4]` (5): climbing, so `lo = mid + 1`.",
        visual: {
          kind: "bars",
          values: [1, 2, 1, 3, 5, 6, 4],
          pointers: [{ at: 3, label: "mid" }],
          tones: { accent: [3, 4] },
          caption: "Rising to the right, so a peak is guaranteed on that side",
        },
      },
      {
        text: "Repeat until `lo == hi`. Here we land on index 5 (value 6).",
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
    idea: "**Binary search on the answer.** If Koko can finish at speed `k`, she can at any faster speed. The predicate is monotonic, so find the smallest `k ∈ [1, max(piles)]` where total hours `Σ ceil(p / k) ≤ h`.",
    steps: [
      {
        text: "`piles = [3,6,7,11]`, `h = 8`. Hours per speed:",
        visual: {
          kind: "grid",
          colLabels: ["k", "hours", "ok?"],
          rows: [[1, 27, "✗"], [2, 15, "✗"], [3, 10, "✗"], [4, 8, "✓"], [5, 8, "✓"], [11, 4, "✓"]],
          tones: { bad: [[0, 2], [1, 2], [2, 2]], good: [[3, 0], [3, 1], [3, 2]] },
          caption: "False…False, True…True: binary search finds the first True, k = 4",
        },
      },
      { text: "If `hours(mid) <= h`, then `hi = mid` (try slower); else `lo = mid + 1`." },
    ],
    time: "O(n · log(max pile))",
    space: "O(1)",
    pitfalls: ["`ceil(p / k)` in integer math is `(p + k - 1) / k`."],
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
      { text: "If `daysNeeded(mid) <= days`, then `hi = mid`, else `lo = mid + 1`. Return `lo`." },
    ],
    time: "O(n · log(sum))",
    space: "O(1)",
  },

  "time-based-key-value-store": {
    idea: "Timestamps for each key arrive in **increasing order**, so `set` just appends to that key's list. `get(key, t)` binary-searches for the **last timestamp ≤ t**.",
    steps: [
      {
        text: "Store `key → [(timestamp, value), …]`, already sorted.",
        visual: {
          kind: "array",
          values: ["1:bar", "4:bar2", "7:baz", "10:qux"],
          pointers: [{ at: 2, label: "get(foo, 8)", tone: "good" }],
          tones: { good: [2], muted: [3] },
          caption: "Last timestamp ≤ 8 is 7, so return \"baz\"",
        },
      },
      { text: "Find the first timestamp `> t` (upper bound) and step back one. If that's index `-1`, return `\"\"`." },
    ],
    time: "set O(1), get O(log n)",
    space: "O(total sets)",
  },

  "median-of-two-sorted-arrays": {
    idea: "Cut both arrays so the **left parts together hold half** of all elements and every left element ≤ every right element. Then the median comes from the four values around the cuts. Binary search the cut position `i` in the **shorter** array; `j = half - i` is forced.",
    steps: [
      {
        text: "A cut is valid when `A[i-1] ≤ B[j]` and `B[j-1] ≤ A[i]`. If `A[i-1] > B[j]`, move `i` left; if `B[j-1] > A[i]`, move `i` right.",
        visual: {
          kind: "array",
          values: [1, 3, 8, 9, 15],
          pointers: [{ at: 4, label: "i = 4" }],
          tones: { good: [0, 1, 2, 3] },
          caption: "A: left part [1,3,8,9]",
        },
      },
      {
        text: "With `half = 6`, `j = 2`: B's left part is `[7, 11]`. Check: `9 ≤ 18` ✓ and `11 ≤ 15` ✓, so the cut is valid.",
        visual: {
          kind: "array",
          values: [7, 11, 18, 19, 21, 25],
          pointers: [{ at: 2, label: "j = 2" }],
          tones: { good: [0, 1] },
          caption: "B: left part [7,11]",
        },
      },
      { text: "Total is odd (11), so median = `max(A[i-1], B[j-1]) = max(9, 11) = 11`. For even totals, average that with `min(A[i], B[j])`. Use ±∞ for out-of-range indices." },
    ],
    time: "O(log(min(m, n)))",
    space: "O(1)",
    pitfalls: ["Always binary-search the **shorter** array, or `j` can go out of bounds."],
  },
});
