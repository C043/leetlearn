import { defineCode } from "../types";

export default defineCode({
  "linked-list-cycle": `
class Solution:
    def hasCycle(self, head: Optional[ListNode]) -> bool:
        # Both runners start at the head
        slow = fast = head
        # If fast reaches the end, there is no cycle
        while fast and fast.next:
            # Slow moves one step
            slow = slow.next
            # Fast moves two steps
            fast = fast.next.next
            # Inside a cycle, fast eventually laps slow and they meet
            if slow is fast:
                return True
        # Fast fell off the end of the list
        return False
`,

  "middle-of-the-linked-list": `
class Solution:
    def middleNode(self, head: Optional[ListNode]) -> Optional[ListNode]:
        # Both runners start at the head
        slow = fast = head
        # Stop when fast reaches the end
        while fast and fast.next:
            # Slow moves one step
            slow = slow.next
            # Fast moves two steps, so it covers twice the distance
            fast = fast.next.next
        # Slow has gone half as far as fast: it is in the middle
        return slow
`,

  "linked-list-cycle-ii": `
class Solution:
    def detectCycle(self, head: Optional[ListNode]) -> Optional[ListNode]:
        # Both runners start at the head
        slow = fast = head
        # If fast reaches the end, there is no cycle
        while fast and fast.next:
            # Slow moves one step, fast moves two
            slow = slow.next
            fast = fast.next.next
            # They met inside the cycle
            if slow is fast:
                # Head and the meeting point are the same distance from the cycle start
                slow = head
                # Walk both one step at a time until they meet
                while slow is not fast:
                    slow = slow.next
                    fast = fast.next
                # They meet exactly at the start of the cycle
                return slow
        # No cycle
        return None
`,

  "find-the-duplicate-number": `
class Solution:
    def findDuplicate(self, nums: list[int]) -> int:
        # Treat each value as a pointer to the next index: the duplicate starts a cycle
        slow = fast = 0
        # Phase 1: find a meeting point inside the cycle
        while True:
            # Slow follows one pointer
            slow = nums[slow]
            # Fast follows two pointers
            fast = nums[nums[fast]]
            # They met inside the cycle
            if slow == fast:
                break
        # Phase 2: restart slow from the beginning
        slow = 0
        # Move both one step at a time
        while slow != fast:
            slow = nums[slow]
            fast = nums[fast]
        # They meet at the cycle's entrance, which is the duplicate value
        return slow
`,

  "happy-number": `
class Solution:
    def isHappy(self, n: int) -> bool:
        # Replace a number by the sum of the squares of its digits
        def step(number: int) -> int:
            # Running sum of squared digits
            total = 0
            # Peel off digits from the right
            while number:
                # Split off the last digit
                number, digit = divmod(number, 10)
                # Add its square
                total += digit * digit
            # The next number in the sequence
            return total

        # Slow moves one step at a time, fast moves two
        slow, fast = n, step(n)
        # Stop when fast reaches 1 or the two meet in a loop
        while fast != 1 and slow != fast:
            slow = step(slow)
            fast = step(step(fast))
        # Happy only if the sequence reached 1
        return fast == 1
`,

  "circular-array-loop": `
class Solution:
    def circularArrayLoop(self, nums: list[int]) -> bool:
        # Length of the array
        length = len(nums)

        # Index reached by jumping from index, wrapping around the ends
        def next_index(index: int) -> int:
            return (index + nums[index]) % length

        # Try starting a walk from every index
        for start in range(length):
            # 0 marks an index already proven to not be in a loop
            if nums[start] == 0:
                continue
            # A loop must keep moving in one direction
            forward = nums[start] > 0
            # Both runners start here
            slow = fast = start
            # Walk until we find a loop or hit a dead end
            while True:
                # Fast must keep the same direction for two hops
                first_hop = next_index(fast)
                # Dead end or direction change after the first hop
                if nums[first_hop] == 0 or (nums[first_hop] > 0) != forward:
                    break
                # Second hop for fast
                second_hop = next_index(first_hop)
                # Dead end or direction change after the second hop
                if nums[second_hop] == 0 or (nums[second_hop] > 0) != forward:
                    break
                # Slow moves one step, fast moves two
                slow, fast = next_index(slow), second_hop
                # The runners met: there is a cycle
                if slow == fast:
                    # Length-1 loops don't count
                    if slow != next_index(slow):
                        return True
                    # A self-loop: give up on this start
                    break
            # Mark this dead-end path so it's never walked again
            index = start
            # Follow the path while it keeps the same direction
            while nums[index] != 0 and (nums[index] > 0) == forward:
                # Remember where to go before erasing this index
                following = next_index(index)
                # Mark the index as visited with no loop
                nums[index] = 0
                # Move along the path
                index = following
        # No valid loop anywhere
        return False
`,

  "sort-list": `
class Solution:
    def sortList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        # Zero or one node is already sorted
        if not head or not head.next:
            return head
        # Split: slow stops at the end of the first half
        slow, fast = head, head.next
        # Fast moves twice as fast, so slow ends in the middle
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
        # The second half starts right after slow
        second = slow.next
        # Cut the list into two halves
        slow.next = None
        # Sort each half recursively
        left, right = self.sortList(head), self.sortList(second)

        # Placeholder node before the merged list; tail is its last node
        dummy = tail = ListNode()
        # Merge while both halves have nodes
        while left and right:
            # Take the smaller head (<= keeps the sort stable)
            if left.val <= right.val:
                tail.next, left = left, left.next
            else:
                tail.next, right = right, right.next
            # Move tail to the node just added
            tail = tail.next
        # Attach whatever is left of the unfinished half
        tail.next = left or right
        # The merged list starts after the placeholder
        return dummy.next
`,

  "reorder-list": `
class Solution:
    def reorderList(self, head: Optional[ListNode]) -> None:
        # 1. Find the middle
        slow = fast = head
        # Fast moves twice as fast, so slow stops in the middle
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
        # 2. Reverse the second half, which starts after slow
        previous, current = None, slow.next
        # Cut the first half off
        slow.next = None
        # Turn each link around
        while current:
            current.next, previous, current = previous, current, current.next
        # 3. Merge the two halves alternately; previous is the reversed second half
        first, second = head, previous
        # The second half is never longer than the first
        while second:
            # Remember the nodes that come next in each half
            first_next, second_next = first.next, second.next
            # Put the second-half node right after the first-half node
            first.next = second
            # Then continue with the rest of the first half
            second.next = first_next
            # Move on to the next pair
            first, second = first_next, second_next
`,

  "partition-list": `
class Solution:
    def partition(self, head: Optional[ListNode], x: int) -> Optional[ListNode]:
        # Placeholder and tail of the list of values smaller than x
        before = before_tail = ListNode()
        # Placeholder and tail of the list of values x or bigger
        after = after_tail = ListNode()
        # Walk the original list
        while head:
            # Small values go to the "before" list
            if head.val < x:
                before_tail.next = head
                before_tail = before_tail.next
            # Other values go to the "after" list
            else:
                after_tail.next = head
                after_tail = after_tail.next
            # Next node
            head = head.next
        # Cut the old link or the list may cycle
        after_tail.next = None
        # Join the "before" list to the "after" list
        before_tail.next = after.next
        # The result starts after the "before" placeholder
        return before.next
`,

  "reverse-nodes-in-k-group": `
class Solution:
    def reverseKGroup(self, head: Optional[ListNode], k: int) -> Optional[ListNode]:
        # Placeholder before the head so the first group is handled like any other
        dummy = ListNode(0, head)
        # The node just before the group being reversed
        group_previous = dummy
        # Reverse one group per round
        while True:
            # Check that k nodes remain
            group_last = group_previous
            # Walk k steps to find the last node of the group
            for _ in range(k):
                group_last = group_last.next
                # Fewer than k nodes left: they stay as they are
                if not group_last:
                    return dummy.next
            # The node right after this group
            group_next = group_last.next
            # Reverse the block, pointing its first node at group_next
            previous, current = group_next, group_previous.next
            # Turn each link in the group around
            while current is not group_next:
                current.next, previous, current = previous, current, current.next
            # The old first node is now the last node of the group
            first = group_previous.next
            # Connect the previous part to the new first node
            group_previous.next = group_last
            # The next group comes after the old first node
            group_previous = first
`,
});
