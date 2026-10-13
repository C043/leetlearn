import { definePattern } from "../types";

export default definePattern({
  slug: "graphs",
  name: "Graphs",
  description:
    "Nodes and edges: BFS for shortest unweighted paths, DFS for connectivity, topological sort for dependencies.",
  order: 11,
  problems: [
    { slug: "find-the-town-judge", title: "Find the Town Judge", difficulty: "EASY", leetcodeUrl: "https://leetcode.com/problems/find-the-town-judge/" },
    { slug: "find-if-path-exists-in-graph", title: "Find if Path Exists in Graph", difficulty: "EASY", leetcodeUrl: "https://leetcode.com/problems/find-if-path-exists-in-graph/" },
    { slug: "number-of-islands", title: "Number of Islands", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/number-of-islands/" },
    { slug: "number-of-provinces", title: "Number of Provinces", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/number-of-provinces/" },
    { slug: "clone-graph", title: "Clone Graph", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/clone-graph/" },
    { slug: "course-schedule", title: "Course Schedule", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/course-schedule/" },
    { slug: "course-schedule-ii", title: "Course Schedule II", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/course-schedule-ii/" },
    { slug: "rotting-oranges", title: "Rotting Oranges", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/rotting-oranges/" },
    { slug: "pacific-atlantic-water-flow", title: "Pacific Atlantic Water Flow", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/pacific-atlantic-water-flow/" },
    { slug: "word-ladder", title: "Word Ladder", difficulty: "HARD", leetcodeUrl: "https://leetcode.com/problems/word-ladder/" },
  ],
});
