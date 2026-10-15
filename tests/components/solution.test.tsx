import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CodeBlock from "@/components/solution/CodeBlock";
import CopyButton from "@/components/solution/CopyButton";
import Rich from "@/components/solution/Rich";
import Visual from "@/components/solution/Visual";
import { PATTERNS } from "@/content";
import { getCode, getSolution } from "@/content/solutions";
import type { Visual as VisualSpec } from "@/content/solutions/types";

const slugs = PATTERNS.flatMap((p) => p.problems.map((q) => q.slug));

/** The <span> that renders exactly `text`, to inspect its highlight class. */
function token(container: HTMLElement, text: string) {
  const span = [...container.querySelectorAll("code span")].find((s) => s.textContent === text);
  if (!span) throw new Error(`no token "${text}"`);
  return span.className;
}

describe("CodeBlock", () => {
  it("labels the block Python with a copy button by default", () => {
    render(<CodeBlock code="x = 1" />);
    expect(screen.getByText("Python")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /copy/i })).toBeInTheDocument();
  });

  it("supports a custom label and hiding the copy button", () => {
    render(<CodeBlock code="x = 1" label="Snippet" copy={false} />);
    expect(screen.getByText("Snippet")).toBeInTheDocument();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("highlights keywords, definitions, self, strings, numbers and comments", () => {
    const code = [
      "class Solution:",
      "    def twoSum(self, nums: list[int]) -> list[int]:",
      "        seen = {}  # value -> index",
      "        if not nums or nums[0] == 0x1F:",
      '            return "none"',
      "        return [1, 2.5]",
    ].join("\n");
    const { container } = render(<CodeBlock code={code} />);
    for (const kw of ["class", "def", "if", "not", "or", "return"]) expect(token(container, kw)).toContain("text-pink-400");
    expect(token(container, "Solution")).toContain("text-sky-300");
    expect(token(container, "twoSum")).toContain("text-sky-300");
    expect(token(container, "self")).toContain("text-violet-300");
    expect(token(container, '"none"')).toContain("text-emerald-300");
    expect(token(container, "0x1F")).toContain("text-amber-300");
    expect(token(container, "2.5")).toContain("text-amber-300");
    expect(token(container, "# value -> index")).toContain("italic");
  });

  it("does not treat # inside a string as a comment", () => {
    const { container } = render(<CodeBlock code={'tag = "#hash"  # real comment'} />);
    expect(token(container, '"#hash"')).toContain("text-emerald-300");
    expect(token(container, "# real comment")).toContain("italic");
  });

  it("does not treat quotes inside a comment as a string", () => {
    const { container } = render(<CodeBlock code={"x = 1  # don't \"quote\" me"} />);
    expect(token(container, "# don't \"quote\" me")).toContain("italic");
  });

  it("handles escaped quotes and f-strings", () => {
    const { container } = render(<CodeBlock code={'a = "say \\"hi\\""\nb = f"{a}!"'} />);
    expect(token(container, '"say \\"hi\\""')).toContain("text-emerald-300");
    expect(token(container, 'f"{a}!"')).toContain("text-emerald-300");
  });

  it("does not highlight digits inside identifiers", () => {
    const { container } = render(<CodeBlock code="dp2 = x1 + 3" />);
    const spans = [...container.querySelectorAll("code span")].map((s) => s.textContent);
    expect(spans).toEqual(["3"]);
    expect(container.querySelector("code")!.textContent).toBe("dp2 = x1 + 3");
  });

  it("only colors the name right after def/class", () => {
    const { container } = render(<CodeBlock code="def solve(node): return node" />);
    expect(token(container, "solve")).toContain("text-sky-300");
    expect([...container.querySelectorAll("code span")].filter((s) => s.textContent === "node")).toHaveLength(0);
  });

  it("renders ___ runs as fill-in blanks", () => {
    const { container } = render(<CodeBlock code="left = ___ + 1" copy={false} />);
    expect(token(container, "___")).toContain("bg-sky-500/25");
  });

  it("copies the raw code, not the highlighted markup", async () => {
    const writeText = vi.fn(async () => {});
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    render(<CodeBlock code={'x = "a" # b'} />);
    fireEvent.click(screen.getByRole("button", { name: /copy/i }));
    expect(writeText).toHaveBeenCalledWith('x = "a" # b');
  });

  it("preserves every character of all 160 reference solutions", () => {
    for (const slug of slugs) {
      const code = getCode(slug)!;
      const { container, unmount } = render(<CodeBlock code={code} />);
      expect(container.querySelector("code")!.textContent, slug).toBe(code);
      unmount();
    }
  });
});

