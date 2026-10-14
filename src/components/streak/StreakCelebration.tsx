"use client";

import { useEffect, useState } from "react";
import { Flame } from "lucide-react";
import type { StreakView } from "@/lib/types";
import StreakWeek from "./StreakWeek";

function headline(n: number) {
  if (n === 1) return "You started a streak!";
  if (n % 100 === 0) return "Legendary. Absolutely legendary.";
  if (n % 7 === 0) return `${n / 7} ${n === 7 ? "week" : "weeks"} strong!`;
  return "Streak extended!";
}

/** Full-screen Duolingo-style "day streak" moment after the first solve of the day. */
export default function StreakCelebration({
  streak,
  onClose,
}: {
  streak: StreakView;
  onClose: () => void;
}) {
  // Tick up from yesterday's number for the "+1" moment
  const target = streak.current;
  const [shown, setShown] = useState(Math.max(0, target - 1));

  useEffect(() => {
    const id = setTimeout(() => setShown(target), 450);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(id);
      window.removeEventListener("keydown", onKey);
    };
  }, [target, onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="streak-celebration-title"
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-6 bg-[var(--background)] p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
    >
      <div className="flex flex-1 flex-col items-center justify-center gap-2">
        <Flame className="animate-flame size-32 text-orange-500" fill="currentColor" strokeWidth={1.5} />
        <p
          key={shown}
          className="animate-pop text-7xl font-black tabular-nums text-orange-500"
        >
          {shown}
        </p>
        <h2 id="streak-celebration-title" className="text-2xl font-black text-orange-500">
          day streak!
        </h2>
        <p className="mt-2 text-center font-bold text-zinc-500">{headline(streak.current)}</p>
        <div className="mt-6 w-full max-w-xs rounded-3xl border-2 border-zinc-200 p-4 dark:border-zinc-800">
          <StreakWeek week={streak.week} />
        </div>
      </div>
      <button
        type="button"
        autoFocus
        onClick={onClose}
        className="btn-3d w-full max-w-sm rounded-2xl border-orange-600 bg-orange-500 py-3.5 font-extrabold uppercase tracking-wide text-white hover:bg-orange-400"
      >
        Continue
      </button>
    </div>
  );
}
