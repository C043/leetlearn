import Link from "next/link";
import type { ReactNode } from "react";
import { CalendarDays, CircleCheck, Crown, Flame, Sparkles, Timer, Trophy, Zap } from "lucide-react";
import { getStats } from "@/lib/queries";
import { getHeaderData } from "@/lib/header-data";
import { pathColor } from "@/lib/path-tiles";
import { dayKey } from "@/lib/streak";
import type { Difficulty } from "@/lib/types";
import AppHeader from "@/components/duolingo/AppHeader";
import BackToPaths from "@/components/duolingo/BackToPaths";
import DifficultyBadge from "@/components/duolingo/DifficultyBadge";
import ActivityGraph from "@/components/stats/ActivityGraph";

export const dynamic = "force-dynamic";

const percent = (n: number, total: number) => (total === 0 ? 0 : Math.round((n / total) * 100));

const formatDay = (day: string, withYear = true) =>
  new Date(`${day}T00:00:00Z`).toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    ...(withYear ? { year: "numeric" } : {}),
  });

const DIFFICULTY_LABEL: Record<Difficulty, string> = { EASY: "Easy", MEDIUM: "Medium", HARD: "Hard" };
const DIFFICULTY_BAR: Record<Difficulty, string> = {
  EASY: "bg-emerald-500",
  MEDIUM: "bg-amber-500",
  HARD: "bg-rose-500",
};
const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-6 rounded-3xl border-2 border-zinc-200 p-5 dark:border-zinc-800">
      <h2 className="mb-4 text-xs font-extrabold uppercase tracking-wider text-zinc-400">{title}</h2>
      {children}
    </section>
  );
}

function Tile({ icon, label, value, sub, color }: { icon: ReactNode; label: string; value: ReactNode; sub?: string; color: string }) {
  return (
    <div className="rounded-2xl border-2 border-zinc-200 p-3 dark:border-zinc-800">
      <p className={`flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide ${color}`}>
        {icon}
        {label}
      </p>
      <p className="mt-1 text-2xl font-black">{value}</p>
      {sub && <p className="text-xs font-bold text-zinc-400">{sub}</p>}
    </div>
  );
}

function Bar({ value, color }: { value: number; color: string }) {
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      className="h-3 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800"
    >
      <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
    </div>
  );
}

