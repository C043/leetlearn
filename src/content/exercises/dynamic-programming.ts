import { defineExercises } from "./types";

export default defineExercises({
  "climbing-stairs": [
    {
      kind: "type",
      prompt: "Fill in the next number of ways.",
      code: `
previous, current = current, ___`,
      answers: ["previous + current", "current + previous"],
      explanation: "You reach the next step from one step below (`current`) or two steps below (`previous`).",
    },
    {
      kind: "type",
      prompt: "Fill in the starting values (ways to reach steps 0 and 1).",
      code: `
previous, current = ___, 1`,
      answers: ["1"],
      explanation: "There's one way to stand at the bottom (do nothing) and one way to reach step 1.",
    },
    {
      kind: "type",
      prompt: "What does `climbStairs(3)` return?",
      solution: true,
      answers: ["3"],
      explanation: "1+1+1, 1+2, 2+1.",
    },
    {
      kind: "type",
      prompt: "What does `climbStairs(5)` return?",
      solution: true,
      answers: ["8"],
      explanation: "1, 2, 3, 5, 8: each is the sum of the previous two.",
    },
    {
      kind: "type",
      prompt: "What does `climbStairs(10)` return?",
      solution: true,
      answers: ["89"],
      explanation: "Continuing the sequence: 13, 21, 34, 55, 89.",
    },
    {
      kind: "type",
      prompt: "What famous sequence does this follow?",
      answers: ["Fibonacci", "fibonacci sequence", "fibonacci numbers"],
      explanation: "ways(n) = ways(n − 1) + ways(n − 2).",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(2ⁿ)", why: "That's plain recursion without memoization. Here each step is computed once." },
        { text: "O(log n)", why: "That needs matrix exponentiation; this loop is linear." },
      ],
      explanation: "One loop iteration per step.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(1)", correct: true },
        { text: "O(n)", why: "That's a full DP array. Only the last two values are needed." },
        { text: "O(log n)", why: "There's no recursion." },
      ],
      explanation: "Two variables slide forward.",
    },
    {
      kind: "choice",
      prompt: "Why is ways(n) = ways(n − 1) + ways(n − 2)?",
      options: [
        { text: "The last move is either a 1-step from n − 1 or a 2-step from n − 2, and those cases don't overlap", correct: true },
        { text: "Because the staircase doubles each step", why: "That would be 2ⁿ, which over-counts." },
        { text: "It's a coincidence for small n", why: "It holds for every n by the last-move argument." },
      ],
      explanation: "Split by the last move: the two groups are disjoint and cover everything.",
    },
    {
      kind: "choice",
      prompt: "Why does plain recursion (no memo) take exponential time?",
      options: [
        { text: "It recomputes the same subproblems again and again", correct: true },
        { text: "Recursion is always exponential", why: "Memoized recursion is O(n)." },
        { text: "Python is slow", why: "It's an algorithmic issue, not a language one." },
      ],
      explanation: "Overlapping subproblems are exactly what DP caches.",
    },
  ],

  "min-cost-climbing-stairs": [
    {
      kind: "type",
      prompt: "Fill in the option of arriving from two steps below.",
      code: `
cheapest[step] = min(cheapest[step - 1] + cost[step - 1], ___)`,
      answers: ["cheapest[step - 2] + cost[step - 2]"],
      explanation: "Stand on step − 2 (at its cheapest cost) and pay that step's cost to jump up two.",
    },
    {
      kind: "type",
      prompt: "Fill in where the loop starts.",
      code: `
for step in range(___, step_count + 1):`,
      answers: ["2"],
      explanation: "Steps 0 and 1 are free starting points, so their cost is 0 already.",
    },
    {
      kind: "type",
      prompt: "`cost = [10, 15, 20]`. What is returned?",
      solution: true,
      answers: ["15"],
      explanation: "Start on step 1, pay 15, jump two steps to the top.",
    },
    {
      kind: "type",
      prompt: "`cost = [1, 100, 1, 1, 1, 100, 1, 1, 100, 1]`. What is returned?",
      solution: true,
      answers: ["6"],
      explanation: "Step on every 1 and skip every 100: six 1s are paid.",
    },
    {
      kind: "type",
      prompt: "`cost = [5, 3]`. What is returned?",
      solution: true,
      answers: ["3"],
      explanation: "Start on step 1 and pay 3 to reach the top.",
    },
    {
      kind: "type",
      prompt: "Fill in the index of the top.",
      code: `
return cheapest[___]`,
      answers: ["step_count", "len(cost)"],
      explanation: "The top is one past the last stair.",
      mistakes: [{ answers: ["step_count - 1", "len(cost) - 1"], why: "That's the last stair, not the top beyond it." }],
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(2ⁿ)", why: "Each step is computed once." },
        { text: "O(n²)", why: "Each step looks back only two steps." },
      ],
      explanation: "One O(1) computation per step.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity of **this code**?",
      solution: true,
      options: [
        { text: "O(n) for the `cheapest` array", correct: true },
        { text: "O(1)", why: "That's possible with two variables, but this code keeps the whole array." },
        { text: "O(log n)", why: "There's no recursion." },
      ],
      explanation: "It could be reduced to O(1) since each step only looks two back.",
    },
    {
      kind: "choice",
      prompt: "Why is `cheapest[0] = cheapest[1] = 0`?",
      solution: true,
      options: [
        { text: "You may start on either step 0 or step 1 for free", correct: true },
        { text: "Because `cost[0]` and `cost[1]` are 0", why: "They can be anything; starting there is just free." },
        { text: "It's a placeholder", why: "It encodes the free starting rule." },
      ],
      explanation: "You pay only when you leave a step.",
    },
    {
      kind: "choice",
      prompt: "How is this related to Climbing Stairs?",
      options: [
        { text: "Same 1-or-2-step structure, but minimising cost instead of counting ways", correct: true },
        { text: "It's unrelated", why: "Both look back one and two steps." },
        { text: "It counts paths", why: "It takes `min`, not a sum." },
      ],
      explanation: "Change `+` to `min` and add costs.",
    },
  ],

  "house-robber": [
    {
      kind: "type",
      prompt: "Fill in the choice for the current house.",
      code: `
two_back, one_back = one_back, ___(one_back, two_back + money)`,
      answers: ["max"],
      explanation: "Either skip this house (keep `one_back`) or rob it (`two_back + money`).",
    },
    {
      kind: "type",
      prompt: "`nums = [2, 7, 9, 3, 1]`. What is returned?",
      solution: true,
      answers: ["12"],
      explanation: "Rob houses 0, 2 and 4: 2 + 9 + 1 = 12.",
    },
    {
      kind: "type",
      prompt: "`nums = [1, 2, 3, 1]`. What is returned?",
      solution: true,
      answers: ["4"],
      explanation: "Rob houses 0 and 2: 1 + 3.",
    },
    {
      kind: "type",
      prompt: "`nums = [2, 1, 1, 2]`. What is returned?",
      solution: true,
      answers: ["4"],
      explanation: "Rob the first and last houses: 2 + 2. Skipping two houses in a row is allowed.",
      mistakes: [{ answers: ["3"], why: "Robbing every other house isn't required: houses 0 and 3 aren't adjacent." }],
    },
    {
      kind: "type",
      prompt: "`nums = []`. What is returned?",
      solution: true,
      answers: ["0"],
      explanation: "No houses, no money.",
    },
    {
      kind: "type",
      prompt: "Fill in what is returned.",
      code: `
return ___`,
      answers: ["one_back"],
      explanation: "After the last house, `one_back` holds the best total over all houses.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(2ⁿ)", why: "That's trying every subset of houses." },
        { text: "O(n²)", why: "Each house looks back only two positions." },
      ],
      explanation: "One step per house.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(1)", correct: true },
        { text: "O(n)", why: "Only two values are kept." },
        { text: "O(log n)", why: "There's no recursion." },
      ],
      explanation: "`two_back` and `one_back` replace a full array.",
    },
    {
      kind: "choice",
      prompt: "What is the recurrence?",
      options: [
        { text: "best(i) = max(best(i − 1), best(i − 2) + nums[i])", correct: true },
        { text: "best(i) = best(i − 1) + nums[i]", why: "That would rob adjacent houses." },
        { text: "best(i) = max(nums)", why: "The best single house ignores combinations." },
      ],
      explanation: "Skip house i, or rob it and add the best up to i − 2.",
    },
    {
      kind: "choice",
      prompt: "Why doesn't greedy (always rob the richest remaining house) work?",
      options: [
        { text: "Taking a rich house can block two neighbours that together are worth more", correct: true },
        { text: "Greedy always works here", why: "`[2, 3, 2]`: greedy takes 3, but 2 + 2 = 4 is better." },
        { text: "Greedy is too slow", why: "It's about correctness." },
      ],
      explanation: "Local choices affect neighbours, so DP is needed.",
    },
  ],

  "coin-change": [
    {
      kind: "type",
      prompt: "Fill in the transition: use one `coin` plus the best for the rest.",
      code: `
fewest[value] = min(fewest[value], ___)`,
      answers: ["fewest[value - coin] + 1"],
      explanation: "If the last coin is `coin`, the rest (`value - coin`) is made as cheaply as possible.",
    },
    {
      kind: "type",
      prompt: "Fill in the sentinel for \"impossible\".",
      code: `
IMPOSSIBLE = ___`,
      answers: ["amount + 1"],
      explanation: "No solution ever uses more than `amount` coins (all 1s), so `amount + 1` acts as infinity.",
    },
    {
      kind: "type",
      prompt: "`coins = [1, 2, 5]`, `amount = 11`. What is returned?",
      solution: true,
      answers: ["3"],
      explanation: "5 + 5 + 1.",
    },
    {
      kind: "type",
      prompt: "`coins = [2]`, `amount = 3`. What is returned?",
      solution: true,
      answers: ["-1"],
      explanation: "Only even amounts can be made with 2s.",
    },
    {
      kind: "type",
      prompt: "`coins = [1, 3, 4]`, `amount = 6`. What is returned?",
      solution: true,
      answers: ["2"],
      explanation: "3 + 3. Greedy would take 4 + 1 + 1 = 3 coins.",
      mistakes: [{ answers: ["3"], why: "That's the greedy answer (4 + 1 + 1). 3 + 3 uses only two coins." }],
    },
    {
      kind: "type",
      prompt: "`coins = [1]`, `amount = 0`. What is returned?",
      solution: true,
      answers: ["0"],
      explanation: "Zero coins make zero.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity, with A = amount and C coins?",
      solution: true,
      options: [
        { text: "O(A · C)", correct: true },
        { text: "O(C^A)", why: "That's trying every combination. DP solves each amount once." },
        { text: "O(A)", why: "Each amount tries every coin." },
      ],
      explanation: "A amounts, C coins each.",
    },
    {
      kind: "choice",
      prompt: "Why does greedy (biggest coin first) fail?",
      options: [
        { text: "With coins like [1, 3, 4], taking the biggest first can force extra small coins", correct: true },
        { text: "It never fails", why: "For 6 with [1, 3, 4], greedy gives 3 coins; the best is 2." },
        { text: "It's too slow", why: "Greedy is fast; it's just wrong for some coin systems." },
      ],
      explanation: "Greedy works only for special coin systems (like real currencies).",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(A)", correct: true },
        { text: "O(A · C)", why: "One value per amount is enough." },
        { text: "O(1)", why: "The table has A + 1 entries." },
      ],
      explanation: "The `fewest` array.",
    },
    {
      kind: "choice",
      prompt: "What kind of knapsack is this?",
      options: [
        { text: "Unbounded: each coin can be used any number of times", correct: true },
        { text: "0/1: each coin at most once", why: "That's Partition Equal Subset Sum's style." },
        { text: "Fractional", why: "Coins can't be split." },
      ],
      explanation: "Looping amounts upward lets the same coin be reused.",
    },
  ],

  "longest-increasing-subsequence": [
    {
      kind: "type",
      prompt: "Fill in the bisect function: find the first tail ≥ the number.",
      code: `
position = ___(tails, number)`,
      answers: ["bisect_left", "bisect.bisect_left"],
      explanation: "Strictly increasing: an equal value should replace a tail, not extend past it.",
      mistakes: [{ answers: ["bisect_right", "bisect.bisect_right"], why: "With `bisect_right`, `[7, 7]` would count as increasing (length 2)." }],
    },
    {
      kind: "type",
      prompt: "`nums = [10, 9, 2, 5, 3, 7, 101, 18]`. What is returned?",
      solution: true,
      answers: ["4"],
      explanation: "For example 2, 3, 7, 18.",
    },
    {
      kind: "type",
      prompt: "Same input. What does `tails` contain at the end?",
      solution: true,
      answers: ["[2, 3, 7, 18]", "2, 3, 7, 18", "2 3 7 18"],
      explanation: "Each slot holds the smallest possible tail for that length.",
    },
    {
      kind: "type",
      prompt: "`nums = [7, 7, 7, 7]`. What is returned?",
      solution: true,
      answers: ["1"],
      explanation: "Strictly increasing: equal values don't extend a run.",
    },
    {
      kind: "type",
      prompt: "`nums = [0, 1, 0, 3, 2, 3]`. What is returned?",
      solution: true,
      answers: ["4"],
      explanation: "0, 1, 2, 3.",
    },
    {
      kind: "type",
      prompt: "Fill in the case where the number extends the longest run.",
      code: `
if position == ___:
    tails.append(number)`,
      answers: ["len(tails)"],
      explanation: "Bigger than every tail, so it goes at the end.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n log n)", correct: true },
        { text: "O(n²)", why: "That's the classic DP. Binary search on `tails` makes each step O(log n)." },
        { text: "O(n)", why: "Each number needs a binary search." },
      ],
      explanation: "n binary searches on a list of length at most n.",
    },
    {
      kind: "choice",
      prompt: "Is `tails` itself a valid increasing subsequence of `nums`?",
      options: [
        { text: "Not necessarily: only its **length** is guaranteed to be right", correct: true },
        { text: "Yes, always", why: "For `[3, 4, 1]`, `tails` ends as `[1, 4]`, but 1 comes after 4 in `nums`." },
        { text: "It's the longest one in reverse", why: "It's not a reversed subsequence either." },
      ],
      explanation: "Replacing a tail keeps lengths correct while allowing future extensions.",
    },
    {
      kind: "choice",
      prompt: "Why replace a tail with a smaller value?",
      options: [
        { text: "A smaller tail for the same length leaves more room for future numbers to extend it", correct: true },
        { text: "To sort `nums`", why: "We never sort `nums`." },
        { text: "To shorten the run", why: "The run length stays the same." },
      ],
      explanation: "Keep each length's ending as low as possible.",
    },
    {
      kind: "choice",
      prompt: "What does the O(n²) DP compute instead?",
      options: [
        { text: "`dp[i]` = longest run ending at `i` = 1 + max of `dp[j]` for earlier smaller `nums[j]`", correct: true },
        { text: "The number of increasing subsequences", why: "That's a different problem." },
        { text: "The sum of the run", why: "We want the length, not a sum." },
      ],
      explanation: "Simpler to write, but quadratic.",
    },
  ],

  "unique-paths": [
    {
      kind: "type",
      prompt: "Fill in the update: paths from above plus paths from the left.",
      code: `
row[column] ___ row[column - 1]`,
      answers: ["+="],
      explanation: "Before the update, `row[column]` still holds the value from the row above.",
    },
    {
      kind: "type",
      prompt: "Fill in the first row.",
      code: `
row = [___] * n`,
      answers: ["1"],
      explanation: "There's exactly one way to reach any cell in the top row: keep going right.",
    },
    {
      kind: "type",
      prompt: "`m = 3`, `n = 7`. What is returned?",
      solution: true,
      answers: ["28"],
      explanation: "C(8, 2) = 28: choose where the 2 down-moves go among 8 moves.",
    },
    {
      kind: "type",
      prompt: "`m = 3`, `n = 2`. What is returned?",
      solution: true,
      answers: ["3"],
      explanation: "Right-down-down, down-right-down, down-down-right.",
    },
    {
      kind: "type",
      prompt: "`m = 3`, `n = 3`. What is returned?",
      solution: true,
      answers: ["6"],
      explanation: "C(4, 2) = 6.",
    },
    {
      kind: "type",
      prompt: "`m = 1`, `n = 1`. What is returned?",
      solution: true,
      answers: ["1"],
      explanation: "Already at the target: one (empty) path.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(m · n)", correct: true },
        { text: "O(2^(m+n))", why: "That's enumerating paths. DP counts them per cell." },
        { text: "O(m + n)", why: "Every cell is updated once." },
      ],
      explanation: "One update per cell.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(n): a single row is reused", correct: true },
        { text: "O(m · n)", why: "That's the full grid. One row is enough." },
        { text: "O(1)", why: "We keep a row of n values." },
      ],
      explanation: "Each row depends only on the one above.",
    },
    {
      kind: "choice",
      prompt: "What closed formula gives the answer?",
      options: [
        { text: "C(m + n − 2, m − 1): choose which moves are \"down\"", correct: true },
        { text: "m · n", why: "That's the number of cells." },
        { text: "2^(m+n)", why: "Moves are constrained: exactly m − 1 downs and n − 1 rights." },
      ],
      explanation: "Every path is an arrangement of m − 1 downs and n − 1 rights.",
    },
    {
      kind: "choice",
      prompt: "Why does `row[column]` hold \"paths from above\" before the update?",
      solution: true,
      options: [
        { text: "It still contains the previous row's value for this column", correct: true },
        { text: "Because it's always 1", why: "Only the first column stays 1." },
        { text: "It's reset each row", why: "It isn't reset; that's the trick." },
      ],
      explanation: "Rolling a 1D array works because each cell needs above (old value) and left (new value).",
    },
  ],

  "partition-equal-subset-sum": [
    {
      kind: "type",
      prompt: "Fill in the target each half must reach.",
      code: `
target = ___`,
      answers: ["total // 2"],
      explanation: "Two equal groups each sum to half the total.",
    },
    {
      kind: "type",
      prompt: "Fill in the inner loop's direction so each number is used at most once.",
      code: `
for value in range(target, number - 1, ___):`,
      answers: ["-1"],
      explanation: "Going downward means `reachable[value - number]` still reflects the state **before** this number.",
      mistakes: [{ answers: ["1"], why: "Going upward lets the same number be reused (that's unbounded knapsack)." }],
    },
    {
      kind: "type",
      prompt: "`nums = [1, 5, 11, 5]`. What is returned?",
      solution: true,
      answers: ["True"],
      explanation: "[1, 5, 5] and [11] both sum to 11.",
    },
    {
      kind: "type",
      prompt: "`nums = [1, 2, 3, 5]`. What is returned?",
      solution: true,
      answers: ["False"],
      explanation: "The total is 11, which is odd.",
    },
    {
      kind: "type",
      prompt: "`nums = [1, 2, 5]`. What is returned?",
      solution: true,
      answers: ["False"],
      explanation: "The total is 8, so each half needs 4, but no subset sums to 4.",
    },
    {
      kind: "type",
      prompt: "Fill in the starting table.",
      code: `
reachable = [___] + [False] * target`,
      answers: ["True"],
      explanation: "The empty subset reaches 0.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity, with S = sum of nums?",
      solution: true,
      options: [
        { text: "O(n · S)", correct: true },
        { text: "O(2ⁿ)", why: "That's trying every subset. DP tracks reachable sums instead." },
        { text: "O(n log n)", why: "Sorting doesn't solve subset sums." },
      ],
      explanation: "n numbers, each sweeping up to S/2 values.",
    },
    {
      kind: "choice",
      prompt: "Why reduce the problem to \"is there a subset summing to total/2\"?",
      options: [
        { text: "If one group sums to half, the rest automatically sums to the other half", correct: true },
        { text: "Because both halves must have the same size", why: "Sizes can differ; only sums must match." },
        { text: "To sort the numbers", why: "No sorting is involved." },
      ],
      explanation: "Finding one half is enough.",
    },
    {
      kind: "choice",
      prompt: "What kind of knapsack is this?",
      options: [
        { text: "0/1: each number used at most once", correct: true },
        { text: "Unbounded", why: "That's Coin Change: coins can be reused." },
        { text: "Fractional", why: "Numbers can't be split." },
      ],
      explanation: "The downward loop enforces at-most-once.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(S)", correct: true },
        { text: "O(n · S)", why: "That's a 2D table. A single 1D array suffices with the downward loop." },
        { text: "O(n)", why: "The table has one entry per possible sum." },
      ],
      explanation: "One boolean per sum up to S/2.",
    },
  ],

  "decode-ways": [
    {
      kind: "type",
      prompt: "Fill in the condition: the last character alone is a valid letter.",
      code: `
if s[count - 1] != "___":
    ways[count] += ways[count - 1]`,
      answers: ["0"],
      explanation: "There's no letter for 0; `\"0\"` can only appear as part of 10 or 20.",
    },
    {
      kind: "type",
      prompt: "Fill in the upper bound for a two-digit letter.",
      code: `
if count >= 2 and 10 <= int(s[count - 2:count]) <= ___:`,
      answers: ["26"],
      explanation: "Two-digit codes run from 10 (J) to 26 (Z).",
    },
    {
      kind: "type",
      prompt: "`s = \"226\"`. What is returned?",
      solution: true,
      answers: ["3"],
      explanation: "2-2-6, 22-6, 2-26.",
    },
    {
      kind: "type",
      prompt: "`s = \"06\"`. What is returned?",
      solution: true,
      answers: ["0"],
      explanation: "A leading 0 can't be decoded, and 06 isn't a valid code.",
    },
    {
      kind: "type",
      prompt: "`s = \"11106\"`. What is returned?",
      solution: true,
      answers: ["2"],
      explanation: "1-1-10-6 and 11-10-6. The 0 must pair with the 1 before it.",
    },
    {
      kind: "type",
      prompt: "`s = \"27\"`. What is returned?",
      solution: true,
      answers: ["1"],
      explanation: "27 > 26, so only 2-7 works.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(2ⁿ)", why: "That's trying every split. DP reuses the counts." },
        { text: "O(n²)", why: "Each position looks back at most two characters." },
      ],
      explanation: "One O(1) update per character.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity of **this code**?",
      solution: true,
      options: [
        { text: "O(n) for the `ways` array", correct: true },
        { text: "O(1)", why: "Possible with two variables, but this code keeps the whole array." },
        { text: "O(n²)", why: "One value per prefix." },
      ],
      explanation: "Only the last two values are actually needed.",
    },
    {
      kind: "choice",
      prompt: "Which problem has the same \"one step or two steps back\" shape?",
      options: [
        { text: "Climbing Stairs, with validity checks on each step", correct: true },
        { text: "Edit Distance", why: "That's a 2D table over two strings." },
        { text: "Coin Change", why: "That looks back by every coin value." },
      ],
      explanation: "Each step reads one or two characters, like climbing 1 or 2 stairs.",
    },
    {
      kind: "choice",
      prompt: "Why is `ways[0] = 1`?",
      solution: true,
      options: [
        { text: "The empty prefix has exactly one decoding (nothing), which seeds the sums", correct: true },
        { text: "Because the first character is always valid", why: "It might be 0, which gives 0 ways." },
        { text: "It's arbitrary", why: "With 0, every count would be 0." },
      ],
      explanation: "The base case makes the additions work.",
    },
  ],

  "word-break": [
    {
      kind: "type",
      prompt: "Fill in the condition for splitting at `start`.",
      code: `
if can_split[start] and ___ in words:`,
      answers: ["s[start:end]"],
      explanation: "The prefix before `start` splits, and the piece from `start` to `end` is a word.",
    },
    {
      kind: "type",
      prompt: "`s = \"applepenapple\"`, dict `[apple, pen]`. What is returned?",
      solution: true,
      answers: ["True"],
      explanation: "apple + pen + apple; words can be reused.",
    },
    {
      kind: "type",
      prompt: "`s = \"catsandog\"`, dict `[cats, dog, sand, and, cat]`. What is returned?",
      solution: true,
      answers: ["False"],
      explanation: "cats+and leaves `og`; cat+sand leaves `og`. Neither finishes.",
    },
    {
      kind: "type",
      prompt: "`s = \"aaa\"`, dict `[aa]`. What is returned?",
      solution: true,
      answers: ["False"],
      explanation: "Pieces of length 2 can't cover 3 characters.",
    },
    {
      kind: "type",
      prompt: "Fill in the base case.",
      code: `
can_split = [___] + [False] * length`,
      answers: ["True"],
      explanation: "The empty prefix splits trivially.",
    },
    {
      kind: "type",
      prompt: "Fill in the keyword that stops checking once `end` is known to split.",
      code: `
can_split[end] = True
___`,
      answers: ["break"],
      explanation: "One valid split is enough.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n²) substring checks (O(n³) counting slicing)", correct: true },
        { text: "O(2ⁿ)", why: "That's plain recursion without memo. Each prefix is solved once here." },
        { text: "O(n)", why: "Each end tries every start." },
      ],
      explanation: "Two nested loops over positions, each building a substring.",
    },
    {
      kind: "choice",
      prompt: "Why put `wordDict` in a set?",
      options: [
        { text: "Membership checks become O(1) on average", correct: true },
        { text: "To remove duplicate words", why: "That happens, but speed is the point." },
        { text: "To sort the words", why: "Sets aren't sorted." },
      ],
      explanation: "The inner check runs O(n²) times.",
    },
    {
      kind: "choice",
      prompt: "How can the inner loop be shortened?",
      options: [
        { text: "Only try starts where `end - start` ≤ the longest word's length", correct: true },
        { text: "Sort the dictionary", why: "Sorting doesn't limit which substrings to check." },
        { text: "Skip even positions", why: "Words can start anywhere." },
      ],
      explanation: "Longer pieces can't be dictionary words.",
    },
    {
      kind: "choice",
      prompt: "What does `can_split[end]` mean?",
      solution: true,
      options: [
        { text: "The first `end` characters can be split into dictionary words", correct: true },
        { text: "`s[end]` is the start of a word", why: "It's about the prefix before `end`." },
        { text: "There are `end` words", why: "It's a boolean, not a count." },
      ],
      explanation: "The answer is `can_split[len(s)]`.",
    },
  ],

  "edit-distance": [
    {
      kind: "type",
      prompt: "Fill in the case where the last characters match.",
      code: `
if word1[first - 1] == word2[second - 1]:
    distance[first][second] = ___`,
      answers: ["distance[first - 1][second - 1]"],
      explanation: "Matching characters cost nothing: solve the problem without them.",
    },
    {
      kind: "type",
      prompt: "Fill in the first column: turning `word1[:first]` into an empty string.",
      code: `
distance[first][0] = ___`,
      answers: ["first"],
      explanation: "Delete every character: one operation each.",
    },
    {
      kind: "type",
      prompt: "`word1 = \"horse\"`, `word2 = \"ros\"`. What is returned?",
      solution: true,
      answers: ["3"],
      explanation: "horse → rorse (replace h) → rose (delete r) → ros (delete e).",
    },
    {
      kind: "type",
      prompt: "`word1 = \"intention\"`, `word2 = \"execution\"`. What is returned?",
      solution: true,
      answers: ["5"],
      explanation: "The classic example needs 5 operations.",
    },
    {
      kind: "type",
      prompt: "`word1 = \"ab\"`, `word2 = \"ba\"`. What is returned?",
      solution: true,
      answers: ["2"],
      explanation: "Replace both characters (there's no swap operation).",
      mistakes: [{ answers: ["1"], why: "Swapping isn't an allowed operation; it takes two edits." }],
    },
    {
      kind: "type",
      prompt: "`word1 = \"\"`, `word2 = \"abc\"`. What is returned?",
      solution: true,
      answers: ["3"],
      explanation: "Insert three characters.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(m · n)", correct: true },
        { text: "O(3^(m+n))", why: "That's plain recursion. The table solves each pair of prefixes once." },
        { text: "O(m + n)", why: "Every pair of prefixes is considered." },
      ],
      explanation: "One O(1) cell per pair of prefix lengths.",
    },
    {
      kind: "choice",
      prompt: "Which neighbour corresponds to **deleting** from `word1`?",
      solution: true,
      options: [
        { text: "`distance[first - 1][second]`", correct: true },
        { text: "`distance[first][second - 1]`", why: "That's inserting the character `word2[second - 1]`." },
        { text: "`distance[first - 1][second - 1]`", why: "That's replacing (or matching)." },
      ],
      explanation: "Deleting `word1`'s last character leaves `word1[:first - 1]` to match `word2[:second]`.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity of **this code**?",
      solution: true,
      options: [
        { text: "O(m · n) for the full table", correct: true },
        { text: "O(1)", why: "The table has (m + 1)(n + 1) cells." },
        { text: "O(m + n)", why: "This code keeps every row; rolling rows would reduce it." },
      ],
      explanation: "It can be reduced to O(min(m, n)) by keeping only two rows.",
    },
    {
      kind: "choice",
      prompt: "Why `1 + min(...)` in the mismatch case?",
      options: [
        { text: "One operation is spent now, plus the cheapest way to finish", correct: true },
        { text: "To count matching characters", why: "Matches cost 0 and use the other branch." },
        { text: "Because all three edits are needed", why: "Only one edit is applied at this step." },
      ],
      explanation: "Try replace, delete and insert; keep the cheapest.",
    },
  ],
});
