import { defineExercises } from "./types";

export default defineExercises({
  "longest-common-prefix": [
    {
      kind: "type",
      prompt: "Fill in the condition that ends the prefix.",
      code: `
if position == len(word) or word[position] ___ character:
    return first[:position]`,
      answers: ["!="],
      explanation: "The prefix stops at the first position where some word differs or runs out.",
    },
    {
      kind: "type",
      prompt: "Fill in what is returned when the prefix ends at `position`.",
      code: `
return first[___]`,
      answers: [":position"],
      explanation: "Characters before `position` are shared by all words.",
    },
    {
      kind: "type",
      prompt: "`strs = [\"flower\", \"flow\", \"flight\"]`. What is returned?",
      solution: true,
      answers: ["fl"],
      explanation: "The third character differs (`o` vs `i`).",
    },
    {
      kind: "type",
      prompt: "`strs = [\"dog\", \"racecar\", \"car\"]`. What is returned? (type `\"\"` for empty)",
      solution: true,
      answers: ["\"\"", "''", "empty"],
      explanation: "The first characters already differ.",
    },
    {
      kind: "type",
      prompt: "`strs = [\"ab\", \"a\"]`. What is returned?",
      solution: true,
      answers: ["a"],
      explanation: "`\"a\"` runs out after one character.",
    },
    {
      kind: "type",
      prompt: "`strs = [\"same\", \"same\"]`. What is returned?",
      solution: true,
      answers: ["same"],
      explanation: "The loop never finds a mismatch, so the whole first word is returned.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity, with S = total characters?",
      solution: true,
      options: [
        { text: "O(S)", correct: true },
        { text: "O(S log n)", why: "That's sorting the strings first. Vertical scanning is linear." },
        { text: "O(n²)", why: "Each character is compared at most once per word." },
      ],
      explanation: "Every character is compared at most once.",
    },
    {
      kind: "choice",
      prompt: "What does \"vertical scanning\" mean here?",
      options: [
        { text: "Compare position 0 of every word, then position 1, and so on", correct: true },
        { text: "Compare words pairwise and shrink the prefix", why: "That's horizontal scanning." },
        { text: "Sort the words and compare the first and last", why: "That's another valid trick, not this code." },
      ],
      explanation: "It stops as soon as any column disagrees.",
    },
    {
      kind: "choice",
      prompt: "How would a trie solve it?",
      options: [
        { text: "Insert all words, then walk from the root while there's exactly one child and no word ends", correct: true },
        { text: "Insert one word and search the others", why: "That checks membership, not the shared prefix." },
        { text: "Tries can't help", why: "The common prefix is the trie's single-child path from the root." },
      ],
      explanation: "Useful when many prefix queries follow.",
    },
    {
      kind: "choice",
      prompt: "Which other trick finds the answer after sorting?",
      options: [
        { text: "Compare only the first and last strings in sorted order", correct: true },
        { text: "Compare the two shortest strings", why: "Length doesn't decide shared prefixes." },
        { text: "Take the first string", why: "That's only the upper bound." },
      ],
      explanation: "The most different pair in sorted order bounds the common prefix.",
    },
  ],

  "check-if-a-word-occurs-as-a-prefix-of-any-word-in-a-sentence": [
    {
      kind: "type",
      prompt: "Fill in the string method.",
      code: `
if word.___(searchWord):
    return position`,
      answers: ["startswith"],
      explanation: "`startswith` checks the prefix directly.",
    },
    {
      kind: "type",
      prompt: "Fill in the numbering start for words.",
      code: `
for position, word in enumerate(sentence.split(), start=___):`,
      answers: ["1"],
      explanation: "The problem counts words from 1.",
    },
    {
      kind: "type",
      prompt: "`sentence = \"i love eating burger\"`, `searchWord = \"burg\"`. What is returned?",
      solution: true,
      answers: ["4"],
      explanation: "`burger` is the 4th word.",
    },
    {
      kind: "type",
      prompt: "`sentence = \"this problem is an easy problem\"`, `searchWord = \"pro\"`. What is returned?",
      solution: true,
      answers: ["2"],
      explanation: "The **first** match wins: the 2nd word.",
      mistakes: [{ answers: ["6"], why: "The first matching word is returned, not the last." }],
    },
    {
      kind: "type",
      prompt: "`sentence = \"i am tired\"`, `searchWord = \"you\"`. What is returned?",
      solution: true,
      answers: ["-1"],
      explanation: "No word starts with `you`.",
    },
    {
      kind: "type",
      prompt: "`sentence = \"hello world\"`, `searchWord = \"hello\"`. What is returned?",
      solution: true,
      answers: ["1"],
      explanation: "A word is a prefix of itself.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity, with n = sentence length?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(n · m) for m = searchWord length, which can be much worse", why: "Each prefix check stops after at most m characters, and words partition the sentence." },
        { text: "O(log n)", why: "We read the whole sentence in the worst case." },
      ],
      explanation: "Split plus a short prefix check per word.",
    },
    {
      kind: "choice",
      prompt: "What's the difference between \"prefix of a word\" and \"substring of a word\"?",
      options: [
        { text: "A prefix must match from the word's first character", correct: true },
        { text: "No difference", why: "`burg` is a substring of `hamburger` but not a prefix." },
        { text: "A prefix must be the whole word", why: "A prefix can be shorter." },
      ],
      explanation: "That's why `startswith` is used, not `in`.",
    },
    {
      kind: "choice",
      prompt: "When would a trie be worth it here?",
      options: [
        { text: "With many searchWord queries against the same sentence", correct: true },
        { text: "Never", why: "For repeated queries, a trie answers each in O(m)." },
        { text: "Always, even for one query", why: "Building a trie for one query costs more than a scan." },
      ],
      explanation: "Store the earliest word index at each trie node.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity of this code?",
      solution: true,
      options: [
        { text: "O(n) for the list from `split()`", correct: true },
        { text: "O(1)", why: "`split()` builds a list of all words." },
        { text: "O(m)", why: "The split list depends on the sentence." },
      ],
      explanation: "Scanning in place could make it O(1).",
    },
  ],

  "implement-trie-prefix-tree": [
    {
      kind: "type",
      prompt: "Fill in the call that follows or creates a child.",
      code: `
node = node.children.___(character, TrieNode())`,
      answers: ["setdefault"],
      explanation: "`setdefault` returns the existing child or stores and returns a new one.",
    },
    {
      kind: "type",
      prompt: "Fill in what `search` needs beyond the path existing.",
      code: `
node = self._walk(word)
return bool(node and node.___)`,
      answers: ["is_end"],
      explanation: "A word must end at that node, not just pass through it.",
    },
    {
      kind: "type",
      prompt: "After `insert(\"apple\")`, what does `search(\"app\")` return?",
      solution: true,
      answers: ["False"],
      explanation: "The path exists, but no word ends at `app`.",
      mistakes: [{ answers: ["True"], why: "`app` is only a prefix; `is_end` is false there." }],
    },
    {
      kind: "type",
      prompt: "After `insert(\"apple\")`, what does `startsWith(\"app\")` return?",
      solution: true,
      answers: ["True"],
      explanation: "The path for `app` exists.",
    },
    {
      kind: "type",
      prompt: "Then `insert(\"app\")`. What does `search(\"app\")` return now?",
      solution: true,
      answers: ["True"],
      explanation: "Inserting sets `is_end` on the existing node.",
    },
    {
      kind: "type",
      prompt: "After inserting `apple` and `app`, how many nodes are there, counting the root?",
      solution: true,
      answers: ["6"],
      explanation: "Root + a, p, p, l, e: `app` reuses the existing path.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity of each operation, for word length L?",
      solution: true,
      options: [
        { text: "O(L)", correct: true },
        { text: "O(log n) for n words", why: "Trie cost depends on word length, not the number of words." },
        { text: "O(n · L)", why: "That's scanning a list of words." },
      ],
      explanation: "One step per character.",
    },
    {
      kind: "choice",
      prompt: "Why is `is_end` needed?",
      options: [
        { text: "To tell a full word apart from a prefix of a longer word", correct: true },
        { text: "To mark leaves", why: "A word can end at an inner node (`app` inside `apple`)." },
        { text: "To count words", why: "It's a flag, not a counter." },
      ],
      explanation: "Without it, `search(\"app\")` couldn't tell `app` was never inserted.",
    },
    {
      kind: "choice",
      prompt: "What is the space complexity?",
      solution: true,
      options: [
        { text: "O(total characters inserted), shared prefixes stored once", correct: true },
        { text: "O(26ⁿ)", why: "Only the inserted paths exist." },
        { text: "O(number of words)", why: "Each character of each new path needs a node." },
      ],
      explanation: "Shared prefixes save space.",
    },
    {
      kind: "choice",
      prompt: "Why is a trie better than a set of words for `startsWith`?",
      options: [
        { text: "A set must check every word's prefix; a trie walks the prefix once", correct: true },
        { text: "Sets can't store strings", why: "They can; they just can't answer prefix queries efficiently." },
        { text: "It isn't", why: "With a set, `startsWith` is O(n · L)." },
      ],
      explanation: "Prefix queries are what tries are built for.",
    },
  ],

  "design-add-and-search-words-data-structure": [
    {
      kind: "type",
      prompt: "Fill in the wildcard character.",
      code: `
if character == "___":
    return any(match(child, position + 1) for child in node.children.values())`,
      answers: ["."],
      explanation: "A dot matches any letter, so try every child.",
    },
    {
      kind: "type",
      prompt: "Fill in the base case.",
      code: `
if position == len(word):
    return node.___`,
      answers: ["is_end"],
      explanation: "All characters matched; a word must end here.",
    },
    {
      kind: "type",
      prompt: "After adding `bad`, `dad`, `mad`: what does `search(\"pad\")` return?",
      solution: true,
      answers: ["False"],
      explanation: "No word starts with `p`.",
    },
    {
      kind: "type",
      prompt: "Same words. What does `search(\".ad\")` return?",
      solution: true,
      answers: ["True"],
      explanation: "`bad`, `dad` and `mad` all match.",
    },
    {
      kind: "type",
      prompt: "Same words. What does `search(\"..\")` return?",
      solution: true,
      answers: ["False"],
      explanation: "Two dots match two letters, but no 2-letter word was added.",
    },
    {
      kind: "type",
      prompt: "Same words. What does `search(\"b..\")` return?",
      solution: true,
      answers: ["True"],
      explanation: "`bad` matches.",
    },
    {
      kind: "choice",
      prompt: "What is the worst-case search time with d dots in a pattern of length L?",
      solution: true,
      options: [
        { text: "O(26^d · L)", correct: true },
        { text: "O(L)", why: "That's without dots. Each dot can branch into 26 children." },
        { text: "O(26 · L)", why: "Multiple dots multiply the branching." },
      ],
      explanation: "Each dot explores every child.",
    },
    {
      kind: "choice",
      prompt: "Why does `.` need recursion (or a stack)?",
      options: [
        { text: "It branches: several children may lead to a match", correct: true },
        { text: "Because tries are recursive structures", why: "Plain letters are walked iteratively; branching is the reason." },
        { text: "It doesn't", why: "One path isn't enough when `.` can be any letter." },
      ],
      explanation: "Backtracking over trie branches.",
    },
    {
      kind: "choice",
      prompt: "What does `any(...)` give us?",
      solution: true,
      options: [
        { text: "It stops as soon as one branch matches", correct: true },
        { text: "It checks that all branches match", why: "That's `all(...)`." },
        { text: "It counts matches", why: "It returns a boolean." },
      ],
      explanation: "Short-circuiting saves work.",
    },
    {
      kind: "choice",
      prompt: "What is `addWord`'s time complexity?",
      solution: true,
      options: [
        { text: "O(L)", correct: true },
        { text: "O(26 · L)", why: "Adding follows exactly one path." },
        { text: "O(1)", why: "Each character needs a step." },
      ],
      explanation: "Same as a normal trie insert.",
    },
  ],

  "search-suggestions-system": [
    {
      kind: "type",
      prompt: "Fill in how many suggestions are kept.",
      code: `
products[start:start + ___]`,
      answers: ["3"],
      explanation: "At most three suggestions per prefix.",
    },
    {
      kind: "type",
      prompt: "Fill in the bisect function that finds the first product ≥ the prefix.",
      code: `
start = ___(products, prefix, start)`,
      answers: ["bisect_left", "bisect.bisect_left"],
      explanation: "In sorted order, every product with this prefix comes at or after that position.",
    },
    {
      kind: "type",
      prompt: "`products = [mobile, mouse, moneypot, monitor, mousepad]`, `searchWord = \"mouse\"`. What are the suggestions after typing `m`?",
      solution: true,
      answers: ["[mobile, moneypot, monitor]", "mobile, moneypot, monitor", "[\"mobile\", \"moneypot\", \"monitor\"]", "['mobile', 'moneypot', 'monitor']"],
      explanation: "Sorted: mobile, moneypot, monitor, mouse, mousepad. The first three start with `m`.",
    },
    {
      kind: "type",
      prompt: "Same input. How many suggestions are there after typing `mou`?",
      solution: true,
      answers: ["2"],
      explanation: "Only `mouse` and `mousepad` start with `mou`.",
    },
    {
      kind: "type",
      prompt: "`products = [havana]`, `searchWord = \"tatiana\"`. How many lists are returned?",
      solution: true,
      answers: ["7"],
      explanation: "One (empty) list per typed character.",
    },
    {
      kind: "type",
      prompt: "Fill in the filter that keeps only real matches.",
      code: `
[product for product in products[start:start + 3] if product.___(prefix)]`,
      answers: ["startswith"],
      explanation: "Products after the lower bound might not share the prefix.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity, with n products and a search word of length L?",
      solution: true,
      options: [
        { text: "O(n log n) to sort + O(L log n) for the searches", correct: true },
        { text: "O(n · L)", why: "That's filtering all products for each prefix." },
        { text: "O(L)", why: "Sorting and binary search add log factors." },
      ],
      explanation: "Sort once, then one binary search per character.",
    },
    {
      kind: "choice",
      prompt: "Why can the binary search start at the previous `start`?",
      solution: true,
      options: [
        { text: "A longer prefix's lower bound is never before the shorter prefix's", correct: true },
        { text: "Because products are unique", why: "It's about prefix ordering." },
        { text: "It's required by `bisect`", why: "It's an optimisation." },
      ],
      explanation: "The lower bound only moves right as you type.",
    },
    {
      kind: "choice",
      prompt: "How would a trie solve it?",
      options: [
        { text: "Store up to three smallest words at each node, then walk the typed prefix", correct: true },
        { text: "Store only word ends", why: "You'd then have to search the whole subtree for each prefix." },
        { text: "A trie can't sort", why: "Inserting in sorted order (or visiting children in order) gives sorted suggestions." },
      ],
      explanation: "Each node caches its top three suggestions.",
    },
    {
      kind: "choice",
      prompt: "Why does sorting help?",
      options: [
        { text: "Words sharing a prefix sit next to each other, smallest first", correct: true },
        { text: "Shorter words come first", why: "Lexicographic order isn't by length." },
        { text: "It removes duplicates", why: "Sorting doesn't remove anything." },
      ],
      explanation: "So the first three matches are the three suggestions.",
    },
  ],

  "replace-words": [
    {
      kind: "type",
      prompt: "Fill in the step that returns as soon as a root ends.",
      code: `
node = node[character]
if END in node:
    return ___`,
      answers: ["node[END]"],
      explanation: "The first root found while walking is the shortest one.",
    },
    {
      kind: "type",
      prompt: "Fill in what happens when no root continues.",
      code: `
if character not in node:
    ___`,
      answers: ["break"],
      explanation: "Stop walking; the word is returned unchanged.",
    },
    {
      kind: "type",
      prompt: "Roots `[cat, bat, rat]`, sentence `the cattle was rattled by the battery`. What is the result?",
      solution: true,
      answers: ["the cat was rat by the bat"],
      explanation: "cattle → cat, rattled → rat, battery → bat.",
    },
    {
      kind: "type",
      prompt: "Roots `[a, aa]`, sentence `aaa`. What is the result?",
      solution: true,
      answers: ["a"],
      explanation: "The **shortest** root wins.",
      mistakes: [{ answers: ["aa"], why: "Both roots match; the shortest one is used." }],
    },
    {
      kind: "type",
      prompt: "Roots `[a, b, c]`, sentence `aadsfasf absbs bbab cadsfafs`. What is the result?",
      solution: true,
      answers: ["a a b c"],
      explanation: "Every word starts with one of the single-letter roots.",
    },
    {
      kind: "type",
      prompt: "What marker key does this trie use for \"a root ends here\"?",
      solution: true,
      answers: ["$", "\"$\"", "END"],
      explanation: "`END = \"$\"`, which can't collide with a lowercase letter.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity, with total characters C?",
      solution: true,
      options: [
        { text: "O(C): each root and each word is walked once", correct: true },
        { text: "O(roots · words)", why: "That's checking every root against every word." },
        { text: "O(C log C)", why: "No sorting." },
      ],
      explanation: "Build the trie once, then one walk per word.",
    },
    {
      kind: "choice",
      prompt: "Why does walking the trie find the **shortest** root first?",
      options: [
        { text: "It goes character by character, so the earliest root end is the shortest", correct: true },
        { text: "Roots are sorted by length", why: "The walk order guarantees it, not sorting." },
        { text: "It doesn't", why: "It returns at the first end marker, which is the shortest." },
      ],
      explanation: "Prefixes are found in increasing length.",
    },
    {
      kind: "choice",
      prompt: "Why use nested dictionaries instead of a `TrieNode` class?",
      options: [
        { text: "Less code: each dict maps characters to children, with a special key for word ends", correct: true },
        { text: "Dicts are required for tries", why: "Either works; dicts are just shorter." },
        { text: "Classes can't be nested", why: "They can; Implement Trie uses a class." },
      ],
      explanation: "A compact Python trie idiom.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(total characters in the roots)", correct: true },
        { text: "O(sentence length)", why: "The output is separate; the trie stores the roots." },
        { text: "O(1)", why: "The trie grows with the roots." },
      ],
      explanation: "One node per root character (shared prefixes stored once).",
    },
  ],

  "map-sum-pairs": [
    {
      kind: "type",
      prompt: "Fill in the change applied along the key's path.",
      code: `
delta = val - self.values.___(key, 0)`,
      answers: ["get"],
      explanation: "Overwriting a key should only add the difference from its old value.",
    },
    {
      kind: "type",
      prompt: "Fill in the update at each node on the path.",
      code: `
node.total ___ delta`,
      answers: ["+="],
      explanation: "Every prefix of the key includes this key's value.",
    },
    {
      kind: "type",
      prompt: "`insert(\"apple\", 3)`. What does `sum(\"ap\")` return?",
      solution: true,
      answers: ["3"],
      explanation: "Only `apple` starts with `ap`.",
    },
    {
      kind: "type",
      prompt: "Then `insert(\"app\", 2)`. What does `sum(\"ap\")` return?",
      solution: true,
      answers: ["5"],
      explanation: "3 + 2.",
    },
    {
      kind: "type",
      prompt: "Then `insert(\"apple\", 5)`. What does `sum(\"ap\")` return?",
      solution: true,
      answers: ["7"],
      explanation: "The old 3 is replaced by 5: 5 + 2.",
      mistakes: [{ answers: ["10"], why: "Overwriting replaces the old value; it doesn't add to it." }],
    },
    {
      kind: "type",
      prompt: "What does `sum(\"b\")` return when no key starts with `b`?",
      solution: true,
      answers: ["0"],
      explanation: "The path breaks, so the sum is 0.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity of `sum`?",
      solution: true,
      options: [
        { text: "O(prefix length)", correct: true },
        { text: "O(number of keys)", why: "That's summing over a dictionary. Totals are precomputed in the trie." },
        { text: "O(subtree size)", why: "That's walking the subtree; cached totals avoid it." },
      ],
      explanation: "Walk to the node and read its cached total.",
    },
    {
      kind: "choice",
      prompt: "Why keep a separate `values` dictionary?",
      options: [
        { text: "To know the old value when a key is overwritten, so totals can be fixed", correct: true },
        { text: "To answer `sum` faster", why: "`sum` reads trie totals." },
        { text: "It's redundant", why: "Without it, overwriting would double-count." },
      ],
      explanation: "The delta keeps every prefix total correct.",
    },
    {
      kind: "choice",
      prompt: "What does `node.total` hold?",
      solution: true,
      options: [
        { text: "The sum of values of every key whose path goes through this node", correct: true },
        { text: "The value of the key ending here", why: "It includes all longer keys too." },
        { text: "The number of keys below", why: "It's a sum of values, not a count." },
      ],
      explanation: "That's exactly `sum(prefix)` for this node's prefix.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity of `insert`?",
      solution: true,
      options: [
        { text: "O(key length)", correct: true },
        { text: "O(number of keys)", why: "Only the key's own path is updated." },
        { text: "O(1)", why: "Each character on the path is updated." },
      ],
      explanation: "One update per character.",
    },
  ],

  "stream-of-characters": [
    {
      kind: "type",
      prompt: "Fill in how words are inserted.",
      code: `
for character in ___(word):
    node = node.setdefault(character, {})`,
      answers: ["reversed"],
      explanation: "We match from the newest letter backwards, so words are stored backwards.",
    },
    {
      kind: "type",
      prompt: "Fill in how many recent letters are kept.",
      code: `
if len(self.stream) > ___:
    self.stream.pop(0)`,
      answers: ["self.longest_word"],
      explanation: "Older letters can never be part of a matching suffix.",
    },
    {
      kind: "type",
      prompt: "Words `[cd, f, kl]`, stream `a b c d`. What does the query for `d` return?",
      solution: true,
      answers: ["True"],
      explanation: "The stream ends with `cd`.",
    },
    {
      kind: "type",
      prompt: "Same words. After `a b c d e`, what does the query for `e` return?",
      solution: true,
      answers: ["False"],
      explanation: "No word ends with `e`.",
    },
    {
      kind: "type",
      prompt: "Same words, stream `a`…`l` (12 letters). How many queries return `True`?",
      solution: true,
      answers: ["3"],
      explanation: "At `d` (cd), `f` (f) and `l` (kl).",
    },
    {
      kind: "type",
      prompt: "Fill in the walk direction over the stream.",
      code: `
for character in ___(self.stream):`,
      answers: ["reversed"],
      explanation: "Start from the newest letter, matching the reversed words.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity of `query`?",
      solution: true,
      options: [
        { text: "O(longest word length)", correct: true },
        { text: "O(number of words)", why: "That's checking each word's suffix. The trie checks them all at once." },
        { text: "O(stream length)", why: "Only the last `longest_word` letters are kept." },
      ],
      explanation: "One reversed walk, bounded by the longest word.",
    },
    {
      kind: "choice",
      prompt: "Why store words reversed?",
      options: [
        { text: "We need suffixes of the stream; reversed, a suffix becomes a prefix that a trie can walk", correct: true },
        { text: "To save space", why: "Space is the same." },
        { text: "Because words are given reversed", why: "They're given normally." },
      ],
      explanation: "Suffix matching becomes prefix matching.",
    },
    {
      kind: "choice",
      prompt: "What could replace the `pop(0)` list for efficiency?",
      solution: true,
      options: [
        { text: "A `deque(maxlen=...)`, which drops old letters in O(1)", correct: true },
        { text: "A set", why: "Order matters." },
        { text: "A heap", why: "We need recency order, not priority." },
      ],
      explanation: "`list.pop(0)` is O(n).",
    },
    {
      kind: "choice",
      prompt: "When does the walk return `True` early?",
      solution: true,
      options: [
        { text: "As soon as it reaches a node where a (reversed) word ends", correct: true },
        { text: "When the stream is empty", why: "The stream always has the new letter." },
        { text: "Only at the end of the stream", why: "Short words can match early in the backwards walk." },
      ],
      explanation: "Any matching suffix is enough.",
    },
  ],

  "maximum-xor-of-two-numbers-in-an-array": [
    {
      kind: "type",
      prompt: "Fill in the bit we hope to follow for a 1 in the XOR.",
      code: `
bit = (number >> bit_position) & 1
if ___ in node:
    xor |= 1 << bit_position`,
      answers: ["1 - bit", "bit ^ 1"],
      explanation: "Different bits XOR to 1, so look for the opposite bit.",
    },
    {
      kind: "type",
      prompt: "What is `5 ^ 25`?",
      answers: ["28"],
      explanation: "00101 ^ 11001 = 11100 = 28.",
    },
    {
      kind: "type",
      prompt: "`nums = [3, 10, 5, 25, 2, 8]`. What is returned?",
      solution: true,
      answers: ["28"],
      explanation: "5 ^ 25 = 28 is the largest.",
    },
    {
      kind: "type",
      prompt: "`nums = [1, 2]`. What is returned?",
      solution: true,
      answers: ["3"],
      explanation: "01 ^ 10 = 11.",
    },
    {
      kind: "type",
      prompt: "`nums = [0]`. What is returned?",
      solution: true,
      answers: ["0"],
      explanation: "Only one number: 0 ^ 0.",
    },
    {
      kind: "type",
      prompt: "Fill in the bit order: start from which bit?",
      code: `
for bit_position in range(___, -1, -1):`,
      answers: ["BIT_COUNT - 1"],
      explanation: "Highest bit first: it's worth more than all lower bits combined.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity, with n numbers and B bits?",
      solution: true,
      options: [
        { text: "O(n · B)", correct: true },
        { text: "O(n²)", why: "That's trying every pair. The trie finds each best partner in O(B)." },
        { text: "O(n log n)", why: "No sorting is involved." },
      ],
      explanation: "Insert and query each number bit by bit.",
    },
    {
      kind: "choice",
      prompt: "Why is greedy (choose the opposite bit from the top) correct?",
      options: [
        { text: "A 1 in a higher bit outweighs every possible combination of lower bits", correct: true },
        { text: "Because the numbers are sorted", why: "They don't need to be." },
        { text: "It's a heuristic", why: "It's exact, because of binary place values." },
      ],
      explanation: "2^k > 2^(k−1) + … + 1.",
    },
    {
      kind: "choice",
      prompt: "What does each trie level represent?",
      options: [
        { text: "One bit position, from most to least significant", correct: true },
        { text: "One number", why: "Numbers are paths, not levels." },
        { text: "One decimal digit", why: "It's binary." },
      ],
      explanation: "Each node has at most two children: 0 and 1.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(n · B)", correct: true },
        { text: "O(n)", why: "Each number adds up to B nodes." },
        { text: "O(1)", why: "The trie grows with the input." },
      ],
      explanation: "At most B new nodes per number.",
    },
  ],

  "word-search-ii": [
    {
      kind: "type",
      prompt: "Fill in the step that reports a word only once.",
      code: `
if "$" in node:
    found.append(node.___("$"))`,
      answers: ["pop"],
      explanation: "Removing the end marker means the same word can't be found twice.",
    },
    {
      kind: "type",
      prompt: "Fill in the pruning of exhausted branches.",
      code: `
if not node:
    parent.___(letter)`,
      answers: ["pop"],
      explanation: "An empty node has no words left below it, so the branch is removed.",
    },
    {
      kind: "type",
      prompt: "Board `oaan / etae / ihkr / iflv`, words `[oath, pea, eat, rain]`. How many words are found?",
      solution: true,
      answers: ["2"],
      explanation: "`oath` and `eat`.",
    },
    {
      kind: "type",
      prompt: "Same board. Which of the words starting with `p` or `r` is found? (type `none` if neither)",
      solution: true,
      answers: ["none"],
      explanation: "Neither `pea` nor `rain` can be traced on the board.",
    },
    {
      kind: "type",
      prompt: "Board `ab / cd`, words `[abcb]`. What is returned?",
      solution: true,
      answers: ["[]"],
      explanation: "The path would need to reuse `b`.",
    },
    {
      kind: "type",
      prompt: "Fill in the visited marker.",
      code: `
board[row][column] = "___"`,
      answers: ["#"],
      explanation: "`#` isn't in the trie, so the path can't step here again.",
    },
    {
      kind: "choice",
      prompt: "Why use a trie instead of running Word Search once per word?",
      options: [
        { text: "One search explores all words at once, sharing work across common prefixes", correct: true },
        { text: "Word Search can't handle multiple words", why: "It can, one at a time, which repeats work." },
        { text: "Tries use less memory than the board", why: "It's about time, not memory." },
      ],
      explanation: "Searching per word costs a full board search each time.",
    },
    {
      kind: "choice",
      prompt: "What does pruning empty trie branches achieve?",
      solution: true,
      options: [
        { text: "Paths that can't lead to any unfound word are never explored again", correct: true },
        { text: "It saves memory only", why: "It mostly saves search time." },
        { text: "It removes duplicates", why: "Popping `$` handles duplicates." },
      ],
      explanation: "The trie shrinks as words are found.",
    },
    {
      kind: "choice",
      prompt: "Why check `board[next_row][next_column] in node` before recursing?",
      solution: true,
      options: [
        { text: "Only letters that continue some word are worth exploring", correct: true },
        { text: "To check the bounds", why: "Bounds are checked separately." },
        { text: "To find the end of a word", why: "`$` marks the end." },
      ],
      explanation: "The trie guides the search: dead prefixes are skipped.",
    },
    {
      kind: "choice",
      prompt: "What is the worst-case time complexity for an m × n board and max word length L?",
      solution: true,
      options: [
        { text: "O(m · n · 4 · 3^(L−1))", correct: true },
        { text: "O(m · n · words)", why: "The trie avoids searching each word separately." },
        { text: "O(m · n)", why: "Each start can branch along word paths." },
      ],
      explanation: "4 directions first, then up to 3 per step; pruning makes it much faster in practice.",
    },
  ],
});
