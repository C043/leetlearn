import { defineCode } from "../types";

export default defineCode({
  "climbing-stairs": `
class Solution:
    def climbStairs(self, n: int) -> int:
        prev, curr = 1, 1  # ways(0), ways(1)
        for _ in range(n - 1):
            prev, curr = curr, prev + curr
        return curr
`,

  "min-cost-climbing-stairs": `
class Solution:
    def minCostClimbingStairs(self, cost: list[int]) -> int:
        n = len(cost)
        dp = [0] * (n + 1)  # dp[0] = dp[1] = 0: free starting points
        for i in range(2, n + 1):
            dp[i] = min(dp[i - 1] + cost[i - 1], dp[i - 2] + cost[i - 2])
        return dp[n]
`,

  "house-robber": `
class Solution:
    def rob(self, nums: list[int]) -> int:
        prev2, prev1 = 0, 0  # best up to i-2, best up to i-1
        for x in nums:
            prev2, prev1 = prev1, max(prev1, prev2 + x)
        return prev1
`,

  "coin-change": `
class Solution:
    def coinChange(self, coins: list[int], amount: int) -> int:
        INF = amount + 1
        dp = [0] + [INF] * amount
        for a in range(1, amount + 1):
            for c in coins:
                if c <= a:
                    dp[a] = min(dp[a], dp[a - c] + 1)
        return dp[amount] if dp[amount] != INF else -1
`,

  "longest-increasing-subsequence": `
from bisect import bisect_left

class Solution:
    def lengthOfLIS(self, nums: list[int]) -> int:
        tails = []  # tails[k] = smallest tail of an increasing run of length k+1
        for x in nums:
            i = bisect_left(tails, x)
            if i == len(tails):
                tails.append(x)
            else:
                tails[i] = x
        return len(tails)
`,

  "unique-paths": `
class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        row = [1] * n  # first row: one path to each cell
        for _ in range(1, m):
            for c in range(1, n):
                row[c] += row[c - 1]  # from above (old value) + from the left
        return row[-1]
`,

  "partition-equal-subset-sum": `
class Solution:
    def canPartition(self, nums: list[int]) -> bool:
        total = sum(nums)
        if total % 2:
            return False
        target = total // 2
        can = [True] + [False] * target
        for x in nums:
            for s in range(target, x - 1, -1):  # high to low: use x once
                can[s] = can[s] or can[s - x]
        return can[target]
`,

  "decode-ways": `
class Solution:
    def numDecodings(self, s: str) -> int:
        n = len(s)
        dp = [0] * (n + 1)
        dp[0] = 1
        for i in range(1, n + 1):
            if s[i - 1] != "0":
                dp[i] += dp[i - 1]
            if i >= 2 and 10 <= int(s[i - 2:i]) <= 26:
                dp[i] += dp[i - 2]
        return dp[n]
`,

  "word-break": `
class Solution:
    def wordBreak(self, s: str, wordDict: list[str]) -> bool:
        words = set(wordDict)
        n = len(s)
        dp = [True] + [False] * n
        for i in range(1, n + 1):
            for j in range(i):
                if dp[j] and s[j:i] in words:
                    dp[i] = True
                    break
        return dp[n]
`,

  "edit-distance": `
class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        m, n = len(word1), len(word2)
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        for i in range(m + 1):
            dp[i][0] = i
        for j in range(n + 1):
            dp[0][j] = j
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if word1[i - 1] == word2[j - 1]:
                    dp[i][j] = dp[i - 1][j - 1]
                else:
                    dp[i][j] = 1 + min(
                        dp[i - 1][j - 1],  # replace
                        dp[i - 1][j],      # delete
                        dp[i][j - 1],      # insert
                    )
        return dp[m][n]
`,
});
