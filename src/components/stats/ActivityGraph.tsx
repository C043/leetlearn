import type { Heatmap, HeatmapCell } from "@/lib/stats";

/** Full class strings (Tailwind only picks up literal names), from no solves to the busiest day. */
const LEVELS: Record<HeatmapCell["level"], string> = {
  0: "bg-zinc-200 dark:bg-zinc-800",
  1: "bg-green-200 dark:bg-green-900",
  2: "bg-green-400 dark:bg-green-700",
  3: "bg-green-500 dark:bg-green-500",
  4: "bg-green-700 dark:bg-green-300",
};

const WEEKDAYS = ["", "Mon", "", "Wed", "", "Fri", ""];
/** Square size plus gap, in px; month labels are positioned with it. */
const STEP = 15;

const formatDay = (day: string) =>
  new Date(`${day}T00:00:00Z`).toLocaleDateString("en-US", {
    timeZone: "UTC",
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const describeCell = ({ day, solves }: HeatmapCell) =>
  `${solves === 0 ? "No" : solves} ${solves === 1 ? "solve" : "solves"} on ${formatDay(day)}`;

/** GitHub-style contribution graph: one square per day, one column per week. */
export default function ActivityGraph({ heatmap }: { heatmap: Heatmap }) {
  const { weeks, months, total } = heatmap;
  return (
    <div>
      <p className="mb-3 text-sm font-extrabold text-zinc-500">
        {total} {total === 1 ? "solve" : "solves"} in the last year
      </p>
      {/* row-reverse starts the scroll at the right edge, so today is visible on phones */}
      <div className="flex flex-row-reverse overflow-x-auto pb-2">
        <div className="flex shrink-0 gap-2">
          <ol className="mt-5 flex flex-col gap-[3px] text-[10px] font-bold leading-3 text-zinc-400">
            {WEEKDAYS.map((label, i) => (
              <li key={i} className="h-3">
                {label}
              </li>
            ))}
          </ol>
          <div>
            <div className="relative h-5 text-[10px] font-bold text-zinc-400">
              {months.map((m) => (
                <span key={m.week} className="absolute top-0" style={{ left: m.week * STEP }}>
                  {m.label}
                </span>
              ))}
            </div>
            <div className="flex gap-[3px]">
              {weeks.map((week, w) => (
                <div key={w} className="flex flex-col gap-[3px]">
                  {week.map((cell, d) =>
                    cell ? (
                      <span
                        key={cell.day}
                        data-day={cell.day}
                        data-level={cell.level}
                        title={describeCell(cell)}
                        className={`size-3 rounded-[3px] ${LEVELS[cell.level]}`}
                      />
                    ) : (
                      <span key={d} className="size-3" />
                    ),
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-1 flex items-center justify-end gap-1 text-[10px] font-bold text-zinc-400">
        <span className="mr-1">Less</span>
        {([0, 1, 2, 3, 4] as const).map((l) => (
          <span key={l} className={`size-3 rounded-[3px] ${LEVELS[l]}`} />
        ))}
        <span className="ml-1">More</span>
      </div>
    </div>
  );
}
