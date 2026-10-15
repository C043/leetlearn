import { describe, expect, it } from "vitest";
import { addDays, dayKey, localHour, normalizeTimeZone } from "@/lib/streak";

describe("normalizeTimeZone", () => {
  it.each(["UTC", "Europe/Rome", "America/New_York", "Asia/Kolkata", "Pacific/Kiritimati", "Asia/Kathmandu"])(
    "accepts the IANA zone %s unchanged",
    (tz) => {
      expect(normalizeTimeZone(tz)).toBe(tz);
    },
  );

  it.each(["Mars/Olympus_Mons", "Europe/Atlantis", "not a zone", "UTC+25"])("rejects the unknown zone %j", (tz) => {
    expect(normalizeTimeZone(tz)).toBeNull();
  });

  it("rejects the empty string", () => {
    expect(normalizeTimeZone("")).toBeNull();
  });

  it("rejects strings longer than 64 characters even before asking Intl", () => {
    expect(normalizeTimeZone("A".repeat(65))).toBeNull();
    // 64 is still allowed through to Intl (which then rejects this one)
    expect(normalizeTimeZone("A".repeat(64))).toBeNull();
  });

  it.each([undefined, null, 0, 42, true, {}, [], ["UTC"], { timeZone: "UTC" }])(
    "rejects the non-string %j",
    (tz) => {
      expect(normalizeTimeZone(tz)).toBeNull();
    },
  );
});

describe("dayKey", () => {
  const instant = new Date("2024-03-10T23:30:00Z");

  it("formats as zero-padded YYYY-MM-DD", () => {
    expect(dayKey(new Date("2024-01-05T12:00:00Z"), "UTC")).toBe("2024-01-05");
  });

  it("gives the same instant different calendar days in different zones", () => {
    expect(dayKey(instant, "UTC")).toBe("2024-03-10");
    expect(dayKey(instant, "Asia/Tokyo")).toBe("2024-03-11");
    expect(dayKey(instant, "America/Los_Angeles")).toBe("2024-03-10");
  });

  it("handles the extreme offsets +14 and -11", () => {
    const t = new Date("2024-06-15T10:30:00Z");
    expect(dayKey(t, "Pacific/Kiritimati")).toBe("2024-06-16"); // 00:30 next day
    expect(dayKey(t, "Pacific/Pago_Pago")).toBe("2024-06-14"); // 23:30 previous day
  });

  it("is exact at local midnight", () => {
    // Rome is UTC+1 in winter
    expect(dayKey(new Date("2024-01-09T22:59:59.999Z"), "Europe/Rome")).toBe("2024-01-09");
    expect(dayKey(new Date("2024-01-09T23:00:00.000Z"), "Europe/Rome")).toBe("2024-01-10");
  });

  it("follows DST: the same UTC time maps to different local days in winter and summer", () => {
    // New York: UTC-5 in January, UTC-4 in July
    expect(dayKey(new Date("2024-01-10T04:30:00Z"), "America/New_York")).toBe("2024-01-09");
    expect(dayKey(new Date("2024-07-10T04:30:00Z"), "America/New_York")).toBe("2024-07-10");
  });

  it("handles leap days and year boundaries", () => {
    expect(dayKey(new Date("2024-02-29T12:00:00Z"), "UTC")).toBe("2024-02-29");
    expect(dayKey(new Date("2023-12-31T23:30:00Z"), "Europe/Berlin")).toBe("2024-01-01");
    expect(dayKey(new Date("2024-01-01T00:30:00Z"), "America/Chicago")).toBe("2023-12-31");
  });
});

describe("localHour", () => {
  it("returns 0 (not 24) at midnight", () => {
    expect(localHour(new Date("2024-05-01T00:00:00Z"), "UTC")).toBe(0);
    expect(localHour(new Date("2024-05-01T00:59:59Z"), "UTC")).toBe(0);
  });

  it("returns 23 in the last hour of the day", () => {
    expect(localHour(new Date("2024-05-01T23:59:59Z"), "UTC")).toBe(23);
  });

  it("handles half-hour and 45-minute offsets", () => {
    // Kolkata is UTC+5:30
    expect(localHour(new Date("2024-01-01T18:29:00Z"), "Asia/Kolkata")).toBe(23);
    expect(localHour(new Date("2024-01-01T18:30:00Z"), "Asia/Kolkata")).toBe(0);
    // Kathmandu is UTC+5:45
    expect(localHour(new Date("2024-01-01T16:14:00Z"), "Asia/Kathmandu")).toBe(21);
    expect(localHour(new Date("2024-01-01T16:15:00Z"), "Asia/Kathmandu")).toBe(22);
  });

  it("skips the missing hour on the DST spring-forward day", () => {
    // 2024-03-10 in New York: 01:59 EST is followed by 03:00 EDT
    expect(localHour(new Date("2024-03-10T06:59:00Z"), "America/New_York")).toBe(1);
    expect(localHour(new Date("2024-03-10T07:00:00Z"), "America/New_York")).toBe(3);
  });

  it("repeats the hour on the DST fall-back day", () => {
    // 2024-11-03 in New York: 01:xx happens twice
    expect(localHour(new Date("2024-11-03T05:30:00Z"), "America/New_York")).toBe(1);
    expect(localHour(new Date("2024-11-03T06:30:00Z"), "America/New_York")).toBe(1);
  });

  it("returns every hour 0..23 exactly once across a UTC day", () => {
    const hours = Array.from({ length: 24 }, (_, h) =>
      localHour(new Date(Date.UTC(2024, 4, 1, h, 15)), "UTC"),
    );
    expect(hours).toEqual(Array.from({ length: 24 }, (_, h) => h));
  });
});

describe("addDays", () => {
  it.each([
    ["2024-05-10", 0, "2024-05-10"],
    ["2024-05-10", 1, "2024-05-11"],
    ["2024-05-10", -1, "2024-05-09"],
    ["2024-05-31", 1, "2024-06-01"],
    ["2024-06-01", -1, "2024-05-31"],
    ["2024-12-31", 1, "2025-01-01"],
    ["2025-01-01", -1, "2024-12-31"],
    ["2024-02-28", 1, "2024-02-29"], // leap year
    ["2023-02-28", 1, "2023-03-01"], // not a leap year
    ["2024-03-01", -1, "2024-02-29"],
    ["2100-02-28", 1, "2100-03-01"], // century, not a leap year
    ["2000-02-28", 1, "2000-02-29"], // 400-year rule, leap year
    ["2024-01-01", 366, "2025-01-01"],
    ["2024-03-10", 1, "2024-03-11"], // US DST change has no effect on calendar math
    ["2024-03-31", 1, "2024-04-01"], // EU DST change
  ])("addDays(%s, %i) = %s", (day, n, expected) => {
    expect(addDays(day, n)).toBe(expected);
  });

  it("is reversible", () => {
    let day = "2023-11-15";
    for (let i = 0; i < 500; i++) day = addDays(day, 1);
    for (let i = 0; i < 500; i++) day = addDays(day, -1);
    expect(day).toBe("2023-11-15");
  });

  it("is independent of the process time zone", () => {
    const original = process.env.TZ;
    try {
      for (const tz of ["Pacific/Kiritimati", "Pacific/Pago_Pago", "America/New_York"]) {
        process.env.TZ = tz;
        expect(addDays("2024-03-10", 1)).toBe("2024-03-11");
        expect(addDays("2024-11-03", -1)).toBe("2024-11-02");
      }
    } finally {
      process.env.TZ = original;
    }
  });
});
