/**
 * Efectos de sonido generados con Web Audio.
 *
 * Sirven de sustituto libre de derechos mientras no existan los archivos de
 * `assets/audio/sfx/`: si un archivo está presente, `AudioService` lo prefiere.
 */
export type SyntheticSfx = 'button' | 'countdown' | 'correct' | 'incorrect' | 'reveal' | 'victory';

interface Note {
  readonly frequency: number;
  /** Inicio relativo, en segundos, desde el disparo del efecto. */
  readonly at: number;
  readonly duration: number;
  readonly type?: OscillatorType;
  readonly gain?: number;
}

const PATTERNS: Record<SyntheticSfx, readonly Note[]> = {
  button: [{ frequency: 660, at: 0, duration: 0.07, type: 'triangle' }],
  countdown: [{ frequency: 440, at: 0, duration: 0.12, type: 'square', gain: 0.12 }],
  correct: [
    { frequency: 523.25, at: 0, duration: 0.12 },
    { frequency: 659.25, at: 0.1, duration: 0.12 },
    { frequency: 783.99, at: 0.2, duration: 0.22 },
  ],
  incorrect: [
    { frequency: 233.08, at: 0, duration: 0.18, type: 'sawtooth', gain: 0.12 },
    { frequency: 174.61, at: 0.14, duration: 0.26, type: 'sawtooth', gain: 0.12 },
  ],
  reveal: [
    { frequency: 392, at: 0, duration: 0.1 },
    { frequency: 587.33, at: 0.08, duration: 0.18 },
  ],
  victory: [
    { frequency: 523.25, at: 0, duration: 0.14 },
    { frequency: 659.25, at: 0.13, duration: 0.14 },
    { frequency: 783.99, at: 0.26, duration: 0.14 },
    { frequency: 1046.5, at: 0.39, duration: 0.4 },
  ],
};

export class SyntheticSfxPlayer {
  private context: AudioContext | null = null;

  get available(): boolean {
    return typeof AudioContext !== 'undefined';
  }

  play(key: SyntheticSfx, volume = 0.18): void {
    const context = this.resolveContext();
    if (!context) {
      return;
    }
    // Los navegadores suspenden el contexto hasta la primera interacción del usuario.
    void context.resume();

    for (const note of PATTERNS[key]) {
      this.schedule(context, note, volume);
    }
  }

  private schedule(context: AudioContext, note: Note, volume: number): void {
    const start = context.currentTime + note.at;
    const end = start + note.duration;
    const peak = volume * (note.gain ? note.gain / 0.18 : 1);

    const oscillator = context.createOscillator();
    oscillator.type = note.type ?? 'sine';
    oscillator.frequency.setValueAtTime(note.frequency, start);

    const envelope = context.createGain();
    envelope.gain.setValueAtTime(0.0001, start);
    envelope.gain.exponentialRampToValueAtTime(peak, start + 0.01);
    envelope.gain.exponentialRampToValueAtTime(0.0001, end);

    oscillator.connect(envelope).connect(context.destination);
    oscillator.start(start);
    oscillator.stop(end + 0.02);
  }

  private resolveContext(): AudioContext | null {
    if (!this.available) {
      return null;
    }
    this.context ??= new AudioContext();
    return this.context;
  }
}
