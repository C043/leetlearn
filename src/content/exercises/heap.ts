import { defineExercises } from "./types";

export default defineExercises({
  "kth-largest-element-in-a-stream": [
    {
      kind: "type",
      prompt: "Fill in the size check that keeps only the k largest values.",
      code: `
heapq.heappush(self.heap, val)
if len(self.heap) ___ self.k:
    heapq.heappop(self.heap)`,
      answers: [">"],
      explanation: "Once there are k + 1 values, drop the smallest; the heap keeps exactly the k largest.",
      mistakes: [{ answers: [">="], why: "That would keep only k − 1 values." }],
    },
    {
      kind: "type",
      prompt: "Fill in the value returned.",
      code: `
return self.heap[___]`,
      answers: ["0"],
      explanation: "In a min-heap, index 0 is the smallest. The smallest of the k largest values is the kth largest.",
      mistakes: [{ answers: ["-1"], why: "A heap is not sorted; the last element isn't the largest. Only index 0 has a guarantee." }],
    },
    {
      kind: "type",
      prompt: "`KthLargest(3, [4, 5, 8, 2])`, then `add(3)`. What is returned?",
      solution: true,
      answers: ["4"],
      explanation: "The heap keeps {4, 5, 8}. Adding 3 and dropping the smallest (3) leaves {4, 5, 8}: the 3rd largest is 4.",
    },
    {
      kind: "type",
      prompt: "Continuing: after `add(3)`, `add(5)` is called. What is returned?",
      solution: true,
      answers: ["5"],
      explanation: "{4, 5, 8} + 5 → drop 4 → {5, 5, 8}. The 3rd largest is 5.",
    },
    {
      kind: "type",
      prompt: "Continuing: then `add(10)`. What is returned?",
      solution: true,
      answers: ["5"],
      explanation: "{5, 5, 8} + 10 → drop 5 → {5, 8, 10}. The 3rd largest is 5.",
    },
    {
      kind: "type",
      prompt: "Which Python module provides the heap functions?",
      answers: ["heapq"],
      explanation: "`heapq` turns a plain list into a min-heap.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity of `add`?",
      solution: true,
      options: [
        { text: "O(log k)", correct: true },
        { text: "O(log n) for all n values seen", why: "The heap never grows beyond k + 1 values." },
        { text: "O(k)", why: "A push and a pop on a heap of size k are each O(log k)." },
      ],
      explanation: "The heap stays at size k, so each operation is O(log k).",
    },
    {
      kind: "choice",
      prompt: "Why a **min**-heap to track the **largest** values?",
      options: [
        { text: "Its top is the smallest of the k kept, which is both the answer and the next one to evict", correct: true },
        { text: "Python has no max-heap", why: "True, but negation could fake one. The min-heap is the right tool here regardless." },
        { text: "A min-heap is faster", why: "Both kinds have the same costs." },
      ],
      explanation: "The weakest of the top k is exactly the kth largest.",
    },
    {
      kind: "choice",
      prompt: "What is the space complexity?",
      solution: true,
      options: [
        { text: "O(k)", correct: true },
        { text: "O(n)", why: "Values below the kth largest are discarded right away." },
        { text: "O(1)", why: "We store k values." },
      ],
      explanation: "At most k + 1 values are ever stored.",
    },
    {
      kind: "choice",
      prompt: "Why does `__init__` call `self.add` for the starting numbers?",
      solution: true,
      options: [
        { text: "It reuses the same push-and-trim logic, so the heap starts with the k largest", correct: true },
        { text: "To sort the starting numbers", why: "Nothing is sorted; the heap is just trimmed." },
        { text: "Because `add` must be called at least once", why: "It's purely reuse." },
      ],
      explanation: "Starting values and streamed values are handled the same way.",
    },
  ],

  "last-stone-weight": [
    {
      kind: "type",
      prompt: "Fill in how stones are stored so the min-heap acts as a max-heap.",
      code: `
heap = [___ for stone in stones]`,
      answers: ["-stone"],
      explanation: "Negating flips the order: the heaviest stone has the most negative value and sits on top.",
    },
    {
      kind: "type",
      prompt: "Fill in the loop condition.",
      code: `
while len(heap) ___ 1:`,
      answers: [">"],
      explanation: "Smashing needs two stones.",
    },
    {
      kind: "type",
      prompt: "Fill in what is pushed back when the weights differ.",
      code: `
if heaviest != second:
    heapq.heappush(heap, ___)`,
      answers: ["-(heaviest - second)", "second - heaviest"],
      explanation: "The leftover stone weighs `heaviest - second`, stored negated.",
      mistakes: [{ answers: ["heaviest - second"], why: "It must be negated, like every value in this heap." }],
    },
    {
      kind: "type",
      prompt: "`stones = [2, 7, 4, 1, 8, 1]`. What is returned?",
      solution: true,
      answers: ["1"],
      explanation: "8,7 → 1; 4,2 → 2; 2,1 → 1; 1,1 → 0; one stone of weight 1 is left.",
    },
    {
      kind: "type",
      prompt: "`stones = [3, 3]`. What is returned?",
      solution: true,
      answers: ["0"],
      explanation: "Equal stones destroy each other, so nothing is left.",
    },
    {
      kind: "type",
      prompt: "`stones = [10, 4, 4]`. What is returned?",
      solution: true,
      answers: ["2"],
      explanation: "10,4 → 6; 6,4 → 2.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n log n)", correct: true },
        { text: "O(n)", why: "Each smash is a heap operation, O(log n)." },
        { text: "O(n² log n)", why: "That's re-sorting after every smash. The heap avoids it." },
      ],
      explanation: "At most n − 1 smashes, each with O(log n) heap operations.",
    },
    {
      kind: "choice",
      prompt: "Why use a heap instead of sorting once?",
      options: [
        { text: "New stones are created; a heap keeps the two heaviest available after every insert", correct: true },
        { text: "Sorting can't handle duplicates", why: "Sorting handles duplicates fine." },
        { text: "Heaps use less memory", why: "Both store n stones." },
      ],
      explanation: "A sorted list would need re-sorting (or O(n) insertion) after each smash.",
    },
    {
      kind: "choice",
      prompt: "Why are the values negated when popped (`-heapq.heappop(heap)`)?",
      solution: true,
      options: [
        { text: "To turn the stored negative number back into the real weight", correct: true },
        { text: "To make the stone lighter", why: "It just undoes the storage trick." },
        { text: "Because `heappop` returns negatives", why: "It returns what was stored, which is negated." },
      ],
      explanation: "Store negated, compute with real weights.",
    },
    {
      kind: "choice",
      prompt: "What does `heapq.heapify(heap)` cost?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n log n)", why: "That's pushing items one by one. `heapify` builds bottom-up in linear time." },
        { text: "O(log n)", why: "It must touch every element." },
      ],
      explanation: "Building a heap in place is linear.",
    },
  ],

  "kth-largest-element-in-an-array": [
    {
      kind: "type",
      prompt: "`nums = [3, 2, 1, 5, 6, 4]`, `k = 2`. What is returned?",
      solution: true,
      answers: ["5"],
      explanation: "Sorted descending: 6, 5, … The 2nd largest is 5.",
    },
    {
      kind: "type",
      prompt: "`nums = [3, 2, 3, 1, 2, 4, 5, 5, 6]`, `k = 4`. What is returned?",
      solution: true,
      answers: ["4"],
      explanation: "Descending: 6, 5, 5, 4. Duplicates count separately.",
      mistakes: [{ answers: ["3"], why: "That's the 4th largest **distinct** value. Duplicates count here." }],
    },
    {
      kind: "type",
      prompt: "`nums = [7, 7, 7]`, `k = 2`. What is returned?",
      solution: true,
      answers: ["7"],
      explanation: "Every position holds 7.",
    },
    {
      kind: "type",
      prompt: "Fill in the trim condition.",
      code: `
heapq.heappush(heap, number)
if len(heap) > ___:
    heapq.heappop(heap)`,
      answers: ["k"],
      explanation: "Keep exactly the k largest values seen so far.",
    },
    {
      kind: "type",
      prompt: "Fill in the answer.",
      code: `
return heap___`,
      answers: ["[0]"],
      explanation: "The smallest of the k largest is the kth largest.",
    },
    {
      kind: "type",
      prompt: "Which selection algorithm finds the kth largest in O(n) **average** time?",
      answers: ["quickselect", "quick select"],
      explanation: "Quickselect partitions like quicksort but recurses into only one side.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity of this heap solution?",
      solution: true,
      options: [
        { text: "O(n log k)", correct: true },
        { text: "O(n log n)", why: "That's sorting. The heap never exceeds k + 1 items." },
        { text: "O(k log n)", why: "That's heapifying everything and popping k times, a different approach." },
      ],
      explanation: "n pushes and pops on a heap of size k.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity of this heap solution?",
      solution: true,
      options: [
        { text: "O(k)", correct: true },
        { text: "O(n)", why: "Only k + 1 values are ever held." },
        { text: "O(1)", why: "That's in-place quickselect." },
      ],
      explanation: "The heap holds at most k + 1 values.",
    },
    {
      kind: "choice",
      prompt: "When is the heap better than quickselect?",
      options: [
        { text: "When data arrives as a stream, or k is small and worst-case guarantees matter", correct: true },
        { text: "Always", why: "Quickselect is O(n) on average and uses O(1) extra space." },
        { text: "Never", why: "Quickselect's worst case is O(n²) and needs the whole array up front." },
      ],
      explanation: "Each has trade-offs: stream-friendly and predictable vs. faster on average.",
    },
    {
      kind: "choice",
      prompt: "Why is the min-heap's top the answer at the end?",
      solution: true,
      options: [
        { text: "The heap holds the k largest values, and its top is the smallest of them", correct: true },
        { text: "The top is the largest value", why: "It's a min-heap: the top is the smallest kept value." },
        { text: "The heap is sorted", why: "A heap only guarantees the top; the rest isn't sorted." },
      ],
      explanation: "Same idea as Kth Largest Element in a Stream.",
    },
  ],

  "top-k-frequent-elements": [
    {
      kind: "type",
      prompt: "Fill in the number of buckets.",
      code: `
buckets = [[] for _ in range(___)]`,
      answers: ["len(nums) + 1"],
      explanation: "A value can appear 1..n times; index n must exist, so we need n + 1 buckets.",
      mistakes: [{ answers: ["len(nums)"], why: "If one value fills the whole array, its count is n, which would be out of range." }],
    },
    {
      kind: "type",
      prompt: "Fill in the bucket each number goes into.",
      code: `
for number, count in Counter(nums).items():
    buckets[___].append(number)`,
      answers: ["count"],
      explanation: "The bucket index is the frequency.",
    },
    {
      kind: "type",
      prompt: "`nums = [1, 1, 1, 2, 2, 3]`, `k = 2`. Which values are returned?",
      solution: true,
      answers: ["[1, 2]", "1, 2", "1 2", "[2, 1]", "2, 1", "2 1"],
      explanation: "1 appears 3 times and 2 appears twice.",
    },
    {
      kind: "type",
      prompt: "`nums = [4, 4, 5, 5, 5, 6]`, `k = 1`. What is returned?",
      solution: true,
      answers: ["[5]", "5"],
      explanation: "5 appears three times.",
    },
    {
      kind: "type",
      prompt: "`nums = [1, 1, 1, 2, 2, 3]`. Which bucket index holds the value 2?",
      solution: true,
      answers: ["2"],
      explanation: "2 appears twice, so it goes into `buckets[2]`.",
    },
    {
      kind: "type",
      prompt: "Fill in the direction of the bucket scan.",
      code: `
for count in range(len(buckets) - 1, 0, ___):`,
      answers: ["-1"],
      explanation: "Scan from the highest count down, so the most frequent values come first.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity of the bucket approach?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n log k)", why: "That's the heap approach. Buckets avoid comparisons entirely." },
        { text: "O(n log n)", why: "That's sorting by frequency." },
      ],
      explanation: "Counting and filling buckets are linear, and the scan visits n + 1 buckets.",
    },
    {
      kind: "choice",
      prompt: "Why does bucket sort work here?",
      options: [
        { text: "Frequencies are integers between 1 and n, so they can be array indices", correct: true },
        { text: "Because the values are sorted", why: "The values can be in any order; we bucket by count." },
        { text: "Because k is small", why: "It works for any k." },
      ],
      explanation: "A bounded integer key turns sorting into indexing.",
    },
    {
      kind: "choice",
      prompt: "How would a heap solve it?",
      options: [
        { text: "Keep a min-heap of size k keyed by frequency: O(n log k)", correct: true },
        { text: "Heapify the values themselves", why: "We need to order by frequency, not by value." },
        { text: "A heap can't solve it", why: "It can; it's just slower than buckets." },
      ],
      explanation: "Push (count, value), trim to k, and what's left is the answer.",
    },
    {
      kind: "choice",
      prompt: "What does `Counter(nums)` build?",
      options: [
        { text: "A dictionary from each value to how many times it appears", correct: true },
        { text: "A sorted list of values", why: "It counts; it doesn't sort." },
        { text: "The number of distinct values", why: "That's `len(Counter(nums))`." },
      ],
      explanation: "It's the frequency table every approach starts from.",
    },
  ],

  "k-closest-points-to-origin": [
    {
      kind: "type",
      prompt: "Fill in the squared distance.",
      code: `
distance = x * x + ___`,
      answers: ["y * y", "y**2", "y ** 2"],
      explanation: "x² + y²: comparing squared distances gives the same order as real distances.",
    },
    {
      kind: "type",
      prompt: "Fill in the function that pops the top and pushes a new item in one step.",
      code: `
elif distance < -heap[0][0]:
    heapq.___(heap, (-distance, x, y))`,
      answers: ["heapreplace"],
      explanation: "`heapreplace` pops the farthest kept point and pushes the closer one, in one O(log k) step.",
    },
    {
      kind: "type",
      prompt: "`points = [[1, 3], [-2, 2]]`, `k = 1`. What is returned?",
      solution: true,
      answers: ["[[-2, 2]]", "[-2, 2]", "-2, 2"],
      explanation: "Squared distances: 10 and 8. `[-2, 2]` is closer.",
    },
    {
      kind: "type",
      prompt: "`points = [[3, 3], [5, -1], [-2, 4]]`, `k = 2`. Which point is NOT returned?",
      solution: true,
      answers: ["[5, -1]", "5, -1"],
      explanation: "Squared distances: 18, 26, 20. `[5, -1]` is the farthest.",
    },
    {
      kind: "type",
      prompt: "What is the squared distance of `[-2, 4]`?",
      answers: ["20"],
      explanation: "(−2)² + 4² = 4 + 16 = 20.",
    },
    {
      kind: "type",
      prompt: "Why negate the distance? So the min-heap's top is the farthest or the closest kept point? (type `farthest` or `closest`)",
      solution: true,
      answers: ["farthest"],
      explanation: "Negation makes the largest distance sit on top, so it's the one evicted when a closer point arrives.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n log k)", correct: true },
        { text: "O(n log n)", why: "That's sorting all points. The heap stays at size k." },
        { text: "O(n)", why: "Each heap update costs O(log k)." },
      ],
      explanation: "n points, each with at most one O(log k) heap operation.",
    },
    {
      kind: "choice",
      prompt: "Why skip the square root?",
      options: [
        { text: "√ is increasing, so comparing squared distances gives the same order, with no float error", correct: true },
        { text: "Square roots are not allowed", why: "They're allowed, just unnecessary." },
        { text: "Because coordinates are integers", why: "Even with floats, the order would be the same." },
      ],
      explanation: "If a² < b², then a < b for non-negative a, b.",
    },
    {
      kind: "choice",
      prompt: "Why a max-heap of size k (instead of a min-heap of all points)?",
      options: [
        { text: "It uses O(k) memory and evicts the worst kept point whenever a better one arrives", correct: true },
        { text: "A min-heap gives wrong answers", why: "Heapifying all and popping k gives the right answer, using O(n) memory." },
        { text: "Python has no min-heap", why: "`heapq` is a min-heap. We negate to get max-heap behaviour." },
      ],
      explanation: "Keep the k best, and compare each new point against the worst of them.",
    },
    {
      kind: "choice",
      prompt: "What is the space complexity?",
      solution: true,
      options: [
        { text: "O(k)", correct: true },
        { text: "O(n)", why: "Only k points are kept." },
        { text: "O(1)", why: "The heap holds k points." },
      ],
      explanation: "The heap never exceeds k entries.",
    },
  ],

  "task-scheduler": [
    {
      kind: "type",
      prompt: "Fill in the size of each block in the frame.",
      code: `
return max(len(tasks), (highest_frequency - 1) * (___) + tasks_with_highest)`,
      answers: ["n + 1"],
      explanation: "A block is one run of the most frequent task followed by n cooling slots: n + 1 intervals.",
      mistakes: [{ answers: ["n"], why: "Each block also includes the task itself, so it's n + 1 slots." }],
    },
    {
      kind: "type",
      prompt: "`tasks = A A A B B B`, `n = 2`. What is returned?",
      solution: true,
      answers: ["8"],
      explanation: "A B idle A B idle A B: (3 − 1)·3 + 2 = 8.",
    },
    {
      kind: "type",
      prompt: "`tasks = A A A B B B`, `n = 0`. What is returned?",
      solution: true,
      answers: ["6"],
      explanation: "No cooldown, so no idling: just the 6 tasks.",
    },
    {
      kind: "type",
      prompt: "`tasks = A A A B B B`, `n = 3`. What is returned?",
      solution: true,
      answers: ["10"],
      explanation: "(3 − 1)·4 + 2 = 10: A B _ _ A B _ _ A B.",
    },
    {
      kind: "type",
      prompt: "`tasks = A C A B D B`, `n = 1`. What is returned?",
      solution: true,
      answers: ["6"],
      explanation: "The frame needs (2 − 1)·2 + 2 = 4, but there are 6 tasks, so the answer is 6 with no idling.",
    },
    {
      kind: "type",
      prompt: "Fill in the lower bound: you can never finish faster than this.",
      code: `
return max(___, (highest_frequency - 1) * (n + 1) + tasks_with_highest)`,
      answers: ["len(tasks)"],
      explanation: "Every task needs its own interval.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n) in the number of tasks", correct: true },
        { text: "O(n log 26)", why: "This version uses a formula; no heap simulation is needed." },
        { text: "O(n · cooldown)", why: "That's simulating every interval." },
      ],
      explanation: "Counting is O(n); the rest works over at most 26 counts.",
    },
    {
      kind: "choice",
      prompt: "Why does the most frequent task determine the frame?",
      options: [
        { text: "Its copies must be spaced n apart, creating gaps that other tasks can fill", correct: true },
        { text: "It runs first", why: "Order matters less than the spacing it forces." },
        { text: "It takes longer to run", why: "Every task takes one interval." },
      ],
      explanation: "Other tasks slot into the gaps; idle time is whatever can't be filled.",
    },
    {
      kind: "choice",
      prompt: "Why add `tasks_with_highest` at the end?",
      options: [
        { text: "Every task tied for the highest count needs a spot in the last row", correct: true },
        { text: "To count idle slots", why: "Idle slots are inside the blocks." },
        { text: "For the cooldown after the last task", why: "No cooldown is needed after the final task." },
      ],
      explanation: "With A A A B B B, both A and B finish in the final row: `A B`.",
    },
    {
      kind: "choice",
      prompt: "How could a heap solve this instead?",
      options: [
        { text: "Simulate time: each step run the most frequent available task, parking used tasks in a cooldown queue", correct: true },
        { text: "Sort tasks by name", why: "Names don't matter; counts do." },
        { text: "A heap can't help", why: "A max-heap of counts plus a cooldown queue simulates the schedule." },
      ],
      explanation: "The simulation is easier to reason about; the formula is faster.",
    },
  ],

  "kth-smallest-element-in-a-sorted-matrix": [
    {
      kind: "type",
      prompt: "Fill in how many rows start in the heap.",
      code: `
heap = [(matrix[row][0], row, 0) for row in range(min(size, ___))]`,
      answers: ["k"],
      explanation: "The kth smallest can't be in a row below row k − 1, because each row's first value is ≥ those above it.",
    },
    {
      kind: "type",
      prompt: "Fill in how many times we pop before reading the answer.",
      code: `
for _ in range(___):
    _, row, column = heapq.heappop(heap)`,
      answers: ["k - 1"],
      explanation: "After removing the k − 1 smallest values, the heap's top is the kth smallest.",
      mistakes: [{ answers: ["k"], why: "Popping k times removes the answer itself." }],
    },
    {
      kind: "type",
      prompt: "`matrix = [[1, 5, 9], [10, 11, 13], [12, 13, 15]]`, `k = 8`. What is returned?",
      solution: true,
      answers: ["13"],
      explanation: "In order: 1, 5, 9, 10, 11, 12, 13, 13, 15. The 8th is 13.",
    },
    {
      kind: "type",
      prompt: "Same matrix, `k = 4`. What is returned?",
      solution: true,
      answers: ["10"],
      explanation: "1, 5, 9, 10: the 4th is 10.",
    },
    {
      kind: "type",
      prompt: "`matrix = [[1, 2], [1, 3]]`, `k = 2`. What is returned?",
      solution: true,
      answers: ["1"],
      explanation: "In order: 1, 1, 2, 3. Duplicates count.",
    },
    {
      kind: "type",
      prompt: "Fill in what replaces a popped value.",
      code: `
if column + 1 < size:
    heapq.heappush(heap, (matrix[row][___], row, column + 1))`,
      answers: ["column + 1"],
      explanation: "The next candidate from the same row is the value to the right.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(k log n) with an n × n matrix", correct: true },
        { text: "O(n² log n)", why: "That's sorting every value. Here we only pop k times." },
        { text: "O(k)", why: "Each pop and push costs O(log n)." },
      ],
      explanation: "k − 1 pops and pushes on a heap of at most n entries.",
    },
    {
      kind: "choice",
      prompt: "Which problem is this really?",
      options: [
        { text: "Merging n sorted lists (the rows), stopping after k values", correct: true },
        { text: "Binary search on a sorted array", why: "Another valid approach searches values, but the heap version is k-way merging." },
        { text: "Top K Frequent", why: "Frequencies aren't involved." },
      ],
      explanation: "Same frontier-heap idea as Merge k Sorted Lists.",
    },
    {
      kind: "choice",
      prompt: "What other approach uses O(1) extra space?",
      options: [
        { text: "Binary search on the value range, counting values ≤ mid with a staircase walk", correct: true },
        { text: "Flatten and sort", why: "That's O(n²) extra space." },
        { text: "Quickselect on the matrix", why: "That needs a flattened copy." },
      ],
      explanation: "Counting values ≤ mid is O(n) thanks to sorted rows and columns.",
    },
    {
      kind: "choice",
      prompt: "Why does each heap entry include `row` and `column`?",
      solution: true,
      options: [
        { text: "To know which value comes next from the same row after popping", correct: true },
        { text: "To break ties", why: "They do break ties, but their main job is finding the next value." },
        { text: "To sort the heap", why: "The value is the sort key; positions are for navigation." },
      ],
      explanation: "A popped value is replaced by its right neighbour.",
    },
  ],

  "reorganize-string": [
    {
      kind: "type",
      prompt: "Fill in the impossibility check.",
      code: `
if max(frequency.values()) > (length + 1) // ___:
    return ""`,
      answers: ["2"],
      explanation: "A letter can take at most every other slot: ⌈length / 2⌉ = (length + 1) // 2.",
    },
    {
      kind: "type",
      prompt: "Fill in how far each placement jumps.",
      code: `
result[position] = letter
position += ___`,
      answers: ["2"],
      explanation: "Skipping a slot keeps copies of the same letter apart.",
    },
    {
      kind: "type",
      prompt: "Fill in where placement continues after the even slots are full.",
      code: `
if position >= length:
    position = ___`,
      answers: ["1"],
      explanation: "Even slots first (0, 2, 4, …), then odd slots (1, 3, 5, …).",
    },
    {
      kind: "type",
      prompt: "`s = \"aaab\"`. What is returned? (type `\"\"` for empty)",
      solution: true,
      answers: ["\"\"", "''", "empty"],
      explanation: "`a` appears 3 times but only (4 + 1) // 2 = 2 non-adjacent slots exist.",
    },
    {
      kind: "type",
      prompt: "`s = \"vvvlo\"`. What does this code return?",
      solution: true,
      answers: ["vlvov"],
      explanation: "v goes to slots 0, 2, 4; then l and o fill slots 1 and 3.",
    },
    {
      kind: "type",
      prompt: "`s = \"aab\"`. What does this code return?",
      solution: true,
      answers: ["aba"],
      explanation: "a takes slots 0 and 2; b takes slot 1.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n log n)", why: "`most_common` sorts at most 26 letters, which is constant." },
        { text: "O(n log 26) with a heap", why: "That's the heap version. This one places letters directly." },
      ],
      explanation: "Count once, place each letter once.",
    },
    {
      kind: "choice",
      prompt: "Why place the most frequent letter first?",
      options: [
        { text: "It needs the most spread-out slots; filling evens first guarantees it never touches itself", correct: true },
        { text: "To make the output sorted", why: "The output isn't sorted." },
        { text: "It doesn't matter", why: "Placing it last might leave it only adjacent slots." },
      ],
      explanation: "If it fits in the even slots, every other letter fits too.",
    },
    {
      kind: "choice",
      prompt: "How would a heap version work?",
      options: [
        { text: "Each step, take the most frequent letter that differs from the last one placed", correct: true },
        { text: "Sort letters alphabetically", why: "Alphabetical order doesn't prevent adjacency." },
        { text: "Use a min-heap of letters", why: "We need the most **frequent** first, so a max-heap by count." },
      ],
      explanation: "Hold back the last-used letter for one step, then push it back.",
    },
    {
      kind: "choice",
      prompt: "Which problem has the same \"most frequent first, keep copies apart\" idea?",
      options: [
        { text: "Task Scheduler", correct: true },
        { text: "Top K Frequent Elements", why: "That ranks by frequency but has no spacing rule." },
        { text: "Last Stone Weight", why: "That combines values; no spacing." },
      ],
      explanation: "Task Scheduler is the same with a cooldown of n instead of 1.",
    },
  ],

  "single-threaded-cpu": [
    {
      kind: "type",
      prompt: "Fill in the heap entry so the shortest task (then smallest index) comes first.",
      code: `
heapq.heappush(heap, (tasks[task_index][___], task_index))`,
      answers: ["1"],
      explanation: "`tasks[i][1]` is the processing time. Tuples compare left to right, so ties go to the smaller index.",
      mistakes: [{ answers: ["0"], why: "That's the enqueue time. The CPU picks by **processing** time." }],
    },
    {
      kind: "type",
      prompt: "Fill in what happens to time while a task runs.",
      code: `
duration, task_index = heapq.heappop(heap)
time ___ duration`,
      answers: ["+="],
      explanation: "The CPU is busy for the whole processing time.",
    },
    {
      kind: "type",
      prompt: "`tasks = [[1, 2], [2, 4], [3, 2], [4, 1]]`. What is returned?",
      solution: true,
      answers: ["[0, 2, 3, 1]", "0, 2, 3, 1", "0 2 3 1"],
      explanation: "t=1 run 0 (ends 3). Available: 1 (4), 2 (2) → run 2 (ends 5). Available: 1 (4), 3 (1) → run 3, then 1.",
    },
    {
      kind: "type",
      prompt: "`tasks = [[7, 10], [7, 12], [7, 5], [7, 4], [7, 2]]`. What is returned?",
      solution: true,
      answers: ["[4, 3, 2, 0, 1]", "4, 3, 2, 0, 1", "4 3 2 0 1"],
      explanation: "All arrive together, so they run shortest first: 2, 4, 5, 10, 12.",
    },
    {
      kind: "type",
      prompt: "`tasks = [[5, 2], [1, 3]]`. Which index runs first?",
      solution: true,
      answers: ["1"],
      explanation: "Task 1 arrives at time 1, before task 0 at time 5.",
    },
    {
      kind: "type",
      prompt: "Fill in the idle jump when nothing is available.",
      code: `
if not heap and time < tasks[order[next_arrival]][0]:
    time = ___`,
      answers: ["tasks[order[next_arrival]][0]"],
      explanation: "Skip straight to the next arrival instead of ticking through idle time.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n log n)", correct: true },
        { text: "O(n²)", why: "That's scanning all available tasks each time. The heap picks in O(log n)." },
        { text: "O(n)", why: "Sorting by arrival alone is O(n log n)." },
      ],
      explanation: "Sorting plus n heap pushes and pops.",
    },
    {
      kind: "choice",
      prompt: "Why sort task **indices** by arrival instead of sorting the tasks?",
      options: [
        { text: "The output needs the original indices", correct: true },
        { text: "Sorting tasks would be slower", why: "Same cost. The issue is losing the original positions." },
        { text: "Python can't sort lists of lists", why: "It can. We just need to keep the indices." },
      ],
      explanation: "Sorting indices with a key keeps the link back to the input.",
    },
    {
      kind: "choice",
      prompt: "What are the two \"queues\" in this simulation?",
      options: [
        { text: "Tasks sorted by arrival (not yet arrived) and a heap of available tasks by duration", correct: true },
        { text: "Two heaps by arrival time", why: "Arrival order only needs a sorted list and a pointer." },
        { text: "One stack and one queue", why: "Neither a stack nor a FIFO queue is used." },
      ],
      explanation: "Move tasks from \"arrived\" into the heap as time passes, then run the heap's best.",
    },
    {
      kind: "choice",
      prompt: "What is the space complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(1)", why: "The sorted order and the heap both hold up to n entries." },
        { text: "O(log n)", why: "The heap can hold all tasks at once." },
      ],
      explanation: "Sorted indices, heap and output are each O(n).",
    },
  ],

  "find-median-from-data-stream": [
    {
      kind: "type",
      prompt: "Fill in how a value is stored in the `low` max-heap.",
      code: `
heapq.heappush(self.low, ___)`,
      answers: ["-num"],
      explanation: "`heapq` is a min-heap, so the smaller half stores negated values to keep its maximum on top.",
    },
    {
      kind: "type",
      prompt: "Fill in the size check that rebalances.",
      code: `
if len(self.high) ___ len(self.low):
    heapq.heappush(self.low, -heapq.heappop(self.high))`,
      answers: [">"],
      explanation: "`low` may be the same size or one bigger; if `high` grows bigger, move one back.",
    },
    {
      kind: "type",
      prompt: "`addNum(1)`, `addNum(2)`. What does `findMedian()` return?",
      solution: true,
      answers: ["1.5"],
      explanation: "Even count: (1 + 2) / 2.",
    },
    {
      kind: "type",
      prompt: "Then `addNum(3)`. What does `findMedian()` return?",
      solution: true,
      answers: ["2", "2.0"],
      explanation: "Odd count: `low` = {1, 2}, `high` = {3}. The median is low's max, 2.",
    },
    {
      kind: "type",
      prompt: "After adding 5, 1, 10: what does the `high` heap contain?",
      solution: true,
      answers: ["[10]", "10"],
      explanation: "`low` holds the smaller half {1, 5} and `high` holds {10}.",
    },
    {
      kind: "type",
      prompt: "Fill in the even-count median.",
      code: `
return (-self.low[0] + self.high[___]) / 2`,
      answers: ["0"],
      explanation: "The two middle values are low's max and high's min.",
    },
    {
      kind: "choice",
      prompt: "What are the costs of `addNum` and `findMedian`?",
      solution: true,
      options: [
        { text: "`addNum` O(log n), `findMedian` O(1)", correct: true },
        { text: "Both O(1)", why: "Heap pushes and pops cost O(log n)." },
        { text: "`addNum` O(1), `findMedian` O(n log n)", why: "That's appending and sorting on every query." },
      ],
      explanation: "A few heap operations per add; the median is read from the two tops.",
    },
    {
      kind: "choice",
      prompt: "What invariant do the two heaps keep?",
      options: [
        { text: "Every value in `low` ≤ every value in `high`, and `low` has the same size or one more", correct: true },
        { text: "Both heaps are sorted", why: "Heaps only guarantee their top element." },
        { text: "`low` holds even numbers and `high` odd ones", why: "They split by size order, not parity." },
      ],
      explanation: "Then the middle value(s) are exactly the two tops.",
    },
    {
      kind: "choice",
      prompt: "Why always push into `low` first and then move its max to `high`?",
      solution: true,
      options: [
        { text: "It guarantees the new value lands on the correct side of the split", correct: true },
        { text: "It's faster than comparing", why: "It costs a little more; it's done for simplicity and correctness." },
        { text: "To keep `high` empty", why: "`high` holds the larger half." },
      ],
      explanation: "Passing through `low` filters the value so that low ≤ high always holds.",
    },
    {
      kind: "choice",
      prompt: "What is the space complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(1)", why: "Every number added is stored." },
        { text: "O(log n)", why: "Both heaps together hold all n numbers." },
      ],
      explanation: "All numbers are kept, split between the heaps.",
    },
  ],
});
