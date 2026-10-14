"use client";

import { useState } from "react";
import { Bell, BellOff, BellRing, LoaderCircle, Share, SquarePlus } from "lucide-react";
import { LAST_CALL_HOUR } from "@/lib/streak-config";
import type { ReminderPrefs } from "@/lib/types";
import { usePushNotifications } from "@/lib/use-push-notifications";

const HOURS = Array.from({ length: LAST_CALL_HOUR - 5 }, (_, i) => i + 6); // 6:00 … last call

function hourLabel(h: number) {
  return new Date(2000, 0, 1, h).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

function Hint({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-zinc-500">{children}</p>;
}

export default function ReminderSettings({ prefs }: { prefs: ReminderPrefs }) {
  const push = usePushNotifications(prefs.vapidPublicKey);
  const [hour, setHour] = useState(prefs.reminderHour);
  const [testState, setTestState] = useState<"idle" | "sending" | "sent" | string>("idle");

  async function changeHour(h: number) {
    const previous = hour;
    setHour(h);
    const res = await fetch("/api/streak/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reminderHour: h }),
    }).catch(() => null);
    if (!res?.ok) setHour(previous);
  }

  async function sendTest() {
    setTestState("sending");
    const res = await fetch("/api/push/test", { method: "POST" }).catch(() => null);
    if (res?.ok) setTestState("sent");
    else setTestState((await res?.json().catch(() => null))?.error ?? "Couldn't send a test");
  }

  return (
    <section aria-labelledby="reminders-heading" className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <BellRing className="size-5 text-orange-500" strokeWidth={2.5} />
        <h3 id="reminders-heading" className="font-extrabold">
          Streak reminders
        </h3>
      </div>

      {push.status === "loading" && <LoaderCircle className="size-5 animate-spin text-zinc-400" />}

      {push.status === "install" && (
        <Hint>
          On iPhone and iPad, reminders work once LeetLearn is on your Home Screen: tap{" "}
          <Share className="inline size-4 align-text-bottom" /> <strong>Share</strong>, then{" "}
          <SquarePlus className="inline size-4 align-text-bottom" />{" "}
          <strong>Add to Home Screen</strong>, and open it from there.
        </Hint>
      )}
      {push.status === "unsupported" && <Hint>This browser doesn&apos;t support push notifications.</Hint>}
      {push.status === "unavailable" && (
        <Hint>
          Notifications need the production app served over HTTPS (or localhost). They&apos;re
          off in <code className="font-mono">npm run dev</code>.
        </Hint>
      )}
      {push.status === "denied" && (
        <Hint>
          Notifications are blocked. Allow them for LeetLearn in your browser or iOS Settings →
          Notifications, then reload.
        </Hint>
      )}

      {push.status === "off" && (
        <>
          <Hint>Get a nudge before your streak is about to break.</Hint>
          <button
            type="button"
            disabled={push.busy}
            onClick={push.enable}
            className="btn-3d flex items-center justify-center gap-2 rounded-2xl border-orange-600 bg-orange-500 py-2.5 font-extrabold uppercase tracking-wide text-white hover:bg-orange-400 disabled:opacity-60"
          >
            {push.busy ? <LoaderCircle className="size-5 animate-spin" /> : <Bell className="size-5" />}
            Turn on reminders
          </button>
        </>
      )}

      {push.status === "on" && (
        <>
          <label className="flex items-center justify-between gap-3 text-sm font-bold">
            Remind me at
            <select
              value={hour}
              onChange={(e) => changeHour(Number(e.target.value))}
              className="rounded-xl border-2 border-zinc-200 bg-transparent px-2 py-1 font-bold dark:border-zinc-700"
            >
              {HOURS.map((h) => (
                <option key={h} value={h}>
                  {hourLabel(h)}
                </option>
              ))}
            </select>
          </label>
          <Hint>
            If you haven&apos;t solved anything by then, you&apos;ll get a nudge, plus a last call
            at {hourLabel(LAST_CALL_HOUR)}.
          </Hint>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={testState === "sending"}
              onClick={sendTest}
              className="btn-3d rounded-2xl border-2 border-zinc-300 py-2 text-sm font-extrabold uppercase tracking-wide text-zinc-600 hover:bg-zinc-50 disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              {testState === "sent" ? "Sent!" : "Send test"}
            </button>
            <button
              type="button"
              disabled={push.busy}
              onClick={push.disable}
              className="btn-3d flex items-center justify-center gap-1.5 rounded-2xl border-2 border-zinc-300 py-2 text-sm font-extrabold uppercase tracking-wide text-zinc-600 hover:bg-zinc-50 disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <BellOff className="size-4" /> Turn off
            </button>
          </div>
          {!["idle", "sending", "sent"].includes(testState) && (
            <p className="text-sm font-semibold text-red-500">{testState}</p>
          )}
        </>
      )}

      {push.error && <p className="text-sm font-semibold text-red-500">{push.error}</p>}
    </section>
  );
}
