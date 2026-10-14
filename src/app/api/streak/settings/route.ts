import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
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
  const settings = await prisma.appSettings.upsert({
    where: { id: 1 },
    update: { reminderHour: parsed.data.reminderHour },
    create: { id: 1, reminderHour: parsed.data.reminderHour },
  });
  return NextResponse.json({ reminderHour: settings.reminderHour });
}
