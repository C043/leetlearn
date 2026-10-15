import { defineCode } from "../types";

export default defineCode({
  "invert-binary-tree": `
class Solution:
    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        # An empty tree stays empty
        if root:
            # Invert both subtrees and swap them
            root.left, root.right = self.invertTree(root.right), self.invertTree(root.left)
        # The same root, now mirrored
        return root
`,

  "same-tree": `
class Solution:
    def isSameTree(self, p: Optional[TreeNode], q: Optional[TreeNode]) -> bool:
        # If either is missing, they match only if both are missing
        if not p or not q:
            return p is q
        # Same value here, and both pairs of subtrees match
        return p.val == q.val and self.isSameTree(p.left, q.left) and self.isSameTree(p.right, q.right)
`,

  "binary-tree-paths": `
class Solution:
    def binaryTreePaths(self, root: Optional[TreeNode]) -> list[str]:
        # Every root-to-leaf path as a string
        result = []

        # Walk down the tree, with path holding the values from the root to here
        def explore(node: Optional[TreeNode], path: list[str]) -> None:
            # Fell off the tree
            if not node:
                return
            # Add this node to the path
            path.append(str(node.val))
            # A leaf: the path is complete
            if not node.left and not node.right:
                result.append("->".join(path))
            # Otherwise keep going down both sides
            else:
                explore(node.left, path)
                explore(node.right, path)
            # Remove this node before going back up
            path.pop()

        # Start from the root with an empty path
        explore(root, [])
        return result
`,

  "validate-binary-search-tree": `
class Solution:
    def isValidBST(self, root: Optional[TreeNode]) -> bool:
        # Every value in this subtree must be strictly between low and high
        def valid(node: Optional[TreeNode], low: float, high: float) -> bool:
            # An empty subtree is valid
            if not node:
                return True
            # This value breaks the limits set by its ancestors
            if not low < node.val < high:
                return False
            # Left values must be below this one, right values above it
            return valid(node.left, low, node.val) and valid(node.right, node.val, high)

        # The root can be anything
        return valid(root, float("-inf"), float("inf"))
`,

  "lowest-common-ancestor-of-a-binary-tree": `
class Solution:
    def lowestCommonAncestor(self, root: TreeNode, p: TreeNode, q: TreeNode) -> TreeNode:
        # Empty, or found one of the targets: report it upward
        if not root or root is p or root is q:
            return root
        # Look for the targets in the left subtree
        left = self.lowestCommonAncestor(root.left, p, q)
        # Look for the targets in the right subtree
        right = self.lowestCommonAncestor(root.right, p, q)
        # One target on each side: this node is where they meet
        if left and right:
            return root
        # Both are on one side (or neither is here): pass that result up
        return left or right
`,

  "path-sum-iii": `
from collections import defaultdict

class Solution:
    def pathSum(self, root: Optional[TreeNode], targetSum: int) -> int:
        # counts[sum] = how many nodes on the current path have this prefix sum
        counts = defaultdict(int)
        # The empty prefix above the root
        counts[0] = 1

        # Count paths ending in this subtree; prefix is the sum from the root to the parent
        def explore(node: Optional[TreeNode], prefix: int) -> int:
            # No node, no paths
            if not node:
                return 0
            # Sum from the root down to this node
            prefix += node.val
            # Earlier prefixes equal to prefix - targetSum start a path that ends here
            found = counts[prefix - targetSum]
            # Add this prefix for the nodes below
            counts[prefix] += 1
            # Add the paths that end further down
            found += explore(node.left, prefix) + explore(node.right, prefix)
            # Leave this path
            counts[prefix] -= 1
            return found

        # Start at the root with a sum of 0
        return explore(root, 0)
`,

  "count-good-nodes-in-binary-tree": `
class Solution:
    def goodNodes(self, root: TreeNode) -> int:
        # Count good nodes in this subtree; largest_so_far is the biggest value above it
        def explore(node: Optional[TreeNode], largest_so_far: int) -> int:
            # No node, nothing to count
            if not node:
                return 0
            # Good if nothing above it is bigger
            good = 1 if node.val >= largest_so_far else 0
            # Update the biggest value for the nodes below
            largest_so_far = max(largest_so_far, node.val)
            # This node plus the good nodes in both subtrees
            return good + explore(node.left, largest_so_far) + explore(node.right, largest_so_far)

        # The root is always good
        return explore(root, root.val)
`,

  "construct-binary-tree-from-preorder-and-inorder-traversal": `
class Solution:
    def buildTree(self, preorder: list[int], inorder: list[int]) -> Optional[TreeNode]:
        # Position of each value in the inorder list
        index = {value: position for position, value in enumerate(inorder)}
        # Preorder lists each root before its subtrees, so read it in order
        preorder_values = iter(preorder)

        # Builds the subtree whose inorder slice is [low, high)
        def build(low: int, high: int) -> Optional[TreeNode]:
            # An empty slice is an empty subtree
            if low >= high:
                return None
            # The next preorder value is this subtree's root
            root = TreeNode(next(preorder_values))
            # Where the root sits in the inorder list
            middle = index[root.val]
            # Values left of it form the left subtree (built first, matching preorder)
            root.left = build(low, middle)
            # Values right of it form the right subtree
            root.right = build(middle + 1, high)
            return root

        # Build from the whole inorder list
        return build(0, len(inorder))
`,

  "unique-binary-search-trees": `
class Solution:
    def numTrees(self, n: int) -> int:
        # tree_count[nodes] = number of different trees with that many nodes
        tree_count = [0] * (n + 1)
        # One way to build an empty tree
        tree_count[0] = 1
        # Work out the count for each tree size
        for nodes in range(1, n + 1):
            # Try each value as the root
            for root in range(1, nodes + 1):
                # Left side has root - 1 nodes, right side has nodes - root nodes
                tree_count[nodes] += tree_count[root - 1] * tree_count[nodes - root]
        # Trees with n nodes
        return tree_count[n]
`,

  "binary-tree-maximum-path-sum": `
class Solution:
    def maxPathSum(self, root: Optional[TreeNode]) -> int:
        # Best path sum found anywhere
        best = float("-inf")

        # Best sum of a path that starts here and goes down one side
        def gain(node: Optional[TreeNode]) -> int:
            # Lets the inner function update best
            nonlocal best
            # No node adds nothing
            if not node:
                return 0
            # Ignore a branch that would lower the sum
            left = max(gain(node.left), 0)
            right = max(gain(node.right), 0)
            # Path bending here
            best = max(best, node.val + left + right)
            # Straight branch for the parent
            return node.val + max(left, right)

        # Explore the whole tree
        gain(root)
        return best
`,
});
