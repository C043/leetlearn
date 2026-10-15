import { defineExercises } from "./types";

export default defineExercises({
  "invert-binary-tree": [
    {
      kind: "type",
      prompt: "Fill in the new left child.",
      code: `
root.left, root.right = self.invertTree(root.___), self.invertTree(root.left)`,
      answers: ["right"],
      explanation: "Mirroring swaps the sides: the inverted right subtree becomes the new left child.",
    },
    {
      kind: "type",
      prompt: "Fill in what is returned.",
      code: `
if root:
    root.left, root.right = self.invertTree(root.right), self.invertTree(root.left)
return ___`,
      answers: ["root"],
      explanation: "The tree is mirrored in place; its root is still the same node.",
    },
    {
      kind: "type",
      prompt: "Tree `[4, 2, 7, 1, 3, 6, 9]` (level order). What is the inverted tree in level order?",
      solution: true,
      answers: ["[4, 7, 2, 9, 6, 3, 1]", "4, 7, 2, 9, 6, 3, 1", "4 7 2 9 6 3 1"],
      explanation: "Every level is reversed: `2, 7` → `7, 2` and `1, 3, 6, 9` → `9, 6, 3, 1`.",
    },
    {
      kind: "type",
      prompt: "Tree `[2, 1, 3]`. What is the inverted tree in level order?",
      solution: true,
      answers: ["[2, 3, 1]", "2, 3, 1", "2 3 1"],
      explanation: "The two children swap.",
    },
    {
      kind: "type",
      prompt: "How many times is `invertTree` called for a tree with 3 nodes (counting calls on `None` children)?",
      solution: true,
      answers: ["7"],
      explanation: "3 real nodes, each with two child calls: 1 + 2 + 4 = 7, where the 4 calls on leaf children receive `None`.",
    },
    {
      kind: "type",
      prompt: "What does `invertTree(None)` return?",
      solution: true,
      answers: ["None"],
      explanation: "An empty tree stays empty.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n log n)", why: "Each node is swapped once; there's no sorting." },
        { text: "O(h)", why: "That's the stack depth. Every node still has to be visited." },
      ],
      explanation: "Each node is visited once.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity, with tree height h?",
      solution: true,
      options: [
        { text: "O(h) for the recursion stack", correct: true },
        { text: "O(1)", why: "Each recursive call takes a stack frame." },
        { text: "O(n) always", why: "Only when the tree is a chain (h = n). A balanced tree needs O(log n)." },
      ],
      explanation: "The recursion goes as deep as the tree is tall.",
    },
    {
      kind: "choice",
      prompt: "Why does the one-line swap work without a temporary variable?",
      solution: true,
      options: [
        { text: "Python evaluates the whole right-hand side before assigning", correct: true },
        { text: "Because the subtrees are equal", why: "They're usually different. Tuple assignment is the reason." },
        { text: "It doesn't; one subtree is lost", why: "Both calls run before either assignment, so nothing is lost." },
      ],
      explanation: "`a, b = f(b), f(a)` computes both values first, then assigns.",
    },
    {
      kind: "choice",
      prompt: "Could you invert the tree with BFS instead?",
      options: [
        { text: "Yes: visit nodes level by level and swap each node's children", correct: true },
        { text: "No, inversion needs recursion", why: "Any traversal that visits every node once works." },
        { text: "Only for balanced trees", why: "BFS works on any shape." },
      ],
      explanation: "Each node just needs its children swapped once; the order doesn't matter.",
    },
  ],

  "same-tree": [
    {
      kind: "type",
      prompt: "Fill in the base case: at least one node is missing.",
      code: `
if not p or not q:
    return p ___ q`,
      answers: ["is", "=="],
      explanation: "They match only if **both** are `None`. `p is q` is `True` only in that case here.",
    },
    {
      kind: "type",
      prompt: "Fill in the right-subtree comparison.",
      code: `
return p.val == q.val and self.isSameTree(p.left, q.left) and self.isSameTree(___, ___)`,
      answers: ["p.right, q.right"],
      explanation: "Compare the right subtrees with each other, just like the left ones.",
      mistakes: [{ answers: ["p.left, q.right", "p.right, q.left"], why: "That would check for a mirror image (Symmetric Tree), not the same tree." }],
    },
    {
      kind: "type",
      prompt: "`p = [1, 2]`, `q = [1, None, 2]`. What is returned?",
      solution: true,
      answers: ["False"],
      explanation: "In `p`, 2 is a left child; in `q`, it's a right child. Same values, different shape.",
    },
    {
      kind: "type",
      prompt: "`p = [1, 2, 1]`, `q = [1, 1, 2]`. What is returned?",
      solution: true,
      answers: ["False"],
      explanation: "The left children differ (2 vs 1).",
    },
    {
      kind: "type",
      prompt: "`p = []`, `q = []`. What is returned?",
      solution: true,
      answers: ["True"],
      explanation: "Two empty trees are the same.",
    },
    {
      kind: "type",
      prompt: "Which Python operator makes the comparison stop early as soon as one check fails?",
      solution: true,
      answers: ["and"],
      explanation: "`and` short-circuits: if the values differ, the subtrees are never compared.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n), where n is the smaller tree's size", correct: true },
        { text: "O(n · m)", why: "Nodes are compared in pairs, once each." },
        { text: "O(log n)", why: "In the worst case (identical trees) every node is compared." },
      ],
      explanation: "Each pair of nodes is compared once, and the walk stops at the first difference.",
    },
    {
      kind: "choice",
      prompt: "Why isn't comparing their inorder traversals enough?",
      options: [
        { text: "Different shapes can produce the same traversal", correct: true },
        { text: "Traversals are slower", why: "Speed isn't the issue; correctness is." },
        { text: "Inorder only works for BSTs", why: "Inorder works on any tree. It just loses shape information." },
      ],
      explanation: "`[1, 2]` and `[2, None, 1]` both have inorder `2, 1`.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(h) recursion depth", correct: true },
        { text: "O(1)", why: "Recursion uses stack frames." },
        { text: "O(n + m)", why: "The stack holds only the current path." },
      ],
      explanation: "The recursion follows both trees down one path at a time.",
    },
    {
      kind: "choice",
      prompt: "Which problem is the same recursion, but comparing left with right?",
      options: [
        { text: "Symmetric Tree", correct: true },
        { text: "Invert Binary Tree", why: "That changes the tree; it doesn't compare." },
        { text: "Validate Binary Search Tree", why: "That checks value ranges, not two trees." },
      ],
      explanation: "A tree is symmetric if its left subtree is a mirror of its right one.",
    },
  ],

  "binary-tree-paths": [
    {
      kind: "type",
      prompt: "Fill in the leaf test.",
      code: `
if not node.left and ___:
    result.append("->".join(path))`,
      answers: ["not node.right"],
      explanation: "A leaf has no children at all.",
    },
    {
      kind: "type",
      prompt: "Fill in the separator.",
      code: `
result.append("___".join(path))`,
      answers: ["->"],
      explanation: "The problem formats paths like `\"1->2->5\"`.",
    },
    {
      kind: "type",
      prompt: "Fill in the step that undoes this node before returning.",
      code: `
path.___()`,
      answers: ["pop"],
      explanation: "Backtracking: the shared `path` list must be restored for the sibling branch.",
    },
    {
      kind: "type",
      prompt: "Tree `[1, 2, 3, None, 5]`. How many paths are returned?",
      solution: true,
      answers: ["2"],
      explanation: "`1->2->5` and `1->3`.",
    },
    {
      kind: "type",
      prompt: "Tree `[1, 2, 3, None, 5]`. What is the first path returned?",
      solution: true,
      answers: ["1->2->5"],
      explanation: "The left side is explored first: 1, then 2, then its only child 5.",
    },
    {
      kind: "type",
      prompt: "Tree `[1, 2, 3, 4, 5]`. How many paths are returned?",
      solution: true,
      answers: ["3"],
      explanation: "One per leaf: 4, 5 and 3.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity, with n nodes and height h?",
      solution: true,
      options: [
        { text: "O(n · h), because each leaf's path string is built in O(h)", correct: true },
        { text: "O(n)", why: "Visiting is O(n), but joining each path costs up to O(h)." },
        { text: "O(2ⁿ)", why: "There are at most n/2 + 1 leaves, so far fewer paths." },
      ],
      explanation: "The visit is linear; string building adds a factor of the path length.",
    },
    {
      kind: "choice",
      prompt: "Why must `path.pop()` run after both children are explored?",
      solution: true,
      options: [
        { text: "`path` is shared; without popping, a sibling's path would include this node", correct: true },
        { text: "To free memory", why: "It's about correctness of the shared list." },
        { text: "It isn't needed", why: "Without it, `1->2->5` would be followed by `1->2->5->3`." },
      ],
      explanation: "Append on the way down, pop on the way up: classic backtracking.",
    },
    {
      kind: "choice",
      prompt: "Why test for a leaf instead of stopping at `None`?",
      options: [
        { text: "A node with one child isn't the end of a path; only leaves are", correct: true },
        { text: "`None` can't be checked in Python", why: "It can. The point is that hitting `None` doesn't mean a path ended." },
        { text: "To avoid recursion", why: "We still recurse; the leaf check just decides when to record." },
      ],
      explanation: "In `[1, 2]`, node 1 has a `None` right child, but `1` alone isn't a root-to-leaf path.",
    },
    {
      kind: "choice",
      prompt: "What does `str(node.val)` handle?",
      solution: true,
      options: [
        { text: "`join` needs strings, and values are ints (possibly negative)", correct: true },
        { text: "Converting to binary", why: "`str` gives the decimal text, like `\"-3\"`." },
        { text: "Nothing; ints can be joined", why: "`\"->\".join([1, 2])` raises a `TypeError`." },
      ],
      explanation: "Storing strings in `path` lets `join` build the output directly.",
    },
  ],

  "validate-binary-search-tree": [
    {
      kind: "type",
      prompt: "Fill in the limits passed to the left subtree.",
      code: `
return valid(node.left, low, ___) and valid(node.right, node.val, high)`,
      answers: ["node.val"],
      explanation: "Everything on the left must be below this node, and still above the inherited `low`.",
    },
    {
      kind: "type",
      prompt: "Fill in the starting lower limit.",
      code: `
return valid(root, float("___"), float("inf"))`,
      answers: ["-inf"],
      explanation: "The root has no constraints, so its range is (−∞, +∞).",
    },
    {
      kind: "type",
      prompt: "Tree `[5, 1, 4, None, None, 3, 6]`. What is returned?",
      solution: true,
      answers: ["False"],
      explanation: "4 is the right child of 5 but is smaller than 5.",
    },
    {
      kind: "type",
      prompt: "Tree `[5, 4, 6, None, None, 3, 7]`. What is returned?",
      solution: true,
      answers: ["False"],
      explanation: "3 is in 5's right subtree, so it must be > 5. It's a valid child of 6 locally, but it breaks the ancestor's limit.",
      mistakes: [{ answers: ["True"], why: "Each parent-child pair looks fine, but 3 sits in 5's right subtree and must be greater than 5." }],
    },
    {
      kind: "type",
      prompt: "Tree `[2, 2, 2]`. What is returned?",
      solution: true,
      answers: ["False"],
      explanation: "BST values must be strictly less on the left and strictly greater on the right; duplicates fail.",
    },
    {
      kind: "type",
      prompt: "Fill in the operator (the same one goes in both blanks).",
      code: `
if not low ___ node.val ___ high:
    return False`,
      answers: ["<"],
      explanation: "Strictly between the limits: `low < node.val < high`.",
      mistakes: [{ answers: ["<="], why: "Duplicates aren't allowed in this problem's BST." }],
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n log n)", why: "Each node is checked once with O(1) work." },
        { text: "O(n²)", why: "That's checking every node against all of its subtree. The limits avoid it." },
      ],
      explanation: "One visit per node.",
    },
    {
      kind: "choice",
      prompt: "Why isn't checking each node against its children enough?",
      options: [
        { text: "A value deep down can be fine for its parent but break an ancestor's limit", correct: true },
        { text: "Children might be `None`", why: "That's easy to handle. The real problem is ancestors." },
        { text: "It is enough", why: "`[5, 4, 6, None, None, 3, 7]` passes the local check but is invalid." },
      ],
      explanation: "Every node inherits a range from all its ancestors, not just its parent.",
    },
    {
      kind: "choice",
      prompt: "Which other method also validates a BST?",
      options: [
        { text: "An inorder traversal must be strictly increasing", correct: true },
        { text: "A preorder traversal must be sorted", why: "Preorder visits the root before smaller left values, so it isn't sorted." },
        { text: "The tree must be balanced", why: "Balance has nothing to do with BST ordering." },
      ],
      explanation: "Inorder visits a BST in sorted order.",
    },
    {
      kind: "choice",
      prompt: "Why use `float(\"-inf\")` and `float(\"inf\")` as the starting limits?",
      options: [
        { text: "Node values can be as small or large as the int range allows, so no real number is a safe sentinel", correct: true },
        { text: "Because values are floats", why: "Values are ints; infinities just compare correctly with them." },
        { text: "To make the tree balanced", why: "They're just \"no limit\" markers." },
      ],
      explanation: "Using the minimum int value would wrongly reject a node with that exact value.",
    },
  ],

  "lowest-common-ancestor-of-a-binary-tree": [
    {
      kind: "type",
      prompt: "Fill in the case where this node is the answer.",
      code: `
left = self.lowestCommonAncestor(root.left, p, q)
right = self.lowestCommonAncestor(root.right, p, q)
if left ___ right:
    return root`,
      answers: ["and"],
      explanation: "One target on each side means this node is where their paths meet.",
    },
    {
      kind: "type",
      prompt: "Fill in what is passed up otherwise.",
      code: `
return left ___ right`,
      answers: ["or"],
      explanation: "Pass up whichever side found something (or `None` if neither did).",
    },
    {
      kind: "type",
      prompt: "Tree `[3, 5, 1, 6, 2, 0, 8, None, None, 7, 4]`, `p = 5`, `q = 1`. What is the LCA's value?",
      solution: true,
      answers: ["3"],
      explanation: "5 and 1 are on opposite sides of 3.",
    },
    {
      kind: "type",
      prompt: "Same tree, `p = 5`, `q = 4`. What is the LCA's value?",
      solution: true,
      answers: ["5"],
      explanation: "4 is a descendant of 5, and a node counts as its own descendant.",
      mistakes: [{ answers: ["3"], why: "5 itself is an ancestor of 4, and it's deeper than 3." }],
    },
    {
      kind: "type",
      prompt: "Same tree, `p = 7`, `q = 8`. What is the LCA's value?",
      solution: true,
      answers: ["3"],
      explanation: "7 is under 5 (left of the root) and 8 is under 1 (right of the root).",
    },
    {
      kind: "type",
      prompt: "Same tree, `p = 6`, `q = 4`. What is the LCA's value?",
      solution: true,
      answers: ["5"],
      explanation: "6 is 5's left child; 4 is under 5's right child 2.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(log n)", why: "This isn't a BST, so we can't choose a side by value." },
        { text: "O(n²)", why: "Each node is visited at most once." },
      ],
      explanation: "In the worst case the whole tree is searched once.",
    },
    {
      kind: "choice",
      prompt: "Why can the search stop as soon as it reaches `p` (without looking below it)?",
      options: [
        { text: "If `q` is below `p`, then `p` is the LCA anyway; if not, `q` is found elsewhere", correct: true },
        { text: "Because `q` is never below `p`", why: "It can be, as with p = 5, q = 4." },
        { text: "It's an optimisation that can give wrong answers", why: "It's always correct, by the reasoning above." },
      ],
      explanation: "Returning `p` early is what makes \"one is the ancestor of the other\" work.",
    },
    {
      kind: "choice",
      prompt: "What does a recursive call return?",
      options: [
        { text: "`p`, `q`, their LCA if both are in that subtree, or `None`", correct: true },
        { text: "Always the LCA", why: "If only one target is in the subtree, it returns that target." },
        { text: "`True` or `False`", why: "It returns nodes, so the answer node can bubble up." },
      ],
      explanation: "The return value means \"what I found down here\".",
    },
    {
      kind: "choice",
      prompt: "How would this be faster in a binary **search** tree?",
      options: [
        { text: "Walk down from the root: go left if both are smaller, right if both are bigger, else stop: O(h)", correct: true },
        { text: "It wouldn't be faster", why: "Ordering lets you skip a whole side at every step." },
        { text: "Sort the nodes first", why: "A BST is already ordered." },
      ],
      explanation: "The split point between p and q is the LCA.",
    },
  ],

  "path-sum-iii": [
    {
      kind: "type",
      prompt: "Fill in the starting entry for the empty prefix.",
      code: `
counts = defaultdict(int)
counts[___] = 1`,
      answers: ["0"],
      explanation: "A path starting at the root has prefix sum `targetSum`, so `prefix - targetSum = 0` must be found once.",
    },
    {
      kind: "type",
      prompt: "Fill in the prefix we look up.",
      code: `
prefix += node.val
found = counts[___]`,
      answers: ["prefix - targetSum"],
      explanation: "If an earlier prefix equals `prefix - targetSum`, the path between it and here sums to `targetSum`.",
      mistakes: [{ answers: ["targetSum - prefix"], why: "The sign is flipped: we need `earlier = prefix - targetSum`." }],
    },
    {
      kind: "type",
      prompt: "Fill in the backtracking step after both children are explored.",
      code: `
found += explore(node.left, prefix) + explore(node.right, prefix)
counts[prefix] ___ 1`,
      answers: ["-="],
      explanation: "This prefix belongs only to the current root-to-node path. Siblings must not see it.",
    },
    {
      kind: "type",
      prompt: "Tree `[1, 2, 3]`, `targetSum = 3`. What is returned?",
      solution: true,
      answers: ["2"],
      explanation: "`1 → 2` and `3` (alone) both sum to 3.",
    },
    {
      kind: "type",
      prompt: "Tree `[10, 5, -3, 3, 2, None, 11, 3, -2, None, 1]`, `targetSum = 8`. What is returned?",
      solution: true,
      answers: ["3"],
      explanation: "`5 → 3`, `5 → 2 → 1` and `-3 → 11`.",
    },
    {
      kind: "type",
      prompt: "Tree `[0, 0]`, `targetSum = 0`. What is returned?",
      solution: true,
      answers: ["3"],
      explanation: "`[0]` (root), `[0]` (child) and `[0 → 0]` all sum to 0.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n²)", why: "That's starting a DFS from every node. Prefix sums count all paths ending here in O(1)." },
        { text: "O(n log n)", why: "Dictionary lookups are O(1) on average." },
      ],
      explanation: "Each node does O(1) dictionary work.",
    },
    {
      kind: "choice",
      prompt: "Which array problem uses the same prefix-sum trick?",
      options: [
        { text: "Subarray Sum Equals K", correct: true },
        { text: "Two Sum II", why: "That uses two pointers on a sorted array." },
        { text: "Maximum Average Subarray", why: "That's a fixed-size window." },
      ],
      explanation: "A root-to-node path is like a prefix of an array.",
    },
    {
      kind: "choice",
      prompt: "Why must `counts[prefix]` be decremented after the children?",
      solution: true,
      options: [
        { text: "Paths must go downward; a prefix from one branch can't start a path in another", correct: true },
        { text: "To save memory", why: "It's about correctness, not memory." },
        { text: "It doesn't matter", why: "Without it, paths would be counted across sibling branches, which aren't connected downward." },
      ],
      explanation: "`counts` must reflect only the ancestors of the current node.",
    },
    {
      kind: "choice",
      prompt: "Why can't a sliding window be used instead?",
      options: [
        { text: "Values can be negative, so sums don't grow monotonically", correct: true },
        { text: "Trees can't have windows", why: "A root-to-node path is like an array, but negatives still break the window." },
        { text: "It can", why: "With negative values you can't decide when to shrink." },
      ],
      explanation: "Prefix sums handle any values.",
    },
  ],

  "count-good-nodes-in-binary-tree": [
    {
      kind: "type",
      prompt: "Fill in the test for a good node.",
      code: `
good = 1 if node.val ___ largest_so_far else 0`,
      answers: [">="],
      explanation: "Good means nothing on the path is **greater**. Equal values are fine.",
      mistakes: [{ answers: [">"], why: "A node equal to the path's maximum is still good: no value is greater than it." }],
    },
    {
      kind: "type",
      prompt: "Fill in the starting maximum.",
      code: `
return explore(root, ___)`,
      answers: ["root.val"],
      explanation: "The root is always good, so starting with its own value makes it count.",
    },
    {
      kind: "type",
      prompt: "Tree `[3, 1, 4, 3, None, 1, 5]`. What is returned?",
      solution: true,
      answers: ["4"],
      explanation: "Good: 3 (root), 3 (left-left), 4, and 5.",
    },
    {
      kind: "type",
      prompt: "Tree `[3, 3, None, 4, 2]`. What is returned?",
      solution: true,
      answers: ["3"],
      explanation: "3, 3 and 4 are good; 2 is below a 3.",
    },
    {
      kind: "type",
      prompt: "Tree `[2, 1, 1]`. What is returned?",
      solution: true,
      answers: ["1"],
      explanation: "Only the root: both 1s have 2 above them.",
    },
    {
      kind: "type",
      prompt: "Fill in the updated maximum passed to the children.",
      code: `
largest_so_far = ___(largest_so_far, node.val)`,
      answers: ["max"],
      explanation: "Children compare against the largest value on their whole root path.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n · h)", why: "That's re-scanning each path. Passing the maximum down makes each check O(1)." },
        { text: "O(n log n)", why: "Nothing is sorted." },
      ],
      explanation: "One visit per node.",
    },
    {
      kind: "choice",
      prompt: "Why pass the maximum **down** as a parameter?",
      options: [
        { text: "Each node only needs the largest value among its ancestors", correct: true },
        { text: "Because parents need children's values", why: "Information flows down here, not up." },
        { text: "To sort the tree", why: "Nothing is sorted." },
      ],
      explanation: "Top-down DFS carries the path's state to each node.",
    },
    {
      kind: "choice",
      prompt: "Is a node in the left subtree affected by values in the right subtree?",
      options: [
        { text: "No, only values on its own root path matter", correct: true },
        { text: "Yes, all values above its level matter", why: "Only its ancestors are on its path." },
        { text: "Yes, through the global maximum", why: "There's no global maximum; each path has its own." },
      ],
      explanation: "Siblings' subtrees don't share a path.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(h) recursion depth", correct: true },
        { text: "O(n) always", why: "Only in a chain-shaped tree." },
        { text: "O(1)", why: "Recursion uses the call stack." },
      ],
      explanation: "One frame per level of the current path.",
    },
  ],

  "construct-binary-tree-from-preorder-and-inorder-traversal": [
    {
      kind: "type",
      prompt: "Fill in the left subtree's inorder range.",
      code: `
middle = index[root.val]
root.left = build(low, ___)
root.right = build(middle + 1, high)`,
      answers: ["middle"],
      explanation: "In inorder, everything before the root belongs to the left subtree: `[low, middle)`.",
    },
    {
      kind: "type",
      prompt: "Fill in which list gives the next root.",
      code: `
root = TreeNode(next(___))`,
      answers: ["preorder_values"],
      explanation: "Preorder lists each root before its subtrees, so reading it in order gives roots in the order we build them.",
    },
    {
      kind: "type",
      prompt: "`preorder = [3, 9, 20, 15, 7]`, `inorder = [9, 3, 15, 20, 7]`. What is the root's value?",
      solution: true,
      answers: ["3"],
      explanation: "The first preorder value is the root.",
    },
    {
      kind: "type",
      prompt: "Same input. How many nodes are in the root's right subtree?",
      solution: true,
      answers: ["3"],
      explanation: "In inorder, after 3 come `15, 20, 7`.",
    },
    {
      kind: "type",
      prompt: "`preorder = [1, 2]`, `inorder = [1, 2]`. Is 2 the left or right child? (type `left` or `right`)",
      solution: true,
      answers: ["right"],
      explanation: "In inorder, 2 comes after the root 1, so it's in the right subtree.",
    },
    {
      kind: "type",
      prompt: "Fill in the condition for an empty subtree.",
      code: `
if low ___ high:
    return None`,
      answers: [">="],
      explanation: "The range `[low, high)` is empty when `low >= high`.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n²)", why: "That's searching inorder for each root. The `index` dictionary makes it O(1)." },
        { text: "O(n log n)", why: "Each node is built once with O(1) lookups." },
      ],
      explanation: "Each node is created once, with an O(1) position lookup.",
    },
    {
      kind: "choice",
      prompt: "Why must the left subtree be built **before** the right one?",
      solution: true,
      options: [
        { text: "Preorder lists the whole left subtree before the right one, and we read it sequentially", correct: true },
        { text: "It doesn't matter", why: "Building the right first would consume left-subtree values as right roots." },
        { text: "Because inorder is left-first", why: "The shared iterator over preorder is what forces the order." },
      ],
      explanation: "The iterator hands out roots in preorder: root, left…, right….",
    },
    {
      kind: "choice",
      prompt: "Why are values required to be unique?",
      options: [
        { text: "So each root has exactly one position in inorder", correct: true },
        { text: "So the tree is a BST", why: "The tree doesn't need to be a BST." },
        { text: "To make preorder sorted", why: "Preorder isn't sorted." },
      ],
      explanation: "With duplicates, `index[root.val]` would be ambiguous.",
    },
    {
      kind: "choice",
      prompt: "What does each traversal tell us?",
      options: [
        { text: "Preorder gives the roots; inorder splits each subtree into left and right parts", correct: true },
        { text: "Preorder gives the leaves; inorder gives the depth", why: "Neither gives leaves or depth directly." },
        { text: "Both give the same information", why: "Either one alone is ambiguous; together they fix the tree." },
      ],
      explanation: "Combine them: find the root (preorder), split around it (inorder), recurse.",
    },
  ],

  "unique-binary-search-trees": [
    {
      kind: "type",
      prompt: "Fill in the base case.",
      code: `
tree_count[0] = ___`,
      answers: ["1"],
      explanation: "There's exactly one empty tree, and it must count as 1 so it multiplies correctly.",
      mistakes: [{ answers: ["0"], why: "Then any root with an empty side would contribute 0, and every count would be 0." }],
    },
    {
      kind: "type",
      prompt: "Fill in the number of nodes in the right subtree.",
      code: `
tree_count[nodes] += tree_count[root - 1] * tree_count[___]`,
      answers: ["nodes - root"],
      explanation: "With values 1..nodes and this root, the values above it (`nodes - root` of them) go right.",
    },
    {
      kind: "type",
      prompt: "What does `numTrees(3)` return?",
      solution: true,
      answers: ["5"],
      explanation: "Root 1: 2 trees. Root 2: 1. Root 3: 2. Total 5.",
    },
    {
      kind: "type",
      prompt: "What does `numTrees(4)` return?",
      solution: true,
      answers: ["14"],
      explanation: "1·5 + 1·2 + 2·1 + 5·1 = 14.",
    },
    {
      kind: "type",
      prompt: "What does `numTrees(1)` return?",
      solution: true,
      answers: ["1"],
      explanation: "A single node.",
    },
    {
      kind: "type",
      prompt: "With values 1..5 and root 2, how many values go in the left subtree?",
      answers: ["1"],
      explanation: "Only value 1 is smaller than 2.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n²)", correct: true },
        { text: "O(n)", why: "For each size we try every root: two nested loops." },
        { text: "O(2ⁿ)", why: "That's building every tree. We only count them." },
      ],
      explanation: "Sizes 1..n, each with up to n roots.",
    },
    {
      kind: "choice",
      prompt: "Why do only the subtree **sizes** matter, not the actual values?",
      options: [
        { text: "Any k consecutive values form the same number of BST shapes as 1..k", correct: true },
        { text: "Because all values are equal", why: "Values are distinct; only their order matters." },
        { text: "Because the tree is balanced", why: "The trees can be any shape." },
      ],
      explanation: "Renaming values 4, 5, 6 to 1, 2, 3 doesn't change the possible shapes.",
    },
    {
      kind: "choice",
      prompt: "Why multiply the left and right counts?",
      options: [
        { text: "Every left shape can be paired with every right shape", correct: true },
        { text: "To get the total number of nodes", why: "We're counting trees, not nodes." },
        { text: "Adding would also work", why: "Choices on two independent sides combine by multiplication." },
      ],
      explanation: "Independent choices multiply.",
    },
    {
      kind: "choice",
      prompt: "What famous sequence does this produce (1, 2, 5, 14, 42, …)?",
      options: [
        { text: "The Catalan numbers", correct: true },
        { text: "The Fibonacci numbers", why: "Fibonacci goes 1, 2, 3, 5, 8, …" },
        { text: "Powers of two", why: "That would be 1, 2, 4, 8, 16, …" },
      ],
      explanation: "Catalan numbers count many recursive structures, including BST shapes.",
    },
  ],

  "binary-tree-maximum-path-sum": [
    {
      kind: "type",
      prompt: "Fill in the step that ignores a branch that would lower the sum.",
      code: `
left = ___(gain(node.left), 0)`,
      answers: ["max"],
      explanation: "A branch with a negative total is better left out: take 0 instead.",
    },
    {
      kind: "type",
      prompt: "Fill in the path that bends at this node.",
      code: `
best = max(best, ___)`,
      answers: ["node.val + left + right"],
      explanation: "A path can go up from the left branch, through this node, and down the right branch.",
    },
    {
      kind: "type",
      prompt: "Fill in what is returned to the parent.",
      code: `
return node.val + ___(left, right)`,
      answers: ["max"],
      explanation: "A path continuing up to the parent can only use **one** branch, so pick the better one.",
      mistakes: [{ answers: ["sum", "min"], why: "A path through the parent can't use both branches; that would visit this node twice." }],
    },
    {
      kind: "type",
      prompt: "Tree `[-10, 9, 20, None, None, 15, 7]`. What is returned?",
      solution: true,
      answers: ["42"],
      explanation: "The path `15 → 20 → 7` sums to 42. Including -10 would lower it.",
    },
    {
      kind: "type",
      prompt: "Tree `[-3]`. What is returned?",
      solution: true,
      answers: ["-3"],
      explanation: "The path must be non-empty, so the answer is the single node.",
      mistakes: [{ answers: ["0"], why: "The path can't be empty. With one node, it's that node." }],
    },
    {
      kind: "type",
      prompt: "Tree `[-1, -2, -3]`. What is returned?",
      solution: true,
      answers: ["-1"],
      explanation: "Every node is negative, so the best path is the single largest node.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n²)", why: "That's trying every pair of endpoints. Each node is processed once here." },
        { text: "O(n log n)", why: "No sorting is involved." },
      ],
      explanation: "One post-order visit per node.",
    },
    {
      kind: "choice",
      prompt: "Why are there two different values per node (the bending path and the returned gain)?",
      options: [
        { text: "A path can bend at most once; only a straight branch can be extended upward", correct: true },
        { text: "One is for positive and one for negative values", why: "Both handle any sign." },
        { text: "It's redundant", why: "They answer different questions: \"best path here\" vs \"best path the parent can extend\"." },
      ],
      explanation: "Record the bending path in `best`; return the straight branch to the parent.",
    },
    {
      kind: "choice",
      prompt: "Why is `best` initialised to `float(\"-inf\")` and not 0?",
      solution: true,
      options: [
        { text: "If every value is negative, the answer is negative", correct: true },
        { text: "To handle an empty tree", why: "The tree has at least one node." },
        { text: "It doesn't matter", why: "Starting at 0 would return 0 for `[-3]`, which isn't a valid path." },
      ],
      explanation: "The answer must come from a real path.",
    },
    {
      kind: "choice",
      prompt: "What is `nonlocal best` for?",
      solution: true,
      options: [
        { text: "It lets the inner function assign to the outer function's `best`", correct: true },
        { text: "It makes `best` a global variable", why: "`nonlocal` refers to the enclosing function, not the module." },
        { text: "It makes the function faster", why: "It only affects which variable is assigned." },
      ],
      explanation: "Without it, `best = …` would create a new local variable inside `gain`.",
    },
  ],
});
