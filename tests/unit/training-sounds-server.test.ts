import { describe, expect, it } from "vitest";
import { playCorrect, playFanfare, playWrong } from "@/lib/training-sounds";

// The Node environment has no window: every sound must be a silent no-op (SSR safety).
describe("training sounds on the server", () => {
  it("do nothing without a window", () => {
    expect(typeof window).toBe("undefined");
    expect(() => playCorrect()).not.toThrow();
    expect(() => playWrong()).not.toThrow();
    expect(() => playFanfare()).not.toThrow();
  });
});
