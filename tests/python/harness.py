"""
Shared plumbing for running the reference solutions: the node classes LeetCode
provides, builders/serializers for them, and comparison helpers.
"""

import random
from collections import deque
from typing import List, Optional


class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


class NextNode:
    """Node for "Populating Next Right Pointers": a tree node with a `next` pointer."""

    def __init__(self, val=0, left=None, right=None, next=None):
        self.val = val
        self.left = left
        self.right = right
        self.next = next


class GraphNode:
    """Node for "Clone Graph"."""

    def __init__(self, val=0, neighbors=None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []


def load(code: str, node_class=None) -> dict:
    """Exec a snippet the way LeetCode would, with its usual names in scope."""
    ns = {
        "List": List,
        "Optional": Optional,
        "ListNode": ListNode,
        "TreeNode": TreeNode,
        "Node": node_class or TreeNode,
    }
    exec(compile(code, "<solution>", "exec"), ns)
    return ns


# ---------- linked lists ----------

def make_list(values):
    head = None
    for v in reversed(values):
        head = ListNode(v, head)
    return head


def list_values(head, limit=100_000):
    out = []
    while head is not None:
        out.append(head.val)
        head = head.next
        if len(out) > limit:
            raise AssertionError("linked list has a cycle or is far too long")
    return out


def list_nodes(head):
    nodes = []
    while head is not None:
        nodes.append(head)
        head = head.next
    return nodes


def make_cycle(values, pos):
    """List whose tail points back to index `pos` (-1 = no cycle). Returns (head, nodes)."""
    nodes = [ListNode(v) for v in values]
    for a, b in zip(nodes, nodes[1:]):
        a.next = b
    if nodes and pos >= 0:
        nodes[-1].next = nodes[pos]
    return (nodes[0] if nodes else None), nodes


# ---------- binary trees (LeetCode level-order with None gaps) ----------

def make_tree(values, cls=TreeNode):
    if not values or values[0] is None:
        return None
    root = cls(values[0])
    queue = deque([root])
    i = 1
    while queue and i < len(values):
        node = queue.popleft()
        if i < len(values) and values[i] is not None:
            node.left = cls(values[i])
            queue.append(node.left)
        i += 1
        if i < len(values) and values[i] is not None:
            node.right = cls(values[i])
            queue.append(node.right)
        i += 1
    return root


def tree_values(root):
    out, queue = [], deque([root])
    while queue:
        node = queue.popleft()
        if node is None:
            out.append(None)
            continue
        out.append(node.val)
        queue.append(node.left)
        queue.append(node.right)
    while out and out[-1] is None:
        out.pop()
    return out


def find(root, val):
    if root is None:
        return None
    if root.val == val:
        return root
    return find(root.left, val) or find(root.right, val)


def random_tree(rng, n, lo=-10, hi=10):
    """Random binary tree with n nodes (any shape)."""
    if n == 0:
        return None
    nodes = [TreeNode(rng.randint(lo, hi)) for _ in range(n)]
    for i in range(1, n):
        while True:
            parent = nodes[rng.randrange(i)]
            side = rng.choice(("left", "right"))
            if getattr(parent, side) is None:
                setattr(parent, side, nodes[i])
                break
    return nodes[0]


def inorder(root):
    return inorder(root.left) + [root.val] + inorder(root.right) if root else []


# ---------- comparisons ----------

def canon(nested):
    """Order-insensitive form of a list of lists (each inner list sorted)."""
    return sorted(tuple(sorted(x)) for x in nested)


def same_items(a, b):
    return sorted(map(repr, a)) == sorted(map(repr, b))


def rng(seed=0):
    return random.Random(seed)


# ---------- registry ----------

CASES = {}


def case(slug, node_class=None):
    """Register `fn(ns)` as the check for `slug`; `ns` is the exec'd snippet."""

    def register(fn):
        if slug in CASES:
            raise RuntimeError(f"duplicate case for {slug}")
        CASES[slug] = (fn, node_class)
        return fn

    return register
