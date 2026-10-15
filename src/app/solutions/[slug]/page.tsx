import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CirclePlay, Code, ExternalLink, Gauge, Lightbulb, MemoryStick, TriangleAlert } from "lucide-react";
import { PATTERNS } from "@/content";
import { getCode, getSolution, videoUrlFor } from "@/content/solutions";
import DifficultyBadge from "@/components/duolingo/DifficultyBadge";
import CodeBlock from "@/components/solution/CodeBlock";
import Visual from "@/components/solution/Visual";

function findProblem(slug: string) {
  for (const pattern of PATTERNS) {
    const index = pattern.problems.findIndex((p) => p.slug === slug);
    if (index !== -1) return { pattern, problem: pattern.problems[index], order: index + 1 };
  }
  return null;
}

export function generateStaticParams() {
  return PATTERNS.flatMap((p) => p.problems.map((q) => ({ slug: q.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const found = findProblem((await params).slug);
  return { title: found ? `${found.problem.title} · LeetLearn` : "LeetLearn" };
}

/** Renders `code` and **bold** spans; everything else is plain text. */
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).map((part, i) => {
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code key={i} className="rounded-md bg-zinc-100 px-1.5 py-0.5 font-mono text-[0.9em] text-pink-600 dark:bg-zinc-800 dark:text-pink-400">
              {part.slice(1, -1)}
            </code>
          );
        }
        if (part.startsWith("**") && part.endsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
        return part;
      })}
    </>
  );
}

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const found = findProblem(slug);
  const solution = getSolution(slug);
  const code = getCode(slug);
  if (!found || !solution || !code) notFound();
  const { pattern, problem, order } = found;

  return (
    <>
      <header className="sticky top-0 z-40 border-b-2 border-zinc-200 bg-[var(--background)]/90 backdrop-blur dark:border-zinc-800">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Link
            href={`/patterns/${pattern.order}`}
            className="flex items-center gap-1.5 text-sm font-extrabold uppercase tracking-wide text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            <ArrowLeft className="size-4" /> {pattern.name}
          </Link>
          <Link href="/" className="text-2xl font-black tracking-tight text-green-500">
            LeetLearn
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6">
        <p className="mb-1 text-xs font-bold uppercase tracking-wider text-zinc-400">
          {pattern.name} · #{order}
        </p>
        <h1 className="text-3xl font-black">{problem.title}</h1>
        <div className="mt-3">
          <DifficultyBadge difficulty={problem.difficulty} />
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <a
            href={problem.leetcodeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-3d flex items-center justify-center gap-2 rounded-2xl border-sky-600 bg-sky-500 py-3 font-extrabold uppercase tracking-wide text-white hover:bg-sky-400"
          >
            Open on LeetCode <ExternalLink className="size-4" />
          </a>
          <a
            href={videoUrlFor(slug, problem.title)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-3d flex items-center justify-center gap-2 rounded-2xl border-red-700 bg-red-500 py-3 font-extrabold uppercase tracking-wide text-white hover:bg-red-400"
          >
            <CirclePlay className="size-5" /> Watch video
          </a>
        </div>

        <section className="mt-8 rounded-3xl border-2 border-b-4 border-amber-300 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-950/40">
          <h2 className="mb-2 flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            <Lightbulb className="size-4" /> The idea
          </h2>
          <p className="leading-relaxed">
            <Rich text={solution.idea} />
          </p>
        </section>

        <section className="mt-8">
          <h2 className="mb-4 text-xl font-black">Step by step</h2>
          <ol className="space-y-6">
            {solution.steps.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full border-b-4 border-green-700 bg-green-500 text-sm font-black text-white">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1 pt-1">
                  <p className="leading-relaxed">
                    <Rich text={step.text} />
                  </p>
                  {step.visual && <Visual visual={step.visual} />}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-8">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-black">
            <Code className="size-5" /> Code
          </h2>
          <CodeBlock code={code} />
        </section>

        <section className="mt-8 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border-2 border-zinc-200 p-4 dark:border-zinc-800">
            <p className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-zinc-400">
              <Gauge className="size-4" /> Time
            </p>
            <p className="mt-1 font-mono text-lg font-bold">{solution.time}</p>
          </div>
          <div className="rounded-2xl border-2 border-zinc-200 p-4 dark:border-zinc-800">
            <p className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-zinc-400">
              <MemoryStick className="size-4" /> Space
            </p>
            <p className="mt-1 font-mono text-lg font-bold">{solution.space}</p>
          </div>
        </section>

        {solution.pitfalls && solution.pitfalls.length > 0 && (
          <section className="mt-8 rounded-3xl border-2 border-rose-200 p-5 dark:border-rose-900">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-rose-500">
              <TriangleAlert className="size-4" /> Watch out for
            </h2>
            <ul className="list-disc space-y-1.5 pl-5">
              {solution.pitfalls.map((p, i) => (
                <li key={i}>
                  <Rich text={p} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </>
  );
}
