import { defineExercises } from "./types";

export default defineExercises({
  "binary-tree-level-order-traversal-ii": [
    {
      kind: "type",
      prompt: "Fill in how many nodes to process this round.",
      code: `
while queue:
    level = []
    for _ in range(___):
        node = queue.popleft()`,
      answers: ["len(queue)"],
      explanation: "At the start of a round the queue holds exactly one level. Its length is frozen when `range` is created, so children added during the round wait for the next one.",
    },
    {
      kind: "type",
      prompt: "Fill in the deque method that takes the oldest node.",
      code: `
node = queue.___()`,
      answers: ["popleft"],
      explanation: "BFS is first-in-first-out: nodes come out in the order they were added.",
      mistakes: [{ answers: ["pop"], why: "`pop()` takes the newest node, which turns the walk into a depth-first one." }],
    },
    {
      kind: "type",
      prompt: "Fill in the final step that lists levels bottom-up.",
      code: `
return levels___`,
      answers: ["[::-1]"],
      explanation: "Build top-down as usual, then reverse the list of levels once.",
    },
    {
      kind: "type",
      prompt: "Tree `[3, 9, 20, None, None, 15, 7]`. What is the **first** list in the result?",
      solution: true,
      answers: ["[15, 7]", "15, 7", "15 7"],
      explanation: "Bottom-up, so the deepest level `[15, 7]` comes first.",
      mistakes: [{ answers: ["[3]", "3"], why: "That's the top level. This problem lists levels bottom-up." }],
    },
    {
      kind: "type",
      prompt: "Tree `[3, 9, 20, None, None, 15, 7]`. How many lists does the result have?",
      solution: true,
      answers: ["3"],
      explanation: "One per level: `[15, 7]`, `[9, 20]`, `[3]`.",
    },
    {
      kind: "type",
      prompt: "Empty tree. What is returned?",
      solution: true,
      answers: ["[]"],
      explanation: "The early return handles `root = None`.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n log n)", why: "Each node is queued once; the final reverse is over levels, at most n." },
        { text: "O(n²)", why: "That's inserting each level at the front of a list. Reversing once at the end avoids it." },
      ],
      explanation: "Every node is enqueued and dequeued once.",
    },
    {
      kind: "choice",
      prompt: "Why reverse at the end instead of inserting each level at the front?",
      solution: true,
      options: [
        { text: "`list.insert(0, …)` is O(number of levels) each time; one reverse is O(levels) total", correct: true },
        { text: "Inserting at the front gives the wrong order", why: "It gives the right order, just more slowly." },
        { text: "Python lists can't insert at the front", why: "They can, with `insert(0, x)`, but it shifts everything." },
      ],
      explanation: "A deque with `appendleft` would also work in O(1) per level.",
    },
    {
      kind: "choice",
      prompt: "Why use `collections.deque` instead of a list as the queue?",
      options: [
        { text: "`deque.popleft()` is O(1); `list.pop(0)` is O(n)", correct: true },
        { text: "Lists can't hold tree nodes", why: "They can. It's about the cost of removing from the front." },
        { text: "Deques keep items sorted", why: "Deques keep insertion order, just like lists." },
      ],
      explanation: "Popping from the front of a list shifts every remaining element.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(h)", why: "That's DFS. The BFS queue can hold a whole level, up to about n/2 nodes, and the output holds all n values." },
        { text: "O(1)", why: "The queue and the output both grow with n." },
      ],
      explanation: "The widest level can be about half the nodes, plus the output itself.",
    },
  ],

  "maximum-depth-of-binary-tree": [
    {
      kind: "type",
      prompt: "Fill in the depth of an empty tree.",
      code: `
if not root:
    return ___`,
      answers: ["0"],
      explanation: "No nodes, no depth. A single node then gets 1 + max(0, 0) = 1.",
    },
    {
      kind: "type",
      prompt: "Fill in the recursive formula.",
      code: `
return 1 + ___(self.maxDepth(root.left), self.maxDepth(root.right))`,
      answers: ["max"],
      explanation: "The depth follows the **deeper** subtree.",
      mistakes: [{ answers: ["min"], why: "`min` gives the shortest path, which is a different problem (Minimum Depth)." }],
    },
    {
      kind: "type",
      prompt: "Tree `[3, 9, 20, None, None, 15, 7]`. What is returned?",
      solution: true,
      answers: ["3"],
      explanation: "3 → 20 → 15 has three nodes.",
    },
    {
      kind: "type",
      prompt: "Tree `[1, None, 2]`. What is returned?",
      solution: true,
      answers: ["2"],
      explanation: "1 → 2: two nodes.",
    },
    {
      kind: "type",
      prompt: "Tree `[1, 2, 3, 4]`. What is returned?",
      solution: true,
      answers: ["3"],
      explanation: "1 → 2 → 4 is the longest path.",
    },
    {
      kind: "type",
      prompt: "With BFS instead, the depth equals the number of what?",
      answers: ["levels", "level", "rounds"],
      explanation: "Each BFS round handles one level, so counting rounds gives the depth.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(log n)", why: "We can't know the depth without visiting every node; the tree may be unbalanced." },
        { text: "O(n log n)", why: "Each node is visited once." },
      ],
      explanation: "Every node is visited once.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity of this recursive version?",
      solution: true,
      options: [
        { text: "O(h), the height", correct: true },
        { text: "O(w), the widest level", why: "That's the BFS version's queue." },
        { text: "O(1)", why: "Each recursive call uses a stack frame." },
      ],
      explanation: "The call stack is as deep as the tree.",
    },
    {
      kind: "choice",
      prompt: "When would BFS use less memory than this DFS?",
      options: [
        { text: "For a tall, thin tree (like a chain): BFS holds one node per level", correct: true },
        { text: "Always", why: "For a wide, balanced tree the BFS queue holds ~n/2 nodes, far more than log n frames." },
        { text: "Never", why: "In a chain, DFS uses n frames while BFS's queue holds 1 node at a time." },
      ],
      explanation: "DFS memory follows height; BFS memory follows width.",
    },
    {
      kind: "choice",
      prompt: "Why is this solution in a BFS pattern if it's written as recursion?",
      options: [
        { text: "Depth can be found either way; BFS counts levels, DFS takes 1 + max of children", correct: true },
        { text: "Recursion is BFS", why: "Recursion here is depth-first." },
        { text: "It isn't really a depth problem", why: "It is; both traversals answer it." },
      ],
      explanation: "It's a good example that the same question can be answered by either traversal.",
    },
  ],

  "binary-tree-level-order-traversal": [
    {
      kind: "type",
      prompt: "Fill in the container that starts the queue.",
      code: `
queue = ___([root])`,
      answers: ["deque", "collections.deque"],
      explanation: "A `deque` gives O(1) `popleft`.",
    },
    {
      kind: "type",
      prompt: "Fill in which child is queued first so each level reads left to right.",
      code: `
if node.___:
    queue.append(node.___)`,
      answers: ["left"],
      explanation: "Queue the left child before the right one; FIFO order keeps them left to right.",
    },
    {
      kind: "type",
      prompt: "Tree `[3, 9, 20, None, None, 15, 7]`. What is the second list in the result?",
      solution: true,
      answers: ["[9, 20]", "9, 20", "9 20"],
      explanation: "Level 2 holds 9 and 20.",
    },
    {
      kind: "type",
      prompt: "Tree `[1, 2, 3, 4, 5]`. What is the last list in the result?",
      solution: true,
      answers: ["[4, 5]", "4, 5", "4 5"],
      explanation: "The third level holds 4 and 5 (children of 2).",
    },
    {
      kind: "type",
      prompt: "Tree `[1, 2, 3, 4, 5]`. How many nodes are in the queue right after the root is processed?",
      solution: true,
      answers: ["2"],
      explanation: "The root's two children, 2 and 3.",
    },
    {
      kind: "type",
      prompt: "What does BFS stand for?",
      answers: ["breadth-first search", "breadth first search", "breadth-first", "breadth first"],
      explanation: "It explores level by level, across the breadth of the tree.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n · h)", why: "Each node is queued once, no matter the height." },
        { text: "O(n²)", why: "With a deque, every operation is O(1)." },
      ],
      explanation: "Each node is enqueued and dequeued once.",
    },
    {
      kind: "choice",
      prompt: "Why loop `range(len(queue))` instead of just `while queue`?",
      solution: true,
      options: [
        { text: "It separates the levels: one round of the outer loop per level", correct: true },
        { text: "It's faster", why: "Same number of operations. It's about grouping." },
        { text: "`while queue` would skip nodes", why: "It would visit everything, but couldn't tell where a level ends." },
      ],
      explanation: "The length at the start of a round is exactly the size of the current level.",
    },
    {
      kind: "choice",
      prompt: "Which data structure turns this into DFS?",
      options: [
        { text: "A stack (pop from the same end you push)", correct: true },
        { text: "A heap", why: "A heap orders by value, which is a different traversal (best-first)." },
        { text: "A set", why: "Sets have no order." },
      ],
      explanation: "Queue → breadth-first; stack → depth-first.",
    },
    {
      kind: "choice",
      prompt: "Which of these problems are small tweaks of this one?",
      options: [
        { text: "Zigzag order, right side view, level sums, largest value per row", correct: true },
        { text: "Validate BST and LCA", why: "Those are naturally depth-first." },
        { text: "Unique BSTs", why: "That's dynamic programming; no traversal." },
      ],
      explanation: "They all process one level per round and summarise it differently.",
    },
  ],

  "binary-tree-zigzag-level-order-traversal": [
    {
      kind: "type",
      prompt: "Fill in the starting direction.",
      code: `
left_to_right = ___`,
      answers: ["True"],
      explanation: "The first level is read left to right.",
    },
    {
      kind: "type",
      prompt: "Fill in how a right-to-left level is stored.",
      code: `
levels.append(level if left_to_right else ___)`,
      answers: ["level[::-1]"],
      explanation: "Collect each level left to right as usual, and reverse every other one.",
    },
    {
      kind: "type",
      prompt: "Fill in the direction flip.",
      code: `
left_to_right = ___`,
      answers: ["not left_to_right"],
      explanation: "Each level alternates direction.",
    },
    {
      kind: "type",
      prompt: "Tree `[3, 9, 20, None, None, 15, 7]`. What is the second list?",
      solution: true,
      answers: ["[20, 9]", "20, 9", "20 9"],
      explanation: "Level 2 is read right to left.",
    },
    {
      kind: "type",
      prompt: "Tree `[3, 9, 20, None, None, 15, 7]`. What is the third list?",
      solution: true,
      answers: ["[15, 7]", "15, 7", "15 7"],
      explanation: "Level 3 is back to left to right.",
    },
    {
      kind: "type",
      prompt: "Tree `[1, 2, 3, 4, 5, 6, 7]`. What is the second list?",
      solution: true,
      answers: ["[3, 2]", "3, 2", "3 2"],
      explanation: "Level 2, right to left.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n log n)", why: "Reversing a level is linear in its size; all levels together sum to n." },
        { text: "O(n²)", why: "Reversals total O(n) across all levels." },
      ],
      explanation: "BFS is O(n) and the reversals add O(n) in total.",
    },
    {
      kind: "choice",
      prompt: "Why keep children queued left to right even on reversed levels?",
      options: [
        { text: "The queue must stay in normal order; only the **output** of every other level is reversed", correct: true },
        { text: "Because the tree is balanced", why: "It works for any shape." },
        { text: "Queuing right to left would also work", why: "Then the next level's order would be scrambled too." },
      ],
      explanation: "Separate the traversal (always left to right) from the presentation (alternating).",
    },
    {
      kind: "choice",
      prompt: "What other way avoids reversing lists?",
      options: [
        { text: "Build each level in a deque, using `append` or `appendleft` depending on the direction", correct: true },
        { text: "Sort each level", why: "Sorting orders by value, not by position." },
        { text: "Use DFS", why: "DFS can do it with depth tracking, but it doesn't avoid the reversal idea." },
      ],
      explanation: "`appendleft` builds a reversed level directly.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(log n)", why: "The queue can hold a full level, and the output holds every value." },
        { text: "O(1)", why: "Both the queue and the result grow with n." },
      ],
      explanation: "Same as level order.",
    },
  ],

  "binary-tree-right-side-view": [
    {
      kind: "type",
      prompt: "Fill in the value added for each level.",
      code: `
for _ in range(len(queue)):
    node = queue.popleft()
    ...
view.append(___)`,
      answers: ["node.val"],
      explanation: "After the inner loop, `node` is the last one popped on this level: the rightmost.",
    },
    {
      kind: "type",
      prompt: "Tree `[1, 2, 3, None, 5, None, 4]`. What is returned?",
      solution: true,
      answers: ["[1, 3, 4]", "1, 3, 4", "1 3 4"],
      explanation: "The rightmost node of each level: 1, 3, 4.",
    },
    {
      kind: "type",
      prompt: "Tree `[1, 2, 3, 4]`. What is returned?",
      solution: true,
      answers: ["[1, 3, 4]", "1, 3, 4", "1 3 4"],
      explanation: "On level 3, 4 is the only node. It's a left child, but you still see it from the right.",
      mistakes: [{ answers: ["[1, 3]", "1, 3", "1 3"], why: "Level 3 has only node 4, and nothing blocks it from the right side." }],
    },
    {
      kind: "type",
      prompt: "Tree `[1, None, 3]`. What is returned?",
      solution: true,
      answers: ["[1, 3]", "1, 3", "1 3"],
      explanation: "One node per level.",
    },
    {
      kind: "type",
      prompt: "Tree `[1, 2, 3, 4, 5, 6, 7, 8]`. How many values does the result have?",
      solution: true,
      answers: ["4"],
      explanation: "One value per level, and this tree has 4 levels: `[1]`, `[2, 3]`, `[4–7]`, `[8]`.",
    },
    {
      kind: "type",
      prompt: "Empty tree. What is returned?",
      solution: true,
      answers: ["[]"],
      explanation: "Nothing to see.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(h)", why: "Following only right children misses left nodes that stick out further down." },
        { text: "O(n log n)", why: "Each node is visited once." },
      ],
      explanation: "Every node is visited once.",
    },
    {
      kind: "choice",
      prompt: "Why isn't following right children from the root enough?",
      options: [
        { text: "A deeper left subtree can be visible where the right side is shorter", correct: true },
        { text: "Right children might be `None`", why: "That's exactly when a left node shows through, which is the real reason." },
        { text: "It is enough", why: "`[1, 2, 3, 4]` shows 4, which is a left-side node." },
      ],
      explanation: "The view shows the last node on **each level**, wherever it is.",
    },
    {
      kind: "choice",
      prompt: "How would a DFS solve this?",
      options: [
        { text: "Visit right before left, and record a node when its depth equals the result's length", correct: true },
        { text: "Visit left before right and keep the first node per depth", why: "That gives the **left** side view." },
        { text: "DFS can't solve it", why: "It can, by tracking depth." },
      ],
      explanation: "Right-first DFS reaches each depth's rightmost node first.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity of this BFS?",
      solution: true,
      options: [
        { text: "O(w), the widest level", correct: true },
        { text: "O(h)", why: "That's DFS. BFS holds a level at a time." },
        { text: "O(1)", why: "The queue grows with the level size." },
      ],
      explanation: "The queue never holds more than about two levels.",
    },
  ],

  "populating-next-right-pointers-in-each-node": [
    {
      kind: "type",
      prompt: "Fill in where the left child's `next` points.",
      code: `
node.left.next = ___`,
      answers: ["node.right"],
      explanation: "Siblings under the same parent are neighbours.",
    },
    {
      kind: "type",
      prompt: "Fill in where the right child's `next` points (across parents).",
      code: `
if node.next:
    node.right.next = ___`,
      answers: ["node.next.left"],
      explanation: "The right child's neighbour is the left child of the parent's neighbour.",
    },
    {
      kind: "type",
      prompt: "Fill in how we move to the next level.",
      code: `
leftmost = ___`,
      answers: ["leftmost.left"],
      explanation: "In a perfect tree, the next level starts at the leftmost node's left child.",
    },
    {
      kind: "type",
      prompt: "Tree `[1, 2, 3, 4, 5, 6, 7]`. After `connect`, what is the value of `5.next`?",
      solution: true,
      answers: ["6"],
      explanation: "5 is 2's right child; 2's neighbour is 3, whose left child is 6.",
    },
    {
      kind: "type",
      prompt: "Same tree. What is `7.next`?",
      solution: true,
      answers: ["None"],
      explanation: "7 is the rightmost node of its level.",
    },
    {
      kind: "type",
      prompt: "Fill in the outer loop condition: stop at the last level.",
      code: `
while leftmost and ___:`,
      answers: ["leftmost.left"],
      explanation: "The last level has no children to wire up.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(1)", correct: true },
        { text: "O(w)", why: "That's a BFS queue. Here the `next` pointers of the level above act as the queue." },
        { text: "O(log n)", why: "There's no recursion." },
      ],
      explanation: "Walking a level via `next` replaces the queue.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n log n)", why: "Each node is visited once as a parent." },
        { text: "O(log n)", why: "Every node's `next` must be set." },
      ],
      explanation: "Every node is processed once.",
    },
    {
      kind: "choice",
      prompt: "What's the key trick for O(1) space?",
      options: [
        { text: "Use the already-linked level above to walk across while wiring the level below", correct: true },
        { text: "Recursion", why: "Recursion uses O(log n) stack space." },
        { text: "Store each level in an array", why: "That's O(n) space." },
      ],
      explanation: "Each level's `next` chain becomes the \"queue\" for wiring the next level.",
    },
    {
      kind: "choice",
      prompt: "What does \"perfect\" binary tree guarantee here?",
      options: [
        { text: "Every non-leaf node has exactly two children, so `node.left` and `node.right` always exist", correct: true },
        { text: "Values are sorted", why: "Perfect is about shape, not values." },
        { text: "The tree has an odd number of levels", why: "Any number of levels is possible." },
      ],
      explanation: "Without that guarantee (Problem II), you'd need to search for the next existing child.",
    },
  ],

  "count-complete-tree-nodes": [
    {
      kind: "type",
      prompt: "Fill in the node count of a perfect tree of depth `left_depth`.",
      code: `
if left_depth == right_depth:
    return (1 << left_depth) - ___`,
      answers: ["1"],
      explanation: "A perfect tree of depth d has 2^d − 1 nodes.",
    },
    {
      kind: "type",
      prompt: "What is `1 << 3`?",
      answers: ["8"],
      explanation: "Shifting 1 left by 3 bits gives 2³ = 8.",
    },
    {
      kind: "type",
      prompt: "Tree `[1, 2, 3, 4, 5, 6]`. What is returned?",
      solution: true,
      answers: ["6"],
      explanation: "6 nodes. The root's edges differ (left depth 3, right depth 2), so it recurses.",
    },
    {
      kind: "type",
      prompt: "Tree `[1, 2, 3, 4, 5, 6, 7]`. What is `left_depth` at the root? (It equals `right_depth` here.)",
      solution: true,
      answers: ["3"],
      explanation: "Both are 3, so it's perfect: 2³ − 1 = 7 without recursing.",
    },
    {
      kind: "type",
      prompt: "Tree `[1, 2]`. What is returned?",
      solution: true,
      answers: ["2"],
      explanation: "Left depth 2, right depth 1: recurse. Left subtree `[2]` is perfect (1), right is empty (0): 1 + 1 + 0 = 2.",
    },
    {
      kind: "type",
      prompt: "Fill in the recursive case.",
      code: `
return 1 + self.countNodes(root.left) + ___`,
      answers: ["self.countNodes(root.right)"],
      explanation: "Count this node plus both subtrees; at least one of them will be perfect.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(log² n)", correct: true },
        { text: "O(n)", why: "That's counting every node. Perfect subtrees are counted with a formula." },
        { text: "O(log n)", why: "Each of the O(log n) levels of recursion also measures depths in O(log n)." },
      ],
      explanation: "At each level of recursion only one side isn't perfect, and measuring depth costs O(log n).",
    },
    {
      kind: "choice",
      prompt: "Why is at least one child subtree always perfect?",
      options: [
        { text: "The last level fills from the left, so the split point lies in only one subtree", correct: true },
        { text: "Because the tree is balanced", why: "Balanced isn't enough; it's the left-filling rule." },
        { text: "It isn't guaranteed", why: "In a complete tree, the gap on the last level is in one subtree only." },
      ],
      explanation: "Either the left subtree is perfect (gap on the right), or the right subtree is perfect one level shorter.",
    },
    {
      kind: "choice",
      prompt: "Why compare the leftmost and rightmost depths?",
      options: [
        { text: "In a complete tree, equal edge depths mean the subtree is perfect", correct: true },
        { text: "To find the height", why: "The leftmost depth alone gives the height." },
        { text: "To balance the tree", why: "Nothing is modified." },
      ],
      explanation: "If the bottom-right position is filled, the whole last level is filled.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(log n) recursion depth", correct: true },
        { text: "O(n)", why: "A complete tree has height log n." },
        { text: "O(1)", why: "The recursion uses stack frames." },
      ],
      explanation: "Complete trees have height ~log n.",
    },
  ],

  "maximum-level-sum-of-a-binary-tree": [
    {
      kind: "type",
      prompt: "Fill in the comparison so ties keep the smaller level.",
      code: `
if total ___ best_sum:
    best_sum, best_level = total, level`,
      answers: [">"],
      explanation: "Only a strictly bigger sum replaces the best, so the earliest (smallest) level wins ties.",
      mistakes: [{ answers: [">="], why: "On a tie, `>=` would switch to the later level. The problem wants the smallest." }],
    },
    {
      kind: "type",
      prompt: "Fill in the starting best sum.",
      code: `
best_sum, best_level = ___, 0`,
      answers: ["float(\"-inf\")", "float('-inf')", "-inf", "-math.inf"],
      explanation: "Level sums can be negative, so the first level must always replace the starting value.",
      mistakes: [{ answers: ["0"], why: "If every level sums to a negative number, nothing would beat 0 and the answer would be 0, an invalid level." }],
    },
    {
      kind: "type",
      prompt: "Tree `[1, 7, 0, 7, -8]`. What is returned?",
      solution: true,
      answers: ["2"],
      explanation: "Level sums: 1, 7, −1. Level 2 has the largest sum.",
    },
    {
      kind: "type",
      prompt: "Tree `[-1, -2, -3]`. What is returned?",
      solution: true,
      answers: ["1"],
      explanation: "Sums: −1 and −5. Level 1 is larger.",
    },
    {
      kind: "type",
      prompt: "Tree `[0, 1, -1]`. What is returned?",
      solution: true,
      answers: ["1"],
      explanation: "Both levels sum to 0. Ties go to the smaller level.",
      mistakes: [{ answers: ["2"], why: "Level 2 ties with level 1, and ties keep the smaller level number." }],
    },
    {
      kind: "type",
      prompt: "What level number does the root have?",
      solution: true,
      answers: ["1"],
      explanation: "Levels are 1-based in this problem.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n · h)", why: "Each node is added to one sum once." },
        { text: "O(n log n)", why: "No sorting is needed." },
      ],
      explanation: "One BFS pass.",
    },
    {
      kind: "choice",
      prompt: "Why is BFS a natural fit here?",
      options: [
        { text: "It processes exactly one level per round, so each level's sum is ready at the end of the round", correct: true },
        { text: "DFS can't compute level sums", why: "DFS can, with a dictionary keyed by depth." },
        { text: "BFS is always faster", why: "Both are O(n)." },
      ],
      explanation: "Level-based questions map directly onto BFS rounds.",
    },
    {
      kind: "choice",
      prompt: "How would DFS solve it?",
      options: [
        { text: "Pass the depth down and add each value to `sums[depth]`", correct: true },
        { text: "Sum the left subtree and the right subtree", why: "That mixes levels together." },
        { text: "It can't", why: "Tracking depth makes it possible." },
      ],
      explanation: "Then pick the smallest depth with the largest sum.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(w), the widest level", correct: true },
        { text: "O(n) for the output", why: "The output is a single number." },
        { text: "O(1)", why: "The queue holds a level at a time." },
      ],
      explanation: "Only the queue grows.",
    },
  ],

  "find-largest-value-in-each-tree-row": [
    {
      kind: "type",
      prompt: "Fill in the starting value for a row's maximum.",
      code: `
best = float("___")`,
      answers: ["-inf"],
      explanation: "Values can be negative, so start below everything.",
      mistakes: [{ answers: ["inf"], why: "Starting at +∞, `max` would never pick a real value." }],
    },
    {
      kind: "type",
      prompt: "Fill in the update for the row maximum.",
      code: `
best = ___(best, node.val)`,
      answers: ["max"],
      explanation: "Keep the largest value seen on this row.",
    },
    {
      kind: "type",
      prompt: "Tree `[1, 3, 2, 5, 3, None, 9]`. What is returned?",
      solution: true,
      answers: ["[1, 3, 9]", "1, 3, 9", "1 3 9"],
      explanation: "Rows: `[1]`, `[3, 2]`, `[5, 3, 9]`.",
    },
    {
      kind: "type",
      prompt: "Tree `[-5]`. What is returned?",
      solution: true,
      answers: ["[-5]", "-5"],
      explanation: "One row with one negative value.",
      mistakes: [{ answers: ["[0]", "0"], why: "That happens if the row maximum starts at 0. It must start at −∞." }],
    },
    {
      kind: "type",
      prompt: "Tree `[1, 2, 3]`. What is returned?",
      solution: true,
      answers: ["[1, 3]", "1, 3", "1 3"],
      explanation: "Rows `[1]` and `[2, 3]`.",
    },
    {
      kind: "type",
      prompt: "Fill in the line that saves the row's result.",
      code: `
result.___(best)`,
      answers: ["append"],
      explanation: "One value per row, top to bottom.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n log n)", why: "We keep a running max, with no sorting." },
        { text: "O(n · w)", why: "Each node is compared once." },
      ],
      explanation: "One BFS pass with an O(1) comparison per node.",
    },
    {
      kind: "choice",
      prompt: "Which problem is almost the same code, but sums each level instead?",
      options: [
        { text: "Maximum Level Sum of a Binary Tree", correct: true },
        { text: "Count Complete Tree Nodes", why: "That uses depths and a formula." },
        { text: "Serialize and Deserialize", why: "That encodes the tree." },
      ],
      explanation: "Same BFS skeleton, different per-level summary.",
    },
    {
      kind: "choice",
      prompt: "Why reset `best` at the start of every row?",
      solution: true,
      options: [
        { text: "Each row needs its own maximum", correct: true },
        { text: "To save memory", why: "It's about correctness." },
        { text: "It isn't needed", why: "Without resetting, a big value from an early row would carry over." },
      ],
      explanation: "The outer loop is one row.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(w) for the queue, plus O(h) for the output", correct: true },
        { text: "O(1)", why: "The queue holds a level at a time." },
        { text: "O(n²)", why: "Nothing is quadratic here." },
      ],
      explanation: "The queue holds at most about two levels; the output has one value per row.",
    },
  ],

  "serialize-and-deserialize-binary-tree": [
    {
      kind: "type",
      prompt: "Fill in the marker for a missing child.",
      code: `
else:
    tokens.append("___")`,
      answers: ["#"],
      explanation: "Without a marker for missing children, the shape couldn't be rebuilt.",
    },
    {
      kind: "type",
      prompt: "Tree `[1, 2, 3, None, None, 4, 5]`. What does `serialize` return?",
      solution: true,
      answers: ["1,2,3,#,#,4,5,#,#,#,#"],
      explanation: "Level order with `#` for every missing child, including the four under the leaves 4 and 5.",
    },
    {
      kind: "type",
      prompt: "Empty tree. What does `serialize` return?",
      solution: true,
      answers: ["#"],
      explanation: "A single marker for the missing root.",
    },
    {
      kind: "type",
      prompt: "Tree `[1]`. What does `serialize` return?",
      solution: true,
      answers: ["1,#,#"],
      explanation: "The root, then two missing children.",
    },
    {
      kind: "type",
      prompt: "Fill in how many tokens each parent consumes in `deserialize`.",
      code: `
position += ___`,
      answers: ["2"],
      explanation: "Each real node was written with exactly two child tokens: left then right.",
    },
    {
      kind: "type",
      prompt: "Fill in the separator used to split the string.",
      code: `
tokens = data.split("___")`,
      answers: [","],
      explanation: "`serialize` joined tokens with commas, so `deserialize` splits on commas.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity of each operation?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n log n)", why: "No sorting; each node and marker is handled once." },
        { text: "O(n²)", why: "Tokens are read sequentially with a position pointer." },
      ],
      explanation: "Each node (and each `#`) is written and read once.",
    },
    {
      kind: "choice",
      prompt: "Why must missing children be written explicitly?",
      options: [
        { text: "Values alone don't capture shape: `[1, 2]` and `[1, None, 2]` would look the same", correct: true },
        { text: "To make the string longer", why: "It's about uniquely describing the tree." },
        { text: "Because values might be negative", why: "Negative values are handled by `int()`." },
      ],
      explanation: "Markers record where the tree ends on each branch.",
    },
    {
      kind: "choice",
      prompt: "How does `deserialize` know which node gets the next two tokens?",
      options: [
        { text: "Parents are queued in the same level order they were written", correct: true },
        { text: "It reads the parent's value from the string", why: "Parents are matched by order, not by value." },
        { text: "It uses recursion depth", why: "This version is BFS, with a queue of parents." },
      ],
      explanation: "Writing and reading in the same BFS order keeps them in sync.",
    },
    {
      kind: "choice",
      prompt: "Could preorder DFS be used instead?",
      options: [
        { text: "Yes: write value, left, right with `#` for None, and read back recursively in the same order", correct: true },
        { text: "No, only BFS can be deserialized", why: "Any traversal with null markers works if reading mirrors writing." },
        { text: "Only for BSTs", why: "Null markers make it work for any binary tree." },
      ],
      explanation: "The key is that the encoding includes missing children, not which traversal is used.",
    },
  ],
});
