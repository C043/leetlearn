import { definePattern } from "../types";

export default definePattern({
  slug: "trees-bfs",
  name: "Trees - BFS",
  description:
    "Level-order traversal with a queue: process the tree one depth at a time to get views, sums and connections.",
  order: 8,
  problems: [
    {
      slug: "binary-tree-level-order-traversal-ii",
      title: "Binary Tree Level Order Traversal II",
      difficulty: "EASY",
      leetcodeUrl: "https://leetcode.com/problems/binary-tree-level-order-traversal-ii/",
      summary:
        "Given the `root` of a binary tree, return its values level by level, left to right within each level, but listing the levels from the **bottom** up.",
    },
    {
      slug: "maximum-depth-of-binary-tree",
      title: "Maximum Depth of Binary Tree",
      difficulty: "EASY",
      leetcodeUrl: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
      summary:
        "Given the `root` of a binary tree, return its maximum depth: the number of nodes on the longest path from the root down to a leaf.",
    },
    {
      slug: "binary-tree-level-order-traversal",
      title: "Binary Tree Level Order Traversal",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
      summary:
        "Given the `root` of a binary tree, return its values level by level: a list per level, each read left to right, from the top level down.",
    },
    {
      slug: "binary-tree-zigzag-level-order-traversal",
      title: "Binary Tree Zigzag Level Order Traversal",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/",
      summary:
        "Return the tree's values level by level, alternating direction: the first level left to right, the next right to left, and so on.",
    },
    {
      slug: "binary-tree-right-side-view",
      title: "Binary Tree Right Side View",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/binary-tree-right-side-view/",
      summary:
        "Imagine standing to the right of the binary tree. Return the values you can see from top to bottom: the rightmost node of each level.",
    },
    {
      slug: "populating-next-right-pointers-in-each-node",
      title: "Populating Next Right Pointers in Each Node",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/populating-next-right-pointers-in-each-node/",
      summary:
        "In a **perfect** binary tree (every level full), set each node's `next` pointer to the node on its right on the same level, or `None` for the rightmost node. Use O(1) extra space.",
    },
    {
      slug: "count-complete-tree-nodes",
      title: "Count Complete Tree Nodes",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/count-complete-tree-nodes/",
      summary:
        "Given the `root` of a **complete** binary tree (every level full except maybe the last, which is filled from the left), count its nodes in less than O(n) time.",
    },
    {
      slug: "maximum-level-sum-of-a-binary-tree",
      title: "Maximum Level Sum of a Binary Tree",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/maximum-level-sum-of-a-binary-tree/",
      summary:
        "The root is level 1, its children level 2, and so on. Return the **smallest** level number whose node values have the largest sum.",
    },
    {
      slug: "find-largest-value-in-each-tree-row",
      title: "Find Largest Value in Each Tree Row",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/find-largest-value-in-each-tree-row/",
      summary:
        "Given the `root` of a binary tree, return the largest value in each row (level), from top to bottom.",
    },
    {
      slug: "serialize-and-deserialize-binary-tree",
      title: "Serialize and Deserialize Binary Tree",
      difficulty: "HARD",
      leetcodeUrl: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
      summary:
        "Design `serialize` (tree → string) and `deserialize` (string → tree) so that deserializing a serialized tree rebuilds exactly the same tree.",
    },
  ],
});
