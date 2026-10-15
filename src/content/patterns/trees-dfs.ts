import { definePattern } from "../types";

export default definePattern({
  slug: "trees-dfs",
  name: "Trees - DFS",
  description:
    "Recursion over a tree: preorder, inorder and postorder traversals, plus path aggregation with a running state.",
  order: 7,
  problems: [
    {
      slug: "invert-binary-tree",
      title: "Invert Binary Tree",
      difficulty: "EASY",
      leetcodeUrl: "https://leetcode.com/problems/invert-binary-tree/",
      summary:
        "Given the `root` of a binary tree, mirror it (swap every node's left and right children) and return the root.",
    },
    {
      slug: "same-tree",
      title: "Same Tree",
      difficulty: "EASY",
      leetcodeUrl: "https://leetcode.com/problems/same-tree/",
      summary:
        "Given the roots `p` and `q` of two binary trees, return `True` if they have exactly the same shape and the same values in the same places.",
    },
    {
      slug: "binary-tree-paths",
      title: "Binary Tree Paths",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/binary-tree-paths/",
      summary:
        "Given the `root` of a binary tree, return every root-to-leaf path as a string like `\"1->2->5\"`, in any order.",
    },
    {
      slug: "validate-binary-search-tree",
      title: "Validate Binary Search Tree",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/validate-binary-search-tree/",
      summary:
        "Return `True` if the binary tree is a valid BST: every value in a node's left subtree is **strictly less** than the node, and every value in its right subtree is **strictly greater**, recursively.",
    },
    {
      slug: "lowest-common-ancestor-of-a-binary-tree",
      title: "Lowest Common Ancestor of a Binary Tree",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/",
      summary:
        "Given a binary tree and two of its nodes `p` and `q`, return their lowest common ancestor: the deepest node that has both as descendants (a node counts as its own descendant).",
    },
    {
      slug: "path-sum-iii",
      title: "Path Sum III",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/path-sum-iii/",
      summary:
        "Given the `root` of a binary tree and `targetSum`, count the paths whose values add up to `targetSum`. A path can start and end at any nodes but must go **downward** (parent to child).",
    },
    {
      slug: "count-good-nodes-in-binary-tree",
      title: "Count Good Nodes in Binary Tree",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/count-good-nodes-in-binary-tree/",
      summary:
        "A node is **good** if no value on the path from the root to it is greater than it. Return the number of good nodes in the binary tree.",
    },
    {
      slug: "construct-binary-tree-from-preorder-and-inorder-traversal",
      title: "Construct Binary Tree from Preorder and Inorder Traversal",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/",
      summary:
        "Given the `preorder` and `inorder` traversals of a binary tree with unique values, rebuild the tree and return its root.",
    },
    {
      slug: "unique-binary-search-trees",
      title: "Unique Binary Search Trees",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/unique-binary-search-trees/",
      summary:
        "Given `n`, return how many structurally different BSTs can be built that store exactly the values `1` to `n`.",
    },
    {
      slug: "binary-tree-maximum-path-sum",
      title: "Binary Tree Maximum Path Sum",
      difficulty: "HARD",
      leetcodeUrl: "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
      summary:
        "A path is any sequence of connected nodes (each used at most once), not necessarily through the root. Return the largest sum of node values along any non-empty path.",
    },
  ],
});
