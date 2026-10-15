import { describe, expect, it } from "vitest";
import { PATTERNS } from "@/content";
import { getCode, getSolution, slugFromUrl, videoUrlFor } from "@/content/solutions";
import { defineCode, defineSolutions, type NTreeNode, type Visual } from "@/content/solutions/types";

const slugs = PATTERNS.flatMap((p) => p.problems.map((q) => q.slug));
const visuals = slugs.flatMap((slug) =>
  getSolution(slug)!.steps.flatMap((step, i) => (step.visual ? [{ where: `${slug} step ${i + 1}`, v: step.visual }] : [])),
);
const texts = slugs.flatMap((slug) => {
  const s = getSolution(slug)!;
  return [
    { where: `${slug} idea`, text: s.idea },
    ...s.steps.map((st, i) => ({ where: `${slug} step ${i + 1}`, text: st.text })),
    ...(s.pitfalls ?? []).map((p, i) => ({ where: `${slug} pitfall ${i + 1}`, text: p })),
  ];
});

/** Same spans Rich renders: code first (it may contain `**`), then bold; nothing may be left over. */
function markupBalanced(text: string) {
  const withoutCode = text.replace(/`[^`]+`/g, "");
  return !withoutCode.includes("`") && (withoutCode.match(/\*\*/g) ?? []).length % 2 === 0;
}

describe("slugFromUrl", () => {
  it.each([
    ["https://leetcode.com/problems/two-sum/", "two-sum"],
    ["https://leetcode.com/problems/two-sum", "two-sum"],
    ["https://leetcode.com/problems/two-sum/description/", "two-sum"],
    ["https://leetcode.com/problems/3sum/", "3sum"],
    ["/problems/x/", "x"],
  ])("%s -> %s", (url, slug) => {
    expect(slugFromUrl(url)).toBe(slug);
  });

  it.each(["", "https://leetcode.com/", "https://leetcode.com/problems/", "https://example.com/two-sum/"])(
    "returns an empty string for %j",
    (url) => {
      expect(slugFromUrl(url)).toBe("");
    },
  );

  it("round-trips every URL in the corpus", () => {
    for (const p of PATTERNS) for (const q of p.problems) expect(slugFromUrl(q.leetcodeUrl)).toBe(q.slug);
  });
});

describe("videoUrlFor", () => {
  it("falls back to a YouTube search for the problem", () => {
    const url = new URL(videoUrlFor("two-sum", "Two Sum"));
    expect(url.origin).toBe("https://www.youtube.com");
    expect(url.pathname).toBe("/results");
    expect(url.searchParams.get("search_query")).toBe("leetcode Two Sum solution explained");
  });

  it("encodes titles with special characters so the query survives intact", () => {
    const title = "Implement Trie (Prefix Tree) & More? #1 / 100%";
    const url = new URL(videoUrlFor("unknown-slug", title));
    expect(url.searchParams.get("search_query")).toBe(`leetcode ${title} solution explained`);
    expect(url.search).not.toContain("&More");
    expect(url.hash).toBe("");
  });

  it("gives every corpus problem a valid https URL", () => {
    for (const p of PATTERNS) {
      for (const q of p.problems) {
        expect(new URL(videoUrlFor(q.slug, q.title)).protocol).toBe("https:");
      }
    }
  });
});

