import { defineSolutions } from "./types";

export default defineSolutions({
  "longest-common-prefix": {
    idea: "Compare column by column (vertical scanning): take the character at position `i` of the first word and check it in every other word. Stop at the first mismatch or when any word runs out.",
    steps: [
      {
        text: "`[\"flower\", \"flow\", \"flight\"]`:",
        visual: {
          kind: "grid",
          rows: [["f", "l", "o", "w", "e", "r"], ["f", "l", "o", "w"], ["f", "l", "i", "g", "h", "t"]],
          tones: { good: [[0, 0], [0, 1], [1, 0], [1, 1], [2, 0], [2, 1]], bad: [[0, 2], [1, 2], [2, 2]] },
          caption: "Column 2 disagrees (o vs i), so the answer is \"fl\"",
        },
      },
      { text: "Trie view: insert all words; the LCP is the path from the root while each node has **one child** and isn't a word end." },
    ],
    time: "O(total characters)",
    space: "O(1)",
  },

  "check-if-a-word-occurs-as-a-prefix-of-a-word-in-a-sentence": {
    idea: "Split the sentence into words and return the 1-based index of the first word that **starts with** `searchWord`, or `-1`.",
    steps: [
      {
        text: "`\"i love eating burger\"`, `searchWord = \"burg\"`:",
        visual: {
          kind: "array",
          values: ["i", "love", "eating", "burger"],
          indices: false,
          tones: { good: [3] },
          caption: "\"burger\" starts with \"burg\", so the answer is 4 (1-based)",
        },
      },
      { text: "With many queries over the same sentence you'd build a trie storing the first word index at each node; for one query, a scan is optimal." },
    ],
    time: "O(n)",
    space: "O(n) for the split (O(1) if scanned in place)",
  },

  "implement-trie-prefix-tree": {
    idea: "Each node has up to 26 children and an `isEnd` flag. Words sharing a prefix share the path for that prefix. `insert` creates missing nodes; `search` walks and checks `isEnd`; `startsWith` just checks that the walk succeeds.",
    steps: [
      {
        text: "After inserting `app`, `apple`, `bat` (green = word end):",
        visual: {
          kind: "ntree",
          root: {
            label: "root",
            tone: "muted",
            children: [
              {
                label: "a",
                children: [{ label: "p", children: [{ label: "p", tone: "good", children: [{ label: "l", children: [{ label: "e", tone: "good" }] }] }] }],
              },
              { label: "b", children: [{ label: "a", children: [{ label: "t", tone: "good" }] }] },
            ],
          },
        },
      },
      { text: "`search(\"ap\")` is false (the node exists but isn't an end). `startsWith(\"ap\")` is true." },
    ],
    time: "O(L) per operation",
    space: "O(total characters)",
  },

  "design-add-and-search-words-data-structure": {
    idea: "A trie where `search` handles `.` by **branching**: on a dot, recursively try every child. Otherwise follow the single matching child.",
    steps: [
      {
        text: "Words `bad`, `dad`, `mad`. `search(\".ad\")` branches at the root.",
        visual: {
          kind: "ntree",
          root: {
            label: "root",
            tone: "muted",
            children: ["b", "d", "m"].map((c, i) => ({
              label: c,
              edge: i === 1 ? "." : undefined,
              tone: "accent" as const,
              children: [{ label: "a", children: [{ label: "d", tone: "good" as const }] }],
            })),
          },
          caption: "Any branch reaching an end node makes the search true",
        },
      },
    ],
    time: "O(L) without dots; O(26^dots · L) worst",
    space: "O(total characters)",
  },

  "search-suggestions-system": {
    idea: "Sort the products. Words sharing a prefix are then contiguous, so for each typed prefix, binary-search its lower bound and take up to 3 words that still start with the prefix.",
    steps: [
      {
        text: "Sorted: `mobile, moneypot, monitor, mouse, mousepad`. Typing `mouse`:",
        visual: {
          kind: "grid",
          rowLabels: ["m", "mo", "mou", "mous", "mouse"],
          rows: [
            ["mobile", "moneypot", "monitor"],
            ["mobile", "moneypot", "monitor"],
            ["mouse", "mousepad", ""],
            ["mouse", "mousepad", ""],
            ["mouse", "mousepad", ""],
          ],
          tones: { good: [[2, 0], [2, 1], [3, 0], [3, 1], [4, 0], [4, 1]] },
        },
      },
      { text: "Trie alternative: store the (sorted) top 3 words at each node during insertion." },
    ],
    time: "O(n log n + L log n)",
    space: "O(1) extra beyond sorting",
  },

  "replace-words": {
    idea: "Put the roots in a trie. For each word in the sentence, walk the trie letter by letter and stop at the **first** node marking a root end: that's the shortest root. If the walk fails, keep the word.",
    steps: [
      {
        text: "Roots `cat`, `bat`, `rat`:",
        visual: {
          kind: "ntree",
          root: {
            label: "root",
            tone: "muted",
            children: ["c", "b", "r"].map((c) => ({ label: c, children: [{ label: "a", children: [{ label: "t", tone: "good" as const }] }] })),
          },
        },
      },
      { text: "`\"the cattle was rattled by the battery\"` becomes `\"the cat was rat by the bat\"`. `cattle` stops at `t` (end), and `the` fails at `h`, so it stays." },
    ],
    time: "O(total characters)",
    space: "O(roots' characters)",
  },

  "map-sum-pairs": {
    idea: "Every trie node stores the **sum of values** of all keys passing through it. On `insert`, compute `delta = val - oldVal(key)` (keep a map of current values) and add `delta` along the path. `sum(prefix)` just walks to the prefix node and reads it.",
    steps: [
      {
        text: "`insert(\"apple\", 3)` then `insert(\"app\", 2)`:",
        visual: {
          kind: "ntree",
          root: {
            label: "root",
            tone: "muted",
            children: [
              {
                label: "a: 5",
                children: [{ label: "p: 5", tone: "good", children: [{ label: "p: 5", children: [{ label: "l: 3", children: [{ label: "e: 3" }] }] }] }],
              },
            ],
          },
          caption: "sum(\"ap\") reads the highlighted node: 5",
        },
      },
      { text: "Re-inserting `apple` with 1 applies `delta = -2` along its path." },
    ],
    time: "O(L) per operation",
    space: "O(total characters)",
  },

  "stream-of-characters": {
    idea: "A query asks: does **some word end** at the newest character? Insert every word **reversed** into a trie, keep the recent stream, and on each letter walk the trie backwards through the stream. Stop at a word end (true) or a missing child (false).",
    steps: [
      {
        text: "Words `cd`, `f`, `kl`, inserted reversed:",
        visual: {
          kind: "ntree",
          root: {
            label: "root",
            tone: "muted",
            children: [
              { label: "d", tone: "accent", children: [{ label: "c", tone: "good" }] },
              { label: "f", tone: "good" },
              { label: "l", children: [{ label: "k", tone: "good" }] },
            ],
          },
          caption: "Stream \"…c d\": walk d → c, reaching a word end, so true",
        },
      },
      { text: "Keep only the last `maxWordLength` characters of the stream." },
    ],
    time: "O(maxLen) per query",
    space: "O(total characters)",
  },

  "maximum-xor-of-two-numbers-in-an-array": {
    idea: "Put every number in a **binary trie** (most significant bit first). For each number, walk the trie greedily choosing the **opposite bit** whenever that child exists. A 1 in a high bit beats anything in the lower bits.",
    steps: [
      {
        text: "`[3,10,5,25,2,8]`: best pair is `5 ^ 25`.",
        visual: {
          kind: "grid",
          rowLabels: ["5", "25", "XOR"],
          colLabels: ["16", "8", "4", "2", "1"],
          rows: [[0, 0, 1, 0, 1], [1, 1, 0, 0, 1], [1, 1, 1, 0, 0]],
          tones: { good: [[2, 0], [2, 1], [2, 2]] },
          caption: "11100₂ = 28",
        },
      },
      { text: "Insert all numbers, then query each one: total O(32n)." },
    ],
    time: "O(32 · n)",
    space: "O(32 · n)",
  },

  "word-search-ii": {
    idea: "Running Word Search once per word repeats work. Instead, put all words in a **trie** and DFS the board **once**, walking the trie alongside. Any cell whose letter isn't a child of the current trie node stops that path immediately.",
    steps: [
      {
        text: "Words `oath, pea, eat, rain`:",
        visual: {
          kind: "grid",
          rows: [["o", "a", "a", "n"], ["e", "t", "a", "e"], ["i", "h", "k", "r"], ["i", "f", "l", "v"]],
          tones: { good: [[0, 0], [0, 1], [1, 1], [2, 1]], accent: [[1, 3], [1, 2]] },
          caption: "\"oath\" (green) and \"eat\" (blue, ending on the shared t)",
        },
      },
      { text: "Store the full word at its end node. When found, add it and **clear** it to avoid duplicates. Remove trie leaves once exhausted to keep pruning effective." },
    ],
    time: "O(m · n · 4 · 3^(L-1))",
    space: "O(total characters)",
  },
});
