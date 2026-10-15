import { defineExercises } from "./types";

export default defineExercises({
  "summary-ranges": [
    {
      kind: "type",
      prompt: "Fill in the condition that extends the current range.",
      code: `
while index + 1 < len(nums) and nums[index + 1] == ___:
    index += 1`,
      answers: ["nums[index] + 1"],
      explanation: "A range continues while each next number is exactly one more.",
    },
    {
      kind: "type",
      prompt: "Fill in the format of a multi-number range.",
      code: `
f"{start}___{nums[index]}"`,
      answers: ["->"],
      explanation: "Ranges are written like `\"0->2\"`.",
    },
    {
      kind: "type",
      prompt: "`nums = [0, 1, 2, 4, 5, 7]`. What is the first range returned?",
      solution: true,
      answers: ["0->2"],
      explanation: "0, 1, 2 are consecutive.",
    },
    {
      kind: "type",
      prompt: "`nums = [0, 1, 2, 4, 5, 7]`. How many ranges are returned?",
      solution: true,
      answers: ["3"],
      explanation: "`0->2`, `4->5`, `7`.",
    },
    {
      kind: "type",
      prompt: "`nums = [0, 2, 3, 4, 6, 8, 9]`. What is the last range returned?",
      solution: true,
      answers: ["8->9"],
      explanation: "8 and 9 are consecutive.",
    },
    {
      kind: "type",
      prompt: "`nums = [-1]`. What is returned?",
      solution: true,
      answers: ["[\"-1\"]", "['-1']", "-1"],
      explanation: "A single number is written on its own.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n²)", why: "The inner loop advances the same `index`; each number is visited once." },
        { text: "O(n log n)", why: "The input is already sorted." },
      ],
      explanation: "Each number is visited once.",
    },
    {
      kind: "choice",
      prompt: "Why does `index += 1` appear after appending?",
      solution: true,
      options: [
        { text: "`index` points at the range's last number; the next range starts after it", correct: true },
        { text: "To skip a number", why: "No number is skipped; it moves past the finished range." },
        { text: "It's a bug", why: "Without it the loop would never advance past a single-number range." },
      ],
      explanation: "The inner loop leaves `index` on the range's end.",
    },
    {
      kind: "choice",
      prompt: "What breaks a range?",
      options: [
        { text: "A gap: the next number is more than one bigger", correct: true },
        { text: "An even number", why: "Parity doesn't matter." },
        { text: "A negative number", why: "Negative numbers can be in ranges, like `-2->0`." },
      ],
      explanation: "Ranges are maximal runs of consecutive integers.",
    },
    {
      kind: "choice",
      prompt: "Why is the input being **sorted** important?",
      options: [
        { text: "Consecutive values are next to each other, so one pass finds every run", correct: true },
        { text: "It isn't important", why: "In unsorted input, a run's numbers could be scattered." },
        { text: "So the output is sorted", why: "That's a side effect; the real reason is adjacency." },
      ],
      explanation: "Sorted order makes runs contiguous in the array.",
    },
  ],

  "teemo-attacking": [
    {
      kind: "type",
      prompt: "Fill in the poison time contributed by one attack (not the last).",
      code: `
total += min(duration, ___)`,
      answers: ["timeSeries[attack + 1] - timeSeries[attack]"],
      explanation: "The poison runs for `duration`, unless the next attack comes sooner and resets it.",
    },
    {
      kind: "type",
      prompt: "`timeSeries = [1, 4]`, `duration = 2`. What is returned?",
      solution: true,
      answers: ["4"],
      explanation: "Seconds 1–2 and 4–5: no overlap.",
    },
    {
      kind: "type",
      prompt: "`timeSeries = [1, 2]`, `duration = 2`. What is returned?",
      solution: true,
      answers: ["3"],
      explanation: "The second attack resets the timer at second 2: poisoned seconds 1, 2, 3.",
      mistakes: [{ answers: ["4"], why: "The overlap at second 2 is counted once, not twice." }],
    },
    {
      kind: "type",
      prompt: "`timeSeries = [1, 2, 3, 4, 5]`, `duration = 5`. What is returned?",
      solution: true,
      answers: ["9"],
      explanation: "1 + 1 + 1 + 1 for the gaps, plus 5 for the last attack.",
    },
    {
      kind: "type",
      prompt: "`timeSeries = []`, `duration = 3`. What is returned?",
      solution: true,
      answers: ["0"],
      explanation: "No attacks, no poison.",
    },
    {
      kind: "type",
      prompt: "Fill in what the last attack adds.",
      code: `
return total + ___ if timeSeries else 0`,
      answers: ["duration"],
      explanation: "Nothing interrupts the last attack, so it lasts the full duration.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n · duration)", why: "That's marking every poisoned second. The gap formula is O(1) per attack." },
        { text: "O(n log n)", why: "The times are already sorted." },
      ],
      explanation: "One step per attack.",
    },
    {
      kind: "choice",
      prompt: "Why use `min(duration, gap)`?",
      options: [
        { text: "Overlapping poison isn't counted twice: the next attack resets the timer", correct: true },
        { text: "To ignore short attacks", why: "Every attack counts; overlaps are trimmed." },
        { text: "Because duration can be negative", why: "Duration is positive." },
      ],
      explanation: "Each attack contributes until it ends or the next one starts.",
    },
    {
      kind: "choice",
      prompt: "How is this an intervals problem?",
      options: [
        { text: "Each attack is an interval `[t, t + duration)`; the answer is the length of their union", correct: true },
        { text: "It isn't", why: "It's exactly merging intervals and measuring the total length." },
        { text: "Attacks are sorted by length", why: "They're sorted by time." },
      ],
      explanation: "Sorted intervals make the union easy to measure in one pass.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(1)", correct: true },
        { text: "O(n)", why: "Only a running total." },
        { text: "O(duration)", why: "No per-second array is used." },
      ],
      explanation: "One integer.",
    },
  ],

  "merge-intervals": [
    {
      kind: "type",
      prompt: "Fill in the overlap condition.",
      code: `
if merged and start ___ merged[-1][1]:
    merged[-1][1] = max(merged[-1][1], end)`,
      answers: ["<="],
      explanation: "An interval overlaps if it starts at or before the last merged end. Touching counts.",
      mistakes: [{ answers: ["<"], why: "`[1, 4]` and `[4, 5]` touch at 4 and must merge." }],
    },
    {
      kind: "type",
      prompt: "Fill in the merged end.",
      code: `
merged[-1][1] = ___(merged[-1][1], end)`,
      answers: ["max"],
      explanation: "The new interval might be fully inside the old one, so keep the larger end.",
      mistakes: [{ answers: ["min"], why: "That could shrink the merged interval." }],
    },
    {
      kind: "type",
      prompt: "`intervals = [[1,3],[2,6],[8,10],[15,18]]`. What is the first merged interval?",
      solution: true,
      answers: ["[1, 6]", "1, 6", "1 6"],
      explanation: "`[1,3]` and `[2,6]` overlap.",
    },
    {
      kind: "type",
      prompt: "`intervals = [[1,4],[2,3]]`. What is returned?",
      solution: true,
      answers: ["[[1, 4]]", "[1, 4]", "1, 4"],
      explanation: "`[2,3]` is inside `[1,4]`.",
      mistakes: [{ answers: ["[[1, 3]]", "[1, 3]"], why: "That uses the inner interval's end. Keep the max end: 4." }],
    },
    {
      kind: "type",
      prompt: "`intervals = [[1,4],[0,4]]`. What is returned?",
      solution: true,
      answers: ["[[0, 4]]", "[0, 4]", "0, 4"],
      explanation: "After sorting by start, `[0,4]` comes first and absorbs `[1,4]`.",
    },
    {
      kind: "type",
      prompt: "Fill in the sort key.",
      code: `
intervals.sort(key=lambda interval: interval[___])`,
      answers: ["0"],
      explanation: "Sorting by start puts overlapping intervals next to each other.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n log n)", correct: true },
        { text: "O(n)", why: "Sorting is required first." },
        { text: "O(n²)", why: "That's comparing every pair. After sorting, one pass suffices." },
      ],
      explanation: "Sort, then one pass.",
    },
    {
      kind: "choice",
      prompt: "Why is comparing with only the **last** merged interval enough?",
      options: [
        { text: "Sorted by start, an interval can only overlap the most recent merged block", correct: true },
        { text: "Because merged intervals are sorted by end", why: "The reason is start order: earlier blocks end before the last one starts." },
        { text: "It isn't; we should check all", why: "Earlier blocks are already separated from the last one." },
      ],
      explanation: "Each merged block ends before the next one starts.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(n) for the output (plus the sort's own space)", correct: true },
        { text: "O(1)", why: "The `merged` list can hold up to n intervals." },
        { text: "O(n²)", why: "No pairwise table is built." },
      ],
      explanation: "The result can be as large as the input.",
    },
    {
      kind: "choice",
      prompt: "Which problem is this one with a single new interval added to an already-sorted list?",
      options: [
        { text: "Insert Interval", correct: true },
        { text: "Non-overlapping Intervals", why: "That removes intervals rather than merging." },
        { text: "Car Pooling", why: "That counts passengers over time." },
      ],
      explanation: "Insert Interval can skip the sort because the input is already sorted.",
    },
  ],

  "insert-interval": [
    {
      kind: "type",
      prompt: "Fill in the condition for intervals entirely before the new one.",
      code: `
while index < count and intervals[index][1] ___ start:`,
      answers: ["<"],
      explanation: "They end before the new interval starts, so they don't overlap.",
      mistakes: [{ answers: ["<="], why: "An interval ending exactly at `start` touches it and must merge." }],
    },
    {
      kind: "type",
      prompt: "Fill in the condition for intervals that overlap the new one.",
      code: `
while index < count and intervals[index][0] ___ end:`,
      answers: ["<="],
      explanation: "They start before (or at) the new end, so they overlap.",
    },
    {
      kind: "type",
      prompt: "`intervals = [[1,3],[6,9]]`, `newInterval = [2,5]`. What is returned?",
      solution: true,
      answers: ["[[1, 5], [6, 9]]", "[1, 5], [6, 9]"],
      explanation: "`[2,5]` overlaps `[1,3]` → `[1,5]`.",
    },
    {
      kind: "type",
      prompt: "`intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]]`, `newInterval = [4,8]`. What is the merged middle interval?",
      solution: true,
      answers: ["[3, 10]", "3, 10", "3 10"],
      explanation: "`[4,8]` overlaps `[3,5]`, `[6,7]` and `[8,10]`.",
    },
    {
      kind: "type",
      prompt: "`intervals = []`, `newInterval = [5,7]`. What is returned?",
      solution: true,
      answers: ["[[5, 7]]", "[5, 7]"],
      explanation: "Just the new interval.",
    },
    {
      kind: "type",
      prompt: "Fill in the last step.",
      code: `
result.append([start, end])
result.___(intervals[index:])`,
      answers: ["extend"],
      explanation: "Add all remaining intervals, which start after the new one ends.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n log n)", why: "The input is already sorted, so no sort is needed." },
        { text: "O(log n)", why: "Building the output is O(n) anyway." },
      ],
      explanation: "One pass through the three phases.",
    },
    {
      kind: "choice",
      prompt: "What are the three phases?",
      options: [
        { text: "Copy intervals before it, merge overlapping ones, copy intervals after it", correct: true },
        { text: "Sort, merge, sort again", why: "No sorting is needed." },
        { text: "Binary search, insert, merge everything", why: "That works but this code uses three linear phases." },
      ],
      explanation: "Sorted input makes each phase a simple scan.",
    },
    {
      kind: "choice",
      prompt: "Could binary search help?",
      options: [
        { text: "It can find the boundaries in O(log n), but building the output is still O(n)", correct: true },
        { text: "It makes the whole thing O(log n)", why: "Copying the result costs O(n)." },
        { text: "No, intervals can't be binary searched", why: "Sorted starts and ends can be searched." },
      ],
      explanation: "The output size dominates.",
    },
    {
      kind: "choice",
      prompt: "Why do `start` and `end` change during the merge phase?",
      solution: true,
      options: [
        { text: "The new interval grows to cover every interval it absorbs", correct: true },
        { text: "To move to the next interval", why: "`index` does that." },
        { text: "They shrink to the overlap", why: "Merging takes the union, so they grow." },
      ],
      explanation: "`min` of starts and `max` of ends.",
    },
  ],

  "non-overlapping-intervals": [
    {
      kind: "type",
      prompt: "Fill in the sort key.",
      code: `
intervals.sort(key=lambda interval: interval[___])`,
      answers: ["1"],
      explanation: "Sort by **end**: keeping the earliest-ending interval leaves the most room.",
      mistakes: [{ answers: ["0"], why: "Sorting by start can keep a long interval that blocks many short ones." }],
    },
    {
      kind: "type",
      prompt: "Fill in the condition for keeping an interval.",
      code: `
if start ___ previous_end:
    kept += 1
    previous_end = end`,
      answers: [">="],
      explanation: "Touching intervals don't overlap, so `start == previous_end` is fine.",
      mistakes: [{ answers: [">"], why: "`[1,2]` and `[2,3]` only touch, so both can be kept." }],
    },
    {
      kind: "type",
      prompt: "`intervals = [[1,2],[2,3],[3,4],[1,3]]`. What is returned?",
      solution: true,
      answers: ["1"],
      explanation: "Remove `[1,3]`; the rest only touch.",
    },
    {
      kind: "type",
      prompt: "`intervals = [[1,2],[1,2],[1,2]]`. What is returned?",
      solution: true,
      answers: ["2"],
      explanation: "Only one copy can stay.",
    },
    {
      kind: "type",
      prompt: "`intervals = [[1,100],[11,22],[1,11],[2,12]]`. What is returned?",
      solution: true,
      answers: ["2"],
      explanation: "Keep `[1,11]` and `[11,22]`; remove the other two.",
    },
    {
      kind: "type",
      prompt: "Fill in the answer.",
      code: `
return ___ - kept`,
      answers: ["len(intervals)"],
      explanation: "Everything not kept must be removed.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n log n)", correct: true },
        { text: "O(n)", why: "Sorting comes first." },
        { text: "O(2ⁿ)", why: "That's trying every subset. The greedy is proven optimal." },
      ],
      explanation: "Sort, then one pass.",
    },
    {
      kind: "choice",
      prompt: "Why is keeping the earliest-ending interval optimal?",
      options: [
        { text: "Any optimal solution can swap its first interval for this one without losing room", correct: true },
        { text: "Because it's the shortest", why: "Earliest end isn't the same as shortest; end time is what matters." },
        { text: "It's a heuristic that usually works", why: "It's provably optimal (exchange argument)." },
      ],
      explanation: "Ending earlier never leaves less space for later intervals.",
    },
    {
      kind: "choice",
      prompt: "Which problem is the same algorithm in disguise?",
      options: [
        { text: "Minimum Number of Arrows to Burst Balloons", correct: true },
        { text: "Merge Intervals", why: "That combines overlaps instead of choosing which to keep." },
        { text: "Summary Ranges", why: "That groups consecutive numbers." },
      ],
      explanation: "Arrows count the maximum set of non-overlapping intervals (with touching counted as overlapping there).",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(1) beyond the sort", correct: true },
        { text: "O(n)", why: "Only two variables are used after sorting in place." },
        { text: "O(n²)", why: "No table." },
      ],
      explanation: "`kept` and `previous_end`.",
    },
  ],

  "remove-covered-intervals": [
    {
      kind: "type",
      prompt: "Fill in the tie-breaker so longer intervals come first when starts are equal.",
      code: `
intervals.sort(key=lambda interval: (interval[0], ___))`,
      answers: ["-interval[1]"],
      explanation: "With equal starts, the longer one must come first so it can cover the shorter one.",
    },
    {
      kind: "type",
      prompt: "Fill in the condition: nothing earlier covers this interval.",
      code: `
if end ___ furthest_end:
    remaining += 1
    furthest_end = end`,
      answers: [">"],
      explanation: "Every earlier interval starts at or before this one; if none reaches this far, it's not covered.",
      mistakes: [{ answers: [">="], why: "An interval ending exactly at `furthest_end` (and starting later) is covered." }],
    },
    {
      kind: "type",
      prompt: "`intervals = [[1,4],[3,6],[2,8]]`. What is returned?",
      solution: true,
      answers: ["2"],
      explanation: "`[3,6]` is covered by `[2,8]`.",
    },
    {
      kind: "type",
      prompt: "`intervals = [[1,4],[2,3]]`. What is returned?",
      solution: true,
      answers: ["1"],
      explanation: "`[2,3]` is inside `[1,4]`.",
    },
    {
      kind: "type",
      prompt: "`intervals = [[1,2],[1,4],[3,4]]`. What is returned?",
      solution: true,
      answers: ["1"],
      explanation: "`[1,4]` covers both others.",
    },
    {
      kind: "type",
      prompt: "`intervals = [[1,2],[3,4]]`. What is returned?",
      solution: true,
      answers: ["2"],
      explanation: "Neither covers the other.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n log n)", correct: true },
        { text: "O(n²)", why: "That's checking every pair. Sorting makes one pass enough." },
        { text: "O(n)", why: "Sorting is required." },
      ],
      explanation: "Sort, then one pass.",
    },
    {
      kind: "choice",
      prompt: "Why must longer intervals come first on equal starts?",
      options: [
        { text: "Otherwise `[1,2]` would be counted before `[1,4]` appears to cover it", correct: true },
        { text: "For stable sorting", why: "It's about correctness, not stability." },
        { text: "It doesn't matter", why: "With `[[1,2],[1,4]]`, the wrong order counts 2 instead of 1." },
      ],
      explanation: "The covering interval has to be seen first.",
    },
    {
      kind: "choice",
      prompt: "Why track only `furthest_end`?",
      options: [
        { text: "All earlier intervals start no later, so the one reaching furthest is the best possible cover", correct: true },
        { text: "Because intervals don't overlap", why: "They can overlap; we're checking containment." },
        { text: "To find the longest interval", why: "It's about reach, not length." },
      ],
      explanation: "If the furthest-reaching earlier interval doesn't cover it, none does.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(1) beyond the sort", correct: true },
        { text: "O(n)", why: "Just a count and an end." },
        { text: "O(n²)", why: "No table." },
      ],
      explanation: "Two variables.",
    },
  ],

  "find-right-interval": [
    {
      kind: "type",
      prompt: "Fill in the bisect function: smallest start ≥ end.",
      code: `
position = ___(keys, end)`,
      answers: ["bisect_left", "bisect.bisect_left"],
      explanation: "`bisect_left` returns the first position whose value is ≥ `end`.",
      mistakes: [{ answers: ["bisect_right", "bisect.bisect_right"], why: "That skips a start exactly equal to `end`, which is allowed." }],
    },
    {
      kind: "type",
      prompt: "Fill in the answer when no start is big enough.",
      code: `
result.append(starts[position][1] if position < len(starts) else ___)`,
      answers: ["-1"],
      explanation: "No right interval exists.",
    },
    {
      kind: "type",
      prompt: "`intervals = [[3,4],[2,3],[1,2]]`. What is returned?",
      solution: true,
      answers: ["[-1, 0, 1]", "-1, 0, 1", "-1 0 1"],
      explanation: "Nothing starts at ≥ 4; `[2,3]`'s right is `[3,4]` (index 0); `[1,2]`'s is `[2,3]` (index 1).",
    },
    {
      kind: "type",
      prompt: "`intervals = [[1,4],[2,3],[3,4]]`. What is returned?",
      solution: true,
      answers: ["[-1, 2, -1]", "-1, 2, -1", "-1 2 -1"],
      explanation: "Only `[2,3]` has a right interval: `[3,4]` at index 2.",
    },
    {
      kind: "type",
      prompt: "`intervals = [[1,1],[3,4]]`. What is the answer for `[1,1]`?",
      solution: true,
      answers: ["0"],
      explanation: "An interval can be its own right interval: start 1 ≥ end 1.",
      mistakes: [{ answers: ["1"], why: "`[1,1]` itself qualifies (1 ≥ 1) and has the smaller start." }],
    },
    {
      kind: "type",
      prompt: "Why store `(start, index)` pairs? To return the original what?",
      solution: true,
      answers: ["index", "indices", "indexes"],
      explanation: "Sorting changes positions, but the answer must be original indices.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n log n)", correct: true },
        { text: "O(n²)", why: "That's scanning all starts per interval. Binary search avoids it." },
        { text: "O(n)", why: "Sorting and n binary searches cost O(n log n)." },
      ],
      explanation: "Sort once, then n binary searches.",
    },
    {
      kind: "choice",
      prompt: "Why build a separate `keys` list?",
      solution: true,
      options: [
        { text: "`bisect` needs a plain sorted list of starts to compare against `end`", correct: true },
        { text: "To save memory", why: "It uses more memory; it's for a simple search." },
        { text: "Tuples can't be sorted", why: "They can; it's about what `bisect` compares." },
      ],
      explanation: "Searching tuples against an int wouldn't compare correctly.",
    },
    {
      kind: "choice",
      prompt: "Which pattern is this, at its core?",
      options: [
        { text: "Binary search for the lower bound in a sorted array", correct: true },
        { text: "Two pointers", why: "A two-pointer version exists (sorting ends too), but this code uses bisect." },
        { text: "Merging intervals", why: "Nothing is merged." },
      ],
      explanation: "Same as Search Insert Position, repeated per interval.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(1)", why: "`starts` and `keys` each hold n entries." },
        { text: "O(log n)", why: "We copy all starts." },
      ],
      explanation: "Sorted starts plus the result.",
    },
  ],

  "interval-list-intersections": [
    {
      kind: "type",
      prompt: "Fill in where the overlap starts.",
      code: `
low = ___(firstList[first][0], secondList[second][0])`,
      answers: ["max"],
      explanation: "An overlap starts at the later of the two starts.",
    },
    {
      kind: "type",
      prompt: "Fill in where the overlap ends.",
      code: `
high = ___(firstList[first][1], secondList[second][1])`,
      answers: ["min"],
      explanation: "An overlap ends at the earlier of the two ends.",
    },
    {
      kind: "type",
      prompt: "`[[1,7]]` and `[[3,10]]`. What is returned?",
      solution: true,
      answers: ["[[3, 7]]", "[3, 7]", "3, 7"],
      explanation: "Later start 3, earlier end 7.",
    },
    {
      kind: "type",
      prompt: "`[[1,3],[5,9]]` and `[]`. What is returned?",
      solution: true,
      answers: ["[]"],
      explanation: "Nothing to intersect with.",
    },
    {
      kind: "type",
      prompt: "`[[0,2],[5,10],[13,23],[24,25]]` and `[[1,5],[8,12],[15,24],[25,26]]`. How many intersections are returned?",
      solution: true,
      answers: ["6"],
      explanation: "`[1,2]`, `[5,5]`, `[8,10]`, `[15,23]`, `[24,24]`, `[25,25]`.",
    },
    {
      kind: "type",
      prompt: "Fill in the condition for a real overlap.",
      code: `
if low ___ high:
    result.append([low, high])`,
      answers: ["<="],
      explanation: "Closed intervals: a single shared point like `[5,5]` counts.",
      mistakes: [{ answers: ["<"], why: "Closed intervals that touch at one point do intersect." }],
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(m + n)", correct: true },
        { text: "O(m · n)", why: "That's comparing every pair. Two pointers move forward only." },
        { text: "O((m + n) log(m + n))", why: "Both lists are already sorted." },
      ],
      explanation: "Each step moves one pointer.",
    },
    {
      kind: "choice",
      prompt: "Why advance the pointer whose interval ends first?",
      solution: true,
      options: [
        { text: "It can't overlap anything later in the other list", correct: true },
        { text: "It's the shorter interval", why: "Ending first is what matters, not length." },
        { text: "Either pointer could advance", why: "Advancing the wrong one can skip an overlap." },
      ],
      explanation: "The other interval may still overlap the next one.",
    },
    {
      kind: "choice",
      prompt: "Which pattern is this?",
      options: [
        { text: "Two pointers over two sorted lists, like merging", correct: true },
        { text: "Sliding window", why: "There's no window over one array." },
        { text: "Binary search", why: "Pointers move one step at a time." },
      ],
      explanation: "Same shape as Merge Two Sorted Lists.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity, not counting the output?",
      solution: true,
      options: [
        { text: "O(1)", correct: true },
        { text: "O(m + n)", why: "That's the output size, which isn't counted here." },
        { text: "O(log n)", why: "No recursion." },
      ],
      explanation: "Two indices.",
    },
  ],

  "car-pooling": [
    {
      kind: "type",
      prompt: "Fill in the change at the drop-off location.",
      code: `
change[start] += passengers
change[end] ___ passengers`,
      answers: ["-="],
      explanation: "Passengers leave the car at `end`.",
    },
    {
      kind: "type",
      prompt: "Fill in the failure condition.",
      code: `
if load ___ capacity:
    return False`,
      answers: [">"],
      explanation: "Exactly full is fine; over capacity isn't.",
      mistakes: [{ answers: [">="], why: "A full car (load == capacity) is allowed." }],
    },
    {
      kind: "type",
      prompt: "`trips = [[2,1,5],[3,3,7]]`, `capacity = 4`. What is returned?",
      solution: true,
      answers: ["False"],
      explanation: "Between 3 and 5 there are 2 + 3 = 5 passengers.",
    },
    {
      kind: "type",
      prompt: "Same trips, `capacity = 5`. What is returned?",
      solution: true,
      answers: ["True"],
      explanation: "The peak is exactly 5.",
    },
    {
      kind: "type",
      prompt: "`trips = [[2,1,5],[3,5,7]]`, `capacity = 3`. What is returned?",
      solution: true,
      answers: ["True"],
      explanation: "The first group leaves at 5 just as the second boards, so the peak is 3.",
      mistakes: [{ answers: ["False"], why: "Drop-offs at 5 happen before pick-ups at 5; the net change is −2 + 3." }],
    },
    {
      kind: "type",
      prompt: "How many slots does `change` have (locations go up to 1000)?",
      solution: true,
      answers: ["1001"],
      explanation: "Locations 0..1000 inclusive.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity, with n trips and L locations?",
      solution: true,
      options: [
        { text: "O(n + L)", correct: true },
        { text: "O(n · L)", why: "That's adding passengers to every location of every trip. The difference array avoids it." },
        { text: "O(n log n)", why: "That's the sort-events version; this one uses a fixed array." },
      ],
      explanation: "One update per trip end, then one sweep.",
    },
    {
      kind: "choice",
      prompt: "What is this technique called?",
      options: [
        { text: "A difference array (line sweep)", correct: true },
        { text: "A sliding window", why: "There's no window; we sum changes over positions." },
        { text: "Dynamic programming", why: "It's a prefix sum over changes." },
      ],
      explanation: "Store changes at boundaries; a prefix sum gives the value everywhere.",
    },
    {
      kind: "choice",
      prompt: "Why are drop-offs at `end` (not `end + 1`)?",
      options: [
        { text: "Passengers leave at `end`, so their seats are free for anyone boarding there", correct: true },
        { text: "It's an off-by-one bug", why: "The problem defines drop-off at `to`." },
        { text: "Because locations start at 1", why: "It's about when seats become free." },
      ],
      explanation: "The trip occupies `[start, end)`.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(L) for the location array", correct: true },
        { text: "O(n)", why: "The array size depends on the location range, not the trip count." },
        { text: "O(1)", why: "1001 slots is technically constant here, but it's O(L) in general." },
      ],
      explanation: "One slot per location.",
    },
  ],

  "minimum-interval-to-include-each-query": [
    {
      kind: "type",
      prompt: "Fill in the size stored for each interval.",
      code: `
heapq.heappush(heap, (___, end))`,
      answers: ["end - start + 1"],
      explanation: "Inclusive length; the heap orders by size so the smallest is on top.",
    },
    {
      kind: "type",
      prompt: "Fill in the condition for discarding intervals that end too early.",
      code: `
while heap and heap[0][1] ___ query:
    heapq.heappop(heap)`,
      answers: ["<"],
      explanation: "They end before this query, and later queries are even bigger.",
    },
    {
      kind: "type",
      prompt: "`intervals = [[1,4],[2,4],[3,6],[4,4]]`, `queries = [2,3,4,5]`. What is returned?",
      solution: true,
      answers: ["[3, 3, 1, 4]", "3, 3, 1, 4", "3 3 1 4"],
      explanation: "2 → `[2,4]`; 3 → `[2,4]`; 4 → `[4,4]`; 5 → `[3,6]`.",
    },
    {
      kind: "type",
      prompt: "`intervals = [[2,3],[2,5],[1,8],[20,25]]`, `queries = [2,19,5,22]`. What is the answer for 19?",
      solution: true,
      answers: ["-1"],
      explanation: "No interval contains 19.",
    },
    {
      kind: "type",
      prompt: "Same input. What is the answer for 22?",
      solution: true,
      answers: ["6"],
      explanation: "`[20,25]` has size 6.",
    },
    {
      kind: "type",
      prompt: "What is the size of interval `[3, 6]`?",
      answers: ["4"],
      explanation: "6 − 3 + 1 = 4.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity, with n intervals and q queries?",
      solution: true,
      options: [
        { text: "O(n log n + q log q)", correct: true },
        { text: "O(n · q)", why: "That's checking every interval per query." },
        { text: "O(n + q)", why: "Sorting and heap operations add log factors." },
      ],
      explanation: "Sort both, then each interval is pushed and popped once.",
    },
    {
      kind: "choice",
      prompt: "Why answer queries in sorted order?",
      options: [
        { text: "Intervals can then be added and discarded once, as the query value only grows", correct: true },
        { text: "The output must be sorted", why: "The output is in the original order; that's why indices are kept." },
        { text: "To use binary search", why: "It's a sweep with a heap, not a search." },
      ],
      explanation: "An offline sweep: process events in order.",
    },
    {
      kind: "choice",
      prompt: "Why is it safe to pop an interval that ends before the current query?",
      solution: true,
      options: [
        { text: "Later queries are larger, so it can never contain them either", correct: true },
        { text: "Because it's the largest interval", why: "Its size doesn't matter; its end does." },
        { text: "It isn't safe", why: "Queries are processed in increasing order, so it is." },
      ],
      explanation: "Lazy deletion from the heap top.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(n + q)", correct: true },
        { text: "O(1)", why: "The heap and the sorted query order use memory." },
        { text: "O(n · q)", why: "No per-pair table." },
      ],
      explanation: "The heap holds up to n intervals; the order and results hold q entries.",
    },
  ],
});
