import { defineExercises } from "./types";

export default defineExercises({
  "valid-parentheses": [
    {
      kind: "type",
      prompt: "Fill in the opening bracket that `\"]\"` needs.",
      code: `
pairs = {")": "(", "]": "___", "}": "{"}`,
      answers: ["["],
      explanation: "The map goes from each closing bracket to the opening bracket that must be on top of the stack.",
    },
    {
      kind: "type",
      prompt: "Fill in what is returned at the end.",
      code: `
return ___`,
      answers: ["not stack", "len(stack) == 0", "stack == []"],
      explanation: "Every opening bracket must have been closed, so the stack must be empty.",
      mistakes: [{ answers: ["True"], why: "`\"(\"` would return `True`. Unclosed brackets left on the stack make it invalid." }],
    },
    {
      kind: "type",
      prompt: "Fill in the stack method that removes and returns the most recent opening bracket.",
      code: `
if not stack or stack.___() != pairs[character]:
    return False`,
      answers: ["pop"],
      explanation: "The most recent unclosed bracket is on top, and it's the one that must match.",
    },
    {
      kind: "type",
      prompt: "`s = \"([)]\"`. What is returned?",
      solution: true,
      answers: ["False"],
      explanation: "At `)`, the top of the stack is `[`, not `(`. Brackets must close in reverse order of opening.",
      mistakes: [{ answers: ["True"], why: "Counts match, but order doesn't: `)` arrives while `[` is still open." }],
    },
    {
      kind: "type",
      prompt: "`s = \"{[]}\"`. What is returned?",
      solution: true,
      answers: ["True"],
      explanation: "`[` closes first, then `{`: properly nested.",
    },
    {
      kind: "type",
      prompt: "`s = \"]\"`. What is returned?",
      solution: true,
      answers: ["False"],
      explanation: "A closing bracket with an empty stack has nothing to match.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n²)", why: "That's repeatedly removing \"()\" pairs from the string. The stack handles each character once." },
        { text: "O(log n)", why: "Every character must be read." },
      ],
      explanation: "One pass; each push and pop is O(1).",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(1)", why: "With only one bracket type a counter would do, but with three types we must remember their order." },
        { text: "O(3)", why: "The stack can hold up to n opening brackets, e.g. `\"((((\"`." },
      ],
      explanation: "In the worst case every character is an opening bracket.",
    },
    {
      kind: "choice",
      prompt: "Why a stack?",
      options: [
        { text: "The most recently opened bracket must be the first one closed: last in, first out", correct: true },
        { text: "To count brackets of each type", why: "Counting can't detect `\"([)]\"`, which has matching counts but bad order." },
        { text: "Because brackets are sorted", why: "Order of appearance matters, not sorting." },
      ],
      explanation: "Nesting is exactly last-in-first-out.",
    },
    {
      kind: "choice",
      prompt: "Which quick check can reject some inputs before scanning?",
      options: [
        { text: "An odd-length string can never be valid", correct: true },
        { text: "A string starting with `(` is always valid", why: "`\"((\"` starts with `(` and is invalid." },
        { text: "A string with all three types is invalid", why: "`\"([{}])\"` uses all three and is valid." },
      ],
      explanation: "Brackets come in pairs, so the length must be even.",
    },
  ],

  "implement-queue-using-stacks": [
    {
      kind: "type",
      prompt: "Fill in the condition for refilling the outbox.",
      code: `
def peek(self) -> int:
    if ___:
        while self.inbox:
            self.outbox.append(self.inbox.pop())
    return self.outbox[-1]`,
      answers: ["not self.outbox", "len(self.outbox) == 0"],
      explanation: "Only refill when the outbox is empty. Pouring on top of existing elements would break the order.",
      mistakes: [{ answers: ["self.inbox"], why: "If the outbox still has older elements, pouring newer ones on top would let them jump the queue." }],
    },
    {
      kind: "type",
      prompt: "Fill in the line that moves one element from inbox to outbox.",
      code: `
while self.inbox:
    self.outbox.append(___)`,
      answers: ["self.inbox.pop()"],
      explanation: "Popping from one stack and pushing onto the other reverses the order, so the oldest ends on top.",
    },
    {
      kind: "type",
      prompt: "Fill in the condition for an empty queue.",
      code: `
def empty(self) -> bool:
    return not self.inbox ___ not self.outbox`,
      answers: ["and"],
      explanation: "Elements can be in either stack, so both must be empty.",
      mistakes: [{ answers: ["or"], why: "With `or`, a queue with items only in the inbox would report empty." }],
    },
    {
      kind: "type",
      prompt: "`push(1)`, `push(2)`, `peek()`. What does `peek()` return?",
      solution: true,
      answers: ["1"],
      explanation: "A queue returns the oldest element first: 1.",
      mistakes: [{ answers: ["2"], why: "That's stack behaviour. A queue is first-in-first-out." }],
    },
    {
      kind: "type",
      prompt: "`push(1)`, `push(2)`, `pop()`, `push(3)`. What does the **outbox** contain now?",
      solution: true,
      answers: ["[2]", "2"],
      explanation: "The `pop` moved `[1, 2]` over (as `[2, 1]`) and removed 1. The 3 went into the inbox, since the outbox wasn't empty yet.",
    },
    {
      kind: "type",
      prompt: "Continuing: after `push(1)`, `push(2)`, `pop()`, `push(3)`, what does the next `pop()` return?",
      solution: true,
      answers: ["2"],
      explanation: "2 is on top of the outbox, and it's the oldest remaining element.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity of `pop`?",
      solution: true,
      options: [
        { text: "Amortized O(1)", correct: true },
        { text: "Always O(1)", why: "A single `pop` can move all n elements when the outbox is empty." },
        { text: "O(n) every time", why: "Each element is moved at most once, so the cost averages out to O(1)." },
      ],
      explanation: "Every element is pushed into the inbox once, moved once, and popped once.",
    },
    {
      kind: "choice",
      prompt: "Why does pouring the inbox into the outbox give queue order?",
      options: [
        { text: "Moving between stacks reverses the order, so the oldest element ends on top", correct: true },
        { text: "The inbox is sorted", why: "Order is by arrival time, not by value." },
        { text: "The outbox is a queue", why: "Both are plain stacks. Two reversals give FIFO order." },
      ],
      explanation: "Inbox top = newest. After pouring, outbox top = oldest.",
    },
    {
      kind: "choice",
      prompt: "Why does `pop` call `peek` first?",
      solution: true,
      options: [
        { text: "`peek` makes sure the oldest element is on top of the outbox", correct: true },
        { text: "To check that the queue isn't empty", why: "The problem guarantees calls are valid. `peek` is reused for the refill." },
        { text: "It's required by the interface", why: "It's just reuse, to avoid duplicating the refill logic." },
      ],
      explanation: "Both operations need the same refill step.",
    },
    {
      kind: "choice",
      prompt: "What is the space complexity?",
      solution: true,
      options: [
        { text: "O(n) for n elements in the queue", correct: true },
        { text: "O(2n), which is worse", why: "Each element is in exactly one stack at a time, and constants are dropped anyway." },
        { text: "O(1)", why: "The stacks hold all queued elements." },
      ],
      explanation: "Each element lives in one of the two stacks.",
    },
  ],

  "daily-temperatures": [
    {
      kind: "type",
      prompt: "Fill in the condition: today is warmer than the day on top of the stack.",
      code: `
while stack and temperatures[stack[-1]] ___ temperature:`,
      answers: ["<"],
      explanation: "A strictly warmer day ends the wait. An equal temperature doesn't count as warmer.",
      mistakes: [{ answers: ["<="], why: "The problem asks for a **warmer** day. An equal temperature doesn't end the wait." }],
    },
    {
      kind: "type",
      prompt: "Fill in the number of days waited.",
      code: `
waiting_day = stack.pop()
result[waiting_day] = ___`,
      answers: ["day - waiting_day"],
      explanation: "The wait is the distance between the warmer day and the waiting day.",
    },
    {
      kind: "type",
      prompt: "What does the stack hold: temperatures or indices? (type `indices` or `temperatures`)",
      solution: true,
      answers: ["indices", "index", "indexes"],
      explanation: "We need the index to compute the distance, and we can always look up the temperature from it.",
    },
    {
      kind: "type",
      prompt: "`temperatures = [73, 74, 75, 71, 69, 72, 76, 73]`. What is `answer[2]` (for 75)?",
      solution: true,
      answers: ["4"],
      explanation: "The next warmer day after 75 is 76, on day 6: 6 − 2 = 4.",
    },
    {
      kind: "type",
      prompt: "`temperatures = [30, 40, 50, 60]`. What is returned?",
      solution: true,
      answers: ["[1, 1, 1, 0]", "1, 1, 1, 0", "1 1 1 0"],
      explanation: "Each day is followed by a warmer day except the last.",
    },
    {
      kind: "type",
      prompt: "`temperatures = [50, 40, 30]`. What is returned?",
      solution: true,
      answers: ["[0, 0, 0]", "0, 0, 0", "0 0 0"],
      explanation: "It only gets colder, so no day finds a warmer one.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n²)", why: "The inner `while` pops each index at most once over the whole run." },
        { text: "O(n log n)", why: "No sorting or heap is used." },
      ],
      explanation: "Each index is pushed once and popped at most once.",
    },
    {
      kind: "choice",
      prompt: "What property does the stack keep?",
      options: [
        { text: "From bottom to top, temperatures never increase (a monotonic decreasing stack)", correct: true },
        { text: "Temperatures increase from bottom to top", why: "Anything warmer than the top pops it, so the top is always the coolest." },
        { text: "It's sorted by index descending", why: "Indices are pushed in increasing order." },
      ],
      explanation: "Days still waiting for a warmer day can't be warmer than the days after them that are also waiting.",
    },
    {
      kind: "choice",
      prompt: "Why do days left on the stack at the end get 0?",
      solution: true,
      options: [
        { text: "No warmer day came after them, and `result` was initialised to 0", correct: true },
        { text: "They're popped and set to 0 explicitly", why: "Nothing pops them; the default 0 stays." },
        { text: "They're the warmest days overall", why: "Not necessarily the warmest overall, just never followed by a warmer one." },
      ],
      explanation: "The 0 default covers \"no warmer day\".",
    },
    {
      kind: "choice",
      prompt: "Which problem uses the same \"next greater\" stack, but on a circular array?",
      options: [
        { text: "Next Greater Element II", correct: true },
        { text: "Valid Parentheses", why: "That stack matches brackets, not values." },
        { text: "Decode String", why: "That stack saves partial strings." },
      ],
      explanation: "Daily Temperatures is \"distance to next greater element\".",
    },
  ],

  "next-greater-element-ii": [
    {
      kind: "type",
      prompt: "Fill in how many steps the loop takes to handle the wrap-around.",
      code: `
for step in range(___):
    number = nums[step % length]`,
      answers: ["2 * length"],
      explanation: "Going around twice lets every element see every other element after it in circular order.",
    },
    {
      kind: "type",
      prompt: "Fill in when indices are pushed onto the stack.",
      code: `
if step ___ length:
    stack.append(step)`,
      answers: ["<"],
      explanation: "Each index needs an answer once. The second pass only answers indices still waiting.",
    },
    {
      kind: "type",
      prompt: "`nums = [1, 2, 1]`. What is returned?",
      solution: true,
      answers: ["[2, -1, 2]", "2, -1, 2", "2 -1 2"],
      explanation: "The last 1 wraps around to find 2. Nothing is greater than 2.",
    },
    {
      kind: "type",
      prompt: "`nums = [5, 4, 3]`. What is returned?",
      solution: true,
      answers: ["[-1, 5, 5]", "-1, 5, 5", "-1 5 5"],
      explanation: "4 and 3 wrap around to 5. 5 is the maximum, so it gets -1.",
    },
    {
      kind: "type",
      prompt: "`nums = [2, 2]`. What is returned?",
      solution: true,
      answers: ["[-1, -1]", "-1, -1", "-1 -1"],
      explanation: "Equal values aren't greater, so neither finds a next greater element.",
    },
    {
      kind: "type",
      prompt: "Fill in the operator that wraps the position around.",
      code: `
number = nums[step ___ length]`,
      answers: ["%"],
      explanation: "`step % length` maps the second pass back onto indices 0..length−1.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n²)", why: "That's checking forward from every index. Each index is pushed and popped at most once." },
        { text: "O(2n²)", why: "The loop is 2n steps, and the pops total at most n." },
      ],
      explanation: "2n iterations plus at most n pops.",
    },
    {
      kind: "choice",
      prompt: "What does the result hold for the maximum element?",
      options: [
        { text: "-1: nothing is greater, even after wrapping around", correct: true },
        { text: "Its own value", why: "An element isn't greater than itself." },
        { text: "The first element", why: "Only a greater value counts." },
      ],
      explanation: "The maximum stays on the stack and keeps the default -1.",
    },
    {
      kind: "choice",
      prompt: "Why not just copy the array twice (`nums + nums`) and solve normally?",
      options: [
        { text: "That works too, but uses O(n) extra memory; `% length` simulates it for free", correct: true },
        { text: "It would give wrong answers", why: "It gives the same answers if you only keep the first n results." },
        { text: "Python can't concatenate lists", why: "It can: `nums + nums`." },
      ],
      explanation: "The modulo trick walks the doubled array without building it.",
    },
    {
      kind: "choice",
      prompt: "Why compare with `<` and not `<=` when popping?",
      solution: true,
      options: [
        { text: "The answer must be strictly **greater**; equal values don't count", correct: true },
        { text: "`<=` would cause an infinite loop", why: "It would just give wrong answers for equal values." },
        { text: "No difference", why: "For `[2, 2]`, `<=` would give `[2, 2]` instead of `[-1, -1]`." },
      ],
      explanation: "Equal values must stay on the stack, waiting for a truly greater value.",
    },
  ],

  "asteroid-collision": [
    {
      kind: "type",
      prompt: "Fill in when a collision can happen: incoming moves left and the top moves right.",
      code: `
while alive and asteroid < 0 and stack and stack[-1] ___ 0:`,
      answers: [">"],
      explanation: "Only a right-moving asteroid (on the stack) and a left-moving one (incoming) can meet.",
    },
    {
      kind: "type",
      prompt: "`asteroids = [5, 10, -5]`. What is returned?",
      solution: true,
      answers: ["[5, 10]", "5, 10", "5 10"],
      explanation: "-5 hits 10 and explodes. 5 and 10 move the same way and never meet.",
    },
    {
      kind: "type",
      prompt: "`asteroids = [8, -8]`. What is returned? (type `[]` for empty)",
      solution: true,
      answers: ["[]"],
      explanation: "Equal sizes: both explode.",
    },
    {
      kind: "type",
      prompt: "`asteroids = [10, 2, -5]`. What is returned?",
      solution: true,
      answers: ["[10]", "10"],
      explanation: "-5 destroys 2, then hits 10 and explodes.",
    },
    {
      kind: "type",
      prompt: "`asteroids = [-2, -1, 1, 2]`. What is returned?",
      solution: true,
      answers: ["[-2, -1, 1, 2]", "-2, -1, 1, 2", "-2 -1 1 2"],
      explanation: "Left-movers are on the left and right-movers on the right. They move apart and never meet.",
      mistakes: [{ answers: ["[]"], why: "A left-mover followed by a right-mover drift apart. Only right-then-left collide." }],
    },
    {
      kind: "type",
      prompt: "Fill in the comparison where the top asteroid explodes and the incoming one keeps going.",
      code: `
if stack[-1] ___ -asteroid:
    stack.pop()`,
      answers: ["<"],
      explanation: "The incoming asteroid's size is `-asteroid`. If the top is smaller, the top explodes.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n²)", why: "Each asteroid is pushed once and popped at most once." },
        { text: "O(n log n)", why: "No sorting is involved." },
      ],
      explanation: "Each asteroid enters and leaves the stack at most once.",
    },
    {
      kind: "choice",
      prompt: "Why does `[-3, 5]` produce no collision?",
      options: [
        { text: "-3 moves left and 5 moves right: they move apart", correct: true },
        { text: "Because 5 > 3", why: "Sizes don't matter if they never meet." },
        { text: "Because the stack is empty", why: "When 5 arrives, -3 is on the stack, but they move apart." },
      ],
      explanation: "Only a right-mover on the left and a left-mover on the right collide.",
    },
    {
      kind: "choice",
      prompt: "Why is a stack the right tool?",
      options: [
        { text: "An incoming left-mover hits the **most recent** surviving right-mover first", correct: true },
        { text: "Because asteroids are sorted by size", why: "Order is by position, not size." },
        { text: "To count explosions", why: "We track survivors, not counts." },
      ],
      explanation: "The closest right-mover is the last one added, which is the top of the stack.",
    },
    {
      kind: "choice",
      prompt: "What does the `alive` flag do?",
      solution: true,
      options: [
        { text: "Stops the collision loop and the push once the incoming asteroid has exploded", correct: true },
        { text: "Marks asteroids on the stack as destroyed", why: "Destroyed stack asteroids are popped. `alive` is only about the incoming one." },
        { text: "Counts survivors", why: "It's a boolean for the current asteroid." },
      ],
      explanation: "An exploded incoming asteroid must not be pushed.",
    },
  ],

  "online-stock-span": [
    {
      kind: "type",
      prompt: "Fill in the comparison that absorbs earlier prices.",
      code: `
while self.stack and self.stack[-1][0] ___ price:
    span += self.stack.pop()[1]`,
      answers: ["<="],
      explanation: "The span counts days with price **less than or equal to** today's.",
      mistakes: [{ answers: ["<"], why: "Equal prices count toward the span too." }],
    },
    {
      kind: "type",
      prompt: "Fill in the starting span.",
      code: `
span = ___`,
      answers: ["1"],
      explanation: "Today always counts.",
    },
    {
      kind: "type",
      prompt: "Prices 100, 80, 60, 70, 60, 75. What does `next(75)` return?",
      solution: true,
      answers: ["4"],
      explanation: "75 absorbs 60 (span 1) and 70 (span 2, which covers 60 and 70): 1 + 1 + 2 = 4 days.",
    },
    {
      kind: "type",
      prompt: "Prices 100, 80, 60, 70, 60, 75, 85. What does `next(85)` return?",
      solution: true,
      answers: ["6"],
      explanation: "85 absorbs 75 (span 4) and 80 (span 1): 1 + 4 + 1 = 6.",
    },
    {
      kind: "type",
      prompt: "Prices 100, 80, 60, 70, 60, 75. How many entries are on the stack after `next(75)`?",
      solution: true,
      answers: ["3"],
      explanation: "The stack holds `(100, 1)`, `(80, 1)`, `(75, 4)`.",
    },
    {
      kind: "type",
      prompt: "Fill in what is stored for today.",
      code: `
self.stack.append((price, ___))`,
      answers: ["span"],
      explanation: "Storing the span lets a later higher price absorb all those days in one pop.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity of `next`?",
      solution: true,
      options: [
        { text: "Amortized O(1)", correct: true },
        { text: "O(n) every call", why: "One call can pop many entries, but each entry is popped only once ever." },
        { text: "O(log n)", why: "There's no binary search or heap." },
      ],
      explanation: "Every price is pushed once and popped at most once over all calls.",
    },
    {
      kind: "choice",
      prompt: "Why store `(price, span)` pairs instead of just prices?",
      options: [
        { text: "So popped days aren't lost: their span is folded into the price that absorbed them", correct: true },
        { text: "To sort by span", why: "Nothing is sorted." },
        { text: "The span isn't needed after it's returned", why: "It is: a later higher price adds it to its own span." },
      ],
      explanation: "Each stack entry stands for a run of consecutive days.",
    },
    {
      kind: "choice",
      prompt: "What order do prices on the stack have, from bottom to top?",
      options: [
        { text: "Strictly decreasing", correct: true },
        { text: "Strictly increasing", why: "Any price ≥ the top pops it, so higher prices never sit above lower ones." },
        { text: "No particular order", why: "The popping rule keeps them decreasing." },
      ],
      explanation: "It's a monotonic decreasing stack, like Daily Temperatures.",
    },
    {
      kind: "choice",
      prompt: "What is the space complexity after n calls?",
      solution: true,
      options: [
        { text: "O(n) in the worst case", correct: true },
        { text: "O(1)", why: "With strictly decreasing prices, nothing is ever popped." },
        { text: "O(log n)", why: "Nothing limits the stack to log n entries." },
      ],
      explanation: "A falling market keeps every day on the stack.",
    },
  ],

  "decode-string": [
    {
      kind: "type",
      prompt: "Fill in how a multi-digit count is built.",
      code: `
if character.isdigit():
    count = count * ___ + int(character)`,
      answers: ["10"],
      explanation: "Reading `\"12\"`: 0·10 + 1 = 1, then 1·10 + 2 = 12.",
    },
    {
      kind: "type",
      prompt: "Fill in the new `current` after a closing bracket.",
      code: `
before, repeat = stack.pop()
current = ___`,
      answers: ["before + current * repeat"],
      explanation: "Repeat the inside, then attach it to the text that came before the bracket.",
      mistakes: [{ answers: ["current * repeat + before"], why: "The text before the bracket comes **first**." }],
    },
    {
      kind: "type",
      prompt: "`s = \"3[a]2[bc]\"`. What is returned?",
      solution: true,
      answers: ["aaabcbc"],
      explanation: "`aaa` + `bcbc`.",
    },
    {
      kind: "type",
      prompt: "`s = \"3[a2[c]]\"`. What is returned?",
      solution: true,
      answers: ["accaccacc"],
      explanation: "The inside `a2[c]` is `acc`, repeated 3 times.",
    },
    {
      kind: "type",
      prompt: "`s = \"2[abc]3[cd]ef\"`. What is returned?",
      solution: true,
      answers: ["abcabccdcdcdef"],
      explanation: "`abcabc` + `cdcdcd` + `ef`.",
    },
    {
      kind: "type",
      prompt: "`s = \"10[a]\"`. How many characters long is the result?",
      solution: true,
      answers: ["10"],
      explanation: "The count is 10, not 1 then 0, because digits accumulate.",
      mistakes: [{ answers: ["1", "0"], why: "Multi-digit counts are read as one number: `count * 10 + digit`." }],
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(output length)", correct: true },
        { text: "O(input length)", why: "A short input like `\"100[100[a]]\"` produces 10,000 characters." },
        { text: "O(log n)", why: "Building the output takes at least as long as its length." },
      ],
      explanation: "The work is dominated by building the repeated strings.",
    },
    {
      kind: "choice",
      prompt: "What is saved on the stack at `[`?",
      solution: true,
      options: [
        { text: "The text built so far and the count for this bracket", correct: true },
        { text: "Only the count", why: "The text before the bracket must also be saved, or it would be lost." },
        { text: "The position of the bracket", why: "We save values, not positions, so we never re-scan." },
      ],
      explanation: "Inside the brackets we start fresh; on `]` we restore and combine.",
    },
    {
      kind: "choice",
      prompt: "Why use a stack instead of a single pair of variables?",
      options: [
        { text: "Brackets nest, so each open bracket needs its own saved state", correct: true },
        { text: "Because strings are immutable", why: "Immutability is unrelated. Nesting is the reason." },
        { text: "To reverse the output", why: "Nothing is reversed." },
      ],
      explanation: "`3[a2[c]]` needs the outer state saved while the inner one is decoded.",
    },
    {
      kind: "choice",
      prompt: "What other approach also works?",
      options: [
        { text: "Recursion: decode the inside of each bracket with a recursive call", correct: true },
        { text: "Regular expression replace, once", why: "One pass can't handle nesting; it would need repeating until no brackets are left." },
        { text: "Sorting the characters", why: "Order matters in the output." },
      ],
      explanation: "The call stack plays the role of the explicit stack.",
    },
  ],

  "remove-k-digits": [
    {
      kind: "type",
      prompt: "Fill in the condition for removing the previous digit.",
      code: `
while k and stack and stack[-1] ___ digit:
    stack.pop()
    k -= 1`,
      answers: [">"],
      explanation: "A bigger digit followed by a smaller one: dropping the bigger one makes the number smaller.",
      mistakes: [{ answers: [">="], why: "Removing an equal digit doesn't make the number smaller, and wastes a removal." }],
    },
    {
      kind: "type",
      prompt: "Fill in what happens to leftover removals.",
      code: `
if k:
    stack = stack[___]`,
      answers: [":-k", "0:-k", ":len(stack) - k"],
      explanation: "The stack is non-decreasing, so the largest digits are at the end. Drop the last k.",
    },
    {
      kind: "type",
      prompt: "`num = \"1432219\"`, `k = 3`. What is returned?",
      solution: true,
      answers: ["1219"],
      explanation: "Remove 4, 3 and one 2: `1219`.",
    },
    {
      kind: "type",
      prompt: "`num = \"10200\"`, `k = 1`. What is returned?",
      solution: true,
      answers: ["200"],
      explanation: "Remove the 1 to get `0200`, then strip the leading zero.",
    },
    {
      kind: "type",
      prompt: "`num = \"12345\"`, `k = 2`. What is returned?",
      solution: true,
      answers: ["123"],
      explanation: "The digits only increase, so nothing pops; the last 2 digits are dropped at the end.",
    },
    {
      kind: "type",
      prompt: "`num = \"10\"`, `k = 2`. What is returned?",
      solution: true,
      answers: ["0"],
      explanation: "Everything is removed. An empty result is `\"0\"`.",
      mistakes: [{ answers: ["\"\"", "''", "empty"], why: "The problem wants `\"0\"` for an empty number: that's the `or \"0\"`." }],
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n · k)", why: "That's re-scanning for each removal. Each digit is pushed and popped once." },
        { text: "O(n log n)", why: "Nothing is sorted." },
      ],
      explanation: "A monotonic stack: one push and at most one pop per digit.",
    },
    {
      kind: "choice",
      prompt: "Why is it greedy-correct to remove a digit that's bigger than the next one?",
      options: [
        { text: "The leftmost position matters most; lowering an earlier digit beats anything later", correct: true },
        { text: "Bigger digits are always removed", why: "`\"12345\"` keeps its big digits until the end." },
        { text: "It removes the largest digit", why: "It removes the first digit that's followed by a smaller one." },
      ],
      explanation: "Numbers are compared left to right, so make the earliest digits as small as possible.",
    },
    {
      kind: "choice",
      prompt: "Why strip leading zeros at the end?",
      solution: true,
      options: [
        { text: "The result must be a normal number string, like `\"200\"` not `\"0200\"`", correct: true },
        { text: "Zeros count as removals", why: "Stripping zeros doesn't use any of the k removals." },
        { text: "Zeros make the number bigger", why: "Leading zeros don't change the value, only the format." },
      ],
      explanation: "`lstrip(\"0\")` cleans the format; `or \"0\"` handles the empty case.",
    },
    {
      kind: "choice",
      prompt: "What does the stack look like (bottom to top) after the loop, before the final trim?",
      options: [
        { text: "Non-decreasing digits (while removals remained)", correct: true },
        { text: "Strictly decreasing digits", why: "Bigger digits get popped by smaller ones, so it trends upward." },
        { text: "Sorted ascending always", why: "Once k hits 0, nothing is popped, so later digits are kept as they come." },
      ],
      explanation: "That's why leftover removals come from the end: the largest digits are there.",
    },
  ],

  "sum-of-subarray-minimums": [
    {
      kind: "type",
      prompt: "Fill in how many subarrays have `arr[index]` as their minimum.",
      code: `
return sum(arr[index] * left[index] * ___ for index in range(length)) % MODULO`,
      answers: ["right[index]"],
      explanation: "A subarray can start at any of `left[index]` positions and end at any of `right[index]`: left × right choices.",
    },
    {
      kind: "type",
      prompt: "Fill in the modulo.",
      code: `
MODULO = 10**9 + ___`,
      answers: ["7"],
      explanation: "The problem asks for the answer modulo 10⁹ + 7.",
    },
    {
      kind: "type",
      prompt: "`arr = [3, 1, 2, 4]`. What is returned?",
      solution: true,
      answers: ["17"],
      explanation: "The minimums of all 10 subarrays are 3, 1, 2, 4, 1, 1, 2, 1, 1, 1, which sum to 17.",
    },
    {
      kind: "type",
      prompt: "`arr = [3, 1, 2, 4]`. In how many subarrays is 1 the minimum?",
      solution: true,
      answers: ["6"],
      explanation: "It can start at index 0 or 1 (`left = 2`) and end at index 1, 2 or 3 (`right = 3`): 2 × 3 = 6.",
    },
    {
      kind: "type",
      prompt: "`arr = [1, 1]`. What is returned?",
      solution: true,
      answers: ["3"],
      explanation: "Subarrays `[1]`, `[1]`, `[1, 1]` all have minimum 1. The tie rules count `[1, 1]` only once.",
      mistakes: [{ answers: ["4"], why: "That double-counts `[1, 1]`. One side uses `>=` and the other `>`, so each subarray is credited to exactly one minimum." }],
    },
    {
      kind: "type",
      prompt: "Fill in the first pass's pop condition (previous **strictly smaller** value).",
      code: `
while stack and arr[stack[-1]] ___ arr[index]:
    stack.pop()`,
      answers: [">="],
      explanation: "Pop everything not strictly smaller, so the top is the previous strictly smaller value.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n²)", why: "That's computing the minimum of every subarray. Here each element's contribution is computed directly." },
        { text: "O(n log n)", why: "No sorting; two monotonic stack passes." },
      ],
      explanation: "Two passes, each pushing and popping every index once.",
    },
    {
      kind: "choice",
      prompt: "Why is one side strict (`>=` pop) and the other not (`>` pop)?",
      solution: true,
      options: [
        { text: "So subarrays with equal minimums are counted for exactly one of them", correct: true },
        { text: "It doesn't matter", why: "With both strict or both non-strict, equal values would double-count or miss subarrays." },
        { text: "To handle negative numbers", why: "Values are positive here. It's about ties." },
      ],
      explanation: "With `[1, 1]`, the subarray `[1, 1]` must be credited to one of the two 1s, not both.",
    },
    {
      kind: "choice",
      prompt: "What's the key idea behind this solution?",
      options: [
        { text: "Instead of looping over subarrays, count for each element how many subarrays it is the minimum of", correct: true },
        { text: "Sort the array, then sum", why: "Sorting loses the positions that define subarrays." },
        { text: "Dynamic programming over subarray lengths", why: "There's a DP variant, but this one is contribution counting." },
      ],
      explanation: "Sum = Σ value × (number of subarrays where it's the minimum).",
    },
    {
      kind: "choice",
      prompt: "What does `left[index]` measure?",
      solution: true,
      options: [
        { text: "How many start positions keep `arr[index]` as the minimum, up to the previous strictly smaller value", correct: true },
        { text: "The index of the previous smaller value", why: "It's a distance (count of choices), not an index." },
        { text: "The number of elements to the left", why: "It stops at the previous smaller value, not the array start." },
      ],
      explanation: "If there's no smaller value, it reaches all the way to the start: `index + 1`.",
    },
  ],

  "largest-rectangle-in-histogram": [
    {
      kind: "type",
      prompt: "Fill in the value appended to flush the stack at the end.",
      code: `
for index, bar in enumerate(heights + [___]):`,
      answers: ["0"],
      explanation: "A bar of height 0 is lower than everything, so it pops every remaining bar.",
    },
    {
      kind: "type",
      prompt: "Fill in the width of the rectangle.",
      code: `
height = heights[stack.pop()]
left = stack[-1] if stack else -1
best = max(best, height * (___))`,
      answers: ["index - left - 1"],
      explanation: "The rectangle spans strictly between `left` and `index`, which is `index - left - 1` bars.",
      mistakes: [{ answers: ["index - left"], why: "Both `left` and `index` are lower bars, so they're outside the rectangle." }],
    },
    {
      kind: "type",
      prompt: "`heights = [2, 1, 5, 6, 2, 3]`. What is returned?",
      solution: true,
      answers: ["10"],
      explanation: "Bars 5 and 6 give a rectangle of height 5 and width 2: 10.",
    },
    {
      kind: "type",
      prompt: "`heights = [2, 2, 2]`. What is returned?",
      solution: true,
      answers: ["6"],
      explanation: "Height 2 across all 3 bars.",
    },
    {
      kind: "type",
      prompt: "`heights = [6, 2, 5, 4, 5, 1, 6]`. What is returned?",
      solution: true,
      answers: ["12"],
      explanation: "Height 4 across `[5, 4, 5]` gives 12.",
    },
    {
      kind: "type",
      prompt: "Fill in the left boundary when the stack is empty after popping.",
      code: `
left = stack[-1] if stack else ___`,
      answers: ["-1"],
      explanation: "No lower bar on the left, so the rectangle reaches index 0. Using -1 makes the width formula work.",
      mistakes: [{ answers: ["0"], why: "With 0, the width would be one bar too short." }],
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n²)", why: "That's expanding left and right from every bar. Each bar is pushed and popped once." },
        { text: "O(n log n)", why: "That's divide and conquer by the minimum bar." },
      ],
      explanation: "A monotonic stack: one push and one pop per bar.",
    },
    {
      kind: "choice",
      prompt: "When a bar is popped, what do we know?",
      options: [
        { text: "Its rectangle can't extend further right, and the bar below it on the stack is its left limit", correct: true },
        { text: "It's the tallest bar", why: "It's taller than the current bar, but not necessarily the tallest." },
        { text: "Its rectangle has width 1", why: "Its width runs from the bar below it on the stack to the current index." },
      ],
      explanation: "Popping fixes both boundaries of the widest rectangle at that height.",
    },
    {
      kind: "choice",
      prompt: "What order do heights on the stack have, from bottom to top?",
      options: [
        { text: "Increasing", correct: true },
        { text: "Decreasing", why: "A lower bar pops taller ones, so the top is the tallest remaining." },
        { text: "Random", why: "The popping rule keeps them increasing." },
      ],
      explanation: "A monotonic increasing stack: each bar's left limit is the bar just below it.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(1)", why: "An increasing histogram keeps every index on the stack." },
        { text: "O(log n)", why: "Nothing bounds the stack by log n." },
      ],
      explanation: "The stack can hold every index.",
    },
  ],
});
