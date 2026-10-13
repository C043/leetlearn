import { defineSolutions } from "./types";

export default defineSolutions({
  "single-number": {
    idea: "XOR has `x ^ x = 0` and `x ^ 0 = x`, and it's order-independent. XOR everything: the pairs cancel and only the single number remains.",
    steps: [
      {
        text: "`[4,1,2,1,2]` in binary:",
        visual: {
          kind: "grid",
          rowLabels: ["4", "1", "2", "1", "2", "XOR"],
          rows: [[1, 0, 0], [0, 0, 1], [0, 1, 0], [0, 0, 1], [0, 1, 0], [1, 0, 0]],
          tones: { good: [[5, 0], [5, 1], [5, 2]] },
          caption: "Each column XORs to the parity of its ones, which gives 100₂ = 4",
        },
      },
    ],
    time: "O(n)",
    space: "O(1)",
  },

  "power-of-two": {
    idea: "A power of two has **exactly one** set bit. `n - 1` flips that bit and sets every bit below it, so `n & (n - 1) == 0` exactly for powers of two (with `n > 0`).",
    steps: [
      {
        text: "`n = 8`:",
        visual: {
          kind: "grid",
          rowLabels: ["8", "7", "8 & 7"],
          rows: [[1, 0, 0, 0], [0, 1, 1, 1], [0, 0, 0, 0]],
          tones: { good: [[2, 0], [2, 1], [2, 2], [2, 3]] },
        },
      },
      { text: "Check `n > 0` first: 0 and negatives are never powers of two." },
    ],
    time: "O(1)",
    space: "O(1)",
  },

  "counting-bits": {
    idea: "`i >> 1` is `i` without its last bit, and we've already computed it. So `bits[i] = bits[i >> 1] + (i & 1)`.",
    steps: [
      {
        text: "`n = 5`:",
        visual: {
          kind: "grid",
          colLabels: ["0", "1", "2", "3", "4", "5"],
          rowLabels: ["binary", "bits"],
          rows: [["0", "1", "10", "11", "100", "101"], [0, 1, 1, 2, 1, 2]],
          tones: { accent: [[1, 2]], good: [[1, 5]] },
          caption: "bits[5] = bits[2] + 1 = 2",
        },
      },
      { text: "Alternative: `bits[i] = bits[i & (i - 1)] + 1` (drop the lowest set bit)." },
    ],
    time: "O(n)",
    space: "O(n) for the output",
  },

  "reverse-bits": {
    idea: "Pop bits off the right of `n` and push them onto the right of the result, 32 times. The first bit popped ends up as the most significant.",
    steps: [
      {
        text: "Each step: `res = (res << 1) | (n & 1)`, then `n >>= 1`. Shown with 8 bits for readability:",
        visual: {
          kind: "grid",
          rowLabels: ["n", "reversed"],
          rows: [[0, 0, 0, 1, 0, 1, 1, 0], [0, 1, 1, 0, 1, 0, 0, 0]],
          tones: { accent: [[0, 7], [1, 0]] },
          caption: "The last bit of n becomes the first bit of the result",
        },
      },
      { text: "Use an unsigned shift (`>>>` in Java/JS) so the sign bit isn't copied." },
    ],
    time: "O(32)",
    space: "O(1)",
  },

  "single-number-ii": {
    idea: "Every number except one appears **three** times. Count the set bits in each of the 32 positions: the tripled numbers contribute multiples of 3, so `count % 3` per bit leaves exactly the single number's bits.",
    steps: [
      {
        text: "`[2,2,3,2]`:",
        visual: {
          kind: "grid",
          rowLabels: ["2", "2", "3", "2", "sum", "% 3"],
          rows: [[1, 0], [1, 0], [1, 1], [1, 0], [4, 1], [1, 1]],
          tones: { good: [[5, 0], [5, 1]] },
          caption: "11₂ = 3",
        },
      },
      { text: "O(1)-state variant: `ones = (ones ^ x) & ~twos; twos = (twos ^ x) & ~ones`." },
    ],
    time: "O(32 · n)",
    space: "O(1)",
  },

  "bitwise-and-of-numbers-range": {
    idea: "Across any range, every bit below the point where `left` and `right` first differ flips at some point, so it ANDs to 0. The answer is their **common binary prefix** followed by zeros.",
    steps: [
      {
        text: "`[5, 7]`:",
        visual: {
          kind: "grid",
          rowLabels: ["5", "6", "7", "AND"],
          rows: [[1, 0, 1], [1, 1, 0], [1, 1, 1], [1, 0, 0]],
          tones: { good: [[0, 0], [1, 0], [2, 0], [3, 0]] },
          caption: "Common prefix \"1\", then zeros: 100₂ = 4",
        },
      },
      { text: "Shift both right until equal, counting shifts, then shift back left. Or loop `right &= right - 1` while `right > left`." },
    ],
    time: "O(32)",
    space: "O(1)",
  },

  "sum-of-two-integers": {
    idea: "Binary addition without `+`: `a ^ b` adds each bit ignoring carries, and `(a & b) << 1` is the carry. Repeat with those two values until the carry is 0.",
    steps: [
      {
        text: "`5 + 3`:",
        visual: {
          kind: "grid",
          colLabels: ["a", "b", "a^b", "carry"],
          rows: [["0101", "0011", "0110", "0010"], ["0110", "0010", "0100", "0100"], ["0100", "0100", "0000", "1000"], ["0000", "1000", "1000", "0000"]],
          tones: { good: [[3, 2]] },
          caption: "Carry is 0, so the result is 1000₂ = 8",
        },
      },
      { text: "In Python, mask with `0xFFFFFFFF` to simulate 32-bit overflow, then convert back to a signed value." },
    ],
    time: "O(32)",
    space: "O(1)",
  },

  "utf-8-validation": {
    idea: "The leading bits of a byte tell you the character length: `0xxxxxxx` (1 byte), `110xxxxx` (2), `1110xxxx` (3), `11110xxx` (4). The following bytes must each be `10xxxxxx`. Keep a counter of continuation bytes still expected.",
    steps: [
      {
        text: "`data = [197, 130, 1]`:",
        visual: {
          kind: "grid",
          rowLabels: ["197", "130", "1"],
          rows: [["1", "1", "0", "0", "0", "1", "0", "1"], ["1", "0", "0", "0", "0", "0", "1", "0"], ["0", "0", "0", "0", "0", "0", "0", "1"]],
          tones: { accent: [[0, 0], [0, 1], [0, 2]], good: [[1, 0], [1, 1]], muted: [[2, 0]] },
          caption: "110… starts 2 bytes, 10… continues, 0… is a single byte: valid",
        },
      },
      { text: "Check with masks: `(b >> 5) == 0b110`, `(b >> 4) == 0b1110`, `(b >> 3) == 0b11110`, `(b >> 6) == 0b10`." },
    ],
    time: "O(n)",
    space: "O(1)",
    pitfalls: ["`10xxxxxx` as a **leading** byte is invalid, and so is ending while continuations are still expected."],
  },

  "xor-queries-of-a-subarray": {
    idea: "Prefix XOR works like prefix sums: `p[i] = arr[0] ^ … ^ arr[i-1]`. Since `x ^ x = 0`, the XOR of `arr[l..r]` is `p[r+1] ^ p[l]`.",
    steps: [
      {
        text: "`arr = [1,3,4,8]`:",
        visual: {
          kind: "grid",
          colLabels: ["0", "1", "2", "3", "4"],
          rowLabels: ["arr", "prefix"],
          rows: [[1, 3, 4, 8, ""], [0, 1, 2, 6, 14]],
          tones: { accent: [[1, 1], [1, 3]] },
          caption: "Query [1,2] = p[3] ^ p[1] = 6 ^ 1 = 7",
        },
      },
    ],
    time: "O(n + q)",
    space: "O(n)",
  },

  "minimum-one-bit-operations-to-make-integers-zero": {
    idea: "The two allowed operations are exactly the steps between **consecutive Gray codes**. So the answer is the position of `n` in the Gray code sequence, which is the inverse Gray code: `n ^ (n >> 1) ^ (n >> 2) ^ …`.",
    steps: [
      {
        text: "3-bit Gray sequence: each step flips one bit using one of the two allowed operations.",
        visual: {
          kind: "grid",
          colLabels: ["0", "1", "2", "3", "4", "5", "6", "7"],
          rowLabels: ["gray"],
          rows: [["000", "001", "011", "010", "110", "111", "101", "100"]],
          tones: { good: [[0, 4]] },
          caption: "n = 6 (110) is at position 4, so 4 operations",
        },
      },
      { text: "Loop: `ans = 0; while n: ans ^= n; n >>= 1`. Recursive view: `f(n) = 2^(k+1) - 1 - f(n ^ 2^k)` with `k` the highest set bit." },
    ],
    time: "O(log n)",
    space: "O(1)",
  },
});
