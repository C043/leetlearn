import { notFound } from "next/navigation";
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
          </section>
          <PatternPath problems={pattern.problems} />
        </main>
      </div>
    </ProblemModalProvider>
  );
}
