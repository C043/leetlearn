import { definePattern } from "../types";

export default definePattern({
  slug: "trees-bfs",
  name: "Trees - BFS",
  description:
    "Level-order traversal with a queue: process the tree one depth at a time to get views, sums and connections.",
  order: 8,
  problems: [
    { slug: "binary-tree-level-order-traversal-ii", title: "Binary Tree Level Order Traversal II", difficulty: "EASY", leetcodeUrl: "https://leetcode.com/problems/binary-tree-level-order-traversal-ii/" },
    { slug: "maximum-depth-of-binary-tree", title: "Maximum Depth of Binary Tree", difficulty: "EASY", leetcodeUrl: "https://leetcode.com/problems/maximum-depth-of-binary-tree/" },
    { slug: "binary-tree-level-order-traversal", title: "Binary Tree Level Order Traversal", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/binary-tree-level-order-traversal/" },
    { slug: "binary-tree-zigzag-level-order-traversal", title: "Binary Tree Zigzag Level Order Traversal", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/" },
    { slug: "binary-tree-right-side-view", title: "Binary Tree Right Side View", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/binary-tree-right-side-view/" },
    { slug: "populate-next-right-pointers-in-each-node", title: "Populating Next Right Pointers in Each Node", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/populate-next-right-pointers-in-each-node/" },
    { slug: "count-complete-tree-nodes", title: "Count Complete Tree Nodes", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/count-complete-tree-nodes/" },
    { slug: "maximum-level-sum-of-a-binary-tree", title: "Maximum Level Sum of a Binary Tree", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/maximum-level-sum-of-a-binary-tree/" },
    { slug: "find-largest-value-in-each-tree-row", title: "Find Largest Value in Each Tree Row", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/find-largest-value-in-each-tree-row/" },
    { slug: "serialize-and-deserialize-binary-tree", title: "Serialize and Deserialize Binary Tree", difficulty: "HARD", leetcodeUrl: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/" },
  ],
});
