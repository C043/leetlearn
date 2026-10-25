import Link from "next/link";
import { ChartColumn, CircleCheck } from "lucide-react";
import type { ReminderPrefs, StreakView } from "@/lib/types";
import StreakButton from "../streak/StreakButton";

export default function AppHeader({
  solved,
  total,
  streak,
  prefs,
  onStats = false,
}: {
  solved: number;
  total: number;
  streak: StreakView;
  prefs: ReminderPrefs;
  /** On the stats page the progress count is redundant and the stats icon is highlighted. */
  onStats?: boolean;
}) {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-zinc-200 bg-[var(--background)]/90 backdrop-blur dark:border-zinc-800">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-2xl font-black tracking-tight text-green-500">
          LeetLearn
        </Link>
        <div className="flex items-center gap-3">
          {!onStats && (
            <span className="flex items-center gap-1.5 font-extrabold text-green-500" title="Problems solved">
              <CircleCheck className="size-5" strokeWidth={3} />
              {solved}
              <span className="text-sm font-bold text-zinc-400">/ {total}</span>
            </span>
          )}
          {/* ml-2 offsets the streak button's px-2 so the icon sits evenly between its neighbours */}
          <Link
            href="/stats"
            aria-label="Stats"
            title="Stats"
            aria-current={onStats ? "page" : undefined}
            className={`ml-2 flex size-9 items-center justify-center rounded-xl hover:bg-zinc-100 hover:text-sky-500 dark:hover:bg-zinc-800 ${
              onStats ? "text-sky-500" : "text-zinc-400"
            }`}
          >
            <ChartColumn className="size-5" strokeWidth={3} />
          </Link>
          <StreakButton streak={streak} prefs={prefs} />
        </div>
      </div>
    </header>
  );
}
