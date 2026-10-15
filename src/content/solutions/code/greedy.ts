import { defineCode } from "../types";

export default defineCode({
  "assign-cookies": `
class Solution:
    def findContentChildren(self, g: list[int], s: list[int]) -> int:
        g.sort()
        s.sort()
        child = 0
        for cookie in s:
            if child < len(g) and cookie >= g[child]:
                child += 1  # smallest cookie that satisfies this child
        return child
`,

  "lemonade-change": `
class Solution:
    def lemonadeChange(self, bills: list[int]) -> bool:
        fives = tens = 0
        for bill in bills:
            if bill == 5:
                fives += 1
            elif bill == 10:
                if not fives:
                    return False
                fives -= 1
                tens += 1
            elif tens and fives:  # prefer $10 + $5, save the fives
                tens -= 1
                fives -= 1
            elif fives >= 3:
                fives -= 3
            else:
                return False
        return True
`,

  "jump-game": `
class Solution:
    def canJump(self, nums: list[int]) -> bool:
        furthest = 0
        for i, jump in enumerate(nums):
            if i > furthest:
                return False
            furthest = max(furthest, i + jump)
        return True
`,

  "jump-game-ii": `
class Solution:
    def jump(self, nums: list[int]) -> int:
        jumps = 0
        end = furthest = 0  # end of the range reachable with \`jumps\` jumps
        for i in range(len(nums) - 1):
            furthest = max(furthest, i + nums[i])
            if i == end:
                jumps += 1
                end = furthest
        return jumps
`,

  "gas-station": `
class Solution:
    def canCompleteCircuit(self, gas: list[int], cost: list[int]) -> int:
        if sum(gas) < sum(cost):
            return -1
        start = tank = 0
        for i in range(len(gas)):
            tank += gas[i] - cost[i]
            if tank < 0:
                start = i + 1
                tank = 0
        return start
`,

  "partition-labels": `
class Solution:
    def partitionLabels(self, s: str) -> list[int]:
        last = {c: i for i, c in enumerate(s)}
        sizes = []
        start = end = 0
        for i, c in enumerate(s):
            end = max(end, last[c])
            if i == end:
                sizes.append(end - start + 1)
                start = i + 1
        return sizes
`,

  "maximum-subarray": `
class Solution:
    def maxSubArray(self, nums: list[int]) -> int:
        best = current = nums[0]
        for x in nums[1:]:
            current = max(x, current + x)  # start fresh or extend
            best = max(best, current)
        return best
`,

  "hand-of-straights": `
from collections import Counter

class Solution:
    def isNStraightHand(self, hand: list[int], groupSize: int) -> bool:
        if len(hand) % groupSize:
            return False
        count = Counter(hand)
        for x in sorted(count):
            need = count[x]
            if need == 0:
                continue
            for card in range(x, x + groupSize):  # x starts \`need\` groups
                if count[card] < need:
                    return False
                count[card] -= need
        return True
`,

  "minimum-number-of-arrows-to-burst-balloons": `
class Solution:
    def findMinArrowShots(self, points: list[list[int]]) -> int:
        points.sort(key=lambda p: p[1])
        arrows = 0
        arrow = float("-inf")
        for start, end in points:
            if start > arrow:  # not burst by the last arrow
                arrows += 1
                arrow = end
        return arrows
`,

  "candy": `
class Solution:
    def candy(self, ratings: list[int]) -> int:
        n = len(ratings)
        candies = [1] * n
        for i in range(1, n):
            if ratings[i] > ratings[i - 1]:
                candies[i] = candies[i - 1] + 1
        for i in range(n - 2, -1, -1):
            if ratings[i] > ratings[i + 1]:
                candies[i] = max(candies[i], candies[i + 1] + 1)
        return sum(candies)
`,
});
