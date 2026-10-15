import { defineCode } from "../types";

export default defineCode({
  "binary-tree-level-order-traversal-ii": `
from collections import deque

class Solution:
    def levelOrderBottom(self, root: Optional[TreeNode]) -> list[list[int]]:
        # An empty tree has no levels
        if not root:
            return []
        # Values of each level, top to bottom
        levels = []
        # Nodes waiting to be visited, level by level
        queue = deque([root])
        # One round per level
        while queue:
            # Values on this level
            level = []
            # The queue holds exactly this level's nodes right now
            for _ in range(len(queue)):
                # Visit the next node
                node = queue.popleft()
                level.append(node.val)
                # Queue its children for the next level
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
            # Save the finished level
            levels.append(level)
        # Reverse to list the levels bottom-up
        return levels[::-1]
`,

  "maximum-depth-of-binary-tree": `
class Solution:
    def maxDepth(self, root: Optional[TreeNode]) -> int:
        # An empty tree has depth 0
        if not root:
            return 0
        # This node plus the deeper of its two subtrees
        return 1 + max(self.maxDepth(root.left), self.maxDepth(root.right))
`,

  "binary-tree-level-order-traversal": `
from collections import deque

class Solution:
    def levelOrder(self, root: Optional[TreeNode]) -> list[list[int]]:
        # An empty tree has no levels
        if not root:
            return []
        # Values of each level, top to bottom
        levels = []
        # Nodes waiting to be visited, level by level
        queue = deque([root])
        # One round per level
        while queue:
            # Values on this level
            level = []
            # Exactly one level per round
            for _ in range(len(queue)):
                # Visit the next node
                node = queue.popleft()
                level.append(node.val)
                # Queue its children for the next level
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
            # Save the finished level
            levels.append(level)
        # Every level, top to bottom
        return levels
`,

  "binary-tree-zigzag-level-order-traversal": `
from collections import deque

class Solution:
    def zigzagLevelOrder(self, root: Optional[TreeNode]) -> list[list[int]]:
        # An empty tree has no levels
        if not root:
            return []
        # Values of each level, in zigzag order
        levels = []
        # Nodes waiting to be visited, level by level
        queue = deque([root])
        # Direction of the current level
        left_to_right = True
        # One round per level
        while queue:
            # Values on this level, read left to right
            level = []
            # The queue holds exactly this level's nodes right now
            for _ in range(len(queue)):
                # Visit the next node
                node = queue.popleft()
                level.append(node.val)
                # Queue its children for the next level
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
            # Reverse every other level
            levels.append(level if left_to_right else level[::-1])
            # Flip the direction for the next level
            left_to_right = not left_to_right
        # Every level in zigzag order
        return levels
`,

  "binary-tree-right-side-view": `
from collections import deque

class Solution:
    def rightSideView(self, root: Optional[TreeNode]) -> list[int]:
        # An empty tree shows nothing
        if not root:
            return []
        # The rightmost value of each level
        view = []
        # Nodes waiting to be visited, level by level
        queue = deque([root])
        # One round per level
        while queue:
            # Visit every node on this level, left to right
            for _ in range(len(queue)):
                node = queue.popleft()
                # Queue its children for the next level
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
            # Last node popped this level
            view.append(node.val)
        # What you see from the right, top to bottom
        return view
`,

  "populating-next-right-pointers-in-each-node": `
class Solution:
    def connect(self, root: Optional[Node]) -> Optional[Node]:
        # The first node of the level being walked
        leftmost = root
        # Stop when the level has no children (the last level)
        while leftmost and leftmost.left:
            # Start at the left end of the level
            node = leftmost
            # Walk this level via next, wiring the one below
            while node:
                # The left child points to its sibling
                node.left.next = node.right
                # The right child points to the left child of the next node over
                if node.next:
                    node.right.next = node.next.left
                # Move right along the level
                node = node.next
            # Go down to the next level
            leftmost = leftmost.left
        # The tree with every next pointer set
        return root
`,

  "count-complete-tree-nodes": `
class Solution:
    def countNodes(self, root: Optional[TreeNode]) -> int:
        # An empty tree has no nodes
        if not root:
            return 0
        # Depth along the leftmost path
        left_depth, node = 0, root
        # Walk down the left edge
        while node:
            left_depth += 1
            node = node.left
        # Depth along the rightmost path
        right_depth, node = 0, root
        # Walk down the right edge
        while node:
            right_depth += 1
            node = node.right
        # Both edges equal: perfect subtree, so 2^depth - 1 nodes
        if left_depth == right_depth:
            return (1 << left_depth) - 1
        # Otherwise count this node and both subtrees
        return 1 + self.countNodes(root.left) + self.countNodes(root.right)
`,

  "maximum-level-sum-of-a-binary-tree": `
from collections import deque

class Solution:
    def maxLevelSum(self, root: Optional[TreeNode]) -> int:
        # Largest level sum seen, and which level had it
        best_sum, best_level = float("-inf"), 0
        # Nodes waiting to be visited, level by level
        queue = deque([root])
        # Current level number (the root is level 1)
        level = 0
        # One round per level
        while queue:
            level += 1
            # Sum of this level
            total = 0
            # The queue holds exactly this level's nodes right now
            for _ in range(len(queue)):
                # Visit the next node
                node = queue.popleft()
                total += node.val
                # Queue its children for the next level
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
            # Strict: ties keep the smaller level
            if total > best_sum:
                best_sum, best_level = total, level
        # The level with the largest sum
        return best_level
`,

  "find-largest-value-in-each-tree-row": `
from collections import deque

class Solution:
    def largestValues(self, root: Optional[TreeNode]) -> list[int]:
        # An empty tree has no rows
        if not root:
            return []
        # Largest value of each row
        result = []
        # Nodes waiting to be visited, level by level
        queue = deque([root])
        # One round per row
        while queue:
            # Largest value seen on this row
            best = float("-inf")
            # The queue holds exactly this row's nodes right now
            for _ in range(len(queue)):
                # Visit the next node
                node = queue.popleft()
                best = max(best, node.val)
                # Queue its children for the next row
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
            # Save this row's largest value
            result.append(best)
        # Largest value of every row, top to bottom
        return result
`,

  "serialize-and-deserialize-binary-tree": `
from collections import deque

class Codec:
    def serialize(self, root: Optional[TreeNode]) -> str:
        # Node values in level order, with "#" for missing children
        tokens = []
        # Nodes waiting to be written (None stands for a missing child)
        queue = deque([root])
        # Breadth-first walk of the tree
        while queue:
            # The next node to write
            node = queue.popleft()
            # A real node: write its value and queue both children, even missing ones
            if node:
                tokens.append(str(node.val))
                queue.append(node.left)
                queue.append(node.right)
            # A missing child is written as "#"
            else:
                tokens.append("#")
        # Comma-separated string
        return ",".join(tokens)

    def deserialize(self, data: str) -> Optional[TreeNode]:
        # Split back into values
        tokens = data.split(",")
        # "#" first means the tree was empty
        if tokens[0] == "#":
            return None
        # Rebuild the root
        root = TreeNode(int(tokens[0]))
        # Nodes whose children are still to be read, in level order
        parents = deque([root])
        # Position of the next token to read
        position = 1
        # Give each parent its two children
        while parents:
            # The next parent
            node = parents.popleft()
            # The next token is its left child
            if tokens[position] != "#":
                node.left = TreeNode(int(tokens[position]))
                parents.append(node.left)
            # The token after that is its right child
            if tokens[position + 1] != "#":
                node.right = TreeNode(int(tokens[position + 1]))
                parents.append(node.right)
            # Two tokens used
            position += 2
        # The rebuilt tree
        return root
`,
});
