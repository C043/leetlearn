import { NextResponse } from "next/server";
import { sendPushToAll } from "@/lib/push";
import { getStreak } from "@/lib/streak";

/** Fire a sample streak reminder to every subscribed device. */
export async function POST() {
  const { current } = await getStreak();
  const result = await sendPushToAll({
    title: "🔥 Notifications are on!",
    body:
      current > 0
        ? `We'll nudge you before your ${current}-day streak is in danger.`
        : "We'll nudge you before your streak is in danger.",
    url: "/",
    tag: "streak-test",
  });
  if (result.sent === 0) {
    return NextResponse.json(
      { error: "No device received it. Try turning notifications off and on again." },
      { status: 502 },
    );
  }
  return NextResponse.json(result);
}
