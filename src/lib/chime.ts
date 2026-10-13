let ctx: AudioContext | null = null;

/**
 * Creates/resumes the shared AudioContext. Call from a user gesture (e.g. the
 * timer's Start click) so the browser allows the chime to play later on.
 */
export function unlockAudio() {
  if (typeof window === "undefined") return;
  ctx ??= new AudioContext();
  if (ctx.state === "suspended") void ctx.resume();
}

/** Bright ascending three-note chime, synthesized so no audio asset is needed. */
export function playChime() {
  unlockAudio();
  if (!ctx) return;
  const notes = [783.99, 987.77, 1318.51]; // G5, B5, E6
  const start = ctx.currentTime + 0.05;

  notes.forEach((freq, i) => {
    const t = start + i * 0.13;
    const last = i === notes.length - 1;
    const decay = last ? 1.1 : 0.45;

    // Sine body plus a quiet octave overtone gives a soft bell-like tone.
    for (const [mult, level] of [[1, 0.22], [2, 0.05]] as const) {
      const osc = ctx!.createOscillator();
      const gain = ctx!.createGain();
      osc.type = "sine";
      osc.frequency.value = freq * mult;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(level, t + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + decay);
      osc.connect(gain).connect(ctx!.destination);
      osc.start(t);
      osc.stop(t + decay + 0.05);
    }
  });
}