describe("getSolution / getCode", () => {
  it("returns a walkthrough and code for all 160 problems", () => {
    expect(slugs).toHaveLength(160);
    for (const slug of slugs) {
      expect(getSolution(slug), slug).toBeDefined();
      expect(getCode(slug), slug).toBeDefined();
    }
  });

  it.each(["", "nope", "Valid-Palindrome", "valid-palindrome "])("returns undefined for %j", (slug) => {
    expect(getSolution(slug)).toBeUndefined();
    expect(getCode(slug)).toBeUndefined();
  });

  it("has trimmed Python code that defines a class with at least one method", () => {
    for (const slug of slugs) {
      const code = getCode(slug)!;
      expect(code, slug).toBe(code.replace(/^\n+|\s+$/g, ""));
      expect(code, slug).toMatch(/^(from |import |class )/);
      expect(code, slug).toMatch(/^class \w+/m);
      expect(code, slug).toMatch(/^ {4}def \w+\(self/m);
      expect(code, slug).not.toContain("\t");
    }
  });

  it("has a non-trivial idea, steps, and big-O time and space for every problem", () => {
    for (const slug of slugs) {
      const s = getSolution(slug)!;
      expect(s.idea.length, slug).toBeGreaterThan(40);
      expect(s.steps.length, slug).toBeGreaterThan(0);
      for (const step of s.steps) expect(step.text.trim().length, slug).toBeGreaterThan(0);
      expect(s.time, slug).toContain("O(");
      expect(s.space, slug).toContain("O(");
      for (const p of s.pitfalls ?? []) expect(p.trim().length, slug).toBeGreaterThan(0);
    }
  });

  it("has balanced `code` and **bold** markup in every text", () => {
    expect(texts.filter(({ text }) => !markupBalanced(text)).map((b) => b.where)).toEqual([]);
  });
});

describe("defineCode / defineSolutions", () => {
  it("strips leading blank lines and trailing whitespace but keeps indentation", () => {
    const out = defineCode({ a: "\n\n    indented\n  line\n\n  \t\n", b: "class X:\n    pass" });
    expect(out.a).toBe("    indented\n  line");
    expect(out.b).toBe("class X:\n    pass");
  });

  it("keeps empty snippets empty and does not touch inner blank lines", () => {
    const out = defineCode({ empty: "\n\n", inner: "a\n\n\nb\n" });
    expect(out.empty).toBe("");
    expect(out.inner).toBe("a\n\n\nb");
  });

  it("returns solutions unchanged", () => {
    const s = { x: { idea: "i", steps: [{ text: "t" }], time: "O(1)", space: "O(1)" } };
    expect(defineSolutions(s)).toBe(s);
  });
});

/** Every index a visual refers to must exist, or the diagram silently draws in the wrong place. */
function visualProblems(v: Visual): string[] {
  const errors: string[] = [];
  const inRange = (i: number, n: number, what: string) => {
    if (!Number.isInteger(i) || i < 0 || i >= n) errors.push(`${what} ${i} out of range 0..${n - 1}`);
  };
  const tonesIn = (tones: Partial<Record<string, number[]>> | undefined, n: number) => {
    for (const [tone, idx] of Object.entries(tones ?? {})) for (const i of idx ?? []) inRange(i, n, `${tone} tone`);
  };

  switch (v.kind) {
    case "array":
      if (v.values.length === 0) errors.push("empty array");
      tonesIn(v.tones, v.values.length);
      for (const p of v.pointers ?? []) inRange(p.at, v.values.length, `pointer "${p.label}"`);
      if (v.window) {
        inRange(v.window[0], v.values.length, "window start");
        inRange(v.window[1], v.values.length, "window end");
        if (v.window[0] > v.window[1]) errors.push(`window ${v.window} is reversed`);
      }
      break;
    case "list":
      if (v.values.length === 0) errors.push("empty list");
      tonesIn(v.tones, v.values.length);
      for (const p of v.pointers ?? []) inRange(p.at, v.values.length, `pointer "${p.label}"`);
      if (v.cycleTo !== undefined) inRange(v.cycleTo, v.values.length, "cycleTo");
      break;
    case "bars":
      if (v.values.length === 0) errors.push("no bars");
      if (v.values.some((b) => b < 0)) errors.push("negative bar");
      if (v.water && v.water.length > v.values.length) errors.push("more water than bars");
      if (v.water?.some((w) => w < 0)) errors.push("negative water");
      tonesIn(v.tones, v.values.length);
      for (const p of v.pointers ?? []) inRange(p.at, v.values.length, `pointer "${p.label}"`);
      break;
    case "stack":
      tonesIn(v.tones, v.items.length);
      break;
    case "tree": {
      if (v.values[0] === null || v.values.length === 0) errors.push("tree without a root");
      v.values.forEach((val, i) => {
        if (val !== null && i > 0 && v.values[Math.floor((i - 1) / 2)] === null) errors.push(`node ${i} has no parent`);
      });
      for (const [tone, idx] of Object.entries(v.tones ?? {})) {
        for (const i of idx ?? []) {
          inRange(i, v.values.length, `${tone} tone`);
          if (v.values[i] === null) errors.push(`${tone} tone on empty slot ${i}`);
        }
      }
      break;
    }
    case "grid": {
      if (v.rows.length === 0) errors.push("empty grid");
      for (const [tone, cells] of Object.entries(v.tones ?? {})) {
        for (const [r, c] of cells ?? []) {
          if (r < 0 || r >= v.rows.length || c < 0 || c >= (v.rows[r]?.length ?? 0)) {
            errors.push(`${tone} tone at [${r},${c}] outside the grid`);
          }
        }
      }
      if (v.rowLabels && v.rowLabels.length !== v.rows.length) errors.push("rowLabels length != rows");
      const width = Math.max(...v.rows.map((r) => r.length));
      if (v.colLabels && v.colLabels.length !== width) errors.push("colLabels length != columns");
      break;
    }
    case "graph": {
      const ids = v.nodes.map((n) => n.id);
      if (new Set(ids).size !== ids.length) errors.push("duplicate node ids");
      for (const [a, b] of v.edges) {
        if (!ids.includes(a) || !ids.includes(b)) errors.push(`edge ${a}->${b} references a missing node`);
      }
      const placed = v.nodes.filter((n) => n.x !== undefined && n.y !== undefined).length;
      if (placed !== 0 && placed !== v.nodes.length) errors.push("only some nodes have coordinates");
      break;
    }
    case "intervals":
      if (v.items.length === 0) errors.push("no intervals");
      for (const it of v.items) if (it.start > it.end) errors.push(`interval [${it.start},${it.end}] is reversed`);
      break;
    case "ntree": {
      const walk = (n: NTreeNode) => {
        if (String(n.label).length === 0) errors.push("empty ntree label");
        n.children?.forEach(walk);
      };
      walk(v.root);
      break;
    }
  }
  return errors;
}

describe("solution diagrams", () => {
  it("exist in the corpus for every visual kind", () => {
    const kinds = new Set(visuals.map((x) => x.v.kind));
    expect([...kinds].sort()).toEqual(["array", "bars", "graph", "grid", "intervals", "list", "ntree", "stack", "tree"]);
  });

  it("only reference indices, cells and nodes that exist", () => {
    const problems = visuals.flatMap(({ where, v }) => visualProblems(v).map((e) => `${where} (${v.kind}): ${e}`));
    expect(problems).toEqual([]);
  });

  describe("the integrity checker itself", () => {
    it.each<[string, Visual]>([
      ["pointer past the end", { kind: "array", values: [1, 2], pointers: [{ at: 2, label: "r" }] }],
      ["negative tone index", { kind: "array", values: [1], tones: { good: [-1] } }],
      ["reversed window", { kind: "array", values: [1, 2, 3], window: [2, 0] }],
      ["cycle past the end", { kind: "list", values: [1, 2], cycleTo: 5 }],
      ["orphan tree node", { kind: "tree", values: [1, null, 3, 4] }],
      ["tone on an empty tree slot", { kind: "tree", values: [1, null, 2], tones: { bad: [1] } }],
      ["grid tone outside", { kind: "grid", rows: [[1, 2]], tones: { accent: [[1, 0]] } }],
      ["dangling graph edge", { kind: "graph", nodes: [{ id: "a" }], edges: [["a", "b"]] }],
      ["reversed interval", { kind: "intervals", items: [{ start: 5, end: 1 }] }],
    ])("catches a %s", (_, v) => {
      expect(visualProblems(v).length).toBeGreaterThan(0);
    });
  });
});
