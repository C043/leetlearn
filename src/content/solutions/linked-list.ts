import { defineSolutions } from "./types";

export default defineSolutions({
  "reverse-linked-list": {
    idea: "Walk the list once and flip each `next` pointer to point backwards. You need three references: `previous` (the already-reversed part), `current`, and `following` (saved before you overwrite `current.next`).",
    steps: [
      {
        text: "`previous = None`, `current = head`. Each step: `following = current.next; current.next = previous; previous, current = current, following`.",
        visual: {
          kind: "list",
          values: [1, 2, 3, 4, 5],
          pointers: [{ at: 1, label: "previous", tone: "good" }, { at: 2, label: "current" }, { at: 3, label: "following", tone: "muted" }],
          tones: { good: [0, 1] },
          caption: "Mid-way: 2 → 1 → ∅ is already reversed",
        },
      },
      {
        text: "When `current` is `None`, `previous` is the new head.",
        visual: { kind: "list", values: [5, 4, 3, 2, 1], tones: { good: [0, 1, 2, 3, 4] } },
      },
    ],
    time: "O(n)",
    space: "O(1) iterative (O(n) recursive)",
  },

  "merge-two-sorted-lists": {
    idea: "Like the merge step of merge sort: repeatedly take the smaller head of the two lists and append it to the result. A **dummy** node makes the first append no different from the rest.",
    steps: [
      {
        text: "Compare `list1 = 1→2→4` and `list2 = 1→3→4`, attaching the smaller one to `tail`.",
        visual: {
          kind: "list",
          values: ["dummy", 1, 1, 2, 3, 4, 4],
          tones: { muted: [0], accent: [1, 3, 5], good: [2, 4, 6] },
          caption: "Blue from list1, green from list2",
        },
      },
      { text: "When one list runs out, attach the remainder of the other in one step. Return `dummy.next`." },
    ],
    time: "O(m + n)",
    space: "O(1)",
  },

  "add-two-numbers": {
    idea: "Digits are stored in **reverse order**, so the heads are the ones digits, exactly where grade-school addition starts. Add digit by digit with a carry.",
    steps: [
      {
        text: "`342 + 465`: add column by column, carrying into the next node.",
        visual: {
          kind: "grid",
          rowLabels: ["l1", "l2", "carry in", "total"],
          colLabels: ["ones", "tens", "hundreds"],
          rows: [[2, 4, 3], [5, 6, 4], [0, 0, 1], [7, 0, 8]],
          tones: { good: [[3, 0], [3, 1], [3, 2]], accent: [[2, 2]] },
          caption: "4 + 6 = 10, so write 0 and carry 1",
        },
      },
      { text: "Loop while `l1 or l2 or carry`: `total = carry + l1.val + l2.val` (skipping a list that ran out), then `carry, digit = divmod(total, 10)` and append `digit`." },
    ],
    time: "O(max(m, n))",
    space: "O(max(m, n)) for the output",
    pitfalls: ["A final carry adds an extra node: `5 + 5 = 10` gives `[0, 1]`."],
  },

  "linked-list-in-binary-tree": {
    idea: "Try every tree node as a starting point (DFS), and from each start check whether the list matches a **downward path** (also recursive: current values match, then continue into the left or right child).",
    steps: [
      {
        text: "`list = 4 → 2 → 8`. Scan nodes; at each `4`, try matching downwards.",
        visual: {
          kind: "tree",
          values: [1, 4, 4, null, 2, 2, null, null, null, 6, 8, 1],
          tones: { good: [1, 4, 10] },
          caption: "The green path 4 → 2 → 8 matches",
        },
      },
      { text: "`matches(node, tree)`: `True` if `node` is `None`; `False` if `tree` is `None` or values differ; else `matches(node.next, tree.left) or matches(node.next, tree.right)`." },
      { text: "`isSubPath(head, root) = matches(head, root) or self.isSubPath(head, root.left) or self.isSubPath(head, root.right)`." },
    ],
    time: "O(N · L) worst case",
    space: "O(H) recursion",
  },

  "odd-even-linked-list": {
    idea: "Weave two chains in one pass: `odd` links every other node starting at node 1, `even` links every other node starting at node 2. Then attach the even chain after the odd chain.",
    steps: [
      {
        text: "Positions (1-based), not values, decide odd/even.",
        visual: { kind: "list", values: [1, 2, 3, 4, 5], tones: { accent: [0, 2, 4], good: [1, 3] } },
      },
      {
        text: "`odd.next = even.next; odd = odd.next; even.next = odd.next; even = even.next`. Finally `odd.next = even_head`.",
        visual: { kind: "list", values: [1, 3, 5, 2, 4], tones: { accent: [0, 1, 2], good: [3, 4] } },
      },
    ],
    time: "O(n)",
    space: "O(1)",
  },

  "swap-nodes-in-pairs": {
    idea: "Use a dummy before `head`. For each pair `first → second`, relink `previous → second → first → (rest)` and advance `previous` to `first`. Swap nodes, not values.",
    steps: [
      {
        text: "Before and after swapping the first pair:",
        visual: { kind: "list", values: ["dummy", 1, 2, 3, 4], pointers: [{ at: 0, label: "previous" }, { at: 1, label: "first" }, { at: 2, label: "second" }], tones: { muted: [0] } },
      },
      {
        text: "`previous.next = second; first.next = second.next; second.next = first; previous = first`.",
        visual: { kind: "list", values: [2, 1, 4, 3], tones: { accent: [0, 1], good: [2, 3] } },
      },
    ],
    time: "O(n)",
    space: "O(1)",
  },

  "rotate-list": {
    idea: "Rotating right by `k` moves the last `k % length` nodes to the front. Find the length and tail, connect the tail to the head (a ring), then **break the ring** after node `length - k` from the start.",
    steps: [
      {
        text: "`[1,2,3,4,5]`, `k = 2`. Make it circular, then step `length - k = 3` nodes to find the new tail.",
        visual: {
          kind: "list",
          values: [1, 2, 3, 4, 5],
          cycleTo: 0,
          pointers: [{ at: 2, label: "new tail", tone: "bad" }, { at: 3, label: "new head", tone: "good" }],
        },
      },
      { text: "`new_head = new_tail.next; new_tail.next = None`.", visual: { kind: "list", values: [4, 5, 1, 2, 3], tones: { good: [0, 1] } } },
    ],
    time: "O(n)",
    space: "O(1)",
    pitfalls: ["`k` can be much larger than `length`, so always use `k % length` (and handle an empty list)."],
  },

  "reverse-linked-list-ii": {
    idea: "Walk to the node **before** position `left`, then reverse the sublist by repeatedly taking the node after the current one and moving it to the front of the sublist (head insertion), `right - left` times.",
    steps: [
      {
        text: "`left = 2`, `right = 4`. `previous` stops at node 1; `current` is node 2.",
        visual: {
          kind: "list",
          values: [1, 2, 3, 4, 5],
          pointers: [{ at: 0, label: "previous", tone: "muted" }, { at: 1, label: "current" }],
          tones: { accent: [1, 2, 3] },
        },
      },
      {
        text: "Repeat: `moved = current.next; current.next = moved.next; moved.next = previous.next; previous.next = moved`.",
        visual: { kind: "list", values: [1, 4, 3, 2, 5], tones: { accent: [1, 2, 3] }, caption: "The segment 2..4 is reversed in place" },
      },
    ],
    time: "O(n)",
    space: "O(1)",
    pitfalls: ["Use a dummy head; `left = 1` would otherwise need special handling."],
  },

  "split-linked-list-in-parts": {
    idea: "`size, extra = divmod(length, k)`: each part gets `size` nodes, and the first `extra` parts get one more. Count the length, then cut the list into those sizes in order.",
    steps: [
      {
        text: "`length = 10`, `k = 3`: base size 3, remainder 1, so sizes are `4, 3, 3`.",
        visual: {
          kind: "grid",
          rowLabels: ["part 0", "part 1", "part 2"],
          rows: [[1, 2, 3, 4], [5, 6, 7], [8, 9, 10]],
          tones: { accent: [[0, 3]] },
          caption: "The extra node goes to the earliest parts",
        },
      },
      { text: "If `k > length`, the trailing parts are `None`." },
    ],
    time: "O(n + k)",
    space: "O(k) for the output",
  },

  "merge-k-sorted-lists": {
    idea: "The next smallest node overall is always one of the `k` current heads. A **min-heap** of those heads gives it in O(log k). Pop it, append it, and push its successor.",
    steps: [
      {
        text: "Seed the heap with every list's head.",
        visual: {
          kind: "tree",
          values: [1, 1, 2],
          tones: { good: [0] },
          caption: "Heads of [1,4,5], [1,3,4], [2,6]; pop the minimum",
        },
      },
      {
        text: "Pop the smallest, attach it to the result, push its `next`. Repeat until the heap is empty.",
        visual: { kind: "list", values: [1, 1, 2, 3, 4, 4, 5, 6], tones: { good: [0, 1, 2, 3, 4, 5, 6, 7] } },
      },
      { text: "Alternative: divide and conquer, merging lists in pairs (`k → k/2 → …`), with the same complexity." },
    ],
    time: "O(N log k)",
    space: "O(k)",
  },
});
