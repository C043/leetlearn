import { defineCode } from "../types";

export default defineCode({
  "kth-largest-element-in-a-stream": `
import heapq

class KthLargest:
    def __init__(self, k: int, nums: list[int]):
        # How many of the largest values to keep
        self.k = k
        # Min-heap of the k largest values
        self.heap = []
        # Add the starting numbers one by one
        for number in nums:
            self.add(number)

    def add(self, val: int) -> int:
        # Add the new value
        heapq.heappush(self.heap, val)
        # Too many values: drop the smallest
        if len(self.heap) > self.k:
            heapq.heappop(self.heap)
        # The smallest of the k largest is the kth largest
        return self.heap[0]
`,

  "last-stone-weight": `
import heapq

class Solution:
    def lastStoneWeight(self, stones: list[int]) -> int:
        # Negate for a max-heap
        heap = [-stone for stone in stones]
        # Arrange the list as a heap
        heapq.heapify(heap)
        # Smash while at least two stones remain
        while len(heap) > 1:
            # The heaviest stone
            heaviest = -heapq.heappop(heap)
            # The second heaviest stone
            second = -heapq.heappop(heap)
            # Different weights leave a smaller stone behind
            if heaviest != second:
                heapq.heappush(heap, -(heaviest - second))
        # The last stone's weight, or 0 if none is left
        return -heap[0] if heap else 0
`,

  "kth-largest-element-in-an-array": `
import heapq

class Solution:
    def findKthLargest(self, nums: list[int], k: int) -> int:
        # Min-heap holding the k largest values seen so far
        heap = []
        # Look at every number
        for number in nums:
            # Add it
            heapq.heappush(heap, number)
            # Too many values: drop the smallest
            if len(heap) > k:
                heapq.heappop(heap)
        # The smallest of the k largest is the kth largest
        return heap[0]
`,

  "top-k-frequent-elements": `
from collections import Counter

class Solution:
    def topKFrequent(self, nums: list[int], k: int) -> list[int]:
        # buckets[count] = numbers that appear exactly count times
        buckets = [[] for _ in range(len(nums) + 1)]
        # Put each number in the bucket for its count
        for number, count in Counter(nums).items():
            buckets[count].append(number)
        # The most frequent numbers
        result = []
        # Go through the buckets from the highest count down
        for count in range(len(buckets) - 1, 0, -1):
            # Take the numbers in this bucket
            for number in buckets[count]:
                result.append(number)
                # Got k numbers: done
                if len(result) == k:
                    return result
        # Only reached if there are fewer than k distinct numbers
        return result
`,

  "k-closest-points-to-origin": `
import heapq

class Solution:
    def kClosest(self, points: list[list[int]], k: int) -> list[list[int]]:
        # Max-heap by distance via negation, holding the k closest points so far
        heap = []
        # Look at every point
        for x, y in points:
            # Squared distance is enough for comparing
            distance = x * x + y * y
            # Fewer than k points kept: just add it
            if len(heap) < k:
                heapq.heappush(heap, (-distance, x, y))
            # Closer than the farthest kept point: replace that one
            elif distance < -heap[0][0]:
                heapq.heapreplace(heap, (-distance, x, y))
        # The kept points, without their distances
        return [[x, y] for _, x, y in heap]
`,

  "task-scheduler": `
from collections import Counter

class Solution:
    def leastInterval(self, tasks: list[str], n: int) -> int:
        # How many times each task appears
        frequency = Counter(tasks)
        # The highest count of any task
        highest_frequency = max(frequency.values())
        # How many tasks share that highest count
        tasks_with_highest = sum(1 for count in frequency.values() if count == highest_frequency)
        # Frame of (highest - 1) blocks of n + 1 slots, plus a last row of the top tasks;
        # if there are more tasks than slots, no idling is needed at all
        return max(len(tasks), (highest_frequency - 1) * (n + 1) + tasks_with_highest)
`,

  "kth-smallest-element-in-a-sorted-matrix": `
import heapq

class Solution:
    def kthSmallest(self, matrix: list[list[int]], k: int) -> int:
        # The matrix is size x size
        size = len(matrix)
        # Start with the first value of each row (at most k rows can matter)
        heap = [(matrix[row][0], row, 0) for row in range(min(size, k))]
        # Arrange them as a heap
        heapq.heapify(heap)
        # Remove the k - 1 smallest values
        for _ in range(k - 1):
            # Take the smallest value and where it came from
            _, row, column = heapq.heappop(heap)
            # Replace it with the next value in the same row
            if column + 1 < size:
                heapq.heappush(heap, (matrix[row][column + 1], row, column + 1))
        # The smallest value left is the kth smallest
        return heap[0][0]
`,

  "reorganize-string": `
from collections import Counter

class Solution:
    def reorganizeString(self, s: str) -> str:
        # Length of the string
        length = len(s)
        # How many times each letter appears
        frequency = Counter(s)
        # A letter appearing more than half the time must end up next to itself
        if max(frequency.values()) > (length + 1) // 2:
            return ""
        # The rearranged letters
        result = [""] * length
        # Fill even positions first, then odd ones
        position = 0
        # Most frequent letter first
        for letter, count in frequency.most_common():
            # Place every copy of this letter
            for _ in range(count):
                result[position] = letter
                # Skip one position so equal letters are never neighbors
                position += 2
                # Even slots full, switch to odd
                if position >= length:
                    position = 1
        # Join the letters back into a string
        return "".join(result)
`,

  "single-threaded-cpu": `
import heapq

class Solution:
    def getOrder(self, tasks: list[list[int]]) -> list[int]:
        # Task indices sorted by when they become available
        order = sorted(range(len(tasks)), key=lambda index: tasks[index][0])
        # Available tasks as (processingTime, index)
        heap = []
        # The order in which tasks are processed
        result = []
        # Current time, and position in the sorted order of the next task to arrive
        time, next_arrival = 0, 0
        # Run until every task is processed
        while len(result) < len(tasks):
            # CPU idle: jump to next arrival
            if not heap and time < tasks[order[next_arrival]][0]:
                time = tasks[order[next_arrival]][0]
            # Add every task that has arrived by now
            while next_arrival < len(order) and tasks[order[next_arrival]][0] <= time:
                # Original index of the arriving task
                task_index = order[next_arrival]
                heapq.heappush(heap, (tasks[task_index][1], task_index))
                next_arrival += 1
            # Run the shortest available task (ties go to the smaller index)
            duration, task_index = heapq.heappop(heap)
            # Time passes while it runs
            time += duration
            # Record that it ran
            result.append(task_index)
        # Order of processing
        return result
`,

  "find-median-from-data-stream": `
import heapq

class MedianFinder:
    def __init__(self):
        # Max-heap (negated): smaller half
        self.low = []
        # Min-heap: larger half
        self.high = []

    def addNum(self, num: int) -> None:
        # Add to the smaller half first
        heapq.heappush(self.low, -num)
        # Move the largest of the smaller half over, so every low value <= every high value
        heapq.heappush(self.high, -heapq.heappop(self.low))
        # Keep the smaller half the same size or one bigger
        if len(self.high) > len(self.low):
            heapq.heappush(self.low, -heapq.heappop(self.high))

    def findMedian(self) -> float:
        # Odd count: the extra value in the smaller half is the median
        if len(self.low) > len(self.high):
            return -self.low[0]
        # Even count: average the two middle values
        return (-self.low[0] + self.high[0]) / 2
`,
});
