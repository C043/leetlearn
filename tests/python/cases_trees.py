"""Trees (DFS), Trees (BFS) and Tries."""

import re
from collections import deque
from itertools import combinations

from harness import NextNode, TreeNode, case, find, inorder, make_tree, random_tree, rng, tree_values


def S(ns):
    return ns["Solution"]()


def levels(root):
    out, q = [], deque([root] if root else [])
    while q:
        out.append([n.val for n in q])
        q = deque(c for n in q for c in (n.left, n.right) if c)
    return out


def all_nodes(root):
    return [root] + all_nodes(root.left) + all_nodes(root.right) if root else []


def random_trees(seed, count=200, max_nodes=12, lo=-10, hi=10):
    r = rng(seed)
    return [random_tree(r, r.randint(0, max_nodes), lo, hi) for _ in range(count)]


# ---------------- Trees (DFS) ----------------

@case("invert-binary-tree")
def _(ns):
    f = S(ns).invertTree

    def mirror(root):
        return TreeNode(root.val, mirror(root.right), mirror(root.left)) if root else None

    assert tree_values(f(make_tree([4, 2, 7, 1, 3, 6, 9]))) == [4, 7, 2, 9, 6, 3, 1]
    assert tree_values(f(make_tree([2, 1, 3]))) == [2, 3, 1]
    assert f(None) is None
    for root in random_trees(100):
        expected = tree_values(mirror(root))
        assert tree_values(f(root)) == expected


@case("same-tree")
def _(ns):
    f = S(ns).isSameTree
    assert f(make_tree([1, 2, 3]), make_tree([1, 2, 3])) is True
    assert f(make_tree([1, 2]), make_tree([1, None, 2])) is False  # same values, different shape
    assert f(make_tree([1, 2, 1]), make_tree([1, 1, 2])) is False
    assert f(None, None) is True
    assert f(make_tree([0]), None) is False
    trees = random_trees(101, count=60, max_nodes=5, lo=0, hi=1)
    for a in trees:
        for b in trees:
            assert f(a, b) is (tree_values(a) == tree_values(b))


@case("binary-tree-paths")
def _(ns):
    f = S(ns).binaryTreePaths
    assert sorted(f(make_tree([1, 2, 3, None, 5]))) == ["1->2->5", "1->3"]
    assert f(make_tree([1])) == ["1"]
    assert sorted(f(make_tree([-1, -2]))) == ["-1->-2"]

    def paths(n):
        if not n.left and not n.right:
            return [str(n.val)]
        return [f"{n.val}->{p}" for c in (n.left, n.right) if c for p in paths(c)]

    for root in random_trees(102):
        if root:
            assert sorted(f(root)) == sorted(paths(root))


@case("validate-binary-search-tree")
def _(ns):
    f = S(ns).isValidBST

    def brute(root):
        vals = inorder(root)
        return all(a < b for a, b in zip(vals, vals[1:]))

    assert f(make_tree([2, 1, 3])) is True
    assert f(make_tree([5, 1, 4, None, None, 3, 6])) is False
    assert f(make_tree([5, 4, 6, None, None, 3, 7])) is False  # violation deeper than the parent
    assert f(make_tree([2, 2, 2])) is False  # duplicates are not allowed
    assert f(make_tree([1, 1])) is False
    assert f(make_tree([-2147483648, None, 2147483647])) is True  # 32-bit extremes
    assert f(make_tree([2147483647])) is True
    for root in random_trees(103, count=500, max_nodes=7, lo=0, hi=6):
        if root:
            assert f(root) is brute(root), tree_values(root)


@case("lowest-common-ancestor-of-a-binary-tree")
def _(ns):
    f = S(ns).lowestCommonAncestor
    root = make_tree([3, 5, 1, 6, 2, 0, 8, None, None, 7, 4])
    assert f(root, find(root, 5), find(root, 1)).val == 3
    assert f(root, find(root, 5), find(root, 4)).val == 5  # a node is its own ancestor
    assert f(root, find(root, 7), find(root, 8)).val == 3
    root = make_tree([1, 2])
    assert f(root, find(root, 1), find(root, 2)).val == 1
    r = rng(104)
    for _ in range(200):
        n = r.randint(2, 15)
        root = random_tree(r, n)
        nodes = all_nodes(root)
        for i, node in enumerate(nodes):
            node.val = i  # unique values
        parent = {c: p for p in nodes for c in (p.left, p.right) if c}

        def ancestors(x):
            out = [x]
            while x in parent:
                x = parent[x]
                out.append(x)
            return out

        p, q = r.sample(nodes, 2)
        expected = next(a for a in ancestors(p) if a in set(ancestors(q)))
        assert f(root, p, q) is expected


