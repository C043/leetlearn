import { defineCode } from "../types";

export default defineCode({
  "find-the-town-judge": `
class Solution:
    def findJudge(self, n: int, trust: list[list[int]]) -> int:
        # score[person] = people who trust them minus people they trust
        score = [0] * (n + 1)
        # Each trust relation goes from truster to trusted
        for truster, trusted in trust:
            # Trusting someone disqualifies you from being the judge
            score[truster] -= 1
            # Being trusted counts toward being the judge
            score[trusted] += 1
        # Check each person
        for person in range(1, n + 1):
            # The judge is trusted by everyone else and trusts nobody
            if score[person] == n - 1:
                return person
        # No judge
        return -1
`,

  "find-if-path-exists-in-graph": `
from collections import defaultdict

class Solution:
    def validPath(self, n: int, edges: list[list[int]], source: int, destination: int) -> bool:
        # graph[node] = the nodes connected to it
        graph = defaultdict(list)
        # Edges go both ways
        for first, second in edges:
            graph[first].append(second)
            graph[second].append(first)
        # Nodes already found, so none is visited twice
        seen = {source}
        # Nodes still to explore
        stack = [source]
        # Depth-first search from the source
        while stack:
            # Take the most recently found node
            node = stack.pop()
            # Reached the destination
            if node == destination:
                return True
            # Look at every neighbor
            for neighbor in graph[node]:
                # Only explore neighbors not found yet
                if neighbor not in seen:
                    seen.add(neighbor)
                    stack.append(neighbor)
        # Explored everything reachable without finding the destination
        return False
`,

  "number-of-islands": `
class Solution:
    def numIslands(self, grid: list[list[str]]) -> int:
        # Grid size
        row_count, column_count = len(grid), len(grid[0])

        # Turn the whole island containing this cell into water
        def sink(row: int, column: int) -> None:
            # Cells still to process
            stack = [(row, column)]
            # Sink the starting cell
            grid[row][column] = "0"
            # Spread through the island
            while stack:
                # Take a land cell
                row, column = stack.pop()
                # Look at the four neighbors
                for next_row, next_column in ((row + 1, column), (row - 1, column), (row, column + 1), (row, column - 1)):
                    # Inside the grid and still land
                    if 0 <= next_row < row_count and 0 <= next_column < column_count and grid[next_row][next_column] == "1":
                        # Sink it now so it is not added twice
                        grid[next_row][next_column] = "0"
                        stack.append((next_row, next_column))

        # Number of islands found
        islands = 0
        # Scan every cell
        for row in range(row_count):
            for column in range(column_count):
                # Land that was not sunk yet belongs to a new island
                if grid[row][column] == "1":
                    islands += 1
                    # Sink the island so its other cells are not counted again
                    sink(row, column)
        # Total islands
        return islands
`,

  "number-of-provinces": `
class Solution:
    def findCircleNum(self, isConnected: list[list[int]]) -> int:
        # Number of cities
        city_count = len(isConnected)
        # seen[city] = city already belongs to a counted province
        seen = [False] * city_count

        # Visit every city reachable from this one
        def explore(city: int) -> None:
            # Check every other city
            for other in range(city_count):
                # Directly connected and not visited yet
                if isConnected[city][other] and not seen[other]:
                    seen[other] = True
                    # Continue from that city
                    explore(other)

        # Number of provinces found
        provinces = 0
        # Try every city as a starting point
        for city in range(city_count):
            # An unvisited city starts a new province
            if not seen[city]:
                seen[city] = True
                # Mark the whole province
                explore(city)
                provinces += 1
        # Total provinces
        return provinces
`,

  "clone-graph": `
class Solution:
    def cloneGraph(self, node: Optional[Node]) -> Optional[Node]:
        # Original -> clone, doubles as the visited set
        clones = {}

        # Return the clone of original, creating it if needed
        def clone(original: Node) -> Node:
            # Already cloned: reuse it
            if original in clones:
                return clones[original]
            # Make a new node with the same value
            copy = Node(original.val)
            # Register before recursing to handle cycles
            clones[original] = copy
            # Clone every neighbor and link them to the copy
            copy.neighbors = [clone(neighbor) for neighbor in original.neighbors]
            return copy

        # An empty graph clones to nothing
        return clone(node) if node else None
`,

  "course-schedule": `
from collections import deque

class Solution:
    def canFinish(self, numCourses: int, prerequisites: list[list[int]]) -> bool:
        # graph[course] = courses that need it first
        graph = [[] for _ in range(numCourses)]
        # indegree[course] = prerequisites not yet taken
        indegree = [0] * numCourses
        # Each pair means: take prerequisite before course
        for course, prerequisite in prerequisites:
            graph[prerequisite].append(course)
            indegree[course] += 1
        # Start with courses that have no prerequisites
        queue = deque(course for course in range(numCourses) if indegree[course] == 0)
        # Courses taken so far
        taken = 0
        # Take courses one by one
        while queue:
            # Take an available course
            course = queue.popleft()
            taken += 1
            # This course is one less prerequisite for every course that needs it
            for following in graph[course]:
                indegree[following] -= 1
                # All its prerequisites are done: it is available now
                if indegree[following] == 0:
                    queue.append(following)
        # A cycle leaves some courses never available
        return taken == numCourses
`,

  "course-schedule-ii": `
from collections import deque

class Solution:
    def findOrder(self, numCourses: int, prerequisites: list[list[int]]) -> list[int]:
        # graph[course] = courses that need it first
        graph = [[] for _ in range(numCourses)]
        # indegree[course] = prerequisites not yet taken
        indegree = [0] * numCourses
        # Each pair means: take prerequisite before course
        for course, prerequisite in prerequisites:
            graph[prerequisite].append(course)
            indegree[course] += 1
        # Start with courses that have no prerequisites
        queue = deque(course for course in range(numCourses) if indegree[course] == 0)
        # The order in which courses are taken
        order = []
        # Take courses one by one
        while queue:
            # Take an available course
            course = queue.popleft()
            order.append(course)
            # This course is one less prerequisite for every course that needs it
            for following in graph[course]:
                indegree[following] -= 1
                # All its prerequisites are done: it is available now
                if indegree[following] == 0:
                    queue.append(following)
        # If some course was never taken there is a cycle, so no valid order
        return order if len(order) == numCourses else []
`,

  "rotting-oranges": `
from collections import deque

class Solution:
    def orangesRotting(self, grid: list[list[int]]) -> int:
        # Grid size
        row_count, column_count = len(grid), len(grid[0])
        # Rotten oranges that will spread the rot next
        queue = deque()
        # Fresh oranges still left
        fresh = 0
        # Scan the grid once
        for row in range(row_count):
            for column in range(column_count):
                # Every rotten orange starts spreading at minute 0
                if grid[row][column] == 2:
                    queue.append((row, column))
                # Count the fresh ones
                elif grid[row][column] == 1:
                    fresh += 1
        # Minutes passed
        minutes = 0
        # Spread while there is rot to spread and fresh oranges to reach
        while queue and fresh:
            minutes += 1
            # One BFS layer = one minute
            for _ in range(len(queue)):
                # A rotten orange from the previous minute
                row, column = queue.popleft()
                # Look at the four neighbors
                for next_row, next_column in ((row + 1, column), (row - 1, column), (row, column + 1), (row, column - 1)):
                    # Inside the grid and fresh
                    if 0 <= next_row < row_count and 0 <= next_column < column_count and grid[next_row][next_column] == 1:
                        # It rots now
                        grid[next_row][next_column] = 2
                        fresh -= 1
                        # It spreads the rot next minute
                        queue.append((next_row, next_column))
        # Fresh oranges left means some can never rot
        return -1 if fresh else minutes
`,

  "pacific-atlantic-water-flow": `
class Solution:
    def pacificAtlantic(self, heights: list[list[int]]) -> list[list[int]]:
        # Grid size
        row_count, column_count = len(heights), len(heights[0])

        # Every cell whose water can flow down to one of the starting cells
        def climb(starts: list[tuple[int, int]]) -> set[tuple[int, int]]:
            # Cells reached so far
            seen = set(starts)
            # Cells still to explore
            stack = list(starts)
            # Walk backwards from the ocean, going uphill
            while stack:
                # Take a reached cell
                row, column = stack.pop()
                # Look at the four neighbors
                for next_row, next_column in ((row + 1, column), (row - 1, column), (row, column + 1), (row, column - 1)):
                    # Inside the grid, not seen yet, and uphill only (water flows down from it)
                    if (0 <= next_row < row_count and 0 <= next_column < column_count and (next_row, next_column) not in seen
                            and heights[next_row][next_column] >= heights[row][column]):
                        # Mark it reached and explore from it
                        seen.add((next_row, next_column))
                        stack.append((next_row, next_column))
            # All cells that drain into this ocean
            return seen

        # The Pacific touches the top row and the left column
        pacific = climb([(0, column) for column in range(column_count)] + [(row, 0) for row in range(row_count)])
        # The Atlantic touches the bottom row and the right column
        atlantic = climb([(row_count - 1, column) for column in range(column_count)] + [(row, column_count - 1) for row in range(row_count)])
        # Cells that reach both oceans
        return [[row, column] for row, column in pacific & atlantic]
`,

  "word-ladder": `
from collections import deque
from string import ascii_lowercase

class Solution:
    def ladderLength(self, beginWord: str, endWord: str, wordList: list[str]) -> int:
        # Words that can still be used; a set makes lookups fast
        words = set(wordList)
        # The end word must be in the list
        if endWord not in words:
            return 0
        # Breadth-first search: (word, number of words in the ladder so far)
        queue = deque([(beginWord, 1)])
        # The begin word is already used
        words.discard(beginWord)
        # Explore ladders shortest first
        while queue:
            # The next word to expand
            word, steps = queue.popleft()
            # Reached the end word: this is the shortest ladder
            if word == endWord:
                return steps
            # Try changing each position
            for position in range(len(word)):
                # Try every letter in that position
                for letter in ascii_lowercase:
                    # The word with one letter changed
                    candidate = word[:position] + letter + word[position + 1:]
                    # A real, unused word is the next rung
                    if candidate in words:
                        # Remove it so it is visited only once
                        words.remove(candidate)
                        queue.append((candidate, steps + 1))
        # The end word cannot be reached
        return 0
`,
});
