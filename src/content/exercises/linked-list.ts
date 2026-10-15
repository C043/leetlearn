import { defineExercises } from "./types";

export default defineExercises({
  "reverse-linked-list": [
    {
      kind: "type",
      prompt: "Fill in the line that saves the rest of the list before the link is broken.",
      code: `
while current:
    following = ___
    current.next = previous
    previous, current = current, following`,
      answers: ["current.next"],
      explanation: "Once `current.next` is pointed backwards, the rest of the list is unreachable, so it's saved first.",
    },
    {
      kind: "type",
      prompt: "Fill in where `current` should point now.",
      code: `
following = current.next
current.next = ___`,
      answers: ["previous"],
      explanation: "Each node is turned around to point at the node before it.",
    },
    {
      kind: "type",
      prompt: "Fill in what is returned.",
      code: `
return ___`,
      answers: ["previous"],
      explanation: "When `current` becomes `None`, `previous` is the old last node, which is the new head.",
      mistakes: [{ answers: ["current"], why: "`current` is `None` when the loop ends." }, { answers: ["head"], why: "The old head is now the **last** node." }],
    },
    {
      kind: "type",
      prompt: "Fill in the starting value of `previous`.",
      code: `
previous, current = ___, head`,
      answers: ["None"],
      explanation: "The old head becomes the last node, so it must point to `None`.",
    },
    {
      kind: "type",
      prompt: "`head = [1, 2, 3, 4, 5]`. What is the reversed list?",
      solution: true,
      answers: ["[5, 4, 3, 2, 1]", "5, 4, 3, 2, 1", "5 4 3 2 1"],
      explanation: "Every link is flipped, so the list reads backwards.",
    },
    {
      kind: "type",
      prompt: "`head = [1, 2, 3, 4, 5]`. After the loop body runs twice, what is the value of `previous`?",
      solution: true,
      answers: ["2"],
      explanation: "After step 1, `previous` is node 1. After step 2, it's node 2 (with 2 → 1).",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n²)", why: "That's repeatedly walking to the tail. Each node is flipped once here." },
        { text: "O(log n)", why: "Every node must be touched." },
      ],
      explanation: "One pass, one link flip per node.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity of this iterative version?",
      solution: true,
      options: [
        { text: "O(1)", correct: true },
        { text: "O(n)", why: "That's the recursive version (call stack) or copying values into an array." },
        { text: "O(log n)", why: "There's no recursion here." },
      ],
      explanation: "Three pointers: `previous`, `current`, `following`.",
    },
    {
      kind: "choice",
      prompt: "What happens if you set `current.next = previous` **before** saving `current.next`?",
      options: [
        { text: "The rest of the list is lost", correct: true },
        { text: "Nothing; the order doesn't matter", why: "After the overwrite, `current.next` is `previous`, so the old next node is gone." },
        { text: "The list gets a cycle", why: "No cycle is created. You just lose the remaining nodes." },
      ],
      explanation: "That's why every reversal saves `following` first.",
    },
    {
      kind: "choice",
      prompt: "Which pattern is this reversal loop a building block for?",
      options: [
        { text: "Reverse Linked List II, Reorder List and Reverse Nodes in k-Group", correct: true },
        { text: "Merge Two Sorted Lists", why: "Merging relinks nodes in order without reversing any." },
        { text: "Add Two Numbers", why: "The digits are already stored in reverse. No list is reversed." },
      ],
      explanation: "Many list problems reverse a section and then reconnect it.",
    },
  ],

  "merge-two-sorted-lists": [
    {
      kind: "type",
      prompt: "Fill in the comparison that picks `list1`'s node.",
      code: `
if list1.val ___ list2.val:
    tail.next, list1 = list1, list1.next
else:
    tail.next, list2 = list2, list2.next`,
      answers: ["<=", "<"],
      explanation: "Take the smaller head. On a tie either works; `<=` keeps equal values in their original order.",
    },
    {
      kind: "type",
      prompt: "Fill in what is attached after the loop.",
      code: `
tail.next = ___`,
      answers: ["list1 or list2"],
      explanation: "One list is exhausted, and the other is already sorted, so attach it whole.",
    },
    {
      kind: "type",
      prompt: "Fill in what is returned.",
      code: `
return ___`,
      answers: ["dummy.next"],
      explanation: "`dummy` is a placeholder; the real merged list starts after it.",
      mistakes: [{ answers: ["dummy"], why: "That includes the placeholder node (value 0) at the front." }],
    },
    {
      kind: "type",
      prompt: "`list1 = [1, 2, 4]`, `list2 = [1, 3, 4]`. What is the merged list?",
      solution: true,
      answers: ["[1, 1, 2, 3, 4, 4]", "1, 1, 2, 3, 4, 4", "1 1 2 3 4 4"],
      explanation: "Repeatedly take the smaller head.",
    },
    {
      kind: "type",
      prompt: "`list1 = []`, `list2 = [0]`. What is the merged list?",
      solution: true,
      answers: ["[0]", "0"],
      explanation: "The loop never runs, and `tail.next = list2` attaches `[0]`.",
    },
    {
      kind: "type",
      prompt: "`list1 = [5]`, `list2 = [1, 2]`. How many times does the `while` body run?",
      solution: true,
      answers: ["2"],
      explanation: "It takes 1 and then 2 from `list2`. Then `list2` is empty, so `[5]` is attached without looping.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity, with lengths m and n?",
      solution: true,
      options: [
        { text: "O(m + n)", correct: true },
        { text: "O(m · n)", why: "Each step takes one node; there's no inner loop." },
        { text: "O((m + n) log(m + n))", why: "That's concatenating and sorting. Merging already-sorted lists is linear." },
      ],
      explanation: "At most m + n steps, and often fewer, since the leftover is attached in O(1).",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(1): existing nodes are relinked", correct: true },
        { text: "O(m + n)", why: "No new nodes are created except the dummy." },
        { text: "O(log(m + n))", why: "There's no recursion in this version." },
      ],
      explanation: "The merged list is built from the original nodes.",
    },
    {
      kind: "choice",
      prompt: "Why use a `dummy` node?",
      options: [
        { text: "So the first node is appended exactly like the others, without special-casing the head", correct: true },
        { text: "To hold the smallest value", why: "Its value is never read." },
        { text: "So the lists don't get modified", why: "The original nodes are relinked either way." },
      ],
      explanation: "Without it, you'd need extra code to pick the head before the loop.",
    },
    {
      kind: "choice",
      prompt: "Which harder problem repeats this merge step many times?",
      options: [
        { text: "Merge k Sorted Lists (and the merge in Sort List)", correct: true },
        { text: "Reverse Linked List", why: "Reversal doesn't compare values." },
        { text: "Rotate List", why: "Rotation just moves a block of nodes." },
      ],
      explanation: "Merging two sorted lists is the core step of merge sort and of divide-and-conquer k-way merging.",
    },
  ],

  "add-two-numbers": [
    {
      kind: "type",
      prompt: "Fill in the loop condition so a final carry still produces a digit.",
      code: `
while l1 or l2 or ___:`,
      answers: ["carry"],
      explanation: "For 5 + 5 = 10, both lists end but the carry 1 still needs its own node.",
    },
    {
      kind: "type",
      prompt: "Fill in the split into carry and digit.",
      code: `
carry, digit = divmod(total, ___)`,
      answers: ["10"],
      explanation: "In base 10, `total // 10` is the carry and `total % 10` is the digit.",
    },
    {
      kind: "type",
      prompt: "`l1 = [2, 4, 3]`, `l2 = [5, 6, 4]` (342 + 465). What is the result list?",
      solution: true,
      answers: ["[7, 0, 8]", "7, 0, 8", "7 0 8"],
      explanation: "342 + 465 = 807, stored in reverse as 7 → 0 → 8.",
      mistakes: [{ answers: ["[8, 0, 7]", "8, 0, 7", "8 0 7"], why: "The result is stored in reverse order too: ones digit first." }],
    },
    {
      kind: "type",
      prompt: "`l1 = [5]`, `l2 = [5]`. What is the result list?",
      solution: true,
      answers: ["[0, 1]", "0, 1", "0 1"],
      explanation: "5 + 5 = 10: digit 0, then the carry becomes its own node, 1.",
      mistakes: [{ answers: ["[0]", "0"], why: "The final carry needs its own node: 10 has two digits." }],
    },
    {
      kind: "type",
      prompt: "`l1 = [9, 9, 9]`, `l2 = [1]` (999 + 1). How many nodes does the result have?",
      answers: ["4"],
      explanation: "999 + 1 = 1000, stored as 0 → 0 → 0 → 1.",
    },
    {
      kind: "type",
      prompt: "What is the largest possible value of `carry`?",
      solution: true,
      answers: ["1"],
      explanation: "The biggest total is 9 + 9 + 1 = 19, so the carry is at most 1.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity, with list lengths m and n?",
      solution: true,
      options: [
        { text: "O(max(m, n))", correct: true },
        { text: "O(m · n)", why: "That's schoolbook multiplication. Addition handles each digit position once." },
        { text: "O(1)", why: "Every digit must be visited." },
      ],
      explanation: "One step per digit position, plus possibly one for the final carry.",
    },
    {
      kind: "choice",
      prompt: "Why is reverse order convenient?",
      options: [
        { text: "Addition starts from the ones digit, which is the head", correct: true },
        { text: "It makes the numbers smaller", why: "The numbers are the same; only the storage order changes." },
        { text: "It allows binary search", why: "No searching happens here." },
      ],
      explanation: "Carries flow from low digits to high digits, and the lists are already in that order.",
    },
    {
      kind: "choice",
      prompt: "Why not convert both lists to integers, add, and convert back?",
      options: [
        { text: "In most languages the numbers can be up to 100 digits, which overflows fixed-size integers", correct: true },
        { text: "It gives the wrong answer in Python", why: "Python's big ints would work. The digit-by-digit method works in every language." },
        { text: "Converting is O(n²)", why: "It's linear. The issue is integer size in other languages." },
      ],
      explanation: "The digit-by-digit approach never needs a big integer.",
    },
    {
      kind: "choice",
      prompt: "What happens when one list is shorter?",
      solution: true,
      options: [
        { text: "Its missing digits count as 0, because `if l1:` / `if l2:` skip it", correct: true },
        { text: "The loop stops", why: "The loop continues while **either** list or the carry remains." },
        { text: "It raises an error", why: "Each list is checked before its `.val` is read." },
      ],
      explanation: "That's how 999 + 1 keeps going after the 1 runs out.",
    },
  ],

  "linked-list-in-binary-tree": [
    {
      kind: "type",
      prompt: "Fill in the base case: the whole list has been matched.",
      code: `
def matches(node, tree):
    if not ___:
        return True`,
      answers: ["node"],
      explanation: "If there are no list nodes left, every node matched.",
      mistakes: [{ answers: ["tree"], why: "Running out of tree is a **failure** (unless the list is also done), so it's checked after this." }],
    },
    {
      kind: "type",
      prompt: "Fill in the recursive continuation.",
      code: `
return matches(node.next, tree.left) ___ matches(node.next, tree.right)`,
      answers: ["or"],
      explanation: "The path can continue down **either** child.",
      mistakes: [{ answers: ["and"], why: "A path goes down one child only. Requiring both would almost never match." }],
    },
    {
      kind: "type",
      prompt: "Tree `[1, 2, 3]` (1 with children 2 and 3), `head = [1, 3]`. What is returned?",
      solution: true,
      answers: ["True"],
      explanation: "1 → 3 is a downward path.",
    },
    {
      kind: "type",
      prompt: "Tree `[1, 2, 3]`, `head = [2, 3]`. What is returned?",
      solution: true,
      answers: ["False"],
      explanation: "2 and 3 are siblings. A path must go from parent to child.",
      mistakes: [{ answers: ["True"], why: "2 and 3 are siblings; you can't step sideways in the tree." }],
    },
    {
      kind: "type",
      prompt: "Tree `[1, 2, 3]`, `head = [1, 2, 3]`. What is returned?",
      solution: true,
      answers: ["False"],
      explanation: "1 → 2 matches, but 2 has no children, so 3 can't be reached.",
    },
    {
      kind: "type",
      prompt: "Fill in the call that tries starting the match from the left subtree.",
      code: `
return matches(head, root) or self.isSubPath(head, ___) or self.isSubPath(head, root.right)`,
      answers: ["root.left"],
      explanation: "If the match doesn't start at `root`, it may start anywhere in either subtree.",
    },
    {
      kind: "choice",
      prompt: "What is the worst-case time complexity, with N tree nodes and list length L?",
      solution: true,
      options: [
        { text: "O(N · L)", correct: true },
        { text: "O(N + L)", why: "That needs a KMP-style approach. Here each tree node may start a match of up to L steps." },
        { text: "O(N log N)", why: "There's no sorting or halving." },
      ],
      explanation: "Every tree node can be a starting point, and each attempt walks at most L levels.",
    },
    {
      kind: "choice",
      prompt: "Why are there two recursive functions?",
      options: [
        { text: "`isSubPath` picks the starting node; `matches` checks a path from that fixed start", correct: true },
        { text: "One handles the left subtree and one the right", why: "Both functions recurse on both children." },
        { text: "It's redundant; one function would do", why: "Mixing them would let a failed match \"restart\" in the middle of the list." },
      ],
      explanation: "Once a match has started, it must continue unbroken; that's why it's a separate function.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity, with tree height H?",
      solution: true,
      options: [
        { text: "O(H) recursion depth", correct: true },
        { text: "O(1)", why: "Recursion uses stack frames." },
        { text: "O(N · L)", why: "Frames are popped as calls return; the stack is never deeper than about the tree height." },
      ],
      explanation: "Both recursions go at most one tree level per call.",
    },
    {
      kind: "choice",
      prompt: "What counts as a valid path here?",
      options: [
        { text: "A chain going from a node to one of its children, repeatedly, starting anywhere", correct: true },
        { text: "Any set of nodes with the right values", why: "The nodes must form a parent-to-child chain." },
        { text: "A path that must start at the root", why: "It can start at any node." },
      ],
      explanation: "\"Downward\" means each step goes from parent to child.",
    },
  ],

  "odd-even-linked-list": [
    {
      kind: "type",
      prompt: "Fill in the line that links the odd list to the even list at the end.",
      code: `
odd.next = ___
return head`,
      answers: ["even_head"],
      explanation: "The even list's first node was saved at the start so it can be attached after the last odd node.",
      mistakes: [{ answers: ["even"], why: "`even` is the **tail** of the even list by now, not its head." }],
    },
    {
      kind: "type",
      prompt: "Fill in the next odd node.",
      code: `
odd.next = ___
odd = odd.next`,
      answers: ["even.next"],
      explanation: "Nodes alternate odd, even, odd…, so the node after the current even node is the next odd one.",
    },
    {
      kind: "type",
      prompt: "`head = [1, 2, 3, 4, 5]`. What is the result?",
      solution: true,
      answers: ["[1, 3, 5, 2, 4]", "1, 3, 5, 2, 4", "1 3 5 2 4"],
      explanation: "Positions 1, 3, 5 first, then positions 2, 4.",
    },
    {
      kind: "type",
      prompt: "`head = [2, 1, 3, 5, 6, 4, 7]`. What is the result?",
      solution: true,
      answers: ["[2, 3, 6, 7, 1, 5, 4]", "2, 3, 6, 7, 1, 5, 4", "2 3 6 7 1 5 4"],
      explanation: "Odd positions: 2, 3, 6, 7. Even positions: 1, 5, 4. It's about positions, not whether values are odd.",
      mistakes: [{ answers: ["[1, 3, 5, 7, 2, 6, 4]", "1, 3, 5, 7, 2, 6, 4", "1 3 5 7 2 6 4"], why: "That groups by odd **values**. Odd and even refer to **positions**." }],
    },
    {
      kind: "type",
      prompt: "Fill in the loop condition.",
      code: `
while even and ___:`,
      answers: ["even.next"],
      explanation: "Each round needs a next odd node (`even.next`) to move to.",
    },
    {
      kind: "type",
      prompt: "`head = [1, 2]`. What is the result?",
      solution: true,
      answers: ["[1, 2]", "1, 2", "1 2"],
      explanation: "One odd and one even node: already in the right order.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n²)", why: "Each node is relinked once." },
        { text: "O(n log n)", why: "Nothing is sorted." },
      ],
      explanation: "One pass that unzips the list.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(1)", correct: true },
        { text: "O(n) for two new lists", why: "No nodes are created; the two chains reuse the original nodes." },
        { text: "O(n / 2)", why: "Still no new nodes. Only a few pointers." },
      ],
      explanation: "The problem requires O(1) extra space, and this uses three pointers.",
    },
    {
      kind: "choice",
      prompt: "What does \"odd\" mean in this problem?",
      options: [
        { text: "The node's position: 1st, 3rd, 5th, …", correct: true },
        { text: "The node's value is odd", why: "Values are irrelevant here." },
        { text: "The node's index in 0-based terms is odd", why: "Positions are 1-based: the head is position 1, an odd position." },
      ],
      explanation: "Positions are counted from 1 at the head.",
    },
    {
      kind: "choice",
      prompt: "Why save `even_head` at the start?",
      solution: true,
      options: [
        { text: "After unzipping, nothing else points to the first even node", correct: true },
        { text: "To count the even nodes", why: "Nothing is counted." },
        { text: "Because `head.next` still points to it", why: "`head.next` is changed to the second odd node in the first round." },
      ],
      explanation: "It's the only remaining handle on the even chain.",
    },
  ],

  "swap-nodes-in-pairs": [
    {
      kind: "type",
      prompt: "Fill in the loop condition: a full pair remains.",
      code: `
while previous.next and ___:`,
      answers: ["previous.next.next"],
      explanation: "Swapping needs two nodes. A single leftover node stays put.",
    },
    {
      kind: "type",
      prompt: "Fill in where the first node now links to.",
      code: `
first, second = previous.next, previous.next.next
previous.next = second
first.next = ___
second.next = first`,
      answers: ["second.next"],
      explanation: "After the swap, `first` comes last in the pair, so it links to whatever came after the pair.",
    },
    {
      kind: "type",
      prompt: "Fill in where `previous` moves after the swap.",
      code: `
previous = ___`,
      answers: ["first"],
      explanation: "`first` is now the second node of the swapped pair, so it's the node just before the next pair.",
      mistakes: [{ answers: ["second"], why: "`second` is now the **first** node of the pair. The next pair comes after `first`." }],
    },
    {
      kind: "type",
      prompt: "`head = [1, 2, 3, 4]`. What is the result?",
      solution: true,
      answers: ["[2, 1, 4, 3]", "2, 1, 4, 3", "2 1 4 3"],
      explanation: "Pairs (1, 2) and (3, 4) are each swapped.",
    },
    {
      kind: "type",
      prompt: "`head = [1, 2, 3]`. What is the result?",
      solution: true,
      answers: ["[2, 1, 3]", "2, 1, 3", "2 1 3"],
      explanation: "3 has no partner, so it stays at the end.",
    },
    {
      kind: "type",
      prompt: "`head = [1]`. What is the result?",
      solution: true,
      answers: ["[1]", "1"],
      explanation: "No full pair, so nothing changes.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n / 2), which is better than O(n)", why: "n/2 steps is still O(n)." },
        { text: "O(n²)", why: "Each pair is swapped once with O(1) work." },
      ],
      explanation: "n/2 swaps, each O(1).",
    },
    {
      kind: "choice",
      prompt: "Why not just swap the values of each pair?",
      options: [
        { text: "The problem forbids it: nodes themselves must be swapped", correct: true },
        { text: "Swapping values is slower", why: "It's not slower. It's just not allowed." },
        { text: "Values can't be swapped in Python", why: "They can: `a.val, b.val = b.val, a.val`." },
      ],
      explanation: "The point of the exercise is relinking pointers correctly.",
    },
    {
      kind: "choice",
      prompt: "Why does the head need a `dummy` before it?",
      solution: true,
      options: [
        { text: "The first pair also needs a \"node before\" to reconnect, and the head itself changes", correct: true },
        { text: "To store the pair count", why: "Its value is never read." },
        { text: "To prevent cycles", why: "It's about giving the first pair a predecessor." },
      ],
      explanation: "`dummy.next` ends up pointing at the new head (the old second node).",
    },
    {
      kind: "choice",
      prompt: "Which harder problem generalises this one?",
      options: [
        { text: "Reverse Nodes in k-Group (this is k = 2)", correct: true },
        { text: "Rotate List", why: "Rotation moves a block from the end to the front." },
        { text: "Odd Even Linked List", why: "That regroups by position without reversing." },
      ],
      explanation: "Swapping a pair is the same as reversing a group of 2.",
    },
  ],

  "rotate-list": [
    {
      kind: "type",
      prompt: "Fill in the step that ignores full rotations.",
      code: `
k ___ length`,
      answers: ["%="],
      explanation: "Rotating by `length` gives back the same list, so only `k % length` matters.",
    },
    {
      kind: "type",
      prompt: "Fill in how many steps to walk from the head to the new tail.",
      code: `
new_tail = head
for _ in range(___):
    new_tail = new_tail.next`,
      answers: ["length - k - 1"],
      explanation: "The new head is the node `length - k` positions in (0-based), so the new tail is one before it.",
      mistakes: [{ answers: ["length - k"], why: "That lands on the new **head**, one step too far." }],
    },
    {
      kind: "type",
      prompt: "`head = [1, 2, 3, 4, 5]`, `k = 2`. What is the result?",
      solution: true,
      answers: ["[4, 5, 1, 2, 3]", "4, 5, 1, 2, 3", "4 5 1 2 3"],
      explanation: "The last 2 nodes move to the front.",
    },
    {
      kind: "type",
      prompt: "`head = [0, 1, 2]`, `k = 4`. What is the result?",
      solution: true,
      answers: ["[2, 0, 1]", "2, 0, 1", "2 0 1"],
      explanation: "4 % 3 = 1, so it's a rotation by 1.",
    },
    {
      kind: "type",
      prompt: "`head = [1, 2]`, `k = 2`. What is the result?",
      solution: true,
      answers: ["[1, 2]", "1, 2", "1 2"],
      explanation: "2 % 2 = 0, so the list is unchanged.",
    },
    {
      kind: "type",
      prompt: "Fill in the line that closes the list into a ring.",
      code: `
tail.next = ___`,
      answers: ["head"],
      explanation: "With a ring, rotating is just choosing where to cut.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n · k)", why: "That's rotating one step at a time. `k %= length` and one cut avoid it." },
        { text: "O(k)", why: "We always count the whole list, and k may be huge." },
      ],
      explanation: "One pass to count, at most one more to find the cut.",
    },
    {
      kind: "choice",
      prompt: "Why compute `k %= length`?",
      options: [
        { text: "k can be up to 2·10⁹; full rotations change nothing", correct: true },
        { text: "To make k negative", why: "`%` with a positive length gives 0..length−1." },
        { text: "It's only an optimisation for small k", why: "Without it, the walk length would go negative when k ≥ length." },
      ],
      explanation: "Only the remainder determines the result.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(1)", correct: true },
        { text: "O(n)", why: "No array of nodes is built." },
        { text: "O(k)", why: "Nothing is stored per rotation step." },
      ],
      explanation: "A few pointers; nodes are relinked.",
    },
    {
      kind: "choice",
      prompt: "Why must `new_tail.next = None` be set?",
      solution: true,
      options: [
        { text: "Otherwise the ring stays closed and the list is infinite", correct: true },
        { text: "To free memory", why: "It's about breaking the ring." },
        { text: "It isn't needed if k is small", why: "The ring was closed regardless of k (unless k % length == 0, which returns early)." },
      ],
      explanation: "Making a ring and cutting it once is the whole trick.",
    },
  ],

  "reverse-linked-list-ii": [
    {
      kind: "type",
      prompt: "Fill in how many steps reach the node just before position `left`.",
      code: `
previous = dummy
for _ in range(___):
    previous = previous.next`,
      answers: ["left - 1"],
      explanation: "Starting at `dummy` (position 0), `left - 1` steps reach position `left - 1`.",
      mistakes: [{ answers: ["left"], why: "That lands **on** position `left`, not just before it." }],
    },
    {
      kind: "type",
      prompt: "Fill in how many nodes are moved to the front of the section.",
      code: `
for _ in range(___):
    moved = current.next
    current.next = moved.next
    moved.next = previous.next
    previous.next = moved`,
      answers: ["right - left"],
      explanation: "The section has `right - left + 1` nodes. The first one stays put while the other `right - left` move to the front.",
      mistakes: [{ answers: ["right - left + 1"], why: "The first node of the section doesn't move to the front: it ends up last on its own." }],
    },
    {
      kind: "type",
      prompt: "`head = [1, 2, 3, 4, 5]`, `left = 2`, `right = 4`. What is the result?",
      solution: true,
      answers: ["[1, 4, 3, 2, 5]", "1, 4, 3, 2, 5", "1 4 3 2 5"],
      explanation: "Positions 2..4 (2, 3, 4) are reversed to 4, 3, 2.",
    },
    {
      kind: "type",
      prompt: "`head = [3, 5]`, `left = 1`, `right = 2`. What is the result?",
      solution: true,
      answers: ["[5, 3]", "5, 3", "5 3"],
      explanation: "The whole list is reversed. `dummy` handles `left = 1`.",
    },
    {
      kind: "type",
      prompt: "`head = [5]`, `left = 1`, `right = 1`. What is the result?",
      solution: true,
      answers: ["[5]", "5"],
      explanation: "Reversing a single node changes nothing; the loop runs 0 times.",
    },
    {
      kind: "type",
      prompt: "In `[1, 2, 3, 4, 5]` with `left = 2`, `right = 4`, what is the list after the **first** head insertion?",
      solution: true,
      answers: ["[1, 3, 2, 4, 5]", "1, 3, 2, 4, 5", "1 3 2 4 5"],
      explanation: "`current` is 2. The node after it (3) is moved right after `previous` (1).",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n²)", why: "Each moved node is relinked in O(1)." },
        { text: "O(right − left)", why: "We first walk `left - 1` steps from the head, which can be up to n." },
      ],
      explanation: "One walk to `left`, then `right - left` constant-time moves.",
    },
    {
      kind: "choice",
      prompt: "What does \"head insertion\" mean here?",
      options: [
        { text: "Each next node is unlinked and inserted right after `previous`, at the front of the section", correct: true },
        { text: "Inserting at the head of the whole list", why: "Only the section's front (after `previous`) is used." },
        { text: "Copying values to the front", why: "Nodes are relinked; values are never copied." },
      ],
      explanation: "Repeatedly moving the next node to the front reverses the section in one pass.",
    },
    {
      kind: "choice",
      prompt: "Why does `current` never change inside the loop?",
      solution: true,
      options: [
        { text: "It's the section's original first node, which drifts to the end as others jump ahead of it", correct: true },
        { text: "It's a bug", why: "It's by design: `current.next` changes each time, so a new node is moved." },
        { text: "Because it's the head of the list", why: "It's the first node of the section, not of the list." },
      ],
      explanation: "`current.next` always points to the next node to move.",
    },
    {
      kind: "choice",
      prompt: "Why use `dummy` here?",
      solution: true,
      options: [
        { text: "When `left = 1` there's no real node before the section", correct: true },
        { text: "To store `right - left`", why: "Its value isn't used." },
        { text: "For the end of the list", why: "It sits before the head, not after the tail." },
      ],
      explanation: "With `dummy`, `previous` always exists.",
    },
  ],

  "split-linked-list-in-parts": [
    {
      kind: "type",
      prompt: "Fill in the base size and the number of bigger parts.",
      code: `
size, extra = ___(length, k)`,
      answers: ["divmod"],
      explanation: "Every part gets `length // k` nodes, and the first `length % k` parts get one extra.",
    },
    {
      kind: "type",
      prompt: "Fill in the condition for a part getting one extra node.",
      code: `
part_length = size + (1 if part ___ extra else 0)`,
      answers: ["<"],
      explanation: "Parts 0 .. extra − 1 get the extra node, so earlier parts are never smaller.",
      mistakes: [{ answers: ["<="], why: "That gives `extra + 1` parts an extra node, one too many." }],
    },
    {
      kind: "type",
      prompt: "`head = [1, 2, 3]`, `k = 5`. How many of the returned parts are empty?",
      solution: true,
      answers: ["2"],
      explanation: "3 nodes over 5 parts: `[1], [2], [3], [], []`.",
    },
    {
      kind: "type",
      prompt: "`head = [1, 2, ..., 10]`, `k = 3`. What is the size of the first part?",
      solution: true,
      answers: ["4"],
      explanation: "10 = 3·3 + 1, so the first part gets the extra node: sizes 4, 3, 3.",
    },
    {
      kind: "type",
      prompt: "`head = [1, 2, ..., 10]`, `k = 3`. What does the last part contain?",
      solution: true,
      answers: ["[8, 9, 10]", "8, 9, 10", "8 9 10"],
      explanation: "Parts: `[1–4]`, `[5–7]`, `[8–10]`.",
    },
    {
      kind: "type",
      prompt: "Fill in the line that cuts off the current part.",
      code: `
if current:
    current.next, current = ___, current.next`,
      answers: ["None"],
      explanation: "The part's last node must end with `None`; `current` moves on to the next part's first node.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n + k)", correct: true },
        { text: "O(n · k)", why: "Each node is walked over once across all parts." },
        { text: "O(n)", why: "When k > n we still create k entries in the result." },
      ],
      explanation: "One pass to count, one pass to split, and k entries in the output.",
    },
    {
      kind: "choice",
      prompt: "Why count the length first?",
      options: [
        { text: "Part sizes depend on the total length", correct: true },
        { text: "To check the list isn't circular", why: "The input has no cycle." },
        { text: "It isn't needed; we could split greedily", why: "Without the total, you can't make sizes differ by at most 1." },
      ],
      explanation: "`divmod(length, k)` gives exactly the size rule.",
    },
    {
      kind: "choice",
      prompt: "Why do the **first** parts get the extra nodes?",
      options: [
        { text: "The problem requires earlier parts to be at least as big as later ones", correct: true },
        { text: "So the last part is always empty", why: "The last part is empty only when k > n." },
        { text: "It doesn't matter which parts get them", why: "It does: the problem fixes the order." },
      ],
      explanation: "Sizes are non-increasing from left to right.",
    },
    {
      kind: "choice",
      prompt: "What is in the result when `k` is larger than the list length?",
      solution: true,
      options: [
        { text: "One-node parts, followed by `None` for the rest", correct: true },
        { text: "Fewer than k parts", why: "The result always has exactly k entries." },
        { text: "Some parts repeat nodes", why: "Each node appears in exactly one part." },
      ],
      explanation: "When `current` runs out, `parts.append(current)` appends `None`.",
    },
  ],

  "merge-k-sorted-lists": [
    {
      kind: "type",
      prompt: "Fill in the tie-breaker in each heap entry.",
      code: `
heap = [(node.val, ___, node) for index, node in enumerate(lists) if node]`,
      answers: ["index"],
      explanation: "If two values are equal, Python compares the next tuple item. `index` keeps it from ever comparing `ListNode`s, which would raise an error.",
    },
    {
      kind: "type",
      prompt: "Fill in the function that turns a list into a heap in place.",
      code: `
heapq.___(heap)`,
      answers: ["heapify"],
      explanation: "`heapify` arranges the list as a min-heap in O(k).",
    },
    {
      kind: "type",
      prompt: "Fill in what is pushed after taking a node.",
      code: `
if node.next:
    heapq.heappush(heap, (node.next.val, index, ___))`,
      answers: ["node.next"],
      explanation: "The taken node's successor becomes the new head of that list.",
    },
    {
      kind: "type",
      prompt: "`lists = [[1, 4, 5], [1, 3, 4], [2, 6]]`. What is the merged list?",
      solution: true,
      answers: ["[1, 1, 2, 3, 4, 4, 5, 6]", "1, 1, 2, 3, 4, 4, 5, 6", "1 1 2 3 4 4 5 6"],
      explanation: "Every node, in sorted order.",
    },
    {
      kind: "type",
      prompt: "`lists = [[]]` (one empty list). What is the merged list?",
      solution: true,
      answers: ["[]", "None"],
      explanation: "The empty list is filtered out (`if node`), so the heap is empty and `dummy.next` is `None`.",
    },
    {
      kind: "type",
      prompt: "`lists = [[1, 4, 5], [1, 3, 4], [2, 6]]`. What is the largest number of entries in the heap at any time?",
      solution: true,
      answers: ["3"],
      explanation: "The heap holds at most one node per list: k = 3.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity, with N total nodes and k lists?",
      solution: true,
      options: [
        { text: "O(N log k)", correct: true },
        { text: "O(N · k)", why: "That's scanning all k heads for each node. The heap finds the minimum in O(log k)." },
        { text: "O(N log N)", why: "That's collecting everything and sorting. The heap is only size k." },
      ],
      explanation: "Each of the N nodes is pushed and popped once, at O(log k) each.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(k) for the heap", correct: true },
        { text: "O(N)", why: "The heap holds only one node per list, and the result reuses nodes." },
        { text: "O(1)", why: "The heap grows with the number of lists." },
      ],
      explanation: "At most one entry per list is in the heap.",
    },
    {
      kind: "choice",
      prompt: "Why put only each list's **head** in the heap, not every node?",
      options: [
        { text: "The next smallest node is always one of the current heads", correct: true },
        { text: "Heaps can only hold k items", why: "Heaps can hold any number. A small heap is just cheaper." },
        { text: "Other nodes might be smaller", why: "Each list is sorted, so its head is its smallest remaining node." },
      ],
      explanation: "The heap only ever needs the frontier: one candidate per list.",
    },
    {
      kind: "choice",
      prompt: "What other O(N log k) approach exists?",
      options: [
        { text: "Divide and conquer: merge lists in pairs, halving the count each round", correct: true },
        { text: "Merge lists one by one into a running result", why: "That's O(N · k): the running result is re-walked k times." },
        { text: "Concatenate and sort", why: "That's O(N log N)." },
      ],
      explanation: "Pairwise merging has log k rounds, each touching all N nodes.",
    },
  ],
});
