import { definePattern } from "../types";

export default definePattern({
  slug: "bit-manipulation",
  name: "Bit Manipulation",
  description:
    "XOR, shifts and masks do arithmetic in constant space — parity, ranges and toggles without branching.",
  order: 15,
  problems: [
    {
      slug: "single-number",
      title: "Single Number",
      difficulty: "EASY",
      leetcodeUrl: "https://leetcode.com/problems/single-number/",
      summary:
        "In `nums`, every value appears **twice** except one, which appears once. Return that one, in O(n) time and O(1) extra space.",
    },
    {
      slug: "power-of-two",
      title: "Power of Two",
      difficulty: "EASY",
      leetcodeUrl: "https://leetcode.com/problems/power-of-two/",
      summary:
        "Given an integer `n`, return `True` if it equals `2^x` for some integer `x >= 0`.",
    },
    {
      slug: "counting-bits",
      title: "Counting Bits",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/counting-bits/",
      summary:
        "Given `n`, return a list where position `i` holds the number of 1 bits in the binary form of `i`, for every `i` from `0` to `n`.",
    },
    {
      slug: "reverse-bits",
      title: "Reverse Bits",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/reverse-bits/",
      summary:
        "Reverse the bits of a 32-bit unsigned integer: bit 0 becomes bit 31, bit 1 becomes bit 30, and so on. Return the resulting number.",
    },
    {
      slug: "single-number-ii",
      title: "Single Number II",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/single-number-ii/",
      summary:
        "In `nums`, every value appears **three times** except one, which appears once. Return that one, in O(n) time and O(1) extra space.",
    },
    {
      slug: "bitwise-and-of-numbers-range",
      title: "Bitwise AND of Numbers Range",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/bitwise-and-of-numbers-range/",
      summary:
        "Given `left <= right`, return the bitwise AND of every integer in the range `[left, right]`, inclusive.",
    },
    {
      slug: "sum-of-two-integers",
      title: "Sum of Two Integers",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/sum-of-two-integers/",
      summary:
        "Return the sum of two integers `a` and `b` **without** using the `+` or `-` operators.",
    },
    {
      slug: "utf-8-validation",
      title: "UTF-8 Validation",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/utf-8-validation/",
      summary:
        "Each integer in `data` is one byte. Return `True` if the bytes form valid UTF-8: a 1-byte character starts `0xxxxxxx`; an n-byte character starts with n ones then a 0, followed by n − 1 bytes starting `10`.",
    },
    {
      slug: "xor-queries-of-a-subarray",
      title: "XOR Queries of a Subarray",
      difficulty: "MEDIUM",
      leetcodeUrl: "https://leetcode.com/problems/xor-queries-of-a-subarray/",
      summary:
        "Given an array `arr` and `queries[i] = [left, right]`, return for each query the XOR of `arr[left]` through `arr[right]`.",
    },
    {
      slug: "minimum-one-bit-operations-to-make-integers-zero",
      title: "Minimum One Bit Operations to Make Integers Zero",
      difficulty: "HARD",
      leetcodeUrl: "https://leetcode.com/problems/minimum-one-bit-operations-to-make-integers-zero/",
      summary:
        "Turn `n` into 0 using two operations: flip the lowest bit (bit 0), or flip bit `i` if bit `i - 1` is 1 and every bit below `i - 1` is 0. Return the minimum number of operations.",
    },
  ],
});
