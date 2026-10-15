import type { PatternSummary } from "./types";

/** Full class strings (Tailwind only picks up literal names) for one path tile. */
export interface PathColor {
  /** Tile face and its darker 3D edge. */
  tile: string;
  /** Number badge on the tile. */
  badge: string;
  /** Filled part of the progress bar. */
  bar: string;
}

export const PATH_COLORS: readonly PathColor[] = [
  { tile: "border-green-700 bg-green-500 hover:bg-green-400", badge: "text-green-600", bar: "bg-white" },
  { tile: "border-sky-700 bg-sky-500 hover:bg-sky-400", badge: "text-sky-600", bar: "bg-white" },
  { tile: "border-violet-700 bg-violet-500 hover:bg-violet-400", badge: "text-violet-600", bar: "bg-white" },
  { tile: "border-orange-700 bg-orange-500 hover:bg-orange-400", badge: "text-orange-600", bar: "bg-white" },
  { tile: "border-pink-700 bg-pink-500 hover:bg-pink-400", badge: "text-pink-600", bar: "bg-white" },
  { tile: "border-teal-700 bg-teal-500 hover:bg-teal-400", badge: "text-teal-600", bar: "bg-white" },
  { tile: "border-indigo-700 bg-indigo-500 hover:bg-indigo-400", badge: "text-indigo-600", bar: "bg-white" },
  { tile: "border-rose-700 bg-rose-500 hover:bg-rose-400", badge: "text-rose-600", bar: "bg-white" },
];

/** Color of path `order` (1-based); neighbours always differ. */
export function pathColor(order: number): PathColor {
  const n = PATH_COLORS.length;
  return PATH_COLORS[(((order - 1) % n) + n) % n];
}

/** The first path that still has unsolved problems, or null if all are done. */
export function nextPathOrder(patterns: PatternSummary[]): number | null {
  return patterns.find((p) => p.solved < p.total)?.order ?? null;
}
