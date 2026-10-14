"use client";

import { useEffect, useRef, useState } from "react";
import { Flame } from "lucide-react";
import type { ReminderPrefs, StreakView } from "@/lib/types";
import ReminderSettings from "./ReminderSettings";
import StreakWeek from "./StreakWeek";

function streakMessage(s: StreakView) {
  if (s.doneToday) return "You've extended your streak today. See you tomorrow!";
  if (s.atRisk) return "Solve a problem today to keep your streak alive!";
  return "Solve a problem to start a new streak.";
}

/** Header flame: grey until today's solve, orange once the streak is extended. */
export default function StreakButton({
  streak,
  prefs,
}: {
  streak: StreakView;
  prefs: ReminderPrefs;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div ref={ref} className="sm:relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={`${streak.current} day streak`}
        className={`flex items-center gap-1.5 rounded-xl px-2 py-1 font-extrabold hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
          streak.doneToday ? "text-orange-500" : "text-zinc-400"
        }`}
      >
        <Flame className="size-6" fill="currentColor" />
        {streak.current}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Streak"
          className="animate-pop fixed inset-x-4 top-16 z-50 flex flex-col gap-4 rounded-3xl border-2 border-b-4 border-zinc-200 bg-white p-5 shadow-xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-80 dark:border-zinc-700 dark:bg-zinc-900"
        >
          <div className="flex items-center gap-3">
            <Flame
              className={`size-12 shrink-0 ${streak.doneToday ? "text-orange-500" : "text-zinc-300 dark:text-zinc-600"}`}
              fill="currentColor"
            />
            <div>
              <p className="text-2xl font-black">
                {streak.current} day streak
              </p>
              <p className="text-sm text-zinc-500">{streakMessage(streak)}</p>
            </div>
          </div>
          <StreakWeek week={streak.week} />
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Longest streak · {streak.longest} {streak.longest === 1 ? "day" : "days"}
          </p>
          <hr className="border-zinc-200 dark:border-zinc-700" />
          <ReminderSettings prefs={prefs} />
        </div>
      )}
    </div>
  );
}
