"use client";

import { Clock, RotateCcw } from "lucide-react";
import type { ProblemView } from "@/lib/types";
import { useProblemModal } from "../duolingo/ProblemModalProvider";
import DifficultyBadge from "../duolingo/DifficultyBadge";

export default function ReviewQueue({
  problems,
  nextRotation,
}: {
  problems: ProblemView[];
  nextRotation: string;
}) {
  const { openProblem } = useProblemModal();
  const next = new Date(nextRotation).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <section
      aria-labelledby="review-heading"
      className="rounded-3xl border-2 border-zinc-200 p-4 dark:border-zinc-800"
    >
      <div className="mb-3 flex items-center gap-2">
        <RotateCcw className="size-5 text-sky-500" strokeWidth={3} />
        <h2 id="review-heading" className="font-extrabold">
          Saturday Review
        </h2>
        <span className="ml-auto text-xs font-bold text-zinc-400">{problems.length}/5</span>
      </div>

      {problems.length === 0 ? (
        <p className="text-sm text-zinc-500">
          Nothing to review right now. Solved problems get picked up every Saturday — next
          refresh <strong>{next}</strong>.
        </p>
      ) : (
        <>
          <ul className="flex flex-col gap-2">
            {problems.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => openProblem(p)}
                  className="w-full rounded-2xl border-2 border-b-4 border-zinc-200 px-3 py-2 text-left transition-colors hover:bg-zinc-50 active:translate-y-0.5 active:border-b-2 dark:border-zinc-700 dark:hover:bg-zinc-900"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex-1 truncate text-sm font-bold">{p.title}</span>
                    {!p.solvedUnder15Min && (
                      <Clock className="size-4 shrink-0 text-orange-500" aria-label="Over 15 minutes last time" />
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <DifficultyBadge difficulty={p.difficulty} />
                    <span className="truncate text-xs text-zinc-500">{p.patternName}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-zinc-500">Next refresh {next}</p>
        </>
      )}
    </section>
  );
}
