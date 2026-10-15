import { getReviewQueue } from "@/lib/queries";
import { getHeaderData } from "@/lib/header-data";
import { nextScheduledRotation, rotateReviewQueueIfDue } from "@/lib/review-service";
import AppHeader from "@/components/duolingo/AppHeader";
import PathGrid from "@/components/duolingo/PathGrid";
import ReviewTile from "@/components/review/ReviewTile";

export const dynamic = "force-dynamic";

/** Path selection: the review tile on top, then one tile per learning path. */
export default async function Home() {
  // Cheap safety net in case the cron job didn't fire (e.g. dev server restarts)
  await rotateReviewQueueIfDue();
  const [{ summaries, header }, review] = await Promise.all([getHeaderData(), getReviewQueue()]);

  if (summaries.length === 0) {
    return (
      <main className="mx-auto max-w-md p-8 text-center">
        <h1 className="mb-2 text-2xl font-extrabold">No learning paths yet</h1>
        <p className="text-zinc-500">
          The database is empty. Run <code className="font-mono">npx prisma db seed</code> and
          reload.
        </p>
      </main>
    );
  }

  return (
    <>
      <AppHeader {...header} />
      <main className="mx-auto max-w-5xl px-4 pb-12 pt-6">
        <ReviewTile count={review.length} nextRotation={nextScheduledRotation().toISOString()} />
        <h1 className="mb-4 mt-8 px-1 text-xs font-extrabold uppercase tracking-wider text-zinc-400">
          Learning paths
        </h1>
        <PathGrid patterns={summaries} />
      </main>
    </>
  );
}
