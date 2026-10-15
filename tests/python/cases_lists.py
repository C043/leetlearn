"""Fast & Slow Pointers and Linked List."""

from harness import (
    case,
    list_nodes,
    list_values,
    make_cycle,
    make_list,
    make_tree,
    random_tree,
    rng,
)


def S(ns):
    return ns["Solution"]()


def random_lists(seed, count=200, lo=0, hi=9, max_len=10):
    r = rng(seed)
    return [[r.randint(lo, hi) for _ in range(r.randint(0, max_len))] for _ in range(count)]


# ---------------- Fast & Slow Pointers ----------------

@case("linked-list-cycle")
def _(ns):
    f = S(ns).hasCycle
    assert f(None) is False
    for values in ([1], [1, 2], [3, 2, 0, -4], list(range(30))):
        assert f(make_cycle(values, -1)[0]) is False
        for pos in range(len(values)):
            assert f(make_cycle(values, pos)[0]) is True, (values, pos)


@case("middle-of-the-linked-list")
def _(ns):
    f = S(ns).middleNode
    for n in range(1, 25):
        head = make_list(list(range(n)))
        nodes = list_nodes(head)
        assert f(head) is nodes[n // 2], n  # second middle for even lengths


@case("linked-list-cycle-ii")
def _(ns):
    f = S(ns).detectCycle
    assert f(None) is None
    for values in ([1], [1, 2], [3, 2, 0, -4], list(range(17))):
        assert f(make_cycle(values, -1)[0]) is None
        for pos in range(len(values)):
            head, nodes = make_cycle(values, pos)
            assert f(head) is nodes[pos], (values, pos)


@case("find-the-duplicate-number")
def _(ns):
    f = S(ns).findDuplicate
    assert f([1, 3, 4, 2, 2]) == 2
    assert f([3, 1, 3, 4, 2]) == 3
    assert f([3, 3, 3, 3, 3]) == 3
    assert f([1, 1]) == 1
    assert f([2, 2, 2]) == 2
    r = rng(30)
    for _ in range(300):
        n = r.randint(1, 15)
        dup = r.randint(1, n)
        nums = list(range(1, n + 1)) + [dup]
        # the duplicate may repeat more than twice, replacing other values
        for i in r.sample(range(n + 1), r.randint(0, n // 2)):
            nums[i] = dup
        r.shuffle(nums)
        original = list(nums)
        assert f(nums) == dup, original
        assert nums == original, "must not modify the array"


@case("happy-number")
def _(ns):
    f = S(ns).isHappy

    def brute(n):
        seen = set()
        while n != 1 and n not in seen:
            seen.add(n)
            n = sum(int(d) ** 2 for d in str(n))
        return n == 1

    assert f(19) is True
    assert f(2) is False
    assert f(1) is True
    assert f(7) is True
    assert f(2**31 - 1) is brute(2**31 - 1)
    for n in range(1, 1500):
        assert f(n) is brute(n), n


@case("circular-array-loop")
def _(ns):
    f = S(ns).circularArrayLoop

    def brute(nums):
        n = len(nums)
        for start in range(n):
            forward = nums[start] > 0
            index, seen = start, []
            while index not in seen:
                if (nums[index] > 0) != forward:
                    break
                seen.append(index)
                index = (index + nums[index]) % n
            else:
                cycle = seen[seen.index(index):]
                if len(cycle) > 1 and all((nums[i] > 0) == forward for i in cycle):
                    return True
        return False

    assert f([2, -1, 1, 2, 2]) is True
    assert f([-1, -2, -3, -4, -5, 6]) is False
    assert f([1, -1, 5, 1, 4]) is True
    assert f([1]) is False  # self-loop doesn't count
    assert f([-2, 1, -1, -2, -2]) is False
    assert f([2, 2, 2, 2, 2, 4, 7]) is False
    assert f([3, 1, 2]) is True
    r = rng(31)
    for _ in range(2000):
        nums = [r.choice([v for v in range(-6, 7) if v != 0]) for _ in range(r.randint(1, 7))]
        assert f(list(nums)) is brute(nums), nums


@case("sort-list")
def _(ns):
    f = S(ns).sortList
    assert f(None) is None
    for values in [[4, 2, 1, 3], [-1, 5, 3, 4, 0], [1], [2, 1], [1, 1, 1]] + random_lists(32, lo=-9):
        assert list_values(f(make_list(values))) == sorted(values), values
    big = list(range(5000, 0, -1))
    assert list_values(f(make_list(big))) == sorted(big)


@case("reorder-list")
def _(ns):
    f = S(ns).reorderList

    def expected(v):
        out, i, j = [], 0, len(v) - 1
        while i <= j:
            out.append(v[i])
            if i != j:
                out.append(v[j])
            i, j = i + 1, j - 1
        return out

    for values in [[1, 2, 3, 4], [1, 2, 3, 4, 5], [1], [1, 2], [1, 2, 3]] + [list(range(n)) for n in range(1, 20)]:
        head = make_list(values)
        nodes = list_nodes(head)
        assert f(head) is None
        assert list_values(head) == expected(values), values
        assert sorted(map(id, list_nodes(head))) == sorted(map(id, nodes)), "must reuse the nodes"


@case("partition-list")
def _(ns):
    f = S(ns).partition
    assert list_values(f(make_list([1, 4, 3, 2, 5, 2]), 3)) == [1, 2, 2, 4, 3, 5]
    assert list_values(f(make_list([2, 1]), 2)) == [1, 2]
    assert f(None, 0) is None
    for values in random_lists(33):
        for x in (0, 4, 10):
            expected = [v for v in values if v < x] + [v for v in values if v >= x]
            assert list_values(f(make_list(values), x)) == expected, (values, x)


@case("reverse-nodes-in-k-group")
def _(ns):
    f = S(ns).reverseKGroup

    def expected(v, k):
        out = []
        for i in range(0, len(v), k):
            chunk = v[i : i + k]
            out += chunk[::-1] if len(chunk) == k else chunk
        return out

    assert list_values(f(make_list([1, 2, 3, 4, 5]), 2)) == [2, 1, 4, 3, 5]
    assert list_values(f(make_list([1, 2, 3, 4, 5]), 3)) == [3, 2, 1, 4, 5]
    for n in range(1, 13):
        for k in range(1, n + 1):
            values = list(range(1, n + 1))
            assert list_values(f(make_list(values), k)) == expected(values, k), (n, k)


# ---------------- Linked List ----------------

@case("reverse-linked-list")
def _(ns):
    f = S(ns).reverseList
    assert f(None) is None
    for values in [[1, 2, 3, 4, 5], [1, 2], [7]] + random_lists(40):
        if values:
            assert list_values(f(make_list(values))) == values[::-1], values
    big = list(range(20000))
    assert list_values(f(make_list(big))) == big[::-1]  # no recursion depth issues


@case("merge-two-sorted-lists")
def _(ns):
    f = S(ns).mergeTwoLists
    assert list_values(f(make_list([1, 2, 4]), make_list([1, 3, 4]))) == [1, 1, 2, 3, 4, 4]
    assert f(None, None) is None
    assert list_values(f(None, make_list([0]))) == [0]
    assert list_values(f(make_list([5]), None)) == [5]
    r = rng(41)
    for _ in range(300):
        a = sorted(r.randint(-10, 10) for _ in range(r.randint(0, 8)))
        b = sorted(r.randint(-10, 10) for _ in range(r.randint(0, 8)))
        assert list_values(f(make_list(a), make_list(b))) == sorted(a + b), (a, b)


@case("add-two-numbers")
def _(ns):
    f = S(ns).addTwoNumbers

    def to_list(n):
        return [int(d) for d in str(n)[::-1]]

    assert list_values(f(make_list([2, 4, 3]), make_list([5, 6, 4]))) == [7, 0, 8]
    assert list_values(f(make_list([0]), make_list([0]))) == [0]
    assert list_values(f(make_list([9] * 7), make_list([9] * 4))) == [8, 9, 9, 9, 0, 0, 0, 1]
    assert list_values(f(make_list([5]), make_list([5]))) == [0, 1]  # final carry
    r = rng(42)
    for _ in range(300):
        a, b = r.randint(0, 10**12), r.randint(0, 10**6)
        assert list_values(f(make_list(to_list(a)), make_list(to_list(b)))) == to_list(a + b), (a, b)


@case("linked-list-in-binary-tree")
def _(ns):
    f = S(ns).isSubPath
    tree = [1, 4, 4, None, 2, 2, None, 1, None, 6, 8, None, None, None, None, 1, 3]
    assert f(make_list([4, 2, 8]), make_tree(tree)) is True
    assert f(make_list([1, 4, 2, 6]), make_tree(tree)) is True
    assert f(make_list([1, 4, 2, 6, 8]), make_tree(tree)) is False
    assert f(make_list([1]), make_tree([1])) is True
    assert f(make_list([2]), make_tree([1])) is False
    # the path must restart from the next node after a partial match
    assert f(make_list([1, 1, 2]), make_tree([1, 1, None, 1, None, 2])) is True

    def downward_paths(root):
        out = []

        def walk(node, path):
            if not node:
                return
            path = path + [node.val]
            out.append(path)
            walk(node.left, path)
            walk(node.right, path)

        def every(node):
            if node:
                walk(node, [])
                every(node.left)
                every(node.right)

        every(root)
        return out

    r = rng(43)
    for _ in range(300):
        root = random_tree(r, r.randint(1, 10), 0, 2)
        values = [r.randint(0, 2) for _ in range(r.randint(1, 3))]
        brute = any(p[: len(values)] == values for p in downward_paths(root))
        assert f(make_list(values), root) is brute


@case("odd-even-linked-list")
def _(ns):
    f = S(ns).oddEvenList
    assert f(None) is None
    for values in [[1, 2, 3, 4, 5], [2, 1, 3, 5, 6, 4, 7], [1], [1, 2]] + [list(range(n)) for n in range(1, 15)]:
        assert list_values(f(make_list(values))) == values[0::2] + values[1::2], values


@case("swap-nodes-in-pairs")
def _(ns):
    f = S(ns).swapPairs
    assert f(None) is None
    for n in range(1, 15):
        values = list(range(n))
        expected = []
        for i in range(0, n, 2):
            expected += values[i : i + 2][::-1]
        head = make_list(values)
        nodes = {id(x) for x in list_nodes(head)}
        out = f(head)
        assert list_values(out) == expected, n
        assert {id(x) for x in list_nodes(out)} == nodes, "must swap nodes, not values"


@case("rotate-list")
def _(ns):
    f = S(ns).rotateRight
    assert list_values(f(make_list([1, 2, 3, 4, 5]), 2)) == [4, 5, 1, 2, 3]
    assert list_values(f(make_list([0, 1, 2]), 4)) == [2, 0, 1]
    assert f(None, 3) is None
    assert list_values(f(make_list([1]), 99)) == [1]
    for n in range(1, 9):
        values = list(range(n))
        for k in range(0, 3 * n + 2):
            s = k % n
            assert list_values(f(make_list(values), k)) == values[n - s :] + values[: n - s], (n, k)
    assert list_values(f(make_list([1, 2]), 2_000_000_000)) == [1, 2]


@case("reverse-linked-list-ii")
def _(ns):
    f = S(ns).reverseBetween
    assert list_values(f(make_list([1, 2, 3, 4, 5]), 2, 4)) == [1, 4, 3, 2, 5]
    assert list_values(f(make_list([5]), 1, 1)) == [5]
    for n in range(1, 9):
        values = list(range(1, n + 1))
        for left in range(1, n + 1):
            for right in range(left, n + 1):
                expected = values[: left - 1] + values[left - 1 : right][::-1] + values[right:]
                assert list_values(f(make_list(values), left, right)) == expected, (n, left, right)


@case("split-linked-list-in-parts")
def _(ns):
    f = S(ns).splitListToParts
    for n in range(0, 12):
        values = list(range(n))
        for k in range(1, 8):
            parts = [list_values(p) for p in f(make_list(values), k)]
            assert len(parts) == k, (n, k)
            assert sum(parts, []) == values, (n, k)
            sizes = [len(p) for p in parts]
            assert sizes == sorted(sizes, reverse=True) and max(sizes) - min(sizes) <= 1, (n, k, sizes)


@case("merge-k-sorted-lists")
def _(ns):
    f = S(ns).mergeKLists
    assert list_values(f([make_list([1, 4, 5]), make_list([1, 3, 4]), make_list([2, 6])])) == [1, 1, 2, 3, 4, 4, 5, 6]
    assert f([]) is None
    assert f([None]) is None
    assert f([None, None]) is None
    r = rng(44)
    for _ in range(200):
        lists = [sorted(r.randint(-10, 10) for _ in range(r.randint(0, 6))) for _ in range(r.randint(0, 6))]
        out = f([make_list(v) for v in lists])
        assert list_values(out) == sorted(sum(lists, [])), lists
    # equal values across lists must not break heap comparisons
    assert list_values(f([make_list([1, 1]), make_list([1, 1]), make_list([1])])) == [1] * 5

