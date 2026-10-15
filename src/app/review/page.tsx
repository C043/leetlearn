import { getReviewQueue } from "@/lib/queries";
import { getHeaderData } from "@/lib/header-data";
import { REVIEW_QUEUE_SIZE, nextScheduledRotation, rotateReviewQueueIfDue } from "@/lib/review-service";
import { ProblemModalProvider } from "@/components/duolingo/ProblemModalProvider";
import AppHeader from "@/components/duolingo/AppHeader";
import BackToPaths from "@/components/duolingo/BackToPaths";
import ReviewList from "@/components/review/ReviewList";

export const dynamic = "force-dynamic";

export default async function ReviewPage() {
  await rotateReviewQueueIfDue();
  const [{ header }, review] = await Promise.all([getHeaderData(), getReviewQueue()]);

  return (
    <ProblemModalProvider>
      <AppHeader {...header} />
      <main className="mx-auto max-w-2xl px-4 pb-12 pt-6">
        <BackToPaths />
        <section className="mt-5 rounded-3xl border-b-4 border-sky-700 bg-gradient-to-r from-sky-500 to-cyan-400 p-5 text-white">
          <p className="text-xs font-extrabold uppercase tracking-wider text-sky-100">
            Spaced repetition · {review.length}/{REVIEW_QUEUE_SIZE}
          </p>
          <h1 className="mt-1 text-2xl font-black">Saturday Review</h1>
          <p className="mt-1 text-sm text-sky-50">
            Every Saturday up to {REVIEW_QUEUE_SIZE} solved problems come back, the ones that took
            longest first. Re-solve one to clear it.
          </p>
        </section>
        <div className="mt-6">
          <ReviewList problems={review} nextRotation={nextScheduledRotation().toISOString()} />
        </div>
      </main>
    </ProblemModalProvider>
  );
}
