import Link from "next/link";
import type { PatternSummary } from "@/lib/types";

export default function PatternSwitcher({
  patterns,
  activeOrder,
}: {
  patterns: PatternSummary[];
  activeOrder: number;
}) {
  return (
    <nav aria-label="Learning paths">
      <h2 className="mb-3 px-1 text-xs font-extrabold uppercase tracking-wider text-zinc-400">
        Paths
      </h2>
      <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
        {patterns.map((p) => {
          const active = p.order === activeOrder;
          const done = p.solved === p.total;
          return (
            <li key={p.id} className="shrink-0">
              <Link
                href={`/patterns/${p.order}`}
                aria-current={active ? "page" : undefined}
                className={`block w-44 rounded-2xl border-2 px-3 py-2 transition-colors lg:w-full ${
                  active
                    ? "border-sky-400 bg-sky-50 dark:border-sky-600 dark:bg-sky-950/60"
                    : "border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-900"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-bold">{p.name}</span>
                  <span className={`text-xs font-bold ${done ? "text-amber-500" : "text-zinc-400"}`}>
                    {p.solved}/{p.total}
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                  <div
                    className={`h-full rounded-full ${done ? "bg-amber-400" : "bg-green-500"}`}
                    style={{ width: `${(p.solved / p.total) * 100}%` }}
                  />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
