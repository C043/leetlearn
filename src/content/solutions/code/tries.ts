import { defineCode } from "../types";

export default defineCode({
  "longest-common-prefix": `
class Solution:
    def longestCommonPrefix(self, strs: list[str]) -> str:
        first = strs[0]
        for i, c in enumerate(first):
            for word in strs[1:]:
                if i == len(word) or word[i] != c:
                    return first[:i]
        return first
`,

  "check-if-a-word-occurs-as-a-prefix-of-a-word-in-a-sentence": `
class Solution:
    def isPrefixOfWord(self, sentence: str, searchWord: str) -> int:
        for i, word in enumerate(sentence.split(), start=1):
            if word.startswith(searchWord):
                return i
        return -1
`,

  "implement-trie-prefix-tree": `
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        node = self.root
        for c in word:
            node = node.children.setdefault(c, TrieNode())
        node.is_end = True

    def _walk(self, s: str):
        node = self.root
        for c in s:
            node = node.children.get(c)
            if not node:
                return None
        return node

    def search(self, word: str) -> bool:
        node = self._walk(word)
        return bool(node and node.is_end)

    def startsWith(self, prefix: str) -> bool:
        return self._walk(prefix) is not None
`,

  "design-add-and-search-words-data-structure": `
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class WordDictionary:
    def __init__(self):
        self.root = TrieNode()

    def addWord(self, word: str) -> None:
        node = self.root
        for c in word:
            node = node.children.setdefault(c, TrieNode())
        node.is_end = True

    def search(self, word: str) -> bool:
        def dfs(node: TrieNode, i: int) -> bool:
            if i == len(word):
                return node.is_end
            c = word[i]
            if c == ".":  # branch into every child
                return any(dfs(child, i + 1) for child in node.children.values())
            child = node.children.get(c)
            return child is not None and dfs(child, i + 1)

        return dfs(self.root, 0)
`,

  "search-suggestions-system": `
from bisect import bisect_left

class Solution:
    def suggestedProducts(self, products: list[str], searchWord: str) -> list[list[str]]:
        products.sort()
        res = []
        prefix = ""
        start = 0
        for c in searchWord:
            prefix += c
            start = bisect_left(products, prefix, start)  # lower bound only moves right
            res.append([p for p in products[start:start + 3] if p.startswith(prefix)])
        return res
`,

  "replace-words": `
class Solution:
    def replaceWords(self, dictionary: list[str], sentence: str) -> str:
        END = "$"
        trie = {}
        for root in dictionary:
            node = trie
            for c in root:
                node = node.setdefault(c, {})
            node[END] = root

        def shortest_root(word: str) -> str:
            node = trie
            for c in word:
                if c not in node:
                    break
                node = node[c]
                if END in node:
                    return node[END]
            return word

        return " ".join(shortest_root(w) for w in sentence.split())
`,

  "map-sum-pairs": `
class TrieNode:
    def __init__(self):
        self.children = {}
        self.total = 0  # sum of values of every key through this node

class MapSum:
    def __init__(self):
        self.root = TrieNode()
        self.values = {}

    def insert(self, key: str, val: int) -> None:
        delta = val - self.values.get(key, 0)
        self.values[key] = val
        node = self.root
        for c in key:
            node = node.children.setdefault(c, TrieNode())
            node.total += delta

    def sum(self, prefix: str) -> int:
        node = self.root
        for c in prefix:
            node = node.children.get(c)
            if not node:
                return 0
        return node.total
`,

  "stream-of-characters": `
class StreamChecker:
    def __init__(self, words: list[str]):
        self.END = "$"
        self.trie = {}
        for word in words:
            node = self.trie
            for c in reversed(word):  # insert reversed
                node = node.setdefault(c, {})
            node[self.END] = True
        self.max_len = max(len(w) for w in words)
        self.stream = []

    def query(self, letter: str) -> bool:
        self.stream.append(letter)
        if len(self.stream) > self.max_len:
            self.stream.pop(0)
        node = self.trie
        for c in reversed(self.stream):  # walk backwards from the newest letter
            node = node.get(c)
            if node is None:
                return False
            if self.END in node:
                return True
        return False
`,

  "maximum-xor-of-two-numbers-in-an-array": `
class Solution:
    def findMaximumXOR(self, nums: list[int]) -> int:
        BITS = max(nums).bit_length()
        trie = {}
        for x in nums:
            node = trie
            for b in range(BITS - 1, -1, -1):
                node = node.setdefault((x >> b) & 1, {})
        best = 0
        for x in nums:
            node = trie
            xor = 0
            for b in range(BITS - 1, -1, -1):
                bit = (x >> b) & 1
                if 1 - bit in node:  # opposite bit makes this xor bit 1
                    xor |= 1 << b
                    node = node[1 - bit]
                else:
                    node = node[bit]
            best = max(best, xor)
        return best
`,

  "word-search-ii": `
class Solution:
    def findWords(self, board: list[list[str]], words: list[str]) -> list[str]:
        trie = {}
        for word in words:
            node = trie
            for c in word:
                node = node.setdefault(c, {})
            node["$"] = word
        rows, cols = len(board), len(board[0])
        found = []

        def dfs(r: int, c: int, parent: dict) -> None:
            ch = board[r][c]
            node = parent[ch]
            if "$" in node:
                found.append(node.pop("$"))  # pop so each word is reported once
            board[r][c] = "#"
            for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                if 0 <= nr < rows and 0 <= nc < cols and board[nr][nc] in node:
                    dfs(nr, nc, node)
            board[r][c] = ch
            if not node:
                parent.pop(ch)  # prune exhausted branches

        for r in range(rows):
            for c in range(cols):
                if board[r][c] in trie:
                    dfs(r, c, trie)
        return found
`,
});
