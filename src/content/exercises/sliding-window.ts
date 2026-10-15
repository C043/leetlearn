import { defineExercises } from "./types";

export default defineExercises({
  "contains-duplicate-ii": [
    {
      kind: "type",
      prompt: "Fill in the data structure that holds the last `k` values.",
      code: `
window = ___()`,
      answers: ["set"],
      explanation: "We only ask \"is this value in the window?\", and a set answers that in O(1).",
      mistakes: [{ answers: ["list", "[]"], why: "A list works, but `number in window` would scan up to k values every time. A set checks in O(1)." }],
    },
    {
      kind: "type",
      prompt: "Fill in the value that leaves the window.",
      code: `
window.add(number)
if len(window) > k:
    window.remove(nums[___])`,
      answers: ["index - k"],
      explanation: "After adding `nums[index]`, the window should cover indices `index - k + 1 .. index`. The value at `index - k` is now too far back.",
      mistakes: [{ answers: ["index - k + 1"], why: "That value is still exactly k positions back from the next index, so it must stay in the window." }],
    },
    {
      kind: "type",
      prompt: "Fill in the size limit of the window.",
      code: `
if len(window) > ___:
    window.remove(nums[index - k])`,
      answers: ["k"],
      explanation: "A duplicate counts only if it's at most k positions back, so the window keeps the last k values.",
    },
    {
      kind: "type",
      prompt: "`nums = [1, 2, 3, 1]`, `k = 3`. What is returned? (`True` or `False`)",
      solution: true,
      answers: ["True"],
      explanation: "The two 1s are at indices 0 and 3: exactly 3 apart, which is allowed.",
    },
    {
      kind: "type",
      prompt: "`nums = [1, 2, 3, 1, 2, 3]`, `k = 2`. What is returned?",
      solution: true,
      answers: ["False"],
      explanation: "Every duplicate pair is 3 apart, and k = 2. By the time a value repeats, it has already left the window.",
      mistakes: [{ answers: ["True"], why: "The values do repeat, but always 3 positions apart, which is more than k = 2." }],
    },
    {
      kind: "type",
      prompt: "`nums = [1, 0, 1, 1]`, `k = 1`. What is returned?",
      solution: true,
      answers: ["True"],
      explanation: "The 1s at indices 2 and 3 are 1 apart.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n · k)", why: "That's comparing each value with the previous k by hand. The set does each lookup in O(1)." },
        { text: "O(n log n)", why: "Nothing is sorted, and set operations are O(1) on average." },
      ],
      explanation: "One pass over `nums`, with an O(1) set add, lookup and removal per step.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(min(n, k))", correct: true },
        { text: "O(n)", why: "The set never holds more than k values, which can be much smaller than n." },
        { text: "O(1)", why: "The set grows with k, so the space isn't constant." },
      ],
      explanation: "The window holds at most k values, and never more than n.",
    },
    {
      kind: "choice",
      prompt: "Why is it safe to check `number in window` **before** adding the number?",
      solution: true,
      options: [
        { text: "The window holds only earlier values, so a hit means an earlier index within k", correct: true },
        { text: "Adding first would make the set throw an error", why: "Adding a value that's already in a set does nothing; it doesn't throw. The real issue is that every value would then match itself." },
        { text: "It doesn't matter: the order of the two lines is interchangeable", why: "If you added first, `number in window` would always be true, because it would find itself." },
      ],
      explanation: "The check has to compare against *other* indices, so it happens before the current value joins the window.",
    },
    {
      kind: "choice",
      prompt: "Why does the window hold exactly the last `k` values, not `k + 1`?",
      options: [
        { text: "When the current value is checked, any earlier match must be within k positions: indices `index - k .. index - 1`", correct: true },
        { text: "Because sets can't hold more than k items", why: "Sets have no size limit. The code removes values to enforce it." },
        { text: "It should be k + 1; the code has an off-by-one", why: "The code is correct. The k earlier positions are exactly the ones a duplicate may come from." },
      ],
      explanation: "The current index looks back at most k steps. Those k earlier positions are what the window stores.",
    },
  ],

  "maximum-average-subarray-i": [
    {
      kind: "type",
      prompt: "Fill in the sum of the first window.",
      code: `
total = best = sum(nums[:___])`,
      answers: ["k"],
      explanation: "The first window is the first k values: `nums[0 .. k-1]`.",
    },
    {
      kind: "type",
      prompt: "Fill in the value that leaves the window when sliding.",
      code: `
for index in range(k, len(nums)):
    total += nums[index] - nums[___]`,
      answers: ["index - k"],
      explanation: "The new window ends at `index` and starts at `index - k + 1`, so `nums[index - k]` just fell out.",
      mistakes: [{ answers: ["index - k + 1"], why: "That's the first value of the **new** window, so it must stay in the sum." }],
    },
    {
      kind: "type",
      prompt: "Fill in the return value.",
      code: `
return ___`,
      answers: ["best / k"],
      explanation: "We tracked the best **sum**. All windows have the same size k, so the best sum gives the best average.",
      mistakes: [{ answers: ["best", "total / k"], why: "We need the best window's average: `best / k`. `best` alone is a sum, and `total` is just the last window." }],
    },
    {
      kind: "type",
      prompt: "`nums = [1, 12, -5, -6, 50, 3]`, `k = 4`. What is returned?",
      solution: true,
      answers: ["12.75"],
      explanation: "Window sums: 2, 51, 42. The best is `[12, -5, -6, 50]` with sum 51, and 51 / 4 = 12.75.",
    },
    {
      kind: "type",
      prompt: "`nums = [4, 2, 1, 3, 3]`, `k = 2`. What is returned?",
      solution: true,
      answers: ["3.0", "3"],
      explanation: "Window sums: 6, 3, 4, 6. The best sum is 6, and 6 / 2 = 3.0.",
    },
    {
      kind: "type",
      prompt: "`nums = [5]`, `k = 1`. What is returned?",
      solution: true,
      answers: ["5.0", "5"],
      explanation: "There's one window, `[5]`, and the loop never runs: 5 / 1 = 5.0.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n · k)", why: "That's summing each window from scratch. Sliding updates the sum in O(1) per step." },
        { text: "O(k)", why: "The window moves across the whole array, so every value is visited." },
      ],
      explanation: "The first sum is O(k), then each of the n − k slides is O(1). Total: O(n).",
    },
    {
      kind: "choice",
      prompt: "Why compare **sums** instead of averages inside the loop?",
      solution: true,
      options: [
        { text: "Every window has size k, so the biggest sum is also the biggest average", correct: true },
        { text: "Division is not allowed in the loop", why: "It's allowed. It's just unnecessary, because dividing by the same k doesn't change which is biggest." },
        { text: "Averages would give a different answer", why: "They'd give the same answer. Comparing sums just avoids repeated division and floating-point noise." },
      ],
      explanation: "Dividing every candidate by the same positive k keeps their order, so we divide once at the end.",
    },
    {
      kind: "choice",
      prompt: "Why is `best` initialised to the first window's sum and not to 0?",
      solution: true,
      options: [
        { text: "Values can be negative, so every window's sum might be below 0", correct: true },
        { text: "0 would be fine; it's just style", why: "For `nums = [-1]`, `k = 1`, starting at 0 would return 0.0 instead of -1.0." },
        { text: "To skip the first iteration of the loop", why: "The loop starts at `k` because the first window is already counted. That's a separate point." },
      ],
      explanation: "The answer must come from a real window. Starting from the first window guarantees that.",
    },
    {
      kind: "choice",
      prompt: "What kind of sliding window is this?",
      options: [
        { text: "Fixed size: the window always holds exactly k values", correct: true },
        { text: "Variable size: it grows and shrinks", why: "There's no shrinking loop. Each step adds one value and removes one." },
        { text: "Two pointers from opposite ends", why: "Both ends of the window move in the same direction, one step at a time." },
      ],
      explanation: "In a fixed-size window, adding the new value and removing the old one keeps the size at k.",
    },
  ],

  "longest-substring-without-repeating-characters": [
    {
      kind: "type",
      prompt: "Fill in the condition: the character is a repeat **inside** the current window.",
      code: `
if character in last and last[character] ___ left:
    left = last[character] + 1`,
      answers: [">="],
      explanation: "An index stored in `last` might be from before the window started. It's only a repeat if it's at or after `left`.",
      mistakes: [{ answers: [">"], why: "If the earlier copy is exactly at `left`, it **is** inside the window. With `>`, `\"aa\"` would return 2." }],
    },
    {
      kind: "type",
      prompt: "Fill in where the window's start jumps to.",
      code: `
if character in last and last[character] >= left:
    left = ___`,
      answers: ["last[character] + 1"],
      explanation: "The start moves just past the earlier copy, so the window keeps only one copy of `character`.",
      mistakes: [{ answers: ["last[character]"], why: "That keeps the earlier copy inside the window, so the window still has a repeat." }],
    },
    {
      kind: "type",
      prompt: "Fill in the window length.",
      code: `
best = max(best, ___)`,
      answers: ["right - left + 1"],
      explanation: "The window covers `left .. right` inclusive, which is `right - left + 1` characters.",
      mistakes: [{ answers: ["right - left"], why: "Both ends are inclusive. A one-character window has `right == left` and length 1." }],
    },
    {
      kind: "type",
      prompt: "`s = \"pwwkew\"`. What is returned?",
      solution: true,
      answers: ["3"],
      explanation: "The longest window is `\"wke\"`. Note that `\"pwke\"` is not a substring, because it skips the second `w`.",
      mistakes: [{ answers: ["4"], why: "`\"pwke\"` isn't contiguous. Substrings can't skip characters." }],
    },
    {
      kind: "type",
      prompt: "`s = \"abba\"`. What is returned?",
      solution: true,
      answers: ["2"],
      explanation: "At the last `a`, `last[\"a\"] = 0` but `left` is already 2. The old `a` is outside the window, so `left` stays put. Best: 2 (`\"ab\"` or `\"ba\"`).",
      mistakes: [{ answers: ["3"], why: "That happens if you forget the `>= left` check: `left` would jump **back** to 1 and the window would contain two `b`s." }],
    },
    {
      kind: "type",
      prompt: "`s = \"\"` (empty). What is returned?",
      solution: true,
      answers: ["0"],
      explanation: "The loop never runs and `best` stays 0.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n²)", why: "That's checking every substring. Here `left` jumps forward and never moves back." },
        { text: "O(n · alphabet)", why: "Each dictionary lookup is O(1). Alphabet size only affects memory." },
      ],
      explanation: "Each character is handled once with O(1) dictionary work.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(min(n, alphabet))", correct: true },
        { text: "O(1)", why: "The dictionary grows with the number of distinct characters." },
        { text: "O(n²)", why: "We store one index per distinct character, never substrings." },
      ],
      explanation: "`last` holds one entry per distinct character, which is bounded by both n and the alphabet size.",
    },
    {
      kind: "choice",
      prompt: "Why store the **last index** of each character instead of a set of the window's characters?",
      options: [
        { text: "So `left` can jump straight past the repeat instead of moving one step at a time", correct: true },
        { text: "A set version would give wrong answers", why: "A set version is correct too. It shrinks one character at a time, which is still O(n) overall." },
        { text: "Sets can't hold characters", why: "Sets can hold any hashable value, including characters." },
      ],
      explanation: "Knowing exactly where the duplicate is lets the window skip directly past it.",
    },
    {
      kind: "choice",
      prompt: "Why is `last` never cleaned up when `left` moves?",
      solution: true,
      options: [
        { text: "The `last[character] >= left` check ignores entries from before the window", correct: true },
        { text: "Old entries are deleted automatically", why: "Nothing deletes them. The check makes them harmless." },
        { text: "It's a bug that happens to pass tests", why: "It's deliberate: stale entries are filtered by comparing with `left`." },
      ],
      explanation: "Removing entries would cost extra work. Comparing with `left` gives the same result for free.",
    },
  ],

  "longest-repeating-character-replacement": [
    {
      kind: "type",
      prompt: "Fill in the number of characters that would need replacing in the window.",
      code: `
while (right - left + 1) - ___ > k:
    count[s[left]] -= 1
    left += 1`,
      answers: ["highest_count"],
      explanation: "Keep the most common letter and replace everything else: window length minus the top count.",
    },
    {
      kind: "type",
      prompt: "Fill in the shrink condition.",
      code: `
while (right - left + 1) - highest_count ___ k:`,
      answers: [">"],
      explanation: "Up to k replacements are allowed. The window is invalid only when it needs **more** than k.",
      mistakes: [{ answers: [">="], why: "Exactly k replacements is allowed, so a window needing k must stay." }],
    },
    {
      kind: "type",
      prompt: "Fill in the update of the most common count.",
      code: `
count[character] = count.get(character, 0) + 1
highest_count = ___(highest_count, count[character])`,
      answers: ["max"],
      explanation: "Only the character just added changed, so it's the only one that could set a new maximum.",
    },
    {
      kind: "type",
      prompt: "`s = \"ABAB\"`, `k = 2`. What is returned?",
      solution: true,
      answers: ["4"],
      explanation: "Replace both `B`s (or both `A`s): the whole string becomes one letter.",
    },
    {
      kind: "type",
      prompt: "`s = \"AABABBA\"`, `k = 1`. What is returned?",
      solution: true,
      answers: ["4"],
      explanation: "Replace the `A` in `\"BABB\"` (or the `B` in `\"AABA\"`) to get 4 identical letters.",
    },
    {
      kind: "type",
      prompt: "`s = \"ABCD\"`, `k = 0`. What is returned?",
      solution: true,
      answers: ["1"],
      explanation: "No replacements allowed and no letter repeats, so the best is a single character.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n²)", why: "The inner `while` looks nested, but `left` only moves forward, n steps in total." },
        { text: "O(26 · n)", why: "That's the version that rescans all 26 counts each step. This one tracks `highest_count` incrementally." },
      ],
      explanation: "`right` and `left` each move at most n times.",
    },
    {
      kind: "choice",
      prompt: "`highest_count` never decreases, even when `left` moves. Why is that still correct?",
      solution: true,
      options: [
        { text: "A longer answer needs a higher top count, so a stale, too-high value only blocks windows that couldn't beat `best` anyway", correct: true },
        { text: "It's a bug that tests don't catch", why: "It's a known, deliberate shortcut. The answer can only improve when the top count really grows." },
        { text: "The top count really never drops when shrinking", why: "It can drop. We just don't need to notice, because a lower top count can't produce a longer window." },
      ],
      explanation: "The window size never shrinks below `best`. To beat `best`, some letter must truly appear more than the old maximum, and that does update `highest_count`.",
    },
    {
      kind: "choice",
      prompt: "Why is `count` a dictionary keyed by character?",
      options: [
        { text: "To know how many of each letter the window holds, so we can find the most common one", correct: true },
        { text: "To remember the last index of each letter", why: "That's Longest Substring Without Repeating Characters. Here we need counts, not positions." },
        { text: "To store the replaced characters", why: "Nothing is actually replaced. We only count what would need replacing." },
      ],
      explanation: "Window length minus the most common letter's count is the number of replacements needed.",
    },
    {
      kind: "choice",
      prompt: "Which window is valid when `k = 1`?",
      options: [
        { text: "`\"AABA\"`", correct: true },
        { text: "`\"ABAB\"`", why: "The top count is 2 and the length is 4, so it needs 2 replacements." },
        { text: "`\"ABC\"`", why: "The top count is 1 and the length is 3, so it needs 2 replacements." },
      ],
      explanation: "`\"AABA\"` has length 4 and three `A`s: 4 − 3 = 1 replacement, which is ≤ k.",
    },
  ],

  "permutation-in-string": [
    {
      kind: "type",
      prompt: "Fill in the letter's slot in the count array.",
      code: `
for character in s1:
    need[ord(character) - ___] += 1`,
      answers: ["97", "ord('a')", "ord(\"a\")"],
      explanation: "`ord(\"a\")` is 97, so subtracting it maps `a`..`z` to 0..25.",
    },
    {
      kind: "type",
      prompt: "Fill in when the window is too big and must drop a letter.",
      code: `
window[ord(character) - 97] += 1
if index ___ size:
    window[ord(s2[index - size]) - 97] -= 1`,
      answers: [">="],
      explanation: "After adding `s2[index]`, the window has `index + 1` letters. Once that exceeds `size` (i.e. `index >= size`), the oldest letter must go.",
      mistakes: [{ answers: [">"], why: "At `index == size` the window already holds size + 1 letters, so one must be removed then too." }],
    },
    {
      kind: "type",
      prompt: "Fill in the check that the window is a permutation of `s1`.",
      code: `
if window ___ need:
    return True`,
      answers: ["=="],
      explanation: "Two strings are permutations of each other exactly when their letter counts are equal.",
    },
    {
      kind: "type",
      prompt: "`s1 = \"ab\"`, `s2 = \"eidbaooo\"`. What is returned?",
      solution: true,
      answers: ["True"],
      explanation: "The window `\"ba\"` (indices 3-4) has the same letters as `\"ab\"`.",
    },
    {
      kind: "type",
      prompt: "`s1 = \"ab\"`, `s2 = \"eidboaoo\"`. What is returned?",
      solution: true,
      answers: ["False"],
      explanation: "`b` and `a` appear, but never next to each other, so no window of size 2 matches.",
      mistakes: [{ answers: ["True"], why: "Both letters are in `s2`, but they must be **contiguous**. `\"bo\"` and `\"oa\"` don't match." }],
    },
    {
      kind: "type",
      prompt: "`s1 = \"abc\"`, `s2 = \"ab\"`. What is returned?",
      solution: true,
      answers: ["False"],
      explanation: "`s1` is longer than `s2`, so the early return gives `False`.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity, with n = `len(s2)`?",
      solution: true,
      options: [
        { text: "O(n) (each step does a 26-slot comparison)", correct: true },
        { text: "O(n · m!) for m = `len(s1)`", why: "That's generating every permutation. Comparing counts avoids that entirely." },
        { text: "O(n log n)", why: "Nothing is sorted. Sorting each window would be O(n · m log m)." },
      ],
      explanation: "Each slide is O(1) to update and O(26) to compare, so it's linear in n.",
    },
    {
      kind: "choice",
      prompt: "Why use a fixed window of size `len(s1)`?",
      options: [
        { text: "A permutation of `s1` has exactly `len(s1)` letters", correct: true },
        { text: "Because `s2` is always longer", why: "That's checked, but it isn't why the window has that size." },
        { text: "Any window size works as long as counts match", why: "Counts can only match exactly when the sizes are equal." },
      ],
      explanation: "We're looking for a substring that is a rearrangement of `s1`, so it has the same length.",
    },
    {
      kind: "choice",
      prompt: "Why compare letter **counts** instead of sorting each window?",
      options: [
        { text: "Updating counts is O(1) per slide; sorting would be O(m log m) per window", correct: true },
        { text: "Sorting would give the wrong answer", why: "Sorted strings are equal exactly when they're permutations, so it would be correct, just slower." },
        { text: "Python can't sort strings", why: "`sorted(\"bca\")` works fine. The issue is the cost." },
      ],
      explanation: "Sliding changes only two letters, so the counts update in constant time.",
    },
    {
      kind: "choice",
      prompt: "Which problem uses exactly the same window, but collects every match instead of stopping?",
      options: [
        { text: "Find All Anagrams in a String", correct: true },
        { text: "Minimum Window Substring", why: "That window has variable size and only needs to *contain* `t`." },
        { text: "Longest Substring Without Repeating Characters", why: "That's a variable window looking for no repeats." },
      ],
      explanation: "Find All Anagrams slides the same fixed-size count window and records every start index where the counts match.",
    },
  ],

  "find-all-anagrams-in-a-string": [
    {
      kind: "type",
      prompt: "Fill in the start index recorded when the window matches.",
      code: `
if window == need:
    result.append(___)`,
      answers: ["index - size + 1"],
      explanation: "The window ends at `index` and has `size` letters, so it starts at `index - size + 1`.",
      mistakes: [
        { answers: ["index"], why: "That's where the window **ends**. The problem asks for start indices." },
        { answers: ["index - size"], why: "That's the letter that was just removed. The window starts one after it." },
      ],
    },
    {
      kind: "type",
      prompt: "Fill in the letter that falls out of the window.",
      code: `
if index >= size:
    window[ord(s[___]) - 97] -= 1`,
      answers: ["index - size"],
      explanation: "The window should be `index - size + 1 .. index`, so the letter at `index - size` leaves.",
    },
    {
      kind: "type",
      prompt: "How many slots does each count array have? Fill in the blank.",
      code: `
need = [0] * ___`,
      answers: ["26"],
      explanation: "The strings contain only lower-case English letters: 26 of them.",
    },
    {
      kind: "type",
      prompt: "`s = \"cbaebabacd\"`, `p = \"abc\"`. What is returned?",
      solution: true,
      answers: ["[0, 6]", "0, 6", "0 6"],
      explanation: "`\"cba\"` starts at 0 and `\"bac\"` starts at 6.",
    },
    {
      kind: "type",
      prompt: "`s = \"abab\"`, `p = \"ab\"`. What is returned?",
      solution: true,
      answers: ["[0, 1, 2]", "0, 1, 2", "0 1 2"],
      explanation: "`\"ab\"`, `\"ba\"` and `\"ab\"` start at 0, 1 and 2. Overlapping matches all count.",
      mistakes: [{ answers: ["[0, 2]", "0, 2", "0 2"], why: "`\"ba\"` at index 1 is an anagram too, and matches may overlap." }],
    },
    {
      kind: "type",
      prompt: "`s = \"aaa\"`, `p = \"aa\"`. How many start indices are returned?",
      solution: true,
      answers: ["2"],
      explanation: "Indices 0 and 1 both start an `\"aa\"`.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity, with n = `len(s)`?",
      solution: true,
      options: [
        { text: "O(n) (each step compares 26 counts)", correct: true },
        { text: "O(n · m log m) for m = `len(p)`", why: "That's sorting every window. Sliding counts avoids sorting." },
        { text: "O(n²)", why: "Each slide changes two counts. Nothing is rescanned." },
      ],
      explanation: "Each slide is an O(1) update plus a constant 26-slot comparison.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity (not counting the output)?",
      solution: true,
      options: [
        { text: "O(1): two arrays of 26", correct: true },
        { text: "O(n)", why: "The count arrays are fixed size, whatever the input length." },
        { text: "O(m) for m = `len(p)`", why: "We store counts per letter, not the letters of `p`." },
      ],
      explanation: "Two arrays of 26 integers, regardless of input size.",
    },
    {
      kind: "choice",
      prompt: "When is a window an anagram of `p`?",
      options: [
        { text: "When it has exactly the same count of every letter", correct: true },
        { text: "When it contains every letter of `p`", why: "For `p = \"aab\"`, the window `\"abb\"` contains both letters but isn't an anagram." },
        { text: "When its first and last letters match `p`'s", why: "Anagrams can be in any order, so positions don't matter." },
      ],
      explanation: "An anagram is a rearrangement, so the multiset of letters must be identical.",
    },
    {
      kind: "choice",
      prompt: "Why is the window size fixed here, while Minimum Window Substring's window changes size?",
      options: [
        { text: "An anagram must have exactly `len(p)` letters; a covering window can have extra letters", correct: true },
        { text: "Fixed windows are always faster", why: "Both are O(n). The size follows from what we're looking for." },
        { text: "Because `p` has no duplicate letters", why: "`p` can have duplicates. The count arrays handle them." },
      ],
      explanation: "\"Is a rearrangement of\" fixes the length. \"Contains\" doesn't, so that window grows and shrinks.",
    },
  ],

  "minimum-size-subarray-sum": [
    {
      kind: "type",
      prompt: "Fill in the condition for shrinking the window.",
      code: `
total += number
while total ___ target:
    best = min(best, right - left + 1)
    total -= nums[left]
    left += 1`,
      answers: [">="],
      explanation: "The sum only needs to be **at least** `target`. While it is, record the length and try a shorter window.",
      mistakes: [{ answers: [">"], why: "A sum exactly equal to `target` qualifies. With `>`, `target = 4`, `nums = [4]` would return 0." }],
    },
    {
      kind: "type",
      prompt: "Fill in the starting value for `best`.",
      code: `
best = ___`,
      answers: ["float(\"inf\")", "float('inf')", "math.inf", "inf"],
      explanation: "Any real window is shorter than infinity, so the first valid window always replaces it. At the end, infinity means \"none found\".",
      mistakes: [{ answers: ["0"], why: "`min(0, length)` would always stay 0, so every answer would be 0." }],
    },
    {
      kind: "type",
      prompt: "Fill in what is returned when no window reached the target.",
      code: `
return ___ if best == float("inf") else best`,
      answers: ["0"],
      explanation: "The problem says to return 0 when no subarray works.",
      mistakes: [{ answers: ["-1"], why: "The problem asks for 0, not -1." }],
    },
    {
      kind: "type",
      prompt: "`target = 7`, `nums = [2, 3, 1, 2, 4, 3]`. What is returned?",
      solution: true,
      answers: ["2"],
      explanation: "`[4, 3]` sums to 7 with length 2. No single value reaches 7.",
    },
    {
      kind: "type",
      prompt: "`target = 4`, `nums = [1, 4, 4]`. What is returned?",
      solution: true,
      answers: ["1"],
      explanation: "`[4]` alone already reaches the target.",
    },
    {
      kind: "type",
      prompt: "`target = 11`, `nums = [1, 1, 1, 1, 1, 1, 1, 1]`. What is returned?",
      solution: true,
      answers: ["0"],
      explanation: "The whole array sums to 8 < 11, so no window qualifies.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n²)", why: "The inner `while` only moves `left` forward. Over the whole run that's at most n steps." },
        { text: "O(n log n)", why: "That's the prefix-sum + binary search approach. This one is linear." },
      ],
      explanation: "Each value is added once by `right` and removed at most once by `left`.",
    },
    {
      kind: "choice",
      prompt: "Why does this window only work because all values are **positive**?",
      options: [
        { text: "Adding always raises the sum and removing always lowers it, so the shrink/grow decision is safe", correct: true },
        { text: "Negative values would make Python's `sum` fail", why: "`sum` handles negatives fine. The problem is the window logic." },
        { text: "It would work the same with negatives", why: "With negatives, shrinking could *raise* the sum, so we can't know which way to move." },
      ],
      explanation: "The sliding window depends on the sum changing in one direction as the window grows.",
    },
    {
      kind: "choice",
      prompt: "Why is the shrink step a `while`, not an `if`?",
      solution: true,
      options: [
        { text: "After removing one value the sum may still be ≥ target, and an even shorter window might work", correct: true },
        { text: "`if` would cause an infinite loop", why: "It wouldn't loop forever. It would just miss shorter windows." },
        { text: "It's just style", why: "`if` misses answers: with `[1, 1, 1, 100]`, `target = 100`, you must drop three values." },
      ],
      explanation: "A single big value can make several left values unnecessary at once.",
    },
    {
      kind: "choice",
      prompt: "What kind of window is this?",
      options: [
        { text: "Variable size: grow until valid, then shrink while still valid", correct: true },
        { text: "Fixed size k", why: "There's no k here. The window size is what we're minimising." },
        { text: "Two pointers from opposite ends", why: "Both pointers move left to right." },
      ],
      explanation: "This is the classic \"shortest valid window\" shape: record inside the shrink loop.",
    },
  ],

  "fruit-into-baskets": [
    {
      kind: "type",
      prompt: "Fill in the condition: too many fruit types in the window.",
      code: `
while len(count) ___ 2:`,
      answers: [">"],
      explanation: "Two baskets mean at most two types. Three types is too many.",
      mistakes: [{ answers: [">="], why: "Exactly two types is allowed, since we have two baskets." }],
    },
    {
      kind: "type",
      prompt: "Fill in the step that removes a type with no fruit left.",
      code: `
count[fruits[left]] -= 1
if count[fruits[left]] == 0:
    ___ count[fruits[left]]`,
      answers: ["del"],
      explanation: "`len(count)` counts the types, so a type at 0 must be deleted or it would still count.",
    },
    {
      kind: "type",
      prompt: "Fill in the window length.",
      code: `
best = max(best, ___)`,
      answers: ["right - left + 1"],
      explanation: "One fruit per tree, so the amount picked is the number of trees in `left .. right`.",
    },
    {
      kind: "type",
      prompt: "`fruits = [0, 1, 2, 2]`. What is returned?",
      solution: true,
      answers: ["3"],
      explanation: "Start at tree 1: `[1, 2, 2]` uses two types.",
    },
    {
      kind: "type",
      prompt: "`fruits = [1, 2, 3, 2, 2]`. What is returned?",
      solution: true,
      answers: ["4"],
      explanation: "Start at tree 1: `[2, 3, 2, 2]` uses two types.",
    },
    {
      kind: "type",
      prompt: "`fruits = [1, 2, 1]`. What is returned?",
      solution: true,
      answers: ["3"],
      explanation: "Only two types exist, so all three trees can be picked.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n²)", why: "`left` only moves forward, so the inner loop runs at most n times in total." },
        { text: "O(n log n)", why: "No sorting or heaps. Dictionary updates are O(1)." },
      ],
      explanation: "Both window ends move at most n times.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(1): the dictionary holds at most 3 keys", correct: true },
        { text: "O(n)", why: "The window is shrunk as soon as a third type appears, so `count` never grows beyond 3 keys." },
        { text: "O(k) for k fruit types", why: "There can be many types overall, but at most 3 are in the window at once." },
      ],
      explanation: "The dictionary is trimmed as soon as it holds a third type.",
    },
    {
      kind: "choice",
      prompt: "What is this problem really asking, once the story is stripped away?",
      options: [
        { text: "The longest subarray with at most 2 distinct values", correct: true },
        { text: "The two most frequent values", why: "The trees must be contiguous. Frequency across the whole array doesn't matter." },
        { text: "The longest subarray of one value", why: "Two baskets allow two different values." },
      ],
      explanation: "Recognising \"at most K distinct values\" makes the variable-size window obvious.",
    },
    {
      kind: "choice",
      prompt: "Why must `count` store counts rather than just a set of types?",
      solution: true,
      options: [
        { text: "When `left` moves, we need to know if the last fruit of that type left the window", correct: true },
        { text: "Sets can't hold integers", why: "Sets can hold integers. The issue is knowing when a type is gone." },
        { text: "To find the most common fruit", why: "The most common fruit isn't needed. Only how many types there are." },
      ],
      explanation: "A type leaves the window only when its count reaches 0, and a set can't track that.",
    },
  ],

  "max-consecutive-ones-iii": [
    {
      kind: "type",
      prompt: "Fill in the condition: the window needs too many flips.",
      code: `
while zeros ___ k:`,
      answers: [">"],
      explanation: "We may flip up to k zeros, so the window is invalid only with **more** than k.",
      mistakes: [{ answers: [">="], why: "Exactly k zeros is allowed: we flip all of them." }],
    },
    {
      kind: "type",
      prompt: "Fill in the value that, when it leaves the window, lowers `zeros`.",
      code: `
while zeros > k:
    if nums[left] == ___:
        zeros -= 1
    left += 1`,
      answers: ["0"],
      explanation: "Only a zero leaving the window frees up a flip.",
    },
    {
      kind: "type",
      prompt: "`nums = [1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0]`, `k = 2`. What is returned?",
      solution: true,
      answers: ["6"],
      explanation: "Flip the zeros at indices 4 and 5: `[0, 0, 1, 1, 1, 1]` → indices 4..9 become six 1s.",
    },
    {
      kind: "type",
      prompt: "`nums = [0, 0, 0]`, `k = 0`. What is returned?",
      solution: true,
      answers: ["0"],
      explanation: "No flips are allowed and there are no 1s.",
    },
    {
      kind: "type",
      prompt: "`nums = [0, 1, 0, 1]`, `k = 1`. What is returned?",
      solution: true,
      answers: ["3"],
      explanation: "Flip one zero: `[1, 1, 0, 1]` or `[0, 1, 1, 1]`, giving a run of 3.",
    },
    {
      kind: "type",
      prompt: "Fill in the window length.",
      code: `
best = max(best, ___)`,
      answers: ["right - left + 1"],
      explanation: "The window `left .. right` holds at most k zeros, so all of it can become 1s.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n · k)", why: "k only limits zeros in the window. It doesn't add work per step." },
        { text: "O(n²)", why: "`left` only moves forward. The inner loop totals at most n steps." },
      ],
      explanation: "Both ends of the window move at most n times.",
    },
    {
      kind: "choice",
      prompt: "How can you restate this problem?",
      options: [
        { text: "Longest subarray containing at most k zeros", correct: true },
        { text: "Longest subarray with exactly k zeros", why: "Using fewer flips is allowed, e.g. when the array has fewer than k zeros." },
        { text: "Count the 1s and add k", why: "The 1s must be consecutive, and there may be fewer than k zeros to flip." },
      ],
      explanation: "Every zero in the window gets flipped, so the window is valid when it has ≤ k zeros.",
    },
    {
      kind: "choice",
      prompt: "Do we actually change any values in `nums`?",
      solution: true,
      options: [
        { text: "No, we only count zeros in the window", correct: true },
        { text: "Yes, zeros are set to 1 when flipped", why: "Nothing writes to `nums`. Counting is enough to know the window is fixable." },
        { text: "Yes, but they're restored afterwards", why: "Nothing is ever written." },
      ],
      explanation: "We only need the length of the best window, not the flipped array.",
    },
    {
      kind: "choice",
      prompt: "Which problem has the same \"at most k bad items in the window\" shape?",
      options: [
        { text: "Longest Repeating Character Replacement", correct: true },
        { text: "Maximum Average Subarray I", why: "That window has a fixed size k." },
        { text: "Find All Anagrams in a String", why: "That window has a fixed size and compares counts." },
      ],
      explanation: "There, the \"bad\" characters are the ones that aren't the window's most common letter.",
    },
  ],

  "minimum-window-substring": [
    {
      kind: "type",
      prompt: "Fill in the moment a character meets its requirement.",
      code: `
window[character] = window.get(character, 0) + 1
if character in need and window[character] ___ need[character]:
    have += 1`,
      answers: ["=="],
      explanation: "`have` counts characters whose requirement is met. It goes up exactly once, when the count first **reaches** what's needed.",
      mistakes: [{ answers: [">="], why: "Extra copies would keep adding to `have`, so `have` could reach `required` too early." }],
    },
    {
      kind: "type",
      prompt: "Fill in the moment removing a character breaks a requirement.",
      code: `
window[leaving] -= 1
if leaving in need and window[leaving] ___ need[leaving]:
    have -= 1`,
      answers: ["<"],
      explanation: "The requirement breaks only when the count drops **below** what's needed.",
      mistakes: [{ answers: ["<="], why: "Dropping from need + 1 to need still meets the requirement, so `have` shouldn't change." }],
    },
    {
      kind: "type",
      prompt: "Fill in the condition for shrinking the window.",
      code: `
while have ___ required:`,
      answers: ["=="],
      explanation: "When every distinct character of `t` is covered, the window is valid: record it and try to shrink.",
    },
    {
      kind: "type",
      prompt: "`s = \"ADOBECODEBANC\"`, `t = \"ABC\"`. What is returned?",
      solution: true,
      answers: ["BANC"],
      explanation: "`\"BANC\"` (length 4) contains A, B and C, and no shorter window does.",
    },
    {
      kind: "type",
      prompt: "`s = \"a\"`, `t = \"aa\"`. What is returned? (type `\"\"` for empty)",
      solution: true,
      answers: ["\"\"", "''", "empty"],
      explanation: "`t` needs two `a`s, and `s` has only one.",
      mistakes: [{ answers: ["a"], why: "Duplicates count: `t = \"aa\"` needs two `a`s." }],
    },
    {
      kind: "type",
      prompt: "Fill in the number of distinct characters required.",
      code: `
need = Counter(t)
have, required = 0, ___`,
      answers: ["len(need)"],
      explanation: "`have` counts satisfied **distinct** characters, so the target is the number of keys in `need`.",
      mistakes: [{ answers: ["len(t)"], why: "`have` goes up once per distinct character, not once per letter. For `t = \"aa\"` that's 1, not 2." }],
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(|s| + |t|)", correct: true },
        { text: "O(|s| · |t|)", why: "That's re-checking all of `t` per window. `have` makes the check O(1)." },
        { text: "O(|s|²)", why: "`left` only moves forward, so the two pointers do at most 2|s| steps." },
      ],
      explanation: "Counting `t` is O(|t|), and each character of `s` enters and leaves the window at most once.",
    },
    {
      kind: "choice",
      prompt: "Why track `have` instead of comparing the whole `window` with `need` each step?",
      options: [
        { text: "It makes \"is the window valid?\" an O(1) check", correct: true },
        { text: "Dictionaries can't be compared", why: "They can be compared. It's just O(alphabet) each time." },
        { text: "Comparing would give wrong answers with duplicates", why: "A correct \"contains\" comparison would work. It's about speed." },
      ],
      explanation: "`have` is updated only when a requirement flips between met and unmet.",
    },
    {
      kind: "choice",
      prompt: "Where is the best window recorded?",
      solution: true,
      options: [
        { text: "Inside the shrink loop, while the window is still valid", correct: true },
        { text: "After the shrink loop ends", why: "By then the window is invalid, because the loop stops right after breaking a requirement." },
        { text: "Only when the window grows", why: "Growing can't make a window shorter. Shrinking finds the minimum." },
      ],
      explanation: "Each valid window is recorded before its leftmost character is removed.",
    },
    {
      kind: "choice",
      prompt: "Why store the best window as `(length, start, end)` instead of the substring itself?",
      solution: true,
      options: [
        { text: "Slicing a string each time would cost O(length); indices are O(1) to store", correct: true },
        { text: "Strings can't be stored in tuples", why: "They can. Storing indices just avoids copying." },
        { text: "So we can return the length too", why: "Only the substring is returned. The length is used to compare windows." },
      ],
      explanation: "The substring is sliced once at the end, from the best indices.",
    },
  ],
});
