import { defineCode } from "../types";

export default defineCode({
  "reverse-linked-list": `
class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        prev, curr = None, head
        while curr:
            nxt = curr.next
            curr.next = prev
            prev, curr = curr, nxt
        return prev
`,

  "merge-two-sorted-lists": `
class Solution:
    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
        dummy = tail = ListNode()
        while list1 and list2:
            if list1.val <= list2.val:
                tail.next, list1 = list1, list1.next
            else:
                tail.next, list2 = list2, list2.next
            tail = tail.next
        tail.next = list1 or list2
        return dummy.next
`,

  "add-two-numbers": `
class Solution:
    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
        dummy = tail = ListNode()
        carry = 0
        while l1 or l2 or carry:
            total = carry
            if l1:
                total += l1.val
                l1 = l1.next
            if l2:
                total += l2.val
                l2 = l2.next
            carry, digit = divmod(total, 10)
            tail.next = ListNode(digit)
            tail = tail.next
        return dummy.next
`,

  "linked-list-in-binary-tree": `
class Solution:
    def isSubPath(self, head: Optional[ListNode], root: Optional[TreeNode]) -> bool:
        def matches(node: Optional[ListNode], tree: Optional[TreeNode]) -> bool:
            if not node:
                return True
            if not tree or tree.val != node.val:
                return False
            return matches(node.next, tree.left) or matches(node.next, tree.right)

        if not root:
            return False
        return matches(head, root) or self.isSubPath(head, root.left) or self.isSubPath(head, root.right)
`,

  "odd-even-linked-list": `
class Solution:
    def oddEvenList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        if not head:
            return head
        odd, even = head, head.next
        even_head = even
        while even and even.next:
            odd.next = even.next
            odd = odd.next
            even.next = odd.next
            even = even.next
        odd.next = even_head
        return head
`,

  "swap-nodes-in-pairs": `
class Solution:
    def swapPairs(self, head: Optional[ListNode]) -> Optional[ListNode]:
        dummy = ListNode(0, head)
        prev = dummy
        while prev.next and prev.next.next:
            a, b = prev.next, prev.next.next
            prev.next = b
            a.next = b.next
            b.next = a
            prev = a
        return dummy.next
`,

  "rotate-list": `
class Solution:
    def rotateRight(self, head: Optional[ListNode], k: int) -> Optional[ListNode]:
        if not head or not head.next:
            return head
        n, tail = 1, head
        while tail.next:
            tail = tail.next
            n += 1
        k %= n
        if k == 0:
            return head
        tail.next = head  # make a ring
        new_tail = head
        for _ in range(n - k - 1):
            new_tail = new_tail.next
        new_head = new_tail.next
        new_tail.next = None  # break it
        return new_head
`,

  "reverse-linked-list-ii": `
class Solution:
    def reverseBetween(self, head: Optional[ListNode], left: int, right: int) -> Optional[ListNode]:
        dummy = ListNode(0, head)
        prev = dummy
        for _ in range(left - 1):
            prev = prev.next
        curr = prev.next
        for _ in range(right - left):
            moved = curr.next
            curr.next = moved.next
            moved.next = prev.next
            prev.next = moved  # head insertion
        return dummy.next
`,

  "split-linked-list-in-parts": `
class Solution:
    def splitListToParts(self, head: Optional[ListNode], k: int) -> list[Optional[ListNode]]:
        n, node = 0, head
        while node:
            n += 1
            node = node.next
        size, extra = divmod(n, k)
        parts = []
        curr = head
        for i in range(k):
            parts.append(curr)
            length = size + (1 if i < extra else 0)
            for _ in range(length - 1):
                curr = curr.next
            if curr:
                curr.next, curr = None, curr.next
        return parts
`,

  "merge-k-sorted-lists": `
import heapq

class Solution:
    def mergeKLists(self, lists: list[Optional[ListNode]]) -> Optional[ListNode]:
        # the index breaks ties so ListNodes are never compared
        heap = [(node.val, i, node) for i, node in enumerate(lists) if node]
        heapq.heapify(heap)
        dummy = tail = ListNode()
        while heap:
            _, i, node = heapq.heappop(heap)
            tail.next = node
            tail = node
            if node.next:
                heapq.heappush(heap, (node.next.val, i, node.next))
        return dummy.next
`,
});
