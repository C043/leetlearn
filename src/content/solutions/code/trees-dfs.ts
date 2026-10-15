import { defineCode } from "../types";

export default defineCode({
  "invert-binary-tree": `
class Solution:
    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        if root:
            root.left, root.right = self.invertTree(root.right), self.invertTree(root.left)
        return root
`,

  "same-tree": `
class Solution:
    def isSameTree(self, p: Optional[TreeNode], q: Optional[TreeNode]) -> bool:
        if not p or not q:
            return p is q
        return p.val == q.val and self.isSameTree(p.left, q.left) and self.isSameTree(p.right, q.right)
`,

  "binary-tree-paths": `
class Solution:
    def binaryTreePaths(self, root: Optional[TreeNode]) -> list[str]:
        res = []

        def dfs(node: Optional[TreeNode], path: list[str]) -> None:
            if not node:
                return
            path.append(str(node.val))
            if not node.left and not node.right:
                res.append("->".join(path))
            else:
                dfs(node.left, path)
                dfs(node.right, path)
            path.pop()

        dfs(root, [])
        return res
`,

  "validate-binary-search-tree": `
class Solution:
    def isValidBST(self, root: Optional[TreeNode]) -> bool:
        def valid(node: Optional[TreeNode], lo: float, hi: float) -> bool:
            if not node:
                return True
            if not lo < node.val < hi:
                return False
            return valid(node.left, lo, node.val) and valid(node.right, node.val, hi)

        return valid(root, float("-inf"), float("inf"))
`,

  "lowest-common-ancestor-of-a-binary-tree": `
class Solution:
    def lowestCommonAncestor(self, root: TreeNode, p: TreeNode, q: TreeNode) -> TreeNode:
        if not root or root is p or root is q:
            return root
        left = self.lowestCommonAncestor(root.left, p, q)
        right = self.lowestCommonAncestor(root.right, p, q)
        if left and right:
            return root
        return left or right
`,

  "path-sum-iii": `
from collections import defaultdict

class Solution:
    def pathSum(self, root: Optional[TreeNode], targetSum: int) -> int:
        counts = defaultdict(int)
        counts[0] = 1  # the empty prefix above the root

        def dfs(node: Optional[TreeNode], prefix: int) -> int:
            if not node:
                return 0
            prefix += node.val
            found = counts[prefix - targetSum]
            counts[prefix] += 1
            found += dfs(node.left, prefix) + dfs(node.right, prefix)
            counts[prefix] -= 1  # leave this path
            return found

        return dfs(root, 0)
`,

  "count-good-nodes-in-binary-tree": `
class Solution:
    def goodNodes(self, root: TreeNode) -> int:
        def dfs(node: Optional[TreeNode], max_so_far: int) -> int:
            if not node:
                return 0
            good = 1 if node.val >= max_so_far else 0
            max_so_far = max(max_so_far, node.val)
            return good + dfs(node.left, max_so_far) + dfs(node.right, max_so_far)

        return dfs(root, root.val)
`,

  "construct-binary-tree-from-preorder-and-inorder-traversal": `
class Solution:
    def buildTree(self, preorder: list[int], inorder: list[int]) -> Optional[TreeNode]:
        index = {v: i for i, v in enumerate(inorder)}
        pre = iter(preorder)

        def build(lo: int, hi: int) -> Optional[TreeNode]:
            # builds the subtree whose inorder slice is [lo, hi)
            if lo >= hi:
                return None
            root = TreeNode(next(pre))
            mid = index[root.val]
            root.left = build(lo, mid)
            root.right = build(mid + 1, hi)
            return root

        return build(0, len(inorder))
`,

  "unique-binary-search-trees": `
class Solution:
    def numTrees(self, n: int) -> int:
        g = [0] * (n + 1)
        g[0] = 1
        for nodes in range(1, n + 1):
            for root in range(1, nodes + 1):
                g[nodes] += g[root - 1] * g[nodes - root]
        return g[n]
`,

  "binary-tree-maximum-path-sum": `
class Solution:
    def maxPathSum(self, root: Optional[TreeNode]) -> int:
        best = float("-inf")

        def gain(node: Optional[TreeNode]) -> int:
            nonlocal best
            if not node:
                return 0
            left = max(gain(node.left), 0)
            right = max(gain(node.right), 0)
            best = max(best, node.val + left + right)  # path bending here
            return node.val + max(left, right)         # straight branch for the parent

        gain(root)
        return best
`,
});
