import { defineCode } from "../types";

export default defineCode({
  "path-sum": `
class Solution:
    def hasPathSum(self, root: Optional[TreeNode], targetSum: int) -> bool:
        # An empty tree has no root-to-leaf path
        if not root:
            return False
        # At a leaf, the path works only if this value is exactly what is left
        if not root.left and not root.right:
            return targetSum == root.val
        # Subtract this node's value from what the rest of the path must add up to
        remaining = targetSum - root.val
        # A valid path can continue through either child
        return self.hasPathSum(root.left, remaining) or self.hasPathSum(root.right, remaining)
`,

  "binary-watch": `
class Solution:
    def readBinaryWatch(self, turnedOn: int) -> list[str]:
        # Try every time the watch can show and keep those with the right number of lit LEDs
        return [
            # Format as hour:minute with the minute padded to two digits
            f"{hour}:{minute:02d}"
            # Hours go from 0 to 11
            for hour in range(12)
            # Minutes go from 0 to 59
            for minute in range(60)
            # Each 1 bit in the hour and minute is one lit LED
            if bin(hour).count("1") + bin(minute).count("1") == turnedOn
        ]
`,

  "letter-combinations-of-a-phone-number": `
class Solution:
    def letterCombinations(self, digits: str) -> list[str]:
        # No digits means no combinations
        if not digits:
            return []
        # The letters printed on each phone key
        keys = {"2": "abc", "3": "def", "4": "ghi", "5": "jkl",
                "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz"}
        # Every complete combination
        result = []

        # Choose a letter for the digit at position, building up path
        def backtrack(position: int, path: list[str]) -> None:
            # A letter was picked for every digit: save the combination
            if position == len(digits):
                result.append("".join(path))
                return
            # Try each letter on this digit's key
            for letter in keys[digits[position]]:
                # Choose the letter
                path.append(letter)
                # Fill in the next digit
                backtrack(position + 1, path)
                # Undo the choice so the next letter can be tried
                path.pop()

        # Start at the first digit with an empty path
        backtrack(0, [])
        return result
`,

  "subsets": `
class Solution:
    def subsets(self, nums: list[int]) -> list[list[int]]:
        # Every subset found
        result = []

        # Build subsets using only numbers from index start onward
        def backtrack(start: int, path: list[int]) -> None:
            # Every node of the recursion is a subset, so save a copy
            result.append(path[:])
            # Try adding each remaining number
            for index in range(start, len(nums)):
                # Include this number
                path.append(nums[index])
                # Only later numbers may follow, so no subset repeats
                backtrack(index + 1, path)
                # Remove it again to try the next one
                path.pop()

        # Start from the empty subset
        backtrack(0, [])
        return result
`,

  "permutations": `
class Solution:
    def permute(self, nums: list[int]) -> list[list[int]]:
        # Every permutation found
        result = []
        # used[index] is True while nums[index] is in the current path
        used = [False] * len(nums)

        # Extend the current partial permutation
        def backtrack(path: list[int]) -> None:
            # Every number is placed: save a copy
            if len(path) == len(nums):
                result.append(path[:])
                return
            # Try each number that is not already in the path
            for index, number in enumerate(nums):
                # Skip numbers already placed
                if used[index]:
                    continue
                # Choose this number
                used[index] = True
                path.append(number)
                # Fill the next position
                backtrack(path)
                # Undo the choice
                path.pop()
                used[index] = False

        # Start with an empty permutation
        backtrack([])
        return result
`,

  "combination-sum": `
class Solution:
    def combinationSum(self, candidates: list[int], target: int) -> list[list[int]]:
        # Sorting lets us stop early once a candidate is too big
        candidates.sort()
        # Every combination found
        result = []

        # Pick candidates from index start onward until remaining reaches 0
        def backtrack(start: int, remaining: int, path: list[int]) -> None:
            # Hit the target exactly: save a copy
            if remaining == 0:
                result.append(path[:])
                return
            # Try each candidate from start onward
            for index in range(start, len(candidates)):
                # The candidate being tried
                candidate = candidates[index]
                # Sorted, so every later candidate is too big as well
                if candidate > remaining:
                    break
                # Choose it
                path.append(candidate)
                # Same index again: a candidate may be reused
                backtrack(index, remaining - candidate, path)
                # Undo the choice
                path.pop()

        # Start with the full target and an empty combination
        backtrack(0, target, [])
        return result
`,

  "palindrome-partitioning": `
class Solution:
    def partition(self, s: str) -> list[list[str]]:
        # Every valid partition found
        result = []

        # Cut the rest of the string, starting at index start
        def backtrack(start: int, path: list[str]) -> None:
            # The whole string is cut into palindromes: save a copy
            if start == len(s):
                result.append(path[:])
                return
            # Try every possible end for the next piece
            for end in range(start + 1, len(s) + 1):
                # The candidate piece
                piece = s[start:end]
                # Only palindromic pieces are allowed
                if piece == piece[::-1]:
                    # Choose this piece
                    path.append(piece)
                    # Cut the remainder after it
                    backtrack(end, path)
                    # Undo the choice
                    path.pop()

        # Start cutting from the beginning
        backtrack(0, [])
        return result
`,

  "word-search": `
class Solution:
    def exist(self, board: list[list[str]], word: str) -> bool:
        # Grid size
        row_count, column_count = len(board), len(board[0])

        # Can word[position:] be spelled starting at this cell?
        def search(row: int, column: int, position: int) -> bool:
            # Every letter matched
            if position == len(word):
                return True
            # Off the board, or the letter here is wrong (visited cells hold "#")
            if not (0 <= row < row_count and 0 <= column < column_count) or board[row][column] != word[position]:
                return False
            # Mark the cell visited so the path cannot reuse it
            board[row][column] = "#"
            # Try to continue in each of the four directions
            found = (search(row + 1, column, position + 1) or search(row - 1, column, position + 1)
                     or search(row, column + 1, position + 1) or search(row, column - 1, position + 1))
            # Restore the letter for other searches
            board[row][column] = word[position]
            return found

        # Try starting the word from every cell
        return any(search(row, column, 0) for row in range(row_count) for column in range(column_count))
`,

  "restore-ip-addresses": `
class Solution:
    def restoreIpAddresses(self, s: str) -> list[str]:
        # Every valid address found
        result = []

        # Build the address from index start, with the parts chosen so far
        def backtrack(start: int, parts: list[str]) -> None:
            # How many of the four parts are already chosen
            parts_used = len(parts)
            # Digits not used yet
            remaining = len(s) - start
            # Four parts chosen: stop here either way
            if parts_used == 4:
                # Valid only if every digit was used
                if remaining == 0:
                    result.append(".".join(parts))
                # A fifth part is never allowed
                return
            # Prune: each missing part needs between 1 and 3 digits
            if not (4 - parts_used) <= remaining <= 3 * (4 - parts_used):
                return
            # The next part can be 1, 2 or 3 digits long
            for length in range(1, 4):
                # The candidate part
                segment = s[start:start + length]
                # Ran out of digits
                if len(segment) < length:
                    break
                # Leading zeros and values above 255 are not allowed
                if (segment[0] == "0" and length > 1) or int(segment) > 255:
                    break
                # Choose this part
                parts.append(segment)
                # Build the rest of the address
                backtrack(start + length, parts)
                # Undo the choice
                parts.pop()

        # Start at the first digit with no parts
        backtrack(0, [])
        return result
`,

  "n-queens": `
class Solution:
    def solveNQueens(self, n: int) -> list[list[str]]:
        # Every board found
        result = []
        # queens[row] = column of the queen in that row
        queens = []
        # Columns and both diagonal directions already attacked
        used_columns, used_diagonals, used_anti_diagonals = set(), set(), set()

        # Place a queen in this row, then in the rows below
        def backtrack(row: int) -> None:
            # Every row has a queen: draw the board
            if row == n:
                result.append(["." * column + "Q" + "." * (n - column - 1) for column in queens])
                return
            # Try each column in this row
            for column in range(n):
                # Skip squares attacked by an earlier queen
                if column in used_columns or row - column in used_diagonals or row + column in used_anti_diagonals:
                    continue
                # Place the queen and mark what it attacks
                used_columns.add(column)
                used_diagonals.add(row - column)
                used_anti_diagonals.add(row + column)
                queens.append(column)
                # Move on to the next row
                backtrack(row + 1)
                # Remove the queen and unmark what it attacked
                queens.pop()
                used_columns.remove(column)
                used_diagonals.remove(row - column)
                used_anti_diagonals.remove(row + column)

        # Start from the top row
        backtrack(0)
        return result
`,
});
