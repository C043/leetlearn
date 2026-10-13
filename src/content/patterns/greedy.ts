import { definePattern } from "../types";

export default definePattern({
  slug: "greedy",
  name: "Greedy",
  description:
    "Take the locally optimal choice at each step and prove it never hurts the global optimum.",
  order: 13,
  problems: [
    { slug: "assign-cookies", title: "Assign Cookies", difficulty: "EASY", leetcodeUrl: "https://leetcode.com/problems/assign-cookies/" },
    { slug: "lemonade-change", title: "Lemonade Change", difficulty: "EASY", leetcodeUrl: "https://leetcode.com/problems/lemonade-change/" },
    { slug: "jump-game", title: "Jump Game", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/jump-game/" },
    { slug: "jump-game-ii", title: "Jump Game II", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/jump-game-ii/" },
    { slug: "gas-station", title: "Gas Station", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/gas-station/" },
    { slug: "partition-labels", title: "Partition Labels", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/partition-labels/" },
    { slug: "maximum-subarray", title: "Maximum Subarray", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/maximum-subarray/" },
    { slug: "hand-of-straights", title: "Hand of Straights", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/hand-of-straights/" },
    { slug: "minimum-number-of-arrows-to-burst-balloons", title: "Minimum Number of Arrows to Burst Balloons", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/" },
    { slug: "candy", title: "Candy", difficulty: "HARD", leetcodeUrl: "https://leetcode.com/problems/candy/" },
  ],
});
