"""Stack & Queue, Heap, Intervals, Greedy and Bit Manipulation."""

import heapq
from collections import Counter
from functools import reduce
from itertools import combinations, product

from harness import case, rng


def S(ns):
    return ns["Solution"]()


# ---------------- Stack & Queue ----------------

@case("valid-parentheses")
def _(ns):
    f = S(ns).isValid

    def brute(s):
        prev = None
        while prev != s:
            prev, s = s, s.replace("()", "").replace("[]", "").replace("{}", "")
        return s == ""

    for s, want in [("()", True), ("()[]{}", True), ("(]", False), ("([])", True), ("([)]", False),
                    ("{[]}", True), ("(", False), (")", False), ("((", False), ("))((", False), ("]", False)]:
        assert f(s) is want, s
    r = rng(50)
    for _ in range(2000):
        s = "".join(r.choice("()[]{}") for _ in range(r.choice([2, 4, 6, 8, 3])))
        assert f(s) is brute(s), s


@case("implement-queue-using-stacks")
def _(ns):
    q = ns["MyQueue"]()
    assert q.empty() is True
    q.push(1)
    q.push(2)
    assert q.peek() == 1
    assert q.pop() == 1
    assert q.empty() is False
    q.push(3)
    assert [q.pop(), q.pop()] == [2, 3]
    assert q.empty() is True
    # random interleaving against a reference deque
    from collections import deque
    r = rng(51)
    q, ref = ns["MyQueue"](), deque()
    for _ in range(3000):
        op = r.random()
        if op < 0.5 or not ref:
            v = r.randint(0, 99)
            q.push(v)
            ref.append(v)
        elif op < 0.75:
            assert q.pop() == ref.popleft()
        else:
            assert q.peek() == ref[0]
        assert q.empty() is (not ref)


@case("daily-temperatures")
def _(ns):
    f = S(ns).dailyTemperatures
    assert f([73, 74, 75, 71, 69, 72, 76, 73]) == [1, 1, 4, 2, 1, 1, 0, 0]
    assert f([30, 40, 50, 60]) == [1, 1, 1, 0]
    assert f([30, 60, 90]) == [1, 1, 0]
    assert f([50]) == [0]
    assert f([50, 50, 50]) == [0, 0, 0]  # equal is not warmer
    r = rng(52)
    for _ in range(300):
        t = [r.randint(30, 40) for _ in range(r.randint(1, 15))]
        brute = [next((j - i for j in range(i + 1, len(t)) if t[j] > t[i]), 0) for i in range(len(t))]
        assert f(t) == brute, t


@case("next-greater-element-ii")
def _(ns):
    f = S(ns).nextGreaterElements
    assert f([1, 2, 1]) == [2, -1, 2]
    assert f([1, 2, 3, 4, 3]) == [2, 3, 4, -1, 4]
    assert f([5]) == [-1]
    assert f([3, 3, 3]) == [-1, -1, -1]
    r = rng(53)
    for _ in range(300):
        nums = [r.randint(-5, 5) for _ in range(r.randint(1, 12))]
        n = len(nums)
        brute = [next((nums[(i + d) % n] for d in range(1, n) if nums[(i + d) % n] > nums[i]), -1) for i in range(n)]
        assert f(nums) == brute, nums


@case("asteroid-collision")
def _(ns):
    f = S(ns).asteroidCollision

    def brute(a):
        changed = True
        a = list(a)
        while changed:
            changed = False
            for i in range(len(a) - 1):
                if a[i] > 0 > a[i + 1]:
                    x, y = a[i], -a[i + 1]
                    a[i : i + 2] = [] if x == y else ([a[i]] if x > y else [a[i + 1]])
                    changed = True
                    break
        return a

    assert f([5, 10, -5]) == [5, 10]
    assert f([8, -8]) == []
    assert f([10, 2, -5]) == [10]
    assert f([-2, -1, 1, 2]) == [-2, -1, 1, 2]  # left-movers on the left never meet
    assert f([1, -2, -2, -2]) == [-2, -2, -2]
    r = rng(54)
    for _ in range(1000):
        a = [r.choice([v for v in range(-5, 6) if v]) for _ in range(r.randint(1, 10))]
        assert f(list(a)) == brute(a), a


@case("online-stock-span")
def _(ns):
    prices = [100, 80, 60, 70, 60, 75, 85]
    sp = ns["StockSpanner"]()
    assert [sp.next(p) for p in prices] == [1, 1, 1, 2, 1, 4, 6]
    r = rng(55)
    for _ in range(50):
        sp, seen = ns["StockSpanner"](), []
        for _ in range(r.randint(1, 40)):
            p = r.randint(1, 10)
            seen.append(p)
            span = 0
            for q in reversed(seen):
                if q > p:
                    break
                span += 1
            assert sp.next(p) == span, seen


