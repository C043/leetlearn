import { playChime } from "./chime";

/**
 * Per-problem 15-minute practice timers. Purely a utility: finishing a timer
 * only plays a chime, it never records anything about the solve.
 *
 * Start times live in localStorage and the chime is scheduled at module level,
 * so a timer keeps running (and rings) after the modal closes or the page
 * reloads.
 */

export const TIMER_MS = 15 * 60 * 1000;
const STORAGE_KEY = "leetlearn:problem-timers";
/** Finished timers older than this are dropped on load instead of showing "time's up". */
const STALE_MS = 60 * 60 * 1000;

type Timers = Readonly<Record<string, number>>; // problemId -> startedAt (epoch ms)

const EMPTY: Timers = {};
let timers: Timers = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();
const rings = new Map<string, ReturnType<typeof setTimeout>>();

function scheduleRing(id: string, startedAt: number) {
  clearTimeout(rings.get(id));
  rings.delete(id);
  const remaining = startedAt + TIMER_MS - Date.now();
  if (remaining <= 0) return;
  rings.set(
    id,
    setTimeout(() => {
      rings.delete(id);
      playChime();
    }, remaining),
  );
}

function ensureLoaded() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const parsed: Record<string, number> = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
    const now = Date.now();
    timers = Object.fromEntries(
      Object.entries(parsed).filter(
        ([, startedAt]) => typeof startedAt === "number" && now - startedAt < TIMER_MS + STALE_MS,
      ),
    );
  } catch {
    timers = EMPTY;
  }
  for (const [id, startedAt] of Object.entries(timers)) scheduleRing(id, startedAt);
}

function commit(next: Timers) {
  timers = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage unavailable (private mode etc.): timers still work for this tab.
  }
  listeners.forEach((l) => l());
}

export function subscribeTimers(listener: () => void) {
  ensureLoaded();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getTimersSnapshot(): Timers {
  ensureLoaded();
  return timers;
}

export function getTimersServerSnapshot(): Timers {
  return EMPTY;
}

export function startTimer(id: string) {
  const startedAt = Date.now();
  commit({ ...timers, [id]: startedAt });
  scheduleRing(id, startedAt);
}

export function resetTimer(id: string) {
  clearTimeout(rings.get(id));
  rings.delete(id);
  const next = { ...timers };
  delete next[id];
  commit(next);
}
