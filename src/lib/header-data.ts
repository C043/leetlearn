import { getPatternSummaries } from "./queries";
import { getVapidKeys } from "./push";
import { getSettings, getStreak } from "./streak";

/** Everything the app header needs, plus the path summaries it is derived from. */
export async function getHeaderData() {
  const [summaries, streak, settings, vapid] = await Promise.all([
    getPatternSummaries(),
    getStreak(),
    getSettings(),
    getVapidKeys(),
  ]);
  return {
    summaries,
    header: {
      solved: summaries.reduce((n, p) => n + p.solved, 0),
      total: summaries.reduce((n, p) => n + p.total, 0),
      streak,
      prefs: { reminderHour: settings.reminderHour, vapidPublicKey: vapid.publicKey },
    },
  };
}
