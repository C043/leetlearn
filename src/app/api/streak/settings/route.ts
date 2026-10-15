import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { ensureSettings } from "@/lib/streak";
import { LAST_CALL_HOUR } from "@/lib/streak-config";

const bodySchema = z.object({
  reminderHour: z.number().int().min(0).max(LAST_CALL_HOUR),
});

export async function PATCH(request: Request) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: `Body must be { reminderHour: 0-${LAST_CALL_HOUR} }` },
      { status: 400 },
    );
  }
  await ensureSettings();
  const settings = await prisma.appSettings.update({
    where: { id: 1 },
    data: { reminderHour: parsed.data.reminderHour },
  });
  return NextResponse.json({ reminderHour: settings.reminderHour });
}
