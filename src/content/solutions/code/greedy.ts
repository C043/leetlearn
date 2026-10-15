import { defineCode } from "../types";

export default defineCode({
  "assign-cookies": `
class Solution:
    def findContentChildren(self, g: list[int], s: list[int]) -> int:
        # Sort the children's greed and the cookie sizes
        g.sort()
        s.sort()
        # Index of the least greedy child not yet satisfied (also the count satisfied)
        child = 0
        # Hand out cookies from smallest to largest
        for cookie in s:
            # This is the smallest cookie that satisfies this child, so give it
            if child < len(g) and cookie >= g[child]:
                child += 1
        # Number of satisfied children
        return child
`,

  "lemonade-change": `
class Solution:
    def lemonadeChange(self, bills: list[int]) -> bool:
        # $5 and $10 bills in the till
        fives = tens = 0
        # Serve customers in order
        for bill in bills:
            # A $5 needs no change
            if bill == 5:
                fives += 1
            # A $10 needs one $5 back
            elif bill == 10:
                # No $5 to give back
                if not fives:
                    return False
                # Give a $5 back and keep the $10
                fives -= 1
                tens += 1
            # A $20 needs $15 back: prefer $10 + $5, save the fives
            elif tens and fives:
                tens -= 1
                fives -= 1
            # Otherwise give three $5 bills
            elif fives >= 3:
                fives -= 3
            # Not enough change
            else:
                return False
        # Everyone got correct change
        return True
`,

  "jump-game": `
class Solution:
    def canJump(self, nums: list[int]) -> bool:
        # Furthest index reachable so far
        furthest = 0
        # Visit indices in order
        for index, jump in enumerate(nums):
            # This index cannot be reached, so neither can the end
            if index > furthest:
                return False
            # Jumping from here may reach further
            furthest = max(furthest, index + jump)
        # Every index was reachable
        return True
`,

  "jump-game-ii": `
class Solution:
    def jump(self, nums: list[int]) -> int:
        # Jumps taken so far
        jumps = 0
        # end of the range reachable with the current number of jumps, and the furthest reach overall
        end = furthest = 0
        # No need to jump from the last index
        for index in range(len(nums) - 1):
            # Best reach using one more jump from anywhere in the current range
            furthest = max(furthest, index + nums[index])
            # At the edge of the current range: one more jump is needed
            if index == end:
                jumps += 1
                # The new range goes as far as possible
                end = furthest
        # Fewest jumps to reach the last index
        return jumps
`,

  "gas-station": `
class Solution:
    def canCompleteCircuit(self, gas: list[int], cost: list[int]) -> int:
        # Not enough gas in total means no start works
        if sum(gas) < sum(cost):
            return -1
        # Candidate start, and gas in the tank since that start
        start = tank = 0
        # Drive around once
        for station in range(len(gas)):
            # Fill up here, then pay for the drive to the next station
            tank += gas[station] - cost[station]
            # Ran dry: no station from start to here can be the start
            if tank < 0:
                start = station + 1
                tank = 0
        # The total is enough, so the last candidate works
        return start
`,

  "partition-labels": `
class Solution:
    def partitionLabels(self, s: str) -> list[int]:
        # Last index where each letter appears
        last = {letter: index for index, letter in enumerate(s)}
        # Sizes of the parts
        sizes = []
        # Start and furthest required end of the current part
        start = end = 0
        # Walk through the string
        for index, letter in enumerate(s):
            # The part must reach at least the last copy of this letter
            end = max(end, last[letter])
            # Reached the end: no letter in this part appears later
            if index == end:
                sizes.append(end - start + 1)
                # The next part starts right after
                start = index + 1
        # Sizes of all parts in order
        return sizes
`,

  "maximum-subarray": `
class Solution:
    def maxSubArray(self, nums: list[int]) -> int:
        # Best sum overall, and best sum of a subarray ending here
        best = current = nums[0]
        # Look at the rest of the numbers
        for number in nums[1:]:
            # Start fresh or extend
            current = max(number, current + number)
            # Keep the best seen
            best = max(best, current)
        # Largest subarray sum
        return best
`,

  "hand-of-straights": `
from collections import Counter

class Solution:
    def isNStraightHand(self, hand: list[int], groupSize: int) -> bool:
        # Cards must split evenly into groups
        if len(hand) % groupSize:
            return False
        # How many of each card value are left
        count = Counter(hand)
        # The smallest remaining card must start a group, so go from small to large
        for value in sorted(count):
            # Groups that must start with this value
            need = count[value]
            # All copies already used by earlier groups
            if need == 0:
                continue
            # The value starts need groups, each using the next groupSize values
            for card in range(value, value + groupSize):
                # Not enough of this card to complete the groups
                if count[card] < need:
                    return False
                # Use the cards
                count[card] -= need
        # Every card was placed in a group
        return True
`,

  "minimum-number-of-arrows-to-burst-balloons": `
class Solution:
    def findMinArrowShots(self, points: list[list[int]]) -> int:
        # Sort balloons by where they end
        points.sort(key=lambda point: point[1])
        # Arrows used
        arrows = 0
        # Position of the last arrow shot
        arrow = float("-inf")
        # Visit balloons in order of their end
        for start, end in points:
            # Not burst by the last arrow
            if start > arrow:
                arrows += 1
                # Shoot at its end to hit as many later balloons as possible
                arrow = end
        # Fewest arrows needed
        return arrows
`,

  "candy": `
class Solution:
    def candy(self, ratings: list[int]) -> int:
        # Number of children
        child_count = len(ratings)
        # Everyone gets at least one candy
        candies = [1] * child_count
        # Left to right: a higher rating than the left neighbor needs more candy
        for child in range(1, child_count):
            if ratings[child] > ratings[child - 1]:
                # One more than the left neighbor
                candies[child] = candies[child - 1] + 1
        # Right to left: a higher rating than the right neighbor needs more too
        for child in range(child_count - 2, -1, -1):
            if ratings[child] > ratings[child + 1]:
                # Keep the larger amount so both rules hold
                candies[child] = max(candies[child], candies[child + 1] + 1)
        # Total candy handed out
        return sum(candies)
`,
});