@case("decode-string")
def _(ns):
    f = S(ns).decodeString
    assert f("3[a]2[bc]") == "aaabcbc"
    assert f("3[a2[c]]") == "accaccacc"
    assert f("2[abc]3[cd]ef") == "abcabccdcdcdef"
    assert f("abc") == "abc"
    assert f("10[a]") == "a" * 10  # multi-digit counts
    assert f("100[ab]") == "ab" * 100
    assert f("2[2[2[a]]]") == "a" * 8
    assert f("a2[b]c") == "abbc"


@case("remove-k-digits")
def _(ns):
    f = S(ns).removeKdigits

    def brute(num, k):
        keep = len(num) - k
        if keep == 0:
            return "0"
        best = min(int("".join(c)) for c in combinations(num, keep))
        return str(best)

    assert f("1432219", 3) == "1219"
    assert f("10200", 1) == "200"
    assert f("10", 2) == "0"
    assert f("9", 1) == "0"
    assert f("112", 1) == "11"
    assert f("100000", 1) == "0"
    assert f("12345", 0) == "12345"
    r = rng(56)
    for _ in range(500):
        num = str(r.randint(1, 9)) + "".join(r.choice("0123456789") for _ in range(r.randint(0, 6)))
        k = r.randint(0, len(num))
        assert f(num, k) == brute(num, k), (num, k)


