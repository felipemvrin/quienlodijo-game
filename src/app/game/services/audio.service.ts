import { Injectable, signal } from '@angular/core';
import { Howl, Howler } from 'howler';

/** Claves lógicas de sonido: la UI nunca referencia rutas de archivo. */
export type SoundKey =
  | 'music.menu'
  | 'music.game'
  | 'sfx.button'
  | 'sfx.countdown'
  | 'sfx.correct'
  | 'sfx.incorrect'
  | 'sfx.reveal'
  | 'sfx.victory';

interface SoundDefinition {
  readonly src: string;
  readonly loop?: boolean;
  readonly volume?: number;
}

/**
 * Manifiesto de audio. Los archivos son placeholders: hay que sustituirlos por
 * pistas propias o con licencia libre (ver `src/assets/audio/README.md`).
 */
const SOUND_MANIFEST: Record<SoundKey, SoundDefinition> = {
  'music.menu': { src: 'assets/audio/music/menu.mp3', loop: true, volume: 0.4 },
  'music.game': { src: 'assets/audio/music/game.mp3', loop: true, volume: 0.35 },
  'sfx.button': { src: 'assets/audio/sfx/button.mp3' },
  'sfx.countdown': { src: 'assets/audio/sfx/countdown.mp3' },
  'sfx.correct': { src: 'assets/audio/sfx/correct.mp3' },
  'sfx.incorrect': { src: 'assets/audio/sfx/incorrect.mp3' },
  'sfx.reveal': { src: 'assets/audio/sfx/reveal.mp3' },
  'sfx.victory': { src: 'assets/audio/sfx/victory.mp3' },
};

/**
 * Abstracción sobre Howler.js.
 *
 * Tolerante a fallos por diseño: si un archivo todavía no existe (placeholders),
 * el sonido se marca como no disponible y el juego sigue funcionando.
 */
@Injectable({ providedIn: 'root' })
export class AudioService {
  private readonly sounds = new Map<SoundKey, Howl>();
  private readonly unavailable = new Set<SoundKey>();
  private currentMusic: SoundKey | null = null;

  private readonly mutedState = signal(false);
  readonly muted = this.mutedState.asReadonly();

  play(key: SoundKey): void {
    if (this.mutedState()) {
      return;
    }
    this.resolve(key)?.play();
  }

  /** Reproduce una pista de fondo deteniendo la anterior. */
  playMusic(key: SoundKey): void {
    if (this.currentMusic === key) {
      return;
    }
    this.stopMusic();
    this.currentMusic = key;
    if (!this.mutedState()) {
      this.resolve(key)?.play();
    }
  }

  stopMusic(): void {
    if (this.currentMusic) {
      this.sounds.get(this.currentMusic)?.stop();
      this.currentMusic = null;
    }
  }

  toggleMute(): void {
    this.setMuted(!this.mutedState());
  }

  setMuted(muted: boolean): void {
    this.mutedState.set(muted);
    Howler.mute(muted);
  }

  /** Precarga sonidos concretos, por ejemplo al entrar a la pantalla de juego. */
  preload(keys: readonly SoundKey[]): void {
    keys.forEach((key) => this.resolve(key));
  }

  private resolve(key: SoundKey): Howl | null {
    if (this.unavailable.has(key)) {
      return null;
    }
    const existing = this.sounds.get(key);
    if (existing) {
      return existing;
    }

    const definition = SOUND_MANIFEST[key];
    const howl = new Howl({
      src: [definition.src],
      loop: definition.loop ?? false,
      volume: definition.volume ?? 0.8,
      html5: definition.loop ?? false,
      preload: true,
    });
    howl.once('loaderror', () => {
      this.unavailable.add(key);
      this.sounds.delete(key);
    });

    this.sounds.set(key, howl);
    return howl;
  }
}
