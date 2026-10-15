import { beforeEach, describe, expect, it, vi } from "vitest";

const webpush = vi.hoisted(() => ({
  generateVAPIDKeys: vi.fn(() => ({ publicKey: "pub", privateKey: "priv" })),
  sendNotification: vi.fn(),
}));
vi.mock("web-push", () => ({ default: webpush }));

import { DELETE, POST as SUBSCRIBE } from "@/app/api/push/subscribe/route";
import { POST as TEST_PUSH } from "@/app/api/push/test/route";
import { PATCH } from "@/app/api/streak/settings/route";
import { prisma } from "@/lib/db";
import { setActivityDays, setSettings } from "../helpers/db";
import { jsonRequest } from "../helpers/http";

const validSub = {
  endpoint: "https://fcm.googleapis.com/fcm/send/abc123",
  keys: { p256dh: "BNcRdreALRFXTkOOUHK1EtK2wtaz5Ry4YfYCA_0QTpQtUbVlUls0VJXg7A8u-Ts1XbjhazAkj7I99e8QcYP7DkM", auth: "tBHItJI5svbpez7KI4CCXg" },
};

beforeEach(() => {
  webpush.sendNotification.mockReset().mockResolvedValue({ statusCode: 201 });
});

describe("POST /api/push/subscribe", () => {
  const subscribe = (body: unknown) => SUBSCRIBE(jsonRequest("/api/push/subscribe", "POST", body));

  it("stores a new subscription", async () => {
    const res = await subscribe({ subscription: validSub });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(await prisma.pushSubscription.findMany()).toMatchObject([
      { endpoint: validSub.endpoint, p256dh: validSub.keys.p256dh, auth: validSub.keys.auth },
    ]);
  });

  it("is idempotent and refreshes rotated keys for the same endpoint", async () => {
    await subscribe({ subscription: validSub });
    await subscribe({ subscription: validSub });
    await subscribe({ subscription: { ...validSub, keys: { p256dh: "new-key", auth: "new-auth" } } });
    const rows = await prisma.pushSubscription.findMany();
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ p256dh: "new-key", auth: "new-auth" });
  });

  it("keeps one row per device", async () => {
    await subscribe({ subscription: validSub });
    await subscribe({ subscription: { ...validSub, endpoint: "https://web.push.apple.com/xyz" } });
    expect(await prisma.pushSubscription.count()).toBe(2);
  });

  it("survives the same device subscribing twice at once", async () => {
    const results = await Promise.all([subscribe({ subscription: validSub }), subscribe({ subscription: validSub })]);
    expect(results.some((r) => r.status === 200)).toBe(true);
    expect(await prisma.pushSubscription.count()).toBe(1);
  });

  it("remembers the device's time zone", async () => {
    await subscribe({ subscription: validSub, timeZone: "America/Sao_Paulo" });
    expect((await prisma.appSettings.findUnique({ where: { id: 1 } }))!.timeZone).toBe("America/Sao_Paulo");
  });

  it("still subscribes when the time zone is bogus", async () => {
    const res = await subscribe({ subscription: validSub, timeZone: "Bogus/Zone" });
    expect(res.status).toBe(200);
    expect(await prisma.pushSubscription.count()).toBe(1);
  });

  it.each<[string, unknown]>([
    ["no body", undefined],
    ["malformed JSON", "{"],
    ["a bare subscription (not wrapped)", validSub],
    ["a non-URL endpoint", { subscription: { ...validSub, endpoint: "not a url" } }],
    ["an empty endpoint", { subscription: { ...validSub, endpoint: "" } }],
    ["missing keys", { subscription: { endpoint: validSub.endpoint } }],
    ["an empty p256dh", { subscription: { ...validSub, keys: { ...validSub.keys, p256dh: "" } } }],
    ["an empty auth", { subscription: { ...validSub, keys: { ...validSub.keys, auth: "" } } }],
    ["numeric keys", { subscription: { ...validSub, keys: { p256dh: 1, auth: 2 } } }],
    ["a non-string time zone", { subscription: validSub, timeZone: 3 }],
  ])("rejects %s with 400", async (_, body) => {
    const res = await subscribe(body);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Invalid push subscription" });
    expect(await prisma.pushSubscription.count()).toBe(0);
  });
});

