import { defineCode } from "../types";

export default defineCode({
  "valid-palindrome": `
class Solution:
    def isPalindrome(self, s: str) -> bool:
        # One pointer starts at the first character, the other at the last
        left, right = 0, len(s) - 1
        # Keep comparing until the two pointers meet in the middle
        while left < right:
            # Skip characters on the left that are not letters or digits
            while left < right and not s[left].isalnum():
                left += 1
            # Skip characters on the right that are not letters or digits
            while left < right and not s[right].isalnum():
                right -= 1
            # Compare ignoring case: a mismatch means it is not a palindrome
            if s[left].lower() != s[right].lower():
                return False
            # This pair matched, so move both pointers inward
            left += 1
            right -= 1
        # Every pair matched
        return True
`,

  "two-sum-ii-input-array-is-sorted": `
class Solution:
    def twoSum(self, numbers: list[int], target: int) -> list[int]:
        # Start with the smallest value on the left and the largest on the right
        left, right = 0, len(numbers) - 1
        # The pointers close in until they meet
        while left < right:
            # Sum of the two values currently pointed at
            total = numbers[left] + numbers[right]
            # Found the pair: the answer is 1-indexed
            if total == target:
                return [left + 1, right + 1]
            # Sum too big: the right value is too large for any partner, drop it
            if total > target:
                right -= 1
            # Sum too small: the left value is too small for any partner, drop it
            else:
                left += 1
        # The problem guarantees a solution, so this is never reached
        return []
`,

  "container-with-most-water": `
class Solution:
    def maxArea(self, height: list[int]) -> int:
        # Start with the widest possible container
        left, right = 0, len(height) - 1
        # Largest amount of water seen so far
        best = 0
        # Shrink the width step by step
        while left < right:
            # Water is limited by the shorter wall, times the distance between walls
            best = max(best, min(height[left], height[right]) * (right - left))
            # Move the shorter wall: keeping it can never give a bigger area
            if height[left] < height[right]:
                left += 1
            else:
                right -= 1
        # The biggest area found
        return best
`,

  "3sum": `
class Solution:
    def threeSum(self, nums: list[int]) -> list[list[int]]:
        # Sorting lets us use two pointers and skip duplicates easily
        nums.sort()
        # Every unique triplet that sums to zero
        result = []
        # Fix the first number of the triplet
        for first in range(len(nums) - 2):
            # A positive first number means all three are positive: no more zeros possible
            if nums[first] > 0:
                break
            # Same first number as before would produce the same triplets
            if first > 0 and nums[first] == nums[first - 1]:
                continue
            # Search the rest of the array with two pointers
            left, right = first + 1, len(nums) - 1
            # Look for the other two numbers
            while left < right:
                # Sum of the current triplet
                total = nums[first] + nums[left] + nums[right]
                # Too small: move the left pointer to a bigger value
                if total < 0:
                    left += 1
                # Too big: move the right pointer to a smaller value
                elif total > 0:
                    right -= 1
                # Exactly zero: record the triplet
                else:
                    result.append([nums[first], nums[left], nums[right]])
                    # Move both pointers past the values just used
                    left += 1
                    right -= 1
                    # Skip repeated left values so the triplet is not added twice
                    while left < right and nums[left] == nums[left - 1]:
                        left += 1
                    # Skip repeated right values for the same reason
                    while left < right and nums[right] == nums[right + 1]:
                        right -= 1
        # All triplets found
        return result
`,

  "remove-duplicates-from-sorted-array": `
class Solution:
    def removeDuplicates(self, nums: list[int]) -> int:
        # Number of unique values kept so far; the first value is always kept
        unique_count = 1
        # Look at every value after the first
        for index in range(1, len(nums)):
            # A value different from the last kept one is new
            if nums[index] != nums[unique_count - 1]:
                # Write it right after the kept values
                nums[unique_count] = nums[index]
                # One more unique value kept
                unique_count += 1
        # Length of the deduplicated prefix
        return unique_count
`,

  "sort-colors": `
class Solution:
    def sortColors(self, nums: list[int]) -> None:
        # Everything before low is 0, everything after high is 2, middle scans the unknowns
        low, middle, high = 0, 0, len(nums) - 1
        # Stop once the scanner passes the region of 2s
        while middle <= high:
            # A 0 belongs at the front: swap it into the low region
            if nums[middle] == 0:
                nums[low], nums[middle] = nums[middle], nums[low]
                # The low region grew by one
                low += 1
                # The value swapped in from low is already checked, so move on
                middle += 1
            # A 1 is already in the right region
            elif nums[middle] == 1:
                middle += 1
            # A 2 belongs at the back: swap it into the high region
            else:
                nums[middle], nums[high] = nums[high], nums[middle]
                # Don't advance middle: the swapped-in value is unchecked
                high -= 1
`,

  "4sum": `
class Solution:
    def fourSum(self, nums: list[int], target: int) -> list[list[int]]:
        # Sorting lets us use two pointers and skip duplicates easily
        nums.sort()
        # Length of the input
        length = len(nums)
        # Every unique quadruplet that sums to target
        result = []
        # Fix the first number
        for first in range(length - 3):
            # Same first number as before would repeat quadruplets
            if first > 0 and nums[first] == nums[first - 1]:
                continue
            # Fix the second number
            for second in range(first + 1, length - 2):
                # Same second number as before would repeat quadruplets
                if second > first + 1 and nums[second] == nums[second - 1]:
                    continue
                # Find the last two numbers with two pointers
                left, right = second + 1, length - 1
                # Close in until the pointers meet
                while left < right:
                    # Sum of the current four numbers
                    total = nums[first] + nums[second] + nums[left] + nums[right]
                    # Too small: move left to a bigger value
                    if total < target:
                        left += 1
                    # Too big: move right to a smaller value
                    elif total > target:
                        right -= 1
                    # Exact match: record it
                    else:
                        result.append([nums[first], nums[second], nums[left], nums[right]])
                        # Move both pointers past the values just used
                        left += 1
                        right -= 1
                        # Skip repeated left values
                        while left < right and nums[left] == nums[left - 1]:
                            left += 1
                        # Skip repeated right values
                        while left < right and nums[right] == nums[right + 1]:
                            right -= 1
        # All quadruplets found
        return result
`,

  "valid-triangle-number": `
class Solution:
    def triangleNumber(self, nums: list[int]) -> int:
        # Sorting means only the two smaller sides need to beat the largest side
        nums.sort()
        # Number of valid triangles
        count = 0
        # Fix the largest side, from the biggest value down
        for largest in range(len(nums) - 1, 1, -1):
            # Search the two smaller sides among the values before it
            left, right = 0, largest - 1
            # Close in until the pointers meet
            while left < right:
                # These two sides are long enough to form a triangle
                if nums[left] + nums[right] > nums[largest]:
                    # Every left index in [left, right) also works with right
                    count += right - left
                    # Try a smaller middle side
                    right -= 1
                # Too short: try a longer smallest side
                else:
                    left += 1
        # Total triangles found
        return count
`,

  "most-common-word": `
from collections import Counter

class Solution:
    def mostCommonWord(self, paragraph: str, banned: list[str]) -> str:
        # Lower-case letters and turn punctuation into spaces
        normalized = "".join(character.lower() if character.isalnum() else " " for character in paragraph)
        # A set makes the banned lookup fast
        banned_set = set(banned)
        # Count every word that is not banned
        counts = Counter(word for word in normalized.split() if word not in banned_set)
        # The single most frequent word
        return counts.most_common(1)[0][0]
`,

  "trapping-rain-water": `
class Solution:
    def trap(self, height: list[int]) -> int:
        # One pointer at each end of the elevation map
        left, right = 0, len(height) - 1
        # Tallest bar seen so far from each side
        tallest_left = tallest_right = 0
        # Total trapped water
        water = 0
        # Walk inward until the pointers meet
        while left < right:
            # The left side is lower, so its water level is set by tallest_left
            if height[left] < height[right]:
                # Update the tallest bar seen from the left
                tallest_left = max(tallest_left, height[left])
                # Water above this bar is the gap up to that tallest bar
                water += tallest_left - height[left]
                # Move the left pointer inward
                left += 1
            # The right side is lower, so its water level is set by tallest_right
            else:
                # Update the tallest bar seen from the right
                tallest_right = max(tallest_right, height[right])
                # Water above this bar is the gap up to that tallest bar
                water += tallest_right - height[right]
                # Move the right pointer inward
                right -= 1
        # Total water trapped
        return water
`,
});
