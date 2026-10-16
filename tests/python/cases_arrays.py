"""Two Pointers, Sliding Window and Binary Search."""

from collections import Counter
from itertools import combinations

from harness import case, canon, rng


def S(ns):
    return ns["Solution"]()


# ---------------- Two Pointers ----------------

@case("valid-palindrome")
def _(ns):
    f = S(ns).isPalindrome
    assert f("A man, a plan, a canal: Panama") is True
    assert f("race a car") is False
    assert f(" ") is True
    assert f("") is True
    assert f("0P") is False  # digits count
    assert f("a.") is True
    assert f(".,!") is True
    assert f("ab_a") is True
    assert f("No 'x' in Nixon") is True


@case("two-sum-ii-input-array-is-sorted")
def _(ns):
    f = S(ns).twoSum
    assert f([2, 7, 11, 15], 9) == [1, 2]
    assert f([2, 3, 4], 6) == [1, 3]
    assert f([-1, 0], -1) == [1, 2]
    assert f([0, 0, 3, 4], 0) == [1, 2]
    assert f([1, 2, 3, 4, 4, 9, 56, 90], 8) == [4, 5]
    r = rng(1)
    for _ in range(300):
        nums = sorted(r.randint(-50, 50) for _ in range(r.randint(2, 15)))
        i, j = sorted(r.sample(range(len(nums)), 2))
        target = nums[i] + nums[j]
        a, b = f(nums, target)
        assert 1 <= a < b <= len(nums) and nums[a - 1] + nums[b - 1] == target


@case("container-with-most-water")
def _(ns):
    f = S(ns).maxArea
    assert f([1, 8, 6, 2, 5, 4, 8, 3, 7]) == 49
    assert f([1, 1]) == 1
    assert f([0, 0]) == 0
    assert f([4, 3, 2, 1, 4]) == 16
    r = rng(2)
    for _ in range(300):
        h = [r.randint(0, 20) for _ in range(r.randint(2, 12))]
        best = max(min(h[i], h[j]) * (j - i) for i, j in combinations(range(len(h)), 2))
        assert f(h) == best, h


def three_sum_brute(nums):
    return canon({tuple(sorted(t)) for t in combinations(nums, 3) if sum(t) == 0})


@case("3sum")
def _(ns):
    f = S(ns).threeSum
    assert canon(f([-1, 0, 1, 2, -1, -4])) == [(-1, -1, 2), (-1, 0, 1)]
    assert f([0, 1, 1]) == []
    assert canon(f([0, 0, 0])) == [(0, 0, 0)]
    assert canon(f([0, 0, 0, 0, 0])) == [(0, 0, 0)]
    r = rng(3)
    for _ in range(300):
        nums = [r.randint(-6, 6) for _ in range(r.randint(3, 12))]
        out = f(list(nums))
        assert len(out) == len({tuple(sorted(t)) for t in out}), "duplicate triplets"
        assert canon(out) == three_sum_brute(nums), nums


@case("remove-duplicates-from-sorted-array")
def _(ns):
    f = S(ns).removeDuplicates
    r = rng(4)
    tests = [[1, 1, 2], [0, 0, 1, 1, 1, 2, 2, 3, 3, 4], [1], [-3, -3, -3], [1, 2, 3]]
    tests += [sorted(r.randint(-5, 5) for _ in range(r.randint(1, 15))) for _ in range(200)]
    for nums in tests:
        arr = list(nums)
        k = f(arr)
        expected = sorted(set(nums))
        assert k == len(expected) and arr[:k] == expected, nums


@case("sort-colors")
def _(ns):
    f = S(ns).sortColors
    r = rng(5)
    tests = [[2, 0, 2, 1, 1, 0], [2, 0, 1], [0], [1], [2, 2, 2], [2, 1, 0], []]
    tests += [[r.randint(0, 2) for _ in range(r.randint(1, 20))] for _ in range(200)]
    for nums in tests:
        arr = list(nums)
        assert f(arr) is None
        assert arr == sorted(nums), nums


