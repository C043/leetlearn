import { unlockAudio } from "./chime";

interface Note {
  freq: number;
  /** Seconds after the sound starts. */
  at: number;
  /** Seconds until the note has faded out. */
  length: number;
  level: number;
  type: OscillatorType;
  /** Run through a lowpass that opens on the attack, for a brassy "blat". */
  brass?: boolean;
}

/** Duolingo-style feedback sounds, synthesized on the chime's shared AudioContext. */
function play(notes: Note[]) {
  const ctx = unlockAudio();
  if (!ctx) return;
  const start = ctx.currentTime + 0.02;

  for (const note of notes) {
    const t = start + note.at;
    const end = t + note.length;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = note.type;
    osc.frequency.value = note.freq;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(note.level, t + 0.015);
    if (note.brass) gain.gain.linearRampToValueAtTime(note.level * 0.75, t + note.length * 0.6);
    gain.gain.exponentialRampToValueAtTime(0.0001, end);

    if (note.brass) {
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.Q.value = 1;
      filter.frequency.setValueAtTime(note.freq * 1.5, t);
      filter.frequency.linearRampToValueAtTime(note.freq * 6, t + 0.05);
      filter.frequency.exponentialRampToValueAtTime(note.freq * 3, end);
      osc.connect(filter).connect(gain).connect(ctx.destination);
    } else {
      osc.connect(gain).connect(ctx.destination);
    }
    osc.start(t);
    osc.stop(end + 0.05);
  }
}

/** Two quick rising bell notes (C6, E6), each with a quiet octave overtone. */
export function playCorrect() {
  play(
    [
      { freq: 1046.5, at: 0, length: 0.2 },
      { freq: 1318.51, at: 0.09, length: 0.5 },
    ].flatMap((n) => [
      { ...n, level: 0.22, type: "sine" as const },
      { ...n, freq: n.freq * 2, level: 0.05, type: "sine" as const },
    ]),
  );
}

/** A soft, low falling "bwomp" (A3 to F3). */
export function playWrong() {
  play(
    [
      { freq: 220, at: 0, length: 0.2 },
      { freq: 174.61, at: 0.13, length: 0.4 },
    ].flatMap((n) => [
      { ...n, level: 0.25, type: "triangle" as const },
      { ...n, freq: n.freq / 2, level: 0.12, type: "sine" as const },
    ]),
  );
}

/** Trumpet fanfare: a rising C-major call (G4 C5 E5 G5, E5) landing on a held C chord. */
export function playFanfare() {
  const melody: [number, number, number][] = [
    [392.0, 0, 0.14],
    [523.25, 0.12, 0.14],
    [659.25, 0.24, 0.14],
    [783.99, 0.36, 0.3],
    [659.25, 0.62, 0.14],
  ];
  const chord = [523.25, 659.25, 783.99, 1046.5];
  play([
    ...melody.map(([freq, at, length]) => ({ freq, at, length, level: 0.13, type: "sawtooth" as const, brass: true })),
    ...chord.map((freq) => ({ freq, at: 0.76, length: 1.5, level: 0.07, type: "sawtooth" as const, brass: true })),
  ]);
}
