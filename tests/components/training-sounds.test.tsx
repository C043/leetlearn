import { beforeEach, describe, expect, it, vi } from "vitest";
import { installAudio } from "../helpers/audio";

beforeEach(() => vi.resetModules());

const sounds = () => import("@/lib/training-sounds");

describe("training sounds", () => {
  it("plays a bright rising two-note ding for a correct answer", async () => {
    const audio = installAudio();
    (await sounds()).playCorrect();
    const notes = [...audio.oscillators].sort((a, b) => a.start - b.start);
    expect(new Set(notes.map((o) => o.start)).size).toBe(2);
    expect(notes[0].frequency).toBeGreaterThan(800);
    expect(notes.at(-1)!.frequency).toBeGreaterThan(notes[0].frequency);
    expect(Math.max(...notes.map((o) => o.stop)) - 10).toBeLessThan(0.8);
  });

  it("plays a low falling buzz for a wrong answer", async () => {
    const audio = installAudio();
    (await sounds()).playWrong();
    const notes = [...audio.oscillators].sort((a, b) => a.start - b.start);
    expect(notes[0].frequency).toBeLessThan(400);
    expect(notes.at(-1)!.frequency).toBeLessThan(notes[0].frequency);
    expect(Math.max(...notes.map((o) => o.stop)) - 10).toBeLessThan(0.8);
  });

  it("plays a brassy trumpet fanfare that ends on a held chord", async () => {
    const audio = installAudio();
    (await sounds()).playFanfare();
    expect(audio.oscillators.every((o) => o.type === "sawtooth")).toBe(true);
    expect(audio.filters.length).toBe(audio.oscillators.length);
    expect(audio.filters.every((f) => f.type === "lowpass")).toBe(true);
    const lastStart = Math.max(...audio.oscillators.map((o) => o.start));
    const chord = audio.oscillators.filter((o) => o.start === lastStart);
    expect(chord.length).toBeGreaterThanOrEqual(3);
    expect(chord[0].stop - chord[0].start).toBeGreaterThan(1);
    expect(new Set(audio.oscillators.map((o) => o.start)).size).toBeGreaterThanOrEqual(4); // a melody leads into it
  });

  it.each(["playCorrect", "playWrong", "playFanfare"] as const)(
    "%s fades every note in from silence and out to near-silence (no clicks)",
    async (name) => {
      const audio = installAudio();
      (await sounds())[name]();
      expect(audio.gains.length).toBeGreaterThan(0);
      for (const g of audio.gains) {
        expect(g.calls[0]).toEqual(["set", 0, expect.any(Number)]);
        const last = g.calls.at(-1)!;
        expect(last[0]).toBe("exp");
        expect(last[1]).toBeGreaterThan(0);
        expect(last[1]).toBeLessThan(0.001);
      }
      for (const o of audio.oscillators) expect(o.stop).toBeGreaterThan(o.start);
    },
  );

  it("shares one audio context with the chime", async () => {
    const audio = installAudio();
    const { playCorrect, playWrong, playFanfare } = await sounds();
    const { playChime } = await import("@/lib/chime");
    playChime();
    playCorrect();
    playWrong();
    playFanfare();
    expect(audio.instances).toHaveLength(1);
  });
});