@case("4sum")
def _(ns):
    f = S(ns).fourSum
    assert canon(f([1, 0, -1, 0, -2, 2], 0)) == [(-2, -1, 1, 2), (-2, 0, 0, 2), (-1, 0, 0, 1)]
    assert canon(f([2, 2, 2, 2, 2], 8)) == [(2, 2, 2, 2)]
    assert f([1, 2, 3], 6) == []
    # values near the 32-bit limits must not overflow (Python ints, but the logic must still be right)
    assert canon(f([1000000000] * 4, -294967296)) == []
    r = rng(6)
    for _ in range(200):
        nums = [r.randint(-5, 5) for _ in range(r.randint(4, 10))]
        target = r.randint(-6, 6)
        out = f(list(nums), target)
        expected = canon({tuple(sorted(t)) for t in combinations(nums, 4) if sum(t) == target})
        assert canon(out) == expected and len(out) == len(expected), (nums, target)


@case("valid-triangle-number")
def _(ns):
    f = S(ns).triangleNumber
    assert f([2, 2, 3, 4]) == 3
    assert f([4, 2, 3, 4]) == 4
    assert f([0, 0, 0]) == 0
    assert f([1]) == 0
    assert f([]) == 0
    r = rng(7)
    for _ in range(200):
        nums = [r.randint(0, 10) for _ in range(r.randint(0, 9))]
        brute = sum(1 for a, b, c in combinations(nums, 3) if a + b > c and a + c > b and b + c > a)
        assert f(list(nums)) == brute, nums


def boats_brute(people, limit):
    if not people:
        return 0
    first, rest = people[0], people[1:]
    best = 1 + boats_brute(rest, limit)
    for j, other in enumerate(rest):
        if first + other <= limit:
            best = min(best, 1 + boats_brute(rest[:j] + rest[j + 1 :], limit))
    return best


@case("boats-to-save-people")
def _(ns):
    f = S(ns).numRescueBoats
    assert f([1, 2], 3) == 1
    assert f([3, 2, 2, 1], 3) == 3
    assert f([3, 5, 3, 4], 5) == 4
    assert f([5], 5) == 1
    assert f([2, 2], 4) == 1
    r = rng(24)
    for _ in range(300):
        limit = r.randint(1, 12)
        people = [r.randint(1, limit) for _ in range(r.randint(1, 8))]
        assert f(list(people), limit) == boats_brute(people, limit), (people, limit)


@case("trapping-rain-water")
def _(ns):
    f = S(ns).trap
    assert f([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]) == 6
    assert f([4, 2, 0, 3, 2, 5]) == 9
    assert f([]) == 0
    assert f([5]) == 0
    assert f([1, 2, 3]) == 0
    assert f([3, 0, 3]) == 3
    r = rng(8)
    for _ in range(300):
        h = [r.randint(0, 8) for _ in range(r.randint(0, 15))]
        brute = sum(max(0, min(max(h[: i + 1]), max(h[i:])) - h[i]) for i in range(len(h)))
        assert f(h) == brute, h


# ---------------- Sliding Window ----------------

@case("contains-duplicate-ii")
def _(ns):
    f = S(ns).containsNearbyDuplicate
    assert f([1, 2, 3, 1], 3) is True
    assert f([1, 0, 1, 1], 1) is True
    assert f([1, 2, 3, 1, 2, 3], 2) is False
    assert f([1, 1], 0) is False
    assert f([1], 5) is False
    r = rng(9)
    for _ in range(300):
        nums = [r.randint(0, 6) for _ in range(r.randint(1, 12))]
        k = r.randint(0, 6)
        brute = any(nums[i] == nums[j] and j - i <= k for i, j in combinations(range(len(nums)), 2))
        assert f(nums, k) is brute, (nums, k)


@case("maximum-average-subarray-i")
def _(ns):
    f = S(ns).findMaxAverage
    assert abs(f([1, 12, -5, -6, 50, 3], 4) - 12.75) < 1e-9
    assert abs(f([5], 1) - 5) < 1e-9
    assert abs(f([-1], 1) + 1) < 1e-9
    assert abs(f([0, 4, 0, 3, 2], 1) - 4) < 1e-9
    r = rng(10)
    for _ in range(200):
        nums = [r.randint(-20, 20) for _ in range(r.randint(1, 12))]
        k = r.randint(1, len(nums))
        brute = max(sum(nums[i : i + k]) / k for i in range(len(nums) - k + 1))
        assert abs(f(nums, k) - brute) < 1e-9, (nums, k)


