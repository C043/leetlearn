import { defineCode } from "../types";

export default defineCode({
  "valid-parentheses": `
class Solution:
    def isValid(self, s: str) -> bool:
        pairs = {")": "(", "]": "[", "}": "{"}
        stack = []
        for c in s:
            if c in pairs:
                if not stack or stack.pop() != pairs[c]:
                    return False
            else:
                stack.append(c)
        return not stack
`,

  "implement-queue-using-stacks": `
class MyQueue:
    def __init__(self):
        self.inbox = []
        self.outbox = []

    def push(self, x: int) -> None:
        self.inbox.append(x)

    def pop(self) -> int:
        self.peek()
        return self.outbox.pop()

    def peek(self) -> int:
        if not self.outbox:
            while self.inbox:
                self.outbox.append(self.inbox.pop())
        return self.outbox[-1]

    def empty(self) -> bool:
        return not self.inbox and not self.outbox
`,

  "daily-temperatures": `
class Solution:
    def dailyTemperatures(self, temperatures: list[int]) -> list[int]:
        res = [0] * len(temperatures)
        stack = []  # indices waiting for a warmer day
        for i, t in enumerate(temperatures):
            while stack and temperatures[stack[-1]] < t:
                j = stack.pop()
                res[j] = i - j
            stack.append(i)
        return res
`,

  "next-greater-element-ii": `
class Solution:
    def nextGreaterElements(self, nums: list[int]) -> list[int]:
        n = len(nums)
        res = [-1] * n
        stack = []
        for i in range(2 * n):
            x = nums[i % n]
            while stack and nums[stack[-1]] < x:
                res[stack.pop()] = x
            if i < n:
                stack.append(i)
        return res
`,

  "asteroid-collision": `
class Solution:
    def asteroidCollision(self, asteroids: list[int]) -> list[int]:
        stack = []
        for a in asteroids:
            alive = True
            while alive and a < 0 and stack and stack[-1] > 0:
                if stack[-1] < -a:
                    stack.pop()        # top explodes, keep going
                elif stack[-1] == -a:
                    stack.pop()        # both explode
                    alive = False
                else:
                    alive = False      # incoming explodes
            if alive:
                stack.append(a)
        return stack
`,

  "online-stock-span": `
class StockSpanner:
    def __init__(self):
        self.stack = []  # (price, span), prices strictly decreasing

    def next(self, price: int) -> int:
        span = 1
        while self.stack and self.stack[-1][0] <= price:
            span += self.stack.pop()[1]
        self.stack.append((price, span))
        return span
`,

  "decode-string": `
class Solution:
    def decodeString(self, s: str) -> str:
        stack = []
        current, count = "", 0
        for c in s:
            if c.isdigit():
                count = count * 10 + int(c)
            elif c == "[":
                stack.append((current, count))
                current, count = "", 0
            elif c == "]":
                prev, repeat = stack.pop()
                current = prev + current * repeat
            else:
                current += c
        return current
`,

  "remove-k-digits": `
class Solution:
    def removeKdigits(self, num: str, k: int) -> str:
        stack = []
        for d in num:
            while k and stack and stack[-1] > d:
                stack.pop()
                k -= 1
            stack.append(d)
        if k:
            stack = stack[:-k]  # still have removals: drop from the end
        return "".join(stack).lstrip("0") or "0"
`,

  "sum-of-subarray-minimums": `
class Solution:
    def sumSubarrayMins(self, arr: list[int]) -> int:
        MOD = 10**9 + 7
        n = len(arr)
        left = [0] * n   # distance to previous strictly smaller
        right = [0] * n  # distance to next smaller-or-equal
        stack = []
        for i in range(n):
            while stack and arr[stack[-1]] >= arr[i]:
                stack.pop()
            left[i] = i - stack[-1] if stack else i + 1
            stack.append(i)
        stack = []
        for i in range(n - 1, -1, -1):
            while stack and arr[stack[-1]] > arr[i]:
                stack.pop()
            right[i] = stack[-1] - i if stack else n - i
            stack.append(i)
        return sum(arr[i] * left[i] * right[i] for i in range(n)) % MOD
`,

  "largest-rectangle-in-histogram": `
class Solution:
    def largestRectangleArea(self, heights: list[int]) -> int:
        stack = []  # indices of increasing heights
        best = 0
        for i, h in enumerate(heights + [0]):  # trailing 0 flushes the stack
            while stack and heights[stack[-1]] >= h:
                height = heights[stack.pop()]
                left = stack[-1] if stack else -1
                best = max(best, height * (i - left - 1))
            stack.append(i)
        return best
`,
});
