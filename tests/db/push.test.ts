import { beforeEach, describe, expect, it, vi } from "vitest";

const webpush = vi.hoisted(() => ({
  generateVAPIDKeys: vi.fn(),
  sendNotification: vi.fn(),
}));
vi.mock("web-push", () => ({ default: webpush }));

import { prisma } from "@/lib/db";
import { getVapidKeys, sendPushToAll } from "@/lib/push";
import { setSettings } from "../helpers/db";

let generated = 0;
beforeEach(() => {
  generated = 0;
  webpush.generateVAPIDKeys.mockReset().mockImplementation(() => {
    generated++;
    return { publicKey: `pub-${generated}`, privateKey: `priv-${generated}` };
  });
  webpush.sendNotification.mockReset().mockResolvedValue({ statusCode: 201 });
  vi.stubEnv("VAPID_PUBLIC_KEY", "");
  vi.stubEnv("VAPID_PRIVATE_KEY", "");
  vi.stubEnv("VAPID_SUBJECT", "");
});

async function subscribe(n: number) {
  const subs = [];
  for (let i = 0; i < n; i++) {
    subs.push(
      await prisma.pushSubscription.create({
        data: { endpoint: `https://push.example/${i}`, p256dh: `key-${i}`, auth: `auth-${i}` },
      }),
    );
  }
  return subs;
}

describe("getVapidKeys", () => {
  it("prefers keys from the environment and never touches the database for them", async () => {
    vi.stubEnv("VAPID_PUBLIC_KEY", "env-pub");
    vi.stubEnv("VAPID_PRIVATE_KEY", "env-priv");
    expect(await getVapidKeys()).toEqual({ publicKey: "env-pub", privateKey: "env-priv" });
    expect(webpush.generateVAPIDKeys).not.toHaveBeenCalled();
    expect(await prisma.appSettings.count()).toBe(0);
  });

  it("ignores a half-configured environment (one key without the other)", async () => {
    vi.stubEnv("VAPID_PUBLIC_KEY", "env-pub");
    expect(await getVapidKeys()).toEqual({ publicKey: "pub-1", privateKey: "priv-1" });
  });

  it("generates keys once and persists them", async () => {
    const first = await getVapidKeys();
    const second = await getVapidKeys();
    expect(first).toEqual({ publicKey: "pub-1", privateKey: "priv-1" });
    expect(second).toEqual(first);
    expect(webpush.generateVAPIDKeys).toHaveBeenCalledTimes(1);
    expect(await prisma.appSettings.findUnique({ where: { id: 1 } })).toMatchObject({
      vapidPublicKey: "pub-1",
      vapidPrivateKey: "priv-1",
    });
  });

  it("reuses keys already stored in the database", async () => {
    await setSettings({ vapidPublicKey: "db-pub", vapidPrivateKey: "db-priv" });
    expect(await getVapidKeys()).toEqual({ publicKey: "db-pub", privateKey: "db-priv" });
    expect(webpush.generateVAPIDKeys).not.toHaveBeenCalled();
  });

  it("settles on a single key pair when called concurrently (changing keys would orphan subscriptions)", async () => {
    const results = await Promise.all(Array.from({ length: 8 }, () => getVapidKeys()));
    const unique = new Set(results.map((r) => `${r.publicKey}/${r.privateKey}`));
    expect(unique.size).toBe(1);
    const stored = await prisma.appSettings.findUnique({ where: { id: 1 } });
    expect(results[0]).toEqual({ publicKey: stored!.vapidPublicKey, privateKey: stored!.vapidPrivateKey });
  });

  it("does not overwrite settings like the time zone when storing keys", async () => {
    await setSettings({ timeZone: "Asia/Tokyo", reminderHour: 8 });
    await getVapidKeys();
    expect(await prisma.appSettings.findUnique({ where: { id: 1 } })).toMatchObject({ timeZone: "Asia/Tokyo", reminderHour: 8 });
  });
});