@case("longest-substring-without-repeating-characters")
def _(ns):
    f = S(ns).lengthOfLongestSubstring
    assert f("abcabcbb") == 3
    assert f("bbbbb") == 1
    assert f("pwwkew") == 3
    assert f("") == 0
    assert f(" ") == 1
    assert f("dvdf") == 3
    assert f("abba") == 2
    r = rng(11)
    for _ in range(300):
        s = "".join(r.choice("abcd ") for _ in range(r.randint(0, 12)))
        brute = max([j - i for i in range(len(s)) for j in range(i + 1, len(s) + 1) if len(set(s[i:j])) == j - i] or [0])
        assert f(s) == brute, s


@case("longest-repeating-character-replacement")
def _(ns):
    f = S(ns).characterReplacement
    assert f("ABAB", 2) == 4
    assert f("AABABBA", 1) == 4
    assert f("A", 0) == 1
    assert f("ABCDE", 0) == 1
    assert f("AAAA", 10) == 4
    r = rng(12)
    for _ in range(300):
        s = "".join(r.choice("ABC") for _ in range(r.randint(1, 12)))
        k = r.randint(0, 3)
        brute = max(j - i for i in range(len(s)) for j in range(i + 1, len(s) + 1)
                    if (j - i) - max(Counter(s[i:j]).values()) <= k)
        assert f(s, k) == brute, (s, k)


@case("permutation-in-string")
def _(ns):
    f = S(ns).checkInclusion
    assert f("ab", "eidbaooo") is True
    assert f("ab", "eidboaoo") is False
    assert f("abc", "ab") is False  # pattern longer than text
    assert f("a", "a") is True
    assert f("adc", "dcda") is True
    r = rng(13)
    for _ in range(300):
        s1 = "".join(r.choice("abc") for _ in range(r.randint(1, 4)))
        s2 = "".join(r.choice("abc") for _ in range(r.randint(1, 10)))
        brute = any(Counter(s2[i : i + len(s1)]) == Counter(s1) for i in range(len(s2) - len(s1) + 1))
        assert f(s1, s2) is brute, (s1, s2)


@case("find-all-anagrams-in-a-string")
def _(ns):
    f = S(ns).findAnagrams
    assert f("cbaebabacd", "abc") == [0, 6]
    assert f("abab", "ab") == [0, 1, 2]
    assert f("a", "ab") == []
    assert f("aaaa", "a") == [0, 1, 2, 3]
    r = rng(14)
    for _ in range(300):
        s = "".join(r.choice("ab") for _ in range(r.randint(1, 10)))
        p = "".join(r.choice("ab") for _ in range(r.randint(1, 4)))
        brute = [i for i in range(len(s) - len(p) + 1) if Counter(s[i : i + len(p)]) == Counter(p)]
        assert sorted(f(s, p)) == brute, (s, p)


@case("minimum-size-subarray-sum")
def _(ns):
    f = S(ns).minSubArrayLen
    assert f(7, [2, 3, 1, 2, 4, 3]) == 2
    assert f(4, [1, 4, 4]) == 1
    assert f(11, [1, 1, 1, 1, 1, 1, 1, 1]) == 0
    assert f(15, [1, 2, 3, 4, 5]) == 5
    r = rng(15)
    for _ in range(300):
        nums = [r.randint(1, 6) for _ in range(r.randint(1, 10))]
        target = r.randint(1, 30)
        lens = [j - i for i in range(len(nums)) for j in range(i + 1, len(nums) + 1) if sum(nums[i:j]) >= target]
        assert f(target, nums) == (min(lens) if lens else 0), (target, nums)


@case("fruit-into-baskets")
def _(ns):
    f = S(ns).totalFruit
    assert f([1, 2, 1]) == 3
    assert f([0, 1, 2, 2]) == 3
    assert f([1, 2, 3, 2, 2]) == 4
    assert f([3, 3, 3, 1, 2, 1, 1, 2, 3, 3, 4]) == 5
    assert f([7]) == 1
    r = rng(16)
    for _ in range(300):
        fr = [r.randint(0, 3) for _ in range(r.randint(1, 12))]
        brute = max(j - i for i in range(len(fr)) for j in range(i + 1, len(fr) + 1) if len(set(fr[i:j])) <= 2)
        assert f(fr) == brute, fr


