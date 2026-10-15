import { defineCode } from "../types";

export default defineCode({
  "single-number": `
class Solution:
    def singleNumber(self, nums: list[int]) -> int:
        res = 0
        for x in nums:
            res ^= x
        return res
`,

  "power-of-two": `
class Solution:
    def isPowerOfTwo(self, n: int) -> bool:
        return n > 0 and n & (n - 1) == 0
`,

  "counting-bits": `
class Solution:
    def countBits(self, n: int) -> list[int]:
        bits = [0] * (n + 1)
        for i in range(1, n + 1):
            bits[i] = bits[i >> 1] + (i & 1)
        return bits
`,

  "reverse-bits": `
class Solution:
    def reverseBits(self, n: int) -> int:
        res = 0
        for _ in range(32):
            res = (res << 1) | (n & 1)
            n >>= 1
        return res
`,

  "single-number-ii": `
class Solution:
    def singleNumber(self, nums: list[int]) -> int:
        res = 0
        for bit in range(32):
            count = sum((x >> bit) & 1 for x in nums)
            if count % 3:
                res |= 1 << bit
        # Python ints are unbounded: reinterpret bit 31 as the sign
        return res - (1 << 32) if res >= 1 << 31 else res
`,

  "bitwise-and-of-numbers-range": `
class Solution:
    def rangeBitwiseAnd(self, left: int, right: int) -> int:
        shift = 0
        while left != right:  # strip bits until only the common prefix is left
            left >>= 1
            right >>= 1
            shift += 1
        return left << shift
`,

  "sum-of-two-integers": `
class Solution:
    def getSum(self, a: int, b: int) -> int:
        MASK = 0xFFFFFFFF  # emulate 32-bit ints
        while b & MASK:
            a, b = a ^ b, (a & b) << 1
        a &= MASK
        return a if a <= 0x7FFFFFFF else ~(a ^ MASK)
`,

  "utf-8-validation": `
class Solution:
    def validUtf8(self, data: list[int]) -> bool:
        pending = 0  # continuation bytes still expected
        for byte in data:
            if pending:
                if byte >> 6 != 0b10:
                    return False
                pending -= 1
            elif byte >> 7 == 0:
                pending = 0
            elif byte >> 5 == 0b110:
                pending = 1
            elif byte >> 4 == 0b1110:
                pending = 2
            elif byte >> 3 == 0b11110:
                pending = 3
            else:
                return False
        return pending == 0
`,

  "xor-queries-of-a-subarray": `
class Solution:
    def xorQueries(self, arr: list[int], queries: list[list[int]]) -> list[int]:
        prefix = [0]
        for x in arr:
            prefix.append(prefix[-1] ^ x)
        return [prefix[r + 1] ^ prefix[l] for l, r in queries]
`,

  "minimum-one-bit-operations-to-make-integers-zero": `
class Solution:
    def minimumOneBitOperations(self, n: int) -> int:
        res = 0
        while n:  # inverse Gray code: n ^ (n >> 1) ^ (n >> 2) ^ ...
            res ^= n
            n >>= 1
        return res
`,
});
