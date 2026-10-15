import { beforeEach, describe, expect, it, vi } from "vitest";

const webpush = vi.hoisted(() => ({
  generateVAPIDKeys: vi.fn(() => ({ publicKey: "pub", privateKey: "priv" })),
  sendNotification: vi.fn(),
}));
vi.mock("web-push", () => ({ default: webpush }));

import { prisma } from "@/lib/db";
import { sendStreakRemindersIfDue } from "@/lib/streak-reminders";
import { LAST_CALL_HOUR } from "@/lib/streak-config";
import { setActivityDays, setSettings } from "../helpers/db";

/** Today is 2024-05-10 (UTC unless the test changes the zone); yesterday was active. */
const at = (time: string) => new Date(`2024-05-10T${time}Z`);

beforeEach(async () => {
  webpush.sendNotification.mockReset().mockResolvedValue({ statusCode: 201 });
  await setSettings({ timeZone: "UTC", reminderHour: 20 });
  await setActivityDays(["2024-05-07", "2024-05-08", "2024-05-09"]);
  await prisma.pushSubscription.create({ data: { endpoint: "https://push.example/a", p256dh: "k", auth: "a" } });
});

const sentPayloads = () => webpush.sendNotification.mock.calls.map(([, body]) => JSON.parse(body as string));