@case("max-consecutive-ones-iii")
def _(ns):
    f = S(ns).longestOnes
    assert f([1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], 2) == 6
    assert f([0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1], 3) == 10
    assert f([0, 0, 0], 0) == 0
    assert f([0, 0, 0], 5) == 3
    r = rng(17)
    for _ in range(300):
        nums = [r.randint(0, 1) for _ in range(r.randint(1, 12))]
        k = r.randint(0, 3)
        brute = max([j - i for i in range(len(nums)) for j in range(i + 1, len(nums) + 1) if nums[i:j].count(0) <= k] or [0])
        assert f(nums, k) == brute, (nums, k)


@case("minimum-window-substring")
def _(ns):
    f = S(ns).minWindow
    assert f("ADOBECODEBANC", "ABC") == "BANC"
    assert f("a", "a") == "a"
    assert f("a", "aa") == ""
    assert f("ab", "b") == "b"
    assert f("bba", "ab") == "ba"
    r = rng(18)
    for _ in range(300):
        s = "".join(r.choice("abc") for _ in range(r.randint(1, 10)))
        t = "".join(r.choice("abc") for _ in range(r.randint(1, 3)))
        need = Counter(t)
        windows = [s[i:j] for i in range(len(s)) for j in range(i + 1, len(s) + 1) if not need - Counter(s[i:j])]
        out = f(s, t)
        if not windows:
            assert out == "", (s, t)
        else:
            assert len(out) == min(map(len, windows)) and not need - Counter(out) and out in s, (s, t, out)


# ---------------- Binary Search ----------------

@case("binary-search")
def _(ns):
    f = S(ns).search
    assert f([-1, 0, 3, 5, 9, 12], 9) == 4
    assert f([-1, 0, 3, 5, 9, 12], 2) == -1
    assert f([5], 5) == 0
    assert f([5], -5) == -1
    nums = list(range(-30, 31, 3))
    for i, v in enumerate(nums):
        assert f(nums, v) == i
    for v in (-31, -29, 31, 100):
        assert f(nums, v) == -1


@case("search-insert-position")
def _(ns):
    f = S(ns).searchInsert
    assert f([1, 3, 5, 6], 5) == 2
    assert f([1, 3, 5, 6], 2) == 1
    assert f([1, 3, 5, 6], 7) == 4
    assert f([1, 3, 5, 6], 0) == 0
    assert f([1], 1) == 0
    r = rng(19)
    from bisect import bisect_left
    for _ in range(300):
        nums = sorted(r.sample(range(-20, 20), r.randint(1, 10)))
        t = r.randint(-22, 22)
        assert f(nums, t) == bisect_left(nums, t), (nums, t)


@case("search-a-2d-matrix")
def _(ns):
    f = S(ns).searchMatrix
    m = [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]]
    for row in m:
        for v in row:
            assert f(m, v) is True
    for v in (0, 2, 13, 21, 61, 100):
        assert f(m, v) is False
    assert f([[1]], 1) is True
    assert f([[1]], 2) is False
    assert f([[1], [3]], 3) is True
    assert f([[1, 3]], 3) is True


@case("search-in-rotated-sorted-array")
def _(ns):
    f = S(ns).search
    assert f([4, 5, 6, 7, 0, 1, 2], 0) == 4
    assert f([4, 5, 6, 7, 0, 1, 2], 3) == -1
    assert f([1], 0) == -1
    assert f([1], 1) == 0
    assert f([3, 1], 1) == 1
    base = list(range(0, 40, 3))
    for k in range(len(base)):
        nums = base[k:] + base[:k]
        for i, v in enumerate(nums):
            assert f(nums, v) == i, (nums, v)
        for v in (-1, 1, 41):
            assert f(nums, v) == -1


@case("find-minimum-in-rotated-sorted-array")
def _(ns):
    f = S(ns).findMin
    assert f([3, 4, 5, 1, 2]) == 1
    assert f([4, 5, 6, 7, 0, 1, 2]) == 0
    assert f([11, 13, 15, 17]) == 11
    assert f([1]) == 1
    assert f([2, 1]) == 1
    base = list(range(-10, 25, 2))
    for k in range(len(base)):
        assert f(base[k:] + base[:k]) == -10