describe("DELETE /api/push/subscribe", () => {
  const unsubscribe = (body: unknown) => DELETE(jsonRequest("/api/push/subscribe", "DELETE", body));

  it("removes only the given device", async () => {
    await prisma.pushSubscription.createMany({
      data: [
        { endpoint: "https://push.example/a", p256dh: "k", auth: "a" },
        { endpoint: "https://push.example/b", p256dh: "k", auth: "a" },
      ],
    });
    const res = await unsubscribe({ endpoint: "https://push.example/a" });
    expect(res.status).toBe(200);
    expect((await prisma.pushSubscription.findMany()).map((s) => s.endpoint)).toEqual(["https://push.example/b"]);
  });

  it("succeeds for an endpoint that isn't subscribed (already pruned)", async () => {
    const res = await unsubscribe({ endpoint: "https://push.example/missing" });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it.each<[string, unknown]>([
    ["no body", undefined],
    ["malformed JSON", "nope"],
    ["a missing endpoint", {}],
    ["a numeric endpoint", { endpoint: 1 }],
  ])("rejects %s with 400", async (_, body) => {
    const res = await unsubscribe(body);
    expect(res.status).toBe(400);
  });
});

describe("POST /api/push/test", () => {
  it("returns 502 with advice when no device is subscribed", async () => {
    const res = await TEST_PUSH();
    expect(res.status).toBe(502);
    expect((await res.json()).error).toMatch(/No device received it/);
  });

  it("returns 502 when every device failed", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    await prisma.pushSubscription.create({ data: { endpoint: "https://push.example/a", p256dh: "k", auth: "a" } });
    webpush.sendNotification.mockRejectedValue(Object.assign(new Error("x"), { statusCode: 500 }));
    expect((await TEST_PUSH()).status).toBe(502);
  });

  it("succeeds when at least one device received it", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    await prisma.pushSubscription.createMany({
      data: [
        { endpoint: "https://push.example/a", p256dh: "k", auth: "a" },
        { endpoint: "https://push.example/b", p256dh: "k", auth: "a" },
      ],
    });
    webpush.sendNotification.mockImplementationOnce(async () => {
      throw Object.assign(new Error("x"), { statusCode: 500 });
    });
    const res = await TEST_PUSH();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ sent: 1, failed: 1 });
  });

  it("mentions the current streak when there is one", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2024-05-10T12:00:00Z"));
    await setActivityDays(["2024-05-08", "2024-05-09", "2024-05-10"]);
    await prisma.pushSubscription.create({ data: { endpoint: "https://push.example/a", p256dh: "k", auth: "a" } });
    await TEST_PUSH();
    const payload = JSON.parse(webpush.sendNotification.mock.calls[0][1]);
    expect(payload).toMatchObject({ tag: "streak-test", url: "/" });
    expect(payload.body).toContain("3-day streak");
  });

  it("uses generic wording without a streak", async () => {
    await prisma.pushSubscription.create({ data: { endpoint: "https://push.example/a", p256dh: "k", auth: "a" } });
    await TEST_PUSH();
    const payload = JSON.parse(webpush.sendNotification.mock.calls[0][1]);
    expect(payload.body).toBe("We'll nudge you before your streak is in danger.");
  });
});

describe("PATCH /api/streak/settings", () => {
  const patch = (body: unknown) => PATCH(jsonRequest("/api/streak/settings", "PATCH", body));

  it.each([0, 6, 20, 22])("accepts reminderHour %i", async (reminderHour) => {
    const res = await patch({ reminderHour });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ reminderHour });
    expect((await prisma.appSettings.findUnique({ where: { id: 1 } }))!.reminderHour).toBe(reminderHour);
  });

  it.each<[string, unknown]>([
    ["an hour after the last call", { reminderHour: 23 }],
    ["24", { reminderHour: 24 }],
    ["a negative hour", { reminderHour: -1 }],
    ["a fractional hour", { reminderHour: 20.5 }],
    ["a numeric string", { reminderHour: "20" }],
    ["null", { reminderHour: null }],
    ["NaN (serialized as null)", { reminderHour: NaN }],
    ["an empty object", {}],
    ["malformed JSON", "{"],
    ["no body", undefined],
  ])("rejects %s with 400", async (_, body) => {
    await setSettings({ reminderHour: 19 });
    const res = await patch(body);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Body must be { reminderHour: 0-22 }" });
    expect((await prisma.appSettings.findUnique({ where: { id: 1 } }))!.reminderHour).toBe(19);
  });

  it("creates the settings row if needed", async () => {
    await patch({ reminderHour: 8 });
    expect(await prisma.appSettings.findUnique({ where: { id: 1 } })).toMatchObject({ reminderHour: 8, timeZone: "UTC" });
  });

  it("does not reset other settings or today's reminder progress", async () => {
    await setSettings({ timeZone: "Asia/Tokyo", lastReminderDay: "2024-05-10", lastReminderStage: 1, vapidPublicKey: "p", vapidPrivateKey: "q" });
    await patch({ reminderHour: 21 });
    expect(await prisma.appSettings.findUnique({ where: { id: 1 } })).toMatchObject({
      reminderHour: 21,
      timeZone: "Asia/Tokyo",
      lastReminderDay: "2024-05-10",
      lastReminderStage: 1,
      vapidPublicKey: "p",
      vapidPrivateKey: "q",
    });
  });
});
