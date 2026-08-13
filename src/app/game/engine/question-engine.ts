import type { Question } from '../models/question.model';
import { defaultRandom, shuffle, type RandomFn } from './random';

/** Entrega frases sin repetición dentro de una misma partida. */
export class QuestionEngine {
  private readonly pool: readonly Question[];
  private queue: Question[];

  constructor(
    questions: readonly Question[],
    private readonly random: RandomFn = defaultRandom,
  ) {
    if (questions.length === 0) {
      throw new Error('QuestionEngine necesita al menos una frase.');
    }
    this.pool = [...questions];
    this.queue = shuffle(this.pool, this.random);
  }

  get remaining(): number {
    return this.queue.length;
  }

  get isEmpty(): boolean {
    return this.queue.length === 0;
  }

  /** Siguiente frase, o `null` si se agotaron. */
  next(): Question | null {
    return this.queue.shift() ?? null;
  }

  reset(): void {
    this.queue = shuffle(this.pool, this.random);
  }
}