describe("sendStreakRemindersIfDue", () => {
  it("uses 22:00 as the last-call hour", () => {
    expect(LAST_CALL_HOUR).toBe(22);
  });

  it("stays quiet before the reminder hour", async () => {
    for (const t of ["00:00:00", "08:00:00", "19:59:59"]) expect(await sendStreakRemindersIfDue(at(t))).toBeNull();
    expect(webpush.sendNotification).not.toHaveBeenCalled();
  });

  it("sends the evening nudge (stage 1) at the reminder hour", async () => {
    expect(await sendStreakRemindersIfDue(at("20:00:00"))).toEqual({ stage: 1, sent: 1, failed: 0 });
    const [payload] = sentPayloads();
    expect(payload).toMatchObject({ url: "/", tag: "streak-reminder" });
    expect(`${payload.title} ${payload.body}`).toMatch(/3|Day 4/);
    expect(await prisma.appSettings.findUnique({ where: { id: 1 } })).toMatchObject({
      lastReminderDay: "2024-05-10",
      lastReminderStage: 1,
    });
  });

  it("sends stage 1 only once a day, however often the job runs", async () => {
    for (const t of ["20:00:00", "20:10:00", "20:20:00", "21:50:00"]) await sendStreakRemindersIfDue(at(t));
    expect(webpush.sendNotification).toHaveBeenCalledTimes(1);
  });

  it("escalates to the last call (stage 2) at 22:00", async () => {
    await sendStreakRemindersIfDue(at("20:00:00"));
    expect(await sendStreakRemindersIfDue(at("22:00:00"))).toMatchObject({ stage: 2 });
    expect(await sendStreakRemindersIfDue(at("22:10:00"))).toBeNull();
    expect(await sendStreakRemindersIfDue(at("23:59:00"))).toBeNull();
    expect(webpush.sendNotification).toHaveBeenCalledTimes(2);
  });

  it("goes straight to the last call if the app was down during the evening nudge", async () => {
    expect(await sendStreakRemindersIfDue(at("22:30:00"))).toMatchObject({ stage: 2 });
    expect(await sendStreakRemindersIfDue(at("22:40:00"))).toBeNull();
    expect(webpush.sendNotification).toHaveBeenCalledTimes(1);
  });

  it("starts over the next day", async () => {
    await sendStreakRemindersIfDue(at("20:00:00"));
    await sendStreakRemindersIfDue(at("22:00:00"));
    // The user solved on the 10th after the last call: streak continues, at risk again on the 11th
    await setActivityDays(["2024-05-10"]);
    expect(await sendStreakRemindersIfDue(new Date("2024-05-11T20:05:00Z"))).toMatchObject({ stage: 1 });
  });

  it("does nothing once today's problem is solved", async () => {
    await setActivityDays(["2024-05-10"]);
    expect(await sendStreakRemindersIfDue(at("20:00:00"))).toBeNull();
    expect(await sendStreakRemindersIfDue(at("22:00:00"))).toBeNull();
  });

  it("does nothing when there is no streak to lose", async () => {
    await prisma.activityDay.deleteMany();
    await setActivityDays(["2024-05-01"]); // broken streak
    expect(await sendStreakRemindersIfDue(at("22:00:00"))).toBeNull();
    expect(webpush.sendNotification).not.toHaveBeenCalled();
  });

  it("does not claim the stage while no device is subscribed, so a later subscriber still gets it", async () => {
    await prisma.pushSubscription.deleteMany();
    expect(await sendStreakRemindersIfDue(at("20:00:00"))).toBeNull();
    expect((await prisma.appSettings.findUnique({ where: { id: 1 } }))!.lastReminderStage).toBe(0);

    await prisma.pushSubscription.create({ data: { endpoint: "https://push.example/b", p256dh: "k", auth: "a" } });
    expect(await sendStreakRemindersIfDue(at("20:10:00"))).toMatchObject({ stage: 1, sent: 1 });
  });

  it("respects a custom reminder hour", async () => {
    await setSettings({ reminderHour: 7 });
    expect(await sendStreakRemindersIfDue(at("06:59:00"))).toBeNull();
    expect(await sendStreakRemindersIfDue(at("07:00:00"))).toMatchObject({ stage: 1 });
  });

  it("sends only the last call when the reminder hour is the last-call hour", async () => {
    await setSettings({ reminderHour: 22 });
    expect(await sendStreakRemindersIfDue(at("21:59:00"))).toBeNull();
    expect(await sendStreakRemindersIfDue(at("22:00:00"))).toMatchObject({ stage: 2 });
    expect(webpush.sendNotification).toHaveBeenCalledTimes(1);
  });

  it("runs on the user's clock, not the server's", async () => {
    // Tokyo is UTC+9. 11:00 UTC on the 10th is 20:00 on the 10th in Tokyo.
    await setSettings({ timeZone: "Asia/Tokyo" });
    expect(await sendStreakRemindersIfDue(at("10:59:00"))).toBeNull();
    expect(await sendStreakRemindersIfDue(at("11:00:00"))).toMatchObject({ stage: 1 });
    expect((await prisma.appSettings.findUnique({ where: { id: 1 } }))!.lastReminderDay).toBe("2024-05-10");
  });

  it("counts a stage from a previous day as not sent", async () => {
    await setSettings({ lastReminderDay: "2024-05-09", lastReminderStage: 2 });
    expect(await sendStreakRemindersIfDue(at("20:00:00"))).toMatchObject({ stage: 1 });
  });

  it("sends each stage once even when two checks run at the same moment", async () => {
    const results = await Promise.all([
      sendStreakRemindersIfDue(at("20:00:00")),
      sendStreakRemindersIfDue(at("20:00:00")),
      sendStreakRemindersIfDue(at("20:00:00")),
    ]);
    expect(results.filter(Boolean)).toHaveLength(1);
    expect(webpush.sendNotification).toHaveBeenCalledTimes(1);
  });

  it("reports failed deliveries", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    webpush.sendNotification.mockRejectedValue(Object.assign(new Error("down"), { statusCode: 500 }));
    expect(await sendStreakRemindersIfDue(at("20:00:00"))).toEqual({ stage: 1, sent: 0, failed: 1 });
  });

  describe("message text", () => {
    it.each([0, 0.2, 0.4, 0.6, 0.99])("every evening nudge names the streak (variant %f)", async (r) => {
      vi.spyOn(Math, "random").mockReturnValue(r);
      await sendStreakRemindersIfDue(at("20:00:00"));
      const [p] = sentPayloads();
      expect(p.title.length).toBeGreaterThan(0);
      expect(p.body.length).toBeGreaterThan(0);
      expect(`${p.title} ${p.body}`).toMatch(/\b3\b|Day 4/);
    });

    it.each([0, 0.4, 0.99])("every last call names the streak (variant %f)", async (r) => {
      vi.spyOn(Math, "random").mockReturnValue(r);
      await sendStreakRemindersIfDue(at("22:00:00"));
      expect(JSON.stringify(sentPayloads()[0])).toMatch(/\b3\b/);
    });

    it("says how many hours are left at 22:00", async () => {
      vi.spyOn(Math, "random").mockReturnValue(0.4); // "Only N left" variant
      await sendStreakRemindersIfDue(at("22:15:00"));
      expect(sentPayloads()[0].body).toBe("Only 2 hours left to save your 3-day streak.");
    });

    it("says less than an hour in the final hour", async () => {
      vi.spyOn(Math, "random").mockReturnValue(0.4);
      await sendStreakRemindersIfDue(at("23:30:00"));
      expect(sentPayloads()[0].body).toBe("Only less than an hour left to save your 3-day streak.");
    });
  });
});