describe("CopyButton", () => {
  it("confirms the copy, then resets after 1.5s", async () => {
    vi.useFakeTimers();
    const writeText = vi.fn(async () => {});
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    render(<CopyButton text="hello" />);
    await act(async () => fireEvent.click(screen.getByRole("button")));
    expect(writeText).toHaveBeenCalledWith("hello");
    expect(screen.getByRole("button")).toHaveTextContent("Copied");
    act(() => void vi.advanceTimersByTime(1499));
    expect(screen.getByRole("button")).toHaveTextContent("Copied");
    act(() => void vi.advanceTimersByTime(1));
    expect(screen.getByRole("button")).toHaveTextContent("Copy");
  });

  it("fails quietly when the clipboard is unavailable (insecure context)", async () => {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: vi.fn(async () => Promise.reject(new Error("NotAllowedError"))) },
      configurable: true,
    });
    render(<CopyButton text="hello" />);
    await act(async () => fireEvent.click(screen.getByRole("button")));
    expect(screen.getByRole("button")).toHaveTextContent("Copy");
  });

  it("fails quietly when there is no clipboard API at all", async () => {
    Object.defineProperty(navigator, "clipboard", { value: undefined, configurable: true });
    render(<CopyButton text="hello" />);
    await act(async () => fireEvent.click(screen.getByRole("button")));
    expect(screen.getByRole("button")).toHaveTextContent("Copy");
  });
});

describe("Rich", () => {
  const html = (text: string) => render(<p><Rich text={text} /></p>).container.querySelector("p")!.innerHTML;

  it("renders plain text unchanged", () => {
    expect(html("just text")).toBe("just text");
    expect(html("")).toBe("");
  });

  it("renders `code` and **bold** spans", () => {
    const { container } = render(<p><Rich text="Use `left < right` and **never** stop." /></p>);
    expect(container.querySelector("code")!.textContent).toBe("left < right");
    expect(container.querySelector("strong")!.textContent).toBe("never");
    expect(container.textContent).toBe("Use left < right and never stop.");
  });

  it("keeps ** inside code as literal code", () => {
    const { container } = render(<p><Rich text="mod `10**9 + 7` always" /></p>);
    expect(container.querySelector("code")!.textContent).toBe("10**9 + 7");
    expect(container.querySelector("strong")).toBeNull();
  });

  it("renders code nested inside bold", () => {
    const { container } = render(<p><Rich text="**one half around `middle` is sorted**" /></p>);
    const strong = container.querySelector("strong")!;
    expect(strong.textContent).toBe("one half around middle is sorted");
    expect(strong.querySelector("code")!.textContent).toBe("middle");
  });

  it("renders several spans in order", () => {
    const { container } = render(<p><Rich text="`a` then **b** then `c`" /></p>);
    expect([...container.querySelector("p")!.children].map((c) => `${c.tagName}:${c.textContent}`)).toEqual([
      "CODE:a",
      "STRONG:b",
      "CODE:c",
    ]);
  });

  it("leaves unmatched markers as plain text", () => {
    const { container } = render(<p><Rich text="a ` b ** c" /></p>);
    expect(container.textContent).toBe("a ` b ** c");
    expect(container.querySelector("code, strong")).toBeNull();
  });

  it("escapes HTML in content instead of injecting it", () => {
    const { container } = render(<p><Rich text="`<img src=x onerror=alert(1)>` **<b>x</b>**" /></p>);
    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector("b")).toBeNull();
    expect(container.querySelector("code")!.textContent).toBe("<img src=x onerror=alert(1)>");
  });

  it("leaves no stray markers in any solution text", () => {
    for (const slug of slugs) {
      const s = getSolution(slug)!;
      for (const text of [s.idea, ...s.steps.map((st) => st.text), ...(s.pitfalls ?? [])]) {
        const { container, unmount } = render(<p><Rich text={text} /></p>);
        // Text outside <code> must not contain markup characters
        const outside = [...container.querySelector("p")!.childNodes]
          .filter((n) => n.nodeName !== "CODE")
          .map((n) => n.textContent)
          .join("");
        expect(outside, slug).not.toContain("`");
        expect(outside, slug).not.toContain("**");
        unmount();
      }
    }
  });
});

