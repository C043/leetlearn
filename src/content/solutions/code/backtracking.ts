import { defineCode } from "../types";

export default defineCode({
  "path-sum": `
class Solution:
    def hasPathSum(self, root: Optional[TreeNode], targetSum: int) -> bool:
        if not root:
            return False
        if not root.left and not root.right:
            return targetSum == root.val
        remaining = targetSum - root.val
        return self.hasPathSum(root.left, remaining) or self.hasPathSum(root.right, remaining)
`,

  "binary-watch": `
class Solution:
    def readBinaryWatch(self, turnedOn: int) -> list[str]:
        return [
            f"{h}:{m:02d}"
            for h in range(12)
            for m in range(60)
            if bin(h).count("1") + bin(m).count("1") == turnedOn
        ]
`,

  "letter-combinations-of-a-phone-number": `
class Solution:
    def letterCombinations(self, digits: str) -> list[str]:
        if not digits:
            return []
        keys = {"2": "abc", "3": "def", "4": "ghi", "5": "jkl",
                "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz"}
        res = []

        def dfs(i: int, path: list[str]) -> None:
            if i == len(digits):
                res.append("".join(path))
                return
            for c in keys[digits[i]]:
                path.append(c)
                dfs(i + 1, path)
                path.pop()

        dfs(0, [])
        return res
`,

  "subsets": `
class Solution:
    def subsets(self, nums: list[int]) -> list[list[int]]:
        res = []

        def dfs(start: int, path: list[int]) -> None:
            res.append(path[:])  # every node is a subset
            for i in range(start, len(nums)):
                path.append(nums[i])
                dfs(i + 1, path)
                path.pop()

        dfs(0, [])
        return res
`,

  "permutations": `
class Solution:
    def permute(self, nums: list[int]) -> list[list[int]]:
        res = []
        used = [False] * len(nums)

        def dfs(path: list[int]) -> None:
            if len(path) == len(nums):
                res.append(path[:])
                return
            for i, x in enumerate(nums):
                if used[i]:
                    continue
                used[i] = True
                path.append(x)
                dfs(path)
                path.pop()
                used[i] = False

        dfs([])
        return res
`,

  "combination-sum": `
class Solution:
    def combinationSum(self, candidates: list[int], target: int) -> list[list[int]]:
        candidates.sort()
        res = []

        def dfs(start: int, remaining: int, path: list[int]) -> None:
            if remaining == 0:
                res.append(path[:])
                return
            for i in range(start, len(candidates)):
                c = candidates[i]
                if c > remaining:
                    break  # sorted, so every later candidate is too big
                path.append(c)
                dfs(i, remaining - c, path)  # same i: reuse allowed
                path.pop()

        dfs(0, target, [])
        return res
`,

  "palindrome-partitioning": `
class Solution:
    def partition(self, s: str) -> list[list[str]]:
        res = []

        def dfs(start: int, path: list[str]) -> None:
            if start == len(s):
                res.append(path[:])
                return
            for end in range(start + 1, len(s) + 1):
                piece = s[start:end]
                if piece == piece[::-1]:
                    path.append(piece)
                    dfs(end, path)
                    path.pop()

        dfs(0, [])
        return res
`,

  "word-search": `
class Solution:
    def exist(self, board: list[list[str]], word: str) -> bool:
        rows, cols = len(board), len(board[0])

        def dfs(r: int, c: int, i: int) -> bool:
            if i == len(word):
                return True
            if not (0 <= r < rows and 0 <= c < cols) or board[r][c] != word[i]:
                return False
            board[r][c] = "#"  # mark visited
            found = (dfs(r + 1, c, i + 1) or dfs(r - 1, c, i + 1)
                     or dfs(r, c + 1, i + 1) or dfs(r, c - 1, i + 1))
            board[r][c] = word[i]  # unmark
            return found

        return any(dfs(r, c, 0) for r in range(rows) for c in range(cols))
`,

  "restore-ip-addresses": `
class Solution:
    def restoreIpAddresses(self, s: str) -> list[str]:
        res = []

        def dfs(start: int, parts: list[str]) -> None:
            left = len(parts)
            remaining = len(s) - start
            if left == 4:
                if remaining == 0:
                    res.append(".".join(parts))
                return
            if not (4 - left) <= remaining <= 3 * (4 - left):
                return  # prune
            for length in range(1, 4):
                seg = s[start:start + length]
                if len(seg) < length:
                    break
                if (seg[0] == "0" and length > 1) or int(seg) > 255:
                    break
                parts.append(seg)
                dfs(start + length, parts)
                parts.pop()

        dfs(0, [])
        return res
`,

  "n-queens": `
class Solution:
    def solveNQueens(self, n: int) -> list[list[str]]:
        res = []
        queens = []  # queens[r] = column of the queen in row r
        cols, diag, anti = set(), set(), set()

        def dfs(r: int) -> None:
            if r == n:
                res.append(["." * c + "Q" + "." * (n - c - 1) for c in queens])
                return
            for c in range(n):
                if c in cols or r - c in diag or r + c in anti:
                    continue
                cols.add(c); diag.add(r - c); anti.add(r + c)
                queens.append(c)
                dfs(r + 1)
                queens.pop()
                cols.remove(c); diag.remove(r - c); anti.remove(r + c)

        dfs(0)
        return res
`,
});
