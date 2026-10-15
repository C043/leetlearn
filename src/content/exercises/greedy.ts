import { defineExercises } from "./types";

export default defineExercises({
  "assign-cookies": [
    {
      kind: "type",
      prompt: "Fill in the condition: this cookie satisfies the least greedy unsatisfied child.",
      code: `
if child < len(g) and cookie ___ g[child]:
    child += 1`,
      answers: [">="],
      explanation: "A child is content when the cookie is at least as big as their greed.",
      mistakes: [{ answers: [">"], why: "A cookie exactly equal to the greed factor is enough." }],
    },
    {
      kind: "type",
      prompt: "`g = [1, 2, 3]`, `s = [1, 1]`. What is returned?",
      solution: true,
      answers: ["1"],
      explanation: "Both cookies have size 1; only the child with greed 1 can be satisfied.",
    },
    {
      kind: "type",
      prompt: "`g = [1, 2]`, `s = [1, 2, 3]`. What is returned?",
      solution: true,
      answers: ["2"],
      explanation: "Both children are satisfied (cookie 1 → child 1, cookie 2 → child 2).",
    },
    {
      kind: "type",
      prompt: "`g = [10, 9, 8, 7]`, `s = [5, 6, 7, 8]`. What is returned?",
      solution: true,
      answers: ["2"],
      explanation: "After sorting, cookies 7 and 8 satisfy children 7 and 8.",
    },
    {
      kind: "type",
      prompt: "Fill in what is returned.",
      code: `
return ___`,
      answers: ["child"],
      explanation: "`child` moved forward once per satisfied child, so it is the count.",
    },
    {
      kind: "type",
      prompt: "Fill in the first step for the greed list.",
      code: `
g.___()`,
      answers: ["sort"],
      explanation: "Both lists are sorted so small cookies meet small greeds.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity, with n children and m cookies?",
      solution: true,
      options: [
        { text: "O(n log n + m log m)", correct: true },
        { text: "O(n · m)", why: "That's trying every cookie for every child. After sorting, one pass suffices." },
        { text: "O(n + m)", why: "The sorting dominates." },
      ],
      explanation: "Two sorts, then one linear pass.",
    },
    {
      kind: "choice",
      prompt: "Why give each child the **smallest** cookie that works?",
      options: [
        { text: "Bigger cookies are saved for greedier children who might need them", correct: true },
        { text: "Small cookies are cheaper", why: "There's no cost; it's about not wasting big cookies." },
        { text: "It makes the output sorted", why: "The output is a single count." },
      ],
      explanation: "Using a bigger cookie than necessary can only hurt later children.",
    },
    {
      kind: "choice",
      prompt: "When a cookie is too small for the current child, what happens?",
      solution: true,
      options: [
        { text: "It's skipped: it's too small for every remaining child too", correct: true },
        { text: "It goes to the next child", why: "The next child is even greedier (sorted)." },
        { text: "The loop stops", why: "The next cookie might be bigger." },
      ],
      explanation: "Remaining children are at least as greedy, so the cookie is useless.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(1) beyond the in-place sorts", correct: true },
        { text: "O(n + m)", why: "Nothing is copied; the lists are sorted in place." },
        { text: "O(n · m)", why: "No table is built." },
      ],
      explanation: "One counter.",
    },
  ],

  "lemonade-change": [
    {
      kind: "type",
      prompt: "`bills = [5, 5, 5, 10, 20]`. What is returned?",
      solution: true,
      answers: ["True"],
      explanation: "Three fives; the 10 takes a five back; the 20 gets 10 + 5.",
    },
    {
      kind: "type",
      prompt: "`bills = [5, 5, 10, 10, 20]`. What is returned?",
      solution: true,
      answers: ["False"],
      explanation: "After the two 10s, you hold two 10s and no fives. You can't make 15.",
    },
    {
      kind: "type",
      prompt: "`bills = [10]`. What is returned?",
      solution: true,
      answers: ["False"],
      explanation: "The first customer needs $5 back, and the till is empty.",
    },
    {
      kind: "type",
      prompt: "How much change does a $20 bill need?",
      answers: ["15", "$15"],
      explanation: "20 − 5 = 15.",
    },
    {
      kind: "type",
      prompt: "Fill in the preferred change for $20 (one bill type).",
      code: `
elif ___ and fives:
    tens -= 1
    fives -= 1`,
      answers: ["tens"],
      explanation: "Use a $10 + $5 when possible, saving fives for later.",
    },
    {
      kind: "type",
      prompt: "Fill in the fallback for $20.",
      code: `
elif fives >= ___:
    fives -= 3`,
      answers: ["3"],
      explanation: "Three $5 bills make $15.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n²)", why: "Each customer is served in O(1)." },
        { text: "O(n log n)", why: "Nothing is sorted." },
      ],
      explanation: "One pass over the customers.",
    },
    {
      kind: "choice",
      prompt: "Why prefer $10 + $5 over three $5s for a $20?",
      options: [
        { text: "Fives are more useful: they're needed for both $10 and $20 customers", correct: true },
        { text: "It's faster", why: "Speed is the same; it's about keeping flexible change." },
        { text: "Tens can't be given otherwise", why: "Tens are only useful for $20s; using them first is the smart choice." },
      ],
      explanation: "Keep the most versatile bill for later.",
    },
    {
      kind: "choice",
      prompt: "Why don't we track $20 bills?",
      options: [
        { text: "They're never given as change", correct: true },
        { text: "They're too valuable", why: "They're simply never useful for change here." },
        { text: "We should, it's a bug", why: "No customer needs $20 back." },
      ],
      explanation: "The most change ever needed is $15.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(1)", correct: true },
        { text: "O(n)", why: "Just two counters." },
        { text: "O(3)", why: "It's constant, which is written O(1)." },
      ],
      explanation: "`fives` and `tens`.",
    },
  ],

  "jump-game": [
    {
      kind: "type",
      prompt: "Fill in the failure check.",
      code: `
for index, jump in enumerate(nums):
    if index ___ furthest:
        return False`,
      answers: [">"],
      explanation: "If we're past the furthest reachable index, this index (and the end) can't be reached.",
    },
    {
      kind: "type",
      prompt: "Fill in the update of the furthest reach.",
      code: `
furthest = max(furthest, ___)`,
      answers: ["index + jump"],
      explanation: "From `index` we can reach up to `index + jump`.",
    },
    {
      kind: "type",
      prompt: "`nums = [2, 3, 1, 1, 4]`. What is returned?",
      solution: true,
      answers: ["True"],
      explanation: "0 → 1 → 4.",
    },
    {
      kind: "type",
      prompt: "`nums = [3, 2, 1, 0, 4]`. What is returned?",
      solution: true,
      answers: ["False"],
      explanation: "Every path lands on index 3 (jump 0) and gets stuck.",
    },
    {
      kind: "type",
      prompt: "`nums = [0]`. What is returned?",
      solution: true,
      answers: ["True"],
      explanation: "We start on the last index.",
    },
    {
      kind: "type",
      prompt: "`nums = [1, 0, 1]`. What is returned?",
      solution: true,
      answers: ["False"],
      explanation: "From index 1 we can't move, so index 2 is out of reach.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n²)", why: "That's DP marking every reachable index. Tracking one maximum is enough." },
        { text: "O(2ⁿ)", why: "That's trying every jump path." },
      ],
      explanation: "One pass.",
    },
    {
      kind: "choice",
      prompt: "Why is tracking just the furthest reach enough?",
      options: [
        { text: "Everything up to the furthest reach is reachable, since jumps can be any length up to the maximum", correct: true },
        { text: "Because jumps are always maximal", why: "Jumps can be shorter; that's why every index up to the reach is reachable." },
        { text: "It isn't; we need all paths", why: "Reachability is a contiguous prefix, so one number describes it." },
      ],
      explanation: "The reachable set is always `[0, furthest]`.",
    },
    {
      kind: "choice",
      prompt: "What does a 0 in `nums` mean?",
      options: [
        { text: "You can't move from that index; you're stuck unless an earlier jump goes past it", correct: true },
        { text: "The game ends successfully", why: "Only reaching the last index ends successfully." },
        { text: "Skip to the next index", why: "0 means no movement at all." },
      ],
      explanation: "Zeros are the only way to get stuck.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(1)", correct: true },
        { text: "O(n)", why: "One integer is enough." },
        { text: "O(log n)", why: "No recursion." },
      ],
      explanation: "Just `furthest`.",
    },
  ],

  "jump-game-ii": [
    {
      kind: "type",
      prompt: "Fill in when a new jump is needed.",
      code: `
furthest = max(furthest, index + nums[index])
if index == ___:
    jumps += 1
    end = furthest`,
      answers: ["end"],
      explanation: "When we reach the edge of what the current number of jumps can cover, we must jump again.",
    },
    {
      kind: "type",
      prompt: "Fill in the loop range: no jump is needed from the last index.",
      code: `
for index in range(___):`,
      answers: ["len(nums) - 1"],
      explanation: "Reaching the last index is the goal, so we never jump from it.",
      mistakes: [{ answers: ["len(nums)"], why: "Including the last index can count one jump too many." }],
    },
    {
      kind: "type",
      prompt: "`nums = [2, 3, 1, 1, 4]`. What is returned?",
      solution: true,
      answers: ["2"],
      explanation: "0 → 1 → 4.",
    },
    {
      kind: "type",
      prompt: "`nums = [1, 1, 1, 1]`. What is returned?",
      solution: true,
      answers: ["3"],
      explanation: "One step at a time: three jumps.",
    },
    {
      kind: "type",
      prompt: "`nums = [10, 1, 1]`. What is returned?",
      solution: true,
      answers: ["1"],
      explanation: "One jump from index 0 reaches the end.",
    },
    {
      kind: "type",
      prompt: "`nums = [0]`. What is returned?",
      solution: true,
      answers: ["0"],
      explanation: "Already at the last index.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n²)", why: "That's DP over every jump. The range trick is linear." },
        { text: "O(n log n)", why: "Nothing is sorted." },
      ],
      explanation: "One pass with O(1) work per index.",
    },
    {
      kind: "choice",
      prompt: "This greedy is really an implicit BFS. What is a \"level\"?",
      options: [
        { text: "The range of indices reachable with exactly that many jumps", correct: true },
        { text: "A single index", why: "A level is a whole range." },
        { text: "Each value in `nums`", why: "Levels are groups of indices by jump count." },
      ],
      explanation: "`end` marks the end of the current level, `furthest` the end of the next.",
    },
    {
      kind: "choice",
      prompt: "Why jump to `furthest` instead of the farthest jump from the current index?",
      solution: true,
      options: [
        { text: "Any index in the current range could be the launch point, so the best reach from the whole range counts", correct: true },
        { text: "Because `furthest` is always the last index", why: "It's the best reach so far, not necessarily the end." },
        { text: "It's arbitrary", why: "It's the key to minimising jumps." },
      ],
      explanation: "We don't fix the exact landing spot, only how far the next jump can get.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(1)", correct: true },
        { text: "O(n) for a BFS queue", why: "The ranges replace an explicit queue." },
        { text: "O(log n)", why: "No recursion." },
      ],
      explanation: "Three integers.",
    },
  ],

  "gas-station": [
    {
      kind: "type",
      prompt: "Fill in the impossibility check.",
      code: `
if sum(gas) < ___:
    return -1`,
      answers: ["sum(cost)"],
      explanation: "If total gas is less than total cost, no starting point can complete the loop.",
    },
    {
      kind: "type",
      prompt: "Fill in the new candidate start when the tank runs dry.",
      code: `
if tank < 0:
    start = ___
    tank = 0`,
      answers: ["station + 1"],
      explanation: "No station between the old start and here works, so try the next one.",
    },
    {
      kind: "type",
      prompt: "`gas = [1, 2, 3, 4, 5]`, `cost = [3, 4, 5, 1, 2]`. What is returned?",
      solution: true,
      answers: ["3"],
      explanation: "Starting at index 3 the tank never goes negative.",
    },
    {
      kind: "type",
      prompt: "`gas = [2, 3, 4]`, `cost = [3, 4, 3]`. What is returned?",
      solution: true,
      answers: ["-1"],
      explanation: "Total gas 9 < total cost 10.",
    },
    {
      kind: "type",
      prompt: "`gas = [3, 1, 1]`, `cost = [1, 2, 2]`. What is returned?",
      solution: true,
      answers: ["0"],
      explanation: "Tank: 2 → 1 → 0, never negative.",
    },
    {
      kind: "type",
      prompt: "Fill in the tank update at each station.",
      code: `
tank += gas[station] - ___`,
      answers: ["cost[station]"],
      explanation: "Fill up, then pay for the drive to the next station.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n²)", why: "That's simulating from every start. One pass is enough." },
        { text: "O(n log n)", why: "No sorting." },
      ],
      explanation: "Sums plus one pass.",
    },
    {
      kind: "choice",
      prompt: "If you run dry at station k starting from s, why can't any station between s and k be the start?",
      options: [
        { text: "You arrived at each of them with a tank ≥ 0; starting there with 0 can only be worse", correct: true },
        { text: "Because they have less gas", why: "Their gas varies; the argument is about the tank level." },
        { text: "They might be; we just skip them for speed", why: "They provably fail." },
      ],
      explanation: "That's why the next candidate is k + 1.",
    },
    {
      kind: "choice",
      prompt: "Why is the last candidate guaranteed to work when the totals are enough?",
      options: [
        { text: "Its suffix has non-negative gas, and the total surplus covers the deficit from before it", correct: true },
        { text: "Because it's the station with the most gas", why: "It's chosen by the tank argument, not by gas amount." },
        { text: "It isn't guaranteed", why: "The problem promises a unique answer, and this argument proves it." },
      ],
      explanation: "Total ≥ 0 means the wrap-around part is covered.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(1)", correct: true },
        { text: "O(n)", why: "No arrays are built." },
        { text: "O(log n)", why: "No recursion." },
      ],
      explanation: "Two integers.",
    },
  ],

  "partition-labels": [
    {
      kind: "type",
      prompt: "Fill in the furthest required end of the current part.",
      code: `
end = max(end, ___)`,
      answers: ["last[letter]"],
      explanation: "The part must include the last copy of every letter it contains.",
    },
    {
      kind: "type",
      prompt: "Fill in the size of a finished part.",
      code: `
sizes.append(___)`,
      answers: ["end - start + 1"],
      explanation: "Both ends are inclusive.",
    },
    {
      kind: "type",
      prompt: "`s = \"ababcbacadefegdehijhklij\"`. What is returned?",
      solution: true,
      answers: ["[9, 7, 8]", "9, 7, 8", "9 7 8"],
      explanation: "`ababcbaca`, `defegde`, `hijhklij`.",
    },
    {
      kind: "type",
      prompt: "`s = \"eccbbbbdec\"`. What is returned?",
      solution: true,
      answers: ["[10]", "10"],
      explanation: "e and c appear at both ends, so the whole string is one part.",
    },
    {
      kind: "type",
      prompt: "`s = \"abc\"`. What is returned?",
      solution: true,
      answers: ["[1, 1, 1]", "1, 1, 1", "1 1 1"],
      explanation: "Each letter appears once, so each can be its own part.",
    },
    {
      kind: "type",
      prompt: "`s = \"abca\"`. What is returned?",
      solution: true,
      answers: ["[4]", "4"],
      explanation: "The last `a` forces the first part to cover everything.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n²)", why: "Last positions are precomputed, so each step is O(1)." },
        { text: "O(n log n)", why: "Nothing is sorted." },
      ],
      explanation: "Two linear passes.",
    },
    {
      kind: "choice",
      prompt: "When can a part end at `index`?",
      solution: true,
      options: [
        { text: "When no letter seen in the part appears after `index`, i.e. `index == end`", correct: true },
        { text: "When a letter repeats", why: "Repeats extend the part; they don't end it." },
        { text: "Every 26 characters", why: "Part sizes depend on letter positions." },
      ],
      explanation: "Cut as soon as it's safe, to get as many parts as possible.",
    },
    {
      kind: "choice",
      prompt: "Which problem has a similar \"extend the end while walking\" shape?",
      options: [
        { text: "Merge Intervals (each letter spans first → last occurrence)", correct: true },
        { text: "Maximum Subarray", why: "That tracks sums, not spans." },
        { text: "Assign Cookies", why: "That matches two sorted lists." },
      ],
      explanation: "Each letter is an interval; parts are merged groups of overlapping intervals.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(1): at most 26 letters in `last`", correct: true },
        { text: "O(n)", why: "`last` has one entry per distinct letter, at most 26 (ignoring the output)." },
        { text: "O(n²)", why: "No table is built." },
      ],
      explanation: "The alphabet bounds the dictionary.",
    },
  ],

  "maximum-subarray": [
    {
      kind: "type",
      prompt: "Fill in the choice: start a new subarray or extend the current one.",
      code: `
current = ___(number, current + number)`,
      answers: ["max"],
      explanation: "If the running sum is negative, starting fresh at `number` is better.",
    },
    {
      kind: "type",
      prompt: "Fill in the starting values.",
      code: `
best = current = ___`,
      answers: ["nums[0]"],
      explanation: "The subarray must be non-empty, so start from the first element.",
      mistakes: [{ answers: ["0"], why: "With all negatives, starting at 0 would return 0, which isn't a real subarray sum." }],
    },
    {
      kind: "type",
      prompt: "`nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]`. What is returned?",
      solution: true,
      answers: ["6"],
      explanation: "`[4, -1, 2, 1]` sums to 6.",
    },
    {
      kind: "type",
      prompt: "`nums = [5, 4, -1, 7, 8]`. What is returned?",
      solution: true,
      answers: ["23"],
      explanation: "The whole array: the -1 is worth keeping to connect the rest.",
    },
    {
      kind: "type",
      prompt: "`nums = [-3, -1, -2]`. What is returned?",
      solution: true,
      answers: ["-1"],
      explanation: "All negative: the best is the single largest element.",
    },
    {
      kind: "type",
      prompt: "What is this algorithm's name?",
      answers: ["Kadane", "Kadane's algorithm", "kadanes algorithm", "kadane's"],
      explanation: "Kadane's algorithm: best sum ending here = max(this, previous + this).",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n²)", why: "That's checking every subarray with prefix sums." },
        { text: "O(n log n)", why: "That's divide and conquer." },
      ],
      explanation: "One pass.",
    },
    {
      kind: "choice",
      prompt: "When does `current` restart from `number`?",
      solution: true,
      options: [
        { text: "When the previous running sum is negative, so it can only drag `number` down", correct: true },
        { text: "When `number` is negative", why: "A negative number can still be worth including if the running sum is large." },
        { text: "Every time `best` changes", why: "Restarting depends only on `current`." },
      ],
      explanation: "A negative prefix never helps the subarray that follows.",
    },
    {
      kind: "choice",
      prompt: "Why track both `current` and `best`?",
      options: [
        { text: "`current` must end at this index; the best subarray may have ended earlier", correct: true },
        { text: "They're always equal", why: "`best` keeps the maximum seen, which can be from earlier." },
        { text: "One for positives, one for negatives", why: "Both handle any sign." },
      ],
      explanation: "Local best (ending here) vs global best.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(1)", correct: true },
        { text: "O(n)", why: "Two variables replace a DP array." },
        { text: "O(log n)", why: "No recursion." },
      ],
      explanation: "Just `best` and `current`.",
    },
  ],

  "hand-of-straights": [
    {
      kind: "type",
      prompt: "Fill in the quick rejection.",
      code: `
if len(hand) % groupSize:
    return ___`,
      answers: ["False"],
      explanation: "Cards must divide evenly into groups.",
    },
    {
      kind: "type",
      prompt: "Fill in how many groups must start at `value`.",
      code: `
need = ___`,
      answers: ["count[value]"],
      explanation: "Every remaining copy of the smallest card must start its own group.",
    },
    {
      kind: "type",
      prompt: "`hand = [1, 2, 3, 6, 2, 3, 4, 7, 8]`, `groupSize = 3`. What is returned?",
      solution: true,
      answers: ["True"],
      explanation: "[1, 2, 3], [2, 3, 4], [6, 7, 8].",
    },
    {
      kind: "type",
      prompt: "`hand = [1, 2, 3, 4, 5]`, `groupSize = 4`. What is returned?",
      solution: true,
      answers: ["False"],
      explanation: "5 cards can't split into groups of 4.",
    },
    {
      kind: "type",
      prompt: "`hand = [1, 1, 2, 2, 3, 3]`, `groupSize = 3`. What is returned?",
      solution: true,
      answers: ["True"],
      explanation: "Two groups of [1, 2, 3].",
    },
    {
      kind: "type",
      prompt: "`hand = [1, 2, 4]`, `groupSize = 3`. What is returned?",
      solution: true,
      answers: ["False"],
      explanation: "The group starting at 1 needs a 3.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n log n) for sorting the distinct values, plus O(n) work", correct: true },
        { text: "O(n²)", why: "Each card is decremented with a whole batch (`need` at a time)." },
        { text: "O(n)", why: "Sorting the distinct values costs O(n log n)." },
      ],
      explanation: "Sort, then each value consumes cards in bulk.",
    },
    {
      kind: "choice",
      prompt: "Why must the smallest remaining card start a group?",
      options: [
        { text: "No smaller card exists to come before it, so it can only be a group's first card", correct: true },
        { text: "Because groups are sorted", why: "That's a consequence; the reason is that nothing smaller is left." },
        { text: "It doesn't have to", why: "It must; nothing can precede it." },
      ],
      explanation: "That forced choice is what makes the greedy correct.",
    },
    {
      kind: "choice",
      prompt: "Why subtract `need` at once instead of building groups one by one?",
      solution: true,
      options: [
        { text: "All `need` groups starting at `value` use the same next cards, so it's one batch update", correct: true },
        { text: "It changes the answer", why: "It gives the same answer, faster." },
        { text: "To save memory", why: "It saves time, not memory." },
      ],
      explanation: "Batching avoids repeating the same walk `need` times.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(n) for the counter", correct: true },
        { text: "O(1)", why: "The counter grows with distinct values." },
        { text: "O(groupSize)", why: "We count every distinct value, not just one group." },
      ],
      explanation: "One entry per distinct card value.",
    },
  ],

  "minimum-number-of-arrows-to-burst-balloons": [
    {
      kind: "type",
      prompt: "Fill in the sort key.",
      code: `
points.sort(key=lambda point: point[___])`,
      answers: ["1"],
      explanation: "Sort by **end**: the balloon that ends first decides where the first arrow goes.",
      mistakes: [{ answers: ["0"], why: "Sorting by start doesn't tell you the latest safe arrow position." }],
    },
    {
      kind: "type",
      prompt: "Fill in where the new arrow is shot.",
      code: `
if start > arrow:
    arrows += 1
    arrow = ___`,
      answers: ["end"],
      explanation: "Shooting at the end of this balloon hits it and as many later balloons as possible.",
    },
    {
      kind: "type",
      prompt: "`points = [[10,16],[2,8],[1,6],[7,12]]`. What is returned?",
      solution: true,
      answers: ["2"],
      explanation: "One arrow at 6 bursts [1,6] and [2,8]; another at 12 bursts [7,12] and [10,16].",
    },
    {
      kind: "type",
      prompt: "`points = [[1,2],[2,3],[3,4],[4,5]]`. What is returned?",
      solution: true,
      answers: ["2"],
      explanation: "Touching ends count: x = 2 bursts [1,2] and [2,3]; x = 4 bursts [3,4] and [4,5].",
      mistakes: [{ answers: ["4"], why: "Balloons that share an endpoint can be burst by the same arrow." }],
    },
    {
      kind: "type",
      prompt: "`points = [[1,2],[3,4],[5,6],[7,8]]`. What is returned?",
      solution: true,
      answers: ["4"],
      explanation: "No overlaps: one arrow each.",
    },
    {
      kind: "type",
      prompt: "Fill in the condition: this balloon isn't burst by the last arrow.",
      code: `
if start ___ arrow:`,
      answers: [">"],
      explanation: "The arrow at `arrow` bursts this balloon if `start <= arrow`.",
      mistakes: [{ answers: [">="], why: "A balloon starting exactly at the arrow's position is burst by it." }],
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n log n)", correct: true },
        { text: "O(n)", why: "Sorting is needed first." },
        { text: "O(n²)", why: "After sorting, one pass suffices." },
      ],
      explanation: "Sort, then a single scan.",
    },
    {
      kind: "choice",
      prompt: "Why sort by end rather than by start?",
      options: [
        { text: "The earliest-ending balloon must be hit at or before its end, so shoot exactly there", correct: true },
        { text: "Sorting by start gives the same algorithm", why: "With start order, a long balloon could make you shoot too late." },
        { text: "Ends are smaller numbers", why: "It's about the exchange argument, not size." },
      ],
      explanation: "Classic interval scheduling: pick by earliest end.",
    },
    {
      kind: "choice",
      prompt: "Which problem uses the same greedy idea?",
      options: [
        { text: "Non-overlapping Intervals", correct: true },
        { text: "Merge Intervals", why: "Merge Intervals sorts by start and combines overlaps." },
        { text: "Candy", why: "Candy uses two passes over neighbours." },
      ],
      explanation: "Arrows = the maximum number of non-overlapping intervals.",
    },
    {
      kind: "choice",
      prompt: "Why start with `arrow = float(\"-inf\")`?",
      solution: true,
      options: [
        { text: "So the first balloon always needs a new arrow, even with negative coordinates", correct: true },
        { text: "To count the first balloon twice", why: "It ensures exactly one arrow for it." },
        { text: "Any number would do", why: "Coordinates can be very negative, so only −∞ is safe." },
      ],
      explanation: "No real balloon starts before −∞.",
    },
  ],

  "candy": [
    {
      kind: "type",
      prompt: "Fill in the left-to-right rule.",
      code: `
if ratings[child] > ratings[child - 1]:
    candies[child] = ___`,
      answers: ["candies[child - 1] + 1"],
      explanation: "Higher than the left neighbour → one more than the left neighbour.",
    },
    {
      kind: "type",
      prompt: "Fill in how the right-to-left pass keeps both rules.",
      code: `
candies[child] = ___(candies[child], candies[child + 1] + 1)`,
      answers: ["max"],
      explanation: "The child must satisfy the left rule (already set) and the right rule, so take the larger.",
      mistakes: [{ answers: ["min"], why: "That could break the left-neighbour rule set in the first pass." }],
    },
    {
      kind: "type",
      prompt: "`ratings = [1, 0, 2]`. What is returned?",
      solution: true,
      answers: ["5"],
      explanation: "Candies [2, 1, 2].",
    },
    {
      kind: "type",
      prompt: "`ratings = [1, 2, 2]`. What is returned?",
      solution: true,
      answers: ["4"],
      explanation: "Candies [1, 2, 1]. Equal neighbours have no constraint.",
      mistakes: [{ answers: ["5"], why: "Equal ratings don't need equal candy; the last child can get 1." }],
    },
    {
      kind: "type",
      prompt: "`ratings = [5, 4, 3, 2, 1]`. What is returned?",
      solution: true,
      answers: ["15"],
      explanation: "Candies [5, 4, 3, 2, 1].",
    },
    {
      kind: "type",
      prompt: "`ratings = [1, 3, 4, 5, 2]`. What is returned?",
      solution: true,
      answers: ["11"],
      explanation: "Candies [1, 2, 3, 4, 1].",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n²)", why: "That's repeatedly fixing violations. Two passes are enough." },
        { text: "O(n log n)", why: "Nothing is sorted." },
      ],
      explanation: "Two linear passes and a sum.",
    },
    {
      kind: "choice",
      prompt: "Why are two passes needed?",
      options: [
        { text: "One pass can only see one neighbour's constraint; the other direction needs its own pass", correct: true },
        { text: "To double-check the answer", why: "The second pass enforces a different rule." },
        { text: "One pass is enough", why: "For `[3, 2, 1]`, a single left-to-right pass gives [1, 1, 1]." },
      ],
      explanation: "Left pass: left-neighbour rule. Right pass: right-neighbour rule.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(1)", why: "This code keeps a `candies` array (an O(1) slope-counting version exists)." },
        { text: "O(log n)", why: "No recursion." },
      ],
      explanation: "One count per child.",
    },
    {
      kind: "choice",
      prompt: "Why does everyone start with 1 candy?",
      solution: true,
      options: [
        { text: "It's the required minimum, and the passes only raise counts where a rule demands it", correct: true },
        { text: "To make the total odd", why: "The total's parity doesn't matter." },
        { text: "It's arbitrary", why: "Starting higher would waste candy." },
      ],
      explanation: "Minimal start + minimal raises = minimal total.",
    },
  ],
});
