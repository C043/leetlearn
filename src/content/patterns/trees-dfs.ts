import { definePattern } from "../types";

export default definePattern({
  slug: "trees-dfs",
  name: "Trees - DFS",
  description:
    "Recursion over a tree: preorder, inorder and postorder traversals, plus path aggregation with a running state.",
  order: 7,
  problems: [
    { slug: "invert-binary-tree", title: "Invert Binary Tree", difficulty: "EASY", leetcodeUrl: "https://leetcode.com/problems/invert-binary-tree/" },
    { slug: "same-tree", title: "Same Tree", difficulty: "EASY", leetcodeUrl: "https://leetcode.com/problems/same-tree/" },
    { slug: "binary-tree-paths", title: "Binary Tree Paths", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/binary-tree-paths/" },
    { slug: "validate-binary-search-tree", title: "Validate Binary Search Tree", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/validate-binary-search-tree/" },
    { slug: "lowest-common-ancestor-of-a-binary-tree", title: "Lowest Common Ancestor of a Binary Tree", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/" },
    { slug: "path-sum-iii", title: "Path Sum III", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/path-sum-iii/" },
    { slug: "count-good-nodes-in-binary-tree", title: "Count Good Nodes in Binary Tree", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/count-good-nodes-in-binary-tree/" },
    { slug: "construct-binary-tree-from-preorder-and-inorder-traversal", title: "Construct Binary Tree from Preorder and Inorder Traversal", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/" },
    { slug: "unique-binary-search-trees", title: "Unique Binary Search Trees", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/unique-binary-search-trees/" },
    { slug: "binary-tree-maximum-path-sum", title: "Binary Tree Maximum Path Sum", difficulty: "HARD", leetcodeUrl: "https://leetcode.com/problems/binary-tree-maximum-path-sum/" },
  ],
});
