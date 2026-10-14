import { Check } from "lucide-react";
import type { StreakView } from "@/lib/types";

const LETTERS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

/** Last seven days as Duolingo-style circles: filled orange when something was solved. */
export default function StreakWeek({ week }: { week: StreakView["week"] }) {
  return (
    <ol className="flex justify-between gap-1">
      {week.map((d) => (
        <li key={d.day} className="flex flex-col items-center gap-1">
          <span
            className={`text-xs font-extrabold ${d.isToday ? "text-orange-500" : "text-zinc-400"}`}
          >
            {LETTERS[new Date(`${d.day}T00:00:00Z`).getUTCDay()]}
          </span>
          <span
            className={`flex size-8 items-center justify-center rounded-full ${
              d.active
                ? "bg-orange-500 text-white"
                : "bg-zinc-200 text-transparent dark:bg-zinc-700"
            } ${d.isToday ? "ring-2 ring-orange-500/40 ring-offset-2 ring-offset-[var(--background)]" : ""}`}
          >
            <Check className="size-4" strokeWidth={4} />
          </span>
        </li>
      ))}
    </ol>
  );
}
