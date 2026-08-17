import { Injectable } from '@angular/core';
import { Howl } from 'howler';

const SPANISH_LOCALE = 'es-ES';

/** Narración de frases mediante la Web Speech API del navegador. */
@Injectable({ providedIn: 'root' })
export class SpeechService {
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private currentAudio: Howl | null = null;
  private muted = false;

  speak(text: string, audioSrc?: string): void {
    if (this.muted) {
      return;
    }
    this.stop();

    if (audioSrc) {
      this.playRecorded(text, audioSrc);
      return;
    }

    this.speakSynthesized(text);
  }

  stop(): void {
    this.currentAudio?.stop();
    this.currentAudio?.unload();
    this.currentAudio = null;
    this.synthesis()?.cancel();
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (muted) {
      this.stop();
    }
  }

  private playRecorded(text: string, audioSrc: string): void {
    const audio = new Howl({
      src: [audioSrc],
      html5: true,
      preload: true,
      onloaderror: () => this.fallbackToSynthesis(audio, text),
      onplayerror: () => this.fallbackToSynthesis(audio, text),
    });
    this.currentAudio = audio;
    audio.play();
  }

  private fallbackToSynthesis(audio: Howl, text: string): void {
    if (this.currentAudio !== audio || this.muted) {
      return;
    }
    audio.unload();
    this.currentAudio = null;
    this.speakSynthesized(text);
  }

  private speakSynthesized(text: string): void {
    const synthesis = this.synthesis();
    if (!synthesis || typeof SpeechSynthesisUtterance === 'undefined') {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = SPANISH_LOCALE;
    utterance.rate = 0.9;
    utterance.pitch = 1;

    const voice = this.resolveSpanishVoice(synthesis);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    }

    synthesis.speak(utterance);
  }

  private resolveSpanishVoice(synthesis: SpeechSynthesis): SpeechSynthesisVoice | null {
    if (this.selectedVoice) {
      return this.selectedVoice;
    }

    const voices = synthesis.getVoices().filter((voice) => voice.lang.toLowerCase().startsWith('es'));
    this.selectedVoice =
      voices.find((voice) => voice.lang.toLowerCase() === SPANISH_LOCALE.toLowerCase()) ??
      voices[0] ??
      null;
    return this.selectedVoice;
  }

  private synthesis(): SpeechSynthesis | null {
    return typeof speechSynthesis === 'undefined' ? null : speechSynthesis;
  }
}
