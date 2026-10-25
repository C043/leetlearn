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
      streak,
      prefs: { reminderHour: settings.reminderHour, vapidPublicKey: vapid.publicKey },
    },
  };
}