@case("find-peak-element")
def _(ns):
    f = S(ns).findPeakElement

    def is_peak(nums, i):
        left = nums[i - 1] if i > 0 else float("-inf")
        right = nums[i + 1] if i < len(nums) - 1 else float("-inf")
        return nums[i] > left and nums[i] > right

    assert f([1, 2, 3, 1]) == 2
    assert f([1]) == 0
    assert f([2, 1]) == 0
    assert f([1, 2]) == 1
    r = rng(20)
    for _ in range(300):
        n = r.randint(1, 12)
        nums = [r.randint(0, 20)]
        for _ in range(n - 1):  # adjacent elements differ
            nums.append(r.choice([v for v in range(21) if v != nums[-1]]))
        i = f(nums)
        assert 0 <= i < len(nums) and is_peak(nums, i), nums


@case("koko-eating-bananas")
def _(ns):
    f = S(ns).minEatingSpeed
    assert f([3, 6, 7, 11], 8) == 4
    assert f([30, 11, 23, 4, 20], 5) == 30
    assert f([30, 11, 23, 4, 20], 6) == 23
    assert f([1], 1) == 1
    assert f([1000000000], 2) == 500000000
    assert f([312884470], 968709470) == 1
    r = rng(21)
    for _ in range(200):
        piles = [r.randint(1, 30) for _ in range(r.randint(1, 6))]
        h = r.randint(len(piles), 40)
        hours = lambda k: sum(-(-p // k) for p in piles)
        brute = next(k for k in range(1, max(piles) + 1) if hours(k) <= h)
        assert f(piles, h) == brute, (piles, h)


@case("capacity-to-ship-packages-within-d-days")
def _(ns):
    f = S(ns).shipWithinDays
    assert f([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5) == 15
    assert f([3, 2, 2, 4, 1, 4], 3) == 6
    assert f([1, 2, 3, 1, 1], 4) == 3
    assert f([10], 1) == 10
    assert f([1, 1, 1], 5) == 1

    def days_needed(weights, cap):
        days, load = 1, 0
        for w in weights:
            if load + w > cap:
                days, load = days + 1, 0
            load += w
        return days

    r = rng(22)
    for _ in range(200):
        weights = [r.randint(1, 10) for _ in range(r.randint(1, 8))]
        d = r.randint(1, len(weights))
        brute = next(c for c in range(max(weights), sum(weights) + 1) if days_needed(weights, c) <= d)
        assert f(weights, d) == brute, (weights, d)


@case("time-based-key-value-store")
def _(ns):
    tm = ns["TimeMap"]()
    tm.set("foo", "bar", 1)
    assert tm.get("foo", 1) == "bar"
    assert tm.get("foo", 3) == "bar"
    tm.set("foo", "bar2", 4)
    assert tm.get("foo", 4) == "bar2"
    assert tm.get("foo", 5) == "bar2"
    assert tm.get("foo", 3) == "bar"
    assert tm.get("foo", 0) == ""  # before the first set
    assert tm.get("missing", 10) == ""
    tm.set("love", "high", 10)
    tm.set("love", "low", 20)
    assert [tm.get("love", t) for t in (5, 10, 15, 20, 25)] == ["", "high", "high", "low", "low"]


@case("median-of-two-sorted-arrays")
def _(ns):
    f = S(ns).findMedianSortedArrays

    def median(xs):
        xs = sorted(xs)
        n = len(xs)
        return xs[n // 2] if n % 2 else (xs[n // 2 - 1] + xs[n // 2]) / 2

    assert f([1, 3], [2]) == 2.0
    assert f([1, 2], [3, 4]) == 2.5
    assert f([], [1]) == 1.0
    assert f([2], []) == 2.0
    assert f([0, 0], [0, 0]) == 0.0
    assert f([1, 2], [-1, 3]) == 1.5
    r = rng(23)
    for _ in range(500):
        a = sorted(r.randint(-20, 20) for _ in range(r.randint(0, 7)))
        b = sorted(r.randint(-20, 20) for _ in range(r.randint(0 if a else 1, 7)))
        assert abs(f(a, b) - median(a + b)) < 1e-9, (a, b)
