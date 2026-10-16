"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CircleCheck, CircleX, Gem, RotateCcw, Trophy, X } from "lucide-react";
import { matchesAnswer } from "@/content/exercises/answer";
import type { TrainingItem } from "@/lib/training";
import { playCorrect, playFanfare, playWrong } from "@/lib/training-sounds";
import CodeBlock from "../solution/CodeBlock";
import Rich from "../solution/Rich";

interface Feedback {
  correct: boolean;
  /** Feedback specific to this wrong answer, when the exercise anticipates it. */
  why?: string;
}

/** Mastery only applies to a single problem's session, never to a pattern mix. */
export interface MasteryTarget {
  problemId: string;
  alreadyMastered: boolean;
}

/**
 * Duolingo-style run through `items`: a wrong answer goes to the back of the
 * queue, and the session ends once every exercise has been answered correctly.
 * The only thing saved is mastery (10/10 on the first try for one problem);
 * training never touches solved state, review or the streak.
 */
export default function TrainingSession({
  items,
  title,
  backHref,
  mastery,
}: {
  items: TrainingItem[];
  title: string;
  backHref: string;
  mastery?: MasteryTarget;
}) {
  const router = useRouter();
  const [queue, setQueue] = useState(items);
  const [missed, setMissed] = useState<Set<string>>(new Set());
  const [input, setInput] = useState("");
  const [choice, setChoice] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  // Bumped on every new turn so the input remounts (and refocuses) even when the same exercise comes back
  const [turn, setTurn] = useState(0);
  const [masteryStatus, setMasteryStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const current = queue[0];
  const completed = items.length - queue.length;
  const canCheck = current?.kind === "type" ? input.trim() !== "" : choice !== null;

  function check() {
    if (!current || feedback || !canCheck) return;
    let result: Feedback;
    if (current.kind === "type") {
      const correct = matchesAnswer(input, current.answers);
      const mistake = correct ? undefined : current.mistakes?.find((m) => matchesAnswer(input, m.answers));
      result = { correct, why: mistake?.why };
    } else {
      const option = current.options[choice!];
      result = { correct: !!option.correct, why: option.correct ? undefined : option.why };
    }
    if (result.correct) playCorrect();
    else {
      playWrong();
      setMissed((m) => new Set(m).add(current.id));
    }
    setFeedback(result);
  }

  async function saveMastery(problemId: string) {
    setMasteryStatus("saving");
    try {
      const res = await fetch(`/api/problems/${problemId}/master`, { method: "POST" });
      setMasteryStatus(res.ok ? "saved" : "error");
    } catch {
      setMasteryStatus("error");
    }
  }

  function next() {
    if (!feedback) return;
    const finished = feedback.correct && queue.length === 1;
    if (finished) playFanfare();
    const finishedPerfect = finished && missed.size === 0;
    if (finishedPerfect && mastery && !mastery.alreadyMastered) void saveMastery(mastery.problemId);
    setQueue((q) => (feedback.correct ? q.slice(1) : [...q.slice(1), q[0]]));
    setInput("");
    setChoice(null);
    setFeedback(null);
    setTurn((t) => t + 1);
    // Long snippets can leave the page scrolled down; start each exercise at the top
    window.scrollTo({ top: 0 });
  }

  // Enter checks / continues; number keys pick an option
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!current) return;
      if (e.key === "Enter") {
        e.preventDefault();
        if (feedback) next();
        else check();
      } else if (current.kind === "choice" && !feedback && /^[1-9]$/.test(e.key)) {
        const index = Number(e.key) - 1;
        if (index < current.options.length) setChoice(index);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!current) {
    const firstTry = items.length - missed.size;
    const perfect = missed.size === 0;
    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-4 py-10 text-center">
        <div className="animate-pop flex size-24 items-center justify-center rounded-full bg-amber-400 text-white">
          <Trophy className="size-12" strokeWidth={2.5} />
        </div>
        <h1 className="mt-6 text-3xl font-black">Training complete!</h1>
        <p className="mt-1 font-bold text-zinc-500">{title}</p>
        <div className="mt-6 w-full rounded-2xl border-2 border-zinc-200 p-4 dark:border-zinc-700">
          <p className="text-xs font-extrabold uppercase tracking-wider text-zinc-400">Right on the first try</p>
          <p className="mt-1 text-4xl font-black text-green-500">
            {firstTry}
            <span className="text-xl text-zinc-400"> / {items.length}</span>
          </p>
        </div>
        {mastery && (
          <div
            className={`mt-3 flex w-full items-center gap-3 rounded-2xl border-2 p-3 text-left text-sm font-bold ${
              perfect
                ? "border-violet-300 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-950 dark:text-violet-300"
                : "border-zinc-200 text-zinc-500 dark:border-zinc-700"
            }`}
          >
            <Gem className="size-6 shrink-0" />
            <span>
              {mastery.alreadyMastered
                ? "Already mastered: this problem is violet on your path."
                : !perfect
                  ? "Get 10/10 on the first try to master this problem and turn it violet."
                  : masteryStatus === "error"
                    ? "Mastered, but it couldn't be saved. Check your connection and train again."
                    : masteryStatus === "saved"
                      ? "Mastered! This problem is now violet on your path."
                      : "Saving mastery…"}
            </span>
          </div>
        )}
        <p className="mt-3 text-xs text-zinc-400">Training doesn&apos;t count toward your streak.</p>
        <div className="mt-8 grid w-full gap-3">
          <button
            onClick={() => router.refresh()}
            className="btn-3d flex items-center justify-center gap-2 rounded-2xl border-violet-700 bg-violet-500 py-3 font-extrabold uppercase tracking-wide text-white hover:bg-violet-400"
          >
            <RotateCcw className="size-4" /> Train again
          </button>
          <Link
            href={backHref}
            className="btn-3d rounded-2xl border-2 border-zinc-300 bg-white py-3 font-extrabold uppercase tracking-wide text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Back to path
          </Link>
        </div>
      </main>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="mx-auto flex w-full max-w-2xl items-center gap-4 px-4 py-4">
        <Link
          href={backHref}
          aria-label="Quit training"
          className="rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
        >
          <X className="size-6" />
        </Link>
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={items.length}
          aria-valuenow={completed}
          className="h-4 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800"
        >
          <div
            className="h-full rounded-full bg-green-500 transition-[width] duration-300"
            style={{ width: `${(completed / items.length) * 100}%` }}
          />
        </div>
        <span className="text-sm font-extrabold text-zinc-400">
          {completed}/{items.length}
        </span>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-80 pt-2">
        <section className="rounded-2xl border-2 border-violet-200 bg-violet-50 p-4 dark:border-violet-900 dark:bg-violet-950/40">
          <p className="text-xs font-extrabold uppercase tracking-wider text-violet-500">{current.problemTitle}</p>
          <p className="mt-1 text-sm text-violet-950 dark:text-violet-100">
            <Rich text={current.problemSummary} />
          </p>
        </section>
        <h1 className="mt-5 text-xl font-extrabold leading-snug">
          <Rich text={current.prompt} />
        </h1>
        {current.code && (
          <div className="mt-4">
            <CodeBlock
              code={current.code.replace(/^\n+|\s+$/g, "")}
              label={current.solution ? "Solution" : "Python"}
              copy={false}
            />
          </div>
        )}

        {current.kind === "type" ? (
          <input
            key={turn}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            readOnly={!!feedback}
            placeholder="Type your answer"
            aria-label="Your answer"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            enterKeyHint="done"
            className={`mt-5 w-full rounded-2xl border-2 bg-zinc-50 px-4 py-3 font-mono text-lg outline-none dark:bg-zinc-900 ${
              feedback
                ? feedback.correct
                  ? "border-green-500 text-green-700 dark:text-green-400"
                  : "border-red-500 text-red-700 dark:text-red-400"
                : "border-zinc-200 focus:border-sky-400 dark:border-zinc-700"
            }`}
          />
        ) : (
          <div role="radiogroup" className="mt-5 grid gap-3">
            {current.options.map((option, i) => {
              const picked = choice === i;
              let tone = "border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800";
              if (feedback && option.correct) tone = "border-green-500 bg-green-50 dark:bg-green-950";
              else if (feedback && picked) tone = "border-red-500 bg-red-50 dark:bg-red-950";
              else if (picked) tone = "border-sky-400 bg-sky-50 dark:bg-sky-950";
              return (
                <button
                  key={`${turn}-${i}`}
                  type="button"
                  role="radio"
                  aria-checked={picked}
                  disabled={!!feedback}
                  onClick={() => setChoice(i)}
                  className={`btn-3d flex items-start gap-3 rounded-2xl border-2 p-3 text-left font-semibold [--depth:3px] disabled:cursor-default ${tone}`}
                >
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-lg border-2 border-zinc-300 text-xs font-extrabold text-zinc-400 dark:border-zinc-600">
                    {i + 1}
                  </span>
                  <span>
                    <Rich text={option.text} />
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </main>

      <footer
        className={`fixed inset-x-0 bottom-0 border-t-2 ${
          feedback
            ? feedback.correct
              ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950"
              : "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950"
            : "border-zinc-200 bg-[var(--background)] dark:border-zinc-800"
        }`}
      >
        <div className="mx-auto max-h-[60dvh] max-w-2xl overflow-y-auto px-4 py-4">
          {feedback && (
            <div className="animate-pop mb-4" aria-live="polite">
              {feedback.correct ? (
                <p className="flex items-center gap-2 text-xl font-black text-green-600 dark:text-green-400">
                  <CircleCheck className="size-6" strokeWidth={3} /> Correct!
                </p>
              ) : (
                <>
                  <p className="flex items-center gap-2 text-xl font-black text-red-600 dark:text-red-400">
                    <CircleX className="size-6" strokeWidth={3} /> Not quite
                  </p>
                  {feedback.why && (
                    <p className="mt-2 text-sm text-red-900 dark:text-red-200">
                      <Rich text={feedback.why} />
                    </p>
                  )}
                  <p className="mt-3 text-xs font-extrabold uppercase tracking-wider text-red-500">Correct answer</p>
                  <p className="mt-1 font-mono font-bold text-red-900 dark:text-red-100">
                    <Rich text={current.kind === "type" ? current.answers[0] : current.options.find((o) => o.correct)!.text} />
                  </p>
                </>
              )}
              <p className={`mt-3 text-sm ${feedback.correct ? "text-green-900 dark:text-green-200" : "text-red-900 dark:text-red-200"}`}>
                <Rich text={current.explanation} />
              </p>
            </div>
          )}
          <button
            onClick={feedback ? next : check}
            disabled={!feedback && !canCheck}
            className={`btn-3d w-full rounded-2xl py-3 font-extrabold uppercase tracking-wide text-white disabled:cursor-not-allowed disabled:border-zinc-300 disabled:bg-zinc-200 disabled:text-zinc-400 dark:disabled:border-zinc-700 dark:disabled:bg-zinc-800 ${
              feedback && !feedback.correct
                ? "border-red-700 bg-red-500 hover:bg-red-400"
                : "border-green-700 bg-green-500 hover:bg-green-400"
            }`}
          >
            {feedback ? "Continue" : "Check"}
          </button>
        </div>
      </footer>
    </div>
  );
}
