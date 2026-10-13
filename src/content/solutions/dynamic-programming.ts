import { defineSolutions } from "./types";

export default defineSolutions({
  "climbing-stairs": {
    idea: "To stand on step `i`, your last move came from step `i-1` (a 1-step) or `i-2` (a 2-step). So `ways(i) = ways(i-1) + ways(i-2)`, which is Fibonacci.",
    steps: [
      {
        text: "Base: `ways(0) = ways(1) = 1`. Build up:",
        visual: {
          kind: "array",
          values: [1, 1, 2, 3, 5, 8],
          tones: { accent: [3, 4], good: [5] },
          caption: "ways(5) = ways(4) + ways(3) = 5 + 3 = 8",
        },
      },
      { text: "Only the last two values are needed, so keep two variables instead of an array." },
    ],
    time: "O(n)",
    space: "O(1)",
  },

  "min-cost-climbing-stairs": {
    idea: "Let `dp[i]` = cheapest cost to **stand on** step `i` (the top is `i = n`). You arrive from `i-1` paying `cost[i-1]`, or from `i-2` paying `cost[i-2]`. Steps 0 and 1 are free starting points.",
    steps: [
      {
        text: "`cost = [10, 15, 20]`:",
        visual: {
          kind: "grid",
          colLabels: ["0", "1", "2", "top"],
          rowLabels: ["cost", "dp"],
          rows: [[10, 15, 20, "-"], [0, 0, 10, 15]],
          tones: { good: [[1, 3]], accent: [[0, 1]] },
          caption: "dp[3] = min(dp[2] + 20, dp[1] + 15) = 15",
        },
      },
    ],
    time: "O(n)",
    space: "O(1) with two variables",
  },

  "house-robber": {
    idea: "At house `i`, either **skip** it (keep the best up to `i-1`) or **rob** it (its money plus the best up to `i-2`). `dp[i] = max(dp[i-1], dp[i-2] + nums[i])`.",
    steps: [
      {
        text: "`nums = [2,7,9,3,1]`:",
        visual: {
          kind: "grid",
          rowLabels: ["nums", "dp"],
          rows: [[2, 7, 9, 3, 1], [2, 7, 11, 11, 12]],
          tones: { good: [[0, 0], [0, 2], [0, 4], [1, 4]] },
          caption: "Rob houses 0, 2, 4: 2 + 9 + 1 = 12",
        },
      },
    ],
    time: "O(n)",
    space: "O(1)",
  },

  "coin-change": {
    idea: "Unbounded knapsack: `dp[a]` = fewest coins summing to `a`. For each amount, try every coin as the **last** coin used: `dp[a] = min(dp[a - c] + 1)`.",
    steps: [
      {
        text: "`coins = [1,2,5]`, `amount = 11`. `dp[0] = 0`, everything else starts at ∞.",
        visual: {
          kind: "grid",
          colLabels: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"],
          rows: [[0, 1, 1, 2, 2, 1, 2, 2, 3, 3, 2, 3]],
          tones: { accent: [[0, 6], [0, 10]], good: [[0, 11]] },
          caption: "dp[11] = min(dp[10], dp[9], dp[6]) + 1 = 3, e.g. 5 + 5 + 1",
        },
      },
      { text: "If `dp[amount]` is still ∞ at the end, return `-1`." },
    ],
    time: "O(amount · coins)",
    space: "O(amount)",
    pitfalls: ["Greedy (largest coin first) fails: coins `[1,3,4]`, amount 6 gives 4+1+1 instead of 3+3."],
  },

  "longest-increasing-subsequence": {
    idea: "O(n²) DP: `dp[i]` = longest increasing subsequence ending at `i`. For the O(n log n) version, keep `tails`, where `tails[k]` is the **smallest possible tail** of an increasing subsequence of length `k+1`. Each number replaces the first tail ≥ it (binary search), or extends the list.",
    steps: [
      {
        text: "`[10,9,2,5,3,7,101,18]`, O(n²) table:",
        visual: {
          kind: "grid",
          rowLabels: ["nums", "dp"],
          rows: [[10, 9, 2, 5, 3, 7, 101, 18], [1, 1, 1, 2, 2, 3, 4, 4]],
          tones: { good: [[0, 2], [0, 4], [0, 5], [0, 7]] },
          caption: "One LIS: 2, 3, 7, 18 (length 4)",
        },
      },
      {
        text: "`tails` after processing everything. `18` replaced `101` because a smaller tail leaves more room to extend.",
        visual: { kind: "array", values: [2, 3, 7, 18], tones: { accent: [3] }, caption: "Length of tails = 4" },
      },
    ],
    time: "O(n log n)",
    space: "O(n)",
    pitfalls: ["`tails` is not necessarily a real subsequence; only its length is meaningful."],
  },

  "unique-paths": {
    idea: "You can only move right or down, so paths into a cell come from **above** or from the **left**: `dp[r][c] = dp[r-1][c] + dp[r][c-1]`. The first row and column have exactly one path each.",
    steps: [
      {
        text: "`m = 3`, `n = 7`:",
        visual: {
          kind: "grid",
          rows: [[1, 1, 1, 1, 1, 1, 1], [1, 2, 3, 4, 5, 6, 7], [1, 3, 6, 10, 15, 21, 28]],
          tones: { accent: [[1, 6], [2, 5]], good: [[2, 6]] },
          caption: "28 = 7 (above) + 21 (left)",
        },
      },
      { text: "One row suffices: `row[c] += row[c-1]`. Or use combinatorics: `C(m+n-2, m-1)`." },
    ],
    time: "O(m · n)",
    space: "O(n)",
  },

  "partition-equal-subset-sum": {
    idea: "Two equal halves exist iff some subset sums to `total / 2`. This is 0/1 knapsack on booleans: `can[s]` is true if some subset of the items so far sums to `s`. For each number, update `s` from **high to low** so each item is used once.",
    steps: [
      {
        text: "`[1,5,11,5]`, target 11. Reachable sums after all items:",
        visual: {
          kind: "grid",
          colLabels: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"],
          rows: [["T", "T", "·", "·", "·", "T", "T", "·", "·", "·", "T", "T"]],
          tones: { good: [[0, 11]] },
          caption: "can[11] is true: {11} vs {1, 5, 5}",
        },
      },
      { text: "Return false immediately if the total is odd." },
    ],
    time: "O(n · sum)",
    space: "O(sum)",
    pitfalls: ["Iterating `s` low → high would reuse the same item multiple times."],
  },

  "decode-ways": {
    idea: "`dp[i]` = ways to decode the first `i` characters. The last piece is either one digit (valid if it isn't `'0'`) or two digits (valid if `10..26`). Add the counts from both options.",
    steps: [
      {
        text: "`s = \"226\"`:",
        visual: {
          kind: "grid",
          colLabels: ["\"\"", "2", "22", "226"],
          rows: [[1, 1, 2, 3]],
          tones: { good: [[0, 3]] },
          caption: "dp[3] = dp[2] (\"6\") + dp[1] (\"26\") = 3: BBF, VF, BZ",
        },
      },
      { text: "`dp[0] = 1` (empty string). Zeros are the tricky part: `\"06\"` has 0 ways." },
    ],
    time: "O(n)",
    space: "O(1)",
  },

  "word-break": {
    idea: "`dp[i]` is true if `s[0:i]` can be segmented. It's true when some earlier split `j` has `dp[j]` true **and** `s[j:i]` is a dictionary word.",
    steps: [
      {
        text: "`s = \"leetcode\"`, `dict = {leet, code}`:",
        visual: {
          kind: "grid",
          colLabels: ["0", "1", "2", "3", "4", "5", "6", "7", "8"],
          rows: [["T", "·", "·", "·", "T", "·", "·", "·", "T"]],
          tones: { accent: [[0, 4]], good: [[0, 8]] },
          caption: "dp[4]: \"leet\" ✓. dp[8]: dp[4] and \"code\" ✓",
        },
      },
      { text: "Limit `j` to `i - maxWordLen` to skip impossible splits." },
    ],
    time: "O(n²) substring checks",
    space: "O(n)",
  },

  "edit-distance": {
    idea: "`dp[i][j]` = edits to turn `a[0:i]` into `b[0:j]`. If the last characters match, `dp[i][j] = dp[i-1][j-1]`. Otherwise take `1 +` the min of **replace** `dp[i-1][j-1]`, **delete** `dp[i-1][j]`, or **insert** `dp[i][j-1]`.",
    steps: [
      {
        text: "`horse → ros`. The first row and column are just counts of inserts and deletes.",
        visual: {
          kind: "grid",
          colLabels: ["∅", "r", "o", "s"],
          rowLabels: ["∅", "h", "o", "r", "s", "e"],
          rows: [[0, 1, 2, 3], [1, 1, 2, 3], [2, 2, 1, 2], [3, 2, 2, 2], [4, 3, 3, 2], [5, 4, 4, 3]],
          tones: { accent: [[1, 1], [2, 2], [3, 2], [4, 3]], good: [[5, 3]] },
          caption: "Path: replace h→r, keep o, delete r, keep s, delete e = 3",
        },
      },
    ],
    time: "O(m · n)",
    space: "O(min(m, n)) with rolling rows",
  },
});
