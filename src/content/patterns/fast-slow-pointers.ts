import { definePattern } from "../types";

export default definePattern({
  slug: "fast-slow-pointers",
  name: "Fast & Slow Pointers",
  description:
    "A slow and a fast runner traverse the same structure at different speeds to detect cycles and find middles in O(1) space.",
  order: 4,
  problems: [
    {
      slug: "linked-list-cycle",
      title: "Linked List Cycle",
      difficulty: "EASY",
      leetcodeUrl: "https://leetcode.com/problems/linked-list-cycle/",
      summary:
        "Given the `head` of a linked list, return `True` if some node can be reached again by following `next` pointers (a cycle), otherwise `False`. Aim for O(1) extra memory.",
    },
    {
      slug: "middle-of-the-linked-list",
      title: "Middle of the Linked List",
      difficulty: "EASY",
      leetcodeUrl: "https://leetcode.com/problems/middle-of-the-linked-list/",
      summary:
        "Given the `head` of a singly linked list, return its middle node. With two middle nodes (even length), return the **second** one.",
    },
    {
      slug: "linked-list-cycle-ii",
      title: "Linked List Cycle II",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/linked-list-cycle-ii/",
      summary:
        "Given the `head` of a linked list, return the node where a cycle begins, or `None` if there is no cycle. Don't modify the list; aim for O(1) extra memory.",
    },
    {
      slug: "find-the-duplicate-number",
      title: "Find the Duplicate Number",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/find-the-duplicate-number/",
      summary:
        "`nums` has `n + 1` integers, each in `[1, n]`, and exactly one value is repeated (possibly many times). Return that value without modifying `nums` and using O(1) extra space.",
    },
    {
      slug: "happy-number",
      title: "Happy Number",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/happy-number/",
      summary:
        "Repeatedly replace `n` by the sum of the squares of its digits. `n` is happy if this reaches 1; otherwise it loops forever without reaching 1. Return `True` if `n` is happy.",
    },
    {
      slug: "circular-array-loop",
      title: "Circular Array Loop",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/circular-array-loop/",
      summary:
        "In a circular array `nums`, from index `i` you jump `nums[i]` steps (forward if positive, backward if negative, wrapping around). Return `True` if there is a cycle of length > 1 whose jumps all go in the **same direction**.",
    },
    {
      slug: "sort-list",
      title: "Sort List",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/sort-list/",
      summary:
        "Given the `head` of a linked list, return the list sorted in ascending order, in O(n log n) time.",
    },
    {
      slug: "reorder-list",
      title: "Reorder List",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/reorder-list/",
      summary:
        "Given a list `L0 → L1 → … → Ln`, reorder it **in place** to `L0 → Ln → L1 → Ln-1 → L2 → …`. Only links may change, not node values.",
    },
    {
      slug: "partition-list",
      title: "Partition List",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/partition-list/",
      summary:
        "Given the `head` of a linked list and a value `x`, move all nodes with values less than `x` before the nodes with values `>= x`, keeping the original relative order within each group.",
    },
    {
      slug: "reverse-nodes-in-k-group",
      title: "Reverse Nodes in k-Group",
      difficulty: "HARD",
      leetcodeUrl: "https://leetcode.com/problems/reverse-nodes-in-k-group/",
      summary:
        "Given the `head` of a linked list, reverse its nodes `k` at a time and return the new head. A final group with fewer than `k` nodes stays as it is. Only links may change, not values.",
    },
  ],
});
