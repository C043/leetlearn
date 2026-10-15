import { defineCode } from "../types";

export default defineCode({
  "summary-ranges": `
class Solution:
    def summaryRanges(self, nums: list[int]) -> list[str]:
        # The ranges as strings
        result = []
        # Position in nums
        index = 0
        # Each round builds one range
        while index < len(nums):
            # The range starts at the current number
            start = nums[index]
            # Extend while the next number is exactly one more
            while index + 1 < len(nums) and nums[index + 1] == nums[index] + 1:
                index += 1
            # A single number is written alone, a longer run as "start->end"
            result.append(str(start) if start == nums[index] else f"{start}->{nums[index]}")
            # Move to the first number after this range
            index += 1
        # Every range in order
        return result
`,

  "teemo-attacking": `
class Solution:
    def findPoisonedDuration(self, timeSeries: list[int], duration: int) -> int:
        # Total poisoned time
        total = 0
        # Look at each attack except the last
        for attack in range(len(timeSeries) - 1):
            # The poison lasts the full duration, or until the next attack resets it
            total += min(duration, timeSeries[attack + 1] - timeSeries[attack])
        # The last attack always lasts the full duration (if there were any attacks)
        return total + duration if timeSeries else 0
`,

  "merge-intervals": `
class Solution:
    def merge(self, intervals: list[list[int]]) -> list[list[int]]:
        # Sort by start so overlapping intervals end up next to each other
        intervals.sort(key=lambda interval: interval[0])
        # The merged intervals
        merged = []
        # Visit intervals in order of their start
        for start, end in intervals:
            # It overlaps the last merged interval: extend that one
            if merged and start <= merged[-1][1]:
                merged[-1][1] = max(merged[-1][1], end)
            # No overlap: start a new merged interval
            else:
                merged.append([start, end])
        # The non-overlapping result
        return merged
`,

  "insert-interval": `
class Solution:
    def insert(self, intervals: list[list[int]], newInterval: list[int]) -> list[list[int]]:
        # The resulting intervals
        result = []
        # Position in intervals, and how many there are
        index, count = 0, len(intervals)
        # The new interval, which grows as it absorbs overlaps
        start, end = newInterval
        # Intervals that end before the new one starts are kept as they are
        while index < count and intervals[index][1] < start:
            result.append(intervals[index])
            index += 1
        # Intervals that overlap get merged into the new one
        while index < count and intervals[index][0] <= end:
            start = min(start, intervals[index][0])
            end = max(end, intervals[index][1])
            index += 1
        # Add the merged new interval
        result.append([start, end])
        # The rest start after it and are kept as they are
        result.extend(intervals[index:])
        return result
`,

  "non-overlapping-intervals": `
class Solution:
    def eraseOverlapIntervals(self, intervals: list[list[int]]) -> int:
        # Sort by end: keeping the interval that ends first leaves the most room
        intervals.sort(key=lambda interval: interval[1])
        # Intervals kept
        kept = 0
        # End of the last kept interval
        previous_end = float("-inf")
        # Visit intervals in order of their end
        for start, end in intervals:
            # Touching endpoints don't overlap, so keep this one
            if start >= previous_end:
                kept += 1
                previous_end = end
        # Everything not kept is removed
        return len(intervals) - kept
`,

  "remove-covered-intervals": `
class Solution:
    def removeCoveredIntervals(self, intervals: list[list[int]]) -> int:
        # Sort by start; for equal starts, the longer interval comes first
        intervals.sort(key=lambda interval: (interval[0], -interval[1]))
        # Intervals not covered by another one
        remaining = 0
        # Furthest end seen so far
        furthest_end = float("-inf")
        # Every earlier interval starts at or before this one
        for _, end in intervals:
            # Ends further than all earlier ones, so nothing covers it
            if end > furthest_end:
                remaining += 1
                furthest_end = end
        # Intervals left after removing covered ones
        return remaining
`,

  "find-right-interval": `
from bisect import bisect_left

class Solution:
    def findRightInterval(self, intervals: list[list[int]]) -> list[int]:
        # (start, original index) pairs, sorted by start
        starts = sorted((interval[0], index) for index, interval in enumerate(intervals))
        # Just the sorted start values, for binary search
        keys = [start for start, _ in starts]
        # The answer for each interval
        result = []
        # Find the right interval for each one in turn
        for _, end in intervals:
            # Smallest start >= end
            position = bisect_left(keys, end)
            # Its original index, or -1 if no start is big enough
            result.append(starts[position][1] if position < len(starts) else -1)
        # Right interval index for each interval
        return result
`,

  "interval-list-intersections": `
class Solution:
    def intervalIntersection(self, firstList: list[list[int]], secondList: list[list[int]]) -> list[list[int]]:
        # The intersections found
        result = []
        # Position in each list
        first = second = 0
        # Stop when either list runs out
        while first < len(firstList) and second < len(secondList):
            # The overlap starts at the later start
            low = max(firstList[first][0], secondList[second][0])
            # and ends at the earlier end
            high = min(firstList[first][1], secondList[second][1])
            # A real overlap
            if low <= high:
                result.append([low, high])
            # Drop whichever interval ends first: it cannot overlap anything else
            if firstList[first][1] < secondList[second][1]:
                first += 1
            else:
                second += 1
        # All intersections in order
        return result
`,

  "car-pooling": `
class Solution:
    def carPooling(self, trips: list[list[int]], capacity: int) -> bool:
        # change[location] = passengers added (or removed) at that location
        change = [0] * 1001
        # Record each trip's pick-up and drop-off
        for passengers, start, end in trips:
            change[start] += passengers
            # Dropped off before anyone is picked up here
            change[end] -= passengers
        # Passengers in the car right now
        load = 0
        # Drive past every location in order
        for delta in change:
            load += delta
            # Too many people at once
            if load > capacity:
                return False
        # Capacity was never exceeded
        return True
`,

  "minimum-interval-to-include-each-query": `
import heapq

class Solution:
    def minInterval(self, intervals: list[list[int]], queries: list[int]) -> list[int]:
        # Sort intervals by start
        intervals.sort()
        # Answer for each query, -1 if none contains it
        result = [-1] * len(queries)
        # Intervals that started before the current query, as (size, end)
        heap = []
        # Next interval to consider
        next_interval = 0
        # Answer the queries from smallest to largest, remembering their original positions
        for query_index in sorted(range(len(queries)), key=lambda index: queries[index]):
            # The query value
            query = queries[query_index]
            # Add every interval that starts at or before the query
            while next_interval < len(intervals) and intervals[next_interval][0] <= query:
                start, end = intervals[next_interval]
                heapq.heappush(heap, (end - start + 1, end))
                next_interval += 1
            # Drop intervals that end before the query: useless from now on
            while heap and heap[0][1] < query:
                heapq.heappop(heap)
            # The smallest interval left contains the query
            if heap:
                result[query_index] = heap[0][0]
        # Answers in the original query order
        return result
`,
});
