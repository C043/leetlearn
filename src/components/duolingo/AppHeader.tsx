import Link from "next/link";
import { CircleCheck } from "lucide-react";
import type { ReminderPrefs, StreakView } from "@/lib/types";
import StreakButton from "../streak/StreakButton";

export default function AppHeader({
  solved,
  total,
  streak,
  prefs,
}: {
  solved: number;
  total: number;
  streak: StreakView;
  prefs: ReminderPrefs;
}) {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-zinc-200 bg-[var(--background)]/90 backdrop-blur dark:border-zinc-800">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-2xl font-black tracking-tight text-green-500">
          LeetLearn
        </Link>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-extrabold text-green-500" title="Problems solved">
            <CircleCheck className="size-5" strokeWidth={3} />
            {solved}
            <span className="text-sm font-bold text-zinc-400">/ {total}</span>
          </span>
          <StreakButton streak={streak} prefs={prefs} />
        </div>
      </div>
    </header>
  );
}
