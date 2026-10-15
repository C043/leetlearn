import { defineCode } from "../types";

export default defineCode({
  "kth-largest-element-in-a-stream": `
import heapq

class KthLargest:
    def __init__(self, k: int, nums: list[int]):
        self.k = k
        self.heap = []  # min-heap of the k largest values
        for x in nums:
            self.add(x)

    def add(self, val: int) -> int:
        heapq.heappush(self.heap, val)
        if len(self.heap) > self.k:
            heapq.heappop(self.heap)
        return self.heap[0]
`,

  "last-stone-weight": `
import heapq

class Solution:
    def lastStoneWeight(self, stones: list[int]) -> int:
        heap = [-s for s in stones]  # negate for a max-heap
        heapq.heapify(heap)
        while len(heap) > 1:
            y = -heapq.heappop(heap)
            x = -heapq.heappop(heap)
            if y != x:
                heapq.heappush(heap, -(y - x))
        return -heap[0] if heap else 0
`,

  "kth-largest-element-in-an-array": `
import heapq

class Solution:
    def findKthLargest(self, nums: list[int], k: int) -> int:
        heap = []
        for x in nums:
            heapq.heappush(heap, x)
            if len(heap) > k:
                heapq.heappop(heap)
        return heap[0]
`,

  "top-k-frequent-elements": `
from collections import Counter

class Solution:
    def topKFrequent(self, nums: list[int], k: int) -> list[int]:
        buckets = [[] for _ in range(len(nums) + 1)]
        for x, c in Counter(nums).items():
            buckets[c].append(x)
        res = []
        for c in range(len(buckets) - 1, 0, -1):
            for x in buckets[c]:
                res.append(x)
                if len(res) == k:
                    return res
        return res
`,

  "k-closest-points-to-origin": `
import heapq

class Solution:
    def kClosest(self, points: list[list[int]], k: int) -> list[list[int]]:
        heap = []  # max-heap by distance via negation
        for x, y in points:
            d = x * x + y * y
            if len(heap) < k:
                heapq.heappush(heap, (-d, x, y))
            elif d < -heap[0][0]:
                heapq.heapreplace(heap, (-d, x, y))
        return [[x, y] for _, x, y in heap]
`,

  "task-scheduler": `
from collections import Counter

class Solution:
    def leastInterval(self, tasks: list[str], n: int) -> int:
        freq = Counter(tasks)
        max_freq = max(freq.values())
        count_max = sum(1 for f in freq.values() if f == max_freq)
        return max(len(tasks), (max_freq - 1) * (n + 1) + count_max)
`,

  "kth-smallest-element-in-a-sorted-matrix": `
import heapq

class Solution:
    def kthSmallest(self, matrix: list[list[int]], k: int) -> int:
        n = len(matrix)
        heap = [(matrix[r][0], r, 0) for r in range(min(n, k))]
        heapq.heapify(heap)
        for _ in range(k - 1):
            _, r, c = heapq.heappop(heap)
            if c + 1 < n:
                heapq.heappush(heap, (matrix[r][c + 1], r, c + 1))
        return heap[0][0]
`,

  "reorganize-string": `
from collections import Counter

class Solution:
    def reorganizeString(self, s: str) -> str:
        n = len(s)
        freq = Counter(s)
        if max(freq.values()) > (n + 1) // 2:
            return ""
        res = [""] * n
        i = 0
        for c, f in freq.most_common():  # most frequent letter first
            for _ in range(f):
                res[i] = c
                i += 2
                if i >= n:
                    i = 1  # even slots full, switch to odd
        return "".join(res)
`,

  "single-threaded-cpu": `
import heapq

class Solution:
    def getOrder(self, tasks: list[list[int]]) -> list[int]:
        order = sorted(range(len(tasks)), key=lambda i: tasks[i][0])
        heap = []  # (processingTime, index)
        res = []
        time, i = 0, 0
        while len(res) < len(tasks):
            if not heap and time < tasks[order[i]][0]:
                time = tasks[order[i]][0]  # CPU idle: jump to next arrival
            while i < len(order) and tasks[order[i]][0] <= time:
                idx = order[i]
                heapq.heappush(heap, (tasks[idx][1], idx))
                i += 1
            duration, idx = heapq.heappop(heap)
            time += duration
            res.append(idx)
        return res
`,

  "find-median-from-data-stream": `
import heapq

class MedianFinder:
    def __init__(self):
        self.low = []   # max-heap (negated): smaller half
        self.high = []  # min-heap: larger half

    def addNum(self, num: int) -> None:
        heapq.heappush(self.low, -num)
        heapq.heappush(self.high, -heapq.heappop(self.low))
        if len(self.high) > len(self.low):
            heapq.heappush(self.low, -heapq.heappop(self.high))

    def findMedian(self) -> float:
        if len(self.low) > len(self.high):
            return -self.low[0]
        return (-self.low[0] + self.high[0]) / 2
`,
});
