import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { rememberTimeZone } from "@/lib/streak";

const subscribeSchema = z.object({
  subscription: z.object({
    endpoint: z.string().url(),
    keys: z.object({ p256dh: z.string().min(1), auth: z.string().min(1) }),
  }),
  timeZone: z.string().optional(),
});

/** Register (or refresh) this device's push subscription. Idempotent. */
export async function POST(request: Request) {
  const parsed = subscribeSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid push subscription" }, { status: 400 });
  }
  const { endpoint, keys } = parsed.data.subscription;
  await prisma.pushSubscription.upsert({
    where: { endpoint },
    update: { p256dh: keys.p256dh, auth: keys.auth },
    create: { endpoint, p256dh: keys.p256dh, auth: keys.auth },
  });
  await rememberTimeZone(parsed.data.timeZone);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const parsed = z
    .object({ endpoint: z.string() })
    .safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Body must be { endpoint: string }" }, { status: 400 });
  }
  await prisma.pushSubscription.deleteMany({ where: { endpoint: parsed.data.endpoint } });
  return NextResponse.json({ ok: true });
}
