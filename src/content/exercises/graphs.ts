import { defineExercises } from "./types";

export default defineExercises({
  "find-the-town-judge": [
    {
      kind: "type",
      prompt: "Fill in the score the judge must have.",
      code: `
if score[person] == ___:
    return person`,
      answers: ["n - 1"],
      explanation: "Trusted by all n − 1 others (+ n − 1) and trusting nobody (− 0).",
    },
    {
      kind: "type",
      prompt: "Fill in what happens to the truster's score.",
      code: `
for truster, trusted in trust:
    score[truster] ___ 1
    score[trusted] += 1`,
      answers: ["-="],
      explanation: "Trusting anyone disqualifies you, and −1 guarantees you can never reach n − 1.",
    },
    {
      kind: "type",
      prompt: "`n = 3`, `trust = [[1, 3], [2, 3]]`. What is returned?",
      solution: true,
      answers: ["3"],
      explanation: "Both others trust 3, and 3 trusts nobody.",
    },
    {
      kind: "type",
      prompt: "`n = 3`, `trust = [[1, 3], [2, 3], [3, 1]]`. What is returned?",
      solution: true,
      answers: ["-1"],
      explanation: "3 trusts 1, so 3 isn't the judge (score 1, not 2).",
    },
    {
      kind: "type",
      prompt: "`n = 1`, `trust = []`. What is returned?",
      solution: true,
      answers: ["1"],
      explanation: "The only person is trusted by all 0 others and trusts nobody: score 0 = n − 1.",
    },
    {
      kind: "type",
      prompt: "Fill in the size of the score array.",
      code: `
score = [0] * (___)`,
      answers: ["n + 1"],
      explanation: "People are labelled 1..n, so index n must exist (index 0 is unused).",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity, with t trust pairs?",
      solution: true,
      options: [
        { text: "O(n + t)", correct: true },
        { text: "O(n · t)", why: "Each pair is processed once, then each person is checked once." },
        { text: "O(n²)", why: "We never compare all pairs of people." },
      ],
      explanation: "One pass over trust, one pass over people.",
    },
    {
      kind: "choice",
      prompt: "In graph terms, what is the judge?",
      options: [
        { text: "A node with in-degree n − 1 and out-degree 0", correct: true },
        { text: "The node with the most edges", why: "Edge count alone ignores direction." },
        { text: "The root of a tree", why: "The trust graph isn't necessarily a tree." },
      ],
      explanation: "The score combines in-degree minus out-degree into one number.",
    },
    {
      kind: "choice",
      prompt: "Why can at most one judge exist?",
      options: [
        { text: "Two judges would have to trust each other, but judges trust nobody", correct: true },
        { text: "Because n is odd", why: "n can be any value." },
        { text: "Because scores are unique", why: "Scores can repeat; the logic of trust rules it out." },
      ],
      explanation: "Each judge must be trusted by the other, which contradicts \"trusts nobody\".",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(n)", correct: true },
        { text: "O(t)", why: "We store one score per person, not per pair." },
        { text: "O(1)", why: "The score array grows with n." },
      ],
      explanation: "One integer per person.",
    },
  ],

  "find-if-path-exists-in-graph": [
    {
      kind: "type",
      prompt: "Fill in the second line so edges go both ways.",
      code: `
graph[first].append(second)
graph[___].append(first)`,
      answers: ["second"],
      explanation: "The graph is undirected: an edge can be walked in either direction.",
    },
    {
      kind: "type",
      prompt: "Fill in the step that prevents a node from being added twice.",
      code: `
if neighbor not in seen:
    seen.___(neighbor)
    stack.append(neighbor)`,
      answers: ["add"],
      explanation: "Marking when pushing (not when popping) keeps each node on the stack at most once.",
    },
    {
      kind: "type",
      prompt: "`n = 6`, edges `[[0,1],[0,2],[3,5],[5,4],[4,3]]`, `source = 0`, `destination = 5`. What is returned?",
      solution: true,
      answers: ["False"],
      explanation: "{0, 1, 2} and {3, 4, 5} are separate components.",
    },
    {
      kind: "type",
      prompt: "`n = 3`, edges `[[0,1],[1,2],[2,0]]`, `source = 0`, `destination = 2`. What is returned?",
      solution: true,
      answers: ["True"],
      explanation: "0 and 2 are directly connected.",
    },
    {
      kind: "type",
      prompt: "`n = 1`, no edges, `source = destination = 0`. What is returned?",
      solution: true,
      answers: ["True"],
      explanation: "The source is the destination: the first pop matches.",
    },
    {
      kind: "type",
      prompt: "Using `stack.pop()` makes this DFS. Which deque method would make it BFS?",
      answers: ["popleft"],
      explanation: "Take from the front of a deque for first-in-first-out order.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity, with V nodes and E edges?",
      solution: true,
      options: [
        { text: "O(V + E)", correct: true },
        { text: "O(V · E)", why: "Each node is expanded once, and each edge is looked at twice in total." },
        { text: "O(V²)", why: "That's an adjacency matrix. With lists it's V + E." },
      ],
      explanation: "Every node is visited at most once; every edge is scanned from both ends.",
    },
    {
      kind: "choice",
      prompt: "Which other data structure answers \"are these two connected?\" efficiently?",
      options: [
        { text: "Union-Find (disjoint set union)", correct: true },
        { text: "A heap", why: "Heaps order by priority; they don't track connectivity." },
        { text: "A trie", why: "Tries store strings by prefix." },
      ],
      explanation: "Union every edge, then check if source and destination share a root.",
    },
    {
      kind: "choice",
      prompt: "What happens without the `seen` set?",
      options: [
        { text: "Cycles make the search loop forever", correct: true },
        { text: "Nothing; it's just faster with it", why: "In `0–1–2–0`, nodes would be pushed again and again." },
        { text: "The answer becomes wrong but the loop ends", why: "The loop may never end." },
      ],
      explanation: "Graphs (unlike trees) can have cycles, so visited nodes must be tracked.",
    },
    {
      kind: "choice",
      prompt: "What is the space complexity?",
      solution: true,
      options: [
        { text: "O(V + E) for the adjacency list, plus O(V) for `seen` and the stack", correct: true },
        { text: "O(V)", why: "The adjacency list stores every edge too." },
        { text: "O(1)", why: "We build a graph and a visited set." },
      ],
      explanation: "The graph itself dominates.",
    },
  ],

  "number-of-islands": [
    {
      kind: "type",
      prompt: "Fill in how a visited land cell is marked.",
      code: `
grid[next_row][next_column] = "___"`,
      answers: ["0"],
      explanation: "Turning land into water means it can never be counted or visited again.",
    },
    {
      kind: "type",
      prompt: "Fill in what each new, unsunk land cell means.",
      code: `
if grid[row][column] == "1":
    islands ___ 1
    sink(row, column)`,
      answers: ["+="],
      explanation: "It's the first cell we've seen of a new island.",
    },
    {
      kind: "type",
      prompt: "Grid rows `11110 / 11010 / 11000 / 00000`. What is returned?",
      solution: true,
      answers: ["1"],
      explanation: "All the 1s are connected.",
    },
    {
      kind: "type",
      prompt: "Grid rows `11000 / 11000 / 00100 / 00011`. What is returned?",
      solution: true,
      answers: ["3"],
      explanation: "Top-left block, the single middle cell, and the bottom-right pair.",
    },
    {
      kind: "type",
      prompt: "Grid rows `101 / 010 / 101`. What is returned?",
      solution: true,
      answers: ["5"],
      explanation: "Diagonal neighbours don't connect, so every 1 is its own island.",
      mistakes: [{ answers: ["1"], why: "Only horizontal and vertical neighbours connect, not diagonals." }],
    },
    {
      kind: "type",
      prompt: "How many neighbours does each land cell check?",
      solution: true,
      answers: ["4"],
      explanation: "Up, down, left, right.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity for an m × n grid?",
      solution: true,
      options: [
        { text: "O(m · n)", correct: true },
        { text: "O((m · n)²)", why: "A sunk cell is never processed again, so each cell is handled a constant number of times." },
        { text: "O(m + n)", why: "Every cell must be looked at." },
      ],
      explanation: "Each cell is scanned once and sunk at most once.",
    },
    {
      kind: "choice",
      prompt: "Why sink a cell when it's **pushed**, not when it's popped?",
      solution: true,
      options: [
        { text: "Otherwise the same cell could be pushed several times by different neighbours", correct: true },
        { text: "It's required by Python", why: "It's about avoiding duplicates on the stack." },
        { text: "No difference", why: "It still works, but can push cells multiple times." },
      ],
      explanation: "Marking on discovery keeps the stack small.",
    },
    {
      kind: "choice",
      prompt: "What is this algorithm called in general?",
      options: [
        { text: "Counting connected components (flood fill)", correct: true },
        { text: "Shortest path", why: "We don't measure distances." },
        { text: "Topological sort", why: "That orders a directed acyclic graph." },
      ],
      explanation: "Each flood fill marks one component; the count of fills is the answer.",
    },
    {
      kind: "choice",
      prompt: "What's a downside of sinking the input grid?",
      options: [
        { text: "It destroys the caller's grid; use a `seen` set if the input must be kept", correct: true },
        { text: "It gives wrong answers", why: "It's correct; sunk land just can't be recounted." },
        { text: "It's slower", why: "It's usually faster than hashing coordinates." },
      ],
      explanation: "In-place marking trades input preservation for memory.",
    },
  ],

  "number-of-provinces": [
    {
      kind: "type",
      prompt: "Fill in the check for a directly connected, unvisited city.",
      code: `
if isConnected[city][other] and not ___:
    seen[other] = True
    explore(other)`,
      answers: ["seen[other]"],
      explanation: "Only explore cities not already in a counted province.",
    },
    {
      kind: "type",
      prompt: "Matrix `[[1,1,0],[1,1,0],[0,0,1]]`. What is returned?",
      solution: true,
      answers: ["2"],
      explanation: "Cities 0 and 1 form one province; city 2 is alone.",
    },
    {
      kind: "type",
      prompt: "Matrix `[[1,0,0],[0,1,0],[0,0,1]]`. What is returned?",
      solution: true,
      answers: ["3"],
      explanation: "No connections, so every city is its own province.",
    },
    {
      kind: "type",
      prompt: "Matrix `[[1,0,1],[0,1,0],[1,0,1]]`. What is returned?",
      solution: true,
      answers: ["2"],
      explanation: "Cities 0 and 2 are connected; city 1 is alone.",
    },
    {
      kind: "type",
      prompt: "Fill in when a new province is counted.",
      code: `
for city in range(city_count):
    if not seen[city]:
        seen[city] = True
        explore(city)
        provinces ___ 1`,
      answers: ["+="],
      explanation: "Every unvisited city starts a new province.",
    },
    {
      kind: "type",
      prompt: "What is `isConnected[i][i]` always?",
      answers: ["1"],
      explanation: "Each city is connected to itself by definition.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity for n cities?",
      solution: true,
      options: [
        { text: "O(n²)", correct: true },
        { text: "O(n)", why: "Each city scans a full row of the matrix: n entries." },
        { text: "O(n³)", why: "Each row is scanned once, when its city is explored." },
      ],
      explanation: "The adjacency matrix has n² entries, each read once.",
    },
    {
      kind: "choice",
      prompt: "How is this the same as Number of Islands?",
      options: [
        { text: "Both count connected components; here the graph is an adjacency matrix instead of a grid", correct: true },
        { text: "Both are shortest-path problems", why: "Neither measures distance." },
        { text: "They're unrelated", why: "Same idea: flood-fill each unvisited component and count." },
      ],
      explanation: "Only the way neighbours are listed differs.",
    },
    {
      kind: "choice",
      prompt: "Which data structure solves this with \"merge\" operations?",
      options: [
        { text: "Union-Find: start with n groups and merge for each connection", correct: true },
        { text: "A min-heap", why: "No ordering is needed." },
        { text: "A stack of cities", why: "That's just iterative DFS." },
      ],
      explanation: "The answer is the number of groups left.",
    },
    {
      kind: "choice",
      prompt: "What is the extra space complexity?",
      solution: true,
      options: [
        { text: "O(n) for `seen` and the recursion", correct: true },
        { text: "O(n²)", why: "The matrix is the input; we only add O(n)." },
        { text: "O(1)", why: "We store a flag per city." },
      ],
      explanation: "One flag per city, and recursion up to n deep.",
    },
  ],

  "clone-graph": [
    {
      kind: "type",
      prompt: "Fill in the step that registers the copy **before** cloning neighbours.",
      code: `
copy = Node(original.val)
clones[___] = copy`,
      answers: ["original"],
      explanation: "The map goes from original to clone; registering first stops infinite recursion on cycles.",
    },
    {
      kind: "type",
      prompt: "Fill in the neighbour list of the copy.",
      code: `
copy.neighbors = [___(neighbor) for neighbor in original.neighbors]`,
      answers: ["clone"],
      explanation: "Each neighbour must be the **clone** of the original neighbour, not the original itself.",
    },
    {
      kind: "type",
      prompt: "Graph 1–2–3–4–1 (a square). How many new nodes are created?",
      solution: true,
      answers: ["4"],
      explanation: "One clone per original node; the map makes sure each is created once.",
    },
    {
      kind: "type",
      prompt: "In the square 1–2–3–4–1, the clone of 1 has neighbours with which values? (in order)",
      solution: true,
      answers: ["[2, 4]", "2, 4", "2 4"],
      explanation: "Same values as the original's neighbours, in the same order.",
    },
    {
      kind: "type",
      prompt: "`node = None`. What is returned?",
      solution: true,
      answers: ["None"],
      explanation: "An empty graph clones to nothing.",
    },
    {
      kind: "type",
      prompt: "What does the `clones` dictionary double as?",
      solution: true,
      answers: ["visited set", "visited", "seen", "seen set"],
      explanation: "A node in the dictionary has already been cloned (visited).",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(V + E)", correct: true },
        { text: "O(V²)", why: "Each node is cloned once and each edge is copied once per direction." },
        { text: "O(V)", why: "Every edge must also be copied." },
      ],
      explanation: "Visit every node and every adjacency entry once.",
    },
    {
      kind: "choice",
      prompt: "What happens if the copy is stored in `clones` **after** cloning the neighbours?",
      solution: true,
      options: [
        { text: "Cycles recurse forever (until a RecursionError)", correct: true },
        { text: "Nodes get cloned twice but it still works", why: "In a cycle, it never returns to store anything." },
        { text: "Nothing changes", why: "1 → 2 → 1 would keep creating new clones of 1." },
      ],
      explanation: "Register first, then recurse.",
    },
    {
      kind: "choice",
      prompt: "What makes this a **deep** copy?",
      options: [
        { text: "Every node object is new; no clone points to an original node", correct: true },
        { text: "Values are copied", why: "Copying values isn't enough: neighbours must be new nodes too." },
        { text: "It uses `copy.deepcopy`", why: "It builds the copy by hand." },
      ],
      explanation: "The cloned graph shares nothing with the original.",
    },
    {
      kind: "choice",
      prompt: "Could BFS be used instead of recursion?",
      options: [
        { text: "Yes: create the clone when a node is first discovered, then wire neighbours as nodes are popped", correct: true },
        { text: "No, cloning needs recursion", why: "Any traversal with a clone map works." },
        { text: "Only for trees", why: "BFS with a visited map handles cycles fine." },
      ],
      explanation: "BFS avoids deep recursion on large graphs.",
    },
  ],

  "course-schedule": [
    {
      kind: "type",
      prompt: "Fill in the edge direction: `[course, prerequisite]` means prerequisite → course.",
      code: `
for course, prerequisite in prerequisites:
    graph[___].append(course)
    indegree[course] += 1`,
      answers: ["prerequisite"],
      explanation: "Taking the prerequisite unlocks the course.",
    },
    {
      kind: "type",
      prompt: "Fill in the starting courses.",
      code: `
queue = deque(course for course in range(numCourses) if indegree[course] == ___)`,
      answers: ["0"],
      explanation: "Courses with no prerequisites can be taken right away.",
    },
    {
      kind: "type",
      prompt: "`numCourses = 2`, `prerequisites = [[1, 0], [0, 1]]`. What is returned?",
      solution: true,
      answers: ["False"],
      explanation: "Each course needs the other first: a cycle.",
    },
    {
      kind: "type",
      prompt: "`numCourses = 3`, `prerequisites = [[1, 0], [2, 1]]`. What is returned?",
      solution: true,
      answers: ["True"],
      explanation: "Take 0, then 1, then 2.",
    },
    {
      kind: "type",
      prompt: "`numCourses = 3`, `prerequisites = [[0, 1], [1, 2], [2, 0]]`. How many courses get taken before the queue empties?",
      solution: true,
      answers: ["0"],
      explanation: "Every course is in the cycle, so none starts with in-degree 0.",
    },
    {
      kind: "type",
      prompt: "Fill in the final check.",
      code: `
return taken == ___`,
      answers: ["numCourses"],
      explanation: "If any course was never taken, a cycle blocked it.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity, with V courses and E prerequisites?",
      solution: true,
      options: [
        { text: "O(V + E)", correct: true },
        { text: "O(V · E)", why: "Each course is dequeued once and each edge decremented once." },
        { text: "O(V²)", why: "With adjacency lists it's V + E." },
      ],
      explanation: "Kahn's algorithm touches every node and edge once.",
    },
    {
      kind: "choice",
      prompt: "What is this algorithm called?",
      options: [
        { text: "Kahn's algorithm (BFS topological sort)", correct: true },
        { text: "Dijkstra's algorithm", why: "That finds shortest paths with weights." },
        { text: "Floyd's cycle detection", why: "That's for linked lists." },
      ],
      explanation: "Repeatedly take nodes with no remaining incoming edges.",
    },
    {
      kind: "choice",
      prompt: "Why does a cycle leave courses untaken?",
      options: [
        { text: "Courses in a cycle always have at least one untaken prerequisite, so their in-degree never reaches 0", correct: true },
        { text: "Because the queue overflows", why: "The queue just runs out." },
        { text: "Because cycles are removed first", why: "Nothing removes them; they simply never become available." },
      ],
      explanation: "That's how Kahn's algorithm detects cycles.",
    },
    {
      kind: "choice",
      prompt: "How else can a cycle be detected?",
      options: [
        { text: "DFS with three colours: finding a \"visiting\" (grey) node again means a cycle", correct: true },
        { text: "Counting edges: E ≥ V means a cycle", why: "Directed graphs can have many edges without cycles." },
        { text: "Sorting the prerequisites", why: "Sorting doesn't reveal cycles." },
      ],
      explanation: "A back edge to a node on the current DFS path is a cycle.",
    },
  ],

  "course-schedule-ii": [
    {
      kind: "type",
      prompt: "Fill in what is returned when there's a cycle.",
      code: `
return order if len(order) == numCourses else ___`,
      answers: ["[]"],
      explanation: "No valid order exists, so the problem asks for an empty list.",
    },
    {
      kind: "type",
      prompt: "Fill in when a following course becomes available.",
      code: `
indegree[following] -= 1
if indegree[following] == ___:
    queue.append(following)`,
      answers: ["0"],
      explanation: "All of its prerequisites have been taken.",
    },
    {
      kind: "type",
      prompt: "`numCourses = 2`, `prerequisites = [[1, 0]]`. What is returned?",
      solution: true,
      answers: ["[0, 1]", "0, 1", "0 1"],
      explanation: "0 has no prerequisites, then 1.",
    },
    {
      kind: "type",
      prompt: "`numCourses = 4`, `prerequisites = [[1,0],[2,0],[3,1],[3,2]]`. What does this code return?",
      solution: true,
      answers: ["[0, 1, 2, 3]", "0, 1, 2, 3", "0 1 2 3"],
      explanation: "0 first; then 1 and 2 (in queue order); 3 once both are done.",
    },
    {
      kind: "type",
      prompt: "Same input. Course 3 starts with what in-degree?",
      solution: true,
      answers: ["2"],
      explanation: "It needs both 1 and 2.",
    },
    {
      kind: "type",
      prompt: "`numCourses = 2`, `prerequisites = [[0, 1], [1, 0]]`. What is returned?",
      solution: true,
      answers: ["[]"],
      explanation: "A cycle: no order works.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity?",
      solution: true,
      options: [
        { text: "O(V + E)", correct: true },
        { text: "O(V log V)", why: "No sorting; a plain queue suffices." },
        { text: "O(E²)", why: "Each edge is handled once." },
      ],
      explanation: "Same as Course Schedule; we just record the order.",
    },
    {
      kind: "choice",
      prompt: "Is the returned order the only valid one?",
      options: [
        { text: "No: whenever several courses are available at once, any of them could go first", correct: true },
        { text: "Yes, topological order is unique", why: "It's unique only when the graph forms a single chain." },
        { text: "Yes, because the queue is FIFO", why: "FIFO picks one valid order; others exist." },
      ],
      explanation: "In the 4-course example, `[0, 2, 1, 3]` is valid too.",
    },
    {
      kind: "choice",
      prompt: "How would DFS produce a topological order?",
      options: [
        { text: "Add each course after all courses reachable from it are finished, then reverse the list", correct: true },
        { text: "Add each course when first visited", why: "That's preorder, which can put a course before its prerequisite." },
        { text: "Sort courses by number", why: "Course numbers say nothing about dependencies." },
      ],
      explanation: "Reverse postorder is a topological order.",
    },
    {
      kind: "choice",
      prompt: "What does `indegree[course]` count?",
      options: [
        { text: "Prerequisites of that course not taken yet", correct: true },
        { text: "Courses that depend on it", why: "That's the out-degree: `len(graph[course])`." },
        { text: "Its position in the order", why: "It counts remaining prerequisites." },
      ],
      explanation: "When it hits 0, the course is available.",
    },
  ],

  "rotting-oranges": [
    {
      kind: "type",
      prompt: "Fill in when the minute counter goes up.",
      code: `
while queue and fresh:
    minutes ___ 1
    for _ in range(len(queue)):`,
      answers: ["+="],
      explanation: "One BFS layer is one minute of spreading.",
    },
    {
      kind: "type",
      prompt: "Fill in what is returned when fresh oranges remain.",
      code: `
return ___ if fresh else minutes`,
      answers: ["-1"],
      explanation: "Some oranges can never be reached by the rot.",
    },
    {
      kind: "type",
      prompt: "Grid `[[2,1,1],[1,1,0],[0,1,1]]`. What is returned?",
      solution: true,
      answers: ["4"],
      explanation: "The rot reaches the bottom-right orange after 4 minutes.",
    },
    {
      kind: "type",
      prompt: "Grid `[[2,1,1],[0,1,1],[1,0,1]]`. What is returned?",
      solution: true,
      answers: ["-1"],
      explanation: "The bottom-left orange is cut off by empty cells.",
    },
    {
      kind: "type",
      prompt: "Grid `[[0,2]]`. What is returned?",
      solution: true,
      answers: ["0"],
      explanation: "No fresh oranges at the start, so 0 minutes.",
    },
    {
      kind: "type",
      prompt: "Grid `[[2,2],[1,1]]`. What is returned?",
      solution: true,
      answers: ["1"],
      explanation: "Both rotten oranges spread at the same time: one minute is enough.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity for an m × n grid?",
      solution: true,
      options: [
        { text: "O(m · n)", correct: true },
        { text: "O((m · n)²)", why: "That's re-scanning the grid every minute. BFS touches each cell once." },
        { text: "O(m + n)", why: "Every cell may need processing." },
      ],
      explanation: "Each orange rots (and is queued) at most once.",
    },
    {
      kind: "choice",
      prompt: "Why put **all** rotten oranges in the queue at the start?",
      options: [
        { text: "They spread simultaneously; multi-source BFS gives each fresh orange its distance to the nearest rotten one", correct: true },
        { text: "To count them", why: "Counting isn't needed; they're sources." },
        { text: "Starting from one is the same", why: "Then a far orange would be reached later than it should." },
      ],
      explanation: "Multi-source BFS models parallel spreading.",
    },
    {
      kind: "choice",
      prompt: "Why does the loop also check `fresh`?",
      solution: true,
      options: [
        { text: "To avoid counting an extra minute after the last fresh orange has rotted", correct: true },
        { text: "To prevent an infinite loop", why: "The queue empties anyway; it's about not over-counting." },
        { text: "It's not needed", why: "Without it, the final layer (with nothing new to rot) would add 1." },
      ],
      explanation: "Stop as soon as nothing fresh is left.",
    },
    {
      kind: "choice",
      prompt: "Why BFS rather than DFS?",
      options: [
        { text: "BFS processes oranges in order of time (distance), which is exactly what minutes measure", correct: true },
        { text: "DFS can't visit grids", why: "It can, but it doesn't give shortest times." },
        { text: "BFS uses less memory", why: "Not necessarily. It's about level-by-level timing." },
      ],
      explanation: "Each BFS layer = one more minute.",
    },
  ],

  "pacific-atlantic-water-flow": [
    {
      kind: "type",
      prompt: "Fill in the comparison for moving **uphill** from the ocean.",
      code: `
and heights[next_row][next_column] ___ heights[row][column]`,
      answers: [">="],
      explanation: "Searching backwards from the ocean, we can step to a neighbour that's at least as high, because water would flow from it down to us.",
      mistakes: [{ answers: ["<="], why: "That's the forward direction. We search **from** the ocean, so we climb." }],
    },
    {
      kind: "type",
      prompt: "Fill in how the two oceans' results are combined.",
      code: `
return [[row, column] for row, column in pacific ___ atlantic]`,
      answers: ["&"],
      explanation: "Set intersection: cells that reach both oceans.",
      mistakes: [{ answers: ["|"], why: "`|` is union: cells reaching **either** ocean." }],
    },
    {
      kind: "type",
      prompt: "Heights `[[1, 2], [4, 3]]`. How many cells are returned?",
      solution: true,
      answers: ["3"],
      explanation: "`[0, 1]`, `[1, 0]` and `[1, 1]`. The cell `[0, 0]` (height 1) can't flow down to the Atlantic.",
    },
    {
      kind: "type",
      prompt: "Heights `[[1]]`. What is returned?",
      solution: true,
      answers: ["[[0, 0]]", "[0, 0]", "0, 0"],
      explanation: "A single cell touches all four edges.",
    },
    {
      kind: "type",
      prompt: "Heights `[[2, 1], [1, 2]]`. How many cells are returned?",
      solution: true,
      answers: ["4"],
      explanation: "The two 1s sit in the top-right and bottom-left corners, which touch both oceans. Each 2 can flow down into either 1, so it reaches both oceans too.",
    },
    {
      kind: "type",
      prompt: "Which ocean touches the top row and the left column? (`Pacific` or `Atlantic`)",
      answers: ["Pacific"],
      explanation: "Pacific: top and left. Atlantic: bottom and right.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity for an m × n grid?",
      solution: true,
      options: [
        { text: "O(m · n)", correct: true },
        { text: "O((m · n)²)", why: "That's running a search from every cell. Two searches from the oceans cover everything." },
        { text: "O(m + n)", why: "Each search may reach every cell." },
      ],
      explanation: "Two traversals, each visiting a cell at most once.",
    },
    {
      kind: "choice",
      prompt: "Why search **from the oceans** instead of from each cell?",
      options: [
        { text: "Two searches cover all cells, instead of one search per cell", correct: true },
        { text: "Searching from cells gives wrong answers", why: "It's correct, just O((m·n)²)." },
        { text: "Because water flows uphill", why: "Water flows downhill; we reverse the direction to search backwards." },
      ],
      explanation: "Reverse the flow: which cells can the ocean \"climb\" to?",
    },
    {
      kind: "choice",
      prompt: "Why `>=` and not `>` when climbing?",
      options: [
        { text: "Water flows between cells of **equal** height too", correct: true },
        { text: "To avoid revisiting cells", why: "`seen` prevents revisits." },
        { text: "It makes no difference", why: "Flat areas would be cut off with `>`." },
      ],
      explanation: "The problem allows flow to equal or lower heights.",
    },
    {
      kind: "choice",
      prompt: "What does each call to `climb` return?",
      solution: true,
      options: [
        { text: "The set of cells that can drain into that ocean", correct: true },
        { text: "The highest cell", why: "It returns every reachable cell." },
        { text: "A path to the ocean", why: "It returns a set of cells, not a path." },
      ],
      explanation: "Intersecting the two sets gives the answer.",
    },
  ],

  "word-ladder": [
    {
      kind: "type",
      prompt: "Fill in the step that makes sure a word is visited only once.",
      code: `
if candidate in words:
    words.___(candidate)
    queue.append((candidate, steps + 1))`,
      answers: ["remove", "discard"],
      explanation: "Removing a word from the set marks it as visited.",
    },
    {
      kind: "type",
      prompt: "Fill in the step count for `beginWord`.",
      code: `
queue = deque([(beginWord, ___)])`,
      answers: ["1"],
      explanation: "The answer counts words in the ladder, and `beginWord` is the first.",
      mistakes: [{ answers: ["0"], why: "The count includes the begin word itself." }],
    },
    {
      kind: "type",
      prompt: "`hit` → `cog`, list `[hot, dot, dog, lot, log, cog]`. What is returned?",
      solution: true,
      answers: ["5"],
      explanation: "hit → hot → dot → dog → cog: 5 words.",
    },
    {
      kind: "type",
      prompt: "`hit` → `cog`, list `[hot, dot, dog, lot, log]`. What is returned?",
      solution: true,
      answers: ["0"],
      explanation: "`cog` isn't in the list, so it can't be reached.",
    },
    {
      kind: "type",
      prompt: "`a` → `c`, list `[a, b, c]`. What is returned?",
      solution: true,
      answers: ["2"],
      explanation: "a → c directly: 2 words.",
    },
    {
      kind: "type",
      prompt: "`hot` → `dog`, list `[hot, dog]`. What is returned?",
      solution: true,
      answers: ["0"],
      explanation: "`hot` and `dog` differ in two letters, and no word links them.",
    },
    {
      kind: "choice",
      prompt: "What is the time complexity, with N words of length L?",
      solution: true,
      options: [
        { text: "O(N · L · 26) candidate checks (times O(L) to build each string)", correct: true },
        { text: "O(N²)", why: "That's comparing every pair of words. Trying 26 letters per position avoids it." },
        { text: "O(26^L)", why: "We only expand real words from the list." },
      ],
      explanation: "Each word is expanded once, generating 26·L candidates.",
    },
    {
      kind: "choice",
      prompt: "Why BFS?",
      options: [
        { text: "Every step costs the same, so BFS finds the shortest ladder first", correct: true },
        { text: "DFS can't find any ladder", why: "DFS can find one, but not necessarily the shortest." },
        { text: "BFS uses less memory", why: "It often uses more. It's chosen for shortest paths." },
      ],
      explanation: "Unweighted shortest path → BFS.",
    },
    {
      kind: "choice",
      prompt: "What are the graph's nodes and edges?",
      options: [
        { text: "Nodes are words; an edge joins words that differ in exactly one letter", correct: true },
        { text: "Nodes are letters", why: "Whole words are the nodes." },
        { text: "Edges join words with the same first letter", why: "Edges mean one-letter difference." },
      ],
      explanation: "The graph is never built explicitly; neighbours are generated on the fly.",
    },
    {
      kind: "choice",
      prompt: "What speeds this up on large inputs?",
      options: [
        { text: "Bidirectional BFS: search from both ends and stop when the frontiers meet", correct: true },
        { text: "Sorting the word list", why: "Sorting doesn't help find one-letter neighbours." },
        { text: "Using DFS with memoization", why: "That still doesn't prioritise short ladders." },
      ],
      explanation: "Two small frontiers grow much slower than one large one.",
    },
  ],
});
