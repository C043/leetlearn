import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BackToPaths() {
  return (
    <Link
      href="/"
      className="btn-3d inline-flex items-center gap-2 rounded-2xl border-2 border-zinc-300 bg-white px-4 py-2 text-sm font-extrabold uppercase tracking-wide text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
    >
      <ArrowLeft className="size-4" strokeWidth={3} /> Back to paths
    </Link>
  );
}
