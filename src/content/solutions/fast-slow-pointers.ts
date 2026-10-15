import { defineSolutions } from "./types";

export default defineSolutions({
  "linked-list-cycle": {
    idea: "Floyd's tortoise and hare: `slow` moves 1 step, `fast` moves 2. If there's no cycle, `fast` falls off the end. If there is one, `fast` laps `slow` inside the loop and they **must meet**, since the gap shrinks by 1 every step.",
    steps: [
      {
        text: "Start both at `head`. Each iteration: `slow = slow.next`, `fast = fast.next.next`.",
        visual: {
          kind: "list",
          values: [3, 2, 0, -4],
          cycleTo: 1,
          pointers: [{ at: 0, label: "slow" }, { at: 0, label: "fast", tone: "bad" }],
          caption: "The tail points back to node 2",
        },
      },
      {
        text: "After 3 steps both are at `-4`. They met, so there's a cycle.",
        visual: {
          kind: "list",
          values: [3, 2, 0, -4],
          cycleTo: 1,
          pointers: [{ at: 3, label: "slow" }, { at: 3, label: "fast", tone: "bad" }],
          tones: { good: [3] },
        },
      },
      { text: "Loop while `fast and fast.next`; if that fails, return `False`." },
    ],
    time: "O(n)",
    space: "O(1)",
  },

  "middle-of-the-linked-list": {
    idea: "When `fast` (2 steps) reaches the end, `slow` (1 step) has covered half the distance, so it's at the middle.",
    steps: [
      {
        text: "Move both until `fast` is `None` or `fast.next` is `None`.",
        visual: {
          kind: "list",
          values: [1, 2, 3, 4, 5],
          pointers: [{ at: 2, label: "slow", tone: "good" }, { at: 4, label: "fast", tone: "bad" }],
          tones: { good: [2] },
          caption: "Odd length: slow stops at the exact middle",
        },
      },
      {
        text: "With an even count, this loop returns the **second** middle, as the problem asks.",
        visual: {
          kind: "list",
          values: [1, 2, 3, 4, 5, 6],
          pointers: [{ at: 3, label: "slow", tone: "good" }],
          tones: { good: [3] },
          caption: "fast ends at None, past node 6",
        },
      },
    ],
    time: "O(n)",
    space: "O(1)",
  },

  "linked-list-cycle-ii": {
    idea: "After `slow` and `fast` meet, the distance from `head` to the cycle start equals the distance from the meeting point to the cycle start (going around the loop). Reset one pointer to `head` and advance both one step at a time; they meet **at the entrance**.",
    steps: [
      {
        text: "Phase 1: run Floyd until they meet. Here they meet at `-4`.",
        visual: {
          kind: "list",
          values: [3, 2, 0, -4],
          cycleTo: 1,
          pointers: [{ at: 3, label: "meet", tone: "bad" }],
          tones: { bad: [3] },
        },
      },
      {
        text: "Phase 2: reset `slow = head` and leave `fast` at the meeting point. Step both by one. They meet at node `2`, the cycle start.",
        visual: {
          kind: "list",
          values: [3, 2, 0, -4],
          cycleTo: 1,
          pointers: [{ at: 1, label: "slow = fast", tone: "good" }],
          tones: { good: [1] },
        },
      },
      { text: "Why: if `a` = head→start and `b` = start→meet, then `2(a+b) = a + b + kL`, so `a = kL - b`. Walking `a` steps from the meet point lands on the start." },
    ],
    time: "O(n)",
    space: "O(1)",
  },

  "find-the-duplicate-number": {
    idea: "Treat each index as a node with an edge `index → nums[index]`. Values are in `[1, n]`, so starting from 0 you never leave the array, and the duplicate value has **two incoming edges**. That value is the entrance of a cycle. Use Linked List Cycle II.",
    steps: [
      {
        text: "`nums = [1,3,4,2,2]`: following `index → nums[index]` from 0 gives `0 → 1 → 3 → 2 → 4 → 2 → …`",
        visual: {
          kind: "list",
          values: [0, 1, 3, 2, 4],
          cycleTo: 3,
          tones: { bad: [3] },
          caption: "Both index 3 and index 4 point to 2, so 2 is the cycle entrance and the duplicate",
        },
      },
      { text: "Phase 1: `slow = nums[slow]`, `fast = nums[nums[fast]]` until equal. Phase 2: reset `slow = 0` and step both by one until equal. Return that value." },
    ],
    time: "O(n)",
    space: "O(1), without modifying the array",
  },

  "happy-number": {
    idea: "Repeatedly replacing `n` with the sum of its squared digits forms a sequence that either reaches `1` or **falls into a cycle**. Detect the cycle with fast/slow (or a set).",
    steps: [
      {
        text: "`19 → 1²+9² = 82 → 68 → 100 → 1`. It reaches 1, so 19 is happy.",
        visual: { kind: "list", values: [19, 82, 68, 100, 1], tones: { good: [4] } },
      },
      {
        text: "`2 → 4 → 16 → 37 → 58 → 89 → 145 → 42 → 20 → 4 …` loops forever without 1.",
        visual: { kind: "list", values: [2, 4, 16, 37, 58, 89, 145, 42, 20], cycleTo: 1, tones: { bad: [1] } },
      },
      { text: "`slow = step(slow)`, `fast = step(step(fast))`. Stop when `fast == 1` (happy) or `slow == fast` (cycle)." },
    ],
    time: "O(log n) per step",
    space: "O(1)",
  },

  "circular-array-loop": {
    idea: "Each index jumps to `next_index(index) = (index + nums[index]) % length`. That's a functional graph, so run fast/slow from every start. A valid loop must have **length > 1** and keep **one direction** (all positive or all negative). Mark dead-end paths so each index is processed once.",
    steps: [
      {
        text: "`nums = [2,-1,1,2,2]`. Draw the jump graph:",
        visual: {
          kind: "graph",
          directed: true,
          nodes: [
            { id: "0", x: 1, y: 0, tone: "good" },
            { id: "2", x: 2, y: 1, tone: "good" },
            { id: "3", x: 1, y: 2, tone: "good" },
            { id: "4", x: 0, y: 2 },
            { id: "1", x: 0, y: 1 },
          ],
          edges: [["0", "2"], ["2", "3"], ["3", "0"], ["4", "1"], ["1", "0"]],
          caption: "0 → 2 → 3 → 0 is a forward-only cycle of length 3, so return True",
        },
      },
      { text: "While moving, abort if a step changes direction (`(nums[first_hop] > 0) != forward`) or the loop found is a self-loop (`slow == next_index(slow)`)." },
      { text: "If a start fails, walk its path again and set those entries to `0` so they're never re-explored. This keeps the whole thing O(n)." },
    ],
    time: "O(n)",
    space: "O(1)",
  },

  "sort-list": {
    idea: "Merge sort fits linked lists perfectly: find the middle with slow/fast, **split**, sort both halves recursively, then **merge** two sorted lists. Merging needs no extra arrays, just relinking.",
    steps: [
      {
        text: "Split at the middle until single nodes remain.",
        visual: {
          kind: "ntree",
          root: {
            label: "4→2→1→3",
            children: [
              { label: "4→2", children: [{ label: "4" }, { label: "2" }] },
              { label: "1→3", children: [{ label: "1" }, { label: "3" }] },
            ],
          },
          caption: "Use slow/fast to find the end of the left half, then cut slow.next",
        },
      },
      {
        text: "Merge back up: `[2,4]` + `[1,3]` gives `[1,2,3,4]`.",
        visual: { kind: "list", values: [1, 2, 3, 4], tones: { good: [0, 1, 2, 3] } },
      },
    ],
    time: "O(n log n)",
    space: "O(log n) recursion (O(1) with bottom-up merge)",
    pitfalls: ["Start `fast = head.next` so a 2-node list splits into 1 + 1 instead of looping forever."],
  },

  "reorder-list": {
    idea: "Target order `L0, Ln, L1, Ln-1, …` interleaves the first half with the **reversed** second half. That's three classic steps: find middle, reverse, merge alternately.",
    steps: [
      {
        text: "Find the middle with slow/fast and cut. Reverse the second half.",
        visual: { kind: "list", values: [1, 2, 3], caption: "First half" },
      },
      { text: "Second half `4 → 5` reversed:", visual: { kind: "list", values: [5, 4], tones: { accent: [0, 1] } } },
      {
        text: "Alternate one from each.",
        visual: { kind: "list", values: [1, 5, 2, 4, 3], tones: { accent: [1, 3] } },
      },
    ],
    time: "O(n)",
    space: "O(1)",
  },

  "partition-list": {
    idea: "Build two separate chains while scanning: nodes `< x` and nodes `≥ x`, each with its own dummy head. Then join them. Appending keeps the original relative order.",
    steps: [
      {
        text: "`head = [1,4,3,2,5,2]`, `x = 3`. Route each node to `before` or `after`.",
        visual: {
          kind: "list",
          values: [1, 4, 3, 2, 5, 2],
          tones: { good: [0, 3, 5], bad: [1, 2, 4] },
          caption: "Green < 3, red ≥ 3",
        },
      },
      {
        text: "`before_tail.next = after.next`, and **set `after_tail.next = None`** to cut the old link.",
        visual: { kind: "list", values: [1, 2, 2, 4, 3, 5], tones: { good: [0, 1, 2], bad: [3, 4, 5] } },
      },
    ],
    time: "O(n)",
    space: "O(1)",
    pitfalls: ["Forgetting to null-terminate the `after` list can create a cycle."],
  },

  "reverse-nodes-in-k-group": {
    idea: "Process the list in blocks of `k`. For each block: check that `k` nodes exist, reverse them in place, and stitch the reversed block between the previous block's tail and the next block's head. A leftover block shorter than `k` stays as is.",
    steps: [
      {
        text: "`k = 2`. Mark the groups:",
        visual: {
          kind: "list",
          values: [1, 2, 3, 4, 5],
          tones: { accent: [0, 1], good: [2, 3], muted: [4] },
          caption: "Two full groups; 5 is a leftover",
        },
      },
      {
        text: "Reverse each full group and reconnect: `group_previous.next = group_last` (the new first node), and the old first node links to `group_next`.",
        visual: { kind: "list", values: [2, 1, 4, 3, 5], tones: { accent: [0, 1], good: [2, 3], muted: [4] } },
      },
      { text: "A dummy node before `head` avoids special-casing the first group." },
    ],
    time: "O(n)",
    space: "O(1)",
  },
});
