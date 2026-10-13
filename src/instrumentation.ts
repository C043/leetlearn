export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { startReviewScheduler } = await import("./lib/scheduler");
  await startReviewScheduler();
}
