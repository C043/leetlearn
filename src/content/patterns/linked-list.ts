import { definePattern } from "../types";

export default definePattern({
  slug: "linked-list",
  name: "Linked List",
  description:
    "Repoint nodes instead of moving data — reversals, merges and dummy heads are the core moves.",
  order: 5,
  problems: [
    { slug: "reverse-linked-list", title: "Reverse Linked List", difficulty: "EASY", leetcodeUrl: "https://leetcode.com/problems/reverse-linked-list/" },
    { slug: "merge-two-sorted-lists", title: "Merge Two Sorted Lists", difficulty: "EASY", leetcodeUrl: "https://leetcode.com/problems/merge-two-sorted-lists/" },
    { slug: "add-two-numbers", title: "Add Two Numbers", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/add-two-numbers/" },
    { slug: "linked-list-in-binary-tree", title: "Linked List in Binary Tree", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/linked-list-in-binary-tree/" },
    { slug: "odd-even-linked-list", title: "Odd Even Linked List", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/odd-even-linked-list/" },
    { slug: "swap-nodes-in-pairs", title: "Swap Nodes in Pairs", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/swap-nodes-in-pairs/" },
    { slug: "rotate-list", title: "Rotate List", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/rotate-list/" },
    { slug: "reverse-linked-list-ii", title: "Reverse Linked List II", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/reverse-linked-list-ii/" },
    { slug: "split-linked-list-in-parts", title: "Split Linked List in Parts", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/split-linked-list-in-parts/" },
    { slug: "merge-k-sorted-lists", title: "Merge k Sorted Lists", difficulty: "HARD", leetcodeUrl: "https://leetcode.com/problems/merge-k-sorted-lists/" },
  ],
});
