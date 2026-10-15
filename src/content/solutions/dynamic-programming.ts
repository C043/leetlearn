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
      { text: "Only the last two values are needed, so keep two variables (`previous`, `current`) instead of an array." },
    ],
    time: "O(n)",
    space: "O(1)",
  },

  "min-cost-climbing-stairs": {
    idea: "Let `cheapest[step]` = cheapest cost to **stand on** that step (the top is `step = len(cost)`). You arrive from `step - 1` paying `cost[step - 1]`, or from `step - 2` paying `cost[step - 2]`. Steps 0 and 1 are free starting points.",
    steps: [
      {
        text: "`cost = [10, 15, 20]`:",
        visual: {
          kind: "grid",
          colLabels: ["0", "1", "2", "top"],
          rowLabels: ["cost", "cheapest"],
          rows: [[10, 15, 20, "-"], [0, 0, 10, 15]],
          tones: { good: [[1, 3]], accent: [[0, 1]] },
          caption: "cheapest[3] = min(cheapest[2] + 20, cheapest[1] + 15) = 15",
        },
      },
    ],
    time: "O(n)",
    space: "O(1) with two variables",
  },

  "house-robber": {
    idea: "At each house, either **skip** it (keep `one_back`, the best up to the previous house) or **rob** it (its `money` plus `two_back`, the best up to two houses back): `one_back = max(one_back, two_back + money)`.",
    steps: [
      {
        text: "`nums = [2,7,9,3,1]`:",
        visual: {
          kind: "grid",
          rowLabels: ["nums", "best"],
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
    idea: "Unbounded knapsack: `fewest[value]` = fewest coins summing to `value`. For each value, try every coin as the **last** coin used: `fewest[value] = min(fewest[value - coin] + 1)`.",
    steps: [
      {
        text: "`coins = [1,2,5]`, `amount = 11`. `fewest[0] = 0`, everything else starts at `IMPOSSIBLE` (`amount + 1`, more coins than could ever be needed).",
        visual: {
          kind: "grid",
          colLabels: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"],
          rows: [[0, 1, 1, 2, 2, 1, 2, 2, 3, 3, 2, 3]],
          tones: { accent: [[0, 6], [0, 10]], good: [[0, 11]] },
          caption: "fewest[11] = min(fewest[10], fewest[9], fewest[6]) + 1 = 3, e.g. 5 + 5 + 1",
        },
      },
      { text: "If `fewest[amount]` is still `IMPOSSIBLE` at the end, return `-1`." },
    ],
    time: "O(amount · coins)",
    space: "O(amount)",
    pitfalls: ["Greedy (largest coin first) fails: coins `[1,3,4]`, amount 6 gives 4+1+1 instead of 3+3."],
  },

  "longest-increasing-subsequence": {
    idea: "O(n²) DP: `longest[index]` = longest increasing subsequence ending at `index`. For the O(n log n) version, keep `tails`, where `tails[length]` is the **smallest possible tail** of an increasing subsequence of length `length + 1`. Each number replaces the first tail ≥ it (binary search), or extends the list.",
    steps: [
      {
        text: "`[10,9,2,5,3,7,101,18]`, O(n²) table:",
        visual: {
          kind: "grid",
          rowLabels: ["nums", "longest"],
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
    idea: "You can only move right or down, so paths into a cell come from **above** or from the **left**: `paths[row][column] = paths[row - 1][column] + paths[row][column - 1]`. The first row and column have exactly one path each.",
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
      { text: "One row suffices: `row[column] += row[column - 1]`. Or use combinatorics: `C(m+n-2, m-1)`." },
    ],
    time: "O(m · n)",
    space: "O(n)",
  },

  "partition-equal-subset-sum": {
    idea: "Two equal halves exist iff some subset sums to `total / 2`. This is 0/1 knapsack on booleans: `reachable[value]` is `True` if some subset of the items so far sums to `value`. For each number, update `value` from **high to low** so each item is used once.",
    steps: [
      {
        text: "`[1,5,11,5]`, target 11. Reachable sums after all items:",
        visual: {
          kind: "grid",
          colLabels: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"],
          rows: [["T", "T", "·", "·", "·", "T", "T", "·", "·", "·", "T", "T"]],
          tones: { good: [[0, 11]] },
          caption: "reachable[11] is True: {11} vs {1, 5, 5}",
        },
      },
      { text: "Return `False` immediately if the total is odd." },
    ],
    time: "O(n · sum)",
    space: "O(sum)",
    pitfalls: ["Iterating `value` low → high would reuse the same item multiple times."],
  },

  "decode-ways": {
    idea: "`ways[count]` = ways to decode the first `count` characters. The last piece is either one digit (valid if it isn't `'0'`) or two digits (valid if `10..26`). Add the counts from both options.",
    steps: [
      {
        text: "`s = \"226\"`:",
        visual: {
          kind: "grid",
          colLabels: ["\"\"", "2", "22", "226"],
          rows: [[1, 1, 2, 3]],
          tones: { good: [[0, 3]] },
          caption: "ways[3] = ways[2] (\"6\") + ways[1] (\"26\") = 3: BBF, VF, BZ",
        },
      },
      { text: "`ways[0] = 1` (empty string). Zeros are the tricky part: `\"06\"` has 0 ways." },
    ],
    time: "O(n)",
    space: "O(1)",
  },

  "word-break": {
    idea: "`can_split[end]` is `True` if `s[0:end]` can be segmented. It's true when some earlier split `start` has `can_split[start]` true **and** `s[start:end]` is a dictionary word.",
    steps: [
      {
        text: "`s = \"leetcode\"`, `wordDict = [leet, code]`:",
        visual: {
          kind: "grid",
          colLabels: ["0", "1", "2", "3", "4", "5", "6", "7", "8"],
          rows: [["T", "·", "·", "·", "T", "·", "·", "·", "T"]],
          tones: { accent: [[0, 4]], good: [[0, 8]] },
          caption: "can_split[4]: \"leet\" ✓. can_split[8]: can_split[4] and \"code\" ✓",
        },
      },
      { text: "Only try `start` values at least `end` minus the longest word's length, to skip impossible splits." },
    ],
    time: "O(n²) substring checks",
    space: "O(n)",
  },

  "edit-distance": {
    idea: "`distance[first][second]` = edits to turn `word1[:first]` into `word2[:second]`. If the last characters match, `distance[first][second] = distance[first - 1][second - 1]`. Otherwise take `1 +` the min of **replace** `distance[first - 1][second - 1]`, **delete** `distance[first - 1][second]`, or **insert** `distance[first][second - 1]`.",
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
