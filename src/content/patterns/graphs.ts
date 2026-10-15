import { definePattern } from "../types";

export default definePattern({
  slug: "graphs",
  name: "Graphs",
  description:
    "Nodes and edges: BFS for shortest unweighted paths, DFS for connectivity, topological sort for dependencies.",
  order: 11,
  problems: [
    {
      slug: "find-the-town-judge",
      title: "Find the Town Judge",
      difficulty: "EASY",
      leetcodeUrl: "https://leetcode.com/problems/find-the-town-judge/",
      summary:
        "People are labelled `1` to `n`. `trust[i] = [a, b]` means a trusts b. The town judge trusts nobody and is trusted by everybody else. Return the judge's label, or `-1` if there isn't exactly one.",
    },
    {
      slug: "find-if-path-exists-in-graph",
      title: "Find if Path Exists in Graph",
      difficulty: "EASY",
      leetcodeUrl: "https://leetcode.com/problems/find-if-path-exists-in-graph/",
      summary:
        "Given an undirected graph with `n` nodes (`0` to `n - 1`) and a list of `edges`, return `True` if there is a path from `source` to `destination`.",
    },
    {
      slug: "number-of-islands",
      title: "Number of Islands",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/number-of-islands/",
      summary:
        "In a grid of `\"1\"` (land) and `\"0\"` (water), an island is a group of land cells connected horizontally or vertically. Return the number of islands.",
    },
    {
      slug: "number-of-provinces",
      title: "Number of Provinces",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/number-of-provinces/",
      summary:
        "`isConnected[i][j] = 1` means cities `i` and `j` are directly connected. A province is a group of cities connected directly or indirectly. Return the number of provinces.",
    },
    {
      slug: "clone-graph",
      title: "Clone Graph",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/clone-graph/",
      summary:
        "Given a reference to a node in a connected undirected graph (each node has a `val` and a list of `neighbors`), return a deep copy of the whole graph.",
    },
    {
      slug: "course-schedule",
      title: "Course Schedule",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/course-schedule/",
      summary:
        "There are `numCourses` courses; `[a, b]` in `prerequisites` means you must take `b` before `a`. Return `True` if it's possible to finish every course.",
    },
    {
      slug: "course-schedule-ii",
      title: "Course Schedule II",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/course-schedule-ii/",
      summary:
        "Same setup as Course Schedule: `[a, b]` means take `b` before `a`. Return any valid order to take all courses, or `[]` if it's impossible.",
    },
    {
      slug: "rotting-oranges",
      title: "Rotting Oranges",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/rotting-oranges/",
      summary:
        "In a grid, `0` is empty, `1` a fresh orange, `2` a rotten one. Every minute, fresh oranges next to a rotten one (up/down/left/right) rot. Return the minutes until no fresh orange is left, or `-1` if that never happens.",
    },
    {
      slug: "pacific-atlantic-water-flow",
      title: "Pacific Atlantic Water Flow",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/pacific-atlantic-water-flow/",
      summary:
        "`heights` is an island map. The Pacific touches the top and left edges, the Atlantic the bottom and right edges. Water flows to a neighbour with **equal or lower** height. Return every cell from which water can reach **both** oceans.",
    },
    {
      slug: "word-ladder",
      title: "Word Ladder",
      difficulty: "HARD",
      leetcodeUrl: "https://leetcode.com/problems/word-ladder/",
      summary:
        "Transform `beginWord` into `endWord` by changing one letter at a time, where every intermediate word must be in `wordList`. Return the number of words in the shortest such sequence (including both ends), or `0` if impossible.",
    },
  ],
});
