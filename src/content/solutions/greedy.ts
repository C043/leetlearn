import { defineSolutions } from "./types";

export default defineSolutions({
  "assign-cookies": {
    idea: "Sort both lists. Give each child, least greedy first, the **smallest cookie that satisfies them**. Using a bigger cookie than needed can only hurt a greedier child later.",
    steps: [
      {
        text: "`g = [1,2,7]`, `s = [1,3,5]`. Walk both with two pointers. If a cookie is too small, discard it.",
        visual: {
          kind: "grid",
          rowLabels: ["greed", "cookie"],
          rows: [[1, 2, 7], [1, 3, 5]],
          tones: { good: [[0, 0], [1, 0], [0, 1], [1, 1]], bad: [[0, 2]] },
          caption: "Child 7 can't be satisfied by 5, so 2 children are content",
        },
      },
    ],
    time: "O(n log n + m log m)",
    space: "O(1)",
  },

  "lemonade-change": {
    idea: "Only `$5` and `$10` bills are useful as change. For a `$20`, prefer giving **$10 + $5** over **$5 × 3**: fives are more flexible, so save them.",
    steps: [
      {
        text: "`bills = [5,5,5,10,20]`:",
        visual: {
          kind: "grid",
          colLabels: ["bill", "$5s", "$10s"],
          rows: [[5, 1, 0], [5, 2, 0], [5, 3, 0], [10, 2, 1], [20, 1, 0]],
          tones: { accent: [[4, 0]] },
          caption: "$20: give back $10 + $5. Never short, so true",
        },
      },
    ],
    time: "O(n)",
    space: "O(1)",
  },

  "jump-game": {
    idea: "Track the **furthest index reachable** so far. Scanning left to right, if the current index is beyond it, you're stuck. Otherwise extend it with `i + nums[i]`.",
    steps: [
      {
        text: "`[2,3,1,1,4]`: from index 1 you can reach index 4.",
        visual: { kind: "array", values: [2, 3, 1, 1, 4], tones: { good: [1, 4] }, caption: "reach = max(reach, i + nums[i]) = 4 ≥ last, so true" },
      },
      {
        text: "`[3,2,1,0,4]`: every path lands on the `0` at index 3.",
        visual: { kind: "array", values: [3, 2, 1, 0, 4], tones: { bad: [3], muted: [4] }, caption: "reach stays 3, and i = 4 > reach, so false" },
      },
    ],
    time: "O(n)",
    space: "O(1)",
  },

  "jump-game-ii": {
    idea: "Think BFS by layers: all indices reachable with `j` jumps form a contiguous range. Scan the current range while recording the furthest next reach. When you hit the range's end, take a jump and move to the next range.",
    steps: [
      {
        text: "`[2,3,1,1,4]`:",
        visual: {
          kind: "intervals",
          items: [
            { start: 0, end: 0.6, label: "0 jumps", tone: "muted" },
            { start: 1, end: 2, label: "1 jump" },
            { start: 3, end: 4, label: "2 jumps", tone: "good" },
          ],
          caption: "The last index is in the 2-jump range",
        },
      },
      { text: "`for i in 0..n-2`: `far = max(far, i + nums[i])`; if `i == end`: `jumps++`, `end = far`." },
    ],
    time: "O(n)",
    space: "O(1)",
  },

  "gas-station": {
    idea: "If total gas ≥ total cost, a solution exists. To find the start: run a tank from station 0. Whenever it goes **negative** at station `i`, no station between the current start and `i` can work, so restart from `i + 1`.",
    steps: [
      {
        text: "`gas - cost` per station:",
        visual: {
          kind: "array",
          values: [-2, -2, -2, 3, 3],
          tones: { bad: [0, 1, 2], good: [3, 4] },
          pointers: [{ at: 3, label: "start", tone: "good" }],
          caption: "The tank fails at 0, 1, 2. From 3, it never drops below 0",
        },
      },
      { text: "Total = 0 ≥ 0, so the answer is `3`." },
    ],
    time: "O(n)",
    space: "O(1)",
  },

  "partition-labels": {
    idea: "Record each letter's **last occurrence**. Grow the current part's end to cover the last occurrence of every letter inside it. When `i` reaches that end, the part is closed.",
    steps: [
      {
        text: "`\"ababcbacadefegdehijhklij\"`:",
        visual: {
          kind: "intervals",
          items: [
            { start: 0, end: 8, label: "ababcbaca (9)" },
            { start: 9, end: 15, label: "defegde (7)", tone: "good" },
            { start: 16, end: 23, label: "hijhklij (8)", tone: "bad" },
          ],
          caption: "Each letter appears in exactly one part",
        },
      },
      { text: "`end = max(end, last[s[i]])`; when `i == end`, push `end - start + 1` and set `start = i + 1`." },
    ],
    time: "O(n)",
    space: "O(26)",
  },

  "maximum-subarray": {
    idea: "Kadane's algorithm: at each element, either **extend** the current subarray or **start fresh** here, whichever is larger. A negative running sum only drags things down, so drop it.",
    steps: [
      {
        text: "`cur = max(x, cur + x)`; `best = max(best, cur)`.",
        visual: {
          kind: "grid",
          rowLabels: ["nums", "cur"],
          rows: [[-2, 1, -3, 4, -1, 2, 1, -5, 4], [-2, 1, -2, 4, 3, 5, 6, 1, 5]],
          tones: { good: [[0, 3], [0, 4], [0, 5], [0, 6], [1, 6]] },
          caption: "Best = 6 from [4, -1, 2, 1]",
        },
      },
    ],
    time: "O(n)",
    space: "O(1)",
    pitfalls: ["Initialize `best = nums[0]`, not 0, for all-negative arrays."],
  },

  "hand-of-straights": {
    idea: "The **smallest** remaining card must start a group, since nothing smaller exists to precede it. So repeatedly take the smallest card `x` and consume `x, x+1, …, x+k-1`. Fail if any is missing.",
    steps: [
      {
        text: "`hand = [1,2,3,6,2,3,4,7,8]`, `groupSize = 3`. Groups formed:",
        visual: {
          kind: "grid",
          rowLabels: ["groups"],
          rows: [["1 2 3", "2 3 4", "6 7 8"]],
          tones: { good: [[0, 0], [0, 1], [0, 2]] },
          caption: "Start at 1, then 2, then 6, so true",
        },
      },
      { text: "Use a sorted map of counts (or sort the unique keys). Return false early if `n % groupSize != 0`." },
    ],
    time: "O(n log n)",
    space: "O(n)",
  },

  "minimum-number-of-arrows-to-burst-balloons": {
    idea: "Sort by **end**. Shoot the first arrow at the smallest end. It bursts every balloon starting at or before that point. The next balloon starting after it needs a new arrow at its own end.",
    steps: [
      {
        text: "`[[10,16],[2,8],[1,6],[7,12]]` sorted by end:",
        visual: {
          kind: "intervals",
          items: [
            { start: 1, end: 6, tone: "accent" },
            { start: 2, end: 8, tone: "accent" },
            { start: 7, end: 12, tone: "good" },
            { start: 10, end: 16, tone: "good" },
          ],
          caption: "Arrow at x = 6 bursts the blue ones; arrow at x = 12 bursts the green ones",
        },
      },
    ],
    time: "O(n log n)",
    space: "O(1)",
    pitfalls: ["Touching counts as overlapping: `[1,2]` and `[2,3]` share one arrow."],
  },

  "candy": {
    idea: "Two constraints, two passes. **Left to right**: if a child is rated higher than the left neighbor, give one more than them. **Right to left**: same against the right neighbor, taking the `max` to keep the first pass's guarantee.",
    steps: [
      {
        text: "`ratings = [1,2,87,87,87,2,1]`:",
        visual: {
          kind: "grid",
          rowLabels: ["rating", "L→R", "R→L", "final"],
          rows: [[1, 2, 87, 87, 87, 2, 1], [1, 2, 3, 1, 1, 1, 1], [1, 1, 1, 1, 3, 2, 1], [1, 2, 3, 1, 3, 2, 1]],
          tones: { good: [[3, 2], [3, 4]] },
          caption: "Sum = 13",
        },
      },
      { text: "Equal neighbors impose no constraint; that's why the middle `87` gets 1." },
    ],
    time: "O(n)",
    space: "O(n)",
  },
});
