import { definePattern } from "../types";

export default definePattern({
  slug: "fast-slow-pointers",
  name: "Fast & Slow Pointers",
  description:
    "A slow and a fast runner traverse the same structure at different speeds to detect cycles and find middles in O(1) space.",
  order: 4,
  problems: [
    { slug: "linked-list-cycle", title: "Linked List Cycle", difficulty: "EASY", leetcodeUrl: "https://leetcode.com/problems/linked-list-cycle/" },
    { slug: "middle-of-the-linked-list", title: "Middle of the Linked List", difficulty: "EASY", leetcodeUrl: "https://leetcode.com/problems/middle-of-the-linked-list/" },
    { slug: "linked-list-cycle-ii", title: "Linked List Cycle II", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/linked-list-cycle-ii/" },
    { slug: "find-the-duplicate-number", title: "Find the Duplicate Number", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/find-the-duplicate-number/" },
    { slug: "happy-number", title: "Happy Number", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/happy-number/" },
    { slug: "circular-array-loop", title: "Circular Array Loop", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/circular-array-loop/" },
    { slug: "sort-list", title: "Sort List", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/sort-list/" },
    { slug: "reorder-list", title: "Reorder List", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/reorder-list/" },
    { slug: "partition-list", title: "Partition List", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/partition-list/" },
    { slug: "reverse-nodes-in-k-group", title: "Reverse Nodes in k-Group", difficulty: "HARD", leetcodeUrl: "https://leetcode.com/problems/reverse-nodes-in-k-group/" },
  ],
});