describe("sendPushToAll", () => {
  const payload = { title: "T", body: "B", url: "/", tag: "streak-reminder" };

  it("returns zeros and skips key generation when nobody is subscribed", async () => {
    expect(await sendPushToAll(payload)).toEqual({ sent: 0, failed: 0 });
    expect(webpush.sendNotification).not.toHaveBeenCalled();
    expect(webpush.generateVAPIDKeys).not.toHaveBeenCalled();
  });

  it("sends the JSON payload to every device with VAPID details", async () => {
    await subscribe(3);
    expect(await sendPushToAll(payload)).toEqual({ sent: 3, failed: 0 });
    expect(webpush.sendNotification).toHaveBeenCalledTimes(3);
    const [sub, body, options] = webpush.sendNotification.mock.calls[0];
    expect(sub).toEqual({ endpoint: expect.stringMatching(/^https:\/\/push\.example\/\d$/), keys: expect.any(Object) });
    expect(JSON.parse(body)).toEqual(payload);
    expect(options).toEqual({
      TTL: 3600,
      urgency: "high",
      vapidDetails: { subject: "mailto:leetlearn@example.com", publicKey: "pub-1", privateKey: "priv-1" },
    });
  });

  it("pairs each endpoint with its own keys", async () => {
    await subscribe(2);
    await sendPushToAll(payload);
    const sent = webpush.sendNotification.mock.calls.map(([s]) => s).sort((a, b) => a.endpoint.localeCompare(b.endpoint));
    expect(sent).toEqual([
      { endpoint: "https://push.example/0", keys: { p256dh: "key-0", auth: "auth-0" } },
      { endpoint: "https://push.example/1", keys: { p256dh: "key-1", auth: "auth-1" } },
    ]);
  });

  it("uses VAPID_SUBJECT from the environment when set", async () => {
    vi.stubEnv("VAPID_SUBJECT", "mailto:me@example.org");
    await subscribe(1);
    await sendPushToAll(payload);
    expect(webpush.sendNotification.mock.calls[0][2].vapidDetails.subject).toBe("mailto:me@example.org");
  });

  it.each([404, 410])("prunes subscriptions the push service reports as gone (%i)", async (statusCode) => {
    const [dead, alive] = await subscribe(2);
    webpush.sendNotification.mockImplementation(async (s: { endpoint: string }) => {
      if (s.endpoint === dead.endpoint) throw Object.assign(new Error("gone"), { statusCode });
      return { statusCode: 201 };
    });
    expect(await sendPushToAll(payload)).toEqual({ sent: 1, failed: 1 });
    expect((await prisma.pushSubscription.findMany()).map((s) => s.endpoint)).toEqual([alive.endpoint]);
  });

  it.each([400, 413, 429, 500, undefined])("keeps subscriptions on transient or unknown errors (%s)", async (statusCode) => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    await subscribe(2);
    webpush.sendNotification.mockRejectedValue(Object.assign(new Error("nope"), { statusCode }));
    expect(await sendPushToAll(payload)).toEqual({ sent: 0, failed: 2 });
    expect(await prisma.pushSubscription.count()).toBe(2);
    expect(console.error).toHaveBeenCalledTimes(2);
  });

  it("does not fail when a gone subscription was already deleted by someone else", async () => {
    const [sub] = await subscribe(1);
    webpush.sendNotification.mockImplementation(async () => {
      await prisma.pushSubscription.delete({ where: { id: sub.id } });
      throw Object.assign(new Error("gone"), { statusCode: 410 });
    });
    await expect(sendPushToAll(payload)).resolves.toEqual({ sent: 0, failed: 1 });
  });

  it("sends to every device in parallel, so one slow device doesn't delay the rest", async () => {
    await subscribe(3);
    let inFlight = 0;
    let peak = 0;
    webpush.sendNotification.mockImplementation(async () => {
      inFlight++;
      peak = Math.max(peak, inFlight);
      await new Promise((r) => setTimeout(r, 20));
      inFlight--;
    });
    await sendPushToAll(payload);
    expect(peak).toBe(3);
  });
});
