import { describe, expect, it } from 'vitest';
import { QuestionEngine } from './question-engine';
import type { Question } from '../models/question.model';

const questions: Question[] = ['q1', 'q2', 'q3'].map((id) => ({
  id,
  quote: `Frase ${id}`,
  correctAnswer: 'jesus',
  explanation: 'Explicación',
  difficulty: 'easy',
}));

describe('QuestionEngine', () => {
  it('exige al menos una frase', () => {
    expect(() => new QuestionEngine([])).toThrow();
  });

  it('no repite frases dentro de la partida', () => {
    const engine = new QuestionEngine(questions, () => 0);

    const served = [engine.next(), engine.next(), engine.next()];

    expect(new Set(served.map((question) => question?.id)).size).toBe(3);
    expect(engine.isEmpty).toBe(true);
  });

  it('devuelve null cuando se agotan las frases', () => {
    const engine = new QuestionEngine(questions, () => 0);
    questions.forEach(() => engine.next());

    expect(engine.next()).toBeNull();
  });

  it('vuelve a llenar la baraja al reiniciar', () => {
    const engine = new QuestionEngine(questions, () => 0);
    questions.forEach(() => engine.next());

    engine.reset();

    expect(engine.remaining).toBe(questions.length);
  });
});
