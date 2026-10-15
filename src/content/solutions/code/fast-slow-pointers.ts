import { defineCode } from "../types";

export default defineCode({
  "linked-list-cycle": `
class Solution:
    def hasCycle(self, head: Optional[ListNode]) -> bool:
        slow = fast = head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
            if slow is fast:
                return True
        return False
`,

  "middle-of-the-linked-list": `
class Solution:
    def middleNode(self, head: Optional[ListNode]) -> Optional[ListNode]:
        slow = fast = head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
        return slow
`,

  "linked-list-cycle-ii": `
class Solution:
    def detectCycle(self, head: Optional[ListNode]) -> Optional[ListNode]:
        slow = fast = head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
            if slow is fast:
                slow = head
                while slow is not fast:
                    slow = slow.next
                    fast = fast.next
                return slow
        return None
`,

  "find-the-duplicate-number": `
class Solution:
    def findDuplicate(self, nums: list[int]) -> int:
        slow = fast = 0
        while True:
            slow = nums[slow]
            fast = nums[nums[fast]]
            if slow == fast:
                break
        slow = 0
        while slow != fast:
            slow = nums[slow]
            fast = nums[fast]
        return slow
`,

  "happy-number": `
class Solution:
    def isHappy(self, n: int) -> bool:
        def step(x: int) -> int:
            total = 0
            while x:
                x, d = divmod(x, 10)
                total += d * d
            return total

        slow, fast = n, step(n)
        while fast != 1 and slow != fast:
            slow = step(slow)
            fast = step(step(fast))
        return fast == 1
`,

  "circular-array-loop": `
class Solution:
    def circularArrayLoop(self, nums: list[int]) -> bool:
        n = len(nums)

        def nxt(i: int) -> int:
            return (i + nums[i]) % n

        for start in range(n):
            if nums[start] == 0:
                continue
            forward = nums[start] > 0
            slow = fast = start
            while True:
                # fast must keep the same direction for two hops
                f1 = nxt(fast)
                if nums[f1] == 0 or (nums[f1] > 0) != forward:
                    break
                f2 = nxt(f1)
                if nums[f2] == 0 or (nums[f2] > 0) != forward:
                    break
                slow, fast = nxt(slow), f2
                if slow == fast:
                    if slow != nxt(slow):  # length-1 loops don't count
                        return True
                    break
            # mark this dead-end path so it's never walked again
            i = start
            while nums[i] != 0 and (nums[i] > 0) == forward:
                j = nxt(i)
                nums[i] = 0
                i = j
        return False
`,

  "sort-list": `
class Solution:
    def sortList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        if not head or not head.next:
            return head
        # split: slow stops at the end of the first half
        slow, fast = head, head.next
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
        second = slow.next
        slow.next = None
        left, right = self.sortList(head), self.sortList(second)

        dummy = tail = ListNode()
        while left and right:
            if left.val <= right.val:
                tail.next, left = left, left.next
            else:
                tail.next, right = right, right.next
            tail = tail.next
        tail.next = left or right
        return dummy.next
`,

  "reorder-list": `
class Solution:
    def reorderList(self, head: Optional[ListNode]) -> None:
        # 1. find the middle
        slow = fast = head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
        # 2. reverse the second half
        prev, curr = None, slow.next
        slow.next = None
        while curr:
            curr.next, prev, curr = prev, curr, curr.next
        # 3. merge alternately
        first, second = head, prev
        while second:
            n1, n2 = first.next, second.next
            first.next = second
            second.next = n1
            first, second = n1, n2
`,

  "partition-list": `
class Solution:
    def partition(self, head: Optional[ListNode], x: int) -> Optional[ListNode]:
        before = b = ListNode()
        after = a = ListNode()
        while head:
            if head.val < x:
                b.next = head
                b = b.next
            else:
                a.next = head
                a = a.next
            head = head.next
        a.next = None  # cut the old link or the list may cycle
        b.next = after.next
        return before.next
`,

  "reverse-nodes-in-k-group": `
class Solution:
    def reverseKGroup(self, head: Optional[ListNode], k: int) -> Optional[ListNode]:
        dummy = ListNode(0, head)
        group_prev = dummy
        while True:
            # check that k nodes remain
            kth = group_prev
            for _ in range(k):
                kth = kth.next
                if not kth:
                    return dummy.next
            group_next = kth.next
            # reverse the block, pointing its first node at group_next
            prev, curr = group_next, group_prev.next
            while curr is not group_next:
                curr.next, prev, curr = prev, curr, curr.next
            first = group_prev.next
            group_prev.next = kth
            group_prev = first
`,
});
