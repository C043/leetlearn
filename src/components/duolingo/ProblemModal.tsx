"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Check, CirclePlay, ExternalLink, LoaderCircle, X } from "lucide-react";
import type { ProblemView } from "@/lib/types";
import DifficultyBadge from "./DifficultyBadge";
import ProblemTimer from "./ProblemTimer";

export default function ProblemModal({
  problem,
  onClose,
}: {
  problem: ProblemView;
  onClose: () => void;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, startTransition] = useTransition();
  const busy = submitting || refreshing;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function submit(solvedUnder15Min: boolean) {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/problems/${problem.id}/solve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ solvedUnder15Min }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Request failed (${res.status})`);
      }
      startTransition(() => {
        router.refresh();
        onClose();
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="problem-modal-title"
        className="animate-pop w-full max-w-md rounded-3xl border-2 border-b-4 border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-zinc-400">
              {problem.patternName} · #{problem.order}
            </p>
            <h2 id="problem-modal-title" className="text-xl font-extrabold">
              {problem.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="mb-5 flex flex-wrap items-center gap-2">
          <DifficultyBadge difficulty={problem.difficulty} />
          {problem.inReview && (
            <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-wide text-sky-700 dark:bg-sky-950 dark:text-sky-300">
              review
            </span>
          )}
          {problem.lastSolvedAt && (
            <span className="text-xs text-zinc-500">
              Last solved {new Date(problem.lastSolvedAt).toLocaleDateString()}
              {problem.solvedUnder15Min ? " · under 15 min" : " · over 15 min"}
            </span>
          )}
        </div>

        <a
          href={problem.leetcodeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-3d mb-3 flex w-full items-center justify-center gap-2 rounded-2xl border-sky-600 bg-sky-500 py-3 font-extrabold uppercase tracking-wide text-white hover:bg-sky-400"
        >
          Open on LeetCode <ExternalLink className="size-4" />
        </a>

        <ProblemTimer problemId={problem.id} />

        <p className="mb-3 text-center font-bold">Solved in under 15 minutes?</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            disabled={busy}
            onClick={() => submit(true)}
            aria-label="Yes, solved in under 15 minutes"
            className="btn-3d flex items-center justify-center rounded-2xl border-green-700 bg-green-500 py-3 text-white hover:bg-green-400 disabled:opacity-60"
          >
            {busy ? <LoaderCircle className="size-7 animate-spin" /> : <Check className="size-7" strokeWidth={3.5} />}
          </button>
          <button
            disabled={busy}
            onClick={() => submit(false)}
            aria-label="No, it took longer than 15 minutes"
            className="btn-3d flex items-center justify-center rounded-2xl border-red-700 bg-red-500 py-3 text-white hover:bg-red-400 disabled:opacity-60"
          >
            {busy ? <LoaderCircle className="size-7 animate-spin" /> : <X className="size-7" strokeWidth={3.5} />}
          </button>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <Link
            href={`/solutions/${problem.slug}`}
            className="btn-3d flex items-center justify-center gap-2 rounded-2xl border-2 border-zinc-300 bg-white py-2.5 text-sm font-extrabold uppercase tracking-wide text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <BookOpen className="size-4" /> Explanation
          </Link>
          <a
            href={problem.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-3d flex items-center justify-center gap-2 rounded-2xl border-2 border-zinc-300 bg-white py-2.5 text-sm font-extrabold uppercase tracking-wide text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <CirclePlay className="size-4" /> Video
          </a>
        </div>

        {error && <p className="mt-4 text-center text-sm font-semibold text-red-500">{error}</p>}
      </div>
    </div>
  );
}
