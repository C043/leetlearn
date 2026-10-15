import { definePattern } from "../types";

export default definePattern({
  slug: "linked-list",
  name: "Linked List",
  description:
    "Repoint nodes instead of moving data — reversals, merges and dummy heads are the core moves.",
  order: 5,
  problems: [
    {
      slug: "reverse-linked-list",
      title: "Reverse Linked List",
      difficulty: "EASY",
      leetcodeUrl: "https://leetcode.com/problems/reverse-linked-list/",
      summary:
        "Given the `head` of a singly linked list, reverse the list and return the new head.",
    },
    {
      slug: "merge-two-sorted-lists",
      title: "Merge Two Sorted Lists",
      difficulty: "EASY",
      leetcodeUrl: "https://leetcode.com/problems/merge-two-sorted-lists/",
      summary:
        "Given the heads of two sorted linked lists, splice their nodes together into one sorted list and return its head.",
    },
    {
      slug: "add-two-numbers",
      title: "Add Two Numbers",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/add-two-numbers/",
      summary:
        "Two non-negative integers are stored as linked lists of digits in **reverse order** (ones digit first). Return their sum as a linked list in the same reverse format.",
    },
    {
      slug: "linked-list-in-binary-tree",
      title: "Linked List in Binary Tree",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/linked-list-in-binary-tree/",
      summary:
        "Given a binary tree `root` and a linked list `head`, return `True` if the list's values appear along some **downward** path in the tree (each step going to a child), starting from any node.",
    },
    {
      slug: "odd-even-linked-list",
      title: "Odd Even Linked List",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/odd-even-linked-list/",
      summary:
        "Group all nodes at **odd positions** (1st, 3rd, …) first, followed by the nodes at even positions, keeping the relative order inside each group. Positions, not values. O(1) extra space.",
    },
    {
      slug: "swap-nodes-in-pairs",
      title: "Swap Nodes in Pairs",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/swap-nodes-in-pairs/",
      summary:
        "Swap every two adjacent nodes of a linked list and return the new head. Swap the nodes themselves, not their values. A last unpaired node stays put.",
    },
    {
      slug: "rotate-list",
      title: "Rotate List",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/rotate-list/",
      summary:
        "Given the `head` of a linked list, rotate it to the right by `k` places: the last `k` nodes move to the front, in order. `k` can be larger than the list length.",
    },
    {
      slug: "reverse-linked-list-ii",
      title: "Reverse Linked List II",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/reverse-linked-list-ii/",
      summary:
        "Given the `head` of a linked list and 1-based positions `left <= right`, reverse only the nodes from position `left` to `right` and return the list.",
    },
    {
      slug: "split-linked-list-in-parts",
      title: "Split Linked List in Parts",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/split-linked-list-in-parts/",
      summary:
        "Split a linked list into `k` consecutive parts whose sizes differ by at most 1, with **earlier parts never smaller** than later ones. Parts may be empty (`None`).",
    },
    {
      slug: "merge-k-sorted-lists",
      title: "Merge k Sorted Lists",
      difficulty: "HARD",
      leetcodeUrl: "https://leetcode.com/problems/merge-k-sorted-lists/",
      summary:
        "Given an array of `k` sorted linked lists, merge them all into one sorted linked list and return its head.",
    },
  ],
});
