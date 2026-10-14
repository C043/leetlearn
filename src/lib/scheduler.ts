import cron from "node-cron";
import { rotateReviewQueueIfDue } from "./review-service";
import { sendStreakRemindersIfDue } from "./streak-reminders";

const globalForCron = globalThis as unknown as { reviewCronStarted?: boolean };

async function runRotation(trigger: string) {
  try {
    const result = await rotateReviewQueueIfDue();
    if (result) {
      console.log(
        `[review] rotated (${trigger}): kept ${result.retained}, added ${result.added}`,
      );
    }
  } catch (err) {
    // Never take the server down because the DB isn't reachable yet.
    console.error(`[review] rotation failed (${trigger}):`, err);
  }
}

export async function startReviewScheduler() {
  if (globalForCron.reviewCronStarted) return;
  globalForCron.reviewCronStarted = true;

  // Every Saturday at 00:00 UTC
  cron.schedule("0 0 * * 6", () => void runRotation("cron"), {
    timezone: "UTC",
  });

  // Streak reminders are checked often; each stage still fires once a day
  cron.schedule("*/10 * * * *", () => void runStreakReminders());

  // Catch up on a Saturday missed while the app was offline
  await runRotation("startup");
}

async function runStreakReminders() {
  try {
    const result = await sendStreakRemindersIfDue();
    if (result) {
      console.log(`[streak] reminder stage ${result.stage}: sent ${result.sent}, failed ${result.failed}`);
    }
  } catch (err) {
    console.error("[streak] reminder check failed:", err);
  }
}
