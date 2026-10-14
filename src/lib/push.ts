import webpush from "web-push";
import { prisma } from "./db";
import { getSettings } from "./streak";

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
  tag?: string;
}

/**
 * VAPID keys from the environment, or generated once and kept in the database
 * so a plain `docker compose up` works without extra setup. Changing keys
 * invalidates existing subscriptions, which is why they're persisted.
 */
export async function getVapidKeys() {
  const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY } = process.env;
  if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
    return { publicKey: VAPID_PUBLIC_KEY, privateKey: VAPID_PRIVATE_KEY };
  }
  const settings = await getSettings();
  if (settings.vapidPublicKey && settings.vapidPrivateKey) {
    return { publicKey: settings.vapidPublicKey, privateKey: settings.vapidPrivateKey };
  }
  const keys = webpush.generateVAPIDKeys();
  // Only fill the keys if nobody else did in the meantime
  await prisma.appSettings.updateMany({
    where: { id: 1, vapidPublicKey: null },
    data: { vapidPublicKey: keys.publicKey, vapidPrivateKey: keys.privateKey },
  });
  const stored = await getSettings();
  return { publicKey: stored.vapidPublicKey!, privateKey: stored.vapidPrivateKey! };
}

/** Send to every subscribed device, pruning the ones the push service says are gone. */
export async function sendPushToAll(payload: PushPayload) {
  const subs = await prisma.pushSubscription.findMany();
  if (subs.length === 0) return { sent: 0, failed: 0 };

  const { publicKey, privateKey } = await getVapidKeys();
  // Apple rejects VAPID subjects that aren't a real mailto:/https: URL (e.g. localhost)
  const subject = process.env.VAPID_SUBJECT || "mailto:leetlearn@example.com";
  const body = JSON.stringify(payload);

  let sent = 0;
  let failed = 0;
  await Promise.all(
    subs.map(async (s) => {
      try {
        await webpush.sendNotification(
          { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
          body,
          { TTL: 60 * 60, urgency: "high", vapidDetails: { subject, publicKey, privateKey } },
        );
        sent++;
      } catch (err) {
        failed++;
        const status = (err as { statusCode?: number }).statusCode;
        if (status === 404 || status === 410) {
          await prisma.pushSubscription.delete({ where: { id: s.id } }).catch(() => {});
        } else {
          console.error(`[push] send failed (${status ?? "?"}):`, err);
        }
      }
    }),
  );
  return { sent, failed };
}