@case("sum-of-subarray-minimums")
def _(ns):
    f = S(ns).sumSubarrayMins
    MOD = 10**9 + 7
    assert f([3, 1, 2, 4]) == 17
    assert f([11, 81, 94, 43, 3]) == 444
    assert f([1]) == 1
    assert f([2, 2, 2]) == 12  # duplicates counted once per subarray
    r = rng(57)
    for _ in range(300):
        arr = [r.randint(1, 6) for _ in range(r.randint(1, 10))]
        brute = sum(min(arr[i:j]) for i in range(len(arr)) for j in range(i + 1, len(arr) + 1)) % MOD
        assert f(arr) == brute, arr
    big = [30000] * 30000
    assert f(big) == (30000 * (30000 * 30001 // 2)) % MOD  # takes the modulo


@case("largest-rectangle-in-histogram")
def _(ns):
    f = S(ns).largestRectangleArea
    assert f([2, 1, 5, 6, 2, 3]) == 10
    assert f([2, 4]) == 4
    assert f([0]) == 0
    assert f([5]) == 5
    assert f([2, 2, 2]) == 6
    assert f([1, 2, 3, 4, 5]) == 9
    r = rng(58)
    for _ in range(300):
        h = [r.randint(0, 8) for _ in range(r.randint(1, 12))]
        brute = max(min(h[i:j]) * (j - i) for i in range(len(h)) for j in range(i + 1, len(h) + 1))
        assert f(h) == brute, h


# ---------------- Heap ----------------

@case("kth-largest-element-in-a-stream")
def _(ns):
    K = ns["KthLargest"]
    k = K(3, [4, 5, 8, 2])
    assert [k.add(v) for v in (3, 5, 10, 9, 4)] == [4, 5, 5, 8, 8]
    k = K(1, [])
    assert [k.add(v) for v in (-3, -2, -4, 0, 4)] == [-3, -2, -2, 0, 4]
    k = K(2, [0])  # starts with fewer than k values
    assert [k.add(v) for v in (-1, 1, -2, -4, 3)] == [-1, 0, 0, 0, 1]
    r = rng(60)
    for _ in range(50):
        kk = r.randint(1, 5)
        start = [r.randint(-10, 10) for _ in range(r.randint(kk - 1, 8))]
        obj, seen = K(kk, list(start)), list(start)
        for _ in range(20):
            v = r.randint(-10, 10)
            seen.append(v)
            assert obj.add(v) == sorted(seen, reverse=True)[kk - 1]


@case("last-stone-weight")
def _(ns):
    f = S(ns).lastStoneWeight

    def brute(stones):
        stones = sorted(stones)
        while len(stones) > 1:
            y, x = stones.pop(), stones.pop()
            if x != y:
                stones.append(y - x)
                stones.sort()
        return stones[0] if stones else 0

    assert f([2, 7, 4, 1, 8, 1]) == 1
    assert f([1]) == 1
    assert f([3, 3]) == 0
    r = rng(61)
    for _ in range(300):
        s = [r.randint(1, 20) for _ in range(r.randint(1, 10))]
        assert f(list(s)) == brute(s), s


@case("kth-largest-element-in-an-array")
def _(ns):
    f = S(ns).findKthLargest
    assert f([3, 2, 1, 5, 6, 4], 2) == 5
    assert f([3, 2, 3, 1, 2, 4, 5, 5, 6], 4) == 4
    assert f([1], 1) == 1
    assert f([-1, -1], 2) == -1
    r = rng(62)
    for _ in range(300):
        nums = [r.randint(-10, 10) for _ in range(r.randint(1, 12))]
        k = r.randint(1, len(nums))
        assert f(list(nums), k) == sorted(nums, reverse=True)[k - 1], (nums, k)


@case("top-k-frequent-elements")
def _(ns):
    f = S(ns).topKFrequent
    assert sorted(f([1, 1, 1, 2, 2, 3], 2)) == [1, 2]
    assert f([1], 1) == [1]
    assert sorted(f([4, 1, -1, 2, -1, 2, 3], 2)) == [-1, 2]
    r = rng(63)
    for _ in range(300):
        # build counts with a unique answer: distinct frequencies
        values = r.sample(range(-20, 20), r.randint(1, 6))
        freqs = r.sample(range(1, 10), len(values))
        nums = [v for v, c in zip(values, freqs) for _ in range(c)]
        r.shuffle(nums)
        k = r.randint(1, len(values))
        expected = [v for v, _ in Counter(nums).most_common(k)]
        assert sorted(f(nums, k)) == sorted(expected), (nums, k)


@case("k-closest-points-to-origin")
def _(ns):
    f = S(ns).kClosest
    assert f([[1, 3], [-2, 2]], 1) == [[-2, 2]]
    assert sorted(f([[3, 3], [5, -1], [-2, 4]], 2)) == [[-2, 4], [3, 3]]
    assert sorted(f([[0, 1], [1, 0]], 2)) == [[0, 1], [1, 0]]
    r = rng(64)
    for _ in range(300):
        pts = [[r.randint(-10, 10), r.randint(-10, 10)] for _ in range(r.randint(1, 10))]
        k = r.randint(1, len(pts))
        out = f([p[:] for p in pts], k)
        dist = lambda p: p[0] ** 2 + p[1] ** 2
        assert len(out) == k
        assert sorted(map(dist, out)) == sorted(map(dist, pts))[:k], (pts, k)
        assert Counter(map(tuple, out)) <= Counter(map(tuple, pts))


@case("task-scheduler")
def _(ns):
    f = S(ns).leastInterval
    assert f(["A", "A", "A", "B", "B", "B"], 2) == 8
    assert f(["A", "C", "A", "B", "D", "B"], 1) == 6
    assert f(["A", "A", "A", "B", "B", "B"], 3) == 10
    assert f(["A"], 100) == 1
    assert f(["A", "A"], 0) == 2
    r = rng(65)
    for _ in range(300):
        tasks = [r.choice("ABCD") for _ in range(r.randint(1, 12))]
        n = r.randint(0, 4)
        counts = sorted(Counter(tasks).values())
        top = counts[-1]
        formula = max(len(tasks), (top - 1) * (n + 1) + counts.count(top))
        assert f(tasks, n) == formula, (tasks, n)


@case("kth-smallest-element-in-a-sorted-matrix")
def _(ns):
    f = S(ns).kthSmallest
    m = [[1, 5, 9], [10, 11, 13], [12, 13, 15]]
    assert f(m, 8) == 13
    assert f([[-5]], 1) == -5
    assert f([[1, 2], [1, 3]], 2) == 1
    r = rng(66)
    for _ in range(200):
        n = r.randint(1, 5)
        m = [[0] * n for _ in range(n)]
        for i in range(n):
            for j in range(n):
                m[i][j] = max(m[i - 1][j] if i else -5, m[i][j - 1] if j else -5) + r.randint(0, 3)
        flat = sorted(sum(m, []))
        for k in range(1, n * n + 1):
            assert f(m, k) == flat[k - 1], (m, k)


@case("reorganize-string")
def _(ns):
    f = S(ns).reorganizeString
    for s in ["aab", "aaabbc", "vvvlo", "a", "ab", "aabb", "abc"]:
        out = f(s)
        assert sorted(out) == sorted(s) and all(x != y for x, y in zip(out, out[1:])), (s, out)
    for s in ["aaab", "aa", "aaa", "aaabb" + "a"]:
        assert f(s) == "", s
    r = rng(67)
    for _ in range(500):
        s = "".join(r.choice("abc") for _ in range(r.randint(1, 10)))
        possible = max(Counter(s).values()) <= (len(s) + 1) // 2
        out = f(s)
        if possible:
            assert sorted(out) == sorted(s) and all(x != y for x, y in zip(out, out[1:])), (s, out)
        else:
            assert out == "", s


@case("single-threaded-cpu")
def _(ns):
    f = S(ns).getOrder

    def brute(tasks):
        pending = sorted((e, p, i) for i, (e, p) in enumerate(tasks))
        time, order, ready, j = 0, [], [], 0
        while len(order) < len(tasks):
            if not ready and j < len(pending) and time < pending[j][0]:
                time = pending[j][0]
            while j < len(pending) and pending[j][0] <= time:
                heapq.heappush(ready, (pending[j][1], pending[j][2]))
                j += 1
            p, i = heapq.heappop(ready)
            time += p
            order.append(i)
        return order

    assert f([[1, 2], [2, 4], [3, 2], [4, 1]]) == [0, 2, 3, 1]
    assert f([[7, 10], [7, 12], [7, 5], [7, 4], [7, 2]]) == [4, 3, 2, 0, 1]
    assert f([[5, 2]]) == [0]
    assert f([[1, 1], [100, 1]]) == [0, 1]  # idle gap
    r = rng(68)
    for _ in range(500):
        tasks = [[r.randint(1, 10), r.randint(1, 5)] for _ in range(r.randint(1, 8))]
        assert f([t[:] for t in tasks]) == brute(tasks), tasks


@case("find-median-from-data-stream")
def _(ns):
    M = ns["MedianFinder"]
    m = M()
    m.addNum(1)
    m.addNum(2)
    assert m.findMedian() == 1.5
    m.addNum(3)
    assert m.findMedian() == 2.0
    r = rng(69)
    for _ in range(50):
        m, seen = M(), []
        for _ in range(40):
            v = r.randint(-20, 20)
            m.addNum(v)
            seen.append(v)
            s = sorted(seen)
            n = len(s)
            want = s[n // 2] if n % 2 else (s[n // 2 - 1] + s[n // 2]) / 2
            assert abs(m.findMedian() - want) < 1e-9, seen


# ---------------- Intervals ----------------

@case("summary-ranges")
def _(ns):
    f = S(ns).summaryRanges
    assert f([0, 1, 2, 4, 5, 7]) == ["0->2", "4->5", "7"]
    assert f([0, 2, 3, 4, 6, 8, 9]) == ["0", "2->4", "6", "8->9"]
    assert f([]) == []
    assert f([-1]) == ["-1"]
    assert f([-2147483648, 2147483647]) == ["-2147483648", "2147483647"]
    assert f([-3, -2, -1]) == ["-3->-1"]


@case("teemo-attacking")
def _(ns):
    f = S(ns).findPoisonedDuration
    assert f([1, 4], 2) == 4
    assert f([1, 2], 2) == 3
    assert f([1], 5) == 5
    assert f([1, 2, 3], 0) == 0
    r = rng(70)
    for _ in range(300):
        ts = sorted(set(r.randint(0, 20) for _ in range(r.randint(1, 8))))
        d = r.randint(0, 5)
        poisoned = set()
        for t in ts:
            poisoned.update(range(t, t + d))
        assert f(ts, d) == len(poisoned), (ts, d)


def merge_brute(intervals):
    out = []
    for s, e in sorted(intervals):
        if out and s <= out[-1][1]:
            out[-1][1] = max(out[-1][1], e)
        else:
            out.append([s, e])
    return out


@case("merge-intervals")
def _(ns):
    f = S(ns).merge
    assert f([[1, 3], [2, 6], [8, 10], [15, 18]]) == [[1, 6], [8, 10], [15, 18]]
    assert f([[1, 4], [4, 5]]) == [[1, 5]]  # touching intervals merge
    assert f([[1, 4], [2, 3]]) == [[1, 4]]  # contained
    assert f([[4, 7], [1, 4]]) == [[1, 7]]  # unsorted input
    assert f([[1, 1]]) == [[1, 1]]
    r = rng(71)
    for _ in range(300):
        iv = [sorted([r.randint(0, 20), r.randint(0, 20)]) for _ in range(r.randint(1, 8))]
        assert sorted(f([x[:] for x in iv])) == merge_brute(iv), iv


@case("insert-interval")
def _(ns):
    f = S(ns).insert
    assert f([[1, 3], [6, 9]], [2, 5]) == [[1, 5], [6, 9]]
    assert f([[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], [4, 8]) == [[1, 2], [3, 10], [12, 16]]
    assert f([], [5, 7]) == [[5, 7]]
    assert f([[1, 5]], [6, 8]) == [[1, 5], [6, 8]]
    assert f([[3, 5]], [1, 2]) == [[1, 2], [3, 5]]
    assert f([[1, 5]], [5, 7]) == [[1, 7]]
    r = rng(72)
    for _ in range(300):
        base = merge_brute([sorted([r.randint(0, 30), r.randint(0, 30)]) for _ in range(r.randint(0, 6))])
        # merge_brute keeps touching intervals apart only if they don't touch, so base is valid input
        new = sorted([r.randint(0, 30), r.randint(0, 30)])
        assert f([x[:] for x in base], new[:]) == merge_brute(base + [new]), (base, new)


@case("non-overlapping-intervals")
def _(ns):
    f = S(ns).eraseOverlapIntervals
    assert f([[1, 2], [2, 3], [3, 4], [1, 3]]) == 1
    assert f([[1, 2], [1, 2], [1, 2]]) == 2
    assert f([[1, 2], [2, 3]]) == 0
    r = rng(73)
    for _ in range(200):
        iv = [sorted([r.randint(0, 12), r.randint(0, 12)]) for _ in range(r.randint(1, 7))]
        iv = [[a, b] for a, b in iv if a < b] or [[0, 1]]
        best = 0
        for size in range(len(iv), 0, -1):
            if any(all(a[1] <= b[0] for a, b in zip(c, c[1:])) for c in map(lambda c: sorted(c), combinations(iv, size))):
                best = size
                break
        assert f([x[:] for x in iv]) == len(iv) - best, iv


@case("remove-covered-intervals")
def _(ns):
    f = S(ns).removeCoveredIntervals
    assert f([[1, 4], [3, 6], [2, 8]]) == 2
    assert f([[1, 4], [2, 3]]) == 1
    assert f([[1, 2], [1, 4], [3, 4]]) == 1  # same start: the longer covers the shorter
    assert f([[3, 10], [4, 10], [5, 11]]) == 2
    r = rng(74)
    for _ in range(300):
        iv = list({(a, b) for a, b in (sorted(r.sample(range(15), 2)) for _ in range(r.randint(1, 7)))})
        brute = sum(1 for i, (a, b) in enumerate(iv)
                    if not any(j != i and c <= a and b <= d for j, (c, d) in enumerate(iv)))
        assert f([list(x) for x in iv]) == brute, iv


@case("find-right-interval")
def _(ns):
    f = S(ns).findRightInterval
    assert f([[1, 2]]) == [-1]
    assert f([[3, 4], [2, 3], [1, 2]]) == [-1, 0, 1]
    assert f([[1, 4], [2, 3], [3, 4]]) == [-1, 2, -1]
    assert f([[1, 1], [3, 4]]) == [0, -1]  # an interval can be its own right interval
    r = rng(75)
    for _ in range(300):
        starts = r.sample(range(30), r.randint(1, 8))
        iv = [[s, s + r.randint(0, 10)] for s in starts]
        brute = []
        for _, e in iv:
            cands = [(s, j) for j, (s, _) in enumerate(iv) if s >= e]
            brute.append(min(cands)[1] if cands else -1)
        assert f(iv) == brute, iv


@case("interval-list-intersections")
def _(ns):
    f = S(ns).intervalIntersection
    a = [[0, 2], [5, 10], [13, 23], [24, 25]]
    b = [[1, 5], [8, 12], [15, 24], [25, 26]]
    assert f(a, b) == [[1, 2], [5, 5], [8, 10], [15, 23], [24, 24], [25, 25]]
    assert f([[1, 3], [5, 9]], []) == []
    assert f([], [[1, 2]]) == []
    r = rng(76)

    def disjoint(n):
        points = sorted(r.sample(range(40), 2 * n))
        return [[points[2 * i], points[2 * i + 1]] for i in range(n)]

    for _ in range(300):
        a, b = disjoint(r.randint(0, 5)), disjoint(r.randint(0, 5))
        brute = sorted([max(x[0], y[0]), min(x[1], y[1])] for x in a for y in b if max(x[0], y[0]) <= min(x[1], y[1]))
        assert f(a, b) == brute, (a, b)


@case("car-pooling")
def _(ns):
    f = S(ns).carPooling
    assert f([[2, 1, 5], [3, 3, 7]], 4) is False
    assert f([[2, 1, 5], [3, 3, 7]], 5) is True
    assert f([[2, 1, 5], [3, 5, 7]], 3) is True  # drop-off happens before pick-up
    assert f([[3, 2, 7], [3, 7, 9], [8, 3, 9]], 11) is True
    r = rng(77)
    for _ in range(300):
        trips = []
        for _ in range(r.randint(1, 6)):
            a, b = sorted(r.sample(range(15), 2))
            trips.append([r.randint(1, 5), a, b])
        cap = r.randint(1, 15)
        load = max(sum(p for p, a, b in trips if a <= x < b) for x in range(15))
        assert f([t[:] for t in trips], cap) is (load <= cap), (trips, cap)


@case("minimum-interval-to-include-each-query")
def _(ns):
    f = S(ns).minInterval
    assert f([[1, 4], [2, 4], [3, 6], [4, 4]], [2, 3, 4, 5]) == [3, 3, 1, 4]
    assert f([[2, 3], [2, 5], [1, 8], [20, 25]], [2, 19, 5, 22]) == [2, -1, 4, 6]
    assert f([[1, 1]], [0, 1, 2]) == [-1, 1, -1]
    r = rng(78)
    for _ in range(300):
        iv = [sorted([r.randint(0, 15), r.randint(0, 15)]) for _ in range(r.randint(1, 6))]
        qs = [r.randint(-1, 16) for _ in range(r.randint(1, 6))]
        brute = [min([b - a + 1 for a, b in iv if a <= q <= b] or [-1]) for q in qs]
        assert f([x[:] for x in iv], list(qs)) == brute, (iv, qs)


# ---------------- Greedy ----------------

@case("assign-cookies")
def _(ns):
    f = S(ns).findContentChildren
    assert f([1, 2, 3], [1, 1]) == 1
    assert f([1, 2], [1, 2, 3]) == 2
    assert f([1], []) == 0
    assert f([], [1]) == 0
    r = rng(80)
    for _ in range(200):
        g = [r.randint(1, 6) for _ in range(r.randint(0, 5))]
        s = [r.randint(1, 6) for _ in range(r.randint(0, 5))]
        # every way to hand each cookie to a distinct child (or to nobody)
        best = 0
        for owners in product(range(-1, len(g)), repeat=len(s)):
            given = [o for o in owners if o >= 0]
            if len(given) == len(set(given)):
                best = max(best, sum(1 for cookie, o in zip(s, owners) if o >= 0 and cookie >= g[o]))
        assert f(list(g), list(s)) == best, (g, s)


@case("lemonade-change")
def _(ns):
    f = S(ns).lemonadeChange
    assert f([5, 5, 5, 10, 20]) is True
    assert f([5, 5, 10, 10, 20]) is False
    assert f([10]) is False
    assert f([5, 5, 5, 20]) is True  # three fives make change for a twenty
    assert f([5, 10, 5, 20]) is True  # prefer giving a ten + five
    assert f([5, 5, 5, 10, 5, 5, 10, 20, 20, 20]) is False


@case("jump-game")
def _(ns):
    f = S(ns).canJump

    def brute(nums):
        reach = {0}
        for i in range(len(nums)):
            if i in reach:
                reach.update(range(i, i + nums[i] + 1))
        return len(nums) - 1 in reach

    assert f([2, 3, 1, 1, 4]) is True
    assert f([3, 2, 1, 0, 4]) is False
    assert f([0]) is True
    assert f([0, 1]) is False
    r = rng(81)
    for _ in range(500):
        nums = [r.randint(0, 3) for _ in range(r.randint(1, 10))]
        assert f(nums) is brute(nums), nums


@case("jump-game-ii")
def _(ns):
    f = S(ns).jump

    def brute(nums):
        n = len(nums)
        dist = [0] + [float("inf")] * (n - 1)
        for i in range(n):
            for j in range(i + 1, min(n, i + nums[i] + 1)):
                dist[j] = min(dist[j], dist[i] + 1)
        return dist[-1]

    assert f([2, 3, 1, 1, 4]) == 2
    assert f([2, 3, 0, 1, 4]) == 2
    assert f([0]) == 0
    assert f([1, 1, 1, 1]) == 3
    r = rng(82)
    for _ in range(500):
        nums = [r.randint(1, 4) for _ in range(r.randint(1, 10))]
        assert f(nums) == brute(nums), nums


@case("gas-station")
def _(ns):
    f = S(ns).canCompleteCircuit

    def brute(gas, cost):
        n = len(gas)
        for s in range(n):
            tank = 0
            for k in range(n):
                i = (s + k) % n
                tank += gas[i] - cost[i]
                if tank < 0:
                    break
            else:
                return s
        return -1

    assert f([1, 2, 3, 4, 5], [3, 4, 5, 1, 2]) == 3
    assert f([2, 3, 4], [3, 4, 3]) == -1
    assert f([5], [4]) == 0
    assert f([4], [5]) == -1
    r = rng(83)
    for _ in range(500):
        n = r.randint(1, 7)
        gas = [r.randint(0, 5) for _ in range(n)]
        cost = [r.randint(0, 5) for _ in range(n)]
        want = brute(gas, cost)
        # the problem guarantees a unique answer when one exists
        if want != -1 and sum(1 for s in range(n) if brute(gas[s:] + gas[:s], cost[s:] + cost[:s]) == 0) > 1:
            continue
        assert f(gas, cost) == want, (gas, cost)


@case("partition-labels")
def _(ns):
    f = S(ns).partitionLabels
    assert f("ababcbacadefegdehijhklij") == [9, 7, 8]
    assert f("eccbbbbdec") == [10]
    assert f("a") == [1]
    assert f("abc") == [1, 1, 1]
    r = rng(84)
    for _ in range(300):
        s = "".join(r.choice("abcde") for _ in range(r.randint(1, 12)))
        out = f(s)
        assert sum(out) == len(s)
        parts, i = [], 0
        for size in out:
            parts.append(s[i : i + size])
            i += size
        letters = [set(p) for p in parts]
        assert all(not (a & b) for a, b in combinations(letters, 2)), (s, out)
        # maximal: no part can be split further
        for p in parts:
            for cut in range(1, len(p)):
                assert set(p[:cut]) & set(p[cut:]), (s, out)


@case("maximum-subarray")
def _(ns):
    f = S(ns).maxSubArray
    assert f([-2, 1, -3, 4, -1, 2, 1, -5, 4]) == 6
    assert f([1]) == 1
    assert f([5, 4, -1, 7, 8]) == 23
    assert f([-3, -1, -2]) == -1  # all negative
    r = rng(85)
    for _ in range(500):
        nums = [r.randint(-10, 10) for _ in range(r.randint(1, 12))]
        assert f(nums) == max(sum(nums[i:j]) for i in range(len(nums)) for j in range(i + 1, len(nums) + 1)), nums


@case("hand-of-straights")
def _(ns):
    f = S(ns).isNStraightHand

    def brute(hand, k):
        c = Counter(hand)
        while c:
            start = min(c)
            for v in range(start, start + k):
                if c[v] == 0:
                    return False
                c[v] -= 1
                if c[v] == 0:
                    del c[v]
        return True

    assert f([1, 2, 3, 6, 2, 3, 4, 7, 8], 3) is True
    assert f([1, 2, 3, 4, 5], 4) is False
    assert f([1], 1) is True
    assert f([1, 1, 2, 2, 3, 3], 3) is True
    assert f([1, 2, 4], 3) is False
    r = rng(86)
    for _ in range(500):
        hand = [r.randint(0, 6) for _ in range(r.randint(1, 9))]
        k = r.randint(1, 4)
        assert f(list(hand), k) is brute(hand, k), (hand, k)


@case("minimum-number-of-arrows-to-burst-balloons")
def _(ns):
    f = S(ns).findMinArrowShots
    assert f([[10, 16], [2, 8], [1, 6], [7, 12]]) == 2
    assert f([[1, 2], [3, 4], [5, 6], [7, 8]]) == 4
    assert f([[1, 2], [2, 3], [3, 4], [4, 5]]) == 2  # touching balloons share an arrow
    assert f([[-2147483646, -2147483645], [2147483646, 2147483647]]) == 2
    r = rng(87)
    for _ in range(300):
        pts = [sorted([r.randint(0, 12), r.randint(0, 12)]) for _ in range(r.randint(1, 6))]
        # minimum points stabbing all intervals = greedy by end (independent oracle via brute force)
        xs = sorted({p for iv in pts for p in iv})
        best = next(k for k in range(1, len(pts) + 1)
                    if any(all(any(a <= x <= b for x in c) for a, b in pts) for c in combinations(xs, k)))
        assert f([p[:] for p in pts]) == best, pts


@case("candy")
def _(ns):
    f = S(ns).candy
    assert f([1, 0, 2]) == 5
    assert f([1, 2, 2]) == 4
    assert f([1]) == 1
    assert f([1, 3, 4, 5, 2]) == 11
    assert f([5, 4, 3, 2, 1]) == 15
    r = rng(88)
    for _ in range(300):
        ratings = [r.randint(0, 4) for _ in range(r.randint(1, 10))]
        n = len(ratings)
        c = [1] * n
        changed = True
        while changed:  # relax until stable: the least fixed point is the optimum
            changed = False
            for i in range(n):
                for j in (i - 1, i + 1):
                    if 0 <= j < n and ratings[i] > ratings[j] and c[i] <= c[j]:
                        c[i] = c[j] + 1
                        changed = True
        assert f(ratings) == sum(c), ratings


# ---------------- Bit Manipulation ----------------

@case("single-number")
def _(ns):
    f = S(ns).singleNumber
    assert f([2, 2, 1]) == 1
    assert f([4, 1, 2, 1, 2]) == 4
    assert f([1]) == 1
    assert f([-3, 7, 7]) == -3
    r = rng(90)
    for _ in range(300):
        pairs = r.sample(range(-100, 100), r.randint(0, 6))
        single = r.choice([v for v in range(-100, 100) if v not in pairs])
        nums = pairs * 2 + [single]
        r.shuffle(nums)
        assert f(nums) == single


@case("power-of-two")
def _(ns):
    f = S(ns).isPowerOfTwo
    for n in range(-20, 5000):
        assert f(n) is (n > 0 and bin(n).count("1") == 1), n
    assert f(2**30) is True
    assert f(-(2**31)) is False
    assert f(0) is False


@case("counting-bits")
def _(ns):
    f = S(ns).countBits
    assert f(0) == [0]
    assert f(2) == [0, 1, 1]
    assert f(5) == [0, 1, 1, 2, 1, 2]
    assert f(1000) == [bin(i).count("1") for i in range(1001)]


@case("reverse-bits")
def _(ns):
    f = S(ns).reverseBits
    assert f(0b00000010100101000001111010011100) == 964176192
    assert f(0b11111111111111111111111111111101) == 3221225471
    assert f(0) == 0
    assert f(1) == 2**31
    assert f(2**32 - 1) == 2**32 - 1
    r = rng(91)
    for _ in range(1000):
        n = r.getrandbits(32)
        assert f(n) == int(format(n, "032b")[::-1], 2), n


@case("single-number-ii")
def _(ns):
    f = S(ns).singleNumber
    assert f([2, 2, 3, 2]) == 3
    assert f([0, 1, 0, 1, 0, 1, 99]) == 99
    assert f([-2, -2, 1, 1, 4, 1, 4, 4, -4, -2]) == -4  # negatives
    assert f([-2147483648, 5, 5, 5]) == -2147483648
    r = rng(92)
    for _ in range(300):
        triples = r.sample(range(-2**31, 2**31 - 1), r.randint(0, 5))
        single = r.randint(-2**31, 2**31 - 1)
        if single in triples:
            continue
        nums = triples * 3 + [single]
        r.shuffle(nums)
        assert f(nums) == single


@case("bitwise-and-of-numbers-range")
def _(ns):
    f = S(ns).rangeBitwiseAnd
    assert f(5, 7) == 4
    assert f(0, 0) == 0
    assert f(1, 2147483647) == 0
    assert f(2147483647, 2147483647) == 2147483647
    for left in range(0, 70):
        for right in range(left, 70):
            assert f(left, right) == reduce(lambda a, b: a & b, range(left, right + 1)), (left, right)


@case("sum-of-two-integers")
def _(ns):
    f = S(ns).getSum
    assert f(1, 2) == 3
    assert f(2, 3) == 5
    assert f(-1, 1) == 0
    assert f(-12, -8) == -20
    assert f(0, 0) == 0
    assert f(-1000, 1000) == 0
    r = rng(93)
    for _ in range(2000):
        a, b = r.randint(-1000, 1000), r.randint(-1000, 1000)
        assert f(a, b) == a + b, (a, b)


@case("utf-8-validation")
def _(ns):
    f = S(ns).validUtf8
    assert f([197, 130, 1]) is True
    assert f([235, 140, 4]) is False
    assert f([0]) is True
    assert f([255]) is False
    assert f([145]) is False  # lone continuation byte
    assert f([240, 162, 138, 147]) is True  # 4-byte character
    assert f([240, 162, 138]) is False  # truncated
    assert f([248, 130, 130, 130]) is False  # 5-byte lead is invalid
    r = rng(94)
    for _ in range(1000):
        text = "".join(r.choice("aé€😀") for _ in range(r.randint(0, 5)))
        data = list(text.encode("utf-8"))
        assert f(data) is True, data
        if data:
            cut = data[: r.randrange(len(data))]
            try:
                bytes(cut).decode("utf-8")
                ok = True
            except UnicodeDecodeError:
                ok = False
            assert f(cut) is ok, cut


@case("xor-queries-of-a-subarray")
def _(ns):
    f = S(ns).xorQueries
    assert f([1, 3, 4, 8], [[0, 1], [1, 2], [0, 3], [3, 3]]) == [2, 7, 14, 8]
    assert f([4, 8, 2, 10], [[2, 3], [1, 3], [0, 0], [0, 3]]) == [8, 0, 4, 4]
    r = rng(95)
    for _ in range(300):
        arr = [r.randint(0, 50) for _ in range(r.randint(1, 10))]
        qs = [sorted([r.randrange(len(arr)), r.randrange(len(arr))]) for _ in range(r.randint(1, 6))]
        assert f(arr, qs) == [reduce(lambda a, b: a ^ b, arr[a : b + 1]) for a, b in qs], (arr, qs)


@case("minimum-one-bit-operations-to-make-integers-zero")
def _(ns):
    f = S(ns).minimumOneBitOperations
    assert f(3) == 2
    assert f(6) == 4
    assert f(0) == 0
    # BFS over the two allowed operations for every n < 512
    from collections import deque
    limit = 512
    dist = {0: 0}
    q = deque([0])
    while q:
        x = q.popleft()
        moves = [x ^ 1]
        low = (x & -x)
        if low and low << 1 < limit * 2:
            moves.append(x ^ (low << 1))
        for y in moves:
            if 0 <= y < limit * 2 and y not in dist:
                dist[y] = dist[x] + 1
                q.append(y)
    for n in range(limit):
        assert f(n) == dist[n], n

    def inverse_gray(n):  # closed form of the same sequence, for large inputs
        out = 0
        while n:
            out ^= n
            n >>= 1
        return out

    r = rng(96)
    for _ in range(500):
        n = r.randint(0, 10**9)
        assert f(n) == inverse_gray(n), n
