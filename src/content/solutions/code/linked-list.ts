import { defineCode } from "../types";

export default defineCode({
  "reverse-linked-list": `
class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        # previous is the reversed part so far, current is the next node to flip
        previous, current = None, head
        # Flip one link per step
        while current:
            # Remember the rest of the list before breaking the link
            following = current.next
            # Point this node backwards
            current.next = previous
            # Move both pointers one step forward
            previous, current = current, following
        # previous is now the new head
        return previous
`,

  "merge-two-sorted-lists": `
class Solution:
    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
        # Placeholder node before the merged list; tail is its last node
        dummy = tail = ListNode()
        # Take nodes while both lists have some
        while list1 and list2:
            # Take the smaller head
            if list1.val <= list2.val:
                tail.next, list1 = list1, list1.next
            else:
                tail.next, list2 = list2, list2.next
            # Move tail to the node just added
            tail = tail.next
        # Attach whatever is left
        tail.next = list1 or list2
        # The merged list starts after the placeholder
        return dummy.next
`,

  "add-two-numbers": `
class Solution:
    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
        # Placeholder node before the result; tail is its last node
        dummy = tail = ListNode()
        # Carry from the previous digit
        carry = 0
        # Keep going while there are digits or a carry left
        while l1 or l2 or carry:
            # Start from the carry
            total = carry
            # Add the digit from the first number, if any
            if l1:
                total += l1.val
                l1 = l1.next
            # Add the digit from the second number, if any
            if l2:
                total += l2.val
                l2 = l2.next
            # Split into the carry and the digit to write
            carry, digit = divmod(total, 10)
            # Append the digit
            tail.next = ListNode(digit)
            tail = tail.next
        # The sum starts after the placeholder
        return dummy.next
`,

  "linked-list-in-binary-tree": `
class Solution:
    def isSubPath(self, head: Optional[ListNode], root: Optional[TreeNode]) -> bool:
        # Does the list starting at node match a downward path starting at tree?
        def matches(node: Optional[ListNode], tree: Optional[TreeNode]) -> bool:
            # Every list node matched
            if not node:
                return True
            # Ran out of tree or the values differ
            if not tree or tree.val != node.val:
                return False
            # Continue the match down either child
            return matches(node.next, tree.left) or matches(node.next, tree.right)

        # An empty tree contains no path
        if not root:
            return False
        # Start the match here, or anywhere in the left or right subtree
        return matches(head, root) or self.isSubPath(head, root.left) or self.isSubPath(head, root.right)
`,

  "odd-even-linked-list": `
class Solution:
    def oddEvenList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        # Nothing to rearrange
        if not head:
            return head
        # Tails of the odd list and the even list
        odd, even = head, head.next
        # Remember where the even list starts, to attach it at the end
        even_head = even
        # Unzip the list two nodes at a time
        while even and even.next:
            # The next odd node comes after the current even node
            odd.next = even.next
            odd = odd.next
            # The next even node comes after the new odd node
            even.next = odd.next
            even = even.next
        # Put the even list after the odd list
        odd.next = even_head
        return head
`,

  "swap-nodes-in-pairs": `
class Solution:
    def swapPairs(self, head: Optional[ListNode]) -> Optional[ListNode]:
        # Placeholder before the head so the first pair is handled like any other
        dummy = ListNode(0, head)
        # The node just before the pair to swap
        previous = dummy
        # Swap while a full pair remains
        while previous.next and previous.next.next:
            # The two nodes of the pair
            first, second = previous.next, previous.next.next
            # The second node comes first now
            previous.next = second
            # The first node links to what came after the pair
            first.next = second.next
            # The second node links back to the first
            second.next = first
            # The first node is now the end of the swapped pair
            previous = first
        # The new list starts after the placeholder
        return dummy.next
`,

  "rotate-list": `
class Solution:
    def rotateRight(self, head: Optional[ListNode], k: int) -> Optional[ListNode]:
        # Zero or one node: rotating changes nothing
        if not head or not head.next:
            return head
        # Count the nodes and find the tail
        length, tail = 1, head
        # Walk to the last node
        while tail.next:
            tail = tail.next
            length += 1
        # Rotating by the length gives the same list, so only the remainder matters
        k %= length
        # No rotation needed
        if k == 0:
            return head
        # Make a ring
        tail.next = head
        # The new tail is length - k - 1 steps from the head
        new_tail = head
        # Walk to the new tail
        for _ in range(length - k - 1):
            new_tail = new_tail.next
        # The node after it is the new head
        new_head = new_tail.next
        # Break the ring
        new_tail.next = None
        return new_head
`,

  "reverse-linked-list-ii": `
class Solution:
    def reverseBetween(self, head: Optional[ListNode], left: int, right: int) -> Optional[ListNode]:
        # Placeholder before the head, in case left is 1
        dummy = ListNode(0, head)
        # The node just before position left
        previous = dummy
        # Walk to it
        for _ in range(left - 1):
            previous = previous.next
        # The first node of the section; it ends up at the section's end
        current = previous.next
        # Move each following node to the front of the section
        for _ in range(right - left):
            # The node to move
            moved = current.next
            # Unlink it
            current.next = moved.next
            # Put it at the front of the section
            moved.next = previous.next
            # Head insertion
            previous.next = moved
        # The list starts after the placeholder
        return dummy.next
`,

  "split-linked-list-in-parts": `
class Solution:
    def splitListToParts(self, head: Optional[ListNode], k: int) -> list[Optional[ListNode]]:
        # Count the nodes
        length, node = 0, head
        # Walk the whole list
        while node:
            length += 1
            node = node.next
        # Every part gets size nodes; the first extra parts get one more
        size, extra = divmod(length, k)
        # Heads of the parts
        parts = []
        # Start of the next part
        current = head
        # Build k parts
        for part in range(k):
            # This part starts here (None if the list ran out)
            parts.append(current)
            # Length of this part
            part_length = size + (1 if part < extra else 0)
            # Walk to the last node of the part
            for _ in range(part_length - 1):
                current = current.next
            # Cut the part off and move to the start of the next one
            if current:
                current.next, current = None, current.next
        # The k parts, empty ones as None
        return parts
`,

  "merge-k-sorted-lists": `
import heapq

class Solution:
    def mergeKLists(self, lists: list[Optional[ListNode]]) -> Optional[ListNode]:
        # The index breaks ties so ListNodes are never compared
        heap = [(node.val, index, node) for index, node in enumerate(lists) if node]
        # Arrange the heads as a heap
        heapq.heapify(heap)
        # Placeholder before the merged list; tail is its last node
        dummy = tail = ListNode()
        # Repeatedly take the smallest head
        while heap:
            # The smallest node among all list heads
            _, index, node = heapq.heappop(heap)
            # Append it
            tail.next = node
            tail = node
            # Its successor becomes the new head of that list
            if node.next:
                heapq.heappush(heap, (node.next.val, index, node.next))
        # The merged list starts after the placeholder
        return dummy.next
`,
});
