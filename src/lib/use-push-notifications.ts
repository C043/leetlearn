"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * - install:     iOS Safari tab; Web Push only works once added to the Home Screen
 * - unsupported: browser has no Push API
 * - unavailable: no service worker (dev server, or not served over HTTPS)
 */
export type PushStatus =
  | "loading"
  | "install"
  | "unsupported"
  | "unavailable"
  | "denied"
  | "off"
  | "on";

const timeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

function urlBase64ToUint8Array(base64: string) {
  const padded = (base64 + "=".repeat((4 - (base64.length % 4)) % 4))
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
}

function isIOS() {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

async function saveSubscription(sub: PushSubscription) {
  const res = await fetch("/api/push/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subscription: sub.toJSON(), timeZone: timeZone() }),
  });
  if (!res.ok) throw new Error("Couldn't save the subscription");
}

let synced = false;

async function detect(): Promise<PushStatus> {
  if (isIOS() && !isStandalone()) return "install";
  if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
    return "unsupported";
  }
  if (Notification.permission === "denied") return "denied";
  const reg = await navigator.serviceWorker.getRegistration();
  if (!reg) return "unavailable";
  const sub = await reg.pushManager.getSubscription();
  if (!sub || Notification.permission !== "granted") return "off";
  // Re-send once per load so the server recovers from a DB reset and learns the current time zone
  if (!synced) {
    synced = true;
    saveSubscription(sub).catch(() => {});
  }
  return "on";
}

export function usePushNotifications(vapidPublicKey: string) {
  const [status, setStatus] = useState<PushStatus>("loading");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    detect()
      .then((s) => alive && setStatus(s))
      .catch(() => alive && setStatus("unsupported"));
    return () => {
      alive = false;
    };
  }, []);

  /** Must run straight from a tap: iOS only shows the permission prompt for user gestures. */
  const enable = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus(permission === "denied" ? "denied" : "off");
        return;
      }
      const reg = await navigator.serviceWorker.getRegistration();
      if (!reg) {
        setStatus("unavailable");
        return;
      }
      await navigator.serviceWorker.ready;
      const sub =
        (await reg.pushManager.getSubscription()) ??
        (await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
        }));
      await saveSubscription(sub);
      setStatus("on");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't turn on notifications");
    } finally {
      setBusy(false);
    }
  }, [vapidPublicKey]);

  const disable = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      const sub = await reg?.pushManager.getSubscription();
      if (sub) {
        await fetch("/api/push/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
      setStatus("off");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't turn off notifications");
    } finally {
      setBusy(false);
    }
  }, []);

  return { status, busy, error, enable, disable };
}
