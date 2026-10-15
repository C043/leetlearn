import { defineExercises } from "./types";

export default defineExercises({
  "binary-search": [
    {
      kind: "type",
      prompt: "Fill in the loop condition.",
      code: `
low, high = 0, len(nums) - 1
while low ___ high:`,
      answers: ["<="],
      explanation: "`high` is inclusive, so `low == high` is a one-element range that still needs checking.",
      mistakes: [{ answers: ["<"], why: "With `<`, a one-element range is never checked: `search([5], 5)` would return -1." }],
    },
    {
      kind: "type",
      prompt: "Fill in the update when the middle value is too small.",
      code: `
if nums[middle] < target:
    low = ___`,
      answers: ["middle + 1"],
      explanation: "`nums[middle]` is ruled out, so the next range starts just after it.",
      mistakes: [{ answers: ["middle"], why: "`middle` was already checked. Keeping it can loop forever when `low == middle`." }],
    },
    {
      kind: "type",
      prompt: "Fill in the update when the middle value is too big.",
      code: `
else:
    high = ___`,
      answers: ["middle - 1"],
      explanation: "`high` is inclusive and `nums[middle]` is ruled out, so the range ends just before it.",
    },
    {
      kind: "type",
      prompt: "`nums = [-1, 0, 3, 5, 9, 12]`, `target = 9`. What is returned?",
      solution: true,
      answers: ["4"],
      explanation: "middle = 2 (value 3) is too small, so `low = 3`. Then middle = 4 (value 9): found.",
    },
    {
      kind: "type",
      prompt: "`nums = [-1, 0, 3, 5, 9, 12]`, `target = 9`. How many times is `middle` computed?",
      solution: true,
      answers: ["2"],
      explanation: "First middle = (0 + 5) // 2 = 2, then middle = (3 + 5) // 2 = 4, which is the target.",
    },
    {
      kind: "type",
      prompt: "`nums = [-1, 0, 3, 5, 9, 12]`, `target = 2`. What is returned?",
      solution: true,
      answers: ["-1"],
      explanation: "2 isn't in the array, so the range shrinks to empty (`low > high`).",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(log n)", correct: true },
        { text: "O(n)", why: "That's a linear scan. Each step here halves the range." },
        { text: "O(1)", why: "The number of steps grows (slowly) with n." },
      ],
      explanation: "The range halves each step, so it takes about log₂ n steps to empty it.",
    },
    {
      kind: "choice",
      prompt: "What does the array need for binary search to work?",
      options: [
        { text: "It must be sorted", correct: true },
        { text: "Its length must be a power of two", why: "Any length works. `//` rounds the middle down." },
        { text: "It must contain the target", why: "If the target is missing, the range empties and we return -1." },
      ],
      explanation: "Comparing with the middle only tells you which half to drop if the values are in order.",
    },
    {
      kind: "choice",
      prompt: "What does `low <= high` mean about the range?",
      options: [
        { text: "Both ends are inclusive: the range `nums[low..high]` is not empty", correct: true },
        { text: "`high` is exclusive", why: "With an exclusive end you'd start at `len(nums)` and loop while `low < high`." },
        { text: "The target has been found", why: "Finding the target returns immediately, inside the loop." },
      ],
      explanation: "Start with `high = len(nums) - 1` → inclusive range → loop while `low <= high`.",
    },
    {
      kind: "choice",
      prompt: "In languages with fixed-size integers, why is `low + (high - low) // 2` sometimes preferred?",
      options: [
        { text: "`low + high` can overflow when both are large", correct: true },
        { text: "It gives a different middle index", why: "It gives the same index. It just avoids the large intermediate sum." },
        { text: "It's faster", why: "Speed isn't the point; it's about avoiding overflow." },
      ],
      explanation: "Python ints don't overflow, but in Java or C++ `low + high` can exceed the int range.",
    },
  ],

  "search-insert-position": [
    {
      kind: "type",
      prompt: "Fill in the starting value of `high`.",
      code: `
low, high = 0, ___`,
      answers: ["len(nums)"],
      explanation: "The target might be inserted after every element, at index `len(nums)`, so that must be a possible answer.",
      mistakes: [{ answers: ["len(nums) - 1"], why: "Then `searchInsert([1, 3], 7)` could never return 2, the position at the very end." }],
    },
    {
      kind: "type",
      prompt: "Fill in the update when the middle value is big enough.",
      code: `
if nums[middle] < target:
    low = middle + 1
else:
    high = ___`,
      answers: ["middle"],
      explanation: "`nums[middle] >= target`, so `middle` itself may be the answer. Keep it in range.",
      mistakes: [{ answers: ["middle - 1"], why: "That throws away `middle`, which could be the first value ≥ target." }],
    },
    {
      kind: "type",
      prompt: "Fill in the loop condition.",
      code: `
while low ___ high:`,
      answers: ["<"],
      explanation: "The loop narrows to a single position. When `low == high`, that's the answer.",
      mistakes: [{ answers: ["<="], why: "With `high = middle`, `low == high` would loop forever." }],
    },
    {
      kind: "type",
      prompt: "`nums = [1, 3, 5, 6]`, `target = 2`. What is returned?",
      solution: true,
      answers: ["1"],
      explanation: "2 goes between 1 and 3, at index 1.",
    },
    {
      kind: "type",
      prompt: "`nums = [1, 3, 5, 6]`, `target = 7`. What is returned?",
      solution: true,
      answers: ["4"],
      explanation: "7 is bigger than everything, so it goes at the end: index 4 = `len(nums)`.",
    },
    {
      kind: "type",
      prompt: "`nums = [1, 3, 5, 6]`, `target = 0`. What is returned?",
      solution: true,
      answers: ["0"],
      explanation: "0 is smaller than everything, so it goes at the front.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(log n)", correct: true },
        { text: "O(n)", why: "That's scanning for the position. The range halves each step." },
        { text: "O(n log n)", why: "Nothing is sorted; the array already is." },
      ],
      explanation: "A standard halving search.",
    },
    {
      kind: "choice",
      prompt: "What does this loop really find?",
      options: [
        { text: "The first index whose value is ≥ target", correct: true },
        { text: "The last index whose value is ≤ target", why: "For `[1, 3]` with target 2 that would be index 0, but the insert position is 1." },
        { text: "The index of the target, or -1", why: "It never returns -1. It returns the insert position when the target is missing." },
      ],
      explanation: "This is \"lower bound\". If the target exists, its index is the first value ≥ target; if not, that's where it goes.",
    },
    {
      kind: "choice",
      prompt: "Which Python function computes the same answer?",
      options: [
        { text: "`bisect.bisect_left(nums, target)`", correct: true },
        { text: "`bisect.bisect_right(nums, target)`", why: "`bisect_right` returns the position **after** an equal value. For `[1, 3, 5]` with target 3, that's 2, not 1." },
        { text: "`nums.index(target)`", why: "That raises an error when the target is missing, and it's O(n)." },
      ],
      explanation: "`bisect_left` returns the first position where target could go: the lower bound.",
    },
    {
      kind: "choice",
      prompt: "Why does the loop end with `low == high` instead of an empty range?",
      solution: true,
      options: [
        { text: "The range is half-open and always keeps one candidate answer", correct: true },
        { text: "It's a bug: we should check `nums[low]` after", why: "No extra check is needed. The remaining position is the answer." },
        { text: "Because the target is always found", why: "When the target is missing, the loop still ends on its insert position." },
      ],
      explanation: "The answer is always in `[low, high]`. When only one position is left, that's it.",
    },
  ],

  "search-a-2d-matrix": [
    {
      kind: "type",
      prompt: "Fill in the row of flat position `middle`.",
      code: `
value = matrix[middle ___ column_count][middle % column_count]`,
      answers: ["//"],
      explanation: "Each row holds `column_count` values, so integer division gives the row number.",
      mistakes: [{ answers: ["/"], why: "`/` gives a float in Python, which can't be used as an index." }],
    },
    {
      kind: "type",
      prompt: "Fill in the last flat position.",
      code: `
low, high = 0, ___`,
      answers: ["row_count * column_count - 1"],
      explanation: "There are `row_count * column_count` values, and `high` is inclusive.",
      mistakes: [{ answers: ["row_count * column_count"], why: "That's one past the end. With an inclusive `high`, it would read outside the matrix." }],
    },
    {
      kind: "type",
      prompt: "With 4 columns, which value is at flat position 5 of `[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]]`?",
      solution: true,
      answers: ["11"],
      explanation: "Row 5 // 4 = 1, column 5 % 4 = 1 → `matrix[1][1]` = 11.",
    },
    {
      kind: "type",
      prompt: "Same matrix, `target = 13`. What is returned?",
      solution: true,
      answers: ["False"],
      explanation: "13 would sit between 11 and 16, but it isn't there.",
    },
    {
      kind: "type",
      prompt: "Same matrix, `target = 60`. What is returned?",
      solution: true,
      answers: ["True"],
      explanation: "60 is the last value, at flat position 11.",
    },
    {
      kind: "type",
      prompt: "Fill in the column of flat position `middle`.",
      code: `
value = matrix[middle // column_count][middle ___ column_count]`,
      answers: ["%"],
      explanation: "The remainder after removing full rows is the position within the row.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity for an m × n matrix?",
      solution: true,
      options: [
        { text: "O(log(m · n))", correct: true },
        { text: "O(m + n)", why: "That's the staircase search, used when only rows and columns are sorted separately." },
        { text: "O(m · log n)", why: "That's binary searching every row. Here one search covers everything." },
      ],
      explanation: "One binary search over m·n values.",
    },
    {
      kind: "choice",
      prompt: "Why can the matrix be treated as one sorted list?",
      options: [
        { text: "Rows are sorted, and each row starts above the previous row's end", correct: true },
        { text: "Any matrix with sorted rows works", why: "Without the \"next row starts higher\" rule, reading row by row wouldn't be sorted." },
        { text: "Because it's square", why: "It doesn't need to be square." },
      ],
      explanation: "Reading row by row gives values in increasing order, so it's one sorted list.",
    },
    {
      kind: "choice",
      prompt: "What's the advantage of flat indexing over two binary searches (first the row, then within the row)?",
      options: [
        { text: "Same O(log(m·n)) time, but just one loop to get right", correct: true },
        { text: "Two searches would be O(log m · log n)", why: "Two sequential searches cost log m + log n = log(m·n), the same as one." },
        { text: "Two searches would give wrong answers", why: "Done correctly, they're also correct." },
      ],
      explanation: "Both are valid. Flat indexing just reuses the standard template.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(1)", correct: true },
        { text: "O(m · n)", why: "That's actually flattening into a new list. We only convert indices." },
        { text: "O(log(m · n))", why: "The search is iterative, with no recursion stack." },
      ],
      explanation: "The \"flat list\" is never built. We compute the row and column on the fly.",
    },
  ],

  "search-in-rotated-sorted-array": [
    {
      kind: "type",
      prompt: "Fill in the test for \"the left half is sorted\".",
      code: `
if nums[low] ___ nums[middle]:
    # left half is sorted`,
      answers: ["<="],
      explanation: "If the left end is no bigger than the middle, there's no drop between them. `<=` covers `low == middle`.",
      mistakes: [{ answers: ["<"], why: "When `low == middle` (2 elements left), the one-element left half is sorted, but `<` says it isn't: `search([3, 1], 1)` would return -1." }],
    },
    {
      kind: "type",
      prompt: "Fill in the bounds check for the target inside the sorted left half.",
      code: `
if nums[low] <= target ___ nums[middle]:
    high = middle - 1`,
      answers: ["<"],
      explanation: "`nums[middle]` was already compared with the target, so the target is strictly below it.",
    },
    {
      kind: "type",
      prompt: "`nums = [4, 5, 6, 7, 0, 1, 2]`, `target = 0`. What is returned?",
      solution: true,
      answers: ["4"],
      explanation: "0 is at index 4, just after the rotation point.",
    },
    {
      kind: "type",
      prompt: "`nums = [4, 5, 6, 7, 0, 1, 2]`, `target = 3`. What is returned?",
      solution: true,
      answers: ["-1"],
      explanation: "3 isn't in the array.",
    },
    {
      kind: "type",
      prompt: "`nums = [3, 1]`, `target = 1`. What is returned?",
      solution: true,
      answers: ["1"],
      explanation: "middle = 0 (value 3). The left half `[3]` is sorted, but 1 isn't in it, so `low = 1` and the target is found.",
    },
    {
      kind: "type",
      prompt: "In `[4, 5, 6, 7, 0, 1, 2]`, at the first step (middle = 3), which half is sorted? (`left` or `right`)",
      solution: true,
      answers: ["left"],
      explanation: "`nums[0] = 4 <= nums[3] = 7`, so `[4, 5, 6, 7]` is sorted.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(log n)", correct: true },
        { text: "O(n)", why: "That's finding the pivot by scanning. Each step here still halves the range." },
        { text: "O(log² n)", why: "There's a single halving loop, not a search inside a search." },
      ],
      explanation: "One halving loop, with O(1) work per step.",
    },
    {
      kind: "choice",
      prompt: "What is the key fact that makes binary search possible here?",
      options: [
        { text: "At any middle, at least one of the two halves is sorted", correct: true },
        { text: "The rotation point is always in the middle", why: "The rotation can be anywhere." },
        { text: "The array is still sorted", why: "It isn't; there's a drop at the rotation point." },
      ],
      explanation: "The drop is in only one half, so the other half is sorted. You can check whether the target is in that sorted half.",
    },
    {
      kind: "choice",
      prompt: "When the target is NOT inside the sorted half, what do we do?",
      solution: true,
      options: [
        { text: "Search the other half, even though it isn't fully sorted", correct: true },
        { text: "Return -1", why: "The target may still be in the other half." },
        { text: "Scan the other half linearly", why: "The other half is a smaller rotated array, so the same logic applies to it." },
      ],
      explanation: "The unsorted half is itself a rotated sorted array, so the loop handles it the same way.",
    },
    {
      kind: "choice",
      prompt: "Why does the problem say the values are **distinct**?",
      options: [
        { text: "With duplicates like `[1, 1, 1, 0, 1]`, `nums[low] <= nums[middle]` can't tell which half is sorted", correct: true },
        { text: "Because binary search can't handle equal values at all", why: "Plain binary search handles duplicates. The rotation is what makes them a problem." },
        { text: "To keep the answer unique", why: "That's a side effect. The real problem is deciding which half is sorted." },
      ],
      explanation: "That's why \"Search in Rotated Sorted Array II\" (with duplicates) can degrade to O(n).",
    },
  ],

  "find-minimum-in-rotated-sorted-array": [
    {
      kind: "type",
      prompt: "Fill in the comparison: the minimum is to the right of `middle`.",
      code: `
if nums[middle] ___ nums[high]:
    low = middle + 1
else:
    high = middle`,
      answers: [">"],
      explanation: "If the middle is bigger than the end, the drop (and the minimum) must be after `middle`.",
    },
    {
      kind: "type",
      prompt: "Fill in the update when `middle..high` is sorted.",
      code: `
else:
    high = ___`,
      answers: ["middle"],
      explanation: "`middle` itself could be the minimum, so it stays in the range.",
      mistakes: [{ answers: ["middle - 1"], why: "In `[3, 1, 2]`, middle = 1 holds the minimum (1 <= 2). `middle - 1` would throw it away." }],
    },
    {
      kind: "type",
      prompt: "`nums = [4, 5, 6, 7, 0, 1, 2]`. What is returned?",
      solution: true,
      answers: ["0"],
      explanation: "The minimum is right after the rotation point.",
    },
    {
      kind: "type",
      prompt: "`nums = [11, 13, 15, 17]` (not rotated). What is returned?",
      solution: true,
      answers: ["11"],
      explanation: "`nums[middle] <= nums[high]` every time, so `high` moves left until it reaches index 0.",
    },
    {
      kind: "type",
      prompt: "`nums = [3, 4, 5, 1, 2]`. What is returned?",
      solution: true,
      answers: ["1"],
      explanation: "middle = 2 (value 5) > 2, so `low = 3`. middle = 3 (value 1) <= 2, so `high = 3`. `low == high` → 1.",
    },
    {
      kind: "type",
      prompt: "Fill in the loop condition.",
      code: `
while low ___ high:`,
      answers: ["<"],
      explanation: "The loop shrinks to a single candidate, and `nums[low]` is then returned.",
      mistakes: [{ answers: ["<="], why: "With `high = middle`, `low == high` would loop forever." }],
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(log n)", correct: true },
        { text: "O(n)", why: "That's `min(nums)`. The problem asks for O(log n)." },
        { text: "O(1)", why: "The rotation point isn't known in advance." },
      ],
      explanation: "The range halves every step.",
    },
    {
      kind: "choice",
      prompt: "Why compare `nums[middle]` with `nums[high]` and not with `nums[low]`?",
      options: [
        { text: "Comparing with `high` works even when the array isn't rotated; with `low` it can't tell the two cases apart", correct: true },
        { text: "`nums[low]` might be out of range", why: "`low` is always a valid index here." },
        { text: "It makes no difference", why: "For an unrotated array, `nums[low] <= nums[middle]` would suggest going right, away from the minimum at index 0." },
      ],
      explanation: "\"Middle > end\" happens only when the drop lies to the right, so it's an unambiguous signal.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(1)", correct: true },
        { text: "O(log n)", why: "The loop is iterative, so there's no recursion stack." },
        { text: "O(n)", why: "No copy of the array is made." },
      ],
      explanation: "Three indices.",
    },
    {
      kind: "choice",
      prompt: "Where is the minimum of a rotated sorted array?",
      options: [
        { text: "Right after the drop, where a value is smaller than the one before it", correct: true },
        { text: "Always at index 0", why: "Only when the array isn't rotated." },
        { text: "In the middle", why: "The rotation can be anywhere." },
      ],
      explanation: "A rotated sorted array rises, drops once, then rises again. The minimum is just after the drop.",
    },
  ],

  "find-peak-element": [
    {
      kind: "type",
      prompt: "Fill in the neighbour that `middle` is compared with.",
      code: `
if nums[middle] < nums[___]:
    low = middle + 1`,
      answers: ["middle + 1"],
      explanation: "If the next value is bigger, we're going uphill to the right, so a peak exists there.",
    },
    {
      kind: "type",
      prompt: "Fill in the update when going downhill.",
      code: `
else:
    high = ___`,
      answers: ["middle"],
      explanation: "`nums[middle] > nums[middle + 1]`, so `middle` itself might be the peak.",
      mistakes: [{ answers: ["middle - 1"], why: "In `[1, 3, 2]`, middle = 1 goes downhill (3 > 2) and **is** the peak. `middle - 1` would throw it away." }],
    },
    {
      kind: "type",
      prompt: "`nums = [1, 2, 3, 1]`. What is returned?",
      solution: true,
      answers: ["2"],
      explanation: "3 at index 2 is bigger than both neighbours.",
    },
    {
      kind: "type",
      prompt: "`nums = [1, 2, 1, 3, 5, 6, 4]` has peaks at 1 and 5. Which index does **this code** return?",
      solution: true,
      answers: ["5"],
      explanation: "middle = 3 (value 3) < 5, so go right: `low = 4`. middle = 5 (value 6) > 4, so `high = 5`. middle = 4 (value 5) < 6, so `low = 5`. Return 5.",
      mistakes: [{ answers: ["1"], why: "Index 1 is also a peak, but the first comparison at index 3 sends the search right." }],
    },
    {
      kind: "type",
      prompt: "`nums = [3, 2, 1]`. What is returned?",
      solution: true,
      answers: ["0"],
      explanation: "Everything goes downhill, so the first element is the peak (its left neighbour counts as −∞).",
    },
    {
      kind: "type",
      prompt: "Fill in the loop condition.",
      code: `
while low ___ high:`,
      answers: ["<"],
      explanation: "The range shrinks to one candidate, which is the peak.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(log n)", correct: true },
        { text: "O(n)", why: "That's checking every element. The slope tells us which half to keep." },
        { text: "O(n log n)", why: "Nothing is sorted, and sorting would destroy the positions anyway." },
      ],
      explanation: "Each step halves the range.",
    },
    {
      kind: "choice",
      prompt: "Binary search on an unsorted array? Why does it work here?",
      options: [
        { text: "If the slope goes up, there must be a peak in that direction (the edge counts as −∞)", correct: true },
        { text: "The array is secretly sorted", why: "It isn't. It can go up and down many times." },
        { text: "It finds the global maximum", why: "It finds **a** peak, not necessarily the largest value." },
      ],
      explanation: "Walking uphill must eventually reach a peak: either the values turn down, or you hit the edge.",
    },
    {
      kind: "choice",
      prompt: "Why is `nums[middle + 1]` always a valid index inside the loop?",
      solution: true,
      options: [
        { text: "`low < high` means `middle < high`, so `middle + 1 <= high`", correct: true },
        { text: "Python allows any index", why: "An out-of-range index raises `IndexError`." },
        { text: "The array always has at least 2 elements", why: "It can have 1 element; then the loop doesn't run at all." },
      ],
      explanation: "`//` rounds down, so `middle` is strictly less than `high` while `low < high`.",
    },
    {
      kind: "choice",
      prompt: "Why does the problem guarantee `nums[i] != nums[i + 1]`?",
      options: [
        { text: "With equal neighbours, a flat stretch gives no slope to follow, and a strict peak may not exist", correct: true },
        { text: "So that the answer is unique", why: "There can still be several peaks." },
        { text: "To make the array sorted", why: "It just forbids equal neighbours." },
      ],
      explanation: "The method relies on every step being clearly uphill or downhill.",
    },
  ],

  "koko-eating-bananas": [
    {
      kind: "type",
      prompt: "Fill in the largest speed worth trying.",
      code: `
low, high = 1, ___`,
      answers: ["max(piles)"],
      explanation: "At that speed every pile takes 1 hour. Faster can't help, since she eats at most one pile per hour.",
      mistakes: [{ answers: ["sum(piles)"], why: "Correct but wasteful. Above the biggest pile, every pile already takes 1 hour." }],
    },
    {
      kind: "type",
      prompt: "Fill in the hours for one pile (rounded up), using integer maths.",
      code: `
hours = sum((pile + speed - 1) ___ speed for pile in piles)`,
      answers: ["//"],
      explanation: "`(pile + speed - 1) // speed` is the ceiling of `pile / speed` without floats.",
    },
    {
      kind: "type",
      prompt: "Fill in the update when this speed is fast enough.",
      code: `
if hours <= h:
    high = ___
else:
    low = speed + 1`,
      answers: ["speed"],
      explanation: "This speed works, so it's a candidate. Keep it and try slower speeds.",
      mistakes: [{ answers: ["speed - 1"], why: "`speed` might be the minimum that works. Removing it could skip the answer." }],
    },
    {
      kind: "type",
      prompt: "`piles = [3, 6, 7, 11]`, `h = 8`. What is returned?",
      solution: true,
      answers: ["4"],
      explanation: "At speed 4: 1 + 2 + 2 + 3 = 8 hours. At speed 3: 1 + 2 + 3 + 4 = 10 > 8.",
    },
    {
      kind: "type",
      prompt: "`piles = [30, 11, 23, 4, 20]`, `h = 5`. What is returned?",
      solution: true,
      answers: ["30"],
      explanation: "5 piles in 5 hours means one pile per hour, so the speed must cover the biggest pile: 30.",
    },
    {
      kind: "type",
      prompt: "`piles = [30, 11, 23, 4, 20]`, `h = 6`. What is returned?",
      solution: true,
      answers: ["23"],
      explanation: "At 23: 2 + 1 + 1 + 1 + 1 = 6 hours. At 22: 30 and 23 both take 2 hours, so 7 total.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity, with n piles and M = `max(piles)`?",
      solution: true,
      options: [
        { text: "O(n · log M)", correct: true },
        { text: "O(log M)", why: "Each tested speed costs O(n) to compute the hours." },
        { text: "O(n · M)", why: "That's trying every speed from 1 to M. Binary search tests only about log M of them." },
      ],
      explanation: "About log₂ M speeds are tested, each with an O(n) pass over the piles.",
    },
    {
      kind: "choice",
      prompt: "What is binary search searching over here?",
      options: [
        { text: "The answer itself: the range of possible speeds", correct: true },
        { text: "The `piles` array", why: "`piles` isn't sorted and is never indexed by the search." },
        { text: "The hours", why: "Hours are computed for each speed. The search runs over speeds." },
      ],
      explanation: "This is \"binary search on the answer\": guess a speed, check it, and halve the range.",
    },
    {
      kind: "choice",
      prompt: "Why can we binary search over speeds at all?",
      options: [
        { text: "If a speed works, every faster speed also works", correct: true },
        { text: "Because the piles are sorted", why: "They don't need to be sorted." },
        { text: "Because h ≥ number of piles", why: "That guarantees an answer exists, but monotonicity is what allows the search." },
      ],
      explanation: "Works / doesn't work flips exactly once as the speed grows, so we can halve the range.",
    },
    {
      kind: "choice",
      prompt: "Why compute `(pile + speed - 1) // speed` instead of `math.ceil(pile / speed)`?",
      solution: true,
      options: [
        { text: "It's exact integer maths, with no floating-point rounding risk", correct: true },
        { text: "`math.ceil` gives a different answer", why: "For small values they agree. Integer maths just avoids float precision on huge inputs." },
        { text: "`math.ceil` doesn't exist in Python", why: "It does: `math.ceil`." },
      ],
      explanation: "Both mean \"round up\", but the integer form never touches floats.",
    },
  ],

  "capacity-to-ship-packages-within-d-days": [
    {
      kind: "type",
      prompt: "Fill in the smallest capacity worth trying.",
      code: `
low, high = ___, sum(weights)`,
      answers: ["max(weights)"],
      explanation: "Every package must fit on the ship, so the capacity is at least the heaviest one.",
      mistakes: [{ answers: ["1"], why: "A capacity below the heaviest package can never ship it, and `days_needed` would give nonsense." }],
    },
    {
      kind: "type",
      prompt: "Fill in when a package starts a new day.",
      code: `
for weight in weights:
    if load + weight ___ capacity:
        used += 1
        load = 0
    load += weight`,
      answers: [">"],
      explanation: "If adding this package would exceed the capacity, it goes on the next day.",
      mistakes: [{ answers: [">="], why: "Filling the ship to exactly its capacity is allowed." }],
    },
    {
      kind: "type",
      prompt: "Fill in the starting day count.",
      code: `
used, load = ___, 0`,
      answers: ["1"],
      explanation: "Loading starts on day 1. Each overflow adds a day.",
      mistakes: [{ answers: ["0"], why: "The first day counts too. Starting at 0 would undercount by one." }],
    },
    {
      kind: "type",
      prompt: "`weights = [1, 2, ..., 10]`, `days = 5`. What is returned?",
      solution: true,
      answers: ["15"],
      explanation: "With 15: [1–5], [6, 7], [8], [9], [10] is 5 days. With 14 you need 6 days.",
    },
    {
      kind: "type",
      prompt: "`weights = [3, 2, 2, 4, 1, 4]`, `days = 3`. What is returned?",
      solution: true,
      answers: ["6"],
      explanation: "[3, 2], [2, 4], [1, 4] each weigh at most 6.",
    },
    {
      kind: "type",
      prompt: "`weights = [1, 2, 3, 1, 1]`, `days = 4`. What is returned?",
      solution: true,
      answers: ["3"],
      explanation: "[1, 2], [3], [1, 1] takes 3 days, which is within 4. The capacity can't go below 3 (the heaviest package).",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity, with n packages and S = `sum(weights)`?",
      solution: true,
      options: [
        { text: "O(n · log S)", correct: true },
        { text: "O(n · S)", why: "That's trying every capacity. Binary search tests only about log S of them." },
        { text: "O(log S)", why: "Each test runs `days_needed`, which is O(n)." },
      ],
      explanation: "About log S capacities are tested, each with an O(n) greedy pass.",
    },
    {
      kind: "choice",
      prompt: "Why is loading greedily (as much as fits each day) the right way to count days?",
      options: [
        { text: "Packing as much as possible today never forces extra days later", correct: true },
        { text: "Because packages are sorted", why: "They aren't, and their order can't change." },
        { text: "It isn't optimal, just fast", why: "It is optimal for a fixed capacity: delaying a package never helps." },
      ],
      explanation: "Any schedule can be shifted to load earlier without using more days.",
    },
    {
      kind: "choice",
      prompt: "Which problem has the same \"binary search on the answer\" structure?",
      options: [
        { text: "Koko Eating Bananas", correct: true },
        { text: "Search Insert Position", why: "That searches a sorted array, not a range of answers." },
        { text: "Find Peak Element", why: "That searches positions using slopes." },
      ],
      explanation: "Both search the smallest value for which a monotonic \"is it enough?\" check passes.",
    },
    {
      kind: "choice",
      prompt: "Why is `sum(weights)` a safe upper bound?",
      options: [
        { text: "With that capacity everything ships on day 1", correct: true },
        { text: "It's the answer when days = n", why: "With n days, the answer is `max(weights)`." },
        { text: "Capacity can't exceed it by the problem constraints", why: "The constraints don't say that. It's just never needed." },
      ],
      explanation: "The range must contain the answer, and with this capacity a single day always works.",
    },
  ],

  "time-based-key-value-store": [
    {
      kind: "type",
      prompt: "Fill in the bisect function that finds the first timestamp **greater than** the query.",
      code: `
position = ___(self.times[key], timestamp)`,
      answers: ["bisect_right", "bisect.bisect_right"],
      explanation: "`bisect_right` returns the index after any equal timestamps, so `position - 1` is the latest one ≤ timestamp.",
      mistakes: [{ answers: ["bisect_left", "bisect.bisect_left"], why: "With an exact match, `bisect_left` points **at** it, so `position - 1` would return the previous value." }],
    },
    {
      kind: "type",
      prompt: "Fill in the index of the value to return.",
      code: `
return self.values[key][___] if position else ""`,
      answers: ["position - 1"],
      explanation: "`position` is the first time after `timestamp`. The one before it is the latest at or before `timestamp`.",
    },
    {
      kind: "type",
      prompt: "After `set(\"foo\", \"bar\", 1)`, what does `get(\"foo\", 3)` return?",
      solution: true,
      answers: ["bar"],
      explanation: "The latest timestamp ≤ 3 is 1, with value `bar`.",
    },
    {
      kind: "type",
      prompt: "After `set(\"foo\", \"bar\", 1)` and `set(\"foo\", \"bar2\", 4)`, what does `get(\"foo\", 4)` return?",
      solution: true,
      answers: ["bar2"],
      explanation: "Timestamp 4 matches exactly, so the value set at 4 wins.",
    },
    {
      kind: "type",
      prompt: "After `set(\"foo\", \"bar\", 1)`, what does `get(\"foo\", 0)` return? (type `\"\"` for empty)",
      solution: true,
      answers: ["\"\"", "''", "empty"],
      explanation: "No timestamp ≤ 0 exists, so `position` is 0 and the method returns `\"\"`.",
    },
    {
      kind: "type",
      prompt: "Fill in the container type that gives every new key an empty list.",
      code: `
self.times = ___(list)`,
      answers: ["defaultdict", "collections.defaultdict"],
      explanation: "`defaultdict(list)` creates an empty list the first time a key is used.",
    },
    {
      kind: "choice",
      prompt: "What are the time complexities of `set` and `get`?",
      solution: true,
      options: [
        { text: "`set` O(1), `get` O(log n)", correct: true },
        { text: "Both O(log n)", why: "`set` only appends to a list, which is O(1)." },
        { text: "`set` O(1), `get` O(n)", why: "That's scanning the list. It's sorted, so we binary search it." },
      ],
      explanation: "Appending is O(1); `bisect_right` on n timestamps is O(log n).",
    },
    {
      kind: "choice",
      prompt: "Why can `set` just append, without sorting or inserting?",
      options: [
        { text: "The problem guarantees timestamps for `set` are strictly increasing", correct: true },
        { text: "`bisect` works on unsorted lists", why: "`bisect` requires sorted input." },
        { text: "Python lists sort themselves", why: "They don't. Appending keeps order only because timestamps increase." },
      ],
      explanation: "Increasing timestamps mean each list is sorted for free.",
    },
    {
      kind: "choice",
      prompt: "Why keep timestamps and values in two parallel lists?",
      options: [
        { text: "`bisect` can search the plain timestamp list directly", correct: true },
        { text: "Tuples can't be stored in lists", why: "They can. A list of tuples would work with a more careful bisect key." },
        { text: "To use less memory", why: "Memory is about the same. It's about making the search simple." },
      ],
      explanation: "The same index links a timestamp to its value.",
    },
    {
      kind: "choice",
      prompt: "What does `get` return for a key that was never set?",
      solution: true,
      options: [
        { text: "`\"\"`, because `bisect_right` on an empty list returns 0", correct: true },
        { text: "It raises `KeyError`", why: "`defaultdict` creates an empty list instead of raising." },
        { text: "`None`", why: "With `position == 0` the method returns `\"\"`." },
      ],
      explanation: "An empty list behaves like \"no timestamp ≤ query\".",
    },
  ],

  "median-of-two-sorted-arrays": [
    {
      kind: "type",
      prompt: "Fill in the size of the merged left half.",
      code: `
half = (length1 + length2 ___ 1) // 2`,
      answers: ["+"],
      explanation: "With `+ 1`, the left half gets the extra element when the total is odd, so the median is the left side's max.",
    },
    {
      kind: "type",
      prompt: "Fill in how many elements come from `nums2`.",
      code: `
take_from_nums1 = (low + high) // 2
take_from_nums2 = ___`,
      answers: ["half - take_from_nums1"],
      explanation: "The left half must have `half` elements in total, so `nums2` fills the rest.",
    },
    {
      kind: "type",
      prompt: "`nums1 = [1, 3]`, `nums2 = [2]`. What is returned?",
      solution: true,
      answers: ["2", "2.0"],
      explanation: "Merged: `[1, 2, 3]`. Odd total, so the median is the middle value, 2.",
    },
    {
      kind: "type",
      prompt: "`nums1 = [1, 2]`, `nums2 = [3, 4]`. What is returned?",
      solution: true,
      answers: ["2.5"],
      explanation: "Merged: `[1, 2, 3, 4]`. Even total: (2 + 3) / 2 = 2.5.",
    },
    {
      kind: "type",
      prompt: "`nums1 = [1, 2, 3]`, `nums2 = [4, 5]`. What is returned?",
      solution: true,
      answers: ["3", "3.0"],
      explanation: "Merged: `[1, 2, 3, 4, 5]`. The middle value is 3.",
    },
    {
      kind: "type",
      prompt: "Fill in the value used when nothing is taken from `nums1` on the left.",
      code: `
nums1_left = nums1[take_from_nums1 - 1] if take_from_nums1 > 0 else float("___")`,
      answers: ["-inf"],
      explanation: "An empty left side should never be the max, and should always pass `<=` checks, so it acts as −∞.",
      mistakes: [{ answers: ["inf"], why: "+∞ on the left would fail `nums1_left <= nums2_right` every time." }],
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(log(min(m, n)))", correct: true },
        { text: "O(m + n)", why: "That's merging the arrays. The problem requires a logarithmic solution." },
        { text: "O(log(m + n))", why: "Close, but we search only the shorter array, which is even better." },
      ],
      explanation: "The binary search runs over split positions of the shorter array.",
    },
    {
      kind: "choice",
      prompt: "Why swap so that `nums1` is the shorter array?",
      solution: true,
      options: [
        { text: "It keeps `take_from_nums2` in range and makes the search O(log(min(m, n)))", correct: true },
        { text: "The median formula only works that way", why: "The formula is symmetric. The swap is about valid indices and speed." },
        { text: "It's needed for sorting", why: "Nothing is sorted. Both arrays already are." },
      ],
      explanation: "If `nums1` were longer, `half - take_from_nums1` could go negative.",
    },
    {
      kind: "choice",
      prompt: "When is a split correct?",
      options: [
        { text: "When every left value is ≤ every right value: `nums1_left <= nums2_right` and `nums2_left <= nums1_right`", correct: true },
        { text: "When both arrays are split exactly in half", why: "The split points differ. Only the totals must add up to `half`." },
        { text: "When `nums1_left == nums2_left`", why: "The two left maxima can be anything. The cross-comparisons matter." },
      ],
      explanation: "Each array is already sorted internally, so only the two cross comparisons need checking.",
    },
    {
      kind: "choice",
      prompt: "If `nums1_left > nums2_right`, what does that mean?",
      solution: true,
      options: [
        { text: "We took too many from `nums1`; take fewer", correct: true },
        { text: "We took too few from `nums1`; take more", why: "A too-big value from `nums1` on the left means `nums1` contributed too much." },
        { text: "The arrays have no median", why: "Every non-empty input has a median. The split just needs adjusting." },
      ],
      explanation: "That's why `high = take_from_nums1 - 1` in that case.",
    },
  ],
});
