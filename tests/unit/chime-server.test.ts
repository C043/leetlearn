import { describe, expect, it } from "vitest";
import { playChime, unlockAudio } from "@/lib/chime";

// The Node environment has no window: the chime must be a silent no-op (SSR safety).
describe("chime on the server", () => {
  it("does nothing without a window", () => {
    expect(typeof window).toBe("undefined");
    expect(() => unlockAudio()).not.toThrow();
    expect(() => playChime()).not.toThrow();
  });
});
