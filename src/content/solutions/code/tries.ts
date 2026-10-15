import { defineCode } from "../types";

export default defineCode({
  "longest-common-prefix": `
class Solution:
    def longestCommonPrefix(self, strs: list[str]) -> str:
        # The prefix can't be longer than the first word
        first = strs[0]
        # Check the first word one character at a time
        for position, character in enumerate(first):
            # Compare with the same position in every other word
            for word in strs[1:]:
                # Word too short, or a different character: the prefix ends here
                if position == len(word) or word[position] != character:
                    return first[:position]
        # The whole first word is a common prefix
        return first
`,

  "check-if-a-word-occurs-as-a-prefix-of-any-word-in-a-sentence": `
class Solution:
    def isPrefixOfWord(self, sentence: str, searchWord: str) -> int:
        # Words are numbered from 1
        for position, word in enumerate(sentence.split(), start=1):
            # First word that starts with searchWord
            if word.startswith(searchWord):
                return position
        # No word starts with it
        return -1
`,

  "implement-trie-prefix-tree": `
class TrieNode:
    def __init__(self):
        # Next character -> child node
        self.children = {}
        # True if a word ends at this node
        self.is_end = False

class Trie:
    def __init__(self):
        # The root stands for the empty prefix
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        # Start at the root
        node = self.root
        # Follow (or create) one child per character
        for character in word:
            node = node.children.setdefault(character, TrieNode())
        # Mark that a word ends here
        node.is_end = True

    def _walk(self, text: str):
        # Start at the root
        node = self.root
        # Follow one child per character
        for character in text:
            node = node.children.get(character)
            # The path breaks: no word has this prefix
            if not node:
                return None
        # The node reached by the whole text
        return node

    def search(self, word: str) -> bool:
        # The path must exist and a word must end there
        node = self._walk(word)
        return bool(node and node.is_end)

    def startsWith(self, prefix: str) -> bool:
        # The path only needs to exist
        return self._walk(prefix) is not None
`,

  "design-add-and-search-words-data-structure": `
class TrieNode:
    def __init__(self):
        # Next character -> child node
        self.children = {}
        # True if a word ends at this node
        self.is_end = False

class WordDictionary:
    def __init__(self):
        # The root stands for the empty prefix
        self.root = TrieNode()

    def addWord(self, word: str) -> None:
        # Start at the root
        node = self.root
        # Follow (or create) one child per character
        for character in word:
            node = node.children.setdefault(character, TrieNode())
        # Mark that a word ends here
        node.is_end = True

    def search(self, word: str) -> bool:
        # Can word[position:] be matched starting from node?
        def match(node: TrieNode, position: int) -> bool:
            # Every character matched: a word must end here
            if position == len(word):
                return node.is_end
            # The character to match
            character = word[position]
            # Branch into every child
            if character == ".":
                return any(match(child, position + 1) for child in node.children.values())
            # A normal letter must follow its one child
            child = node.children.get(character)
            return child is not None and match(child, position + 1)

        # Start from the root and the first character
        return match(self.root, 0)
`,

  "search-suggestions-system": `
from bisect import bisect_left

class Solution:
    def suggestedProducts(self, products: list[str], searchWord: str) -> list[list[str]]:
        # Sorted, words sharing a prefix sit next to each other
        products.sort()
        # Suggestions after each typed character
        result = []
        # What has been typed so far
        prefix = ""
        # First product that could match the prefix
        start = 0
        # Type one character at a time
        for character in searchWord:
            prefix += character
            # Lower bound only moves right
            start = bisect_left(products, prefix, start)
            # The next three products, kept only if they really match
            result.append([product for product in products[start:start + 3] if product.startswith(prefix)])
        # Suggestions for every prefix
        return result
`,

  "replace-words": `
class Solution:
    def replaceWords(self, dictionary: list[str], sentence: str) -> str:
        # Key that marks where a root ends
        END = "$"
        # A trie made of nested dictionaries
        trie = {}
        # Insert every root
        for root in dictionary:
            # Start at the top of the trie
            node = trie
            # Follow (or create) one level per character
            for character in root:
                node = node.setdefault(character, {})
            # Store the root where it ends
            node[END] = root

        # The shortest root that starts word, or word itself
        def shortest_root(word: str) -> str:
            # Start at the top of the trie
            node = trie
            # Follow the word's characters
            for character in word:
                # No root continues this way
                if character not in node:
                    break
                # Step down to the next character
                node = node[character]
                # A root ends here: it is the shortest one
                if END in node:
                    return node[END]
            # No root matched
            return word

        # Replace each word and join the sentence back together
        return " ".join(shortest_root(word) for word in sentence.split())
`,

  "map-sum-pairs": `
class TrieNode:
    def __init__(self):
        # Next character -> child node
        self.children = {}
        # Sum of values of every key through this node
        self.total = 0

class MapSum:
    def __init__(self):
        # The root stands for the empty prefix
        self.root = TrieNode()
        # The current value of each key
        self.values = {}

    def insert(self, key: str, val: int) -> None:
        # How much the totals change (handles overwriting a key)
        delta = val - self.values.get(key, 0)
        # Remember the new value
        self.values[key] = val
        # Start at the root
        node = self.root
        # Every prefix of key gets the change
        for character in key:
            node = node.children.setdefault(character, TrieNode())
            node.total += delta

    def sum(self, prefix: str) -> int:
        # Start at the root
        node = self.root
        # Walk down the prefix
        for character in prefix:
            node = node.children.get(character)
            # No key has this prefix
            if not node:
                return 0
        # The node already holds the sum for this prefix
        return node.total
`,

  "stream-of-characters": `
class StreamChecker:
    def __init__(self, words: list[str]):
        # Key that marks where a word ends
        self.END = "$"
        # A trie of the words written backwards
        self.trie = {}
        # Insert every word
        for word in words:
            # Start at the top of the trie
            node = self.trie
            # Insert reversed
            for character in reversed(word):
                node = node.setdefault(character, {})
            # Mark the end of the word
            node[self.END] = True
        # Letters older than the longest word can never matter
        self.longest_word = max(len(word) for word in words)
        # The most recent letters
        self.stream = []

    def query(self, letter: str) -> bool:
        # Add the new letter
        self.stream.append(letter)
        # Forget the oldest letter once there are too many
        if len(self.stream) > self.longest_word:
            self.stream.pop(0)
        # Start at the top of the trie
        node = self.trie
        # Walk backwards from the newest letter
        for character in reversed(self.stream):
            node = node.get(character)
            # No word ends with these letters
            if node is None:
                return False
            # A whole word matched the latest letters
            if self.END in node:
                return True
        # Ran out of letters
        return False
`,

  "maximum-xor-of-two-numbers-in-an-array": `
class Solution:
    def findMaximumXOR(self, nums: list[int]) -> int:
        # How many bits the largest number needs
        BIT_COUNT = max(nums).bit_length()
        # A trie of bits, most significant first
        trie = {}
        # Insert every number
        for number in nums:
            # Start at the top of the trie
            node = trie
            # From the highest bit down to bit 0
            for bit_position in range(BIT_COUNT - 1, -1, -1):
                node = node.setdefault((number >> bit_position) & 1, {})
        # Largest XOR found
        best = 0
        # Find the best partner for every number
        for number in nums:
            # Start at the top of the trie
            node = trie
            # XOR with the best partner, built bit by bit
            xor = 0
            # Higher bits matter most, so decide them first
            for bit_position in range(BIT_COUNT - 1, -1, -1):
                # This number's bit at this position
                bit = (number >> bit_position) & 1
                # Opposite bit makes this xor bit 1
                if 1 - bit in node:
                    xor |= 1 << bit_position
                    node = node[1 - bit]
                # Otherwise follow the same bit
                else:
                    node = node[bit]
            # Keep the best
            best = max(best, xor)
        # Largest XOR of any pair
        return best
`,

  "word-search-ii": `
class Solution:
    def findWords(self, board: list[list[str]], words: list[str]) -> list[str]:
        # A trie of all words made of nested dictionaries
        trie = {}
        # Insert every word
        for word in words:
            # Start at the top of the trie
            node = trie
            # Follow (or create) one level per character
            for character in word:
                node = node.setdefault(character, {})
            # Store the whole word where it ends
            node["$"] = word
        # Grid size
        row_count, column_count = len(board), len(board[0])
        # Words found on the board
        found = []

        # Explore from this cell, whose letter is a child of parent in the trie
        def explore(row: int, column: int, parent: dict) -> None:
            # The letter in this cell
            letter = board[row][column]
            # The trie node for the path so far
            node = parent[letter]
            # Pop so each word is reported once
            if "$" in node:
                found.append(node.pop("$"))
            # Mark the cell visited
            board[row][column] = "#"
            # Try the four neighbors
            for next_row, next_column in ((row + 1, column), (row - 1, column), (row, column + 1), (row, column - 1)):
                # Inside the board, and its letter continues some word
                if 0 <= next_row < row_count and 0 <= next_column < column_count and board[next_row][next_column] in node:
                    explore(next_row, next_column, node)
            # Restore the letter
            board[row][column] = letter
            # Prune exhausted branches
            if not node:
                parent.pop(letter)

        # Start from every cell whose letter begins some word
        for row in range(row_count):
            for column in range(column_count):
                # Only start where the letter begins some word
                if board[row][column] in trie:
                    explore(row, column, trie)
        # Every word found
        return found
`,
});
