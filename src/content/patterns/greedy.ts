import { definePattern } from "../types";

export default definePattern({
  slug: "greedy",
  name: "Greedy",
  description:
    "Take the locally optimal choice at each step and prove it never hurts the global optimum.",
  order: 13,
  problems: [
    {
      slug: "assign-cookies",
      title: "Assign Cookies",
      difficulty: "EASY",
      leetcodeUrl: "https://leetcode.com/problems/assign-cookies/",
      summary:
        "Child `i` is content with a cookie of size at least `g[i]`; cookie `j` has size `s[j]`. Each child gets at most one cookie. Return the most children you can make content.",
    },
    {
      slug: "lemonade-change",
      title: "Lemonade Change",
      difficulty: "EASY",
      leetcodeUrl: "https://leetcode.com/problems/lemonade-change/",
      summary:
        "Lemonade costs $5. Customers pay in order with a $5, $10 or $20 bill, and you start with no change. Return `True` if you can give every customer correct change.",
    },
    {
      slug: "jump-game",
      title: "Jump Game",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/jump-game/",
      summary:
        "You start at index 0; `nums[i]` is the **maximum** jump length from index `i`. Return `True` if you can reach the last index.",
    },
    {
      slug: "jump-game-ii",
      title: "Jump Game II",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/jump-game-ii/",
      summary:
        "Same setup as Jump Game, and the last index is guaranteed reachable. Return the **minimum** number of jumps needed to reach it.",
    },
    {
      slug: "gas-station",
      title: "Gas Station",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/gas-station/",
      summary:
        "Stations sit on a circular route. Station `i` gives `gas[i]`, and driving to the next station costs `cost[i]`. Starting with an empty tank, return the station index from which you can drive the full circle, or `-1` (the answer is unique if it exists).",
    },
    {
      slug: "partition-labels",
      title: "Partition Labels",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/partition-labels/",
      summary:
        "Split string `s` into as many parts as possible so that each letter appears in **at most one** part. Return the sizes of the parts, in order.",
    },
    {
      slug: "maximum-subarray",
      title: "Maximum Subarray",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/maximum-subarray/",
      summary:
        "Given `nums`, return the largest sum of any non-empty contiguous subarray.",
    },
    {
      slug: "hand-of-straights",
      title: "Hand of Straights",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/hand-of-straights/",
      summary:
        "Return `True` if the cards in `hand` can be rearranged into groups of `groupSize` **consecutive** values (e.g. 3, 4, 5), using every card exactly once.",
    },
    {
      slug: "minimum-number-of-arrows-to-burst-balloons",
      title: "Minimum Number of Arrows to Burst Balloons",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/",
      summary:
        "Balloons are horizontal ranges `[start, end]`. An arrow shot straight up at `x` bursts every balloon with `start <= x <= end`. Return the minimum number of arrows to burst all balloons.",
    },
    {
      slug: "candy",
      title: "Candy",
      difficulty: "HARD",
      leetcodeUrl: "https://leetcode.com/problems/candy/",
      summary:
        "Children stand in a line with `ratings`. Each gets at least one candy, and a child with a higher rating than a neighbour must get more candy than that neighbour. Return the minimum total candy.",
    },
  ],
});
