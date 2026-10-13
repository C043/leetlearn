/**
 * Solution walkthroughs: a short intuition, numbered steps, and typed
 * diagrams that src/components/solution/Visual.tsx renders as inline SVG.
 *
 * Text fields support `inline code` and **bold**.
 */

export type Tone = "accent" | "good" | "bad" | "muted";
export type Cell = string | number;
type Tones<T> = Partial<Record<Tone, T[]>>;

export interface Pointer {
  at: number;
  label: string;
  tone?: Tone;
}

export interface NTreeNode {
  label: string;
  tone?: Tone;
  /** Optional label drawn on the edge from the parent (e.g. the choice made). */
  edge?: string;
  children?: NTreeNode[];
}

export type Visual =
  /** Boxes in a row with index labels, pointer arrows and an optional window bracket. */
  | {
      kind: "array";
      values: Cell[];
      tones?: Tones<number>;
      pointers?: Pointer[];
      window?: [number, number];
      indices?: boolean;
      caption?: string;
    }
  /** Matrix / DP table. Tones are [row, col] pairs. */
  | {
      kind: "grid";
      rows: Cell[][];
      tones?: Tones<[number, number]>;
      rowLabels?: string[];
      colLabels?: string[];
      caption?: string;
    }
  /** Binary tree, heap-indexed: children of i are 2i+1 and 2i+2; null = no node. */
  | { kind: "tree"; values: (Cell | null)[]; tones?: Tones<number>; caption?: string }
  /** General tree: recursion / decision trees, tries. */
  | { kind: "ntree"; root: NTreeNode; caption?: string }
  /** Singly linked list; cycleTo draws the tail's next pointer back to that index. */
  | {
      kind: "list";
      values: Cell[];
      tones?: Tones<number>;
      pointers?: Pointer[];
      cycleTo?: number;
      caption?: string;
    }
  /** Nodes placed on a (col, row) grid, or on a circle when x/y are omitted. */
  | {
      kind: "graph";
      nodes: { id: string; x?: number; y?: number; tone?: Tone }[];
      edges: [string, string][];
      directed?: boolean;
      caption?: string;
    }
  /** Horizontal segments on a shared number line. */
  | {
      kind: "intervals";
      items: { start: number; end: number; label?: string; tone?: Tone }[];
      caption?: string;
    }
  /** Histogram; `water[i]` stacks a blue segment on top of bar i. */
  | {
      kind: "bars";
      values: number[];
      water?: number[];
      tones?: Tones<number>;
      pointers?: Pointer[];
      caption?: string;
    }
  /** Vertical stack, items listed bottom -> top. */
  | { kind: "stack"; items: Cell[]; tones?: Tones<number>; caption?: string };

export interface SolutionStep {
  text: string;
  visual?: Visual;
}

export interface Solution {
  /** The key insight in a few sentences. */
  idea: string;
  steps: SolutionStep[];
  time: string;
  space: string;
  pitfalls?: string[];
  /** A specific video walkthrough; defaults to a YouTube search for the problem. */
  videoUrl?: string;
}

export function defineSolutions(solutions: Record<string, Solution>) {
  return solutions;
}
