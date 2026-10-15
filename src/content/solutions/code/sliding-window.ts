import { defineCode } from "../types";

export default defineCode({
  "contains-duplicate-ii": `
class Solution:
    def containsNearbyDuplicate(self, nums: list[int], k: int) -> bool:
        window = set()
        for i, x in enumerate(nums):
            if x in window:
                return True
            window.add(x)
            if len(window) > k:
                window.remove(nums[i - k])
        return False
`,

  "maximum-average-subarray-i": `
class Solution:
    def findMaxAverage(self, nums: list[int], k: int) -> float:
        total = best = sum(nums[:k])
        for i in range(k, len(nums)):
            total += nums[i] - nums[i - k]
            best = max(best, total)
        return best / k
`,

  "longest-substring-without-repeating-characters": `
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        last = {}
        left = best = 0
        for right, c in enumerate(s):
            if c in last and last[c] >= left:
                left = last[c] + 1
            last[c] = right
            best = max(best, right - left + 1)
        return best
`,

  "longest-repeating-character-replacement": `
class Solution:
    def characterReplacement(self, s: str, k: int) -> int:
        count = {}
        left = max_freq = best = 0
        for right, c in enumerate(s):
            count[c] = count.get(c, 0) + 1
            max_freq = max(max_freq, count[c])
            while (right - left + 1) - max_freq > k:
                count[s[left]] -= 1
                left += 1
            best = max(best, right - left + 1)
        return best
`,

  "permutation-in-string": `
class Solution:
    def checkInclusion(self, s1: str, s2: str) -> bool:
        m = len(s1)
        if m > len(s2):
            return False
        need = [0] * 26
        window = [0] * 26
        for c in s1:
            need[ord(c) - 97] += 1
        for i, c in enumerate(s2):
            window[ord(c) - 97] += 1
            if i >= m:
                window[ord(s2[i - m]) - 97] -= 1
            if window == need:
                return True
        return False
`,

  "find-all-anagrams-in-a-string": `
class Solution:
    def findAnagrams(self, s: str, p: str) -> list[int]:
        m = len(p)
        need = [0] * 26
        window = [0] * 26
        for c in p:
            need[ord(c) - 97] += 1
        res = []
        for i, c in enumerate(s):
            window[ord(c) - 97] += 1
            if i >= m:
                window[ord(s[i - m]) - 97] -= 1
            if window == need:
                res.append(i - m + 1)
        return res
`,

  "minimum-size-subarray-sum": `
class Solution:
    def minSubArrayLen(self, target: int, nums: list[int]) -> int:
        left = total = 0
        best = float("inf")
        for right, x in enumerate(nums):
            total += x
            while total >= target:
                best = min(best, right - left + 1)
                total -= nums[left]
                left += 1
        return 0 if best == float("inf") else best
`,

  "fruit-into-baskets": `
class Solution:
    def totalFruit(self, fruits: list[int]) -> int:
        count = {}
        left = best = 0
        for right, f in enumerate(fruits):
            count[f] = count.get(f, 0) + 1
            while len(count) > 2:
                count[fruits[left]] -= 1
                if count[fruits[left]] == 0:
                    del count[fruits[left]]
                left += 1
            best = max(best, right - left + 1)
        return best
`,

  "max-consecutive-ones-iii": `
class Solution:
    def longestOnes(self, nums: list[int], k: int) -> int:
        left = zeros = best = 0
        for right, x in enumerate(nums):
            if x == 0:
                zeros += 1
            while zeros > k:
                if nums[left] == 0:
                    zeros -= 1
                left += 1
            best = max(best, right - left + 1)
        return best
`,

  "minimum-window-substring": `
from collections import Counter

class Solution:
    def minWindow(self, s: str, t: str) -> str:
        need = Counter(t)
        window = {}
        have, required = 0, len(need)
        best = (float("inf"), 0, 0)
        left = 0
        for right, c in enumerate(s):
            window[c] = window.get(c, 0) + 1
            if c in need and window[c] == need[c]:
                have += 1
            while have == required:
                if right - left + 1 < best[0]:
                    best = (right - left + 1, left, right + 1)
                out = s[left]
                window[out] -= 1
                if out in need and window[out] < need[out]:
                    have -= 1
                left += 1
        return s[best[1]:best[2]]
`,
});
