import { prisma } from "./db";
import { sendPushToAll, type PushPayload } from "./push";
import { dayKey, getSettings, getStreak, localHour } from "./streak";
import { LAST_CALL_HOUR } from "./streak-config";

const pick = <T>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)];

function eveningNudge(n: number): PushPayload {
  return pick([
    { title: `🔥 Your ${n}-day streak is waiting`, body: "One problem keeps it alive. Just one. You've got this." },
    { title: "Psst… your streak misses you", body: `${n} days in a row. Don't let today be the day it ends.` },
    { title: "These reminders don't seem to be working 😢", body: `Your ${n}-day streak needs one solve today. Prove us wrong.` },
    { title: "Two Pointers called. It wants you back.", body: `Keep your ${n}-day streak going with a quick problem.` },
    { title: `Day ${n + 1} is right there 👀`, body: "A single solve today and the flame keeps burning." },
  ]);
}

function lastCall(n: number, hoursLeft: number): PushPayload {
  const left = hoursLeft <= 1 ? "less than an hour" : `${hoursLeft} hours`;
  return pick([
    { title: "🚨 Streak emergency!", body: `Your ${n}-day streak ends at midnight. One quick problem saves it.` },
    { title: "Last call 🔥", body: `Only ${left} left to save your ${n}-day streak.` },
    { title: `${n} days… gone at midnight? 😱`, body: "Not on our watch. Solve one Easy and you're safe." },
  ]);
}

/**
 * Duolingo-style escalation for a streak that will break tonight:
 *  stage 1 at the user's reminder hour, stage 2 at LAST_CALL_HOUR.
 * Safe to call as often as you like; each stage fires at most once a day.
 */
export async function sendStreakRemindersIfDue(now: Date = new Date()) {
  const settings = await getSettings();
  const streak = await getStreak(now);
  if (!streak.atRisk) return null;

  const today = dayKey(now, settings.timeZone);
  const hour = localHour(now, settings.timeZone);
  const sentStage = settings.lastReminderDay === today ? settings.lastReminderStage : 0;

  let stage = 0;
  if (hour >= LAST_CALL_HOUR && sentStage < 2) stage = 2;
  else if (hour >= settings.reminderHour && sentStage < 1) stage = 1;
  if (stage === 0) return null;

  if ((await prisma.pushSubscription.count()) === 0) return null;

  // Claim the stage before sending so overlapping runs can't double-notify
  const { count } = await prisma.appSettings.updateMany({
    where: {
      id: 1,
      OR: [{ lastReminderDay: { not: today } }, { lastReminderDay: null }, { lastReminderStage: { lt: stage } }],
    },
    data: { lastReminderDay: today, lastReminderStage: stage },
  });
  if (count === 0) return null;

  const payload =
    stage === 2 ? lastCall(streak.current, 24 - hour) : eveningNudge(streak.current);
  const result = await sendPushToAll({ ...payload, url: "/", tag: "streak-reminder" });
  return { stage, ...result };
}