@case("path-sum-iii")
def _(ns):
    f = S(ns).pathSum
    assert f(make_tree([10, 5, -3, 3, 2, None, 11, 3, -2, None, 1]), 8) == 3
    assert f(make_tree([5, 4, 8, 11, None, 13, 4, 7, 2, None, None, 5, 1]), 22) == 3
    assert f(None, 0) == 0
    assert f(make_tree([1]), 0) == 0  # empty path doesn't count
    assert f(make_tree([0, 0, 0]), 0) == 5
    assert f(make_tree([1000000000, 1000000000, None, 294967296, None, 1000000000]), 0) == 0

    def brute(root, target):
        count = 0

        def down(node, total):
            nonlocal count
            if not node:
                return
            total += node.val
            count += total == target
            down(node.left, total)
            down(node.right, total)

        for node in all_nodes(root):
            down(node, 0)
        return count

    r = rng(105)
    for root in random_trees(105, lo=-3, hi=3):
        t = r.randint(-4, 4)
        assert f(root, t) == brute(root, t)


@case("count-good-nodes-in-binary-tree")
def _(ns):
    f = S(ns).goodNodes
    assert f(make_tree([3, 1, 4, 3, None, 1, 5])) == 4
    assert f(make_tree([3, 3, None, 4, 2])) == 3  # equal to the max counts as good
    assert f(make_tree([1])) == 1

    def brute(node, best):
        if not node:
            return 0
        good = node.val >= best
        best = max(best, node.val)
        return good + brute(node.left, best) + brute(node.right, best)

    for root in random_trees(106, lo=-3, hi=3):
        if root:
            assert f(root) == brute(root, root.val)


@case("construct-binary-tree-from-preorder-and-inorder-traversal")
def _(ns):
    f = S(ns).buildTree

    def preorder(n):
        return [n.val] + preorder(n.left) + preorder(n.right) if n else []

    assert tree_values(f([3, 9, 20, 15, 7], [9, 3, 15, 20, 7])) == [3, 9, 20, None, None, 15, 7]
    assert tree_values(f([-1], [-1])) == [-1]
    r = rng(107)
    for _ in range(300):
        root = random_tree(r, r.randint(1, 15))
        nodes = all_nodes(root)
        for v, node in zip(r.sample(range(-100, 100), len(nodes)), nodes):
            node.val = v  # unique values, as required
        assert tree_values(f(preorder(root), inorder(root))) == tree_values(root)
    # a long chain must not blow the recursion limit or be quadratic
    chain = list(range(3000))
    assert inorder(f(chain, chain[::-1]))[:5] == [2999, 2998, 2997, 2996, 2995]


