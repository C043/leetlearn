import { notFound, redirect } from "next/navigation";
import { getPattern } from "@/lib/queries";
import { patternSession } from "@/lib/training";
import TrainingSession from "@/components/training/TrainingSession";

// Every visit reshuffles
export const dynamic = "force-dynamic";

export default async function PatternTrainingPage({ params }: { params: Promise<{ order: string }> }) {
  const order = Number((await params).order);
  if (!Number.isInteger(order)) notFound();
  const pattern = await getPattern(order);
  if (!pattern) notFound();
  const backHref = `/patterns/${order}`;

  // Only problems already solved, so training never spoils one still ahead on the path
  const trainable = pattern.problems.filter((p) => p.isSolved && p.hasExercises);
  if (trainable.length === 0) redirect(backHref);

  return (
    <TrainingSession
      key={crypto.randomUUID()}
      title={`${pattern.name} mix`}
      items={patternSession(trainable)}
      backHref={backHref}
    />
  );
}
