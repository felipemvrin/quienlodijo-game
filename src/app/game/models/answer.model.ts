import type { CharacterId } from './character.model';
import type { PlayerId } from './player.model';
import type { QuestionId } from './question.model';

/** Respuesta enviada por un jugador para una frase concreta. */
export interface Answer {
  readonly questionId: QuestionId;
  readonly playerId: PlayerId;
  readonly choice: CharacterId;
  /** Milisegundos transcurridos desde que se mostró la frase. */
  readonly elapsedMs: number;
}

/** Resultado calculado por el motor tras evaluar una respuesta. */
export interface AnswerResult {
  readonly answer: Answer;
  readonly correct: boolean;
  readonly correctAnswer: CharacterId;
  readonly explanation: string;
  readonly pointsAwarded: number;
  readonly totalScore: number;
}
