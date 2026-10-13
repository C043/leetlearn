import { redirect } from "next/navigation";
import { getPatternSummaries } from "@/lib/queries";

export const dynamic = "force-dynamic";

/** Land on the first path that still has unsolved problems. */
export default async function Home() {
  const patterns = await getPatternSummaries();
  if (patterns.length === 0) {
    return (
      <main className="mx-auto max-w-md p-8 text-center">
        <h1 className="mb-2 text-2xl font-extrabold">No learning paths yet</h1>
        <p className="text-zinc-500">
          The database is empty. Run <code className="font-mono">npx prisma db seed</code> and
          reload.
        </p>
      </main>
    );
  }
  const next = patterns.find((p) => p.solved < p.total) ?? patterns[0];
  redirect(`/patterns/${next.order}`);
}
