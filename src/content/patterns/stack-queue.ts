import { definePattern } from "../types";

export default definePattern({
  slug: "stack-queue",
  name: "Stack & Queue",
  description:
    "LIFO/FIFO structures give you the most recent or next-in-line element — the basis for parsing, monotonic stacks and BFS.",
  order: 6,
  problems: [
    {
      slug: "valid-parentheses",
      title: "Valid Parentheses",
      difficulty: "EASY",
      leetcodeUrl: "https://leetcode.com/problems/valid-parentheses/",
      summary:
        "Given a string `s` of the characters `()[]{}`, return `True` if every bracket is closed by the same type of bracket, in the correct order.",
    },
    {
      slug: "implement-queue-using-stacks",
      title: "Implement Queue using Stacks",
      difficulty: "EASY",
      leetcodeUrl: "https://leetcode.com/problems/implement-queue-using-stacks/",
      summary:
        "Implement a first-in-first-out queue (`push`, `pop`, `peek`, `empty`) using only two stacks and their standard operations (push to top, pop/peek from top, size, empty).",
    },
    {
      slug: "daily-temperatures",
      title: "Daily Temperatures",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/daily-temperatures/",
      summary:
        "Given daily `temperatures`, return an array where `answer[i]` is how many days after day `i` you wait for a **warmer** temperature, or `0` if none comes.",
    },
    {
      slug: "next-greater-element-ii",
      title: "Next Greater Element II",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/next-greater-element-ii/",
      summary:
        "Given a **circular** array `nums` (after the last element comes the first), return for each element the first greater value found by walking forward, or `-1` if none exists.",
    },
    {
      slug: "asteroid-collision",
      title: "Asteroid Collision",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/asteroid-collision/",
      summary:
        "Each asteroid's size is `abs(value)` and its sign is its direction (positive = right, negative = left), all at the same speed. When two meet, the smaller explodes; equal sizes both explode. Return the asteroids left after all collisions.",
    },
    {
      slug: "online-stock-span",
      title: "Online Stock Span",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/online-stock-span/",
      summary:
        "Design `StockSpanner`: `next(price)` returns today's span, the number of consecutive days up to and including today on which the price was **less than or equal to** today's price.",
    },
    {
      slug: "decode-string",
      title: "Decode String",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/decode-string/",
      summary:
        "Decode a string encoded as `k[text]`, meaning `text` repeated `k` times, e.g. `3[a2[c]]` → `accaccacc`. Encodings can be nested and `k` can have several digits.",
    },
    {
      slug: "remove-k-digits",
      title: "Remove K Digits",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/remove-k-digits/",
      summary:
        "Given a non-negative integer `num` as a string, remove exactly `k` digits so the remaining number is as small as possible. Return it as a string without leading zeros (`\"0\"` if nothing is left).",
    },
    {
      slug: "sum-of-subarray-minimums",
      title: "Sum of Subarray Minimums",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/sum-of-subarray-minimums/",
      summary:
        "Given an array `arr`, return the sum of `min(subarray)` over every contiguous subarray, modulo `10^9 + 7`.",
    },
    {
      slug: "largest-rectangle-in-histogram",
      title: "Largest Rectangle in Histogram",
      difficulty: "HARD",
      leetcodeUrl: "https://leetcode.com/problems/largest-rectangle-in-histogram/",
      summary:
        "Given bar `heights` of a histogram where every bar has width 1, return the area of the largest rectangle that fits inside the histogram.",
    },
  ],
});
