import { defineCode } from "../types";

export default defineCode({
  "climbing-stairs": `
class Solution:
    def climbStairs(self, n: int) -> int:
        # Ways to reach step 0 and step 1: one each
        previous, current = 1, 1
        # Each step can be reached from one or two steps below
        for _ in range(n - 1):
            # ways(next) = ways(current) + ways(previous); slide the window forward
            previous, current = current, previous + current
        # Ways to reach step n
        return current
`,

  "min-cost-climbing-stairs": `
class Solution:
    def minCostClimbingStairs(self, cost: list[int]) -> int:
        # Number of steps
        step_count = len(cost)
        # cheapest[step] = cheapest cost to stand on step; steps 0 and 1 are free starting points
        cheapest = [0] * (step_count + 1)
        # Work out the cost of every step up to the top
        for step in range(2, step_count + 1):
            # Arrive from one step below or two steps below, paying for the step you leave
            cheapest[step] = min(cheapest[step - 1] + cost[step - 1], cheapest[step - 2] + cost[step - 2])
        # The top is one past the last step
        return cheapest[step_count]
`,

  "house-robber": `
class Solution:
    def rob(self, nums: list[int]) -> int:
        # Best total up to two houses back, and up to the previous house
        two_back, one_back = 0, 0
        # Decide for each house in turn
        for money in nums:
            # Either skip this house (keep one_back) or rob it (two_back + money)
            two_back, one_back = one_back, max(one_back, two_back + money)
        # Best total over all houses
        return one_back
`,

  "coin-change": `
class Solution:
    def coinChange(self, coins: list[int], amount: int) -> int:
        # More coins than could ever be needed, used as "impossible"
        IMPOSSIBLE = amount + 1
        # fewest[value] = fewest coins that make value; 0 needs no coins
        fewest = [0] + [IMPOSSIBLE] * amount
        # Solve every value from 1 up to amount
        for value in range(1, amount + 1):
            # Try ending with each coin
            for coin in coins:
                # Only coins that are not bigger than the value can be used
                if coin <= value:
                    # One coin plus the best way to make what is left
                    fewest[value] = min(fewest[value], fewest[value - coin] + 1)
        # Still impossible means the amount cannot be made
        return fewest[amount] if fewest[amount] != IMPOSSIBLE else -1
`,

  "longest-increasing-subsequence": `
from bisect import bisect_left

class Solution:
    def lengthOfLIS(self, nums: list[int]) -> int:
        # tails[length] = smallest last value of an increasing run of length + 1
        tails = []
        # Process each number in order
        for number in nums:
            # First tail that is >= number
            position = bisect_left(tails, number)
            # Bigger than every tail: it extends the longest run
            if position == len(tails):
                tails.append(number)
            # Otherwise it gives a smaller tail for a run of that length
            else:
                tails[position] = number
        # The number of tails is the length of the longest run
        return len(tails)
`,

  "unique-paths": `
class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        # First row: exactly one path to each cell (keep moving right)
        row = [1] * n
        # Build each next row from the previous one
        for _ in range(1, m):
            # The first column always has one path (keep moving down)
            for column in range(1, n):
                # Paths from above (the old value) plus paths from the left
                row[column] += row[column - 1]
        # Paths to the bottom-right corner
        return row[-1]
`,

  "partition-equal-subset-sum": `
class Solution:
    def canPartition(self, nums: list[int]) -> bool:
        # Sum of all numbers
        total = sum(nums)
        # An odd total cannot be split into two equal halves
        if total % 2:
            return False
        # Each half must add up to this
        target = total // 2
        # reachable[value] = some subset adds up to value; the empty subset makes 0
        reachable = [True] + [False] * target
        # Add numbers one at a time
        for number in nums:
            # Go from high to low so each number is used at most once
            for value in range(target, number - 1, -1):
                # value is reachable already, or by adding number to a reachable value
                reachable[value] = reachable[value] or reachable[value - number]
        # Can a subset make exactly half?
        return reachable[target]
`,

  "decode-ways": `
class Solution:
    def numDecodings(self, s: str) -> int:
        # Length of the string
        length = len(s)
        # ways[count] = number of ways to decode the first count characters
        ways = [0] * (length + 1)
        # The empty prefix has one way to decode: do nothing
        ways[0] = 1
        # Extend the prefix one character at a time
        for count in range(1, length + 1):
            # The last character alone is a letter if it is not "0"
            if s[count - 1] != "0":
                ways[count] += ways[count - 1]
            # The last two characters together form a letter if they are 10 to 26
            if count >= 2 and 10 <= int(s[count - 2:count]) <= 26:
                ways[count] += ways[count - 2]
        # Ways to decode the whole string
        return ways[length]
`,

  "word-break": `
class Solution:
    def wordBreak(self, s: str, wordDict: list[str]) -> bool:
        # A set makes word lookups fast
        words = set(wordDict)
        # Length of the string
        length = len(s)
        # can_split[end] = the first end characters can be split into words
        can_split = [True] + [False] * length
        # Check each prefix length
        for end in range(1, length + 1):
            # Try every place where the last word could start
            for start in range(end):
                # The part before start splits, and s[start:end] is a word
                if can_split[start] and s[start:end] in words:
                    can_split[end] = True
                    break
        # Can the whole string be split?
        return can_split[length]
`,

  "edit-distance": `
class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        # Lengths of both words
        length1, length2 = len(word1), len(word2)
        # distance[first][second] = edits to turn word1[:first] into word2[:second]
        distance = [[0] * (length2 + 1) for _ in range(length1 + 1)]
        # Turning a prefix into the empty string takes one delete per character
        for first in range(length1 + 1):
            distance[first][0] = first
        # Turning the empty string into a prefix takes one insert per character
        for second in range(length2 + 1):
            distance[0][second] = second
        # Fill the rest of the table
        for first in range(1, length1 + 1):
            for second in range(1, length2 + 1):
                # Last characters match: no edit needed for them
                if word1[first - 1] == word2[second - 1]:
                    distance[first][second] = distance[first - 1][second - 1]
                # Otherwise take the cheapest of the three edits
                else:
                    distance[first][second] = 1 + min(
                        distance[first - 1][second - 1],  # replace
                        distance[first - 1][second],      # delete
                        distance[first][second - 1],      # insert
                    )
        # Edits to turn all of word1 into all of word2
        return distance[length1][length2]
`,
});
