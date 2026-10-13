import type { Difficulty } from "@/lib/types";

const STYLES: Record<Difficulty, string> = {
  EASY: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  MEDIUM: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  HARD: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
};

export default function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-wide ${STYLES[difficulty]}`}
    >
      {difficulty.toLowerCase()}
    </span>
  );
}
