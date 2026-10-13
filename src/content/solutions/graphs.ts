import { defineSolutions } from "./types";

export default defineSolutions({
  "find-the-town-judge": {
    idea: "The judge is trusted by everyone else (in-degree `n - 1`) and trusts nobody (out-degree `0`). Track one score per person: `+1` for each incoming trust and `-1` for each outgoing. The judge is the person whose score is exactly `n - 1`.",
    steps: [
      {
        text: "`n = 3`, `trust = [[1,3],[2,3]]`:",
        visual: {
          kind: "graph",
          directed: true,
          nodes: [{ id: "1", x: 0, y: 0 }, { id: "2", x: 2, y: 0 }, { id: "3", x: 1, y: 1, tone: "good" }],
          edges: [["1", "3"], ["2", "3"]],
          caption: "Person 3 has score 2 = n − 1, so 3 is the judge",
        },
      },
    ],
    time: "O(n + t)",
    space: "O(n)",
  },

  "find-if-path-exists-in-graph": {
    idea: "Ask whether `source` and `destination` are in the **same connected component**. BFS/DFS from `source` over an adjacency list, or union all edges with Union-Find and compare roots.",
    steps: [
      {
        text: "`edges = [[0,1],[0,2],[3,5],[5,4],[4,3]]`, `0 → 5`?",
        visual: {
          kind: "graph",
          nodes: [
            { id: "0", x: 0, y: 0, tone: "accent" },
            { id: "1", x: 1, y: 0, tone: "accent" },
            { id: "2", x: 0, y: 1, tone: "accent" },
            { id: "3", x: 2, y: 0 },
            { id: "4", x: 3, y: 1 },
            { id: "5", x: 3, y: 0, tone: "bad" },
          ],
          edges: [["0", "1"], ["0", "2"], ["3", "5"], ["5", "4"], ["4", "3"]],
          caption: "BFS from 0 only reaches {0, 1, 2}, so the answer is false",
        },
      },
    ],
    time: "O(V + E)",
    space: "O(V + E)",
  },

  "number-of-islands": {
    idea: "Scan the grid. Each time you hit unvisited land, that's a **new island**: count it, then flood-fill (DFS/BFS) all land connected to it so it isn't counted again.",
    steps: [
      {
        text: "Each color is one flood fill.",
        visual: {
          kind: "grid",
          rows: [[1, 1, 0, 0, 0], [1, 1, 0, 0, 0], [0, 0, 1, 0, 0], [0, 0, 0, 1, 1]],
          tones: {
            accent: [[0, 0], [0, 1], [1, 0], [1, 1]],
            good: [[2, 2]],
            bad: [[3, 3], [3, 4]],
            muted: [[0, 2], [0, 3], [0, 4], [1, 2], [1, 3], [1, 4], [2, 0], [2, 1], [2, 3], [2, 4], [3, 0], [3, 1], [3, 2]],
          },
          caption: "3 islands (4-directional connectivity)",
        },
      },
      { text: "Mark visited by setting the cell to `'0'` (or use a visited set if you can't mutate the input)." },
    ],
    time: "O(m · n)",
    space: "O(m · n) worst-case recursion",
  },

  "number-of-provinces": {
    idea: "A province is a connected component in the city graph given as an adjacency matrix. DFS from each unvisited city and count how many times you start one. Union-Find works too.",
    steps: [
      {
        text: "`isConnected = [[1,1,0],[1,1,0],[0,0,1]]`:",
        visual: {
          kind: "grid",
          rowLabels: ["0", "1", "2"],
          colLabels: ["0", "1", "2"],
          rows: [[1, 1, 0], [1, 1, 0], [0, 0, 1]],
          tones: { accent: [[0, 0], [0, 1], [1, 0], [1, 1]], good: [[2, 2]] },
        },
      },
      {
        text: "Graph view:",
        visual: {
          kind: "graph",
          nodes: [{ id: "0", x: 0, y: 0, tone: "accent" }, { id: "1", x: 1, y: 0, tone: "accent" }, { id: "2", x: 2.5, y: 0, tone: "good" }],
          edges: [["0", "1"]],
          caption: "2 provinces",
        },
      },
    ],
    time: "O(n²)",
    space: "O(n)",
  },

  "clone-graph": {
    idea: "Traverse the graph (DFS or BFS) while keeping a map **original → clone**. The map does two jobs: it's the visited set, and it lets you link a neighbor's clone even if the neighbor was created earlier (handles cycles).",
    steps: [
      {
        text: "`adj = [[2,4],[1,3],[2,4],[1,3]]`, a 4-cycle.",
        visual: {
          kind: "graph",
          nodes: [{ id: "1", x: 0, y: 0 }, { id: "2", x: 1, y: 0 }, { id: "3", x: 1, y: 1 }, { id: "4", x: 0, y: 1 }],
          edges: [["1", "2"], ["2", "3"], ["3", "4"], ["4", "1"]],
        },
      },
      { text: "`clone(node)`: if it's in the map, return the stored copy. Otherwise create a copy, **store it first**, then set `copy.neighbors = node.neighbors.map(clone)`." },
    ],
    time: "O(V + E)",
    space: "O(V)",
    pitfalls: ["Store the clone in the map **before** recursing into neighbors, or a cycle recurses forever."],
  },

  "course-schedule": {
    idea: "Courses with prerequisites form a directed graph. You can finish all courses iff it has **no cycle**. Kahn's algorithm: repeatedly take courses with in-degree 0; if you can't process all `n`, there's a cycle.",
    steps: [
      {
        text: "Edge `a → b` means take `a` before `b`. Start with every in-degree-0 course in a queue.",
        visual: {
          kind: "graph",
          directed: true,
          nodes: [{ id: "0", x: 0, y: 1, tone: "good" }, { id: "1", x: 1, y: 0 }, { id: "2", x: 1, y: 2 }, { id: "3", x: 2, y: 1 }],
          edges: [["0", "1"], ["0", "2"], ["1", "3"], ["2", "3"]],
          caption: "Acyclic, so all 4 courses can be taken",
        },
      },
      {
        text: "Pop a course, decrement its neighbors' in-degrees, and enqueue any that hit 0. A cycle keeps every node in it above 0.",
        visual: {
          kind: "graph",
          directed: true,
          nodes: [{ id: "0", x: 0, y: 0, tone: "bad" }, { id: "1", x: 1, y: 0, tone: "bad" }],
          edges: [["0", "1"], ["1", "0"]],
          caption: "0 needs 1 and 1 needs 0, so the answer is false",
        },
      },
    ],
    time: "O(V + E)",
    space: "O(V + E)",
    pitfalls: ["Input `[a, b]` means **b → a** (b is the prerequisite)."],
  },

  "course-schedule-ii": {
    idea: "Same as Course Schedule, but **return the order** in which Kahn's algorithm pops the nodes. That's a topological order. If fewer than `n` nodes come out, return `[]`.",
    steps: [
      {
        text: "In-degrees: `0:0, 1:1, 2:1, 3:2`. Queue starts `[0]`.",
        visual: {
          kind: "graph",
          directed: true,
          nodes: [{ id: "0", x: 0, y: 1, tone: "good" }, { id: "1", x: 1, y: 0, tone: "accent" }, { id: "2", x: 1, y: 2, tone: "accent" }, { id: "3", x: 2, y: 1 }],
          edges: [["0", "1"], ["0", "2"], ["1", "3"], ["2", "3"]],
        },
      },
      { text: "Pop 0, which frees 1 and 2. Pop 1, then pop 2, which frees 3. Order `[0, 1, 2, 3]`.", visual: { kind: "array", values: [0, 1, 2, 3], tones: { good: [0, 1, 2, 3] } } },
    ],
    time: "O(V + E)",
    space: "O(V + E)",
  },

  "rotting-oranges": {
    idea: "All rotten oranges spread **simultaneously**, which is a **multi-source BFS**. Seed the queue with every rotten orange; each BFS layer is one minute. At the end, if any fresh orange remains, return -1.",
    steps: [
      {
        text: "Numbers show the minute each orange rots (`·` = empty cell).",
        visual: {
          kind: "grid",
          rows: [[0, 1, 2], [1, 2, "·"], ["·", 3, 4]],
          tones: { bad: [[0, 0]], accent: [[0, 1], [1, 0]], good: [[2, 2]], muted: [[1, 2], [2, 0]] },
          caption: "The last orange rots at minute 4",
        },
      },
      { text: "Count fresh oranges up front; decrement when one rots. If the count isn't 0 at the end, some orange is unreachable." },
    ],
    time: "O(m · n)",
    space: "O(m · n)",
  },

  "pacific-atlantic-water-flow": {
    idea: "Instead of simulating water from every cell, **reverse the flow**: from each ocean's border cells, BFS/DFS **uphill** (to neighbors with height ≥ current). That marks every cell that can drain to that ocean. The answer is the intersection.",
    steps: [
      {
        text: "Pacific touches the top and left edges; Atlantic touches the bottom and right. Green cells reach both.",
        visual: {
          kind: "grid",
          rows: [[1, 2, 2, 3, 5], [3, 2, 3, 4, 4], [2, 4, 5, 3, 1], [6, 7, 1, 4, 5], [5, 1, 1, 2, 4]],
          tones: { good: [[0, 4], [1, 3], [1, 4], [2, 2], [3, 0], [3, 1], [4, 0]] },
        },
      },
      { text: "Two visited matrices, `pac` and `atl`. Seed each from its edges and expand to `heights[nr][nc] >= heights[r][c]`." },
    ],
    time: "O(m · n)",
    space: "O(m · n)",
  },

  "word-ladder": {
    idea: "Words are nodes; an edge connects words differing by one letter. The shortest transformation is a **BFS** shortest path. To find neighbors fast, try all 26 letters at each position (or index wildcard patterns like `h*t`).",
    steps: [
      {
        text: "`hit → cog`:",
        visual: {
          kind: "graph",
          nodes: [
            { id: "hit", x: 0, y: 0.5, tone: "good" },
            { id: "hot", x: 1, y: 0.5, tone: "good" },
            { id: "dot", x: 2, y: 0, tone: "good" },
            { id: "lot", x: 2, y: 1 },
            { id: "dog", x: 3, y: 0, tone: "good" },
            { id: "log", x: 3, y: 1 },
            { id: "cog", x: 4, y: 0.5, tone: "good" },
          ],
          edges: [["hit", "hot"], ["hot", "dot"], ["hot", "lot"], ["dot", "lot"], ["dot", "dog"], ["lot", "log"], ["dog", "log"], ["dog", "cog"], ["log", "cog"]],
          caption: "hit → hot → dot → dog → cog: 5 words",
        },
      },
      { text: "Remove words from the dictionary when you enqueue them; that's the visited set. Return `level` when you pop `endWord`, or 0 if BFS ends." },
    ],
    time: "O(N · L · 26)",
    space: "O(N · L)",
    pitfalls: ["If `endWord` isn't in the word list, the answer is 0 immediately."],
  },
});
