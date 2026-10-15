import { beforeEach, describe, expect, it, vi } from "vitest";

const cron = vi.hoisted(() => ({ schedule: vi.fn() }));
const review = vi.hoisted(() => ({ rotateReviewQueueIfDue: vi.fn() }));
const reminders = vi.hoisted(() => ({ sendStreakRemindersIfDue: vi.fn() }));

vi.mock("node-cron", () => ({ default: cron }));
vi.mock("@/lib/review-service", () => review);
vi.mock("@/lib/streak-reminders", () => reminders);

import { startReviewScheduler } from "@/lib/scheduler";

const globalFlag = globalThis as unknown as { reviewCronStarted?: boolean };

function scheduled(expr: string) {
  const call = cron.schedule.mock.calls.find(([e]) => e === expr);
  if (!call) throw new Error(`nothing scheduled for "${expr}"`);
  return { run: call[1] as () => void, options: call[2] };
}

const flush = () => new Promise((r) => setTimeout(r, 0));

beforeEach(() => {
  delete globalFlag.reviewCronStarted;
  cron.schedule.mockReset();
  review.rotateReviewQueueIfDue.mockReset().mockResolvedValue(null);
  reminders.sendStreakRemindersIfDue.mockReset().mockResolvedValue(null);
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("startReviewScheduler", () => {
  it("schedules the review rotation for Saturday 00:00 UTC", async () => {
    await startReviewScheduler();
    const { options } = scheduled("0 0 * * 6");
    expect(options).toEqual({ timezone: "UTC" });
  });

  it("uses cron expressions node-cron accepts", async () => {
    const real = await vi.importActual<typeof import("node-cron")>("node-cron");
    await startReviewScheduler();
    for (const [expr] of cron.schedule.mock.calls) expect(real.validate(expr as string), expr as string).toBe(true);
  });

  it("checks streak reminders every 10 minutes", async () => {
    await startReviewScheduler();
    expect(() => scheduled("*/10 * * * *")).not.toThrow();
    expect(cron.schedule).toHaveBeenCalledTimes(2);
  });

  it("catches up on a missed rotation at startup", async () => {
    await startReviewScheduler();
    expect(review.rotateReviewQueueIfDue).toHaveBeenCalledTimes(1);
  });

  it("starts only once per process, even when called again (hot reload)", async () => {
    await startReviewScheduler();
    await startReviewScheduler();
    await startReviewScheduler();
    expect(cron.schedule).toHaveBeenCalledTimes(2);
    expect(review.rotateReviewQueueIfDue).toHaveBeenCalledTimes(1);
  });

  it("does not crash the server when the database is unreachable at startup", async () => {
    review.rotateReviewQueueIfDue.mockRejectedValue(new Error("ECONNREFUSED"));
    await expect(startReviewScheduler()).resolves.toBeUndefined();
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining("rotation failed (startup)"), expect.any(Error));
  });

  it("logs a rotation only when one happened", async () => {
    await startReviewScheduler();
    expect(console.log).not.toHaveBeenCalled();

    review.rotateReviewQueueIfDue.mockResolvedValue({ retained: 2, added: 3 });
    scheduled("0 0 * * 6").run();
    await flush();
    expect(console.log).toHaveBeenCalledWith("[review] rotated (cron): kept 2, added 3");
  });

  it("keeps running when a scheduled rotation fails", async () => {
    await startReviewScheduler();
    review.rotateReviewQueueIfDue.mockRejectedValue(new Error("boom"));
    expect(() => scheduled("0 0 * * 6").run()).not.toThrow();
    await flush();
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining("rotation failed (cron)"), expect.any(Error));
  });

  it("sends streak reminders from the 10-minute job and logs what was sent", async () => {
    await startReviewScheduler();
    reminders.sendStreakRemindersIfDue.mockResolvedValue({ stage: 2, sent: 3, failed: 1 });
    scheduled("*/10 * * * *").run();
    await flush();
    expect(reminders.sendStreakRemindersIfDue).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith("[streak] reminder stage 2: sent 3, failed 1");
  });

  it("stays quiet when no reminder is due", async () => {
    await startReviewScheduler();
    scheduled("*/10 * * * *").run();
    await flush();
    expect(console.log).not.toHaveBeenCalled();
  });

  it("swallows reminder failures", async () => {
    await startReviewScheduler();
    reminders.sendStreakRemindersIfDue.mockRejectedValue(new Error("push down"));
    expect(() => scheduled("*/10 * * * *").run()).not.toThrow();
    await flush();
    expect(console.error).toHaveBeenCalledWith("[streak] reminder check failed:", expect.any(Error));
  });
});
