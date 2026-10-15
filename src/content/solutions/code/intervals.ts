import { defineCode } from "../types";

export default defineCode({
  "summary-ranges": `
class Solution:
    def summaryRanges(self, nums: list[int]) -> list[str]:
        res = []
        i = 0
        while i < len(nums):
            start = nums[i]
            while i + 1 < len(nums) and nums[i + 1] == nums[i] + 1:
                i += 1
            res.append(str(start) if start == nums[i] else f"{start}->{nums[i]}")
            i += 1
        return res
`,

  "teemo-attacking": `
class Solution:
    def findPoisonedDuration(self, timeSeries: list[int], duration: int) -> int:
        total = 0
        for i in range(len(timeSeries) - 1):
            total += min(duration, timeSeries[i + 1] - timeSeries[i])
        return total + duration if timeSeries else 0
`,

  "merge-intervals": `
class Solution:
    def merge(self, intervals: list[list[int]]) -> list[list[int]]:
        intervals.sort(key=lambda iv: iv[0])
        merged = []
        for start, end in intervals:
            if merged and start <= merged[-1][1]:
                merged[-1][1] = max(merged[-1][1], end)
            else:
                merged.append([start, end])
        return merged
`,

  "insert-interval": `
class Solution:
    def insert(self, intervals: list[list[int]], newInterval: list[int]) -> list[list[int]]:
        res = []
        i, n = 0, len(intervals)
        start, end = newInterval
        while i < n and intervals[i][1] < start:   # ends before
            res.append(intervals[i])
            i += 1
        while i < n and intervals[i][0] <= end:    # overlaps
            start = min(start, intervals[i][0])
            end = max(end, intervals[i][1])
            i += 1
        res.append([start, end])
        res.extend(intervals[i:])                  # the rest
        return res
`,

  "non-overlapping-intervals": `
class Solution:
    def eraseOverlapIntervals(self, intervals: list[list[int]]) -> int:
        intervals.sort(key=lambda iv: iv[1])
        kept = 0
        prev_end = float("-inf")
        for start, end in intervals:
            if start >= prev_end:  # touching endpoints don't overlap
                kept += 1
                prev_end = end
        return len(intervals) - kept
`,

  "remove-covered-intervals": `
class Solution:
    def removeCoveredIntervals(self, intervals: list[list[int]]) -> int:
        intervals.sort(key=lambda iv: (iv[0], -iv[1]))
        remaining = 0
        max_end = float("-inf")
        for _, end in intervals:
            if end > max_end:
                remaining += 1
                max_end = end
        return remaining
`,

  "find-right-interval": `
from bisect import bisect_left

class Solution:
    def findRightInterval(self, intervals: list[list[int]]) -> list[int]:
        starts = sorted((iv[0], i) for i, iv in enumerate(intervals))
        keys = [s for s, _ in starts]
        res = []
        for _, end in intervals:
            j = bisect_left(keys, end)  # smallest start >= end
            res.append(starts[j][1] if j < len(starts) else -1)
        return res
`,

  "interval-list-intersections": `
class Solution:
    def intervalIntersection(self, firstList: list[list[int]], secondList: list[list[int]]) -> list[list[int]]:
        res = []
        i = j = 0
        while i < len(firstList) and j < len(secondList):
            lo = max(firstList[i][0], secondList[j][0])
            hi = min(firstList[i][1], secondList[j][1])
            if lo <= hi:
                res.append([lo, hi])
            if firstList[i][1] < secondList[j][1]:
                i += 1
            else:
                j += 1
        return res
`,

  "car-pooling": `
class Solution:
    def carPooling(self, trips: list[list[int]], capacity: int) -> bool:
        change = [0] * 1001
        for passengers, start, end in trips:
            change[start] += passengers
            change[end] -= passengers  # dropped off before anyone is picked up here
        load = 0
        for delta in change:
            load += delta
            if load > capacity:
                return False
        return True
`,

  "minimum-interval-to-include-each-query": `
import heapq

class Solution:
    def minInterval(self, intervals: list[list[int]], queries: list[int]) -> list[int]:
        intervals.sort()
        res = [-1] * len(queries)
        heap = []  # (size, end)
        i = 0
        for qi in sorted(range(len(queries)), key=lambda k: queries[k]):
            q = queries[qi]
            while i < len(intervals) and intervals[i][0] <= q:
                start, end = intervals[i]
                heapq.heappush(heap, (end - start + 1, end))
                i += 1
            while heap and heap[0][1] < q:
                heapq.heappop(heap)  # ends before q, useless from now on
            if heap:
                res[qi] = heap[0][0]
        return res
`,
});
