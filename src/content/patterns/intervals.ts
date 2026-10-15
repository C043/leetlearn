import { definePattern } from "../types";

export default definePattern({
  slug: "intervals",
  name: "Intervals",
  description:
    "Sort, then merge or sweep — overlapping ranges collapse into far fewer segments than you started with.",
  order: 14,
  problems: [
    {
      slug: "summary-ranges",
      title: "Summary Ranges",
      difficulty: "EASY",
      leetcodeUrl: "https://leetcode.com/problems/summary-ranges/",
      summary:
        "Given a sorted array of unique integers, return the smallest list of ranges that covers exactly those numbers, written as `\"a->b\"` for a run or `\"a\"` for a single number.",
    },
    {
      slug: "teemo-attacking",
      title: "Teemo Attacking",
      difficulty: "EASY",
      leetcodeUrl: "https://leetcode.com/problems/teemo-attacking/",
      summary:
        "Each attack at time `t` poisons the target for `duration` seconds (`[t, t + duration - 1]`); a new attack resets the timer. Given sorted attack times, return the total number of seconds the target is poisoned.",
    },
    {
      slug: "merge-intervals",
      title: "Merge Intervals",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/merge-intervals/",
      summary:
        "Given a list of `[start, end]` intervals, merge all overlapping ones (touching intervals like `[1,4]` and `[4,5]` count as overlapping) and return the non-overlapping result.",
    },
    {
      slug: "insert-interval",
      title: "Insert Interval",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/insert-interval/",
      summary:
        "Given non-overlapping intervals sorted by start, insert `newInterval`, merging where needed, and return the list still sorted and non-overlapping.",
    },
    {
      slug: "non-overlapping-intervals",
      title: "Non-overlapping Intervals",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/non-overlapping-intervals/",
      summary:
        "Return the minimum number of intervals to remove so that the rest don't overlap. Intervals that only touch (like `[1,2]` and `[2,3]`) don't overlap.",
    },
    {
      slug: "remove-covered-intervals",
      title: "Remove Covered Intervals",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/remove-covered-intervals/",
      summary:
        "Interval `[a, b]` is covered by `[c, d]` if `c <= a` and `b <= d`. Remove every interval covered by another one and return how many remain.",
    },
    {
      slug: "find-right-interval",
      title: "Find Right Interval",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/find-right-interval/",
      summary:
        "For each interval `i`, its right interval is the one `j` with the **smallest** start such that `start_j >= end_i` (possibly `i` itself). Return the index of each interval's right interval, or `-1`. All starts are unique.",
    },
    {
      slug: "interval-list-intersections",
      title: "Interval List Intersections",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/interval-list-intersections/",
      summary:
        "Given two lists of closed intervals, each sorted and non-overlapping, return the intersection of the two lists (every overlap between an interval from one and an interval from the other).",
    },
    {
      slug: "car-pooling",
      title: "Car Pooling",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/car-pooling/",
      summary:
        "A car with `capacity` seats drives east only. `trips[i] = [passengers, from, to]` picks up at `from` and drops off at `to`. Return `True` if all trips fit without ever exceeding capacity.",
    },
    {
      slug: "minimum-interval-to-include-each-query",
      title: "Minimum Interval to Include Each Query",
      difficulty: "HARD",
      leetcodeUrl: "https://leetcode.com/problems/minimum-interval-to-include-each-query/",
      summary:
        "For each query, find the smallest interval `[left, right]` with `left <= query <= right`; its size is `right - left + 1`. Return the size for each query, or `-1` if no interval contains it.",
    },
  ],
});
