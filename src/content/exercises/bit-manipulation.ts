import { defineExercises } from "./types";

export default defineExercises({
  "single-number": [
    {
      kind: "type",
      prompt: "Fill in the operator that cancels pairs.",
      code: `
for number in nums:
    result ___ number`,
      answers: ["^="],
      explanation: "`x ^ x = 0` and `x ^ 0 = x`, so pairs cancel and the single number survives.",
    },
    {
      kind: "type",
      prompt: "What is `5 ^ 5`?",
      answers: ["0"],
      explanation: "XOR of a number with itself is always 0.",
    },
    {
      kind: "type",
      prompt: "What is `7 ^ 0`?",
      answers: ["7"],
      explanation: "XOR with 0 leaves a number unchanged.",
    },
    {
      kind: "type",
      prompt: "`nums = [4, 1, 2, 1, 2]`. What is returned?",
      solution: true,
      answers: ["4"],
      explanation: "The 1s and 2s cancel out.",
    },
    {
      kind: "type",
      prompt: "`nums = [-3, 7, 7]`. What is returned?",
      solution: true,
      answers: ["-3"],
      explanation: "XOR works on negative numbers too; the 7s cancel.",
    },
    {
      kind: "type",
      prompt: "Fill in the starting value.",
      code: `
result = ___`,
      answers: ["0"],
      explanation: "0 is XOR's identity: it doesn't change the first number.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n log n)", why: "That's sorting and scanning for the unpaired value." },
        { text: "O(n²)", why: "That's counting each value by scanning." },
      ],
      explanation: "One XOR per number.",
    },
    {
      kind: "choice",
      prompt: "Why does the order of numbers not matter?",
      options: [
        { text: "XOR is commutative and associative, so pairs cancel wherever they are", correct: true },
        { text: "Because the array is sorted", why: "It doesn't need to be." },
        { text: "It does matter", why: "`a ^ b ^ a` equals `b` in any order." },
      ],
      explanation: "You can regroup XORs freely.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(1)", correct: true },
        { text: "O(n)", why: "That's the hash-set approach." },
        { text: "O(log n)", why: "One integer is enough." },
      ],
      explanation: "A single accumulator.",
    },
    {
      kind: "choice",
      prompt: "Why doesn't this trick work if values appear **three** times?",
      options: [
        { text: "`x ^ x ^ x = x`, so triples don't cancel", correct: true },
        { text: "XOR only works on pairs of different numbers", why: "XOR works on any numbers; triples just leave one copy behind." },
        { text: "It does work", why: "Every tripled value would remain mixed into the result." },
      ],
      explanation: "That's why Single Number II counts bits modulo 3.",
    },
  ],

  "power-of-two": [
    {
      kind: "type",
      prompt: "Fill in the bit trick.",
      code: `
return n > 0 and n & (___) == 0`,
      answers: ["n - 1"],
      explanation: "`n & (n - 1)` clears the lowest 1 bit; a power of two has only one.",
    },
    {
      kind: "type",
      prompt: "What is `8 & 7`?",
      answers: ["0"],
      explanation: "1000 & 0111 = 0000.",
    },
    {
      kind: "type",
      prompt: "What is `6 & 5`?",
      answers: ["4"],
      explanation: "110 & 101 = 100: only the lowest 1 bit of 6 was cleared.",
    },
    {
      kind: "type",
      prompt: "`n = 0`. What is returned?",
      solution: true,
      answers: ["False"],
      explanation: "0 isn't a power of two, which is why `n > 0` is checked.",
    },
    {
      kind: "type",
      prompt: "`n = -8`. What is returned?",
      solution: true,
      answers: ["False"],
      explanation: "Negative numbers aren't powers of two.",
    },
    {
      kind: "type",
      prompt: "`n = 1`. What is returned?",
      solution: true,
      answers: ["True"],
      explanation: "1 = 2⁰.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(1)", correct: true },
        { text: "O(log n)", why: "That's dividing by 2 repeatedly. The bit trick is one operation." },
        { text: "O(n)", why: "No loop at all." },
      ],
      explanation: "A couple of operations.",
    },
    {
      kind: "choice",
      prompt: "Why does `n & (n - 1)` clear the lowest 1 bit?",
      options: [
        { text: "Subtracting 1 flips the lowest 1 bit and every 0 below it; AND keeps only the higher bits", correct: true },
        { text: "Because n − 1 is always odd", why: "That's only when n is even, and doesn't explain the trick." },
        { text: "It clears the highest bit", why: "It clears the **lowest** set bit." },
      ],
      explanation: "e.g. 1100 − 1 = 1011; 1100 & 1011 = 1000.",
    },
    {
      kind: "choice",
      prompt: "Why is `n > 0` checked first?",
      options: [
        { text: "0 & −1 is 0, which would wrongly pass the bit test", correct: true },
        { text: "To avoid division by zero", why: "No division happens." },
        { text: "For speed", why: "It's for correctness: 0 isn't a power of two." },
      ],
      explanation: "0 has no 1 bits, so the trick alone would accept it.",
    },
    {
      kind: "choice",
      prompt: "What does a power of two look like in binary?",
      options: [
        { text: "A single 1 followed by zeros", correct: true },
        { text: "All ones", why: "That's 2^k − 1, one less than a power of two." },
        { text: "Alternating 1s and 0s", why: "That's numbers like 5 or 10." },
      ],
      explanation: "1, 10, 100, 1000, …",
    },
  ],

  "counting-bits": [
    {
      kind: "type",
      prompt: "Fill in the bit that `number >> 1` drops.",
      code: `
bits[number] = bits[number >> 1] + (number ___ 1)`,
      answers: ["&"],
      explanation: "`number & 1` is the last bit: 1 for odd numbers, 0 for even.",
    },
    {
      kind: "type",
      prompt: "What is `5 >> 1`?",
      answers: ["2"],
      explanation: "101 shifted right is 10 = 2.",
    },
    {
      kind: "type",
      prompt: "`n = 5`. What is returned?",
      solution: true,
      answers: ["[0, 1, 1, 2, 1, 2]", "0, 1, 1, 2, 1, 2", "0 1 1 2 1 2"],
      explanation: "0, 1, 10, 11, 100, 101.",
    },
    {
      kind: "type",
      prompt: "`n = 2`. What is returned?",
      solution: true,
      answers: ["[0, 1, 1]", "0, 1, 1", "0 1 1"],
      explanation: "0, 1, 10.",
    },
    {
      kind: "type",
      prompt: "How many 1 bits does 7 have?",
      answers: ["3"],
      explanation: "7 = 111.",
    },
    {
      kind: "type",
      prompt: "Fill in the array size.",
      code: `
bits = [0] * (___)`,
      answers: ["n + 1"],
      explanation: "The result covers 0..n inclusive.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n log n)", why: "That's counting each number's bits from scratch. DP reuses smaller answers." },
        { text: "O(log n)", why: "We produce n + 1 answers." },
      ],
      explanation: "One O(1) step per number.",
    },
    {
      kind: "choice",
      prompt: "Why is `bits[number >> 1]` already known when computing `bits[number]`?",
      options: [
        { text: "`number >> 1` is smaller than `number`, and we fill in increasing order", correct: true },
        { text: "It's precomputed", why: "It's computed earlier in the same loop." },
        { text: "Because it's always 0", why: "It's the count for half of the number." },
      ],
      explanation: "This is DP: each answer builds on a smaller one.",
    },
    {
      kind: "choice",
      prompt: "Which other recurrence also works?",
      options: [
        { text: "`bits[i] = bits[i & (i - 1)] + 1`", correct: true },
        { text: "`bits[i] = bits[i - 1] + 1`", why: "Going from 3 (11) to 4 (100), the count drops." },
        { text: "`bits[i] = 2 * bits[i // 2]`", why: "Doubling a number doesn't double its 1 bits." },
      ],
      explanation: "`i & (i - 1)` removes exactly one 1 bit.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity, not counting the output?",
      solution: true,
      options: [
        { text: "O(1)", correct: true },
        { text: "O(n)", why: "The array is the output itself." },
        { text: "O(log n)", why: "No recursion." },
      ],
      explanation: "The DP table is the answer.",
    },
  ],

  "reverse-bits": [
    {
      kind: "type",
      prompt: "Fill in how the next bit is appended to `result`.",
      code: `
result = (result << 1) | (n ___ 1)`,
      answers: ["&"],
      explanation: "Shift `result` left to make room, then OR in n's lowest bit.",
    },
    {
      kind: "type",
      prompt: "Fill in how many times the loop runs.",
      code: `
for _ in range(___):`,
      answers: ["32"],
      explanation: "All 32 bits must be moved, including leading zeros.",
    },
    {
      kind: "type",
      prompt: "`n = 1`. What is returned?",
      solution: true,
      answers: ["2147483648"],
      explanation: "Bit 0 moves to bit 31: 2³¹.",
    },
    {
      kind: "type",
      prompt: "`n = 2` (binary 10). What is returned?",
      solution: true,
      answers: ["1073741824"],
      explanation: "Bit 1 moves to bit 30: 2³⁰.",
    },
    {
      kind: "type",
      prompt: "`n = 0`. What is returned?",
      solution: true,
      answers: ["0"],
      explanation: "No bits are set.",
    },
    {
      kind: "type",
      prompt: "Fill in the step that drops the used bit.",
      code: `
n ___ 1`,
      answers: [">>="],
      explanation: "Shift n right so the next bit becomes the lowest.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(1): always 32 steps", correct: true },
        { text: "O(log n)", why: "The loop always runs 32 times, regardless of n." },
        { text: "O(n)", why: "n is the value, not a length." },
      ],
      explanation: "A fixed number of bits.",
    },
    {
      kind: "choice",
      prompt: "Why loop exactly 32 times instead of until `n` becomes 0?",
      options: [
        { text: "Leading zeros matter: they become trailing zeros and shift the result", correct: true },
        { text: "It's faster", why: "It's for correctness." },
        { text: "Python ints have 32 bits", why: "Python ints are unbounded; the problem defines 32 bits." },
      ],
      explanation: "Stopping early would leave the reversed bits in the wrong positions.",
    },
    {
      kind: "choice",
      prompt: "How could this be optimised for many calls?",
      options: [
        { text: "Precompute reversed bytes and combine four lookups", correct: true },
        { text: "Use recursion", why: "Recursion doesn't reduce work." },
        { text: "Sort the bits", why: "Reversal isn't sorting." },
      ],
      explanation: "A 256-entry table turns 32 steps into 4 lookups.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(1)", correct: true },
        { text: "O(32) for a list of bits", why: "No list is built; bits are moved one by one." },
        { text: "O(log n)", why: "One integer accumulator." },
      ],
      explanation: "One accumulator.",
    },
  ],

  "single-number-ii": [
    {
      kind: "type",
      prompt: "Fill in the test for a bit that belongs to the single number.",
      code: `
if count ___ 3:
    result |= 1 << bit`,
      answers: ["%"],
      explanation: "Values appearing three times add multiples of 3 to each bit count; the remainder comes from the single number.",
    },
    {
      kind: "type",
      prompt: "Fill in how bit `bit` of `number` is read.",
      code: `
count = sum((number >> bit) ___ 1 for number in nums)`,
      answers: ["&"],
      explanation: "Shift the bit into position 0 and mask it.",
    },
    {
      kind: "type",
      prompt: "`nums = [2, 2, 3, 2]`. What is returned?",
      solution: true,
      answers: ["3"],
      explanation: "3 appears once; 2 appears three times.",
    },
    {
      kind: "type",
      prompt: "`nums = [0, 1, 0, 1, 0, 1, 99]`. What is returned?",
      solution: true,
      answers: ["99"],
      explanation: "0 and 1 appear three times each.",
    },
    {
      kind: "type",
      prompt: "For `[2, 2, 3, 2]`, how many numbers have bit 1 set?",
      solution: true,
      answers: ["4"],
      explanation: "2 = 10 and 3 = 11 both have bit 1: all four numbers.",
    },
    {
      kind: "type",
      prompt: "`nums = [-2, -2, 1, 1, -3, 1, -3, -3, -4, -2]`. What is returned?",
      solution: true,
      answers: ["-4"],
      explanation: "The last line converts bit 31 back into a negative sign.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(32 · n), which is O(n)", correct: true },
        { text: "O(n²)", why: "Each bit position is one pass over nums." },
        { text: "O(n log n)", why: "Nothing is sorted." },
      ],
      explanation: "32 passes over the array.",
    },
    {
      kind: "choice",
      prompt: "Why is the final line needed in Python?",
      solution: true,
      options: [
        { text: "Python ints are unbounded, so a set bit 31 must be turned into a negative value", correct: true },
        { text: "To remove duplicates", why: "It's about the sign of the result." },
        { text: "It isn't needed", why: "Without it, a negative answer would come back as a large positive number." },
      ],
      explanation: "In 32-bit two's complement, bit 31 is the sign bit.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(1)", correct: true },
        { text: "O(n)", why: "That's a counter dictionary." },
        { text: "O(32 · n)", why: "Counts are computed one bit at a time." },
      ],
      explanation: "A few integers.",
    },
    {
      kind: "choice",
      prompt: "How does this generalise?",
      options: [
        { text: "If others appear k times, keep bits whose count % k is non-zero", correct: true },
        { text: "It only works for 3", why: "The modulus just changes." },
        { text: "Use XOR for any k", why: "XOR only cancels even counts." },
      ],
      explanation: "Count each bit position modulo k.",
    },
  ],

  "bitwise-and-of-numbers-range": [
    {
      kind: "type",
      prompt: "Fill in the loop condition.",
      code: `
while left ___ right:
    left >>= 1
    right >>= 1
    shift += 1`,
      answers: ["!="],
      explanation: "Strip low bits until the two numbers agree: that's their common prefix.",
    },
    {
      kind: "type",
      prompt: "Fill in the result.",
      code: `
return left ___ shift`,
      answers: ["<<"],
      explanation: "Put the common prefix back in place, with zeros below.",
    },
    {
      kind: "type",
      prompt: "`left = 5`, `right = 7`. What is returned?",
      solution: true,
      answers: ["4"],
      explanation: "101 & 110 & 111 = 100.",
    },
    {
      kind: "type",
      prompt: "`left = 12`, `right = 15`. What is returned?",
      solution: true,
      answers: ["12"],
      explanation: "1100..1111 share the prefix 11, followed by zeros.",
    },
    {
      kind: "type",
      prompt: "`left = 1`, `right = 2147483647`. What is returned?",
      solution: true,
      answers: ["0"],
      explanation: "The range covers numbers with no common prefix bit.",
    },
    {
      kind: "type",
      prompt: "`left = 8`, `right = 8`. What is returned?",
      solution: true,
      answers: ["8"],
      explanation: "A single number ANDed with itself.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(32), constant", correct: true },
        { text: "O(right − left)", why: "That's ANDing every number in the range." },
        { text: "O(right)", why: "We shift bits, not iterate values." },
      ],
      explanation: "At most 32 shifts.",
    },
    {
      kind: "choice",
      prompt: "Why are all bits below the common prefix 0 in the answer?",
      options: [
        { text: "Within the range, each of those bits is 0 in at least one number", correct: true },
        { text: "Because AND always produces zeros", why: "AND keeps bits that are 1 everywhere." },
        { text: "Because `left` is even", why: "It holds for any `left`." },
      ],
      explanation: "Where left and right differ, some number in between flips that bit and all below it.",
    },
    {
      kind: "choice",
      prompt: "Which other loop also works?",
      options: [
        { text: "`while right > left: right &= right - 1`, then return `right`", correct: true },
        { text: "`while left < right: left += 1`", why: "That just walks the range." },
        { text: "`return left & right`", why: "Numbers in between can clear more bits: 5 & 7 = 5, but the answer is 4." },
      ],
      explanation: "Clearing right's lowest 1 bit repeatedly also reaches the common prefix.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(1)", correct: true },
        { text: "O(right − left)", why: "Nothing is stored per number." },
        { text: "O(32)", why: "Just a shift counter, which is O(1)." },
      ],
      explanation: "Three integers.",
    },
  ],

  "sum-of-two-integers": [
    {
      kind: "type",
      prompt: "Fill in the carry.",
      code: `
a, b = a ^ b, (a & b) ___ 1`,
      answers: ["<<"],
      explanation: "Bits set in both produce a carry into the next position.",
    },
    {
      kind: "type",
      prompt: "What is `5 ^ 3`?",
      answers: ["6"],
      explanation: "101 ^ 011 = 110: addition without carries.",
    },
    {
      kind: "type",
      prompt: "What is `(5 & 3) << 1`?",
      answers: ["2"],
      explanation: "101 & 011 = 001, shifted left = 010: the carry.",
    },
    {
      kind: "type",
      prompt: "`a = -2`, `b = -3`. What is returned?",
      solution: true,
      answers: ["-5"],
      explanation: "The mask emulates 32-bit two's complement, and the last line restores the sign.",
    },
    {
      kind: "type",
      prompt: "`a = 5`, `b = -7`. What is returned?",
      solution: true,
      answers: ["-2"],
      explanation: "5 + (−7) = −2.",
    },
    {
      kind: "type",
      prompt: "Fill in the 32-bit mask (8 hex digits).",
      code: `
MASK = 0x___`,
      answers: ["FFFFFFFF", "ffffffff"],
      explanation: "32 ones keeps exactly 32 bits.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(32): the carry moves left one bit per round", correct: true },
        { text: "O(a + b)", why: "That's incrementing one at a time." },
        { text: "O(log(a · b))", why: "The bound is the word size." },
      ],
      explanation: "At most 32 rounds before the carry falls off.",
    },
    {
      kind: "choice",
      prompt: "Why does Python need the mask?",
      options: [
        { text: "Python ints are unbounded, so negative carries would shift left forever", correct: true },
        { text: "XOR doesn't work on negatives", why: "It does; the problem is infinite sign extension." },
        { text: "It's for speed", why: "Without it, the loop may not end." },
      ],
      explanation: "The mask emulates fixed 32-bit integers.",
    },
    {
      kind: "choice",
      prompt: "What does `~(a ^ MASK)` do at the end?",
      solution: true,
      options: [
        { text: "Turns a 32-bit pattern with the sign bit set into the matching negative Python int", correct: true },
        { text: "Doubles the result", why: "It's a sign conversion." },
        { text: "Removes the carry", why: "The carry is already zero." },
      ],
      explanation: "Values above 0x7FFFFFFF represent negatives in two's complement.",
    },
    {
      kind: "choice",
      prompt: "What does XOR compute in binary addition?",
      options: [
        { text: "The sum bit at each position, ignoring carries", correct: true },
        { text: "The carry", why: "AND (shifted) gives the carry." },
        { text: "The final sum", why: "Only once the carry becomes 0." },
      ],
      explanation: "1 + 1 = 0 carry 1; XOR gives the 0, AND gives the carry.",
    },
  ],

  "utf-8-validation": [
    {
      kind: "type",
      prompt: "Fill in the check for a continuation byte (`10xxxxxx`).",
      code: `
if byte >> 6 != 0b___:
    return False`,
      answers: ["10"],
      explanation: "Shifting right by 6 leaves the top two bits, which must be `10`.",
    },
    {
      kind: "type",
      prompt: "Fill in the shift for a 3-byte start (`1110xxxx`).",
      code: `
elif byte >> ___ == 0b1110:
    pending = 2`,
      answers: ["4"],
      explanation: "Keep the top four bits and compare with `1110`.",
    },
    {
      kind: "type",
      prompt: "`data = [197, 130, 1]`. What is returned?",
      solution: true,
      answers: ["True"],
      explanation: "197 = 11000101 (2-byte start), 130 = 10000010 (continuation), 1 = one-byte character.",
    },
    {
      kind: "type",
      prompt: "`data = [235, 140, 4]`. What is returned?",
      solution: true,
      answers: ["False"],
      explanation: "235 = 11101011 starts a 3-byte character, but 4 isn't a continuation byte.",
    },
    {
      kind: "type",
      prompt: "`data = [145]`. What is returned?",
      solution: true,
      answers: ["False"],
      explanation: "145 = 10010001 is a continuation byte with nothing to continue.",
    },
    {
      kind: "type",
      prompt: "`data = [0b11000010]` (a 2-byte start, alone). What is returned?",
      solution: true,
      answers: ["False"],
      explanation: "The character never gets its continuation byte, so `pending` isn't 0 at the end.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(8n), which is worse", why: "Each byte is checked with a few shifts; constants don't count." },
        { text: "O(n²)", why: "Each byte is handled once." },
      ],
      explanation: "One pass over the bytes.",
    },
    {
      kind: "choice",
      prompt: "What does `pending` track?",
      solution: true,
      options: [
        { text: "How many continuation bytes the current character still needs", correct: true },
        { text: "How many characters are left", why: "It's per-character, counting bytes." },
        { text: "The number of invalid bytes", why: "Any invalid byte returns `False` immediately." },
      ],
      explanation: "It's a small state machine.",
    },
    {
      kind: "choice",
      prompt: "Why is `11111000` invalid as a first byte?",
      options: [
        { text: "UTF-8 characters are at most 4 bytes, so 5 leading ones isn't allowed", correct: true },
        { text: "It's a continuation byte", why: "Continuation bytes start with `10`." },
        { text: "It's valid", why: "The highest valid prefix is `11110`." },
      ],
      explanation: "The `else: return False` branch catches it.",
    },
    {
      kind: "choice",
      prompt: "Why check `pending == 0` at the end?",
      solution: true,
      options: [
        { text: "The data may end in the middle of a multi-byte character", correct: true },
        { text: "To count characters", why: "It checks completeness, not count." },
        { text: "It's always 0", why: "Not if the last character is cut off." },
      ],
      explanation: "An unfinished character makes the data invalid.",
    },
  ],

  "xor-queries-of-a-subarray": [
    {
      kind: "type",
      prompt: "Fill in the answer to one query.",
      code: `
return [prefix[end + 1] ___ prefix[start] for start, end in queries]`,
      answers: ["^"],
      explanation: "XOR undoes itself, so the shared prefix cancels and only `arr[start..end]` remains.",
    },
    {
      kind: "type",
      prompt: "Fill in how the next prefix is built.",
      code: `
prefix.append(prefix[-1] ___ number)`,
      answers: ["^"],
      explanation: "Each prefix is the previous one XOR the next value.",
    },
    {
      kind: "type",
      prompt: "`arr = [1, 3, 4, 8]`, query `[0, 1]`. What is the answer?",
      solution: true,
      answers: ["2"],
      explanation: "1 ^ 3 = 2.",
    },
    {
      kind: "type",
      prompt: "Same `arr`, query `[0, 3]`. What is the answer?",
      solution: true,
      answers: ["14"],
      explanation: "1 ^ 3 ^ 4 ^ 8 = 14.",
    },
    {
      kind: "type",
      prompt: "Same `arr`, query `[3, 3]`. What is the answer?",
      solution: true,
      answers: ["8"],
      explanation: "A single element.",
    },
    {
      kind: "type",
      prompt: "Fill in the starting prefix.",
      code: `
prefix = [___]`,
      answers: ["0"],
      explanation: "The XOR of zero values is 0.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity, with n values and q queries?",
      solution: true,
      options: [
        { text: "O(n + q)", correct: true },
        { text: "O(n · q)", why: "That's XORing each range directly." },
        { text: "O(q log n)", why: "Each query is O(1) after the prefix array." },
      ],
      explanation: "O(n) to build, O(1) per query.",
    },
    {
      kind: "choice",
      prompt: "Which idea does this borrow?",
      options: [
        { text: "Prefix sums, with XOR instead of addition", correct: true },
        { text: "Binary search", why: "Queries are answered directly by index." },
        { text: "Sliding window", why: "Queries are independent, not a moving window." },
      ],
      explanation: "XOR is its own inverse, like subtraction undoes addition.",
    },
    {
      kind: "choice",
      prompt: "Why `prefix[end + 1]` and not `prefix[end]`?",
      solution: true,
      options: [
        { text: "`prefix[i]` covers the first i values, so `end` inclusive needs index `end + 1`", correct: true },
        { text: "It's an off-by-one bug", why: "It's correct because of the leading 0." },
        { text: "To skip the last element", why: "It includes it." },
      ],
      explanation: "The extra leading 0 makes the formula uniform.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(n) for the prefix array", correct: true },
        { text: "O(1)", why: "The prefix array has n + 1 entries." },
        { text: "O(q)", why: "That's the output; the prefix array is O(n)." },
      ],
      explanation: "One prefix per position.",
    },
  ],

  "minimum-one-bit-operations-to-make-integers-zero": [
    {
      kind: "type",
      prompt: "Fill in how each shifted copy is folded in.",
      code: `
while n:
    result ___ n
    n >>= 1`,
      answers: ["^="],
      explanation: "The answer is n ^ (n >> 1) ^ (n >> 2) ^ …, the inverse Gray code.",
    },
    {
      kind: "type",
      prompt: "`n = 3`. What is returned?",
      solution: true,
      answers: ["2"],
      explanation: "11 → 01 (flip bit 1, allowed since bit 0 is 1) → 00.",
    },
    {
      kind: "type",
      prompt: "`n = 6`. What is returned?",
      solution: true,
      answers: ["4"],
      explanation: "110 ^ 11 ^ 1 = 100 = 4.",
    },
    {
      kind: "type",
      prompt: "`n = 2`. What is returned?",
      solution: true,
      answers: ["3"],
      explanation: "10 → 11 → 01 → 00.",
    },
    {
      kind: "type",
      prompt: "`n = 8`. What is returned?",
      solution: true,
      answers: ["15"],
      explanation: "Clearing a lone bit k takes 2^(k+1) − 1 operations: 2⁴ − 1 = 15.",
    },
    {
      kind: "type",
      prompt: "`n = 0`. What is returned?",
      solution: true,
      answers: ["0"],
      explanation: "Already zero.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(log n)", correct: true },
        { text: "O(n)", why: "That's simulating the operations one by one." },
        { text: "O(1)", why: "The loop runs once per bit of n." },
      ],
      explanation: "One iteration per bit.",
    },
    {
      kind: "choice",
      prompt: "Which sequence do the allowed operations walk through?",
      options: [
        { text: "The Gray code sequence, where neighbours differ in one bit", correct: true },
        { text: "Binary counting", why: "Binary counting can flip many bits at once." },
        { text: "Powers of two", why: "The operations move through every value, not just powers of two." },
      ],
      explanation: "The answer is n's position in the Gray code order: the inverse Gray code.",
    },
    {
      kind: "choice",
      prompt: "How many operations does it take to clear a single bit k (n = 2ᵏ)?",
      options: [
        { text: "2^(k+1) − 1", correct: true },
        { text: "k", why: "Each higher bit needs the lower bits set up first, which costs exponentially more." },
        { text: "2ᵏ", why: "Off by almost a factor of 2: 8 needs 15." },
      ],
      explanation: "This recurrence leads to the XOR formula.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(1)", correct: true },
        { text: "O(log n)", why: "No recursion or arrays." },
        { text: "O(n)", why: "Just an accumulator." },
      ],
      explanation: "One integer.",
    },
  ],
});
