import type { CharacterId } from './character.model';

export type QuestionId = string;

export type Difficulty = 'easy' | 'medium' | 'hard';

/** Una frase atribuible a uno de los personajes del juego. */
export interface Question {
  readonly id: QuestionId;
  readonly quote: string;
  readonly correctAnswer: CharacterId;
  /** Contexto breve que se muestra tras revelar la respuesta. */
  readonly explanation: string;
  /** Obra, capítulo o versículo de referencia. Nunca inventar citas. */
  readonly source?: string;
  readonly year?: number;
  readonly difficulty: Difficulty;
}
