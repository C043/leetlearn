"use client";

import { Clock, PartyPopper, RotateCcw } from "lucide-react";
import type { ProblemView } from "@/lib/types";
import { useProblemModal } from "../duolingo/ProblemModalProvider";
import DifficultyBadge from "../duolingo/DifficultyBadge";
import { formatRotation } from "./formatRotation";

/** The review queue as big tappable cards; tapping one opens the problem modal. */
export default function ReviewList({
  problems,
  nextRotation,
}: {
  problems: ProblemView[];
  nextRotation: string;
}) {
  const { openProblem } = useProblemModal();
  const next = formatRotation(nextRotation);

  if (problems.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-3xl border-2 border-b-4 border-zinc-200 px-6 py-10 text-center dark:border-zinc-800">
        <span className="flex size-20 items-center justify-center rounded-full bg-amber-100 text-amber-500 dark:bg-amber-950">
          <PartyPopper className="size-10" strokeWidth={2.5} />
        </span>
        <h2 className="mt-4 text-2xl font-black">All caught up!</h2>
        <p className="mt-1 text-zinc-500" suppressHydrationWarning>
          Solved problems get picked up every Saturday. Next refresh <strong>{next}</strong>.
        </p>
      </div>
    );
  }

  return (
    <>
      <ul className="flex flex-col gap-4">
        {problems.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => openProblem(p)}
              aria-label={`${p.title} · ${p.patternName}`}
              className="btn-3d flex w-full items-center gap-4 rounded-3xl border-2 border-zinc-200 bg-white p-4 text-left hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              <span className="flex size-14 shrink-0 items-center justify-center rounded-full border-b-4 border-sky-700 bg-sky-500 text-white">
                <RotateCcw className="size-7" strokeWidth={3} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="truncate text-lg font-extrabold">{p.title}</span>
                  {!p.solvedUnder15Min && (
                    <Clock className="size-4 shrink-0 text-orange-500" aria-label="Over 15 minutes last time" />
                  )}
                </span>
                <span className="mt-1 flex items-center gap-2">
                  <DifficultyBadge difficulty={p.difficulty} />
                  <span className="truncate text-sm font-bold text-zinc-500">{p.patternName}</span>
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-center text-sm font-bold text-zinc-400" suppressHydrationWarning>
        Next refresh {next}
      </p>
    </>
  );
}
