import { definePattern } from "../types";

export default definePattern({
  slug: "stack-queue",
  name: "Stack & Queue",
  description:
    "LIFO/FIFO structures give you the most recent or next-in-line element — the basis for parsing, monotonic stacks and BFS.",
  order: 6,
  problems: [
    { slug: "valid-parentheses", title: "Valid Parentheses", difficulty: "EASY", leetcodeUrl: "https://leetcode.com/problems/valid-parentheses/" },
    { slug: "implement-queue-using-stacks", title: "Implement Queue using Stacks", difficulty: "EASY", leetcodeUrl: "https://leetcode.com/problems/implement-queue-using-stacks/" },
    { slug: "daily-temperatures", title: "Daily Temperatures", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/daily-temperatures/" },
    { slug: "next-greater-element-ii", title: "Next Greater Element II", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/next-greater-element-ii/" },
    { slug: "asteroid-collision", title: "Asteroid Collision", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/asteroid-collision/" },
    { slug: "online-stock-span", title: "Online Stock Span", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/online-stock-span/" },
    { slug: "decode-string", title: "Decode String", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/decode-string/" },
    { slug: "remove-k-digits", title: "Remove K Digits", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/remove-k-digits/" },
    { slug: "sum-of-subarray-minimums", title: "Sum of Subarray Minimums", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/sum-of-subarray-minimums/" },
    { slug: "largest-rectangle-in-histogram", title: "Largest Rectangle in Histogram", difficulty: "HARD", leetcodeUrl: "https://leetcode.com/problems/largest-rectangle-in-histogram/" },
  ],
});
