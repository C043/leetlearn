import { describe, expect, it } from "vitest";
import { REVIEW_QUEUE_SIZE, lastScheduledRotation, nextScheduledRotation } from "@/lib/review-service";

const iso = (d: Date) => d.toISOString();

describe("REVIEW_QUEUE_SIZE", () => {
  it("is 5, as the review rules require", () => {
    expect(REVIEW_QUEUE_SIZE).toBe(5);
  });
});

describe("lastScheduledRotation", () => {
  it("returns the same day at 00:00 UTC for a Saturday", () => {
    expect(iso(lastScheduledRotation(new Date("2024-06-15T00:00:00Z")))).toBe("2024-06-15T00:00:00.000Z");
    expect(iso(lastScheduledRotation(new Date("2024-06-15T13:45:12Z")))).toBe("2024-06-15T00:00:00.000Z");
    expect(iso(lastScheduledRotation(new Date("2024-06-15T23:59:59.999Z")))).toBe("2024-06-15T00:00:00.000Z");
  });

  it("maps every day of the following week back to that Saturday", () => {
    // 2024-06-15 is a Saturday; Sun 16 .. Fri 21 all belong to it
    for (let d = 16; d <= 21; d++) {
      const now = new Date(Date.UTC(2024, 5, d, 12));
      expect(iso(lastScheduledRotation(now))).toBe("2024-06-15T00:00:00.000Z");
    }
  });

  it("switches exactly at Saturday 00:00 UTC", () => {
    expect(iso(lastScheduledRotation(new Date("2024-06-21T23:59:59.999Z")))).toBe("2024-06-15T00:00:00.000Z");
    expect(iso(lastScheduledRotation(new Date("2024-06-22T00:00:00.000Z")))).toBe("2024-06-22T00:00:00.000Z");
  });

  it("crosses month and year boundaries", () => {
    // Thu 2 Jan 2025 -> Sat 28 Dec 2024
    expect(iso(lastScheduledRotation(new Date("2025-01-02T08:00:00Z")))).toBe("2024-12-28T00:00:00.000Z");
    // Mon 3 Mar 2025 -> Sat 1 Mar 2025
    expect(iso(lastScheduledRotation(new Date("2025-03-03T08:00:00Z")))).toBe("2025-03-01T00:00:00.000Z");
    // Tue 27 Feb 2024 (leap year) -> Sat 24 Feb 2024
    expect(iso(lastScheduledRotation(new Date("2024-02-27T08:00:00Z")))).toBe("2024-02-24T00:00:00.000Z");
  });

  it("always returns a Saturday at midnight UTC, never in the future", () => {
    const start = Date.UTC(2023, 0, 1);
    for (let h = 0; h < 24 * 400; h += 7) {
      const now = new Date(start + h * 3600_000);
      const r = lastScheduledRotation(now);
      expect(r.getUTCDay()).toBe(6);
      expect(r.getUTCHours() + r.getUTCMinutes() + r.getUTCSeconds() + r.getUTCMilliseconds()).toBe(0);
      expect(r.getTime()).toBeLessThanOrEqual(now.getTime());
      expect(now.getTime() - r.getTime()).toBeLessThan(7 * 24 * 3600_000);
    }
  });

  it("does not mutate its argument", () => {
    const now = new Date("2024-06-19T10:00:00Z");
    lastScheduledRotation(now);
    expect(iso(now)).toBe("2024-06-19T10:00:00.000Z");
  });

  it("ignores the server's local time zone", () => {
    const original = process.env.TZ;
    try {
      for (const tz of ["Pacific/Kiritimati", "Pacific/Pago_Pago", "Asia/Kolkata"]) {
        process.env.TZ = tz;
        expect(iso(lastScheduledRotation(new Date("2024-06-15T00:30:00Z")))).toBe("2024-06-15T00:00:00.000Z");
        expect(iso(lastScheduledRotation(new Date("2024-06-14T23:30:00Z")))).toBe("2024-06-08T00:00:00.000Z");
      }
    } finally {
      process.env.TZ = original;
    }
  });
});

describe("nextScheduledRotation", () => {
  it("is exactly one week after the last rotation", () => {
    for (const s of ["2024-06-15T00:00:00Z", "2024-06-17T09:00:00Z", "2024-06-21T23:59:59Z"]) {
      const now = new Date(s);
      expect(nextScheduledRotation(now).getTime() - lastScheduledRotation(now).getTime()).toBe(7 * 24 * 3600_000);
    }
  });

  it("is the following Saturday when called on a Saturday", () => {
    expect(iso(nextScheduledRotation(new Date("2024-06-15T00:00:00Z")))).toBe("2024-06-22T00:00:00.000Z");
  });

  it("is always strictly in the future", () => {
    const start = Date.UTC(2024, 0, 1);
    for (let h = 0; h < 24 * 60; h += 5) {
      const now = new Date(start + h * 3600_000);
      expect(nextScheduledRotation(now).getTime()).toBeGreaterThan(now.getTime());
    }
  });

  it("crosses the year boundary", () => {
    expect(iso(nextScheduledRotation(new Date("2024-12-30T12:00:00Z")))).toBe("2025-01-04T00:00:00.000Z");
  });
});
