import { describe, expect, it, vi } from "vitest";
import { getHeaderData } from "@/lib/header-data";
import { insertPatterns, markSolved, setActivityDays, setSettings } from "../helpers/db";

describe("getHeaderData", () => {
  it("works on an empty database", async () => {
    const { summaries, header } = await getHeaderData();
    expect(summaries).toEqual([]);
    expect(header).toMatchObject({ streak: { current: 0 }, prefs: { reminderHour: 20 } });
    expect(header.prefs.vapidPublicKey.length).toBeGreaterThan(0);
  });

  it("summarises solved problems per path", async () => {
    const [a, , c] = await insertPatterns(3);
    await markSolved(a.problems[0].id, new Date());
    for (const p of c.problems) await markSolved(p.id, new Date());
    const { summaries } = await getHeaderData();
    expect(summaries.map((s) => s.solved)).toEqual([1, 0, 10]);
  });

  it("passes the streak and reminder preferences through", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2024-05-10T12:00:00Z"));
    vi.stubEnv("VAPID_PUBLIC_KEY", "env-pub");
    vi.stubEnv("VAPID_PRIVATE_KEY", "env-priv");
    await setSettings({ reminderHour: 7 });
    await setActivityDays(["2024-05-09", "2024-05-10"]);
    const { header } = await getHeaderData();
    expect(header.streak).toMatchObject({ current: 2, doneToday: true });
    expect(header.prefs).toEqual({ reminderHour: 7, vapidPublicKey: "env-pub" });
  });

  it("never exposes the private VAPID key to the client", async () => {
    vi.stubEnv("VAPID_PUBLIC_KEY", "env-pub");
    vi.stubEnv("VAPID_PRIVATE_KEY", "env-priv");
    expect(JSON.stringify(await getHeaderData())).not.toContain("env-priv");
  });
});
