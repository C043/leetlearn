import { definePattern } from "../types";

export default definePattern({
  slug: "bit-manipulation",
  name: "Bit Manipulation",
  description:
    "XOR, shifts and masks do arithmetic in constant space — parity, ranges and toggles without branching.",
  order: 15,
  problems: [
    { slug: "single-number", title: "Single Number", difficulty: "EASY", leetcodeUrl: "https://leetcode.com/problems/single-number/" },
    { slug: "power-of-two", title: "Power of Two", difficulty: "EASY", leetcodeUrl: "https://leetcode.com/problems/power-of-two/" },
    { slug: "counting-bits", title: "Counting Bits", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/counting-bits/" },
    { slug: "reverse-bits", title: "Reverse Bits", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/reverse-bits/" },
    { slug: "single-number-ii", title: "Single Number II", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/single-number-ii/" },
    { slug: "bitwise-and-of-numbers-range", title: "Bitwise AND of Numbers Range", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/bitwise-and-of-numbers-range/" },
    { slug: "sum-of-two-integers", title: "Sum of Two Integers", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/sum-of-two-integers/" },
    { slug: "utf-8-validation", title: "UTF-8 Validation", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/utf-8-validation/" },
    { slug: "xor-queries-of-a-subarray", title: "XOR Queries of a Subarray", difficulty: "MEDIUM", leetcodeUrl: "https://leetcode.com/problems/xor-queries-of-a-subarray/" },
    { slug: "minimum-one-bit-operations-to-make-integers-zero", title: "Minimum One Bit Operations to Make Integers Zero", difficulty: "HARD", leetcodeUrl: "https://leetcode.com/problems/minimum-one-bit-operations-to-make-integers-zero/" },
  ],
});
