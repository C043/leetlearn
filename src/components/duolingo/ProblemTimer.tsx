"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { RotateCcw, Timer } from "lucide-react";
import { unlockAudio } from "@/lib/chime";
import {
  TIMER_MS,
  getTimersServerSnapshot,
  getTimersSnapshot,
  resetTimer,
  startTimer,
  subscribeTimers,
} from "@/lib/problemTimers";

function formatClock(ms: number) {
  const totalSeconds = Math.ceil(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Optional 15-minute stopwatch for a problem. Rings when done; never affects solve tracking. */
export default function ProblemTimer({ problemId }: { problemId: string }) {
  const timers = useSyncExternalStore(subscribeTimers, getTimersSnapshot, getTimersServerSnapshot);
  const startedAt = timers[problemId];
  const [now, setNow] = useState(() => Date.now());

  const running = startedAt !== undefined && now - startedAt < TIMER_MS;

  useEffect(() => {
    if (startedAt === undefined) return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [startedAt]);

  function start() {
    unlockAudio();
    startTimer(problemId);
  }

  if (startedAt === undefined) {
    return (
      <button
        onClick={start}
        className="btn-3d mb-6 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-zinc-300 bg-white py-2.5 text-sm font-extrabold uppercase tracking-wide text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
      >
        <Timer className="size-4" /> Start 15:00 timer
      </button>
    );
  }

  const elapsed = Math.min(Math.max(now - startedAt, 0), TIMER_MS);
  const progress = elapsed / TIMER_MS;
  const done = !running;

  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center justify-between">
        <span
          className={`flex items-center gap-1.5 text-sm font-extrabold uppercase tracking-wide ${
            done ? "text-amber-500" : "text-zinc-500"
          }`}
        >
          <Timer className="size-4" />
          {done ? "Time's up!" : formatClock(TIMER_MS - elapsed)}
        </span>
        <button
          onClick={done ? start : () => resetTimer(problemId)}
          aria-label={done ? "Restart timer" : "Reset timer"}
          className="flex items-center gap-1 rounded-full px-2 py-1 text-xs font-extrabold uppercase tracking-wide text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
        >
          <RotateCcw className="size-3.5" /> {done ? "Restart" : "Reset"}
        </button>
      </div>
      <div
        role="progressbar"
        aria-label="15 minute timer"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        className="h-4 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800"
      >
        <div
          className={`relative h-full rounded-full transition-[width] duration-300 ease-linear ${
            done ? "bg-amber-400" : "bg-green-500"
          }`}
          style={{ width: `${progress * 100}%` }}
        >
          {/* Duolingo-style glossy highlight along the top of the fill */}
          <div className="absolute inset-x-2 top-1 h-1 rounded-full bg-white/30" />
        </div>
      </div>
    </div>
  );
}
