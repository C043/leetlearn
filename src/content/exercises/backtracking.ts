import { defineExercises } from "./types";

export default defineExercises({
  "path-sum": [
    {
      kind: "type",
      prompt: "Fill in the check at a leaf.",
      code: `
if not root.left and not root.right:
    return targetSum ___ root.val`,
      answers: ["=="],
      explanation: "At a leaf, the path works only if this node's value is exactly what's left of the target.",
    },
    {
      kind: "type",
      prompt: "Fill in what the rest of the path must add up to.",
      code: `
remaining = ___`,
      answers: ["targetSum - root.val"],
      explanation: "This node uses up `root.val` of the target.",
    },
    {
      kind: "type",
      prompt: "Tree `[5, 4, 8, 11, None, 13, 4, 7, 2, None, None, None, 1]`, `targetSum = 22`. What is returned?",
      solution: true,
      answers: ["True"],
      explanation: "5 → 4 → 11 → 2 sums to 22.",
    },
    {
      kind: "type",
      prompt: "Tree `[1, 2]`, `targetSum = 1`. What is returned?",
      solution: true,
      answers: ["False"],
      explanation: "The root 1 isn't a leaf (it has child 2), so the path must continue to 2: sum 3.",
      mistakes: [{ answers: ["True"], why: "The path must end at a **leaf**. Node 1 has a child, so it isn't one." }],
    },
    {
      kind: "type",
      prompt: "Empty tree, `targetSum = 0`. What is returned?",
      solution: true,
      answers: ["False"],
      explanation: "An empty tree has no root-to-leaf path at all, not even an empty one.",
    },
    {
      kind: "type",
      prompt: "Fill in how the two subtrees combine.",
      code: `
return self.hasPathSum(root.left, remaining) ___ self.hasPathSum(root.right, remaining)`,
      answers: ["or"],
      explanation: "One working path is enough.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(2ⁿ)", why: "Each node is visited once; paths share their prefixes." },
        { text: "O(log n)", why: "The tree may be unbalanced, and we might need every node." },
      ],
      explanation: "Every node is visited at most once.",
    },
    {
      kind: "choice",
      prompt: "Why can't we stop as soon as the running sum equals the target at an inner node?",
      options: [
        { text: "The path must end at a leaf; an inner node with the right sum doesn't count", correct: true },
        { text: "Because values might be negative", why: "That's also true, but the main rule is root-to-leaf." },
        { text: "We can stop there", why: "Then `[1, 2]` with target 1 would wrongly return `True`." },
      ],
      explanation: "The check happens only at leaves.",
    },
    {
      kind: "choice",
      prompt: "Why does subtracting from `targetSum` avoid explicit backtracking?",
      solution: true,
      options: [
        { text: "Each call gets its own `remaining` value, so nothing shared needs undoing", correct: true },
        { text: "Because the tree is a BST", why: "It's any binary tree." },
        { text: "Subtraction is faster than addition", why: "It's about passing state by value." },
      ],
      explanation: "Passing the state as an argument makes the \"undo\" automatic.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(h) recursion depth", correct: true },
        { text: "O(1)", why: "Recursion uses stack frames." },
        { text: "O(n) always", why: "Only for a chain-shaped tree." },
      ],
      explanation: "One frame per level of the current path.",
    },
  ],

  "binary-watch": [
    {
      kind: "type",
      prompt: "Fill in how the number of lit LEDs for an hour is counted.",
      code: `
bin(hour).___("1")`,
      answers: ["count"],
      explanation: "Each 1 bit in the binary form is one lit LED.",
    },
    {
      kind: "type",
      prompt: "Fill in the minute format so 5 becomes `05`.",
      code: `
f"{hour}:{minute:___}"`,
      answers: ["02d", "02"],
      explanation: "`02d` pads with zeros to width 2.",
    },
    {
      kind: "type",
      prompt: "`turnedOn = 1`. How many times are returned?",
      solution: true,
      answers: ["10"],
      explanation: "One LED: 4 single-bit hours (1, 2, 4, 8) with minute 0, plus 6 single-bit minutes (1, 2, 4, 8, 16, 32) with hour 0.",
    },
    {
      kind: "type",
      prompt: "`turnedOn = 0`. What is returned?",
      solution: true,
      answers: ["[\"0:00\"]", "['0:00']", "0:00"],
      explanation: "With no LEDs on, the only time is 0:00.",
    },
    {
      kind: "type",
      prompt: "`turnedOn = 9`. How many times are returned?",
      solution: true,
      answers: ["0"],
      explanation: "The most LEDs possible are 3 (hour 7 or 11) + 5 (minute 31, 47, 55, 59) = 8.",
    },
    {
      kind: "type",
      prompt: "How many LEDs are lit for the minute 32?",
      answers: ["1"],
      explanation: "32 = 100000 in binary: one bit.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(1): always 12 × 60 = 720 candidates", correct: true },
        { text: "O(2¹⁰)", why: "That's the backtracking over LED subsets, a different (but also constant) approach." },
        { text: "O(turnedOn)", why: "We check all 720 times regardless." },
      ],
      explanation: "The input space is fixed and tiny.",
    },
    {
      kind: "choice",
      prompt: "Why enumerate times instead of choosing which LEDs to turn on?",
      options: [
        { text: "Only 720 valid times exist, and filtering them avoids generating invalid ones like hour 13", correct: true },
        { text: "Backtracking can't solve it", why: "It can, but needs checks for hours > 11 and minutes > 59." },
        { text: "To sort the output", why: "Sorting isn't required." },
      ],
      explanation: "When the answer space is small, enumerate it directly.",
    },
    {
      kind: "choice",
      prompt: "Why is `\"10:5\"` wrong for 10 hours and 5 minutes?",
      options: [
        { text: "Minutes must have two digits: `\"10:05\"`", correct: true },
        { text: "Hours must have two digits", why: "Hours have no leading zero: `\"1:05\"`, not `\"01:05\"`." },
        { text: "10 hours is not allowed", why: "Hours go up to 11." },
      ],
      explanation: "The format rule is asymmetric: padded minutes, unpadded hours.",
    },
    {
      kind: "choice",
      prompt: "Which hours have the most lit LEDs?",
      options: [
        { text: "7 and 11 (three LEDs each)", correct: true },
        { text: "8 (one LED)", why: "8 = 1000 in binary: just one LED." },
        { text: "12", why: "The hour only goes up to 11." },
      ],
      explanation: "7 = 0111 and 11 = 1011.",
    },
  ],

  "letter-combinations-of-a-phone-number": [
    {
      kind: "type",
      prompt: "Fill in the base case: a letter was picked for every digit.",
      code: `
if position == ___:
    result.append("".join(path))
    return`,
      answers: ["len(digits)"],
      explanation: "When we've passed the last digit, the combination is complete.",
    },
    {
      kind: "type",
      prompt: "Fill in the undo step after exploring a letter.",
      code: `
path.append(letter)
backtrack(position + 1, path)
path.___()`,
      answers: ["pop"],
      explanation: "Remove the letter so the next one can be tried in its place.",
    },
    {
      kind: "type",
      prompt: "`digits = \"23\"`. How many combinations are returned?",
      solution: true,
      answers: ["9"],
      explanation: "3 letters for 2 times 3 letters for 3.",
    },
    {
      kind: "type",
      prompt: "`digits = \"79\"`. How many combinations are returned?",
      solution: true,
      answers: ["16"],
      explanation: "7 (pqrs) and 9 (wxyz) have 4 letters each: 4 × 4.",
      mistakes: [{ answers: ["9"], why: "7 and 9 have **four** letters each." }],
    },
    {
      kind: "type",
      prompt: "`digits = \"23\"`. What is the first combination returned?",
      solution: true,
      answers: ["ad"],
      explanation: "The first letter of each key: a (from 2), d (from 3).",
    },
    {
      kind: "type",
      prompt: "`digits = \"\"`. What is returned?",
      solution: true,
      answers: ["[]"],
      explanation: "No digits means no combinations (not one empty combination).",
      mistakes: [{ answers: ["[\"\"]", "['']"], why: "The problem expects an empty list, which is why there's an early return." }],
    },
    {
      kind: "choice",
      prompt: "What is the time complexity for n digits?",
      solution: true,
      options: [
        { text: "O(4ⁿ · n)", correct: true },
        { text: "O(3ⁿ)", why: "Keys 7 and 9 have 4 letters, and each result also takes O(n) to join." },
        { text: "O(n!)", why: "Each position chooses independently from its own key; it isn't a permutation." },
      ],
      explanation: "Up to 4ⁿ combinations, each built in O(n).",
    },
    {
      kind: "choice",
      prompt: "What does the recursion tree look like?",
      options: [
        { text: "Depth = number of digits; each node branches once per letter on that digit's key", correct: true },
        { text: "Depth = number of letters", why: "One level per digit." },
        { text: "A binary tree", why: "Branching is 3 or 4, not 2." },
      ],
      explanation: "Every root-to-leaf path is one combination.",
    },
    {
      kind: "choice",
      prompt: "Why use a shared `path` list instead of passing new strings?",
      solution: true,
      options: [
        { text: "Appending and popping is O(1); building new strings at each step costs O(n)", correct: true },
        { text: "Strings can't be passed to functions", why: "They can. It's about avoiding copies." },
        { text: "To sort the output", why: "Order follows the keys; no sorting happens." },
      ],
      explanation: "Passing `path + letter` also works; it just copies at every step.",
    },
    {
      kind: "choice",
      prompt: "Could this be done without recursion?",
      options: [
        { text: "Yes: start with `[\"\"]` and, for each digit, extend every partial string with each letter", correct: true },
        { text: "No", why: "An iterative product works fine; so does `itertools.product`." },
        { text: "Only with a heap", why: "No ordering by priority is needed." },
      ],
      explanation: "It's a Cartesian product of the keys' letters.",
    },
  ],

  "subsets": [
    {
      kind: "type",
      prompt: "Fill in where the next choice may start, so no subset repeats.",
      code: `
path.append(nums[index])
backtrack(___, path)
path.pop()`,
      answers: ["index + 1"],
      explanation: "Only numbers after this one may be added, so `[1, 2]` is built but `[2, 1]` isn't.",
      mistakes: [{ answers: ["start + 1"], why: "That ignores which number was just chosen and can repeat or skip elements." }],
    },
    {
      kind: "type",
      prompt: "Fill in the copy that is saved.",
      code: `
result.append(___)`,
      answers: ["path[:]", "list(path)", "path.copy()"],
      explanation: "`path` keeps changing; saving it directly would store the same (eventually empty) list every time.",
      mistakes: [{ answers: ["path"], why: "Every entry would point to the same list, which ends up empty." }],
    },
    {
      kind: "type",
      prompt: "`nums = [1, 2, 3]`. How many subsets are returned?",
      solution: true,
      answers: ["8"],
      explanation: "2³ = 8: each number is either in or out.",
    },
    {
      kind: "type",
      prompt: "`nums = [1, 2, 3]`. What is the third subset in the result?",
      solution: true,
      answers: ["[1, 2]", "1, 2", "1 2"],
      explanation: "Order: `[]`, `[1]`, `[1, 2]`, `[1, 2, 3]`, `[1, 3]`, …",
    },
    {
      kind: "type",
      prompt: "`nums = [0]`. What is returned?",
      solution: true,
      answers: ["[[], [0]]", "[], [0]"],
      explanation: "The empty subset and the subset with 0.",
    },
    {
      kind: "type",
      prompt: "`nums = [1, 2, 3]`. What is the last subset in the result?",
      solution: true,
      answers: ["[3]", "3"],
      explanation: "The last branch starts with 3, and nothing can follow it.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n · 2ⁿ)", correct: true },
        { text: "O(2ⁿ)", why: "There are 2ⁿ subsets, but copying each costs up to O(n)." },
        { text: "O(n!)", why: "That's permutations. Subsets don't care about order." },
      ],
      explanation: "2ⁿ subsets, each copied in O(n).",
    },
    {
      kind: "choice",
      prompt: "Why is every recursion call (not just the leaves) a subset?",
      options: [
        { text: "Every partial choice is itself a valid subset", correct: true },
        { text: "Because subsets have fixed length", why: "Subsets have every length from 0 to n." },
        { text: "Only leaves are subsets", why: "Then `[1]` would be missing from `[1, 2, 3]`." },
      ],
      explanation: "That's why the save happens at the start of each call.",
    },
    {
      kind: "choice",
      prompt: "Which non-recursive approach also works?",
      options: [
        { text: "Bitmasks: each number from 0 to 2ⁿ − 1 picks a subset by its bits", correct: true },
        { text: "Sorting the array", why: "Sorting doesn't generate subsets." },
        { text: "A heap", why: "No priority is involved." },
      ],
      explanation: "Bit i set means `nums[i]` is included.",
    },
    {
      kind: "choice",
      prompt: "How does `start` prevent duplicate subsets?",
      solution: true,
      options: [
        { text: "Numbers are only added in increasing index order, so each set has one way to be built", correct: true },
        { text: "It removes duplicates afterwards", why: "Nothing is removed; duplicates are never created." },
        { text: "It sorts each subset", why: "Index order is enforced while building, not after." },
      ],
      explanation: "`{1, 2}` is always built as `[1, 2]`, never as `[2, 1]`.",
    },
  ],

  "permutations": [
    {
      kind: "type",
      prompt: "Fill in the base case.",
      code: `
if len(path) == ___:
    result.append(path[:])
    return`,
      answers: ["len(nums)"],
      explanation: "A permutation uses every number exactly once.",
    },
    {
      kind: "type",
      prompt: "Fill in the skip for numbers already placed.",
      code: `
for index, number in enumerate(nums):
    if ___:
        continue`,
      answers: ["used[index]"],
      explanation: "Each number may appear only once in a permutation.",
    },
    {
      kind: "type",
      prompt: "`nums = [1, 2, 3]`. How many permutations are returned?",
      solution: true,
      answers: ["6"],
      explanation: "3! = 6.",
    },
    {
      kind: "type",
      prompt: "`nums = [1, 2, 3, 4]`. How many permutations are returned?",
      solution: true,
      answers: ["24"],
      explanation: "4! = 24.",
    },
    {
      kind: "type",
      prompt: "`nums = [1, 2, 3]`. What is the second permutation in the result?",
      solution: true,
      answers: ["[1, 3, 2]", "1, 3, 2", "1 3 2"],
      explanation: "The first is `[1, 2, 3]`; backtracking then swaps the last two choices.",
    },
    {
      kind: "type",
      prompt: "Fill in the undo for `used`.",
      code: `
path.pop()
used[index] = ___`,
      answers: ["False"],
      explanation: "The number becomes available again for other positions.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n · n!)", correct: true },
        { text: "O(2ⁿ)", why: "That's subsets. There are n! orderings." },
        { text: "O(n²)", why: "The output alone has n! entries." },
      ],
      explanation: "n! permutations, each copied in O(n).",
    },
    {
      kind: "choice",
      prompt: "How does this differ from Subsets?",
      options: [
        { text: "Every position may use any unused number, not just later ones; order matters", correct: true },
        { text: "It uses a `start` index", why: "Permutations loop over all numbers and use `used` instead." },
        { text: "It saves every node", why: "Only complete paths (length n) are saved." },
      ],
      explanation: "`[1, 2]` and `[2, 1]` are different permutations but the same subset.",
    },
    {
      kind: "choice",
      prompt: "What does the `used` array cost and save?",
      options: [
        { text: "O(n) extra space; O(1) \"is it taken?\" checks instead of searching `path`", correct: true },
        { text: "Nothing; `number in path` is the same", why: "`in path` is O(n) per check." },
        { text: "It makes the output sorted", why: "Output order follows the loop; `used` just tracks availability." },
      ],
      explanation: "A boolean per index is the standard way to track what's placed.",
    },
    {
      kind: "choice",
      prompt: "What changes if `nums` can contain duplicates (Permutations II)?",
      options: [
        { text: "Sort, then skip a number equal to the previous one when that previous one isn't used", correct: true },
        { text: "Nothing", why: "Duplicates would produce repeated permutations." },
        { text: "Use a set of results", why: "That works, but wastes time generating duplicates first." },
      ],
      explanation: "The skip rule ensures equal numbers are placed in a fixed relative order.",
    },
  ],

  "combination-sum": [
    {
      kind: "type",
      prompt: "Fill in the recursive call so a candidate can be reused.",
      code: `
path.append(candidate)
backtrack(___, remaining - candidate, path)
path.pop()`,
      answers: ["index"],
      explanation: "Passing the same index lets the next choice pick this candidate again.",
      mistakes: [{ answers: ["index + 1"], why: "That would allow each candidate only once (that's Combination Sum II)." }],
    },
    {
      kind: "type",
      prompt: "Fill in the keyword that stops the loop early.",
      code: `
if candidate > remaining:
    ___`,
      answers: ["break"],
      explanation: "Candidates are sorted, so every later one is too big as well.",
      mistakes: [{ answers: ["continue"], why: "`continue` only skips this candidate; the loop would keep trying bigger ones that can't fit either." }],
    },
    {
      kind: "type",
      prompt: "`candidates = [2, 3, 6, 7]`, `target = 7`. How many combinations are returned?",
      solution: true,
      answers: ["2"],
      explanation: "`[2, 2, 3]` and `[7]`.",
    },
    {
      kind: "type",
      prompt: "`candidates = [2, 3, 5]`, `target = 8`. How many combinations are returned?",
      solution: true,
      answers: ["3"],
      explanation: "`[2, 2, 2, 2]`, `[2, 3, 3]` and `[3, 5]`.",
    },
    {
      kind: "type",
      prompt: "`candidates = [2]`, `target = 1`. What is returned?",
      solution: true,
      answers: ["[]"],
      explanation: "2 is already bigger than 1.",
    },
    {
      kind: "type",
      prompt: "Fill in the base case.",
      code: `
if remaining == ___:
    result.append(path[:])
    return`,
      answers: ["0"],
      explanation: "The chosen numbers add up exactly to the target.",
    },
    {
      kind: "choice",
      prompt: "Why are `[2, 2, 3]` and `[2, 3, 2]` not both returned?",
      solution: true,
      options: [
        { text: "Choices start at the current index, so candidates are always picked in non-decreasing order", correct: true },
        { text: "Duplicates are removed at the end", why: "Nothing is removed; they're never generated." },
        { text: "Because 2 appears once in `candidates`", why: "It can be reused; the order rule prevents permutations." },
      ],
      explanation: "Each combination has exactly one sorted way to be built.",
    },
    {
      kind: "choice",
      prompt: "What does sorting the candidates buy?",
      solution: true,
      options: [
        { text: "The loop can `break` as soon as a candidate exceeds the remaining sum", correct: true },
        { text: "Correctness: unsorted input gives wrong answers", why: "Without sorting, using `continue` would still be correct." },
        { text: "Sorted output", why: "That's a side effect; the point is pruning." },
      ],
      explanation: "Pruning whole branches at once.",
    },
    {
      kind: "choice",
      prompt: "Roughly how deep can the recursion go?",
      options: [
        { text: "target / smallest candidate", correct: true },
        { text: "The number of candidates", why: "A candidate can be reused, so depth isn't limited by the count." },
        { text: "log(target)", why: "Each level subtracts at least the smallest candidate, so the depth is linear in target." },
      ],
      explanation: "Each level uses at least the smallest value.",
    },
    {
      kind: "choice",
      prompt: "Why is there no `used` array like in Permutations?",
      options: [
        { text: "Candidates may be reused, and `start` already prevents reordered duplicates", correct: true },
        { text: "Because the candidates are distinct", why: "Distinctness avoids duplicate candidates, but reuse is the reason." },
        { text: "It would be faster", why: "It would be wrong: it would forbid reuse." },
      ],
      explanation: "Different problem, different constraint.",
    },
  ],

  "palindrome-partitioning": [
    {
      kind: "type",
      prompt: "Fill in the palindrome test.",
      code: `
piece = s[start:end]
if piece == ___:`,
      answers: ["piece[::-1]"],
      explanation: "A palindrome equals its reverse.",
    },
    {
      kind: "type",
      prompt: "Fill in the range of possible ends for the next piece.",
      code: `
for end in range(start + 1, ___):`,
      answers: ["len(s) + 1"],
      explanation: "`end` is exclusive, so it must be able to reach `len(s)`.",
      mistakes: [{ answers: ["len(s)"], why: "The last character could never be included in a piece." }],
    },
    {
      kind: "type",
      prompt: "`s = \"aab\"`. How many partitions are returned?",
      solution: true,
      answers: ["2"],
      explanation: "`[\"a\", \"a\", \"b\"]` and `[\"aa\", \"b\"]`.",
    },
    {
      kind: "type",
      prompt: "`s = \"aba\"`. How many partitions are returned?",
      solution: true,
      answers: ["2"],
      explanation: "`[\"a\", \"b\", \"a\"]` and `[\"aba\"]`.",
    },
    {
      kind: "type",
      prompt: "`s = \"a\"`. How many partitions are returned?",
      solution: true,
      answers: ["1"],
      explanation: "Just `[\"a\"]`.",
    },
    {
      kind: "type",
      prompt: "Fill in the base case.",
      code: `
if start == ___:
    result.append(path[:])`,
      answers: ["len(s)"],
      explanation: "The whole string has been cut into palindromes.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n · 2ⁿ)", correct: true },
        { text: "O(n²)", why: "There can be up to 2ⁿ⁻¹ partitions (e.g. all the same letter)." },
        { text: "O(n!)", why: "Cuts are in fixed positions; it's subsets of n − 1 cut points." },
      ],
      explanation: "Up to 2ⁿ⁻¹ partitions, each with O(n) palindrome checks and copying.",
    },
    {
      kind: "choice",
      prompt: "How could the palindrome checks be made O(1)?",
      options: [
        { text: "Precompute a DP table: `is_pal[i][j]` from `s[i] == s[j]` and `is_pal[i+1][j-1]`", correct: true },
        { text: "Sort the string first", why: "Sorting destroys the order that defines palindromes." },
        { text: "Use a hash set of palindromes", why: "You'd still need to know which substrings are palindromes." },
      ],
      explanation: "O(n²) preprocessing, then constant-time lookups.",
    },
    {
      kind: "choice",
      prompt: "What does each level of the recursion decide?",
      options: [
        { text: "Where the next piece ends", correct: true },
        { text: "Which character to remove", why: "Nothing is removed; the string is only cut." },
        { text: "Whether to reverse the string", why: "Reversal is only used to test pieces." },
      ],
      explanation: "Choose a palindromic prefix of the rest, then recurse on what's left.",
    },
    {
      kind: "choice",
      prompt: "Why prune non-palindromic pieces immediately?",
      solution: true,
      options: [
        { text: "No partition containing that piece can be valid, so the whole branch is skipped", correct: true },
        { text: "To sort the output", why: "It's about not exploring invalid branches." },
        { text: "It's required by Python", why: "It's a design choice for efficiency." },
      ],
      explanation: "Backtracking's power is abandoning a branch as soon as it can't succeed.",
    },
  ],

  "word-search": [
    {
      kind: "type",
      prompt: "Fill in the marker that blocks a cell from being reused on the current path.",
      code: `
board[row][column] = "___"`,
      answers: ["#"],
      explanation: "`#` never matches a letter of the word, so the path can't step on this cell again.",
    },
    {
      kind: "type",
      prompt: "Fill in the line that restores the cell after exploring.",
      code: `
board[row][column] = ___`,
      answers: ["word[position]"],
      explanation: "The cell held `word[position]` (we only got here because it matched), so put it back.",
    },
    {
      kind: "type",
      prompt: "Board `ABCE / SFCS / ADEE`, `word = \"ABCCED\"`. What is returned?",
      solution: true,
      answers: ["True"],
      explanation: "A → B → C → C (down) → E (down) → D (left).",
    },
    {
      kind: "type",
      prompt: "Same board, `word = \"SEE\"`. What is returned?",
      solution: true,
      answers: ["True"],
      explanation: "S (middle row, right end) → E (below it) → E (to the left).",
    },
    {
      kind: "type",
      prompt: "Same board, `word = \"ABCB\"`. What is returned?",
      solution: true,
      answers: ["False"],
      explanation: "After A → B → C, going back to the same B would reuse a cell.",
      mistakes: [{ answers: ["True"], why: "The only B next to that C is the one already used." }],
    },
    {
      kind: "type",
      prompt: "How many directions does each step try?",
      solution: true,
      answers: ["4"],
      explanation: "Up, down, left and right; no diagonals.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity, for an m × n board and word length L?",
      solution: true,
      options: [
        { text: "O(m · n · 3^L)", correct: true },
        { text: "O(m · n · 4^L)", why: "After the first step, one of the four directions is where we came from (marked), so 3 remain." },
        { text: "O(m · n)", why: "Each start can branch into many paths." },
      ],
      explanation: "Each of the m·n starts explores up to 3 new directions per letter.",
    },
    {
      kind: "choice",
      prompt: "Why mark cells in the board instead of using a `visited` set?",
      solution: true,
      options: [
        { text: "It avoids O(L) extra memory and hashing; the board itself records the path", correct: true },
        { text: "A set would give wrong answers", why: "A set works too; it's just extra memory." },
        { text: "Sets can't hold coordinates", why: "Tuples like `(row, column)` work fine in sets." },
      ],
      explanation: "Marking in place must be undone afterwards, which is the backtracking step.",
    },
    {
      kind: "choice",
      prompt: "What does `search` return when `position == len(word)`?",
      options: [
        { text: "`True`: every letter has been matched", correct: true },
        { text: "`False`: we went past the word", why: "Reaching the end means success." },
        { text: "The current cell", why: "It returns a boolean." },
      ],
      explanation: "The success check comes before the bounds check, so it works even when the last move left the board.",
    },
    {
      kind: "choice",
      prompt: "Which pruning helps on large boards?",
      options: [
        { text: "Return early if the board doesn't have enough of each letter the word needs", correct: true },
        { text: "Sort the board", why: "Positions matter; sorting destroys adjacency." },
        { text: "Search diagonals too", why: "Diagonals aren't allowed moves." },
      ],
      explanation: "A quick letter count can rule out impossible words before any search.",
    },
  ],

  "restore-ip-addresses": [
    {
      kind: "type",
      prompt: "Fill in the maximum length of one part.",
      code: `
for length in range(1, ___):`,
      answers: ["4"],
      explanation: "Each part has 1 to 3 digits; `range` stops before 4.",
    },
    {
      kind: "type",
      prompt: "Fill in the largest allowed value of a part.",
      code: `
if (segment[0] == "0" and length > 1) or int(segment) > ___:
    break`,
      answers: ["255"],
      explanation: "IPv4 parts are bytes: 0 to 255.",
    },
    {
      kind: "type",
      prompt: "`s = \"25525511135\"`. How many addresses are returned?",
      solution: true,
      answers: ["2"],
      explanation: "`255.255.11.135` and `255.255.111.35`.",
    },
    {
      kind: "type",
      prompt: "`s = \"0000\"`. What is returned?",
      solution: true,
      answers: ["[\"0.0.0.0\"]", "['0.0.0.0']", "0.0.0.0"],
      explanation: "Each part must be a single 0; `\"00\"` would be a leading zero.",
    },
    {
      kind: "type",
      prompt: "`s = \"101023\"`. How many addresses are returned?",
      solution: true,
      answers: ["5"],
      explanation: "`1.0.10.23`, `1.0.102.3`, `10.1.0.23`, `10.10.2.3`, `101.0.2.3`.",
    },
    {
      kind: "type",
      prompt: "Is `\"01\"` a valid part? (`yes` or `no`)",
      answers: ["no"],
      explanation: "Leading zeros aren't allowed; only `\"0\"` itself may start with 0.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(1): at most 3⁴ = 81 ways to choose part lengths", correct: true },
        { text: "O(2ⁿ)", why: "There are only 4 parts with 3 length choices each." },
        { text: "O(n!)", why: "The number of choices is bounded by a constant." },
      ],
      explanation: "The input is at most 20 digits and the search space is bounded.",
    },
    {
      kind: "choice",
      prompt: "What does the pruning check `(4 - parts_used) <= remaining <= 3 * (4 - parts_used)` do?",
      solution: true,
      options: [
        { text: "Stops early when the digits left can't possibly fill the missing parts", correct: true },
        { text: "Checks that each part is ≤ 255", why: "That's checked per segment." },
        { text: "Removes leading zeros", why: "Leading zeros are checked per segment." },
      ],
      explanation: "Each missing part needs between 1 and 3 digits.",
    },
    {
      kind: "choice",
      prompt: "Why `break` (not `continue`) when a segment is invalid?",
      solution: true,
      options: [
        { text: "Longer segments from the same start are also invalid (more leading zeros, or even bigger values)", correct: true },
        { text: "`break` and `continue` are the same here", why: "`continue` would still try longer segments, which can't help." },
        { text: "To stop the whole search", why: "It only stops trying longer lengths at this position." },
      ],
      explanation: "If `\"0X\"` or a value > 255 fails, so does every longer segment.",
    },
    {
      kind: "choice",
      prompt: "When are four parts accepted?",
      solution: true,
      options: [
        { text: "Only when every digit has been used", correct: true },
        { text: "As soon as four parts are chosen", why: "Leftover digits would make the address incomplete." },
        { text: "When the last part is 255", why: "Any valid value works." },
      ],
      explanation: "An address must use all digits in order.",
    },
  ],

  "n-queens": [
    {
      kind: "type",
      prompt: "Fill in the key for the diagonal running top-left to bottom-right.",
      code: `
used_diagonals.add(___)`,
      answers: ["row - column"],
      explanation: "Along that diagonal both row and column grow by 1, so `row - column` stays constant.",
      mistakes: [{ answers: ["row + column"], why: "That's the other diagonal (top-right to bottom-left)." }],
    },
    {
      kind: "type",
      prompt: "Fill in the key for the anti-diagonal.",
      code: `
used_anti_diagonals.add(___)`,
      answers: ["row + column"],
      explanation: "Moving down-left, row grows and column shrinks, so `row + column` stays constant.",
    },
    {
      kind: "type",
      prompt: "How many solutions does `solveNQueens(4)` return?",
      solution: true,
      answers: ["2"],
      explanation: "`.Q.. / ...Q / Q... / ..Q.` and its mirror.",
    },
    {
      kind: "type",
      prompt: "How many solutions for `n = 3`?",
      solution: true,
      answers: ["0"],
      explanation: "No arrangement works for 2 or 3.",
    },
    {
      kind: "type",
      prompt: "How many solutions for the classic `n = 8`?",
      solution: true,
      answers: ["92"],
      explanation: "The famous eight queens puzzle has 92 solutions.",
    },
    {
      kind: "type",
      prompt: "Fill in the row string for a queen in `column`.",
      code: `
"." * column + "Q" + "." * (___)`,
      answers: ["n - column - 1"],
      explanation: "The row has n cells: `column` dots, the queen, then the rest.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n!)", correct: true },
        { text: "O(nⁿ)", why: "That's trying every column per row without pruning. Each row has fewer options than the last." },
        { text: "O(2ⁿ)", why: "Choices are columns, not in/out." },
      ],
      explanation: "Row r has at most n − r safe columns, so it's bounded by n!.",
    },
    {
      kind: "choice",
      prompt: "Why place exactly one queen per row?",
      options: [
        { text: "Two queens in a row attack each other, so each row has exactly one", correct: true },
        { text: "To make the board symmetric", why: "Solutions aren't necessarily symmetric." },
        { text: "It's just a speed trick", why: "It's forced by the rules, and it removes the row check entirely." },
      ],
      explanation: "With n queens and n rows, each row must have one.",
    },
    {
      kind: "choice",
      prompt: "Why use sets for columns and diagonals?",
      options: [
        { text: "\"Is this square attacked?\" becomes three O(1) lookups", correct: true },
        { text: "To store the solution", why: "`queens` stores the solution; the sets are for checks." },
        { text: "Sets keep queens sorted", why: "Sets have no order." },
      ],
      explanation: "Without them you'd scan every placed queen: O(n) per check.",
    },
    {
      kind: "choice",
      prompt: "What must happen after the recursive call returns?",
      solution: true,
      options: [
        { text: "Remove the queen and unmark its column and diagonals", correct: true },
        { text: "Clear the whole board", why: "Only this row's choice is undone." },
        { text: "Nothing", why: "Without undoing, later branches would see squares as attacked that aren't." },
      ],
      explanation: "Choose, explore, un-choose.",
    },
  ],
});
