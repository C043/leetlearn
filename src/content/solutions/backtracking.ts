import { defineSolutions } from "./types";

export default defineSolutions({
  "path-sum": {
    idea: "DFS from the root, subtracting each node's value from the remaining target. At a **leaf**, check whether what's left equals the leaf's value.",
    steps: [
      {
        text: "`targetSum = 22`. Pass `remaining = targetSum - root.val` down to each child.",
        visual: {
          kind: "tree",
          values: [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, null, null, 1],
          tones: { good: [0, 1, 3, 8] },
          caption: "5 + 4 + 11 + 2 = 22",
        },
      },
      { text: "Return `self.hasPathSum(root.left, remaining) or self.hasPathSum(root.right, remaining)`. Only leaves can end a path, so a node with a single child isn't a stopping point." },
    ],
    time: "O(n)",
    space: "O(h)",
    pitfalls: ["An empty tree returns `False`, even for `targetSum = 0`."],
  },

  "binary-watch": {
    idea: "The search space is tiny: 12 hours × 60 minutes. Enumerate every time and keep those where `bin(hour).count(\"1\") + bin(minute).count(\"1\") == turnedOn`. Backtracking over the 10 LEDs also works but isn't needed.",
    steps: [
      {
        text: "Each LED is one bit. `3:25` lights hours `2+1` and minutes `16+8+1`, for 5 LEDs.",
        visual: {
          kind: "grid",
          rowLabels: ["hours", "minutes"],
          rows: [[8, 4, 2, 1, "", ""], [32, 16, 8, 4, 2, 1]],
          tones: { accent: [[0, 2], [0, 3], [1, 1], [1, 2], [1, 5]], muted: [[0, 4], [0, 5]] },
        },
      },
      { text: "Format minutes with two digits (`\"3:05\"`, not `\"3:5\"`)." },
    ],
    time: "O(1): 720 candidates",
    space: "O(1)",
  },

  "letter-combinations-of-a-phone-number": {
    idea: "Each digit is a level of a decision tree; each letter on that key is a branch. DFS to depth `len(digits)`; every leaf is one combination.",
    steps: [
      {
        text: "`digits = \"23\"`: 2 gives `abc`, then 3 gives `def`.",
        visual: {
          kind: "ntree",
          root: {
            label: "\"\"",
            children: ["a", "b", "c"].map((c) => ({
              label: c,
              edge: c,
              children: ["d", "e", "f"].map((d) => ({ label: c + d, tone: "good" as const })),
            })),
          },
          caption: "9 leaves = 3 × 3 combinations",
        },
      },
      { text: "Append a letter, recurse, then remove it (backtrack). Return `[]` for empty input." },
    ],
    time: "O(4ⁿ · n)",
    space: "O(n) recursion",
  },

  "subsets": {
    idea: "Every node of the recursion tree is a subset. From a node, extend only with elements **after** the last one used (a `start` index), which yields each subset exactly once.",
    steps: [
      {
        text: "`[1,2,3]`: record the current path at every node, then branch on `index` from `start` to `len(nums) - 1`.",
        visual: {
          kind: "ntree",
          root: {
            label: "[]",
            children: [
              { label: "[1]", children: [{ label: "[1,2]", children: [{ label: "[1,2,3]" }] }, { label: "[1,3]" }] },
              { label: "[2]", children: [{ label: "[2,3]" }] },
              { label: "[3]" },
            ],
          },
          caption: "8 nodes = 2³ subsets",
        },
      },
      { text: "Alternative: iterate bitmasks `0..2ⁿ-1`; bit `i` set means include `nums[i]`." },
    ],
    time: "O(n · 2ⁿ)",
    space: "O(n)",
  },

  "permutations": {
    idea: "Build the permutation position by position. At each step, try every number **not used yet** (track with a boolean array), recurse, then un-use it.",
    steps: [
      {
        text: "`[1,2,3]`: the decision tree has `3 · 2 · 1` leaves.",
        visual: {
          kind: "ntree",
          root: {
            label: "[]",
            children: [1, 2, 3].map((a) => ({
              label: String(a),
              children: [1, 2, 3]
                .filter((b) => b !== a)
                .map((b) => ({
                  label: `${a}${b}`,
                  children: [{ label: `${a}${b}${6 - a - b}`, tone: "good" as const }],
                })),
            })),
          },
        },
      },
      { text: "When `len(path) == len(nums)`, copy it into the result." },
    ],
    time: "O(n · n!)",
    space: "O(n)",
  },

  "combination-sum": {
    idea: "Each candidate can be reused, so recurse with the **same** index after choosing it. To avoid permutations of the same combination, never go back to an earlier index. Sort and stop early once a candidate exceeds the remaining target.",
    steps: [
      {
        text: "`candidates = [2,3,6,7]`, `target = 7`. Nodes show the remaining target.",
        visual: {
          kind: "ntree",
          root: {
            label: "7",
            children: [
              {
                label: "5",
                edge: "2",
                children: [
                  { label: "3", edge: "2", children: [{ label: "1", edge: "2", tone: "bad" }, { label: "0 ✓", edge: "3", tone: "good" }] },
                  { label: "2", edge: "3", tone: "bad" },
                ],
              },
              { label: "4", edge: "3", children: [{ label: "1", edge: "3", tone: "bad" }] },
              { label: "1", edge: "6", tone: "bad" },
              { label: "0 ✓", edge: "7", tone: "good" },
            ],
          },
          caption: "Answers: [2,2,3] and [7]. Red branches die because every remaining candidate is too large",
        },
      },
    ],
    time: "O(N^(T/M)) where T = target, M = min candidate",
    space: "O(T/M)",
  },

  "palindrome-partitioning": {
    idea: "Choose the first piece: try every prefix that **is a palindrome**, then recursively partition the rest. When nothing is left, the pieces form one valid partition.",
    steps: [
      {
        text: "`\"aab\"`. Edges are the chosen prefix; nodes show what remains.",
        visual: {
          kind: "ntree",
          root: {
            label: "aab",
            children: [
              { label: "ab", edge: "a", children: [{ label: "b", edge: "a", children: [{ label: "✓", edge: "b", tone: "good" }] }, { label: "✗", edge: "ab", tone: "bad" }] },
              { label: "b", edge: "aa", children: [{ label: "✓", edge: "b", tone: "good" }] },
              { label: "✗", edge: "aab", tone: "bad" },
            ],
          },
          caption: "[a, a, b] and [aa, b]",
        },
      },
      { text: "Precompute `is_palindrome[start][end]` with DP to make each palindrome check O(1)." },
    ],
    time: "O(n · 2ⁿ)",
    space: "O(n²) for the table",
  },

  "word-search": {
    idea: "DFS from each cell that matches `word[0]`. At each step, move to a neighbor that matches the next letter. Mark the current cell as **visited** so it isn't reused, and unmark it when backtracking.",
    steps: [
      {
        text: "`word = \"ABCCED\"`:",
        visual: {
          kind: "grid",
          rows: [["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]],
          tones: { good: [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2], [2, 1]] },
          caption: "A → B → C → C → E → D",
        },
      },
      { text: "Temporarily overwrite `board[row][column] = \"#\"` instead of a separate visited set, and restore it afterwards." },
    ],
    time: "O(m · n · 3^L)",
    space: "O(L) recursion",
    pitfalls: ["Prune early: if the board lacks enough of some letter, return false before any DFS."],
  },

  "restore-ip-addresses": {
    idea: "Place 3 dots, so choose 4 segments of 1-3 digits each. A segment is valid if it's `≤ 255` and has **no leading zero** (except `\"0\"` itself). Prune when the remaining digits can't fill the remaining segments (each needs 1 to 3).",
    steps: [
      {
        text: "`\"25525511135\"`: one valid split is `255.255.11.135`.",
        visual: {
          kind: "array",
          values: ["2", "5", "5", "2", "5", "5", "1", "1", "1", "3", "5"],
          tones: { accent: [0, 1, 2, 6, 7], good: [3, 4, 5, 8, 9, 10] },
          caption: "Alternating colors are the 4 segments",
        },
      },
      { text: "Recurse with `(start, parts)`. Try lengths 1..3; stop on invalid segments. When `parts_used == 4` and `remaining == 0`, record." },
    ],
    time: "O(3⁴), constant",
    space: "O(1)",
  },

  "n-queens": {
    idea: "Place one queen per row. For each column in the current row, check whether that column, the `row - column` diagonal, or the `row + column` anti-diagonal is already attacked (three hash sets). If not, place, recurse to the next row, and remove.",
    steps: [
      {
        text: "One of the two solutions for `n = 4`:",
        visual: {
          kind: "grid",
          rows: [["", "♛", "", ""], ["", "", "", "♛"], ["♛", "", "", ""], ["", "", "♛", ""]],
          tones: { good: [[0, 1], [1, 3], [2, 0], [3, 2]] },
        },
      },
      { text: "All cells on a diagonal share `row - column`; all on an anti-diagonal share `row + column`. That's how one set covers an entire diagonal." },
    ],
    time: "O(n!)",
    space: "O(n)",
  },
});
