"""Backtracking, Graphs and Dynamic Programming."""

from collections import deque
from functools import lru_cache
from itertools import combinations, permutations, product

from harness import GraphNode, case, canon, make_tree, random_tree, rng


def S(ns):
    return ns["Solution"]()


# ---------------- Backtracking ----------------

@case("path-sum")
def _(ns):
    f = S(ns).hasPathSum
    assert f(make_tree([5, 4, 8, 11, None, 13, 4, 7, 2, None, None, None, 1]), 22) is True
    assert f(make_tree([1, 2, 3]), 5) is False
    assert f(None, 0) is False  # an empty tree has no root-to-leaf path
    assert f(make_tree([1, 2]), 1) is False  # 1 is not a leaf
    assert f(make_tree([-2, None, -3]), -5) is True

    def sums(n):
        if not n.left and not n.right:
            return {n.val}
        return {n.val + s for c in (n.left, n.right) if c for s in sums(c)}

    r = rng(130)
    for _ in range(300):
        root = random_tree(r, r.randint(1, 10), -3, 3)
        t = r.randint(-8, 8)
        assert f(root, t) is (t in sums(root))


@case("binary-watch")
def _(ns):
    f = S(ns).readBinaryWatch
    for n in range(0, 11):
        brute = sorted(f"{h}:{m:02d}" for h in range(12) for m in range(60) if bin(h).count("1") + bin(m).count("1") == n)
        assert sorted(f(n)) == brute, n
    assert f(9) == []
    assert sorted(f(1))[:2] == ["0:01", "0:02"]  # no leading zero on hours, two-digit minutes


@case("letter-combinations-of-a-phone-number")
def _(ns):
    f = S(ns).letterCombinations
    keys = {"2": "abc", "3": "def", "4": "ghi", "5": "jkl", "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz"}
    assert sorted(f("23")) == ["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"]
    assert f("") == []
    assert sorted(f("2")) == ["a", "b", "c"]
    for digits in ("79", "234", "7979", "9"):
        assert sorted(f(digits)) == sorted("".join(p) for p in product(*(keys[d] for d in digits)))


@case("subsets")
def _(ns):
    f = S(ns).subsets
    for n in range(0, 9):
        nums = list(range(-n, 0)) if n % 2 else list(range(n))
        out = f(list(nums))
        expected = canon([list(c) for k in range(n + 1) for c in combinations(nums, k)])
        assert canon(out) == expected and len(out) == 2**n, nums


@case("permutations")
def _(ns):
    f = S(ns).permute
    for nums in ([1, 2, 3], [0, 1], [1], [-1, 5, 3, 0], list(range(6))):
        out = f(list(nums))
        assert sorted(map(tuple, out)) == sorted(permutations(nums)), nums


@case("combination-sum")
def _(ns):
    f = S(ns).combinationSum

    def brute(cands, target):
        out = set()

        def go(start, rest, combo):
            if rest == 0:
                out.add(tuple(combo))
                return
            for i in range(start, len(cands)):
                if cands[i] <= rest:
                    go(i, rest - cands[i], combo + [cands[i]])

        go(0, target, [])
        return sorted(tuple(sorted(c)) for c in out)

    assert canon(f([2, 3, 6, 7], 7)) == [(2, 2, 3), (7,)]
    assert canon(f([2, 3, 5], 8)) == [(2, 2, 2, 2), (2, 3, 3), (3, 5)]
    assert f([2], 1) == []
    r = rng(131)
    for _ in range(200):
        cands = sorted(r.sample(range(2, 12), r.randint(1, 4)))
        t = r.randint(1, 20)
        out = f(list(cands), t)
        assert len(out) == len({tuple(sorted(c)) for c in out}), "duplicate combinations"
        assert canon(out) == brute(cands, t), (cands, t)


@case("palindrome-partitioning")
def _(ns):
    f = S(ns).partition

    def brute(s):
        out = []
        for cuts in product([0, 1], repeat=max(0, len(s) - 1)):
            parts, start = [], 0
            for i, c in enumerate(cuts, 1):
                if c:
                    parts.append(s[start:i])
                    start = i
            parts.append(s[start:])
            if all(p == p[::-1] for p in parts):
                out.append(parts)
        return sorted(out)

    assert sorted(f("aab")) == [["a", "a", "b"], ["aa", "b"]]
    assert f("a") == [["a"]]
    r = rng(132)
    for _ in range(200):
        s = "".join(r.choice("ab") for _ in range(r.randint(1, 8)))
        assert sorted(f(s)) == brute(s), s


