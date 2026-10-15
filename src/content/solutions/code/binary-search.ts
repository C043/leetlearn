import { defineCode } from "../types";

export default defineCode({
  "binary-search": `
class Solution:
    def search(self, nums: list[int], target: int) -> int:
        # The target, if present, is somewhere in nums[low..high]
        low, high = 0, len(nums) - 1
        # Keep going while the range is not empty
        while low <= high:
            # Look at the middle of the range
            middle = (low + high) // 2
            # Found it
            if nums[middle] == target:
                return middle
            # Middle is too small: the target must be to the right
            if nums[middle] < target:
                low = middle + 1
            # Middle is too big: the target must be to the left
            else:
                high = middle - 1
        # The range became empty: the target is not there
        return -1
`,

  "search-insert-position": `
class Solution:
    def searchInsert(self, nums: list[int], target: int) -> int:
        # high = len(nums) because the target may go at the very end
        low, high = 0, len(nums)
        # Find the first index whose value is >= target
        while low < high:
            # Look at the middle of the range
            middle = (low + high) // 2
            # Too small: the answer is to the right of middle
            if nums[middle] < target:
                low = middle + 1
            # Big enough: middle could be the answer, keep it in range
            else:
                high = middle
        # low and high met at the insert position
        return low
`,

  "search-a-2d-matrix": `
class Solution:
    def searchMatrix(self, matrix: list[list[int]], target: int) -> bool:
        # Grid size
        row_count, column_count = len(matrix), len(matrix[0])
        # Treat the matrix as one sorted list of row_count * column_count values
        low, high = 0, row_count * column_count - 1
        # Standard binary search over that flat list
        while low <= high:
            # Middle position in the flat list
            middle = (low + high) // 2
            # Turn the flat position back into a row and a column
            value = matrix[middle // column_count][middle % column_count]
            # Found it
            if value == target:
                return True
            # Too small: search to the right
            if value < target:
                low = middle + 1
            # Too big: search to the left
            else:
                high = middle - 1
        # Not in the matrix
        return False
`,

  "search-in-rotated-sorted-array": `
class Solution:
    def search(self, nums: list[int], target: int) -> int:
        # Search the whole array
        low, high = 0, len(nums) - 1
        # Keep going while the range is not empty
        while low <= high:
            # Look at the middle of the range
            middle = (low + high) // 2
            # Found it
            if nums[middle] == target:
                return middle
            # The left half is sorted
            if nums[low] <= nums[middle]:
                # Target lies inside the sorted left half
                if nums[low] <= target < nums[middle]:
                    high = middle - 1
                # Otherwise it can only be in the right half
                else:
                    low = middle + 1
            # The right half is sorted
            else:
                # Target lies inside the sorted right half
                if nums[middle] < target <= nums[high]:
                    low = middle + 1
                # Otherwise it can only be in the left half
                else:
                    high = middle - 1
        # Not in the array
        return -1
`,

  "find-minimum-in-rotated-sorted-array": `
class Solution:
    def findMin(self, nums: list[int]) -> int:
        # The minimum is somewhere in nums[low..high]
        low, high = 0, len(nums) - 1
        # Shrink until one candidate is left
        while low < high:
            # Look at the middle of the range
            middle = (low + high) // 2
            # Middle is bigger than the end, so the drop (and the minimum) is to its right
            if nums[middle] > nums[high]:
                low = middle + 1
            # Middle to high is sorted, so the minimum is at middle or to its left
            else:
                high = middle
        # The only candidate left
        return nums[low]
`,

  "find-peak-element": `
class Solution:
    def findPeakElement(self, nums: list[int]) -> int:
        # A peak is somewhere in nums[low..high]
        low, high = 0, len(nums) - 1
        # Shrink until one candidate is left
        while low < high:
            # Look at the middle of the range
            middle = (low + high) // 2
            # Going uphill to the right: a peak must exist to the right
            if nums[middle] < nums[middle + 1]:
                low = middle + 1
            # Going downhill: middle or something to its left is a peak
            else:
                high = middle
        # The only candidate left is a peak
        return low
`,

  "koko-eating-bananas": `
class Solution:
    def minEatingSpeed(self, piles: list[int], h: int) -> int:
        # The speed is at least 1 and never needs to exceed the biggest pile
        low, high = 1, max(piles)
        # Find the smallest speed that finishes in time
        while low < high:
            # Try the speed in the middle of the range
            speed = (low + high) // 2
            # Hours needed: each pile takes ceil(pile / speed) hours
            hours = sum((pile + speed - 1) // speed for pile in piles)
            # Fast enough: this speed works, try slower ones too
            if hours <= h:
                high = speed
            # Too slow: she must eat faster
            else:
                low = speed + 1
        # The slowest speed that still works
        return low
`,

  "capacity-to-ship-packages-within-d-days": `
class Solution:
    def shipWithinDays(self, weights: list[int], days: int) -> int:
        # How many days are needed if the ship carries at most capacity per day
        def days_needed(capacity: int) -> int:
            # Days used so far, and the weight loaded on the current day
            used, load = 1, 0
            # Load packages in order
            for weight in weights:
                # This package does not fit today: start a new day
                if load + weight > capacity:
                    used += 1
                    load = 0
                # Put the package on the ship
                load += weight
            # Total days this capacity needs
            return used

        # Must carry the heaviest package; carrying everything at once always works
        low, high = max(weights), sum(weights)
        # Find the smallest capacity that is fast enough
        while low < high:
            # Try the capacity in the middle of the range
            middle = (low + high) // 2
            # Fast enough: this works, try smaller capacities too
            if days_needed(middle) <= days:
                high = middle
            # Too slow: the ship must carry more
            else:
                low = middle + 1
        # The smallest capacity that works
        return low
`,

  "time-based-key-value-store": `
from bisect import bisect_right
from collections import defaultdict

class TimeMap:
    def __init__(self):
        # For each key, the timestamps in the order they were set (always increasing)
        self.times = defaultdict(list)
        # For each key, the values matching those timestamps
        self.values = defaultdict(list)

    def set(self, key: str, value: str, timestamp: int) -> None:
        # Timestamps arrive in increasing order, so appending keeps the list sorted
        self.times[key].append(timestamp)
        self.values[key].append(value)

    def get(self, key: str, timestamp: int) -> str:
        # Index of the first time strictly greater than timestamp
        position = bisect_right(self.times[key], timestamp)
        # The entry just before it is the latest one at or before timestamp
        return self.values[key][position - 1] if position else ""
`,

  "median-of-two-sorted-arrays": `
class Solution:
    def findMedianSortedArrays(self, nums1: list[int], nums2: list[int]) -> float:
        # Binary search over the shorter array
        if len(nums1) > len(nums2):
            nums1, nums2 = nums2, nums1
        # Lengths of both arrays
        length1, length2 = len(nums1), len(nums2)
        # How many elements belong in the left half of the merged array
        half = (length1 + length2 + 1) // 2
        # How many elements to take from nums1: somewhere between 0 and length1
        low, high = 0, length1
        # Search for the split that puts the right elements on each side
        while low <= high:
            # Elements taken from nums1
            take_from_nums1 = (low + high) // 2
            # Elements taken from nums2 to fill the left half
            take_from_nums2 = half - take_from_nums1
            # Largest value on the left side of nums1, or minus infinity if none
            nums1_left = nums1[take_from_nums1 - 1] if take_from_nums1 > 0 else float("-inf")
            # Smallest value on the right side of nums1, or infinity if none
            nums1_right = nums1[take_from_nums1] if take_from_nums1 < length1 else float("inf")
            # Largest value on the left side of nums2, or minus infinity if none
            nums2_left = nums2[take_from_nums2 - 1] if take_from_nums2 > 0 else float("-inf")
            # Smallest value on the right side of nums2, or infinity if none
            nums2_right = nums2[take_from_nums2] if take_from_nums2 < length2 else float("inf")
            # Every left value is <= every right value: this is the correct split
            if nums1_left <= nums2_right and nums2_left <= nums1_right:
                # Odd total: the median is the largest value on the left
                if (length1 + length2) % 2:
                    return max(nums1_left, nums2_left)
                # Even total: average the two middle values
                return (max(nums1_left, nums2_left) + min(nums1_right, nums2_right)) / 2
            # Took too many from nums1: take fewer
            if nums1_left > nums2_right:
                high = take_from_nums1 - 1
            # Took too few from nums1: take more
            else:
                low = take_from_nums1 + 1
        # Unreachable for valid input
        return 0.0
`,
});