export default async function StatsPage() {
  const [{ header }, stats] = await Promise.all([getHeaderData(), getStats()]);
  const { totals, activity, streak } = stats;
  const busiestWeekday = Math.max(0, ...activity.weekdays);

  return (
    <>
      <AppHeader {...header} onStats />
      <main className="mx-auto max-w-2xl px-4 pb-12 pt-6">
        <BackToPaths />

        <section className="mt-5 rounded-3xl border-b-4 border-violet-700 bg-gradient-to-r from-violet-500 to-fuchsia-500 p-5 text-white">
          <p className="text-xs font-extrabold uppercase tracking-wider text-violet-100">
            {activity.firstDay ? `Practicing since ${formatDay(activity.firstDay)}` : "No solves yet"}
          </p>
          <h1 className="mt-1 text-2xl font-black">Your stats</h1>
          <p className="mt-1 text-sm text-violet-50">
            {totals.solved}/{totals.total} problems solved · {percent(totals.solved, totals.total)}% of every path
          </p>
        </section>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Tile
            icon={<CircleCheck className="size-4" strokeWidth={3} />}
            label="Solved"
            value={`${totals.solved}/${totals.total}`}
            sub={`${percent(totals.under15, totals.solved)}% under 15 min`}
            color="text-green-500"
          />
          <Tile
            icon={<Flame className="size-4" strokeWidth={3} />}
            label="Streak"
            value={streak.current}
            sub={`Longest ${streak.longest} ${streak.longest === 1 ? "day" : "days"}`}
            color="text-orange-500"
          />
          <Tile
            icon={<CalendarDays className="size-4" strokeWidth={3} />}
            label="Active days"
            value={activity.activeDays}
            sub={`${activity.totalSolves} solves in all`}
            color="text-sky-500"
          />
          <Tile
            icon={<Crown className="size-4" strokeWidth={3} />}
            label="Paths done"
            value={`${totals.pathsCompleted}/${totals.pathsTotal}`}
            sub={`${totals.mastered} problems mastered`}
            color="text-amber-500"
          />
        </div>

        <Card title="Activity">
          <ActivityGraph heatmap={stats.heatmap} />
        </Card>

        <Card title="Rhythm">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Tile icon={<Zap className="size-4" strokeWidth={3} />} label="7 days" value={activity.last7} sub="solves" color="text-green-500" />
            <Tile icon={<Zap className="size-4" strokeWidth={3} />} label="30 days" value={activity.last30} sub="solves" color="text-green-500" />
            <Tile
              icon={<Trophy className="size-4" strokeWidth={3} />}
              label="Best day"
              value={activity.bestDay?.solves ?? 0}
              sub={activity.bestDay ? formatDay(activity.bestDay.day) : "Not yet"}
              color="text-amber-500"
            />
            <Tile
              icon={<Sparkles className="size-4" strokeWidth={3} />}
              label="Per day"
              value={activity.avgPerActiveDay.toFixed(1)}
              sub="on active days"
              color="text-violet-500"
            />
          </div>
          <h3 className="mb-2 mt-5 text-xs font-extrabold uppercase tracking-wide text-zinc-400">By weekday</h3>
          <ol className="flex h-28 items-end gap-2">
            {activity.weekdays.map((n, i) => (
              <li key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1" title={`${n} on ${WEEKDAYS[i]}`}>
                <span className="text-xs font-extrabold text-zinc-500">{n}</span>
                <span
                  className={`w-full rounded-lg ${n > 0 && n === busiestWeekday ? "bg-green-500" : "bg-green-300 dark:bg-green-800"}`}
                  style={{ height: `${busiestWeekday === 0 ? 0 : Math.max(4, (n / busiestWeekday) * 100)}%` }}
                />
                <span className="text-xs font-extrabold text-zinc-400">{WEEKDAYS[i]}</span>
              </li>
            ))}
          </ol>
        </Card>

        <Card title="By difficulty">
          <ul className="space-y-4">
            {stats.difficulty.map((d) => (
              <li key={d.difficulty}>
                <div className="mb-1 flex items-baseline justify-between text-sm font-extrabold">
                  <span>{DIFFICULTY_LABEL[d.difficulty]}</span>
                  <span>
                    {d.solved}/{d.total}
                    <span className="ml-2 inline-flex items-center gap-1 text-xs font-bold text-zinc-400">
                      <Timer className="size-3" strokeWidth={3} />
                      {percent(d.under15, d.solved)}% fast
                    </span>
                  </span>
                </div>
                <Bar value={percent(d.solved, d.total)} color={DIFFICULTY_BAR[d.difficulty]} />
              </li>
            ))}
          </ul>
        </Card>

        <Card title="By path">
          <ul className="space-y-3">
            {stats.patterns.map((p) => (
              <li key={p.order}>
                <Link href={`/patterns/${p.order}`} className="flex items-center gap-3 rounded-2xl hover:opacity-80">
                  <span
                    className={`flex size-8 shrink-0 items-center justify-center rounded-xl border-b-2 text-sm font-black text-white ${pathColor(p.order).tile}`}
                  >
                    {p.order}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="mb-1 flex items-baseline justify-between gap-2 text-sm font-extrabold">
                      <span className="truncate">{p.name}</span>
                      <span className="flex shrink-0 items-center gap-1">
                        {p.mastered > 0 && (
                          <span className="flex items-center text-xs text-violet-500" title={`${p.mastered} mastered`}>
                            <Crown className="size-3" strokeWidth={3} />
                            {p.mastered}
                          </span>
                        )}
                        {p.solved}/{p.total}
                      </span>
                    </span>
                    <Bar value={percent(p.solved, p.total)} color="bg-green-500" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Recent solves">
          {stats.recent.length === 0 ? (
            <p className="text-sm font-bold text-zinc-400">Nothing solved yet. Pick a path to get started.</p>
          ) : (
            <ul className="divide-y-2 divide-zinc-100 dark:divide-zinc-800">
              {stats.recent.map((r) => (
                <li key={`${r.slug}-${r.solvedAt}`}>
                  <Link href={`/solutions/${r.slug}`} className="flex items-center gap-3 py-2.5 hover:opacity-80">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-extrabold">{r.title}</span>
                      <span className="block text-xs font-bold text-zinc-400">
                        {r.patternName} · {formatDay(dayKey(new Date(r.solvedAt), stats.timeZone), false)}
                        {r.under15 ? " · under 15 min" : ""}
                      </span>
                    </span>
                    <DifficultyBadge difficulty={r.difficulty} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </main>
    </>
  );
}