@case("unique-binary-search-trees")
def _(ns):
    f = S(ns).numTrees
    catalan = [1]
    for n in range(1, 20):
        catalan.append(catalan[-1] * 2 * (2 * n - 1) // (n + 1))
    for n in range(1, 20):
        assert f(n) == catalan[n], n


@case("binary-tree-maximum-path-sum")
def _(ns):
    f = S(ns).maxPathSum
    assert f(make_tree([1, 2, 3])) == 6
    assert f(make_tree([-10, 9, 20, None, None, 15, 7])) == 42
    assert f(make_tree([-3])) == -3  # all negative: best is the single largest node
    assert f(make_tree([-2, -1])) == -1
    assert f(make_tree([2, -1])) == 2

    def brute(root):
        nodes = all_nodes(root)
        adj = {n: [] for n in nodes}
        for n in nodes:
            for c in (n.left, n.right):
                if c:
                    adj[n].append(c)
                    adj[c].append(n)
        best = float("-inf")
        for start in nodes:  # every simple path is a tree path from some start
            stack = [(start, None, start.val)]
            while stack:
                node, prev, total = stack.pop()
                best = max(best, total)
                for nxt in adj[node]:
                    if nxt is not prev:
                        stack.append((nxt, node, total + nxt.val))
        return best

    for root in random_trees(108, max_nodes=10):
        if root:
            assert f(root) == brute(root)


# ---------------- Trees (BFS) ----------------

@case("binary-tree-level-order-traversal-ii")
def _(ns):
    f = S(ns).levelOrderBottom
    assert f(make_tree([3, 9, 20, None, None, 15, 7])) == [[15, 7], [9, 20], [3]]
    assert f(None) == []
    for root in random_trees(110):
        assert f(root) == levels(root)[::-1]


@case("maximum-depth-of-binary-tree")
def _(ns):
    f = S(ns).maxDepth
    assert f(make_tree([3, 9, 20, None, None, 15, 7])) == 3
    assert f(make_tree([1, None, 2])) == 2
    assert f(None) == 0
    for root in random_trees(111):
        assert f(root) == len(levels(root))


@case("binary-tree-level-order-traversal")
def _(ns):
    f = S(ns).levelOrder
    assert f(make_tree([3, 9, 20, None, None, 15, 7])) == [[3], [9, 20], [15, 7]]
    assert f(make_tree([1])) == [[1]]
    assert f(None) == []
    for root in random_trees(112):
        assert f(root) == levels(root)


@case("binary-tree-zigzag-level-order-traversal")
def _(ns):
    f = S(ns).zigzagLevelOrder
    assert f(make_tree([3, 9, 20, None, None, 15, 7])) == [[3], [20, 9], [15, 7]]
    assert f(None) == []
    for root in random_trees(113):
        assert f(root) == [lv if i % 2 == 0 else lv[::-1] for i, lv in enumerate(levels(root))]


@case("binary-tree-right-side-view")
def _(ns):
    f = S(ns).rightSideView
    assert f(make_tree([1, 2, 3, None, 5, None, 4])) == [1, 3, 4]
    assert f(make_tree([1, 2, 3, 4])) == [1, 3, 4]  # a left node visible from the right
    assert f(None) == []
    for root in random_trees(114):
        assert f(root) == [lv[-1] for lv in levels(root)]


@case("populating-next-right-pointers-in-each-node", node_class=NextNode)
def _(ns):
    f = S(ns).connect
    assert f(None) is None
    for depth in range(1, 7):
        values = list(range(2**depth - 1))
        root = make_tree(values, cls=NextNode)
        assert f(root) is root
        q = [root]
        while q:
            for a, b in zip(q, q[1:] + [None]):
                assert a.next is b, (depth, a.val)
            q = [c for n in q for c in (n.left, n.right) if c]


@case("count-complete-tree-nodes")
def _(ns):
    f = S(ns).countNodes
    assert f(None) == 0
    for n in range(1, 300):
        assert f(make_tree(list(range(n)))) == n, n


@case("maximum-level-sum-of-a-binary-tree")
def _(ns):
    f = S(ns).maxLevelSum
    assert f(make_tree([1, 7, 0, 7, -8, None, None])) == 2
    assert f(make_tree([989, None, 10250, 98693, -89388, None, None, None, -32127])) == 2
    assert f(make_tree([-1, -2, -3])) == 1  # all negative
    assert f(make_tree([0, 1, -1])) == 1  # ties go to the smallest level
    for root in random_trees(115):
        if root:
            sums = [sum(lv) for lv in levels(root)]
            assert f(root) == sums.index(max(sums)) + 1


@case("find-largest-value-in-each-tree-row")
def _(ns):
    f = S(ns).largestValues
    assert f(make_tree([1, 3, 2, 5, 3, None, 9])) == [1, 3, 9]
    assert f(make_tree([-5, -7, -6])) == [-5, -6]
    assert f(None) == []
    for root in random_trees(116):
        assert f(root) == [max(lv) for lv in levels(root)]


@case("serialize-and-deserialize-binary-tree")
def _(ns):
    Codec = ns["Codec"]
    for values in ([1, 2, 3, None, None, 4, 5], [], [1], [-1000, None, 1000], [1, None, 2, None, 3]):
        root = make_tree(values)
        data = Codec().serialize(root)
        assert isinstance(data, str)
        assert tree_values(Codec().deserialize(data)) == tree_values(root), values
    for root in random_trees(117, max_nodes=30, lo=-1000, hi=1000):
        assert tree_values(Codec().deserialize(Codec().serialize(root))) == tree_values(root)


# ---------------- Tries ----------------

@case("longest-common-prefix")
def _(ns):
    f = S(ns).longestCommonPrefix
    assert f(["flower", "flow", "flight"]) == "fl"
    assert f(["dog", "racecar", "car"]) == ""
    assert f(["a"]) == "a"
    assert f(["", "b"]) == ""
    assert f(["ab", "a"]) == "a"
    assert f(["same", "same"]) == "same"
    r = rng(120)
    import os
    for _ in range(300):
        words = ["".join(r.choice("ab") for _ in range(r.randint(0, 5))) for _ in range(r.randint(1, 5))]
        assert f(words) == os.path.commonprefix(words), words


@case("check-if-a-word-occurs-as-a-prefix-of-any-word-in-a-sentence")
def _(ns):
    f = S(ns).isPrefixOfWord
    assert f("i love eating burger", "burg") == 4
    assert f("this problem is an easy problem", "pro") == 2  # first match wins
    assert f("i am tired", "you") == -1
    assert f("hello", "hello") == 1
    assert f("hello", "helloo") == -1
    assert f("a b c", "c") == 3
    assert f("hellohello hellohellohello", "ell") == -1  # must be a prefix, not a substring


@case("implement-trie-prefix-tree")
def _(ns):
    t = ns["Trie"]()
    t.insert("apple")
    assert t.search("apple") is True
    assert t.search("app") is False
    assert t.startsWith("app") is True
    t.insert("app")
    assert t.search("app") is True
    assert t.startsWith("apple") is True
    assert t.startsWith("applez") is False
    assert t.search("") is False
    r = rng(121)
    t, words = ns["Trie"](), set()
    for _ in range(2000):
        w = "".join(r.choice("abc") for _ in range(r.randint(1, 4)))
        op = r.random()
        if op < 0.4:
            t.insert(w)
            words.add(w)
        elif op < 0.7:
            assert t.search(w) is (w in words), w
        else:
            assert t.startsWith(w) is any(x.startswith(w) for x in words), w


@case("design-add-and-search-words-data-structure")
def _(ns):
    d = ns["WordDictionary"]()
    for w in ("bad", "dad", "mad"):
        d.addWord(w)
    assert d.search("pad") is False
    assert d.search("bad") is True
    assert d.search(".ad") is True
    assert d.search("b..") is True
    assert d.search("...") is True
    assert d.search("....") is False
    assert d.search("..") is False
    r = rng(122)
    d, words = ns["WordDictionary"](), set()
    for _ in range(1500):
        if r.random() < 0.4:
            w = "".join(r.choice("ab") for _ in range(r.randint(1, 4)))
            d.addWord(w)
            words.add(w)
        else:
            pattern = "".join(r.choice("ab.") for _ in range(r.randint(1, 4)))
            assert d.search(pattern) is any(re.fullmatch(pattern, w) for w in words), pattern


@case("search-suggestions-system")
def _(ns):
    f = S(ns).suggestedProducts
    products = ["mobile", "mouse", "moneypot", "monitor", "mousepad"]
    assert f(products, "mouse") == [
        ["mobile", "moneypot", "monitor"],
        ["mobile", "moneypot", "monitor"],
        ["mouse", "mousepad"],
        ["mouse", "mousepad"],
        ["mouse", "mousepad"],
    ]
    assert f(["havana"], "tatiana") == [[]] * 7
    r = rng(123)
    for _ in range(200):
        prods = list({"".join(r.choice("abc") for _ in range(r.randint(1, 4))) for _ in range(r.randint(1, 10))})
        word = "".join(r.choice("abc") for _ in range(r.randint(1, 4)))
        brute = [sorted(p for p in prods if p.startswith(word[:i]))[:3] for i in range(1, len(word) + 1)]
        assert f(list(prods), word) == brute, (prods, word)


@case("replace-words")
def _(ns):
    f = S(ns).replaceWords
    assert f(["cat", "bat", "rat"], "the cattle was rattled by the battery") == "the cat was rat by the bat"
    assert f(["a", "b", "c"], "aadsfasf absbs bbab cadsfafs") == "a a b c"
    assert f(["a", "aa"], "aaaa") == "a"  # the shortest root wins
    assert f(["catt", "cat"], "cattle") == "cat"
    assert f(["xyz"], "abc def") == "abc def"
    r = rng(124)
    for _ in range(200):
        roots = list({"".join(r.choice("ab") for _ in range(r.randint(1, 3))) for _ in range(r.randint(1, 4))})
        words = ["".join(r.choice("ab") for _ in range(r.randint(1, 5))) for _ in range(r.randint(1, 5))]
        brute = " ".join(min([x for x in roots if w.startswith(x)], key=len, default=w) for w in words)
        assert f(roots, " ".join(words)) == brute, (roots, words)


@case("map-sum-pairs")
def _(ns):
    m = ns["MapSum"]()
    m.insert("apple", 3)
    assert m.sum("ap") == 3
    m.insert("app", 2)
    assert m.sum("ap") == 5
    m.insert("apple", 10)  # overwrite replaces, not adds
    assert m.sum("ap") == 12
    assert m.sum("b") == 0
    assert m.sum("apple") == 10
    r = rng(125)
    m, ref = ns["MapSum"](), {}
    for _ in range(1500):
        k = "".join(r.choice("ab") for _ in range(r.randint(1, 4)))
        if r.random() < 0.5:
            v = r.randint(1, 50)
            m.insert(k, v)
            ref[k] = v
        else:
            assert m.sum(k) == sum(v for key, v in ref.items() if key.startswith(k)), k


@case("stream-of-characters")
def _(ns):
    sc = ns["StreamChecker"](["cd", "f", "kl"])
    got = [sc.query(c) for c in "abcdefghijkl"]
    assert got == [False, False, False, True, False, True, False, False, False, False, False, True]
    r = rng(126)
    for _ in range(50):
        words = list({"".join(r.choice("ab") for _ in range(r.randint(1, 4))) for _ in range(r.randint(1, 4))})
        sc, stream = ns["StreamChecker"](words), ""
        for _ in range(60):
            c = r.choice("ab")
            stream += c
            assert sc.query(c) is any(stream.endswith(w) for w in words), (words, stream)


@case("maximum-xor-of-two-numbers-in-an-array")
def _(ns):
    f = S(ns).findMaximumXOR
    assert f([3, 10, 5, 25, 2, 8]) == 28
    assert f([14, 70, 53, 83, 49, 91, 36, 80, 92, 51, 66, 70]) == 127
    assert f([0]) == 0
    assert f([7, 7]) == 0
    assert f([0, 2147483647]) == 2147483647
    r = rng(127)
    for _ in range(300):
        nums = [r.randint(0, 2**31 - 1) for _ in range(r.randint(1, 10))]
        assert f(nums) == max((a ^ b for a, b in combinations(nums, 2)), default=0), nums


@case("word-search-ii")
def _(ns):
    f = S(ns).findWords
    board = [["o", "a", "a", "n"], ["e", "t", "a", "e"], ["i", "h", "k", "r"], ["i", "f", "l", "v"]]
    assert sorted(f([row[:] for row in board], ["oath", "pea", "eat", "rain"])) == ["eat", "oath"]
    assert f([["a", "b"], ["c", "d"]], ["abcb"]) == []  # can't reuse a cell
    assert sorted(f([["a"]], ["a", "a"])) == ["a"]  # duplicates in the word list reported once
    assert sorted(f([["a", "a"]], ["aaa"])) == []

    def exists(board, word):
        rows, cols = len(board), len(board[0])

        def dfs(i, j, k, seen):
            if board[i][j] != word[k]:
                return False
            if k == len(word) - 1:
                return True
            seen = seen | {(i, j)}
            return any(dfs(a, b, k + 1, seen) for a, b in ((i + 1, j), (i - 1, j), (i, j + 1), (i, j - 1))
                       if 0 <= a < rows and 0 <= b < cols and (a, b) not in seen)

        return any(dfs(i, j, 0, frozenset()) for i in range(rows) for j in range(cols))

    r = rng(128)
    for _ in range(200):
        rows, cols = r.randint(1, 3), r.randint(1, 3)
        board = [[r.choice("ab") for _ in range(cols)] for _ in range(rows)]
        words = list({"".join(r.choice("ab") for _ in range(r.randint(1, 4))) for _ in range(r.randint(1, 5))})
        out = f([row[:] for row in board], list(words))
        assert len(out) == len(set(out))
        assert sorted(out) == sorted(w for w in words if exists(board, w)), (board, words)

