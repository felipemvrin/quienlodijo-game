import { SpeechService } from './speech.service';

const howler = vi.hoisted(() => ({
  constructor: vi.fn(),
  play: vi.fn(),
  stop: vi.fn(),
  unload: vi.fn(),
}));

vi.mock('howler', () => ({
  Howl: class {
    readonly play = howler.play;
    readonly stop = howler.stop;
    readonly unload = howler.unload;

    constructor(options: unknown) {
      howler.constructor(options);
    }
  },
}));

class UtteranceStub {
  lang = '';
  rate = 1;
  pitch = 1;
  voice: SpeechSynthesisVoice | null = null;

  constructor(readonly text: string) {}
}

describe('SpeechService', () => {
  const spanishVoice = { lang: 'es-ES', name: 'Spanish voice' } as SpeechSynthesisVoice;
  const latinVoice = { lang: 'es-MX', name: 'Latin voice' } as SpeechSynthesisVoice;
  const englishVoice = { lang: 'en-US', name: 'English voice' } as SpeechSynthesisVoice;
  let cancel: ReturnType<typeof vi.fn>;
  let speak: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    cancel = vi.fn();
    speak = vi.fn();
    vi.stubGlobal('SpeechSynthesisUtterance', UtteranceStub);
    vi.stubGlobal('speechSynthesis', {
      cancel,
      speak,
      getVoices: () => [englishVoice, latinVoice, spanishVoice],
    });
  });

  afterEach(() => vi.unstubAllGlobals());

  it('reproduce el audio neuronal asociado a la frase', () => {
    const service = new SpeechService();

    service.speak('Primera frase', 'assets/audio/quotes/q-1.mp3');

    expect(howler.constructor).toHaveBeenCalledWith(
      expect.objectContaining({
        src: ['assets/audio/quotes/q-1.mp3'],
        html5: true,
        preload: true,
      }),
    );
    expect(howler.play).toHaveBeenCalledOnce();
    expect(speak).not.toHaveBeenCalled();
  });

  it('lee únicamente el texto con una voz española estable', () => {
    const service = new SpeechService();

    service.speak('Primera frase');
    vi.stubGlobal('speechSynthesis', {
      cancel,
      speak,
      getVoices: () => [latinVoice],
    });
    service.speak('Segunda frase');

    expect(cancel).toHaveBeenCalledTimes(2);
    expect(speak).toHaveBeenCalledTimes(2);
    expect(speak.mock.calls.map(([utterance]) => utterance.text)).toEqual([
      'Primera frase',
      'Segunda frase',
    ]);
    expect(speak.mock.calls.map(([utterance]) => utterance.voice)).toEqual([
      spanishVoice,
      spanishVoice,
    ]);
    expect(speak.mock.calls[0][0]).toMatchObject({ lang: 'es-ES', rate: 0.9, pitch: 1 });
  });

  it('cancela la lectura activa al silenciarse', () => {
    const service = new SpeechService();

    service.setMuted(true);
    service.speak('No debe leerse');

    expect(cancel).toHaveBeenCalledOnce();
    expect(speak).not.toHaveBeenCalled();
  });
});
