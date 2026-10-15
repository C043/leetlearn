import { defineCode } from "../types";

export default defineCode({
  "binary-tree-level-order-traversal-ii": `
from collections import deque

class Solution:
    def levelOrderBottom(self, root: Optional[TreeNode]) -> list[list[int]]:
        if not root:
            return []
        levels = []
        queue = deque([root])
        while queue:
            level = []
            for _ in range(len(queue)):
                node = queue.popleft()
                level.append(node.val)
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
            levels.append(level)
        return levels[::-1]
`,

  "maximum-depth-of-binary-tree": `
class Solution:
    def maxDepth(self, root: Optional[TreeNode]) -> int:
        if not root:
            return 0
        return 1 + max(self.maxDepth(root.left), self.maxDepth(root.right))
`,

  "binary-tree-level-order-traversal": `
from collections import deque

class Solution:
    def levelOrder(self, root: Optional[TreeNode]) -> list[list[int]]:
        if not root:
            return []
        levels = []
        queue = deque([root])
        while queue:
            level = []
            for _ in range(len(queue)):  # exactly one level per round
                node = queue.popleft()
                level.append(node.val)
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
            levels.append(level)
        return levels
`,

  "binary-tree-zigzag-level-order-traversal": `
from collections import deque

class Solution:
    def zigzagLevelOrder(self, root: Optional[TreeNode]) -> list[list[int]]:
        if not root:
            return []
        levels = []
        queue = deque([root])
        left_to_right = True
        while queue:
            level = []
            for _ in range(len(queue)):
                node = queue.popleft()
                level.append(node.val)
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
            levels.append(level if left_to_right else level[::-1])
            left_to_right = not left_to_right
        return levels
`,

  "binary-tree-right-side-view": `
from collections import deque

class Solution:
    def rightSideView(self, root: Optional[TreeNode]) -> list[int]:
        if not root:
            return []
        view = []
        queue = deque([root])
        while queue:
            for _ in range(len(queue)):
                node = queue.popleft()
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
            view.append(node.val)  # last node popped this level
        return view
`,

  "populate-next-right-pointers-in-each-node": `
class Solution:
    def connect(self, root: Optional[Node]) -> Optional[Node]:
        leftmost = root
        while leftmost and leftmost.left:
            node = leftmost
            while node:  # walk this level via next, wiring the one below
                node.left.next = node.right
                if node.next:
                    node.right.next = node.next.left
                node = node.next
            leftmost = leftmost.left
        return root
`,

  "count-complete-tree-nodes": `
class Solution:
    def countNodes(self, root: Optional[TreeNode]) -> int:
        if not root:
            return 0
        left_depth, node = 0, root
        while node:
            left_depth += 1
            node = node.left
        right_depth, node = 0, root
        while node:
            right_depth += 1
            node = node.right
        if left_depth == right_depth:
            return (1 << left_depth) - 1  # perfect subtree
        return 1 + self.countNodes(root.left) + self.countNodes(root.right)
`,

  "maximum-level-sum-of-a-binary-tree": `
from collections import deque

class Solution:
    def maxLevelSum(self, root: Optional[TreeNode]) -> int:
        best_sum, best_level = float("-inf"), 0
        queue = deque([root])
        level = 0
        while queue:
            level += 1
            total = 0
            for _ in range(len(queue)):
                node = queue.popleft()
                total += node.val
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
            if total > best_sum:  # strict: ties keep the smaller level
                best_sum, best_level = total, level
        return best_level
`,

  "find-largest-value-in-each-tree-row": `
from collections import deque

class Solution:
    def largestValues(self, root: Optional[TreeNode]) -> list[int]:
        if not root:
            return []
        res = []
        queue = deque([root])
        while queue:
            best = float("-inf")
            for _ in range(len(queue)):
                node = queue.popleft()
                best = max(best, node.val)
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
            res.append(best)
        return res
`,

  "serialize-and-deserialize-binary-tree": `
from collections import deque

class Codec:
    def serialize(self, root: Optional[TreeNode]) -> str:
        tokens = []
        queue = deque([root])
        while queue:
            node = queue.popleft()
            if node:
                tokens.append(str(node.val))
                queue.append(node.left)
                queue.append(node.right)
            else:
                tokens.append("#")
        return ",".join(tokens)

    def deserialize(self, data: str) -> Optional[TreeNode]:
        tokens = data.split(",")
        if tokens[0] == "#":
            return None
        root = TreeNode(int(tokens[0]))
        parents = deque([root])
        i = 1
        while parents:
            node = parents.popleft()
            if tokens[i] != "#":
                node.left = TreeNode(int(tokens[i]))
                parents.append(node.left)
            if tokens[i + 1] != "#":
                node.right = TreeNode(int(tokens[i + 1]))
                parents.append(node.right)
            i += 2
        return root
`,
});
