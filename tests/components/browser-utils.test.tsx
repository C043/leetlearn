import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import DifficultyBadge from "@/components/duolingo/DifficultyBadge";
import { formatRotation } from "@/components/review/formatRotation";

describe("DifficultyBadge", () => {
  it.each([
    ["EASY", "easy", "bg-emerald-100"],
    ["MEDIUM", "medium", "bg-amber-100"],
    ["HARD", "hard", "bg-rose-100"],
  ] as const)("shows %s as %s with its own color", (difficulty, text, color) => {
    render(<DifficultyBadge difficulty={difficulty} />);
    expect(screen.getByText(text).className).toContain(color);
  });
});

describe("formatRotation", () => {
  it("formats the next Saturday as weekday, month and day", () => {
    vi.stubEnv("TZ", "UTC");
    const out = formatRotation("2026-10-17T00:00:00.000Z");
    expect(out).toMatch(/Sat/);
    expect(out).toMatch(/Oct/);
    expect(out).toMatch(/17/);
    expect(out).not.toMatch(/2026/);
  });
});

describe("ServiceWorkerRegistrar", () => {
  const register = vi.fn();

  beforeEach(() => {
    vi.resetModules();
    register.mockReset().mockResolvedValue({});
    Object.defineProperty(navigator, "serviceWorker", { value: { register }, configurable: true });
  });

  async function mount() {
    const { ServiceWorkerRegistrar } = await import("@/components/pwa/ServiceWorkerRegistrar");
    return render(<ServiceWorkerRegistrar />);
  }

  it("registers /sw.js for the whole app in production, bypassing the HTTP cache", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const { container } = await mount();
    expect(register).toHaveBeenCalledWith("/sw.js", { scope: "/", updateViaCache: "none" });
    expect(container.innerHTML).toBe("");
  });

  it("does not register in development (stale caches would hide changes)", async () => {
    vi.stubEnv("NODE_ENV", "development");
    await mount();
    expect(register).not.toHaveBeenCalled();
  });

  it("does nothing in browsers without service workers", async () => {
    vi.stubEnv("NODE_ENV", "production");
    delete (navigator as unknown as Record<string, unknown>).serviceWorker;
    await expect(mount()).resolves.toBeDefined();
  });

  it("logs instead of crashing when registration fails", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    register.mockRejectedValue(new Error("SecurityError"));
    await mount();
    await vi.waitFor(() => expect(error).toHaveBeenCalledWith("Service worker registration failed:", expect.any(Error)));
  });
});

describe("chime", () => {
  /** Records the Web Audio graph the chime builds. */
  function installAudio(state: "running" | "suspended" = "running") {
    const oscillators: { frequency: number; start: number; stop: number; type: string }[] = [];
    const gains: { calls: [string, number, number][] }[] = [];
    const instances: FakeContext[] = [];
    class FakeContext {
      state = state;
      currentTime = 10;
      destination = {};
      resume = vi.fn(async () => {
        this.state = "running";
      });
      constructor() {
        instances.push(this);
      }
      createOscillator() {
        const o = { type: "", frequency: { value: 0 }, start: 0, stop: 0 };
        const rec = { frequency: 0, start: 0, stop: 0, type: "" };
        oscillators.push(rec);
        return {
          set type(t: string) {
            rec.type = t;
          },
          frequency: new Proxy(o.frequency, {
            set: (_, __, v) => ((rec.frequency = v), true),
          }),
          connect: (g: unknown) => g,
          start: (t: number) => void (rec.start = t),
          stop: (t: number) => void (rec.stop = t),
        };
      }
      createGain() {
        const rec = { calls: [] as [string, number, number][] };
        gains.push(rec);
        const param = {
          setValueAtTime: (v: number, t: number) => rec.calls.push(["set", v, t]),
          linearRampToValueAtTime: (v: number, t: number) => rec.calls.push(["linear", v, t]),
          exponentialRampToValueAtTime: (v: number, t: number) => rec.calls.push(["exp", v, t]),
        };
        return { gain: param, connect: (d: unknown) => d };
      }
    }
    vi.stubGlobal("AudioContext", FakeContext);
    return { oscillators, gains, instances };
  }

  beforeEach(() => vi.resetModules());

  it("plays G5, B5, E6, each with an octave overtone, in sequence", async () => {
    const audio = installAudio();
    const { playChime } = await import("@/lib/chime");
    playChime();
    expect(audio.oscillators.map((o) => o.frequency)).toEqual([783.99, 1567.98, 987.77, 1975.54, 1318.51, 2637.02]);
    expect(audio.oscillators.every((o) => o.type === "sine")).toBe(true);
    const starts = audio.oscillators.map((o) => o.start);
    expect(starts[0]).toBeCloseTo(10.05);
    expect(starts[2] - starts[0]).toBeCloseTo(0.13);
    expect(starts[4] - starts[2]).toBeCloseTo(0.13);
    for (const o of audio.oscillators) expect(o.stop).toBeGreaterThan(o.start);
  });

  it("lets the last note ring longer than the others", async () => {
    const audio = installAudio();
    const { playChime } = await import("@/lib/chime");
    playChime();
    const length = (i: number) => audio.oscillators[i].stop - audio.oscillators[i].start;
    expect(length(4)).toBeGreaterThan(length(0));
  });

  it("fades every note in from silence and out to near-silence (no clicks)", async () => {
    const audio = installAudio();
    const { playChime } = await import("@/lib/chime");
    playChime();
    for (const g of audio.gains) {
      expect(g.calls[0][0]).toBe("set");
      expect(g.calls[0][1]).toBe(0);
      expect(g.calls[2][0]).toBe("exp");
      expect(g.calls[2][1]).toBeGreaterThan(0); // exponential ramps can't reach 0
      expect(g.calls[2][1]).toBeLessThan(0.001);
    }
  });

  it("creates one audio context and reuses it", async () => {
    const audio = installAudio();
    const { playChime, unlockAudio } = await import("@/lib/chime");
    unlockAudio();
    playChime();
    playChime();
    expect(audio.instances).toHaveLength(1);
  });

  it("resumes a context the browser suspended", async () => {
    const audio = installAudio("suspended");
    const { unlockAudio } = await import("@/lib/chime");
    unlockAudio();
    expect(audio.instances[0].resume).toHaveBeenCalled();
  });

  it("does not resume a running context", async () => {
    const audio = installAudio("running");
    const { unlockAudio } = await import("@/lib/chime");
    unlockAudio();
    expect(audio.instances[0].resume).not.toHaveBeenCalled();
  });
});
