import { notFound } from "next/navigation";
import Link from "next/link";
import { Flame } from "lucide-react";
import { getPattern, getPatternSummaries, getReviewQueue } from "@/lib/queries";
import { nextScheduledRotation, rotateReviewQueueIfDue } from "@/lib/review-service";
import { ProblemModalProvider } from "@/components/duolingo/ProblemModalProvider";
import PatternPath from "@/components/duolingo/PatternPath";
import PatternSwitcher from "@/components/duolingo/PatternSwitcher";
import ReviewQueue from "@/components/review/ReviewQueue";

export const dynamic = "force-dynamic";

export default async function PatternPage({
  params,
}: {
  params: Promise<{ order: string }>;
}) {
  const order = Number((await params).order);
  if (!Number.isInteger(order)) notFound();

  // Cheap safety net in case the cron job didn't fire (e.g. dev server restarts)
  await rotateReviewQueueIfDue();

  const [pattern, summaries, review] = await Promise.all([
    getPattern(order),
    getPatternSummaries(),
    getReviewQueue(),
  ]);
  if (!pattern) notFound();

  const totalSolved = summaries.reduce((n, p) => n + p.solved, 0);
  const total = summaries.reduce((n, p) => n + p.total, 0);
  const solvedHere = pattern.problems.filter((p) => p.isSolved).length;

  return (
    <ProblemModalProvider>
      <header className="sticky top-0 z-40 border-b-2 border-zinc-200 bg-[var(--background)]/90 backdrop-blur dark:border-zinc-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="text-2xl font-black tracking-tight text-green-500">
            leetlearn
          </Link>
          <span className="flex items-center gap-1.5 font-extrabold text-orange-500" title="Problems solved">
            <Flame className="size-5" fill="currentColor" />
            {totalSolved}
            <span className="text-sm font-bold text-zinc-400">/ {total}</span>
          </span>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] gap-6 px-4 py-6 lg:grid-cols-[240px_minmax(0,1fr)_300px]">
        <aside className="min-w-0 lg:sticky lg:top-20 lg:self-start">
          <PatternSwitcher patterns={summaries} activeOrder={order} />
        </aside>

        <main className="min-w-0">
          <section className="rounded-3xl border-b-4 border-green-700 bg-green-500 p-5 text-white">
            <p className="text-xs font-extrabold uppercase tracking-wider text-green-100">
              Path {pattern.order} · {solvedHere}/{pattern.problems.length} solved
            </p>
            <h1 className="mt-1 text-2xl font-black">{pattern.name}</h1>
            <p className="mt-1 text-sm text-green-50">{pattern.description}</p>
          </section>
          <PatternPath problems={pattern.problems} />
        </main>

        <aside className="min-w-0 lg:sticky lg:top-20 lg:self-start">
          <ReviewQueue problems={review} nextRotation={nextScheduledRotation().toISOString()} />
        </aside>
      </div>
    </ProblemModalProvider>
  );
}
