import { vi } from "vitest";

export type ParamCall = [string, number, number];

/** Records the Web Audio graph a sound builds, via a stubbed global AudioContext. */
export function installAudio(state: "running" | "suspended" = "running") {
  const oscillators: { frequency: number; start: number; stop: number; type: string }[] = [];
  const gains: { calls: ParamCall[] }[] = [];
  const filters: { type: string; calls: ParamCall[] }[] = [];
  const instances: FakeContext[] = [];

  function recordingParam(calls: ParamCall[]) {
    return {
      set value(v: number) {
        calls.push(["value", v, 0]);
      },
      setValueAtTime: (v: number, t: number) => calls.push(["set", v, t]),
      linearRampToValueAtTime: (v: number, t: number) => calls.push(["linear", v, t]),
      exponentialRampToValueAtTime: (v: number, t: number) => calls.push(["exp", v, t]),
    };
  }

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
      const rec = { calls: [] as ParamCall[] };
      gains.push(rec);
      return { gain: recordingParam(rec.calls), connect: (d: unknown) => d };
    }
    createBiquadFilter() {
      const rec = { type: "", calls: [] as ParamCall[] };
      filters.push(rec);
      return {
        set type(t: string) {
          rec.type = t;
        },
        frequency: recordingParam(rec.calls),
        Q: { value: 0 },
        connect: (d: unknown) => d,
      };
    }
  }

  vi.stubGlobal("AudioContext", FakeContext);
  return { oscillators, gains, filters, instances };
}
