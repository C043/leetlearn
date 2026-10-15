"use client";

import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { formatRotation } from "./formatRotation";

/** Featured tile on the path selection that leads to the Saturday Review. */
export default function ReviewTile({ count, nextRotation }: { count: number; nextRotation: string }) {
  return (
    <Link
      href="/review"
      aria-label={`Saturday Review: ${count === 0 ? "all caught up" : `${count} to review`}`}
      className="btn-3d flex items-center gap-4 rounded-3xl border-2 border-sky-700 bg-gradient-to-r from-sky-500 to-cyan-400 p-5 text-white [--depth:6px] hover:from-sky-400 hover:to-cyan-300"
    >
      <span className="relative flex size-16 shrink-0 items-center justify-center rounded-2xl bg-white text-sky-500">
        <RotateCcw className="size-9" strokeWidth={3} />
        {count > 0 && (
          <span className="absolute -right-2 -top-2 flex size-7 items-center justify-center rounded-full border-2 border-white bg-orange-500 text-sm font-black text-white">
            {count}
          </span>
        )}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-extrabold uppercase tracking-wider text-sky-100">Saturday Review</p>
        <h2 className="text-2xl font-black leading-tight">
          {count === 0 ? "All caught up!" : `${count} to review`}
        </h2>
        <p className="text-sm font-bold text-sky-50" suppressHydrationWarning>
          {count === 0
            ? `Next refresh ${formatRotation(nextRotation)}`
            : "Re-solve these to keep them fresh"}
        </p>
      </div>
    </Link>
  );
}
