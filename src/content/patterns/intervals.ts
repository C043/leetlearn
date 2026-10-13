import { definePattern } from "../types";

export default definePattern({
  slug: "intervals",
  name: "Intervals",
  description:
    "Sort, then merge or sweep — overlapping ranges collapse into far fewer segments than you started with.",
  order: 14,
  problems: [
    { slug: "summary-ranges", title: "Summary Ranges", difficulty: "EASY", leetcodeUrl: "https://leetcode.com/problems/summary-ranges/" },
    { slug: "teemo-attacking", title: "Teemo Attacking", difficulty: "EASY", leetcodeUrl: "https://leetcode.com/problems/teemo-attacking/" },
    { slug: "merge-intervals", title: "Merge Intervals", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/merge-intervals/" },
    { slug: "insert-interval", title: "Insert Interval", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/insert-interval/" },
    { slug: "non-overlapping-intervals", title: "Non-overlapping Intervals", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/non-overlapping-intervals/" },
    { slug: "remove-covered-intervals", title: "Remove Covered Intervals", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/remove-covered-intervals/" },
    { slug: "find-right-interval", title: "Find Right Interval", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/find-right-interval/" },
    { slug: "interval-list-intersections", title: "Interval List Intersections", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/interval-list-intersections/" },
    { slug: "car-pooling", title: "Car Pooling", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/car-pooling/" },
    { slug: "minimum-interval-to-include-each-query", title: "Minimum Interval to Include Each Query", difficulty: "HARD", leetcodeUrl: "https://leetcode.com/problems/minimum-interval-to-include-each-query/" },
  ],
});