@case("word-search")
def _(ns):
    f = S(ns).exist
    board = [["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]]
    assert f([r[:] for r in board], "ABCCED") is True
    assert f([r[:] for r in board], "SEE") is True
    assert f([r[:] for r in board], "ABCB") is False  # can't reuse a cell
    assert f([["a"]], "a") is True
    assert f([["a"]], "aa") is False

    def brute(board, word):
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

    r = rng(133)
    for _ in range(300):
        rows, cols = r.randint(1, 3), r.randint(1, 4)
        board = [[r.choice("ab") for _ in range(cols)] for _ in range(rows)]
        word = "".join(r.choice("ab") for _ in range(r.randint(1, 5)))
        copy = [row[:] for row in board]
        assert f(copy, word) is brute(board, word), (board, word)
        assert copy == board, "board must be restored"


@case("restore-ip-addresses")
def _(ns):
    f = S(ns).restoreIpAddresses

    def brute(s):
        out = []
        for a, b, c in combinations(range(1, len(s)), 3):
            parts = [s[:a], s[a:b], s[b:c], s[c:]]
            if all(len(p) <= 3 and str(int(p)) == p and int(p) <= 255 for p in parts):
                out.append(".".join(parts))
        return sorted(out)

    assert sorted(f("25525511135")) == ["255.255.11.135", "255.255.111.35"]
    assert f("0000") == ["0.0.0.0"]
    assert sorted(f("101023")) == ["1.0.10.23", "1.0.102.3", "10.1.0.23", "10.10.2.3", "101.0.2.3"]
    assert f("1111111111111") == []  # too long
    assert f("256256256256") == []
    assert f("123") == []
    r = rng(134)
    for _ in range(300):
        s = "".join(r.choice("0125") for _ in range(r.randint(1, 13)))
        assert sorted(f(s)) == brute(s), s


@case("n-queens")
def _(ns):
    f = S(ns).solveNQueens
    counts = {1: 1, 2: 0, 3: 0, 4: 2, 5: 10, 6: 4, 7: 40, 8: 92}
    for n, count in counts.items():
        boards = f(n)
        assert len(boards) == count, n
        assert len({tuple(b) for b in boards}) == count
        for b in boards:
            assert len(b) == n and all(len(row) == n and set(row) <= {"Q", "."} for row in b)
            qs = [(i, row.index("Q")) for i, row in enumerate(b)]
            assert all(row.count("Q") == 1 for row in b)
            assert len({c for _, c in qs}) == n
            assert len({r - c for r, c in qs}) == n and len({r + c for r, c in qs}) == n
    assert sorted(f(4)) == sorted([[".Q..", "...Q", "Q...", "..Q."], ["..Q.", "Q...", "...Q", ".Q.."]])


# ---------------- Graphs ----------------

@case("find-the-town-judge")
def _(ns):
    f = S(ns).findJudge
    assert f(2, [[1, 2]]) == 2
    assert f(3, [[1, 3], [2, 3]]) == 3
    assert f(3, [[1, 3], [2, 3], [3, 1]]) == -1
    assert f(1, []) == 1
    assert f(2, []) == -1
    r = rng(140)
    for _ in range(500):
        n = r.randint(1, 5)
        trust = [list(p) for p in permutations(range(1, n + 1), 2) if r.random() < 0.4]
        judges = [j for j in range(1, n + 1)
                  if all([a, j] in trust for a in range(1, n + 1) if a != j) and not any(a == j for a, _ in trust)]
        assert f(n, trust) == (judges[0] if judges else -1), (n, trust)


def components(n, edges):
    parent = list(range(n))

    def root(x):
        while parent[x] != x:
            x = parent[x]
        return x

    for a, b in edges:
        parent[root(a)] = root(b)
    return [root(x) for x in range(n)]


@case("find-if-path-exists-in-graph")
def _(ns):
    f = S(ns).validPath
    assert f(3, [[0, 1], [1, 2], [2, 0]], 0, 2) is True
    assert f(6, [[0, 1], [0, 2], [3, 5], [5, 4], [4, 3]], 0, 5) is False
    assert f(1, [], 0, 0) is True
    r = rng(141)
    for _ in range(500):
        n = r.randint(1, 8)
        edges = [list(r.sample(range(n), 2)) for _ in range(r.randint(0, n))] if n > 1 else []
        s, d = r.randrange(n), r.randrange(n)
        comp = components(n, edges)
        assert f(n, [e[:] for e in edges], s, d) is (comp[s] == comp[d]), (n, edges, s, d)


def islands(grid):
    rows, cols = len(grid), len(grid[0])
    seen, count = set(), 0
    for i in range(rows):
        for j in range(cols):
            if grid[i][j] == "1" and (i, j) not in seen:
                count += 1
                stack = [(i, j)]
                while stack:
                    a, b = stack.pop()
                    if (a, b) in seen or not (0 <= a < rows and 0 <= b < cols) or grid[a][b] != "1":
                        continue
                    seen.add((a, b))
                    stack += [(a + 1, b), (a - 1, b), (a, b + 1), (a, b - 1)]
    return count


@case("number-of-islands")
def _(ns):
    f = S(ns).numIslands
    g = [["1", "1", "0", "0", "0"], ["1", "1", "0", "0", "0"], ["0", "0", "1", "0", "0"], ["0", "0", "0", "1", "1"]]
    assert f([r[:] for r in g]) == 3
    assert f([["0"]]) == 0
    assert f([["1"]]) == 1
    assert f([["1", "0", "1"], ["0", "1", "0"], ["1", "0", "1"]]) == 5  # diagonals don't connect
    r = rng(142)
    for _ in range(300):
        rows, cols = r.randint(1, 6), r.randint(1, 6)
        grid = [[r.choice("01") for _ in range(cols)] for _ in range(rows)]
        assert f([row[:] for row in grid]) == islands(grid), grid
    big = [["1"] * 150 for _ in range(150)]
    assert f(big) == 1  # one huge island must not overflow the stack


@case("number-of-provinces")
def _(ns):
    f = S(ns).findCircleNum
    assert f([[1, 1, 0], [1, 1, 0], [0, 0, 1]]) == 2
    assert f([[1, 0, 0], [0, 1, 0], [0, 0, 1]]) == 3
    assert f([[1]]) == 1
    r = rng(143)
    for _ in range(300):
        n = r.randint(1, 8)
        m = [[1 if i == j else 0 for j in range(n)] for i in range(n)]
        edges = []
        for i, j in combinations(range(n), 2):
            if r.random() < 0.25:
                m[i][j] = m[j][i] = 1
                edges.append((i, j))
        assert f(m) == len(set(components(n, edges))), m


@case("clone-graph", node_class=GraphNode)
def _(ns):
    f = S(ns).cloneGraph
    assert f(None) is None

    def build(adj):
        nodes = [GraphNode(i + 1) for i in range(len(adj))]
        for i, nbrs in enumerate(adj):
            nodes[i].neighbors = [nodes[j - 1] for j in nbrs]
        return nodes

    def shape(start):
        seen, q, out = {start}, deque([start]), {}
        while q:
            n = q.popleft()
            out[n.val] = [x.val for x in n.neighbors]
            for x in n.neighbors:
                if x not in seen:
                    seen.add(x)
                    q.append(x)
        return out, seen

    for adj in ([[2, 4], [1, 3], [2, 4], [1, 3]], [[]], [[2], [1]], [[2, 3], [1, 3], [1, 2]]):
        nodes = build(adj)
        copy = f(nodes[0])
        want, originals = shape(nodes[0])
        got, clones = shape(copy)
        assert got == want, adj
        assert not (clones & originals), "the clone must not share nodes with the original"


@case("course-schedule")
def _(ns):
    f = S(ns).canFinish

    def acyclic(n, prereqs):
        indeg = [0] * n
        out = [[] for _ in range(n)]
        for a, b in prereqs:
            out[b].append(a)
            indeg[a] += 1
        q = deque(i for i in range(n) if indeg[i] == 0)
        done = 0
        while q:
            x = q.popleft()
            done += 1
            for y in out[x]:
                indeg[y] -= 1
                if indeg[y] == 0:
                    q.append(y)
        return done == n

    assert f(2, [[1, 0]]) is True
    assert f(2, [[1, 0], [0, 1]]) is False
    assert f(1, []) is True
    assert f(3, [[0, 1], [0, 2], [1, 2]]) is True  # diamond, not a cycle
    r = rng(144)
    for _ in range(500):
        n = r.randint(1, 6)
        prereqs = list({tuple(r.sample(range(n), 2)) for _ in range(r.randint(0, 7))}) if n > 1 else []
        assert f(n, [list(p) for p in prereqs]) is acyclic(n, prereqs), (n, prereqs)


@case("course-schedule-ii")
def _(ns):
    f = S(ns).findOrder

    def valid(n, prereqs, order):
        pos = {c: i for i, c in enumerate(order)}
        return sorted(order) == list(range(n)) and all(pos[b] < pos[a] for a, b in prereqs)

    assert f(2, [[1, 0]]) == [0, 1]
    assert valid(4, [[1, 0], [2, 0], [3, 1], [3, 2]], f(4, [[1, 0], [2, 0], [3, 1], [3, 2]]))
    assert f(1, []) == [0]
    assert f(2, [[0, 1], [1, 0]]) == []
    r = rng(145)
    for _ in range(500):
        n = r.randint(1, 6)
        prereqs = list({tuple(r.sample(range(n), 2)) for _ in range(r.randint(0, 7))}) if n > 1 else []
        out = f(n, [list(p) for p in prereqs])
        possible = any(valid(n, prereqs, list(p)) for p in permutations(range(n)))
        if possible:
            assert valid(n, prereqs, out), (n, prereqs, out)
        else:
            assert out == [], (n, prereqs, out)


@case("rotting-oranges")
def _(ns):
    f = S(ns).orangesRotting

    def brute(grid):
        g = [row[:] for row in grid]
        minutes = 0
        while True:
            rot = [(i, j) for i, row in enumerate(g) for j, v in enumerate(row) if v == 1
                   and any(0 <= a < len(g) and 0 <= b < len(g[0]) and g[a][b] == 2
                           for a, b in ((i + 1, j), (i - 1, j), (i, j + 1), (i, j - 1)))]
            if not rot:
                break
            for i, j in rot:
                g[i][j] = 2
            minutes += 1
        return -1 if any(1 in row for row in g) else minutes

    assert f([[2, 1, 1], [1, 1, 0], [0, 1, 1]]) == 4
    assert f([[2, 1, 1], [0, 1, 1], [1, 0, 1]]) == -1
    assert f([[0, 2]]) == 0
    assert f([[0]]) == 0
    assert f([[1]]) == -1
    r = rng(146)
    for _ in range(500):
        rows, cols = r.randint(1, 5), r.randint(1, 5)
        grid = [[r.choice([0, 1, 1, 2]) for _ in range(cols)] for _ in range(rows)]
        assert f([row[:] for row in grid]) == brute(grid), grid


@case("pacific-atlantic-water-flow")
def _(ns):
    f = S(ns).pacificAtlantic

    def brute(h):
        rows, cols = len(h), len(h[0])

        def reaches(i, j, ocean):
            seen, stack = set(), [(i, j)]
            while stack:
                a, b = stack.pop()
                if (a, b) in seen:
                    continue
                seen.add((a, b))
                if ocean == "P" and (a == 0 or b == 0):
                    return True
                if ocean == "A" and (a == rows - 1 or b == cols - 1):
                    return True
                for x, y in ((a + 1, b), (a - 1, b), (a, b + 1), (a, b - 1)):
                    if 0 <= x < rows and 0 <= y < cols and h[x][y] <= h[a][b]:
                        stack.append((x, y))
            return False

        return sorted([i, j] for i in range(rows) for j in range(cols) if reaches(i, j, "P") and reaches(i, j, "A"))

    h = [[1, 2, 2, 3, 5], [3, 2, 3, 4, 4], [2, 4, 5, 3, 1], [6, 7, 1, 4, 5], [5, 1, 1, 2, 4]]
    assert sorted(f(h)) == [[0, 4], [1, 3], [1, 4], [2, 2], [3, 0], [3, 1], [4, 0]]
    assert f([[1]]) == [[0, 0]]
    r = rng(147)
    for _ in range(300):
        rows, cols = r.randint(1, 5), r.randint(1, 5)
        h = [[r.randint(0, 4) for _ in range(cols)] for _ in range(rows)]
        assert sorted(f(h)) == brute(h), h


@case("word-ladder")
def _(ns):
    f = S(ns).ladderLength

    def brute(begin, end, words):
        words = set(words)
        if end not in words:
            return 0
        dist = {begin: 1}
        q = deque([begin])
        while q:
            w = q.popleft()
            if w == end:
                return dist[w]
            for x in words:
                if x not in dist and sum(a != b for a, b in zip(w, x)) == 1:
                    dist[x] = dist[w] + 1
                    q.append(x)
        return 0

    assert f("hit", "cog", ["hot", "dot", "dog", "lot", "log", "cog"]) == 5
    assert f("hit", "cog", ["hot", "dot", "dog", "lot", "log"]) == 0  # end not in the list
    assert f("a", "c", ["a", "b", "c"]) == 2
    assert f("hot", "dog", ["hot", "dog"]) == 0
    r = rng(148)
    for _ in range(300):
        words = list({"".join(r.choice("abc") for _ in range(3)) for _ in range(r.randint(1, 12))})
        begin = "".join(r.choice("abc") for _ in range(3))
        end = r.choice(words)
        if begin == end:
            continue
        assert f(begin, end, list(words)) == brute(begin, end, words), (begin, end, words)


# ---------------- Dynamic Programming ----------------

@case("climbing-stairs")
def _(ns):
    f = S(ns).climbStairs
    fib = [1, 1]
    for _ in range(50):
        fib.append(fib[-1] + fib[-2])
    for n in range(1, 46):
        assert f(n) == fib[n], n


@case("min-cost-climbing-stairs")
def _(ns):
    f = S(ns).minCostClimbingStairs
    assert f([10, 15, 20]) == 15
    assert f([1, 100, 1, 1, 1, 100, 1, 1, 100, 1]) == 6
    assert f([0, 0]) == 0
    r = rng(150)
    for _ in range(300):
        cost = [r.randint(0, 9) for _ in range(r.randint(2, 10))]
        n = len(cost)

        @lru_cache(None)
        def best(i):
            return 0 if i >= n else cost[i] + min(best(i + 1), best(i + 2))

        assert f(cost) == min(best(0), best(1)), cost


@case("house-robber")
def _(ns):
    f = S(ns).rob
    assert f([1, 2, 3, 1]) == 4
    assert f([2, 7, 9, 3, 1]) == 12
    assert f([0]) == 0
    assert f([5]) == 5
    assert f([2, 1, 1, 2]) == 4  # skip two in a row
    r = rng(151)
    for _ in range(300):
        nums = [r.randint(0, 9) for _ in range(r.randint(1, 10))]
        brute = max(sum(nums[i] for i in pick) for k in range(len(nums) + 1)
                    for pick in combinations(range(len(nums)), k) if all(b - a > 1 for a, b in zip(pick, pick[1:])))
        assert f(nums) == brute, nums


@case("coin-change")
def _(ns):
    f = S(ns).coinChange
    assert f([1, 2, 5], 11) == 3
    assert f([2], 3) == -1
    assert f([1], 0) == 0
    assert f([186, 419, 83, 408], 6249) == 20
    assert f([3, 7], 5) == -1
    r = rng(152)
    for _ in range(300):
        coins = r.sample(range(1, 12), r.randint(1, 4))
        amount = r.randint(0, 40)
        dist = {0: 0}
        q = deque([0])
        while q:
            x = q.popleft()
            for c in coins:
                if x + c <= amount and x + c not in dist:
                    dist[x + c] = dist[x] + 1
                    q.append(x + c)
        assert f(coins, amount) == dist.get(amount, -1), (coins, amount)


@case("longest-increasing-subsequence")
def _(ns):
    f = S(ns).lengthOfLIS
    assert f([10, 9, 2, 5, 3, 7, 101, 18]) == 4
    assert f([0, 1, 0, 3, 2, 3]) == 4
    assert f([7, 7, 7, 7]) == 1  # strictly increasing
    assert f([5]) == 1
    r = rng(153)
    for _ in range(300):
        nums = [r.randint(-5, 5) for _ in range(r.randint(1, 10))]
        brute = max(k for k in range(1, len(nums) + 1) for c in combinations(nums, k) if all(a < b for a, b in zip(c, c[1:])))
        assert f(nums) == brute, nums


@case("unique-paths")
def _(ns):
    f = S(ns).uniquePaths
    from math import comb
    assert f(3, 7) == 28
    assert f(3, 2) == 3
    assert f(1, 1) == 1
    for m in range(1, 15):
        for n in range(1, 15):
            assert f(m, n) == comb(m + n - 2, m - 1), (m, n)
    assert f(100, 1) == 1


@case("partition-equal-subset-sum")
def _(ns):
    f = S(ns).canPartition
    assert f([1, 5, 11, 5]) is True
    assert f([1, 2, 3, 5]) is False
    assert f([1]) is False
    assert f([2, 2]) is True
    assert f([1, 1, 1]) is False  # odd total
    r = rng(154)
    for _ in range(300):
        nums = [r.randint(1, 10) for _ in range(r.randint(1, 10))]
        total = sum(nums)
        brute = total % 2 == 0 and any(sum(c) == total // 2 for k in range(len(nums) + 1) for c in combinations(nums, k))
        assert f(nums) is brute, nums


@case("decode-ways")
def _(ns):
    f = S(ns).numDecodings

    @lru_cache(None)
    def brute(s):
        if not s:
            return 1
        total = 0
        if s[0] != "0":
            total += brute(s[1:])
            if len(s) >= 2 and 10 <= int(s[:2]) <= 26:
                total += brute(s[2:])
        return total

    assert f("12") == 2
    assert f("226") == 3
    assert f("06") == 0
    assert f("0") == 0
    assert f("10") == 1
    assert f("100") == 0
    assert f("27") == 1
    assert f("2101") == 1
    r = rng(155)
    for _ in range(1000):
        s = "".join(r.choice("0122367") for _ in range(r.randint(1, 10)))
        assert f(s) == brute(s), s


@case("word-break")
def _(ns):
    f = S(ns).wordBreak

    @lru_cache(None)
    def brute(s, words):
        return s == "" or any(s.startswith(w) and brute(s[len(w):], words) for w in words)

    assert f("leetcode", ["leet", "code"]) is True
    assert f("applepenapple", ["apple", "pen"]) is True
    assert f("catsandog", ["cats", "dog", "sand", "and", "cat"]) is False
    assert f("a", ["b"]) is False
    assert f("aaaaaaaaaaaaaaaaaaaaaaaaaaaaab", ["a", "aa", "aaa", "aaaa"]) is False  # no exponential blow-up
    r = rng(156)
    for _ in range(300):
        words = tuple({"".join(r.choice("ab") for _ in range(r.randint(1, 3))) for _ in range(r.randint(1, 4))})
        s = "".join(r.choice("ab") for _ in range(r.randint(1, 10)))
        assert f(s, list(words)) is brute(s, words), (s, words)


@case("edit-distance")
def _(ns):
    f = S(ns).minDistance

    @lru_cache(None)
    def brute(a, b):
        if not a or not b:
            return len(a) + len(b)
        if a[0] == b[0]:
            return brute(a[1:], b[1:])
        return 1 + min(brute(a[1:], b), brute(a, b[1:]), brute(a[1:], b[1:]))

    assert f("horse", "ros") == 3
    assert f("intention", "execution") == 5
    assert f("", "") == 0
    assert f("", "abc") == 3
    assert f("abc", "") == 3
    assert f("same", "same") == 0
    r = rng(157)
    for _ in range(500):
        a = "".join(r.choice("abc") for _ in range(r.randint(0, 7)))
        b = "".join(r.choice("abc") for _ in range(r.randint(0, 7)))
        assert f(a, b) == brute(a, b), (a, b)
