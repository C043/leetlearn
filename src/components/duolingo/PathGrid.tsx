import Link from "next/link";
import { Crown } from "lucide-react";
import { nextPathOrder, pathColor } from "@/lib/path-tiles";
import type { PatternSummary } from "@/lib/types";

function PathTile({ pattern, isNext }: { pattern: PatternSummary; isNext: boolean }) {
  const { order, name, solved, total } = pattern;
  const done = total > 0 && solved === total;
  const percent = total === 0 ? 0 : Math.round((solved / total) * 100);
  const color = pathColor(order);

  return (
    <Link
      href={`/patterns/${order}`}
      aria-label={`Path ${order}: ${name}, ${solved} of ${total} solved${done ? ", complete" : ""}`}
      className={`btn-3d relative flex h-full flex-col rounded-3xl border-2 p-4 text-white [--depth:6px] ${color.tile} ${
        isNext ? "ring-4 ring-amber-300 ring-offset-2 ring-offset-[var(--background)]" : ""
      }`}
    >
      {isNext && (
        <span className="animate-float absolute -top-3 right-4 rounded-xl border-2 border-amber-500 bg-amber-300 px-2 py-0.5 text-xs font-extrabold uppercase tracking-wide text-amber-900">
          Continue
        </span>
      )}
      <div className="flex items-center gap-3">
        <h2 className="flex min-w-0 flex-1 items-center gap-3 text-lg font-black leading-tight">
          <span
            className={`flex size-10 shrink-0 items-center justify-center rounded-2xl bg-white text-lg font-black ${color.badge}`}
          >
            {order}
          </span>
          <span className="min-w-0">{name}</span>
        </h2>
        {done && (
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-amber-500 bg-amber-300 text-amber-700">
            <Crown className="size-5" strokeWidth={2.5} fill="currentColor" />
          </span>
        )}
      </div>
      <div className="mt-3">
        <div className="mb-1 flex items-center justify-between text-xs font-extrabold uppercase tracking-wide text-white/85">
          <span>{done ? "Complete" : "Progress"}</span>
          <span>
            {solved}/{total}
          </span>
        </div>
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          className="h-3 overflow-hidden rounded-full bg-black/20"
        >
          <div
            className={`h-full rounded-full ${done ? "bg-amber-300" : color.bar}`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </Link>
  );
}

/** Path selection: one colorful tile per pattern, the next one to work on highlighted. */
export default function PathGrid({ patterns }: { patterns: PatternSummary[] }) {
  const next = nextPathOrder(patterns);
  return (
    <ul className="grid grid-cols-1 gap-5 min-[420px]:grid-cols-2">
      {patterns.map((p) => (
        <li key={p.id} className="min-w-0">
          <PathTile pattern={p} isNext={p.order === next} />
        </li>
      ))}
    </ul>
  );
}
