import { defineSolutions } from "./types";

export default defineSolutions({
  "valid-parentheses": {
    idea: "The most recently opened bracket must be the first one closed. That's last-in, first-out, so use a **stack**. Push openers; on a closer, the top must be its matching opener.",
    steps: [
      {
        text: "`s = \"{[()]}\"`. After reading `{[(` the stack holds three openers.",
        visual: { kind: "stack", items: ["{", "[", "("], tones: { accent: [2] }, caption: "Next char ')' must match the top '('" },
      },
      { text: "On `)`, pop `(`, which matches. Then `]` pops `[`, and `}` pops `{`." },
      { text: "Invalid if a closer finds an empty stack or a wrong opener, **or** if the stack isn't empty at the end." },
    ],
    time: "O(n)",
    space: "O(n)",
    pitfalls: ["`\"((\"` passes every closer check but leaves items on the stack, so check `stack.isEmpty()` at the end."],
  },

  "implement-queue-using-stacks": {
    idea: "Two stacks: `in` receives pushes; `out` serves pops. When `out` is empty, pour all of `in` into it, which **reverses** the order and puts the oldest element on top. Each element moves at most once, so operations are amortized O(1).",
    steps: [
      { text: "`push(1), push(2), push(3)` all go to `in`.", visual: { kind: "stack", items: [1, 2, 3], caption: "in" } },
      {
        text: "`pop()`: `out` is empty, so move everything over. Now the front of the queue (1) is on top.",
        visual: { kind: "stack", items: [3, 2, 1], tones: { good: [2] }, caption: "out: pop returns 1" },
      },
      { text: "Only refill `out` when it's empty; otherwise you'd break the order." },
    ],
    time: "Amortized O(1) per op",
    space: "O(n)",
  },

  "daily-temperatures": {
    idea: "Keep a **monotonic decreasing stack** of indices still waiting for a warmer day. When a warmer temperature arrives, it's the answer for every colder index on top, so pop them and record the distance.",
    steps: [
      {
        text: "`temps = [73,74,75,71,69,72,76,73]`. At `i = 5` (72), the stack holds days still waiting:",
        visual: {
          kind: "stack",
          items: ["75 · i=2", "71 · i=3", "69 · i=4"],
          tones: { bad: [1, 2] },
          caption: "72 is warmer than 69 and 71, so pop them: ans[4] = 1, ans[3] = 2",
        },
      },
      {
        text: "Push `i`. Indices left on the stack at the end never get a warmer day (answer 0).",
        visual: { kind: "array", values: [1, 1, 4, 2, 1, 1, 0, 0], caption: "Answer" },
      },
    ],
    time: "O(n): each index is pushed and popped once",
    space: "O(n)",
  },

  "next-greater-element-ii": {
    idea: "Same monotonic stack as Daily Temperatures, but the array is circular. Simulate wrapping by iterating `i` from `0` to `2n - 1` and using `nums[i % n]`. Push indices only during the first lap.",
    steps: [
      {
        text: "`nums = [1,2,3,4,3]`. The last `3` only finds `4` by wrapping around.",
        visual: {
          kind: "array",
          values: [1, 2, 3, 4, 3, "|", 1, 2, 3, 4],
          tones: { muted: [5, 6, 7, 8, 9], good: [9], accent: [4] },
          caption: "Virtual second lap (grey) gives the last element its answer, 4",
        },
      },
      {
        text: "Result: initialize to `-1`; pop and fill while the current value is greater than the top's value.",
        visual: { kind: "array", values: [2, 3, 4, -1, 4], tones: { bad: [3] }, caption: "The max element has no greater element" },
      },
    ],
    time: "O(n)",
    space: "O(n)",
  },

  "asteroid-collision": {
    idea: "Collisions only happen when a **left-moving** asteroid meets a **right-moving** one before it. Process left to right with a stack of survivors; a new negative asteroid keeps destroying smaller positive tops.",
    steps: [
      {
        text: "`[10, 2, -5]`: push 10 and 2. Then `-5` arrives.",
        visual: { kind: "stack", items: [10, 2], tones: { bad: [1] }, caption: "|-5| > 2, so 2 explodes; |-5| < 10, so -5 explodes" },
      },
      { text: "While `top > 0 && cur < 0`: if `top < |cur|`, pop and continue; if equal, pop and drop `cur`; if bigger, drop `cur`." },
      { text: "If `cur` survives, push it. The stack is the answer.", visual: { kind: "stack", items: [10], tones: { good: [0] } } },
    ],
    time: "O(n)",
    space: "O(n)",
  },

  "online-stock-span": {
    idea: "The span of today's price swallows the spans of every previous day with a price ≤ today. Keep a **monotonic decreasing stack** of `(price, span)` pairs; when popping, add their spans to today's.",
    steps: [
      {
        text: "Prices so far: `100, 80, 60, 70, 60`. Next comes `75`.",
        visual: {
          kind: "stack",
          items: ["(100, 1)", "(80, 1)", "(70, 2)", "(60, 1)"],
          tones: { bad: [2, 3] },
          caption: "60 ≤ 75 and 70 ≤ 75, so pop both: span = 1 + 1 + 2 = 4",
        },
      },
      { text: "Push `(75, 4)`. Each price is pushed and popped once, so `next()` is amortized O(1)." },
    ],
    time: "Amortized O(1) per call",
    space: "O(n)",
  },

  "decode-string": {
    idea: "Nested brackets mean you must pause the outer string while building the inner one. On `[`, push `(currentString, repeatCount)` and start fresh. On `]`, pop and set `current = prev + current * count`.",
    steps: [
      {
        text: "`\"3[a2[c]]\"`: after reading `3[a2[`, the stack remembers the outer contexts.",
        visual: { kind: "stack", items: ["(\"\", 3)", "(\"a\", 2)"], caption: "current = \"c\"" },
      },
      { text: "`]`: pop `(\"a\", 2)` and set `current = \"a\" + \"cc\" = \"acc\"`." },
      { text: "`]`: pop `(\"\", 3)` and set `current = \"\" + \"acc\"×3 = \"accaccacc\"`." },
    ],
    time: "O(output length)",
    space: "O(output length)",
    pitfalls: ["Counts can be multi-digit (`\"12[a]\"`), so build `k = k * 10 + digit`."],
  },

  "remove-k-digits": {
    idea: "To make the number smallest, a larger digit followed by a smaller one should be removed: it's the earliest place where removing helps the most. Keep a **monotonic increasing stack**, popping while the top is bigger than the incoming digit and removals remain.",
    steps: [
      {
        text: "`num = \"1432219\"`, `k = 3`. Trace: 4 is popped by 3, 3 by 2, then the second 2 by 1.",
        visual: { kind: "stack", items: [1, 2, 1, 9], caption: "Final stack, so the answer is \"1219\"" },
      },
      { text: "If `k > 0` remains after the scan, chop digits off the end (the stack is non-decreasing)." },
      { text: "Strip leading zeros; return `\"0\"` if nothing is left." },
    ],
    time: "O(n)",
    space: "O(n)",
  },

  "sum-of-subarray-minimums": {
    idea: "Flip the question: for each element, **how many subarrays is it the minimum of?** That count is `left × right`, where `left` is the distance to the previous smaller element and `right` is the distance to the next smaller-or-equal one. Monotonic stacks find both in O(n).",
    steps: [
      {
        text: "`arr = [3,1,2,4]`:",
        visual: {
          kind: "grid",
          colLabels: ["value", "left", "right", "contrib"],
          rows: [[3, 1, 1, 3], [1, 2, 3, 6], [2, 1, 2, 4], [4, 1, 1, 4]],
          tones: { good: [[1, 3]] },
          caption: "1 is the min of 2 × 3 = 6 subarrays. Total = 17",
        },
      },
      { text: "Use strict `<` on one side and `≤` on the other so equal values aren't double-counted." },
      { text: "Answer = `Σ arr[i] · left[i] · right[i]` mod `1e9 + 7`." },
    ],
    time: "O(n)",
    space: "O(n)",
  },

  "largest-rectangle-in-histogram": {
    idea: "For each bar, the widest rectangle at its height spans until a **shorter bar** on each side. A monotonic increasing stack finds this: when a shorter bar arrives, every taller bar popped now knows its right boundary, and its left boundary is the new stack top.",
    steps: [
      {
        text: "When popping height `h` at index `i`, the width is `i - stack.top - 1` (or `i` if the stack is empty).",
        visual: {
          kind: "bars",
          values: [2, 1, 5, 6, 2, 3],
          tones: { good: [2, 3] },
          caption: "Height 5 extends across bars 2..3, so area = 5 × 2 = 10",
        },
      },
      { text: "Append a sentinel bar of height 0 at the end so every bar gets popped." },
    ],
    time: "O(n)",
    space: "O(n)",
  },
});
