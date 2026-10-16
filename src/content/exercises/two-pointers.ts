import { defineExercises } from "./types";

export default defineExercises({
  "valid-palindrome": [
    {
      kind: "type",
      prompt: "Fill in the method that decides which characters to skip.",
      code: `
while left < right and not s[left].___():
    left += 1`,
      answers: ["isalnum"],
      explanation: "The problem only considers letters **and digits**. `isalnum()` is true for both, so everything else (spaces, commas, colons) is skipped.",
      mistakes: [
        { answers: ["isalpha"], why: "`isalpha()` is false for digits, so digits would be skipped. But digits count: `\"0P\"` must compare `0` with `p`." },
        { answers: ["isdigit", "isnumeric"], why: "That keeps only digits and skips every letter, so almost any sentence would look like a palindrome." },
      ],
    },
    {
      kind: "type",
      prompt: "Fill in the blank so the comparison ignores case.",
      code: `
if s[left].lower() != s[right].___():
    return False`,
      answers: ["lower", "casefold"],
      explanation: "Both sides must be converted the same way. The left side uses `lower()`, so the right side must too; otherwise `\"A\"` and `\"a\"` would never match.",
      mistakes: [
        { answers: ["upper"], why: "Upper-casing only the right side compares a lower-case letter with an upper-case one, so `\"a\"` vs `\"A\"` fails. Both sides must use the same conversion." },
      ],
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n²)", why: "The inner skip loops look nested, but they move the same two pointers forward. Together the pointers cover the string once." },
        { text: "O(log n)", why: "Every element has to be looked at at least once, so it can't be sub-linear." },
      ],
      explanation: "Each character is visited at most once by either pointer: `left` only moves right and `right` only moves left, so the work is linear.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(1)", correct: true },
        { text: "O(n)", why: "That would be true if you built a filtered, lower-cased copy first. This solution skips characters in place instead." },
        { text: "O(log n)", why: "There's no recursion or halving here, just two integer indices." },
      ],
      explanation: "We never build a cleaned copy of the string. Two integer indices are all the extra memory we use.",
    },
    {
      kind: "type",
      prompt: "What does `isPalindrome(\"0P\")` return? (`True` or `False`)",
      solution: true,
      answers: ["False"],
      explanation: "`0` is a digit, so it is alphanumeric and is not skipped. The comparison is `\"0\"` vs `\"p\"`, which differ.",
      mistakes: [{ answers: ["True"], why: "This would be true only if digits were skipped. Digits are alphanumeric, so `0` is compared against `p` and they differ." }],
    },
    {
      kind: "type",
      prompt: "For `s = \"race a car\"`, how many times does the `if s[left].lower() != s[right].lower()` comparison run before the function returns?",
      solution: true,
      answers: ["4"],
      explanation: "The pairs compared are r/r, a/a, c/c, then `e` vs `a` (the space is skipped). The 4th comparison is the mismatch, so the function returns `False`.",
    },
    {
      kind: "type",
      prompt: "What does `isPalindrome(\" \")` (a single space) return?",
      solution: true,
      answers: ["True"],
      explanation: "`left` and `right` both start at 0, so `left < right` is false and the loop never runs. With nothing to compare, an empty string counts as a palindrome.",
      mistakes: [{ answers: ["False"], why: "After skipping non-alphanumeric characters there is nothing left, and an empty string reads the same both ways." }],
    },
    {
      kind: "choice",
      prompt: "Why skip non-alphanumeric characters with pointers instead of first building a cleaned string?",
      options: [
        { text: "Same result, but O(1) extra space instead of O(n)", correct: true },
        { text: "A cleaned string would give a wrong answer", why: "A cleaned, lower-cased copy gives exactly the same answer. It just costs O(n) extra memory." },
        { text: "Skipping in place is asymptotically faster", why: "Both approaches are O(n) time. The win is space, not time." },
      ],
      explanation: "Building a cleaned copy is correct and easy to read, but it uses O(n) memory. Skipping in place does the same work with just two indices.",
    },
    {
      kind: "choice",
      prompt: "What does the `left < right` guard inside the skip loops prevent?",
      code: `
while left < right and not s[left].isalnum():
    left += 1`,
      options: [
        { text: "The pointers crossing or running off the end on input like \".,\"", correct: true },
        { text: "Comparing upper-case with lower-case letters", why: "Case is handled by `.lower()` in the comparison, not by the guard." },
        { text: "Skipping digits", why: "Whether digits are skipped is decided by `isalnum()`, not by the guard." },
      ],
      explanation: "If the string is all punctuation, `left` would keep moving right past `right`, and could even run past the end of the string. The guard stops it.",
    },
    {
      kind: "choice",
      prompt: "Which input is a valid palindrome under this problem's rules?",
      options: [
        { text: "\"A man, a plan, a canal: Panama\"", correct: true },
        { text: "\"race a car\"", why: "Cleaned it becomes `raceacar`, and `e` vs `a` in the middle don't match." },
        { text: "\"0P\"", why: "Digits count, so this compares `0` with `p`." },
        { text: "\"Ab,cA\"", why: "Cleaned it becomes `abca`, and `b` vs `c` don't match." },
      ],
      explanation: "Cleaned and lower-cased, it becomes `amanaplanacanalpanama`, which reads the same in both directions.",
    },
  ],

  "two-sum-ii-input-array-is-sorted": [
    {
      kind: "type",
      prompt: "Fill in the comparison that decides when to move `right`.",
      code: `
if total == target:
    return [left + 1, right + 1]
if total ___ target:
    right -= 1
else:
    left += 1`,
      answers: [">"],
      explanation: "Moving `right` left picks a smaller value, which lowers the sum. That only helps when the sum is **too big**.",
      mistakes: [{ answers: ["<"], why: "If the sum is too small, lowering it even further moves away from the target. A small sum needs `left += 1`." }],
    },
    {
      kind: "type",
      prompt: "Fill in the blank.",
      code: `
return [left + 1, right + ___]`,
      answers: ["1"],
      explanation: "The problem uses **1-based** indices, so both 0-based indices get `+ 1`.",
      mistakes: [{ answers: ["0"], why: "Both indices need the same shift. The answer is 1-indexed, so `right` needs `+ 1` too." }],
    },
    {
      kind: "type",
      prompt: "`numbers = [2, 7, 11, 15]`, `target = 9`. What is returned?",
      solution: true,
      answers: ["[1, 2]", "1, 2", "1 2"],
      explanation: "`2 + 15 = 17` is too big, so `right` moves to 11. `2 + 11 = 13` is still too big, so `right` moves to 7. `2 + 7 = 9`, found at 0-based indices 0 and 1, which become `[1, 2]`.",
      mistakes: [{ answers: ["[0, 1]", "0, 1", "0 1"], why: "Those are the 0-based indices. This problem wants 1-based indices." }],
    },
    {
      kind: "type",
      prompt: "`numbers = [1, 3, 4, 5, 7, 11]`, `target = 9`. How many times does `right` move before the pair is found?",
      solution: true,
      answers: ["2"],
      explanation: "1+11=12 → right moves. 1+7=8 → left moves. 3+7=10 → right moves. 3+5=8 → left moves. 4+5=9 → found. `right` moved 2 times.",
    },
    {
      kind: "type",
      prompt: "`numbers = [2, 3, 4]`, `target = 6`. What is returned?",
      solution: true,
      answers: ["[1, 3]", "1, 3", "1 3"],
      explanation: "The very first pair checked is `2 + 4 = 6`, at 0-based indices 0 and 2, which become `[1, 3]`.",
      mistakes: [{ answers: ["[0, 2]", "0, 2", "0 2"], why: "Correct pair, but 0-based. Add 1 to each index." }],
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n log n)", why: "The input is already sorted, so there's no sort to pay for. O(n log n) is the binary-search-per-element approach." },
        { text: "O(n²)", why: "That's brute force over every pair. Here each step moves a pointer inward and never revisits a pair." },
      ],
      explanation: "Each step moves one pointer inward, so there are at most n − 1 steps.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(1)", correct: true },
        { text: "O(n)", why: "That's the hash map solution from the original Two Sum. Sorted input lets us drop the map." },
      ],
      explanation: "Two indices and a sum. The problem actually requires constant extra space.",
    },
    {
      kind: "choice",
      prompt: "When `total > target`, why is it safe to throw away `numbers[right]` for good?",
      solution: true,
      options: [
        { text: "Its smallest possible partner is `numbers[left]`, and even that sum is too big", correct: true },
        { text: "The largest value can never be part of the answer", why: "It can be: `[1, 2]` with target 3 uses the last value. We discard it only when the current sum shows it can't work." },
        { text: "Because exactly one solution exists", why: "Uniqueness doesn't decide which values to drop. The sorted order does." },
      ],
      explanation: "Everything left of `left` has already been discarded, so `numbers[left]` is the smallest partner still available for `numbers[right]`. If even that sum is too big, no remaining partner works.",
    },
    {
      kind: "choice",
      prompt: "What goes wrong if the array is **not** sorted?",
      options: [
        { text: "Comparing `total` with `target` no longer tells you which pointer to move", correct: true },
        { text: "The returned indices become 0-based", why: "The `+ 1` is applied either way. Indexing has nothing to do with sorting." },
        { text: "The loop never ends", why: "Every step still moves a pointer inward, so it always ends. It just may miss the answer." },
      ],
      explanation: "The whole method depends on 'move right → smaller sum, move left → bigger sum'. Without sorted order that's false, and the pointers can skip past the real pair.",
    },
    {
      kind: "choice",
      prompt: "You may not use the same element twice. Which part of the code guarantees that?",
      solution: true,
      options: [
        { text: "`while left < right`", correct: true },
        { text: "The `else: left += 1` branch", why: "That only moves `left`. On its own it doesn't stop `left` from reaching `right`." },
        { text: "The `+ 1` in the return", why: "That converts to 1-based indices. It doesn't affect which elements get paired." },
      ],
      explanation: "The loop stops before `left == right`, so the two indices always point to different elements.",
    },
  ],

  "container-with-most-water": [
    {
      kind: "type",
      prompt: "Fill in the function that gives the water level.",
      code: `
best = max(best, ___(height[left], height[right]) * (right - left))`,
      answers: ["min"],
      explanation: "Water spills over the **shorter** wall, so the water level is the smaller of the two heights.",
      mistakes: [{ answers: ["max"], why: "Water would pour over the shorter side. The taller wall doesn't limit anything." }],
    },
    {
      kind: "type",
      prompt: "Fill in the width of the container.",
      code: `
best = max(best, min(height[left], height[right]) * ___)`,
      answers: ["(right - left)", "right - left"],
      explanation: "The width is the distance between the two walls: `right - left`.",
      mistakes: [
        { answers: ["(right - left + 1)", "right - left + 1"], why: "That counts the bars, not the distance. Walls at indices 0 and 1 are 1 apart, not 2." },
        { answers: ["(left - right)", "left - right"], why: "`left < right`, so that's negative. The width is `right - left`." },
      ],
    },
    {
      kind: "type",
      prompt: "Fill in the comparison that decides to move `left`.",
      code: `
if height[left] ___ height[right]:
    left += 1
else:
    right -= 1`,
      answers: ["<", "<="],
      explanation: "Move the **shorter** wall. If `left` is shorter, move it. On a tie either choice is fine, so `<=` also works.",
      mistakes: [{ answers: [">", ">="], why: "That moves the taller wall. Keeping the shorter wall makes the container narrower with the same cap, so it can only get worse." }],
    },
    {
      kind: "type",
      prompt: "`height = [1, 8, 6, 2, 5, 4, 8, 3, 7]`. What is returned?",
      solution: true,
      answers: ["49"],
      explanation: "The walls at index 1 (height 8) and index 8 (height 7) give `min(8, 7) * (8 - 1) = 7 * 7 = 49`.",
    },
    {
      kind: "type",
      prompt: "`height = [1, 1]`. What is returned?",
      solution: true,
      answers: ["1"],
      explanation: "The only container is `min(1, 1) * (1 - 0) = 1`.",
    },
    {
      kind: "type",
      prompt: "`height = [4, 3, 2, 1, 4]`. What is returned?",
      solution: true,
      answers: ["16"],
      explanation: "The two outer walls are both 4 and 4 apart: `4 * 4 = 16`. Here the widest container is the best.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n²)", why: "That's brute force over every pair of walls. Two pointers rule out a whole set of pairs at every step." },
        { text: "O(n log n)", why: "Nothing is sorted here, and no step costs more than O(1)." },
      ],
      explanation: "Each step moves one pointer inward, so there are at most n − 1 steps.",
    },
    {
      kind: "choice",
      prompt: "Why do we move the **shorter** wall?",
      options: [
        { text: "Any container that keeps the shorter wall is narrower and still capped by it, so it can't do better", correct: true },
        { text: "The taller wall is always part of the best container", why: "Not necessarily. The taller wall may get replaced later. We only know the shorter one is done." },
        { text: "Moving the taller wall would skip indices", why: "Either move steps by one index. The reason is about area, not skipped indices." },
      ],
      explanation: "With the shorter wall fixed, the water level can never rise above it, and the width only shrinks. So every remaining pair that uses it is no better, and it can be dropped.",
    },
    {
      kind: "choice",
      prompt: "Why do the pointers start at the two ends?",
      options: [
        { text: "That's the widest container; every move after it trades width for a chance at a taller wall", correct: true },
        { text: "The widest container is always the answer", why: "In `[1, 8, 6, 2, 5, 4, 8, 3, 7]` the answer uses indices 1 and 8, not 0 and 8." },
        { text: "Because the array has to be sorted first", why: "Nothing is sorted here. Sorting would destroy the positions the width depends on." },
      ],
      explanation: "Starting at maximum width means each step is a deliberate trade: give up one unit of width and drop the wall that can't improve.",
    },
    {
      kind: "choice",
      prompt: "Should you sort `height` before running two pointers?",
      solution: true,
      options: [
        { text: "No: sorting destroys positions, and the width depends on positions", correct: true },
        { text: "Yes, two pointers only works on sorted input", why: "Two pointers works whenever each step can safely discard something. Here that comes from the shorter-wall argument, not from order." },
        { text: "Yes, it's O(n log n) but simpler", why: "It wouldn't be simpler, it would be wrong. The width `right - left` would no longer mean anything." },
      ],
      explanation: "The area is `min(height) * distance`, and the distance comes from the original indices. Sorting would scramble them.",
    },
  ],

  "3sum": [
    {
      kind: "type",
      prompt: "Fill in the first line.",
      code: `
nums.___()`,
      answers: ["sort"],
      explanation: "`nums.sort()` sorts the list in place. Sorting lets the two pointers move in a meaningful direction and puts duplicates next to each other.",
      mistakes: [{ answers: ["sorted"], why: "`sorted()` is a built-in function that returns a new list; it isn't a list method. `nums.sorted()` raises an error." }],
    },
    {
      kind: "type",
      prompt: "Fill in the early-exit condition.",
      code: `
if nums[first] > ___:
    break`,
      answers: ["0"],
      explanation: "The array is sorted, so if the smallest of the three numbers is already positive, all three are positive and their sum can't be 0.",
    },
    {
      kind: "type",
      prompt: "Fill in the index to compare against when skipping duplicate first values.",
      code: `
if first > 0 and nums[first] == nums[___]:
    continue`,
      answers: ["first - 1"],
      explanation: "Compare with the **previous** value: if it's the same, every triplet starting with this value was already found.",
      mistakes: [{ answers: ["first + 1"], why: "Comparing with the next value skips the **first** occurrence of a run. For `[-1, -1, 2]` you'd skip the -1 at index 0 and lose the triplet `[-1, -1, 2]`." }],
    },
    {
      kind: "type",
      prompt: "Fill in the operator when skipping repeated right values.",
      code: `
right -= 1
while left < right and nums[right] == nums[right ___ 1]:
    right -= 1`,
      answers: ["+"],
      explanation: "`right` just moved one step left, so the value we just used is at `right + 1`. Keep moving while the new value equals it.",
      mistakes: [{ answers: ["-"], why: "`right - 1` is the next value we haven't looked at yet. We need to compare with the one we just **used**, which is at `right + 1`." }],
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n²)", correct: true },
        { text: "O(n³)", why: "That's brute force over all triples. Two pointers replace the two inner loops with one linear scan." },
        { text: "O(n log n)", why: "That's just the sort. The nested loop and scan cost O(n²), which dominates." },
        { text: "O(n)", why: "The two-pointer scan is O(n), but it runs once for every `first`." },
      ],
      explanation: "There's an outer loop over `first`, and inside it an O(n) two-pointer scan. The O(n log n) sort is smaller than that.",
    },
    {
      kind: "type",
      prompt: "`nums = [-1, 0, 1, 2, -1, -4]`. How many triplets are returned?",
      solution: true,
      answers: ["2"],
      explanation: "Sorted: `[-4, -1, -1, 0, 1, 2]`. The unique triplets are `[-1, -1, 2]` and `[-1, 0, 1]`.",
      mistakes: [{ answers: ["3"], why: "Counting `[-1, 0, 1]` once for each -1 gives 3, but duplicate triplets are skipped." }],
    },
    {
      kind: "type",
      prompt: "`nums = [0, 0, 0, 0]`. How many triplets are returned?",
      solution: true,
      answers: ["1"],
      explanation: "There's only one unique triplet, `[0, 0, 0]`. The duplicate skipping stops it from being added again.",
    },
    {
      kind: "choice",
      prompt: "Why is it safe to `break` once `nums[first] > 0`?",
      solution: true,
      options: [
        { text: "The array is sorted, so the other two values are ≥ `nums[first]` and the sum is positive", correct: true },
        { text: "Positive numbers can never appear in a triplet", why: "They can: `[-1, 0, 1]` contains 1. It's about the **smallest** of the three being positive." },
        { text: "It's just a speed-up and doesn't affect correctness", why: "It's both: it's correct because no zero sum is possible after that point. Saying it's safe needs that reason." },
      ],
      explanation: "`left` and `right` are both after `first`, so in sorted order they are at least `nums[first]`. Three positive numbers can't sum to 0.",
    },
    {
      kind: "choice",
      prompt: "Why skip a `first` value that equals the previous one?",
      solution: true,
      options: [
        { text: "It would find the same pairs again, creating duplicate triplets", correct: true },
        { text: "It turns O(n²) into O(n)", why: "In the worst case (all values different) nothing is skipped and it's still O(n²)." },
        { text: "Otherwise the pointers might never meet", why: "The inner loop always ends. The skip is only about duplicate output." },
      ],
      explanation: "The answer must not contain duplicate triplets. The same first value with the same remaining array would produce exactly the same pairs.",
    },
    {
      kind: "choice",
      prompt: "After finding a triplet, why move **both** pointers?",
      options: [
        { text: "With `first` and one value fixed, the third value is forced, so moving only one pointer can only find a duplicate", correct: true },
        { text: "Moving only one would cause an infinite loop", why: "It would still end, because a pointer moves every step. It would just do useless work." },
        { text: "The problem requires both pointers to move", why: "The problem says nothing about pointers. It's a consequence of the math." },
      ],
      explanation: "If `nums[first] + a + b = 0`, keeping `a` forces the third value to be `b` again. Only a different `a` and a different `b` can give a new triplet.",
    },
  ],

  "remove-duplicates-from-sorted-array": [
    {
      kind: "type",
      prompt: "Fill in the starting value.",
      code: `
unique_count = ___`,
      answers: ["1"],
      explanation: "The first value is always unique, so it's kept from the start and the scan begins at index 1.",
      mistakes: [{ answers: ["0"], why: "Then the first comparison reads `nums[-1]`, which in Python is the **last** element: a silent bug. The first value is always kept." }],
    },
    {
      kind: "type",
      prompt: "Fill in where the new unique value is written.",
      code: `
if nums[index] != nums[unique_count - 1]:
    nums[___] = nums[index]
    unique_count += 1`,
      answers: ["unique_count"],
      explanation: "The kept values fill `nums[0 .. unique_count - 1]`, so the next free slot is `nums[unique_count]`.",
      mistakes: [{ answers: ["index"], why: "`nums[index] = nums[index]` writes the value back where it already is, so nothing gets compacted." }],
    },
    {
      kind: "type",
      prompt: "What does the function return? Fill in the blank.",
      code: `
return ___`,
      answers: ["unique_count"],
      explanation: "The problem asks for `k`, the number of unique values. The judge then checks the first `k` slots of `nums`.",
      mistakes: [{ answers: ["nums"], why: "The array is modified in place. The return value is the count `k`." }],
    },
    {
      kind: "type",
      prompt: "`nums = [1, 1, 2]`. What is returned?",
      solution: true,
      answers: ["2"],
      explanation: "The unique values are 1 and 2, so `k = 2` and `nums` starts with `[1, 2]`.",
    },
    {
      kind: "type",
      prompt: "`nums = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4]`. What is returned?",
      solution: true,
      answers: ["5"],
      explanation: "The unique values are 0, 1, 2, 3, 4, so `k = 5`.",
    },
    {
      kind: "type",
      prompt: "Same input, `[0, 0, 1, 1, 1, 2, 2, 3, 3, 4]`. After the call, what is `nums[2]`?",
      solution: true,
      answers: ["2"],
      explanation: "The first 5 slots become `[0, 1, 2, 3, 4]`, so `nums[2]` is 2.",
      mistakes: [{ answers: ["1"], why: "That's the original `nums[2]`. Compaction overwrote it with the third unique value, 2." }],
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(1)", correct: true },
        { text: "O(n)", why: "That would be a set or a new list. This solution writes over `nums` directly." },
      ],
      explanation: "Values are compacted in place using a single counter.",
    },
    {
      kind: "choice",
      prompt: "Why is comparing with the **last kept** value enough? Why don't we need a set?",
      options: [
        { text: "The array is sorted, so equal values are adjacent; a new value can only equal the last kept one", correct: true },
        { text: "The problem guarantees each value appears at most twice", why: "There's no such limit. `[1, 1, 1]` is valid input." },
        { text: "A set would change the answer", why: "A set would find the same unique values. It's just O(n) extra memory we don't need." },
      ],
      explanation: "In sorted order, once a value is behind you it never shows up again. Checking against the last kept value is the same as checking against all kept values.",
    },
    {
      kind: "choice",
      prompt: "Which variable is the **slow** pointer?",
      options: [
        { text: "`unique_count`: where the next unique value is written", correct: true },
        { text: "`index`: the loop counter", why: "`index` moves every iteration, so it's the **fast** reader." },
        { text: "There's only one pointer", why: "There are two: `index` reads, `unique_count` writes." },
      ],
      explanation: "The fast pointer reads every value. The slow pointer only moves when a new unique value is written.",
    },
    {
      kind: "choice",
      prompt: "After the call returns `k`, what is in `nums[k:]`?",
      solution: true,
      options: [
        { text: "Leftover values, which the judge ignores", correct: true },
        { text: "`None` placeholders", why: "Nothing writes `None`. Those slots keep whatever was there." },
        { text: "The removed duplicates, sorted", why: "Duplicates aren't moved anywhere. Unique values are copied forward over them." },
      ],
      explanation: "Only the first `k` slots matter. The tail still holds old values from the scan.",
    },
  ],

  "sort-colors": [
    {
      kind: "type",
      prompt: "Fill in the loop condition.",
      code: `
low, middle, high = 0, 0, len(nums) - 1
while middle ___ high:`,
      answers: ["<="],
      explanation: "`high` points at the last **unchecked** slot. When `middle == high` that slot still needs checking, so the loop must include it.",
      mistakes: [{ answers: ["<"], why: "It stops one element early: the slot where `middle == high` is never classified. `[1, 0]` would stay `[1, 0]`." }],
    },
    {
      kind: "type",
      prompt: "Fill in the swap for a 0.",
      code: `
if nums[middle] == 0:
    nums[low], nums[middle] = nums[middle], nums[___]
    low += 1
    middle += 1`,
      answers: ["low"],
      explanation: "A tuple swap exchanges the two slots: `a, b = b, a`. Here `a` is `nums[low]` and `b` is `nums[middle]`.",
    },
    {
      kind: "type",
      prompt: "Fill in which pointer moves after swapping in a 2.",
      code: `
else:
    nums[middle], nums[high] = nums[high], nums[middle]
    ___ -= 1`,
      answers: ["high"],
      explanation: "The 2 is now at `high`, so the 2-region grows by one: `high -= 1`. `middle` stays put because the value swapped in is unchecked.",
      mistakes: [{ answers: ["middle"], why: "`middle` must not move here, and certainly not backwards. The region that grew is the 2-region at the end." }],
    },
    {
      kind: "type",
      prompt: "`nums = [2, 0, 1]`. What is `nums` after the **first** loop iteration?",
      solution: true,
      answers: ["[1, 0, 2]", "1, 0, 2", "1 0 2"],
      explanation: "`nums[0]` is 2, so it swaps with `nums[high] = nums[2]`, giving `[1, 0, 2]`, and `high` becomes 1.",
    },
    {
      kind: "type",
      prompt: "`nums = [2, 0, 1]`. How many swaps happen in total?",
      solution: true,
      answers: ["2"],
      explanation: "Swap 1: the 2 goes to the back → `[1, 0, 2]`. The 1 at middle is skipped. Swap 2: the 0 at index 1 goes to the front → `[0, 1, 2]`. Then `middle = 2 > high = 1` and the loop ends.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n log n)", why: "That's a comparison sort. This algorithm never compares pairs; it just puts each value in its region." },
        { text: "O(n²)", why: "Each iteration shrinks the unchecked region by one, so there are at most n iterations." },
      ],
      explanation: "Every iteration either moves `middle` forward or `high` backward, so the gap between them shrinks each time: at most n iterations.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(1)", correct: true },
        { text: "O(n)", why: "No extra array is used. All the swaps happen inside `nums`." },
      ],
      explanation: "Three indices; everything is swapped in place.",
    },
    {
      kind: "choice",
      prompt: "After swapping with `high`, why doesn't `middle` move forward?",
      solution: true,
      options: [
        { text: "The value that came from `high` hasn't been checked yet", correct: true },
        { text: "It would make the loop run forever", why: "Moving it would end the loop sooner, not later. The real problem is an unchecked value being skipped." },
        { text: "`middle` never moves when `high` moves", why: "That's just restating the code. The reason is that the incoming value is unchecked." },
      ],
      explanation: "Slots after `high` are 2s, but the slot at `high` is unknown, so it could be a 0, 1 or 2. It needs to be checked on the next iteration.",
    },
    {
      kind: "choice",
      prompt: "After swapping with `low`, why **is** it safe to move `middle` forward?",
      solution: true,
      options: [
        { text: "Everything between `low` and `middle` was already checked and is 1, so the incoming value is a 1 (or the same element)", correct: true },
        { text: "Because `low` also moved", why: "Moving `low` doesn't tell us anything about the value that arrived at `middle`." },
        { text: "Values at `low` are always 0", why: "Values **before** `low` are 0. The value at `low` is the first 1 (or `middle` itself)." },
      ],
      explanation: "`middle` has already passed `low`, so the value at `low` was already classified. It can only be a 1, or the same slot when `low == middle`.",
    },
    {
      kind: "choice",
      prompt: "Counting 0s, 1s and 2s and then rewriting the array also works. What does the one-pass version improve?",
      options: [
        { text: "It does a single pass; both are O(n) time and O(1) space", correct: true },
        { text: "Better big-O time", why: "Both are O(n). Two passes over n elements is still linear." },
        { text: "Less memory", why: "Counting needs just three integers, which is also O(1)." },
      ],
      explanation: "The Dutch national flag algorithm is the one-pass follow-up the problem asks for. Its big-O cost is the same as counting.",
    },
  ],

  "4sum": [
    {
      kind: "type",
      prompt: "Fill in the bound for the first loop so there's room for 3 more numbers.",
      code: `
for first in range(length - ___):`,
      answers: ["3"],
      explanation: "`first` needs three indices after it (`second`, `left`, `right`), so its last valid index is `length - 4` and the range stops at `length - 3`.",
    },
    {
      kind: "type",
      prompt: "Fill in the start of the duplicate check for `second`.",
      code: `
for second in range(first + 1, length - 2):
    if second > ___ and nums[second] == nums[second - 1]:
        continue`,
      answers: ["first + 1"],
      explanation: "Only skip when `second` is past its **first** position for this `first`. At `second == first + 1`, the previous value belongs to `first`, not to an earlier `second`.",
      mistakes: [{ answers: ["0"], why: "For `[2, 2, 2, 2]` with target 8, `second = 1` would be skipped because it equals `nums[0]`, and you'd lose `[2, 2, 2, 2]`." }],
    },
    {
      kind: "type",
      prompt: "Fill in the operator when skipping repeated left values.",
      code: `
left += 1
while left < right and nums[left] == nums[left ___ 1]:
    left += 1`,
      answers: ["-"],
      explanation: "`left` just moved right, so the value we just used is at `left - 1`.",
      mistakes: [{ answers: ["+"], why: "`left + 1` is a value we haven't seen yet. Compare with the one we just used, at `left - 1`." }],
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n³)", correct: true },
        { text: "O(n⁴)", why: "That's brute force over all 4-tuples. Two pointers replace the two innermost loops." },
        { text: "O(n²)", why: "That's 3Sum. 4Sum adds another fixed number, so another factor of n." },
      ],
      explanation: "Two nested loops (`first`, `second`), with an O(n) two-pointer scan inside.",
    },
    {
      kind: "type",
      prompt: "`nums = [2, 2, 2, 2, 2]`, `target = 8`. How many quadruplets are returned?",
      solution: true,
      answers: ["1"],
      explanation: "There's only one unique quadruplet: `[2, 2, 2, 2]`.",
    },
    {
      kind: "type",
      prompt: "`nums = [1, 0, -1, 0, -2, 2]`, `target = 0`. How many quadruplets are returned?",
      solution: true,
      answers: ["3"],
      explanation: "Sorted: `[-2, -1, 0, 0, 1, 2]`. The unique quadruplets are `[-2, -1, 1, 2]`, `[-2, 0, 0, 2]` and `[-1, 0, 0, 1]`.",
    },
    {
      kind: "choice",
      prompt: "In general, what is the time complexity of k-Sum done this way (k − 2 fixed loops plus two pointers)?",
      solution: true,
      options: [
        { text: "O(n^(k−1))", correct: true },
        { text: "O(n^k)", why: "That's brute force. Two pointers save one factor of n." },
        { text: "O(n^(k−2))", why: "That counts only the fixed loops and forgets the O(n) two-pointer scan inside them." },
      ],
      explanation: "k − 2 nested loops give n^(k−2), and the two-pointer scan adds one more factor of n: n^(k−1). That's n² for 3Sum and n³ for 4Sum.",
    },
    {
      kind: "choice",
      prompt: "How does 4Sum reuse 3Sum's idea?",
      options: [
        { text: "Fix two numbers with loops, then find the last two with two pointers", correct: true },
        { text: "Run 3Sum twice and merge the results", why: "Merging two triplet lists doesn't give quadruplets that sum to target." },
        { text: "Use a hash map for the last two numbers", why: "That's a valid alternative, but this solution uses two pointers on the sorted array." },
      ],
      explanation: "Every extra number adds a fixed loop. The last two numbers are always found by the same two-pointer scan.",
    },
    {
      kind: "choice",
      prompt: "Python ints never overflow. In Java or C++, what should you watch out for in this code?",
      solution: true,
      options: [
        { text: "`total` can overflow a 32-bit int; use a 64-bit type", correct: true },
        { text: "Sorting changes the original indices", why: "The answer is values, not indices, so that doesn't matter." },
        { text: "Arrays are 1-indexed", why: "Java and C++ arrays are 0-indexed, just like Python." },
      ],
      explanation: "Values go up to 10⁹, so four of them can sum to about 4·10⁹, which is beyond the 32-bit limit. LeetCode includes test cases for exactly this.",
    },
    {
      kind: "choice",
      prompt: "Which statement about sorting first is true?",
      options: [
        { text: "It makes pointer movement meaningful **and** puts duplicates next to each other", correct: true },
        { text: "It's only needed to skip duplicates", why: "Without sorted order, `total < target` wouldn't tell you to move `left`." },
        { text: "It sets the overall time complexity", why: "The sort is O(n log n), which is smaller than the O(n³) search." },
      ],
      explanation: "Sorting enables both parts of the method: directional pointer moves, and skipping duplicates by comparing with the neighbor.",
    },
  ],

  "valid-triangle-number": [
    {
      kind: "type",
      prompt: "Fill in the comparison that makes a valid triangle.",
      code: `
if nums[left] + nums[right] ___ nums[largest]:
    count += right - left
    right -= 1`,
      answers: [">"],
      explanation: "The triangle inequality is strict: the two shorter sides must add up to **more** than the longest side.",
      mistakes: [{ answers: [">="], why: "When the sides are equal (e.g. 1 + 2 = 3) the triangle is flat and has zero area. It doesn't count." }],
    },
    {
      kind: "type",
      prompt: "Fill in how many triangles one successful check counts.",
      code: `
if nums[left] + nums[right] > nums[largest]:
    count += ___
    right -= 1`,
      answers: ["right - left"],
      explanation: "If `nums[left]` works with `nums[right]`, every bigger left value up to `right - 1` works too. That's `right - left` choices.",
      mistakes: [{ answers: ["1"], why: "That counts only the pair `(left, right)` and misses every index between them that also works." }],
    },
    {
      kind: "type",
      prompt: "Fill in the stop value of the outer loop.",
      code: `
for largest in range(len(nums) - 1, ___, -1):`,
      answers: ["1"],
      explanation: "The largest side needs two indices before it (0 and 1), so its smallest valid index is 2. `range` stops just before 1.",
      mistakes: [{ answers: ["0"], why: "Then `largest = 1` would run with only one index before it, so there's no pair to form." }],
    },
    {
      kind: "type",
      prompt: "`nums = [2, 2, 3, 4]`. What is returned?",
      solution: true,
      answers: ["3"],
      explanation: "The valid triples are (2, 3, 4) using the first 2, (2, 3, 4) using the second 2, and (2, 2, 3).",
    },
    {
      kind: "type",
      prompt: "`nums = [4, 2, 3, 4]`. What is returned?",
      solution: true,
      answers: ["4"],
      explanation: "Sorted: `[2, 3, 4, 4]`. The valid triples are (2,3,4), (2,3,4), (2,4,4) and (3,4,4).",
    },
    {
      kind: "type",
      prompt: "`nums = [0, 0, 0]`. What is returned?",
      solution: true,
      answers: ["0"],
      explanation: "`0 + 0 > 0` is false. Zero-length sides can't form a triangle.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n²)", correct: true },
        { text: "O(n³)", why: "That's brute force over all triples. The `count += right - left` trick counts whole groups at once." },
        { text: "O(n log n)", why: "That's just the sort. The loop over `largest` with a linear scan inside is O(n²)." },
      ],
      explanation: "An outer loop over `largest`, with an O(n) two-pointer scan inside.",
    },
    {
      kind: "choice",
      prompt: "A triangle needs three inequalities. Why does the code check only `nums[left] + nums[right] > nums[largest]`?",
      solution: true,
      options: [
        { text: "After sorting, `nums[largest]` is the biggest side, so the other two inequalities always hold", correct: true },
        { text: "The other two are checked by the outer loop", why: "The outer loop only picks `largest`. It doesn't check anything." },
        { text: "The problem only asks for one inequality", why: "A triangle needs all three. Sorting just makes two of them automatic." },
      ],
      explanation: "If `c` is the largest side, then `a + c > b` and `b + c > a` hold for positive sides. Only `a + b > c` can fail.",
    },
    {
      kind: "choice",
      prompt: "Why fix the **largest** side instead of the smallest?",
      options: [
        { text: "Then each comparison tells you which pointer to move: too small → `left++`, big enough → count and `right--`", correct: true },
        { text: "Fixing the smallest gives the wrong answer", why: "It wouldn't be wrong, but neither pointer move would be clearly right, so you lose the linear scan." },
        { text: "The largest side is always unique", why: "Duplicates are allowed, e.g. `[2, 3, 4, 4]`." },
      ],
      explanation: "With the largest side fixed, the sum of the other two is monotonic in both pointers, which is exactly what two pointers needs.",
    },
    {
      kind: "choice",
      prompt: "When the check succeeds, why do we then move `right` (not `left`)?",
      solution: true,
      options: [
        { text: "Every pair using this `right` was just counted, so `right` is finished", correct: true },
        { text: "Moving `left` would skip valid triangles", why: "The real reason is that this `right` has nothing left to count. It's done, not risky." },
        { text: "`right` always moves first", why: "When the sum is too small, `left` moves instead." },
      ],
      explanation: "`count += right - left` covered every left index paired with this `right`. The next useful question is about a smaller `right`.",
    },
  ],

  "boats-to-save-people": [
    {
      kind: "type",
      prompt: "Fill in the comparison that lets two people share a boat.",
      code: `
if people[left] + people[right] ___ limit:
    left += 1`,
      answers: ["<="],
      explanation: "A boat can carry **up to** `limit`, so a pair that weighs exactly `limit` still fits.",
      mistakes: [{ answers: ["<"], why: "Two people who weigh exactly `limit` together fit in one boat. With `<` they'd take two." }],
    },
    {
      kind: "type",
      prompt: "Fill in the loop condition.",
      code: `
while left ___ right:`,
      answers: ["<="],
      explanation: "When `left == right`, one person is still on the shore and needs a boat of their own.",
      mistakes: [{ answers: ["<"], why: "With `<`, the loop ends while one person is still waiting, so their boat is never counted." }],
    },
    {
      kind: "type",
      prompt: "Fill in the pointer that moves on **every** boat.",
      code: `
while left <= right:
    if people[left] + people[right] <= limit:
        left += 1
    ___ -= 1
    boats += 1`,
      answers: ["right"],
      explanation: "The heaviest person boards every boat. The lightest only joins when they fit.",
      mistakes: [{ answers: ["left"], why: "`left` already moved inside the `if`, and only when the lightest person fits. The heaviest person always boards." }],
    },
    {
      kind: "type",
      prompt: "Fill in the first step.",
      code: `
people.___()
left, right = 0, len(people) - 1`,
      answers: ["sort"],
      explanation: "The pointers only mean \"lightest\" and \"heaviest\" once the weights are sorted.",
      mistakes: [{ answers: ["reverse"], why: "Reversing doesn't order the weights. The pointers need sorted order." }],
    },
    {
      kind: "type",
      prompt: "`people = [1, 2]`, `limit = 3`. What is returned?",
      solution: true,
      answers: ["1"],
      explanation: "`1 + 2 = 3 <= 3`, so both fit in one boat.",
      mistakes: [{ answers: ["2"], why: "The limit is inclusive: a total of exactly 3 fits." }],
    },
    {
      kind: "type",
      prompt: "`people = [3, 2, 2, 1]`, `limit = 3`. What is returned?",
      solution: true,
      answers: ["3"],
      explanation: "Sorted: `[1, 2, 2, 3]`. The 3 sails alone, 1 + 2 share a boat, and the last 2 sails alone.",
    },
    {
      kind: "type",
      prompt: "`people = [3, 5, 3, 4]`, `limit = 5`. What is returned?",
      solution: true,
      answers: ["4"],
      explanation: "Even the lightest pair is 3 + 3 = 6 > 5, so nobody can share. Everyone sails alone.",
      mistakes: [{ answers: ["3", "2"], why: "Check the lightest pair: 3 + 3 = 6 is already over the limit, so no two people fit together." }],
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n log n)", correct: true },
        { text: "O(n)", why: "The pointer scan is O(n), but sorting first costs O(n log n)." },
        { text: "O(n²)", why: "That's trying every pair. Each step moves at least one pointer, so the scan is linear." },
      ],
      explanation: "Sorting dominates. The scan afterwards is a single O(n) pass.",
    },
    {
      kind: "choice",
      prompt: "Why try to pair the heaviest person with the **lightest** one?",
      options: [
        { text: "If the lightest can't fit with the heaviest, nobody can, so the heaviest must sail alone", correct: true },
        { text: "It keeps the boats balanced", why: "Only the total weight matters, not balance." },
        { text: "It keeps each boat as light as possible", why: "The goal is fewer boats, not lighter ones." },
      ],
      explanation: "The lightest person is the heaviest person's best chance at a partner. One comparison settles whether the heaviest shares a boat.",
    },
    {
      kind: "choice",
      prompt: "When `people[left] + people[right] > limit`, why is it safe to send `people[right]` alone?",
      solution: true,
      options: [
        { text: "Everyone else left weighs at least `people[left]`, so nobody fits with them", correct: true },
        { text: "So the loop is guaranteed to end", why: "The loop would end either way. The reason is that waiting can't help: there's no lighter partner left." },
        { text: "The heaviest person always has to board first", why: "The problem has no boarding order. It's about who can still share a boat." },
      ],
      explanation: "In sorted order, `people[left]` is the lightest person left. If they don't fit with `people[right]`, no one does.",
    },
  ],

  "trapping-rain-water": [
    {
      kind: "type",
      prompt: "Fill in the water added above the left bar.",
      code: `
tallest_left = max(tallest_left, height[left])
water += tallest_left - ___`,
      answers: ["height[left]"],
      explanation: "Water above a bar fills up to the level of the limiting wall. Here that's `tallest_left`, minus the bar's own height.",
      mistakes: [{ answers: ["height[right]"], why: "We're filling the **left** bar, so subtract its own height, not the other side's." }],
    },
    {
      kind: "type",
      prompt: "Fill in the comparison that decides to process the left side.",
      code: `
if height[left] ___ height[right]:
    # process left
else:
    # process right`,
      answers: ["<", "<="],
      explanation: "Process the **lower** side: it's guaranteed a wall at least as tall on the other side, so its own running max decides the water level. Ties can go either way.",
      mistakes: [{ answers: [">", ">="], why: "That processes the taller side, which isn't guaranteed a high enough wall on the other side." }],
    },
    {
      kind: "type",
      prompt: "`height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]`. What is returned?",
      solution: true,
      answers: ["6"],
      explanation: "Water units by index: i2=1, i4=1, i5=2, i6=1, i9=1. Total: 6.",
    },
    {
      kind: "type",
      prompt: "`height = [4, 2, 0, 3, 2, 5]`. What is returned?",
      solution: true,
      answers: ["9"],
      explanation: "The left wall (4) caps everything: 2 + 4 + 1 + 2 = 9.",
    },
    {
      kind: "type",
      prompt: "`height = [3, 0, 3]`. What is returned?",
      solution: true,
      answers: ["3"],
      explanation: "The middle bar sits between two walls of height 3, so it holds 3 − 0 = 3 units.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n²)", why: "That's the brute force that scans left and right for every bar. Here each step moves one pointer inward." },
        { text: "O(n log n)", why: "Nothing is sorted here, and no step costs more than O(1)." },
      ],
      explanation: "Each step moves one pointer inward, so there are n − 1 steps.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity of this two-pointer version?",
      solution: true,
      options: [
        { text: "O(1)", correct: true },
        { text: "O(n)", why: "That's the prefix-max / suffix-max array version. Two pointers replace those arrays with two running values." },
      ],
      explanation: "Two indices, two running maximums and a total.",
    },
    {
      kind: "choice",
      prompt: "When `height[left] < height[right]`, why can we compute the left bar's water using only `tallest_left`?",
      solution: true,
      options: [
        { text: "There's a wall at least `height[right]` tall on the right, so the left max is the limiting side", correct: true },
        { text: "`tallest_right` is always 0 at that point", why: "`tallest_right` can be anything. We just don't need it." },
        { text: "Water only flows to the left", why: "Water level depends on both sides. We've just proved which side is lower." },
      ],
      explanation: "The level is `min(max_left, max_right)`. The right side has a bar taller than `height[left]`, and the inequality means `tallest_left` is the smaller cap.",
    },
    {
      kind: "choice",
      prompt: "Why update `tallest_left` **before** adding water?",
      solution: true,
      options: [
        { text: "If the current bar is the new tallest, it adds 0 instead of a negative amount", correct: true },
        { text: "It's just style; the order doesn't matter", why: "Swap the lines and a new tallest bar adds a negative amount, which gives a wrong total." },
        { text: "`max()` needs to be called first in Python", why: "Python has no such rule. The order matters because of the math." },
      ],
      explanation: "After the update, `tallest_left >= height[left]`, so `tallest_left - height[left]` is never negative.",
    },
    {
      kind: "choice",
      prompt: "What is the water above bar `i`?",
      solution: true,
      options: [
        { text: "`min(max height on its left, max height on its right) - height[i]`", correct: true },
        { text: "`max(left max, right max) - height[i]`", why: "Water would pour over the lower side. The level is the **smaller** maximum." },
        { text: "`height[i - 1] + height[i + 1] - height[i]`", why: "The neighbors don't decide the level. The tallest bars on each side (even far away) do." },
      ],
      explanation: "Every trapping-water solution (brute force, prefix arrays, stack, two pointers) computes this same formula, just more efficiently.",
    },
  ],
});
