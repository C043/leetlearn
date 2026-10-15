import { defineSolutions } from "./types";

export default defineSolutions({
  "binary-tree-level-order-traversal-ii": {
    idea: "Do a normal level-order BFS, collecting each level as a list, then **reverse the list of levels** (or insert each level at the front).",
    steps: [
      { text: "BFS visits levels top-down:", visual: { kind: "tree", values: [3, 9, 20, null, null, 15, 7], tones: { good: [5, 6] } } },
      {
        text: "Reverse to get bottom-up order.",
        visual: { kind: "grid", rowLabels: ["0", "1", "2"], rows: [[15, 7], [9, 20], [3]], tones: { good: [[0, 0], [0, 1]] } },
      },
    ],
    time: "O(n)",
    space: "O(n)",
  },

  "maximum-depth-of-binary-tree": {
    idea: "Depth = number of levels. Either BFS and count levels, or recurse: `maxDepth(root) = 1 + max(maxDepth(root.left), maxDepth(root.right))`, with `maxDepth(None) = 0`.",
    steps: [
      {
        text: "Each BFS round drains one full level from the queue, so count the rounds.",
        visual: { kind: "tree", values: [3, 9, 20, null, null, 15, 7], tones: { accent: [0], good: [1, 2], bad: [5, 6] }, caption: "3 levels, so depth = 3" },
      },
    ],
    time: "O(n)",
    space: "O(w) BFS width / O(h) DFS",
  },

  "binary-tree-level-order-traversal": {
    idea: "BFS with a queue, but process the queue **one level at a time**: loop `for _ in range(len(queue))`: the length is read once at the start of a round, so it pops exactly that level's nodes. Their children form the next level.",
    steps: [
      {
        text: "Round 1 pops `3` and pushes `9, 20`. Round 2 pops both and pushes `15, 7`.",
        visual: { kind: "tree", values: [3, 9, 20, null, null, 15, 7], tones: { accent: [1, 2] } },
      },
      { text: "Result:", visual: { kind: "grid", rowLabels: ["0", "1", "2"], rows: [[3], [9, 20], [15, 7]] } },
    ],
    time: "O(n)",
    space: "O(n)",
  },

  "binary-tree-zigzag-level-order-traversal": {
    idea: "Same level-by-level BFS, but **reverse every other level** before adding it (or fill each level's array from the back when going right-to-left).",
    steps: [
      { text: "Normal BFS levels:", visual: { kind: "tree", values: [1, 2, 3, 4, 5, 6, 7] } },
      {
        text: "Flip odd levels.",
        visual: { kind: "grid", rowLabels: ["→", "←", "→"], rows: [[1], [3, 2], [4, 5, 6, 7]], tones: { accent: [[1, 0], [1, 1]] } },
      },
    ],
    time: "O(n)",
    space: "O(n)",
  },

  "binary-tree-right-side-view": {
    idea: "From the right you see the **last node of each level**. BFS level by level and keep the final node popped in each round.",
    steps: [
      {
        text: "Visibility depends only on being the last node in its level, not on which subtree it belongs to.",
        visual: { kind: "tree", values: [1, 2, 3, null, 5, null, 4], tones: { good: [0, 2, 6] }, caption: "Right side view: [1, 3, 4]" },
      },
      {
        text: "If the right subtree is shorter, a left node becomes visible:",
        visual: { kind: "tree", values: [1, 2, 3, 4], tones: { good: [0, 2, 3] }, caption: "[1, 3, 4]: 4 is a left-subtree node" },
      },
      { text: "DFS alternative: visit right child first and record the first node seen at each new depth." },
    ],
    time: "O(n)",
    space: "O(w)",
  },

  "populating-next-right-pointers-in-each-node": {
    idea: "The tree is **perfect**, so once a level's `next` pointers are set, you can walk that level like a linked list and wire up the level below. No queue needed: O(1) extra space.",
    steps: [
      {
        text: "For each node on the current level: `node.left.next = node.right`, and, if `node.next` exists, `node.right.next = node.next.left`.",
        visual: { kind: "tree", values: [1, 2, 3, 4, 5, 6, 7], tones: { accent: [1, 2], good: [4, 5] }, caption: "5.next = 2.next.left = 6, which crosses parents" },
      },
      {
        text: "Then drop to `leftmost = leftmost.left` and repeat.",
        visual: { kind: "grid", rows: [[1, "∅"], [2, 3, "∅"], [4, 5, 6, 7, "∅"]], caption: "Each row is linked left → right by next" },
      },
    ],
    time: "O(n)",
    space: "O(1)",
  },

  "count-complete-tree-nodes": {
    idea: "Compare the depth going always-left with the depth going always-right. If they're equal, the subtree is **perfect**, so it has `2^left_depth - 1` nodes with no traversal. Otherwise recurse into both children; only one of them can be imperfect.",
    steps: [
      {
        text: "Root: left depth 3, right depth 2, so recurse.",
        visual: { kind: "tree", values: [1, 2, 3, 4, 5, 6], tones: { good: [1, 3, 4], accent: [2, 5] } },
      },
      { text: "Left subtree (2) is perfect: `2² - 1 = 3`. Right subtree (3) recurses once more: `1 + 1 + 0 = 2`. Total `1 + 3 + 2 = 6`." },
    ],
    time: "O(log² n)",
    space: "O(log n)",
  },

  "maximum-level-sum-of-a-binary-tree": {
    idea: "BFS level by level, summing each level. Track the level (1-indexed) with the **largest** sum; on ties keep the smallest level.",
    steps: [
      {
        text: "Level sums: `1`, `7 + 0 = 7`, `7 + (-8) = -1`.",
        visual: { kind: "tree", values: [1, 7, 0, 7, -8], tones: { good: [1, 2] }, caption: "Answer: level 2" },
      },
    ],
    time: "O(n)",
    space: "O(w)",
    pitfalls: ["Sums can be negative, so initialize the best to `-∞`, not 0."],
  },

  "find-largest-value-in-each-tree-row": {
    idea: "Level-order BFS; for each level take the max of its values.",
    steps: [
      {
        text: "Max per row: 1, 3, 9.",
        visual: { kind: "tree", values: [1, 3, 2, 5, 3, null, 9], tones: { good: [0, 1, 6] }, caption: "[1, 3, 9]" },
      },
    ],
    time: "O(n)",
    space: "O(w)",
  },

  "serialize-and-deserialize-binary-tree": {
    idea: "Write the tree as BFS order with an explicit marker (`#`) for every missing child. Deserialize by reading tokens with a queue of parents: each parent consumes the **next two** tokens as its left and right children.",
    steps: [
      {
        text: "Serialize with BFS, emitting `#` for missing children (`None`):",
        visual: { kind: "tree", values: [1, 2, 3, null, null, 4, 5] },
      },
      {
        text: "Tokens:",
        visual: {
          kind: "array",
          values: [1, 2, 3, "#", "#", 4, 5, "#", "#", "#", "#"],
          tones: { muted: [3, 4, 7, 8, 9, 10] },
          caption: "\"1,2,3,#,#,4,5,#,#,#,#\"",
        },
      },
      { text: "Deserialize: `root` = token 0; `parents = deque([root])`. Pop a parent, create children from the next two tokens (skip `#`), and enqueue real children." },
    ],
    time: "O(n)",
    space: "O(n)",
    pitfalls: ["Preorder DFS with `#` markers also works and is often shorter to code."],
  },
});