describe("Visual", () => {
  const draw = (visual: VisualSpec) => render(<Visual visual={visual} />).container;
  const texts = (c: HTMLElement) => [...c.querySelectorAll("svg text")].map((t) => t.textContent);

  it("wraps every diagram in a figure with an optional caption", () => {
    const c = draw({ kind: "array", values: [1], caption: "One box" });
    expect(c.querySelector("figure svg[role=img]")).not.toBeNull();
    expect(c.querySelector("figcaption")!.textContent).toBe("One box");
    expect(draw({ kind: "array", values: [1] }).querySelector("figcaption")).toBeNull();
  });

  describe("array", () => {
    it("draws one box per value with index labels", () => {
      const c = draw({ kind: "array", values: ["a", "b", "c"] });
      expect(c.querySelectorAll("rect")).toHaveLength(3);
      expect(texts(c)).toEqual(["0", "a", "1", "b", "2", "c"]);
    });

    it("can hide indices", () => {
      expect(texts(draw({ kind: "array", values: [7, 8], indices: false }))).toEqual(["7", "8"]);
    });

    it("tones boxes, with bad > good > accent > muted when they overlap", () => {
      const c = draw({ kind: "array", values: [1, 2, 3], tones: { muted: [0, 1, 2], accent: [1, 2], bad: [2] } });
      const rects = [...c.querySelectorAll("rect")].map((r) => r.getAttribute("class")!);
      expect(rects[0]).toContain("fill-zinc-100");
      expect(rects[1]).toContain("fill-sky-100");
      expect(rects[2]).toContain("fill-rose-100");
    });

    it("stacks labels of pointers on the same index but draws one arrow", () => {
      const c = draw({ kind: "array", values: [1, 2], pointers: [{ at: 0, label: "slow" }, { at: 0, label: "fast" }, { at: 1, label: "end" }] });
      expect(c.querySelectorAll("path")).toHaveLength(2);
      const labels = [...c.querySelectorAll("text")].filter((t) => ["slow", "fast"].includes(t.textContent!));
      expect(Number(labels[1].getAttribute("y"))).toBe(Number(labels[0].getAttribute("y")) + 15);
    });

    it("draws the sliding window bracket", () => {
      expect(draw({ kind: "array", values: [1, 2, 3], window: [0, 1] }).querySelectorAll("path")).toHaveLength(1);
    });

    it("widens boxes for long values", () => {
      const short = draw({ kind: "array", values: [1] }).querySelector("rect")!.getAttribute("width");
      const long = draw({ kind: "array", values: ["a-very-long-value"] }).querySelector("rect")!.getAttribute("width");
      expect(Number(long)).toBeGreaterThan(Number(short));
    });
  });

  describe("grid", () => {
    it("draws every cell with row and column labels", () => {
      const c = draw({ kind: "grid", rows: [[1, 2], [3, 4], [5, 6]], rowLabels: ["a", "b", "c"], colLabels: ["x", "y"] });
      expect(c.querySelectorAll("rect")).toHaveLength(6);
      expect(texts(c)).toEqual(["x", "y", "a", "1", "2", "b", "3", "4", "c", "5", "6"]);
    });

    it("tones cells by [row, col]", () => {
      const c = draw({ kind: "grid", rows: [[0, 0], [0, 0]], tones: { good: [[1, 0]] } });
      const classes = [...c.querySelectorAll("rect")].map((r) => r.getAttribute("class")!.includes("fill-emerald-100"));
      expect(classes).toEqual([false, false, true, false]);
    });

    it("handles ragged rows", () => {
      expect(draw({ kind: "grid", rows: [[1], [1, 2, 3]] }).querySelectorAll("rect")).toHaveLength(4);
    });
  });

  describe("tree", () => {
    it("draws nodes and parent edges, skipping null slots", () => {
      const c = draw({ kind: "tree", values: [1, 2, 3, null, 5] });
      expect(c.querySelectorAll("circle")).toHaveLength(4);
      expect(c.querySelectorAll("line")).toHaveLength(3);
      expect(texts(c)).toEqual(["1", "2", "3", "5"]);
    });

    it("ignores trailing nulls when sizing the tree", () => {
      const a = draw({ kind: "tree", values: [1, 2, 3] }).querySelector("svg")!.getAttribute("viewBox");
      const b = draw({ kind: "tree", values: [1, 2, 3, null, null, null, null] }).querySelector("svg")!.getAttribute("viewBox");
      expect(b).toBe(a);
    });

    it("draws a single root", () => {
      const c = draw({ kind: "tree", values: [42] });
      expect(c.querySelectorAll("circle")).toHaveLength(1);
      expect(c.querySelectorAll("line")).toHaveLength(0);
    });
  });

  describe("ntree", () => {
    it("draws every node, an edge per child and edge labels", () => {
      const c = draw({
        kind: "ntree",
        root: { label: "[]", children: [{ label: "[1]", edge: "+1", children: [{ label: "[1,2]", edge: "+2" }] }, { label: "[2]", edge: "+2" }] },
      });
      expect(c.querySelectorAll("rect")).toHaveLength(4);
      expect(c.querySelectorAll("line")).toHaveLength(3);
      expect(texts(c)).toEqual(expect.arrayContaining(["+1", "+2", "[]", "[1]", "[1,2]", "[2]"]));
    });

    it("places children below their parent and siblings side by side", () => {
      const c = draw({ kind: "ntree", root: { label: "r", children: [{ label: "a" }, { label: "b" }] } });
      const [r, a, b] = [...c.querySelectorAll("rect")].map((x) => ({ x: Number(x.getAttribute("x")), y: Number(x.getAttribute("y")) }));
      expect(a.y).toBeGreaterThan(r.y);
      expect(a.y).toBe(b.y);
      expect(b.x).toBeGreaterThan(a.x);
    });
  });

  describe("list", () => {
    it("draws nodes with arrows and a null terminator", () => {
      const c = draw({ kind: "list", values: [1, 2, 3] });
      expect(c.querySelectorAll("rect")).toHaveLength(3);
      expect(texts(c)).toContain("∅");
    });

    it("draws a cycle back to the given node instead of a terminator", () => {
      const c = draw({ kind: "list", values: [1, 2, 3], cycleTo: 1 });
      expect(texts(c)).not.toContain("∅");
      expect(c.querySelector("g[class*=rose] path")).not.toBeNull();
    });
  });

  describe("graph", () => {
    it("draws nodes and edges on a grid when coordinates are given", () => {
      const c = draw({ kind: "graph", nodes: [{ id: "A", x: 0, y: 0 }, { id: "B", x: 1, y: 0 }], edges: [["A", "B"]] });
      const [a, b] = [...c.querySelectorAll("circle")];
      expect(Number(b.getAttribute("cx")) - Number(a.getAttribute("cx"))).toBe(78);
      expect(a.getAttribute("cy")).toBe(b.getAttribute("cy"));
      expect(c.querySelectorAll("line")).toHaveLength(1);
    });

    it("arranges nodes on a circle without coordinates", () => {
      const c = draw({ kind: "graph", nodes: [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }], edges: [] });
      const pts = [...c.querySelectorAll("circle")].map((n) => [Number(n.getAttribute("cx")), Number(n.getAttribute("cy"))]);
      const cx = pts.reduce((s, p) => s + p[0], 0) / 4;
      const cy = pts.reduce((s, p) => s + p[1], 0) / 4;
      const radii = pts.map(([x, y]) => Math.hypot(x - cx, y - cy));
      for (const r of radii) expect(r).toBeCloseTo(radii[0], 5);
    });

    it("draws arrow heads only for directed graphs", () => {
      const nodes = [{ id: "A", x: 0, y: 0 }, { id: "B", x: 1, y: 1 }];
      expect(draw({ kind: "graph", nodes, edges: [["A", "B"]], directed: true }).querySelectorAll("g path")).toHaveLength(1);
      expect(draw({ kind: "graph", nodes, edges: [["A", "B"]] }).querySelectorAll("g path")).toHaveLength(0);
    });

    it("skips edges to unknown nodes instead of crashing", () => {
      const c = draw({ kind: "graph", nodes: [{ id: "A" }], edges: [["A", "Z"]] });
      expect(c.querySelectorAll("line")).toHaveLength(0);
      expect(c.innerHTML).not.toContain("NaN");
    });

    it("handles a self-loop without dividing by zero", () => {
      const c = draw({ kind: "graph", nodes: [{ id: "A", x: 0, y: 0 }], edges: [["A", "A"]] });
      expect(c.innerHTML).not.toContain("NaN");
    });
  });

  describe("intervals", () => {
    it("draws one bar per interval with default [start,end] labels", () => {
      const c = draw({ kind: "intervals", items: [{ start: 1, end: 3 }, { start: 2, end: 6, label: "B" }] });
      expect(c.querySelectorAll("rect")).toHaveLength(2);
      expect(texts(c)).toEqual(expect.arrayContaining(["[1,3]", "B"]));
    });

    it("draws an axis tick per unit for short ranges", () => {
      const c = draw({ kind: "intervals", items: [{ start: 0, end: 5 }] });
      for (let t = 0; t <= 5; t++) expect(texts(c)).toContain(String(t));
    });

    it("thins out ticks for long ranges", () => {
      const c = draw({ kind: "intervals", items: [{ start: 0, end: 1000 }] });
      expect(texts(c).filter((t) => /^\d+$/.test(t!)).length).toBeLessThanOrEqual(21);
    });

    it("keeps zero-length intervals visible", () => {
      const c = draw({ kind: "intervals", items: [{ start: 4, end: 4 }] });
      expect(Number(c.querySelector("rect")!.getAttribute("width"))).toBeGreaterThan(0);
      expect(c.innerHTML).not.toContain("NaN");
    });
  });

  describe("bars", () => {
    it("draws bars, stacks water on top, and labels heights", () => {
      const c = draw({ kind: "bars", values: [0, 1, 0, 2], water: [0, 0, 1, 0] });
      // zero-height bars are not drawn; water only where > 0
      expect(c.querySelectorAll("rect")).toHaveLength(3);
      expect(texts(c)).toEqual(["0", "1", "0", "2"]);
    });

    it("handles all-zero bars", () => {
      const c = draw({ kind: "bars", values: [0, 0] });
      expect(c.innerHTML).not.toContain("NaN");
      expect(c.innerHTML).not.toContain("Infinity");
    });
  });

  describe("stack", () => {
    it("lists items bottom to top and marks the top", () => {
      const c = draw({ kind: "stack", items: ["a", "b", "c"] });
      const ys = [...c.querySelectorAll("rect")].map((r) => Number(r.getAttribute("y")));
      expect(ys[0]).toBeGreaterThan(ys[2]);
      expect(texts(c)).toContain("← top");
    });

    it("shows an empty stack", () => {
      const c = draw({ kind: "stack", items: [] });
      expect(texts(c)).toEqual(["empty"]);
    });
  });

  it("renders every diagram in the corpus with finite geometry", () => {
    let count = 0;
    for (const slug of slugs) {
      for (const step of getSolution(slug)!.steps) {
        if (!step.visual) continue;
        const { container, unmount } = render(<Visual visual={step.visual} />);
        const svg = container.querySelector("svg")!;
        expect(svg, slug).not.toBeNull();
        expect(container.innerHTML, slug).not.toMatch(/NaN|Infinity|undefined/);
        const [, , w, h] = svg.getAttribute("viewBox")!.split(" ").map(Number);
        expect(w, slug).toBeGreaterThan(0);
        expect(h, slug).toBeGreaterThan(0);
        count++;
        unmount();
      }
    }
    expect(count).toBeGreaterThan(200);
  });
});
