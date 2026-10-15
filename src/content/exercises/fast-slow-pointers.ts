import { defineExercises } from "./types";

export default defineExercises({
  "linked-list-cycle": [
    {
      kind: "type",
      prompt: "Fill in the loop condition so `fast` never steps past the end.",
      code: `
slow = fast = head
while fast and ___:
    slow = slow.next
    fast = fast.next.next`,
      answers: ["fast.next"],
      explanation: "`fast` jumps two nodes, so both `fast` and `fast.next` must exist before reading `fast.next.next`.",
      mistakes: [{ answers: ["slow"], why: "`slow` is behind `fast`, so it's never the one that falls off. The danger is `fast.next` being `None`." }],
    },
    {
      kind: "type",
      prompt: "Fill in how far `fast` moves each step.",
      code: `
slow = slow.next
fast = ___`,
      answers: ["fast.next.next"],
      explanation: "`fast` moves two nodes for every one `slow` moves, so inside a cycle it gains one node per step.",
    },
    {
      kind: "type",
      prompt: "Fill in the identity check.",
      code: `
if slow ___ fast:
    return True`,
      answers: ["is", "=="],
      explanation: "We need the **same node object**, not just equal values. `is` compares identity. `==` also works here because `ListNode` has no custom `__eq__`, but `is` states the intent.",
    },
    {
      kind: "type",
      prompt: "`head = [3, 2, 0, -4]`, and the tail links back to index 1. What is returned?",
      solution: true,
      answers: ["True"],
      explanation: "-4 → 2 forms a cycle, so `fast` eventually laps `slow`.",
    },
    {
      kind: "type",
      prompt: "`head = [1]` with no cycle. What is returned?",
      solution: true,
      answers: ["False"],
      explanation: "`fast.next` is `None`, so the loop never runs.",
    },
    {
      kind: "type",
      prompt: "`head = None` (empty list). What is returned?",
      solution: true,
      answers: ["False"],
      explanation: "`fast` is `None`, so the loop condition fails immediately.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n²)", why: "Inside the cycle, the gap between the runners shrinks by 1 each step, so they meet within one lap." },
        { text: "O(log n)", why: "Nothing is halved; the runners walk the list." },
      ],
      explanation: "Without a cycle, `fast` reaches the end in n/2 steps. With one, `slow` enters it and is caught within one lap.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(1)", correct: true },
        { text: "O(n)", why: "That's the hash-set version that remembers visited nodes. Two pointers need no set." },
        { text: "O(log n)", why: "There's no recursion." },
      ],
      explanation: "Two pointers, no matter how long the list is.",
    },
    {
      kind: "choice",
      prompt: "Why are the two runners guaranteed to meet inside a cycle?",
      options: [
        { text: "Each step, `fast` closes the gap by exactly 1, so it can't jump over `slow`", correct: true },
        { text: "Because the cycle length is even", why: "The cycle can have any length." },
        { text: "They might not; it depends on luck", why: "It's guaranteed: a gap that shrinks by 1 must reach 0." },
      ],
      explanation: "Relative to `slow`, `fast` moves 1 node per step, so the gap goes d, d−1, …, 0.",
    },
    {
      kind: "choice",
      prompt: "What would a hash-set solution do differently?",
      options: [
        { text: "Store every visited node and stop when one repeats: O(n) extra memory", correct: true },
        { text: "It would be O(n²)", why: "Set lookups are O(1), so it's still O(n) time." },
        { text: "It couldn't detect cycles", why: "It can: a node seen twice means a cycle." },
      ],
      explanation: "Floyd's two pointers give the same answer with O(1) memory.",
    },
  ],

  "middle-of-the-linked-list": [
    {
      kind: "type",
      prompt: "Fill in what is returned.",
      code: `
while fast and fast.next:
    slow = slow.next
    fast = fast.next.next
return ___`,
      answers: ["slow"],
      explanation: "`fast` covered twice the distance, so when it reaches the end `slow` is halfway.",
    },
    {
      kind: "type",
      prompt: "Fill in where both runners start.",
      code: `
slow = fast = ___`,
      answers: ["head"],
      explanation: "Starting both at `head` makes `slow` land on the **second** middle for even lengths, as the problem asks.",
      mistakes: [{ answers: ["head.next"], why: "Starting both one node later would shift the answer for odd lengths too." }],
    },
    {
      kind: "type",
      prompt: "`head = [1, 2, 3, 4, 5]`. What is the value of the returned node?",
      solution: true,
      answers: ["3"],
      explanation: "Five nodes, so the middle is the third.",
    },
    {
      kind: "type",
      prompt: "`head = [1, 2, 3, 4, 5, 6]`. What is the value of the returned node?",
      solution: true,
      answers: ["4"],
      explanation: "The two middles are 3 and 4. The problem wants the second one.",
      mistakes: [{ answers: ["3"], why: "3 is the first middle. With both runners starting at `head`, `slow` ends on the second." }],
    },
    {
      kind: "type",
      prompt: "`head = [1]`. What is the value of the returned node?",
      solution: true,
      answers: ["1"],
      explanation: "`fast.next` is `None`, so `slow` stays at the head.",
    },
    {
      kind: "type",
      prompt: "For `[1, 2, 3, 4, 5]`, how many times does the loop body run?",
      solution: true,
      answers: ["2"],
      explanation: "fast: 1 → 3 → 5. At 5, `fast.next` is `None`, so the loop stops after 2 steps (slow: 1 → 2 → 3).",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n / 2), which is better than O(n)", why: "Constant factors are dropped: n/2 steps is still O(n)." },
        { text: "O(log n)", why: "We walk the list; nothing is halved repeatedly." },
      ],
      explanation: "`fast` walks the whole list two nodes at a time: about n/2 steps, which is O(n).",
    },
    {
      kind: "choice",
      prompt: "What's the benefit over counting the nodes first, then walking to `count // 2`?",
      options: [
        { text: "One pass instead of two; both are O(n) time and O(1) space", correct: true },
        { text: "Better big-O", why: "Both are O(n). The runner version just avoids a second pass." },
        { text: "Counting can't find the second middle", why: "Walking `count // 2` steps from the head gives exactly the second middle." },
      ],
      explanation: "The fast/slow trick finds the middle without knowing the length.",
    },
    {
      kind: "choice",
      prompt: "How would you get the **first** middle for even lengths instead?",
      options: [
        { text: "Start `fast` at `head.next`", correct: true },
        { text: "Start `slow` at `head.next`", why: "That moves `slow` further ahead, toward the second middle and beyond." },
        { text: "Use `while fast.next.next`", why: "That crashes when `fast.next` is `None`." },
      ],
      explanation: "Giving `fast` a one-node head start makes the loop stop one step earlier. Sort List uses this to split.",
    },
    {
      kind: "choice",
      prompt: "Which problems reuse this middle-finding loop?",
      options: [
        { text: "Reorder List, and Sort List (with `fast` starting one node ahead)", correct: true },
        { text: "Partition List", why: "Partition List walks once with two tails, without finding a middle." },
        { text: "Happy Number", why: "Happy Number uses fast/slow for cycle detection, not to find a middle." },
      ],
      explanation: "Both split the list in half before working on each half.",
    },
  ],

  "linked-list-cycle-ii": [
    {
      kind: "type",
      prompt: "Fill in where `slow` restarts after the runners meet.",
      code: `
if slow is fast:
    slow = ___
    while slow is not fast:
        slow = slow.next
        fast = fast.next
    return slow`,
      answers: ["head"],
      explanation: "The head and the meeting point are the same distance from the cycle's start, so walking both one step at a time meets there.",
    },
    {
      kind: "type",
      prompt: "In phase 2, how many nodes does `fast` move per step?",
      code: `
while slow is not fast:
    slow = slow.next
    fast = ___`,
      answers: ["fast.next"],
      explanation: "Both move one step now. The equal-distance argument only works at the same speed.",
      mistakes: [{ answers: ["fast.next.next"], why: "At double speed they'd no longer arrive at the cycle start together." }],
    },
    {
      kind: "type",
      prompt: "`head = [3, 2, 0, -4]`, the tail links to index 1. What is the value of the returned node?",
      solution: true,
      answers: ["2"],
      explanation: "The cycle starts at index 1, which holds 2.",
    },
    {
      kind: "type",
      prompt: "`head = [1, 2]`, the tail links to index 0. What is the value of the returned node?",
      solution: true,
      answers: ["1"],
      explanation: "The whole list is the cycle, so it starts at the head.",
    },
    {
      kind: "type",
      prompt: "`head = [1]`, no cycle. What is returned?",
      solution: true,
      answers: ["None"],
      explanation: "The runners never meet, so the function returns `None`.",
    },
    {
      kind: "type",
      prompt: "Fill in the loop condition.",
      code: `
while fast and ___:`,
      answers: ["fast.next"],
      explanation: "Same guard as in Linked List Cycle: `fast` needs two nodes ahead.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n²)", why: "Each phase walks at most a few laps of the list, never one walk per node." },
        { text: "O(n log n)", why: "There's no sorting or halving." },
      ],
      explanation: "Phase 1 meets within O(n) steps, and phase 2 walks at most the tail length.",
    },
    {
      kind: "choice",
      prompt: "Let a = distance from head to cycle start, b = distance from cycle start to the meeting point, c = cycle length. Why does phase 2 work?",
      options: [
        { text: "`fast` went twice as far, which gives a = (multiple of c) − b: from the meeting point, a steps lands on the start", correct: true },
        { text: "Because a always equals b", why: "a and b can differ. a is congruent to −b modulo the cycle length." },
        { text: "Because the meeting point is always the cycle start", why: "The runners usually meet somewhere inside the cycle, not at its start." },
      ],
      explanation: "2(a + b) = a + b + k·c ⇒ a = k·c − b. Walking a steps from the meeting point completes the lap back to the start.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(1)", correct: true },
        { text: "O(n)", why: "That's the visited-set approach. Floyd's needs only two pointers." },
        { text: "O(c), where c is the cycle length", why: "Nothing about the cycle is stored." },
      ],
      explanation: "Just two pointers.",
    },
    {
      kind: "choice",
      prompt: "Which other problem uses this exact two-phase trick on an array?",
      options: [
        { text: "Find the Duplicate Number", correct: true },
        { text: "Middle of the Linked List", why: "That has no cycle and only one phase." },
        { text: "Partition List", why: "Partition doesn't involve cycles." },
      ],
      explanation: "Treating `nums[i]` as a `next` pointer turns the duplicate into the start of a cycle.",
    },
  ],

  "find-the-duplicate-number": [
    {
      kind: "type",
      prompt: "Fill in how `fast` moves.",
      code: `
slow = nums[slow]
fast = ___`,
      answers: ["nums[nums[fast]]"],
      explanation: "Each value is a \"next\" pointer, so following it twice moves two steps.",
    },
    {
      kind: "type",
      prompt: "Fill in where `slow` restarts for phase 2.",
      code: `
slow = ___
while slow != fast:
    slow = nums[slow]
    fast = nums[fast]`,
      answers: ["0"],
      explanation: "Index 0 is the \"head\": no value points to it, because values are in `[1, n]`.",
    },
    {
      kind: "type",
      prompt: "`nums = [1, 3, 4, 2, 2]`. What is returned?",
      solution: true,
      answers: ["2"],
      explanation: "Two indices (3 and 4) both point to index 2, so 2 is where the cycle starts.",
    },
    {
      kind: "type",
      prompt: "`nums = [3, 1, 3, 4, 2]`. What is returned?",
      solution: true,
      answers: ["3"],
      explanation: "Indices 0 and 2 both hold 3, so two arrows point at index 3.",
    },
    {
      kind: "type",
      prompt: "`nums = [2, 2, 2, 2]`. What is returned?",
      solution: true,
      answers: ["2"],
      explanation: "The duplicate can appear more than twice. Here every arrow points at index 2.",
    },
    {
      kind: "type",
      prompt: "Starting at index 0 of `[1, 3, 4, 2, 2]` and following values as pointers, which index comes after index 1?",
      answers: ["3"],
      explanation: "`nums[1] = 3`, so index 1 points to index 3. The path is 0 → 1 → 3 → 2 → 4 → 2 → …",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n log n)", why: "That's sorting a copy, or binary searching on value counts. This is linear." },
        { text: "O(n²)", why: "That's comparing every pair." },
      ],
      explanation: "Both phases are O(n), as in Linked List Cycle II.",
    },
    {
      kind: "choice",
      prompt: "Why does a duplicate value create a cycle?",
      options: [
        { text: "Two indices point to the same index, so the path entering it was already walked", correct: true },
        { text: "Because the array is sorted", why: "It isn't sorted." },
        { text: "Because the duplicate points to itself", why: "Not necessarily: in `[1, 3, 4, 2, 2]`, index 2 holds 4." },
      ],
      explanation: "Values are in `[1, n]` and there are n + 1 slots, so the walk from 0 must eventually revisit an index. The node with two incoming arrows is the cycle's entrance.",
    },
    {
      kind: "choice",
      prompt: "Which constraint rules out the easy solutions (sorting, or a set)?",
      options: [
        { text: "Don't modify `nums` and use only O(1) extra space", correct: true },
        { text: "The array has n + 1 elements", why: "That's what guarantees a duplicate exists, not what rules out the easy solutions." },
        { text: "Values are in [1, n]", why: "That's what makes the pointer interpretation valid." },
      ],
      explanation: "Sorting modifies the array, and a set uses O(n) space. Floyd's avoids both.",
    },
    {
      kind: "choice",
      prompt: "Why must values be in `[1, n]` for this trick?",
      options: [
        { text: "Every value is a valid index, and nothing points back to index 0, so 0 is outside the cycle", correct: true },
        { text: "So the sum formula works", why: "That's a different approach, and it fails when the duplicate repeats more than twice." },
        { text: "It isn't needed", why: "A value of 0 or above n would break the \"value = pointer\" idea." },
      ],
      explanation: "Index 0 acts as the list's head, leading into the cycle.",
    },
  ],

  "happy-number": [
    {
      kind: "type",
      prompt: "Fill in the function that splits off the last digit.",
      code: `
number, digit = ___(number, 10)`,
      answers: ["divmod"],
      explanation: "`divmod(number, 10)` returns `(number // 10, number % 10)`: the rest and the last digit.",
    },
    {
      kind: "type",
      prompt: "What is `step(19)`, i.e. 1² + 9²?",
      answers: ["82"],
      explanation: "1 + 81 = 82.",
    },
    {
      kind: "type",
      prompt: "Fill in the condition that makes `n` happy.",
      code: `
while fast != 1 and slow != fast:
    slow = step(slow)
    fast = step(step(fast))
return fast ___ 1`,
      answers: ["=="],
      explanation: "The loop stops either at 1 (happy) or when the runners meet in a loop that doesn't contain 1.",
    },
    {
      kind: "type",
      prompt: "`n = 19`. What is returned?",
      solution: true,
      answers: ["True"],
      explanation: "19 → 82 → 68 → 100 → 1.",
    },
    {
      kind: "type",
      prompt: "`n = 2`. What is returned?",
      solution: true,
      answers: ["False"],
      explanation: "2 → 4 → 16 → 37 → 58 → 89 → 145 → 42 → 20 → 4 → … It loops without reaching 1.",
    },
    {
      kind: "type",
      prompt: "`n = 7`. What is returned?",
      solution: true,
      answers: ["True"],
      explanation: "7 → 49 → 97 → 130 → 10 → 1.",
    },
    {
      kind: "choice",
      prompt: "What is the cost of one `step(n)`?",
      solution: true,
      options: [
        { text: "O(log n): one iteration per digit", correct: true },
        { text: "O(n)", why: "We loop over the digits, and a number has about log₁₀ n of them." },
        { text: "O(1)", why: "The number of digits grows with n, slowly." },
      ],
      explanation: "A number n has ⌊log₁₀ n⌋ + 1 digits.",
    },
    {
      kind: "choice",
      prompt: "Why is cycle detection needed at all?",
      options: [
        { text: "An unhappy number repeats forever, so a plain loop would never stop", correct: true },
        { text: "The numbers grow without limit", why: "They shrink quickly: a big number's digit-square sum is much smaller than the number itself." },
        { text: "To make it faster for happy numbers", why: "Happy numbers reach 1 and stop anyway. Cycle detection is for unhappy ones." },
      ],
      explanation: "The sequence is a linked list of numbers, and an unhappy number enters a cycle.",
    },
    {
      kind: "choice",
      prompt: "What's the trade-off of Floyd's runners versus a `seen` set here?",
      options: [
        { text: "Same answer; the runners use O(1) memory instead of O(cycle length)", correct: true },
        { text: "The set gives wrong answers", why: "A set is perfectly correct. It just stores the numbers it has seen." },
        { text: "The runners are asymptotically faster", why: "Both take time proportional to the sequence length before it repeats." },
      ],
      explanation: "For this problem the sequences are short, so either is fine. Floyd's is the memory-free option.",
    },
    {
      kind: "choice",
      prompt: "Why does `fast` start at `step(n)` instead of `n`?",
      solution: true,
      options: [
        { text: "Otherwise `slow != fast` is false right away and the loop never runs", correct: true },
        { text: "To skip numbers that are already 1", why: "The point is the loop condition. With `slow == fast` it would exit immediately." },
        { text: "It's required by Floyd's algorithm", why: "Floyd's usually starts both together. Here the condition `slow != fast` forces the offset." },
      ],
      explanation: "Starting one step apart keeps `slow != fast` true at the start.",
    },
  ],

  "circular-array-loop": [
    {
      kind: "type",
      prompt: "Fill in the operator that wraps the jump around the array.",
      code: `
def next_index(index: int) -> int:
    return (index + nums[index]) ___ length`,
      answers: ["%"],
      explanation: "In Python, `%` with a positive `length` always gives `0..length-1`, even for negative jumps.",
    },
    {
      kind: "type",
      prompt: "Fill in the value used to mark an index as \"proven not in a loop\".",
      code: `
if nums[start] == ___:
    continue`,
      answers: ["0"],
      explanation: "Jumps are never 0 in valid input, so 0 is free to use as a marker.",
    },
    {
      kind: "type",
      prompt: "`nums = [2, -1, 1, 2, 2]`. What is returned?",
      solution: true,
      answers: ["True"],
      explanation: "0 → 2 → 3 → 0 is a forward loop of length 3.",
    },
    {
      kind: "type",
      prompt: "`nums = [-1, -2, -3, -4, -5, 6]`. What is returned?",
      solution: true,
      answers: ["False"],
      explanation: "The backward jumps never form a loop of length > 1, and index 5's forward jump lands on itself (a self-loop).",
    },
    {
      kind: "type",
      prompt: "`nums = [2, 2]`. What is returned?",
      solution: true,
      answers: ["False"],
      explanation: "Each index jumps 2 in a length-2 array, landing on itself. Self-loops don't count.",
      mistakes: [{ answers: ["True"], why: "Each index lands back on itself: (i + 2) % 2 = i. A loop must have length > 1." }],
    },
    {
      kind: "type",
      prompt: "`nums = [1, 1]`. What is returned?",
      solution: true,
      answers: ["True"],
      explanation: "0 → 1 → 0, a forward loop of length 2.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n²)", why: "That's without the 0-marking. Marked indices are skipped, so each index is walked only a constant number of times." },
        { text: "O(n log n)", why: "There's no sorting or halving." },
      ],
      explanation: "Every failed walk marks its path with 0, so no index is explored twice.",
    },
    {
      kind: "choice",
      prompt: "Why must every jump in the loop go in the same direction?",
      options: [
        { text: "The problem requires it: a valid cycle is all-forward or all-backward", correct: true },
        { text: "Mixed directions can't form cycles", why: "They can, e.g. `[1, -1]`. The problem just doesn't count them." },
        { text: "So `%` works", why: "`%` handles both directions. The rule comes from the problem statement." },
      ],
      explanation: "That's why `fast` stops as soon as a hop changes sign.",
    },
    {
      kind: "choice",
      prompt: "Why check `slow != next_index(slow)` when the runners meet?",
      solution: true,
      options: [
        { text: "To reject a length-1 loop (an index that jumps to itself)", correct: true },
        { text: "To check the direction", why: "Direction is checked on every hop already." },
        { text: "To avoid an infinite loop", why: "It's about validity: self-loops don't count as cycles." },
      ],
      explanation: "If the meeting index jumps to itself, the \"cycle\" has length 1, which is invalid.",
    },
    {
      kind: "choice",
      prompt: "What does writing 0 into `nums` cost you?",
      options: [
        { text: "The input array is modified", correct: true },
        { text: "Extra memory", why: "It reuses the input, so no extra memory is needed." },
        { text: "Correctness", why: "Indices on a dead-end path can never be part of a valid loop, so marking them is safe." },
      ],
      explanation: "It's a common in-place trick. If the input must be preserved, use a separate visited array (O(n) space).",
    },
  ],

  "sort-list": [
    {
      kind: "type",
      prompt: "Fill in where `fast` starts so `slow` stops at the end of the first half.",
      code: `
slow, fast = head, ___
while fast and fast.next:
    slow = slow.next
    fast = fast.next.next`,
      answers: ["head.next"],
      explanation: "With a one-node head start, `slow` ends on the **first** middle. For two nodes, the halves are then 1 and 1.",
      mistakes: [{ answers: ["head"], why: "With 2 nodes, `slow` would end on the second node, so the second half would be empty and recursion on the first half would never shrink it." }],
    },
    {
      kind: "type",
      prompt: "Fill in the line that cuts the list into two halves.",
      code: `
second = slow.next
___ = None`,
      answers: ["slow.next"],
      explanation: "The first half ends at `slow`, so its `next` must be cut.",
    },
    {
      kind: "type",
      prompt: "Fill in what is attached after one half runs out.",
      code: `
tail.next = ___`,
      answers: ["left or right"],
      explanation: "One half is empty and the other is already sorted, so attach whichever one is left.",
    },
    {
      kind: "type",
      prompt: "`head = [4, 2, 1, 3]`. What does the first half contain right after the first split?",
      solution: true,
      answers: ["[4, 2]", "4, 2", "4 2"],
      explanation: "`slow` stops at 2 (the first middle), so the halves are `[4, 2]` and `[1, 3]`.",
    },
    {
      kind: "type",
      prompt: "`head = [-1, 5, 3, 4, 0]`. What is the sorted result?",
      solution: true,
      answers: ["[-1, 0, 3, 4, 5]", "-1, 0, 3, 4, 5", "-1 0 3 4 5"],
      explanation: "Merge sort returns all values in ascending order.",
    },
    {
      kind: "type",
      prompt: "Fill in the base case.",
      code: `
if not head or not ___:
    return head`,
      answers: ["head.next"],
      explanation: "Zero or one node is already sorted.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n log n)", correct: true },
        { text: "O(n²)", why: "That's insertion sort on a list. Merge sort halves the problem each level." },
        { text: "O(n)", why: "Comparison sorting can't beat O(n log n) in general." },
      ],
      explanation: "log n levels of splitting, with O(n) merge work per level.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity of this recursive version?",
      solution: true,
      options: [
        { text: "O(log n) for the recursion stack", correct: true },
        { text: "O(n) for copying nodes", why: "No nodes are copied; links are rewired." },
        { text: "O(1)", why: "That needs the bottom-up iterative merge sort. Recursion uses the stack." },
      ],
      explanation: "The recursion depth is log n, and merging just relinks existing nodes.",
    },
    {
      kind: "choice",
      prompt: "Why merge sort rather than quicksort for a linked list?",
      options: [
        { text: "Merging lists needs no extra arrays or random access, and it's always O(n log n)", correct: true },
        { text: "Quicksort can't sort linked lists", why: "It can, but bad pivots give O(n²), and partitioning lists is clumsier." },
        { text: "Merge sort is in-place on arrays", why: "On arrays it needs O(n) extra space. On lists, relinking makes merging cheap." },
      ],
      explanation: "Lists lack random access, which merge sort doesn't need.",
    },
    {
      kind: "choice",
      prompt: "Why does the merge use a `dummy` node?",
      solution: true,
      options: [
        { text: "So the first node is appended like any other, with no special case for the head", correct: true },
        { text: "To store the minimum value", why: "The dummy's value is never used." },
        { text: "To prevent cycles", why: "It's about avoiding a special case for the first node." },
      ],
      explanation: "`dummy.next` is the real head at the end.",
    },
  ],

  "reorder-list": [
    {
      kind: "type",
      prompt: "Fill in where the second half starts.",
      code: `
previous, current = None, ___
slow.next = None`,
      answers: ["slow.next"],
      explanation: "`slow` ends in the middle, which stays in the first half. The second half starts right after it.",
    },
    {
      kind: "type",
      prompt: "Fill in the merge step: after `first`, put the `second` node.",
      code: `
first_next, second_next = first.next, second.next
first.next = second
second.next = ___`,
      answers: ["first_next"],
      explanation: "The pattern is first → second → (rest of the first half).",
    },
    {
      kind: "type",
      prompt: "`head = [1, 2, 3, 4]`. What is the list after reordering?",
      solution: true,
      answers: ["[1, 4, 2, 3]", "1, 4, 2, 3", "1 4 2 3"],
      explanation: "`slow` stops at 3, so the halves are `[1, 2, 3]` and `[4]`. Interleave: 1, 4, 2, then 3 stays at the end.",
    },
    {
      kind: "type",
      prompt: "`head = [1, 2, 3, 4, 5]`. What is the list after reordering?",
      solution: true,
      answers: ["[1, 5, 2, 4, 3]", "1, 5, 2, 4, 3", "1 5 2 4 3"],
      explanation: "Halves `[1, 2, 3]` and `[4, 5]`; reversed second `[5, 4]`; interleave: 1, 5, 2, 4, 3.",
    },
    {
      kind: "type",
      prompt: "`head = [1, 2, 3, 4, 5]`. What is the value of `slow` after the middle-finding loop?",
      solution: true,
      answers: ["3"],
      explanation: "`slow` and `fast` both start at the head, so `slow` stops at the middle, 3.",
    },
    {
      kind: "type",
      prompt: "Fill in the loop condition of the merge.",
      code: `
first, second = head, previous
while ___:`,
      answers: ["second"],
      explanation: "The second half is never longer than the first, so we stop when it runs out.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n²)", why: "That's repeatedly walking to the tail. The three linear steps avoid it." },
        { text: "O(n log n)", why: "Nothing is sorted or recursively split." },
      ],
      explanation: "Find the middle, reverse half, merge: three O(n) passes.",
    },
    {
      kind: "choice",
      prompt: "What are the three steps?",
      options: [
        { text: "Find the middle, reverse the second half, merge the halves alternately", correct: true },
        { text: "Reverse the whole list, then merge it with the original", why: "Reversing in place destroys the original, so there'd be nothing to merge with." },
        { text: "Sort the list, then split it", why: "Order is by position, not value. Sorting is unrelated." },
      ],
      explanation: "Reversing the second half gives direct access to Ln, Ln−1, … in order.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(1)", correct: true },
        { text: "O(n) for a list of nodes", why: "That's the array approach. This one relinks nodes in place." },
        { text: "O(log n)", why: "There's no recursion." },
      ],
      explanation: "Only a few pointers.",
    },
    {
      kind: "choice",
      prompt: "Why cut `slow.next = None` before merging?",
      solution: true,
      options: [
        { text: "Otherwise the first half's last node still points into the second half, which can create a cycle", correct: true },
        { text: "To free memory", why: "No memory is freed; it's about the links." },
        { text: "It isn't needed", why: "Without the cut, the middle node would keep its old link and could form a loop." },
      ],
      explanation: "Each half must end with `None` before the halves are interleaved.",
    },
  ],

  "partition-list": [
    {
      kind: "type",
      prompt: "Fill in the condition for the \"before\" list.",
      code: `
if head.val ___ x:
    before_tail.next = head
    before_tail = before_tail.next`,
      answers: ["<"],
      explanation: "Values **less than** x go first. Values equal to x go after.",
      mistakes: [{ answers: ["<="], why: "Values equal to x belong to the second group." }],
    },
    {
      kind: "type",
      prompt: "Fill in the line that ends the \"after\" list.",
      code: `
___ = None
before_tail.next = after.next`,
      answers: ["after_tail.next"],
      explanation: "The last \"after\" node may still point to an old node, which would create a cycle.",
    },
    {
      kind: "type",
      prompt: "Fill in what joins the two lists.",
      code: `
before_tail.next = ___`,
      answers: ["after.next"],
      explanation: "`after` is a placeholder, so the real first node of the second group is `after.next`.",
      mistakes: [{ answers: ["after"], why: "That would include the placeholder node (value 0) in the result." }],
    },
    {
      kind: "type",
      prompt: "`head = [1, 4, 3, 2, 5, 2]`, `x = 3`. What is the result?",
      solution: true,
      answers: ["[1, 2, 2, 4, 3, 5]", "1, 2, 2, 4, 3, 5", "1 2 2 4 3 5"],
      explanation: "Smaller than 3, in order: 1, 2, 2. The rest, in order: 4, 3, 5.",
      mistakes: [{ answers: ["[1, 2, 2, 3, 4, 5]", "1, 2, 2, 3, 4, 5", "1 2 2 3 4 5"], why: "This isn't sorting. Within each group, the original order is kept: 4 came before 3." }],
    },
    {
      kind: "type",
      prompt: "`head = [2, 1]`, `x = 2`. What is the result?",
      solution: true,
      answers: ["[1, 2]", "1, 2", "1 2"],
      explanation: "1 < 2 goes first; 2 is not less than 2, so it goes after.",
    },
    {
      kind: "type",
      prompt: "`head = [3, 1, 2]`, `x = 4`. What is the result?",
      solution: true,
      answers: ["[3, 1, 2]", "3, 1, 2", "3 1 2"],
      explanation: "Every value is less than 4, so the \"after\" list is empty and the order is unchanged.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n log n)", why: "Nothing is sorted. Each node is placed once." },
        { text: "O(n²)", why: "Each node is visited once and appended in O(1)." },
      ],
      explanation: "One pass over the list.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(1): two placeholder nodes, the real nodes are reused", correct: true },
        { text: "O(n)", why: "No nodes are copied. Existing nodes are relinked." },
        { text: "O(log n)", why: "There's no recursion." },
      ],
      explanation: "Building two lists out of the existing nodes needs no extra memory.",
    },
    {
      kind: "choice",
      prompt: "Why build two separate lists and join them?",
      options: [
        { text: "It keeps the original order inside each group with one simple pass", correct: true },
        { text: "Swapping values in place would be faster", why: "Swapping values would break the relative order the problem asks to keep." },
        { text: "So the list ends up sorted", why: "The result isn't sorted. Only the two groups are separated." },
      ],
      explanation: "Appending in the order nodes are visited preserves relative order automatically.",
    },
    {
      kind: "choice",
      prompt: "Why use placeholder (dummy) heads?",
      solution: true,
      options: [
        { text: "So appending to an empty list needs no special case", correct: true },
        { text: "To store x", why: "The placeholders' values are never read." },
        { text: "To make the result sorted", why: "They just simplify appending." },
      ],
      explanation: "`before_tail` and `after_tail` always point at a real node, so `tail.next = node` always works.",
    },
  ],

  "reverse-nodes-in-k-group": [
    {
      kind: "type",
      prompt: "Fill in what happens when fewer than `k` nodes remain.",
      code: `
for _ in range(k):
    group_last = group_last.next
    if not group_last:
        return ___`,
      answers: ["dummy.next"],
      explanation: "The leftover nodes stay as they are, so we're done. The head of the result is after the placeholder.",
      mistakes: [{ answers: ["head"], why: "`head` was the original first node. After reversing the first group, it isn't first any more." }],
    },
    {
      kind: "type",
      prompt: "Fill in what the reversed group's old first node should point to.",
      code: `
group_next = group_last.next
previous, current = ___, group_previous.next`,
      answers: ["group_next"],
      explanation: "Starting `previous` at `group_next` makes the old first node (now last) link to the rest of the list.",
      mistakes: [{ answers: ["None"], why: "That would cut the list off after this group." }],
    },
    {
      kind: "type",
      prompt: "`head = [1, 2, 3, 4, 5]`, `k = 2`. What is the result?",
      solution: true,
      answers: ["[2, 1, 4, 3, 5]", "2, 1, 4, 3, 5", "2 1 4 3 5"],
      explanation: "Groups [1, 2] and [3, 4] are reversed; [5] is a short group and stays.",
    },
    {
      kind: "type",
      prompt: "`head = [1, 2, 3, 4, 5]`, `k = 3`. What is the result?",
      solution: true,
      answers: ["[3, 2, 1, 4, 5]", "3, 2, 1, 4, 5", "3 2 1 4 5"],
      explanation: "Only [1, 2, 3] is a full group. [4, 5] stays as it is.",
      mistakes: [{ answers: ["[3, 2, 1, 5, 4]", "3, 2, 1, 5, 4", "3 2 1 5 4"], why: "A final group with fewer than k nodes is **not** reversed." }],
    },
    {
      kind: "type",
      prompt: "`head = [1, 2, 3, 4, 5]`, `k = 1`. What is the result?",
      solution: true,
      answers: ["[1, 2, 3, 4, 5]", "1, 2, 3, 4, 5", "1 2 3 4 5"],
      explanation: "Reversing groups of 1 changes nothing.",
    },
    {
      kind: "type",
      prompt: "Fill in where `group_previous` moves after a group is reversed.",
      code: `
first = group_previous.next
group_previous.next = group_last
group_previous = ___`,
      answers: ["first"],
      explanation: "The old first node is now the group's last node, so it's the node before the next group.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n · k)", why: "Each node is counted once and reversed once: about 2n steps in total." },
        { text: "O(n / k)", why: "That's the number of groups, but each group costs O(k)." },
      ],
      explanation: "Every node is visited a constant number of times.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(1)", correct: true },
        { text: "O(k) for a buffer", why: "That's collecting each group in an array. This version relinks in place." },
        { text: "O(n / k) recursion", why: "That's the recursive version. This one is iterative." },
      ],
      explanation: "A handful of pointers, regardless of n and k.",
    },
    {
      kind: "choice",
      prompt: "Why check that k nodes remain **before** reversing?",
      options: [
        { text: "A short final group must stay unchanged, and undoing a reversal would waste work", correct: true },
        { text: "To find the middle of the list", why: "It's finding the end of the group, not the middle." },
        { text: "It's only for speed", why: "It's for correctness: the last group must not be reversed if it's short." },
      ],
      explanation: "Walking k steps first also gives `group_last`, the new first node of the group.",
    },
    {
      kind: "choice",
      prompt: "What is `dummy` for?",
      solution: true,
      options: [
        { text: "The first group has a \"node before it\" like every other group, so one code path handles all groups", correct: true },
        { text: "It stores k", why: "Its value is 0 and is never read." },
        { text: "It marks the end of the list", why: "It's placed **before** the head." },
      ],
      explanation: "The head changes after the first reversal; `dummy.next` always tracks it.",
    },
  ],
});
