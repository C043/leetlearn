"use client";

import { Check, Clock, Crown, Lock, Star } from "lucide-react";
import type { ProblemView } from "@/lib/types";
import { useProblemModal } from "./ProblemModalProvider";

// Horizontal offsets (px) that make the nodes snake down the page
const ZIGZAG = [0, 48, 76, 48, 0, -48, -76, -48];

function nodeClasses(p: ProblemView) {
  if (p.isSolved) return "border-amber-500 bg-amber-400 text-white";
  if (p.unlocked) return "border-green-700 bg-green-500 text-white hover:bg-green-400";
  return "border-zinc-300 bg-zinc-200 text-zinc-400 dark:border-zinc-800 dark:bg-zinc-700 dark:text-zinc-500";
}

function NodeIcon({ problem }: { problem: ProblemView }) {
  const cls = "size-8";
  if (problem.isSolved) return <Check className={cls} strokeWidth={4} />;
  if (!problem.unlocked) return <Lock className={cls} strokeWidth={2.5} />;
  if (problem.difficulty === "HARD") return <Crown className={cls} strokeWidth={2.5} fill="currentColor" />;
  return <Star className={cls} strokeWidth={2.5} fill="currentColor" />;
}

export default function PatternPath({ problems }: { problems: ProblemView[] }) {
  const { openProblem } = useProblemModal();
  const current = problems.find((p) => p.unlocked && !p.isSolved);

  return (
    <ol className="flex flex-col items-center gap-5 py-6">
      {problems.map((p, i) => {
        const isCurrent = p.id === current?.id;
        return (
          <li
            key={p.id}
            className={`relative flex flex-col items-center ${isCurrent && i > 0 ? "mt-8" : ""}`}
            style={{ transform: `translateX(${ZIGZAG[i % ZIGZAG.length]}px)` }}
          >
            {isCurrent && (
              <span className="animate-float absolute -top-11 z-10 whitespace-nowrap rounded-xl border-2 border-zinc-200 bg-white px-3 py-1.5 text-sm font-extrabold uppercase tracking-wide text-green-600 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-green-400">
                Start
                <span className="absolute -bottom-[7px] left-1/2 size-3 -translate-x-1/2 rotate-45 border-b-2 border-r-2 border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900" />
              </span>
            )}
            <button
              type="button"
              disabled={!p.unlocked}
              onClick={() => openProblem(p)}
              title={p.unlocked ? p.title : `Locked — solve #${p.order - 1} first`}
              aria-label={`${p.order}. ${p.title} (${
                p.isSolved ? "completed" : p.unlocked ? "available" : "locked"
              })`}
              className={`btn-3d relative flex size-[72px] items-center justify-center rounded-full [--depth:6px] disabled:cursor-not-allowed ${nodeClasses(p)} ${
                isCurrent ? "ring-4 ring-green-500/30 ring-offset-4 ring-offset-[var(--background)]" : ""
              }`}
            >
              <NodeIcon problem={p} />
              {p.isSolved && !p.solvedUnder15Min && (
                <span
                  title="Took longer than 15 minutes"
                  className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full border-2 border-white bg-orange-500 text-white dark:border-zinc-950"
                >
                  <Clock className="size-3.5" strokeWidth={3} />
                </span>
              )}
            </button>
            <span className="mt-2 max-w-36 text-center text-xs font-bold leading-tight text-zinc-500 dark:text-zinc-400">
              {p.title}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
