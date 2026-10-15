import { describe, expect, it } from "vitest";
import { prisma } from "@/lib/db";
import { getSettings, rememberTimeZone } from "@/lib/streak";

describe("settings row", () => {
  it("survives parallel first reads and writes on an empty database", async () => {
    // The race is timing-dependent, so give it several chances to show up
    for (let round = 0; round < 20; round++) {
      await prisma.appSettings.deleteMany();
      await Promise.all([
        ...Array.from({ length: 5 }, () => getSettings()),
        ...Array.from({ length: 5 }, () => rememberTimeZone("Europe/Rome")),
      ]);
      expect(await prisma.appSettings.count()).toBe(1);
    }
  });

  it("keeps existing values when read again", async () => {
    await rememberTimeZone("Europe/Rome");

    expect((await getSettings()).timeZone).toBe("Europe/Rome");
  });

  it("creates the row when the first write is a time zone", async () => {
    await Promise.all([rememberTimeZone("Europe/Rome"), getSettings()]);

    expect((await getSettings()).timeZone).toBe("Europe/Rome");
  });
});
