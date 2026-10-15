import { defineCode } from "../types";

export default defineCode({
  "contains-duplicate-ii": `
class Solution:
    def containsNearbyDuplicate(self, nums: list[int], k: int) -> bool:
        # The last k values seen
        window = set()
        # Visit each value with its index
        for index, number in enumerate(nums):
            # The same value is within k positions
            if number in window:
                return True
            # Add the value to the window
            window.add(number)
            # Window too big: drop the value that is now more than k positions back
            if len(window) > k:
                window.remove(nums[index - k])
        # No close duplicates
        return False
`,

  "maximum-average-subarray-i": `
class Solution:
    def findMaxAverage(self, nums: list[int], k: int) -> float:
        # Sum of the first window, which is also the best so far
        total = best = sum(nums[:k])
        # Slide the window one step at a time
        for index in range(k, len(nums)):
            # Add the new value and remove the one that left the window
            total += nums[index] - nums[index - k]
            # Keep the best sum
            best = max(best, total)
        # The best sum divided by the window size is the best average
        return best / k
`,

  "longest-substring-without-repeating-characters": `
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        # Last index where each character was seen
        last = {}
        # Start of the window, and the longest length found
        left = best = 0
        # Extend the window one character at a time
        for right, character in enumerate(s):
            # The character already appears inside the window: move the start past it
            if character in last and last[character] >= left:
                left = last[character] + 1
            # Remember where we saw it
            last[character] = right
            # The window now has no repeats
            best = max(best, right - left + 1)
        # Longest window without repeats
        return best
`,

  "longest-repeating-character-replacement": `
class Solution:
    def characterReplacement(self, s: str, k: int) -> int:
        # How many times each character appears in the window
        count = {}
        # Start of the window, highest single-character count, longest length found
        left = highest_count = best = 0
        # Extend the window one character at a time
        for right, character in enumerate(s):
            # Count the new character
            count[character] = count.get(character, 0) + 1
            # Track the most common character's count
            highest_count = max(highest_count, count[character])
            # More than k characters would need replacing: shrink from the left
            while (right - left + 1) - highest_count > k:
                count[s[left]] -= 1
                left += 1
            # The window is valid
            best = max(best, right - left + 1)
        # Longest valid window
        return best
`,

  "permutation-in-string": `
class Solution:
    def checkInclusion(self, s1: str, s2: str) -> bool:
        # The window size is the length of s1
        size = len(s1)
        # s1 cannot fit inside a shorter string
        if size > len(s2):
            return False
        # Letter counts for s1 (index 0 = "a")
        need = [0] * 26
        # Letter counts for the current window of s2
        window = [0] * 26
        # Count the letters of s1 (97 is the code for "a")
        for character in s1:
            need[ord(character) - 97] += 1
        # Slide a window of the same size across s2
        for index, character in enumerate(s2):
            # Add the new letter
            window[ord(character) - 97] += 1
            # Remove the letter that fell out of the window
            if index >= size:
                window[ord(s2[index - size]) - 97] -= 1
            # Same counts means the window is a permutation of s1
            if window == need:
                return True
        # No window matched
        return False
`,

  "find-all-anagrams-in-a-string": `
class Solution:
    def findAnagrams(self, s: str, p: str) -> list[int]:
        # The window size is the length of p
        size = len(p)
        # Letter counts for p (index 0 = "a")
        need = [0] * 26
        # Letter counts for the current window of s
        window = [0] * 26
        # Count the letters of p (97 is the code for "a")
        for character in p:
            need[ord(character) - 97] += 1
        # Start indices of the anagrams
        result = []
        # Slide a window of the same size across s
        for index, character in enumerate(s):
            # Add the new letter
            window[ord(character) - 97] += 1
            # Remove the letter that fell out of the window
            if index >= size:
                window[ord(s[index - size]) - 97] -= 1
            # Same counts: the window is an anagram, record where it starts
            if window == need:
                result.append(index - size + 1)
        # Every anagram start index
        return result
`,

  "minimum-size-subarray-sum": `
class Solution:
    def minSubArrayLen(self, target: int, nums: list[int]) -> int:
        # Start of the window, and the window's sum
        left = total = 0
        # Shortest length found
        best = float("inf")
        # Extend the window one value at a time
        for right, number in enumerate(nums):
            total += number
            # While the sum is big enough, record it and try a shorter window
            while total >= target:
                best = min(best, right - left + 1)
                # Remove the leftmost value
                total -= nums[left]
                left += 1
        # No window reached the target
        return 0 if best == float("inf") else best
`,

  "fruit-into-baskets": `
class Solution:
    def totalFruit(self, fruits: list[int]) -> int:
        # How many of each fruit type are in the window
        count = {}
        # Start of the window, and the most fruit collected
        left = best = 0
        # Extend the window one tree at a time
        for right, fruit in enumerate(fruits):
            # Add this tree's fruit
            count[fruit] = count.get(fruit, 0) + 1
            # More than two types: shrink from the left
            while len(count) > 2:
                count[fruits[left]] -= 1
                # A type with no fruit left leaves the baskets
                if count[fruits[left]] == 0:
                    del count[fruits[left]]
                # Move the start of the window right
                left += 1
            # The window holds at most two types
            best = max(best, right - left + 1)
        # Most fruit in two baskets
        return best
`,

  "max-consecutive-ones-iii": `
class Solution:
    def longestOnes(self, nums: list[int], k: int) -> int:
        # Start of the window, zeros inside it, longest length found
        left = zeros = best = 0
        # Extend the window one value at a time
        for right, number in enumerate(nums):
            # Count zeros, which we would have to flip
            if number == 0:
                zeros += 1
            # Too many flips needed: shrink from the left
            while zeros > k:
                if nums[left] == 0:
                    # A zero leaves the window
                    zeros -= 1
                # Move the start of the window right
                left += 1
            # The window has at most k zeros
            best = max(best, right - left + 1)
        # Longest run of 1s after at most k flips
        return best
`,

  "minimum-window-substring": `
from collections import Counter

class Solution:
    def minWindow(self, s: str, t: str) -> str:
        # How many of each character the window must contain
        need = Counter(t)
        # How many of each character the window does contain
        window = {}
        # Characters whose requirement is met, and how many distinct ones are required
        have, required = 0, len(need)
        # Best window as (length, start, end)
        best = (float("inf"), 0, 0)
        # Start of the window
        left = 0
        # Extend the window one character at a time
        for right, character in enumerate(s):
            # Count the new character
            window[character] = window.get(character, 0) + 1
            # This character just met its requirement
            if character in need and window[character] == need[character]:
                have += 1
            # The window contains all of t: try to shrink it
            while have == required:
                # Smaller than the best window: record it
                if right - left + 1 < best[0]:
                    best = (right - left + 1, left, right + 1)
                # The character about to leave the window
                leaving = s[left]
                window[leaving] -= 1
                # Removing it broke a requirement
                if leaving in need and window[leaving] < need[leaving]:
                    have -= 1
                # Move the start of the window right
                left += 1
        # The best window, or "" if none was found
        return s[best[1]:best[2]]
`,
});
