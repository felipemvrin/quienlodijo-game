import { Injectable } from '@angular/core';

const SPANISH_LOCALE = 'es-ES';

/** Narración de frases mediante la Web Speech API del navegador. */
@Injectable({ providedIn: 'root' })
export class SpeechService {
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private muted = false;

  speak(text: string): void {
    const synthesis = this.synthesis();
    if (!synthesis || this.muted || typeof SpeechSynthesisUtterance === 'undefined') {
      return;
    }

    synthesis.cancel();

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

  stop(): void {
    this.synthesis()?.cancel();
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (muted) {
      this.stop();
    }
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
