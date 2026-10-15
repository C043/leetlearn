import { defineCode } from "../types";

export default defineCode({
  "single-number": `
class Solution:
    def singleNumber(self, nums: list[int]) -> int:
        # XOR of everything seen so far
        result = 0
        # x ^ x = 0, so every pair cancels and only the single number is left
        for number in nums:
            result ^= number
        # Only the number without a partner survives
        return result
`,

  "power-of-two": `
class Solution:
    def isPowerOfTwo(self, n: int) -> bool:
        # A power of two has exactly one 1 bit, and n & (n - 1) clears the lowest 1 bit
        return n > 0 and n & (n - 1) == 0
`,

  "counting-bits": `
class Solution:
    def countBits(self, n: int) -> list[int]:
        # bits[number] = how many 1 bits number has; 0 has none
        bits = [0] * (n + 1)
        # Fill in the counts from 1 to n
        for number in range(1, n + 1):
            # number >> 1 drops the last bit (already counted), number & 1 is that last bit
            bits[number] = bits[number >> 1] + (number & 1)
        # Counts for every number from 0 to n
        return bits
`,

  "reverse-bits": `
class Solution:
    def reverseBits(self, n: int) -> int:
        # The reversed number, built one bit at a time
        result = 0
        # Process all 32 bits
        for _ in range(32):
            # Shift result left and append n's lowest bit
            result = (result << 1) | (n & 1)
            # Drop the bit we just used
            n >>= 1
        # All 32 bits reversed
        return result
`,

  "single-number-ii": `
class Solution:
    def singleNumber(self, nums: list[int]) -> int:
        # The single number, built bit by bit
        result = 0
        # Look at each of the 32 bit positions separately
        for bit in range(32):
            # How many numbers have this bit set
            count = sum((number >> bit) & 1 for number in nums)
            # Numbers appearing three times add a multiple of 3; any leftover is the single number
            if count % 3:
                result |= 1 << bit
        # Python ints are unbounded: reinterpret bit 31 as the sign
        return result - (1 << 32) if result >= 1 << 31 else result
`,

  "bitwise-and-of-numbers-range": `
class Solution:
    def rangeBitwiseAnd(self, left: int, right: int) -> int:
        # How many low bits were removed
        shift = 0
        # Strip bits until only the common prefix is left
        while left != right:
            left >>= 1
            right >>= 1
            shift += 1
        # Put the common prefix back in place, with zeros below it
        return left << shift
`,

  "sum-of-two-integers": `
class Solution:
    def getSum(self, a: int, b: int) -> int:
        # Keep only 32 bits to behave like fixed-size integers
        MASK = 0xFFFFFFFF
        # Repeat while there is still a carry to add
        while b & MASK:
            # XOR adds without carrying; AND shifted left is the carry
            a, b = a ^ b, (a & b) << 1
        # Trim the result to 32 bits
        a &= MASK
        # Values above the largest positive 32-bit int are negative numbers
        return a if a <= 0x7FFFFFFF else ~(a ^ MASK)
`,

  "utf-8-validation": `
class Solution:
    def validUtf8(self, data: list[int]) -> bool:
        # Continuation bytes still expected for the current character
        pending = 0
        # Read the bytes in order
        for byte in data:
            # In the middle of a character: this must be a continuation byte (10xxxxxx)
            if pending:
                # Wrong prefix: the character is broken
                if byte >> 6 != 0b10:
                    return False
                # One fewer continuation byte to wait for
                pending -= 1
            # 0xxxxxxx: a one-byte character
            elif byte >> 7 == 0:
                pending = 0
            # 110xxxxx: a two-byte character, one more byte to come
            elif byte >> 5 == 0b110:
                pending = 1
            # 1110xxxx: a three-byte character, two more bytes to come
            elif byte >> 4 == 0b1110:
                pending = 2
            # 11110xxx: a four-byte character, three more bytes to come
            elif byte >> 3 == 0b11110:
                pending = 3
            # Anything else is not a valid first byte
            else:
                return False
        # Valid only if the last character was completed
        return pending == 0
`,

  "xor-queries-of-a-subarray": `
class Solution:
    def xorQueries(self, arr: list[int], queries: list[list[int]]) -> list[int]:
        # prefix[index] = XOR of the first index values
        prefix = [0]
        # Build the prefix XORs
        for number in arr:
            prefix.append(prefix[-1] ^ number)
        # XOR of arr[start..end] = prefix[end + 1] ^ prefix[start]; the shared part cancels
        return [prefix[end + 1] ^ prefix[start] for start, end in queries]
`,

  "minimum-one-bit-operations-to-make-integers-zero": `
class Solution:
    def minimumOneBitOperations(self, n: int) -> int:
        # The answer is the inverse Gray code: n ^ (n >> 1) ^ (n >> 2) ^ ...
        result = 0
        # Keep going while bits remain
        while n:
            # Fold in the current shifted copy
            result ^= n
            # Shift one more place
            n >>= 1
        # Minimum number of operations
        return result
`,
});
