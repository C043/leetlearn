import { defineCode } from "../types";

export default defineCode({
  "valid-parentheses": `
class Solution:
    def isValid(self, s: str) -> bool:
        # Each closing bracket and the opening bracket it needs
        pairs = {")": "(", "]": "[", "}": "{"}
        # Opening brackets still waiting to be closed
        stack = []
        # Read the brackets in order
        for character in s:
            # A closing bracket must match the most recent opening one
            if character in pairs:
                if not stack or stack.pop() != pairs[character]:
                    # Nothing to match, or the wrong kind of bracket
                    return False
            # An opening bracket waits on the stack
            else:
                stack.append(character)
        # Valid only if every opening bracket was closed
        return not stack
`,

  "implement-queue-using-stacks": `
class MyQueue:
    def __init__(self):
        # New elements are pushed here
        self.inbox = []
        # Elements are taken from here, oldest on top
        self.outbox = []

    def push(self, x: int) -> None:
        # Always push onto the inbox
        self.inbox.append(x)

    def pop(self) -> int:
        # Make sure the oldest element is on top of the outbox
        self.peek()
        # Remove it
        return self.outbox.pop()

    def peek(self) -> int:
        # Refill the outbox only when it is empty
        if not self.outbox:
            # Moving everything over reverses the order, so the oldest ends on top
            while self.inbox:
                self.outbox.append(self.inbox.pop())
        # The oldest element
        return self.outbox[-1]

    def empty(self) -> bool:
        # Empty only if both stacks are empty
        return not self.inbox and not self.outbox
`,

  "daily-temperatures": `
class Solution:
    def dailyTemperatures(self, temperatures: list[int]) -> list[int]:
        # Days to wait for each day; 0 if no warmer day comes
        result = [0] * len(temperatures)
        # Indices waiting for a warmer day
        stack = []
        # Go through the days in order
        for day, temperature in enumerate(temperatures):
            # Today is warmer than the days on top of the stack: their wait is over
            while stack and temperatures[stack[-1]] < temperature:
                waiting_day = stack.pop()
                result[waiting_day] = day - waiting_day
            # Today waits for its own warmer day
            stack.append(day)
        # Days left on the stack never got warmer, so they stay 0
        return result
`,

  "next-greater-element-ii": `
class Solution:
    def nextGreaterElements(self, nums: list[int]) -> list[int]:
        # Length of the array
        length = len(nums)
        # Next greater value for each index; -1 if none
        result = [-1] * length
        # Indices still waiting for a greater value
        stack = []
        # Go around twice to handle the circular wrap
        for step in range(2 * length):
            # The value at this position in the circle
            number = nums[step % length]
            # It is the next greater value for every smaller value waiting
            while stack and nums[stack[-1]] < number:
                result[stack.pop()] = number
            # Only push indices during the first pass
            if step < length:
                stack.append(step)
        # Next greater value for every index
        return result
`,

  "asteroid-collision": `
class Solution:
    def asteroidCollision(self, asteroids: list[int]) -> list[int]:
        # Asteroids that survived so far, left to right
        stack = []
        # Each asteroid in order
        for asteroid in asteroids:
            # Whether this asteroid is still intact
            alive = True
            # A left-moving asteroid hits right-moving ones on the stack
            while alive and asteroid < 0 and stack and stack[-1] > 0:
                # Top explodes, keep going
                if stack[-1] < -asteroid:
                    stack.pop()
                # Same size: both explode
                elif stack[-1] == -asteroid:
                    stack.pop()
                    alive = False
                # Incoming explodes
                else:
                    alive = False
            # Survivors join the stack
            if alive:
                stack.append(asteroid)
        # The asteroids left after all collisions
        return stack
`,

  "online-stock-span": `
class StockSpanner:
    def __init__(self):
        # (price, span), prices strictly decreasing
        self.stack = []

    def next(self, price: int) -> int:
        # Today counts as one day
        span = 1
        # Absorb the spans of earlier prices that are not higher than today's
        while self.stack and self.stack[-1][0] <= price:
            span += self.stack.pop()[1]
        # Today's price now stands for all the days it absorbed
        self.stack.append((price, span))
        return span
`,

  "decode-string": `
class Solution:
    def decodeString(self, s: str) -> str:
        # Saved (text before the bracket, repeat count) for each open bracket
        stack = []
        # The text being built, and the number being read
        current, count = "", 0
        # Read the input one character at a time
        for character in s:
            # A digit: the count may have several digits
            if character.isdigit():
                count = count * 10 + int(character)
            # An opening bracket: save what we have and start fresh inside
            elif character == "[":
                stack.append((current, count))
                current, count = "", 0
            # A closing bracket: repeat the inside and attach it to what came before
            elif character == "]":
                before, repeat = stack.pop()
                current = before + current * repeat
            # A letter: just add it
            else:
                current += character
        # The fully decoded string
        return current
`,

  "remove-k-digits": `
class Solution:
    def removeKdigits(self, num: str, k: int) -> str:
        # Digits kept so far
        stack = []
        # Read digits left to right
        for digit in num:
            # A smaller digit should replace bigger ones before it, while removals remain
            while k and stack and stack[-1] > digit:
                stack.pop()
                k -= 1
            # Keep this digit
            stack.append(digit)
        # Still have removals: drop from the end
        if k:
            stack = stack[:-k]
        # Remove leading zeros; an empty result means "0"
        return "".join(stack).lstrip("0") or "0"
`,

  "sum-of-subarray-minimums": `
class Solution:
    def sumSubarrayMins(self, arr: list[int]) -> int:
        # The answer is reported modulo this value
        MODULO = 10**9 + 7
        # Length of the array
        length = len(arr)
        # Distance to previous strictly smaller
        left = [0] * length
        # Distance to next smaller-or-equal
        right = [0] * length
        # Indices of increasing values
        stack = []
        # Left to right: find the previous strictly smaller value
        for index in range(length):
            # Pop values that are not smaller
            while stack and arr[stack[-1]] >= arr[index]:
                stack.pop()
            # Distance to it, or to the start if there is none
            left[index] = index - stack[-1] if stack else index + 1
            stack.append(index)
        # Reset for the second pass
        stack = []
        # Right to left: find the next smaller-or-equal value
        for index in range(length - 1, -1, -1):
            # Pop values that are strictly bigger
            while stack and arr[stack[-1]] > arr[index]:
                stack.pop()
            # Distance to it, or to the end if there is none
            right[index] = stack[-1] - index if stack else length - index
            stack.append(index)
        # Each value is the minimum of left * right subarrays
        return sum(arr[index] * left[index] * right[index] for index in range(length)) % MODULO
`,

  "largest-rectangle-in-histogram": `
class Solution:
    def largestRectangleArea(self, heights: list[int]) -> int:
        # Indices of increasing heights
        stack = []
        # Largest area found
        best = 0
        # Trailing 0 flushes the stack
        for index, bar in enumerate(heights + [0]):
            # A lower bar ends the rectangles of every taller bar on the stack
            while stack and heights[stack[-1]] >= bar:
                # The height of the rectangle that ends here
                height = heights[stack.pop()]
                # It extends left until the bar below it on the stack
                left = stack[-1] if stack else -1
                # Width runs between left and the current index
                best = max(best, height * (index - left - 1))
            # This bar may start a taller rectangle later
            stack.append(index)
        # Largest rectangle area
        return best
`,
});
