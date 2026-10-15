import { notFound, redirect } from "next/navigation";
import { findProblem } from "@/content";
import { hasExercises } from "@/content/exercises";
import { prisma } from "@/lib/db";
import { problemSession } from "@/lib/training";
import TrainingSession from "@/components/training/TrainingSession";

// Every visit reshuffles
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const found = findProblem((await params).slug);
  return { title: found ? `Train: ${found.problem.title} · LeetLearn` : "LeetLearn" };
}

export default async function ProblemTrainingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const found = findProblem(slug);
  if (!found || !hasExercises(slug)) notFound();
  const backHref = `/patterns/${found.pattern.order}`;

  // Training gives the solution away, so it opens only after the problem is solved
  const row = await prisma.problem.findFirst({
    where: { order: found.order, pattern: { order: found.pattern.order } },
    select: { id: true, isSolved: true, trainingMasteredAt: true },
  });
  if (!row?.isSolved) redirect(backHref);

  return (
    <TrainingSession
      key={crypto.randomUUID()}
      title={found.problem.title}
      items={problemSession(found.problem)}
      backHref={backHref}
      mastery={{ problemId: row.id, alreadyMastered: row.trainingMasteredAt !== null }}
    />
  );
}
