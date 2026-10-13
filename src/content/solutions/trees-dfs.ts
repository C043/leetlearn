import { defineSolutions } from "./types";

export default defineSolutions({
  "invert-binary-tree": {
    idea: "A mirrored tree is the root with its **left and right subtrees swapped**, where each subtree is itself mirrored. Recursion does exactly that: swap the children, then invert each.",
    steps: [
      { text: "Before:", visual: { kind: "tree", values: [4, 2, 7, 1, 3, 6, 9] } },
      {
        text: "Swap `root.left` and `root.right`, recurse into both. The result is a left-right mirror image.",
        visual: { kind: "tree", values: [4, 7, 2, 9, 6, 3, 1], tones: { accent: [1, 2] } },
      },
      { text: "Base case: `null` returns `null`. BFS with a queue works equally well." },
    ],
    time: "O(n)",
    space: "O(h) recursion",
  },

  "same-tree": {
    idea: "Two trees are identical iff their roots match **and** their left subtrees are identical **and** their right subtrees are identical. Check structure and values in one recursive pass.",
    steps: [
      {
        text: "Both `null` means true. Exactly one `null`, or different values, means false.",
        visual: { kind: "tree", values: [1, 2, 3], tones: { good: [0, 1, 2] }, caption: "p and q = [1,2,3], so they're the same" },
      },
      { text: "Otherwise return `same(p.left, q.left) && same(p.right, q.right)`." },
    ],
    time: "O(n)",
    space: "O(h)",
  },

  "binary-tree-paths": {
    idea: "DFS from the root carrying the path so far. When you reach a **leaf** (no children), the path is complete, so record it.",
    steps: [
      {
        text: "Two leaves, two root-to-leaf paths.",
        visual: { kind: "tree", values: [1, 2, 3, null, 5], tones: { accent: [0, 1, 4], good: [2] }, caption: "\"1->2->5\" and \"1->3\"" },
      },
      { text: "Pass the path down as a string (immutable, so no undo needed), or use a list and pop after each child (backtracking)." },
    ],
    time: "O(n · h) including string building",
    space: "O(h)",
  },

  "validate-binary-search-tree": {
    idea: "Each node must lie in an **open interval** inherited from all of its ancestors, not just its parent. Going left tightens the upper bound; going right tightens the lower bound.",
    steps: [
      {
        text: "Checking only parent/child misses this: `3` is a valid left child of `6`, but it sits in `5`'s **right** subtree, so it must be `> 5`.",
        visual: { kind: "tree", values: [5, 4, 6, null, null, 3, 7], tones: { bad: [5] }, caption: "Not a BST: 3 violates the bound (5, 6)" },
      },
      { text: "`valid(node, lo, hi)`: `lo < node.val < hi`, then `valid(left, lo, node.val) && valid(right, node.val, hi)`. Start with `(-∞, +∞)`." },
      { text: "Alternative: an inorder traversal of a BST is strictly increasing, so check each value against the previous one." },
    ],
    time: "O(n)",
    space: "O(h)",
    pitfalls: ["Node values can be `INT_MIN`/`INT_MAX`, so use `null`/`long` bounds, not int sentinels."],
  },

  "lowest-common-ancestor-of-a-binary-tree": {
    idea: "Recurse: return a node if it **is** `p` or `q`, otherwise return whatever the subtrees found. The first node where **both** sides return non-null is the split point, which is the LCA.",
    steps: [
      {
        text: "`p = 6`, `q = 4`. The left subtree of `5` finds 6; the right subtree finds 4 (via 2).",
        visual: {
          kind: "tree",
          values: [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4],
          tones: { accent: [3, 10], good: [1] },
          caption: "Both sides non-null at 5, so LCA = 5",
        },
      },
      { text: "If only one side is non-null, pass it up. That also covers the case where `p` is an ancestor of `q`." },
    ],
    time: "O(n)",
    space: "O(h)",
  },

  "path-sum-iii": {
    idea: "Prefix sums on a tree path: a downward path from `a` to `b` sums to `target` iff `prefix(b) - prefix(a's parent) = target`. While doing DFS, keep a map of prefix-sum counts **along the current root path**, and add `count[cur - target]` at every node.",
    steps: [
      {
        text: "`target = 8`. Three paths qualify: `5→3`, `5→2→1`, `-3→11`.",
        visual: {
          kind: "tree",
          values: [10, 5, -3, 3, 2, null, 11, 3, -2, null, 1],
          tones: { good: [1, 3], accent: [2, 6] },
          caption: "At node 3 (prefix 18): 18 − 8 = 10 is in the map (root's prefix), so +1",
        },
      },
      { text: "Seed `count[0] = 1` (a path starting at the root). After visiting both children, **decrement** the current prefix so sibling branches don't see it." },
    ],
    time: "O(n)",
    space: "O(h)",
  },

  "count-good-nodes-in-binary-tree": {
    idea: "A node is good if nothing on its root path is larger. DFS while carrying the **maximum value seen so far**: count the node if `node.val >= maxSoFar`, then pass `max(maxSoFar, node.val)` down.",
    steps: [
      {
        text: "Green nodes are good, red ones aren't.",
        visual: {
          kind: "tree",
          values: [3, 1, 4, 3, null, 1, 5],
          tones: { good: [0, 2, 3, 6], bad: [1, 5] },
          caption: "4 good nodes. The left 3 has path max 3, which equals it, so it counts",
        },
      },
    ],
    time: "O(n)",
    space: "O(h)",
  },

  "construct-binary-tree-from-preorder-and-inorder-traversal": {
    idea: "Preorder's first element is the **root**. Its position in inorder splits the rest into the **left subtree** (everything before) and **right subtree** (everything after). Recurse on those slices.",
    steps: [
      {
        text: "`preorder = [3,9,20,15,7]`: root is 3.",
        visual: { kind: "array", values: [3, 9, 20, 15, 7], tones: { bad: [0], accent: [1], good: [2, 3, 4] }, caption: "preorder: root | left | right" },
      },
      {
        text: "Find 3 in inorder (use a value → index **hash map** for O(1)). One element on the left means the left subtree has size 1.",
        visual: { kind: "array", values: [9, 3, 15, 20, 7], tones: { accent: [0], bad: [1], good: [2, 3, 4] }, caption: "inorder: left | root | right" },
      },
      { text: "Result:", visual: { kind: "tree", values: [3, 9, 20, null, null, 15, 7] } },
    ],
    time: "O(n)",
    space: "O(n)",
    pitfalls: ["Pass index bounds instead of slicing arrays, or the copies make it O(n²)."],
  },

  "unique-binary-search-trees": {
    idea: "Pick each value `i` as the root: values `< i` form the left subtree (`i - 1` nodes) and values `> i` the right (`n - i` nodes). The shapes are independent, so multiply: `G(n) = Σ G(i-1) · G(n-i)`. These are the Catalan numbers.",
    steps: [
      {
        text: "`n = 3`: root 1 gives `G(0)·G(2) = 2`; root 2 gives `G(1)·G(1) = 1`; root 3 gives `G(2)·G(0) = 2`. Total 5.",
        visual: {
          kind: "ntree",
          root: {
            label: "n = 3",
            children: [
              { label: "root 1 → 2", edge: "1" },
              { label: "root 2 → 1", edge: "2" },
              { label: "root 3 → 2", edge: "3" },
            ],
          },
        },
      },
      {
        text: "Fill a DP table bottom-up from `G(0) = G(1) = 1`.",
        visual: { kind: "grid", colLabels: ["0", "1", "2", "3", "4", "5"], rowLabels: ["G"], rows: [[1, 1, 2, 5, 14, 42]], tones: { good: [[0, 3]] } },
      },
    ],
    time: "O(n²)",
    space: "O(n)",
  },

  "binary-tree-maximum-path-sum": {
    idea: "At each node, two different things matter. (1) The best path that **bends** here: `val + max(0, L) + max(0, R)`; update the global answer with it. (2) What the node can **offer its parent**, a single straight branch: `val + max(0, L, R)`.",
    steps: [
      {
        text: "Post-order DFS. Negative branch gains are clipped to 0 (just don't take them).",
        visual: {
          kind: "tree",
          values: [-10, 9, 20, null, null, 15, 7],
          tones: { good: [2, 5, 6], muted: [0] },
          caption: "Best path 15 → 20 → 7 = 42 bends at 20 and doesn't include the root",
        },
      },
      { text: "At 20: gain(left) = 15, gain(right) = 7, so update the answer with `20+15+7 = 42` and return `20 + 15 = 35` to the parent." },
    ],
    time: "O(n)",
    space: "O(h)",
    pitfalls: ["Initialize the answer to `-∞`, not 0: an all-negative tree's answer is its largest node."],
  },
});
