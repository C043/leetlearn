import { notFound } from "next/navigation";
import Link from "next/link";
import { Dumbbell } from "lucide-react";
import { getPattern } from "@/lib/queries";
import { getHeaderData } from "@/lib/header-data";
import { ProblemModalProvider } from "@/components/duolingo/ProblemModalProvider";
import AppHeader from "@/components/duolingo/AppHeader";
import BackToPaths from "@/components/duolingo/BackToPaths";
import PatternPath from "@/components/duolingo/PatternPath";

export const dynamic = "force-dynamic";

export default async function PatternPage({
  params,
}: {
  params: Promise<{ order: string }>;
}) {
  const order = Number((await params).order);
  if (!Number.isInteger(order)) notFound();

  const [pattern, { header }] = await Promise.all([getPattern(order), getHeaderData()]);
  if (!pattern) notFound();

  const solvedHere = pattern.problems.filter((p) => p.isSolved).length;
  const hasTraining = pattern.problems.some((p) => p.hasExercises);
  const canTrain = pattern.problems.some((p) => p.isSolved && p.hasExercises);

  return (
    <ProblemModalProvider>
      <AppHeader {...header} />

      <div className="mx-auto max-w-2xl px-4 py-6">
        <BackToPaths />
        <main className="mt-5 min-w-0">
          <section className="rounded-3xl border-b-4 border-green-700 bg-green-500 p-5 text-white">
            <p className="text-xs font-extrabold uppercase tracking-wider text-green-100">
              Path {pattern.order} · {solvedHere}/{pattern.problems.length} solved
            </p>
            <h1 className="mt-1 text-2xl font-black">{pattern.name}</h1>
            <p className="mt-1 text-sm text-green-50">{pattern.description}</p>
            {hasTraining &&
              (canTrain ? (
                <Link
                  href={`/patterns/${pattern.order}/train`}
                  className="btn-3d mt-4 inline-flex items-center gap-2 rounded-2xl border-2 border-green-800 bg-white px-4 py-2 text-sm font-extrabold uppercase tracking-wide text-green-600 hover:bg-green-50"
                >
                  <Dumbbell className="size-4" /> Train 10 random
                </Link>
              ) : (
                <p className="mt-4 text-xs font-bold text-green-100">Solve a problem to unlock training</p>
              ))}
          </section>
          <PatternPath problems={pattern.problems} />
        </main>
      </div>
    </ProblemModalProvider>
  );
}
