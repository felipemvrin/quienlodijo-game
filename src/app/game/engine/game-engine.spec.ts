import { describe, expect, it } from 'vitest';
import { GameEngine } from './game-engine';
import { GameStatus } from '../models/game.model';
import type { PlayerSetup } from '../models/player.model';
import type { Question } from '../models/question.model';

const QUESTIONS: Question[] = [
  {
    id: 'q1',
    quote: 'Frase 1',
    correctAnswer: 'jesus',
    explanation: 'Explicación 1',
    difficulty: 'easy',
  },
  {
    id: 'q2',
    quote: 'Frase 2',
    correctAnswer: 'marx',
    explanation: 'Explicación 2',
    difficulty: 'easy',
  },
  {
    id: 'q3',
    quote: 'Frase 3',
    correctAnswer: 'jesus',
    explanation: 'Explicación 3',
    difficulty: 'medium',
  },
  {
    id: 'q4',
    quote: 'Frase 4',
    correctAnswer: 'marx',
    explanation: 'Explicación 4',
    difficulty: 'hard',
  },
];

function players(count: number): PlayerSetup[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `p${index + 1}`,
    name: `Jugador ${index + 1}`,
    avatarId: 'avatar-1',
  }));
}

function createEngine(playerCount = 2, totalRounds = 2): GameEngine {
  return new GameEngine({
    players: players(playerCount),
    questions: QUESTIONS,
    totalRounds,
    // Aleatoriedad determinista: mantiene el orden original de las frases.
    random: () => 0,
  });
}

describe('GameEngine', () => {
  it('puede comenzar con 2 jugadores', () => {
    const state = createEngine(2).start();

    expect(state.players).toHaveLength(2);
    expect(state.status).toBe(GameStatus.Playing);
    expect(state.currentQuestion).toBeDefined();
  });

  it('puede comenzar con hasta 6 jugadores', () => {
    const state = createEngine(6).start();

    expect(state.players).toHaveLength(6);
    expect(state.status).toBe(GameStatus.Playing);
  });

  it('rechaza partidas con menos de 2 o más de 6 jugadores', () => {
    expect(() => createEngine(1)).toThrow();
    expect(() => createEngine(7)).toThrow();
  });

  it('suma puntos cuando la respuesta es correcta', () => {
    const engine = createEngine();
    const question = engine.start().currentQuestion!;

    const result = engine.submitAnswer(question.correctAnswer, 0);

    expect(result.correct).toBe(true);
    expect(result.pointsAwarded).toBeGreaterThan(0);
    expect(result.totalScore).toBe(result.pointsAwarded);
    expect(engine.getState().status).toBe(GameStatus.Revealing);
  });

  it('no suma puntos cuando la respuesta es incorrecta', () => {
    const engine = createEngine();
    engine.start();

    const result = engine.submitAnswer('personaje-inexistente');

    expect(result.correct).toBe(false);
    expect(result.pointsAwarded).toBe(0);
    expect(result.totalScore).toBe(0);
  });

  it('trata el tiempo agotado como fallo sin respuesta', () => {
    const engine = createEngine();
    engine.start();

    const result = engine.timeout(15_000);

    expect(result.correct).toBe(false);
    expect(result.answer.choice).toBeNull();
    expect(result.pointsAwarded).toBe(0);
    expect(engine.getState().status).toBe(GameStatus.Revealing);
  });

  it('devuelve la explicación de la frase al revelar', () => {
    const engine = createEngine();
    const question = engine.start().currentQuestion!;

    const result = engine.submitAnswer(question.correctAnswer);

    expect(result.explanation).toBe(question.explanation);
    expect(result.correctAnswer).toBe(question.correctAnswer);
  });

  it('cambia el turno correctamente y reparte una frase nueva', () => {
    const engine = createEngine();
    const first = engine.start();
    engine.submitAnswer('jesus');

    const second = engine.nextTurn();

    expect(second.currentPlayerIndex).toBe(1);
    expect(second.status).toBe(GameStatus.Playing);
    expect(second.currentQuestion?.id).not.toBe(first.currentQuestion?.id);
  });

  it('finaliza la partida al completar las rondas y anuncia al ganador', () => {
    const engine = createEngine(2, 2);
    engine.start();

    // Ronda 1: el jugador 1 acierta, el jugador 2 falla.
    engine.submitAnswer(engine.getState().currentQuestion!.correctAnswer);
    engine.nextTurn();
    engine.submitAnswer('respuesta-erronea');
    engine.nextTurn();
    // Ronda 2.
    engine.submitAnswer('respuesta-erronea');
    engine.nextTurn();
    engine.submitAnswer('respuesta-erronea');
    const finalState = engine.nextTurn();

    expect(finalState.status).toBe(GameStatus.Finished);
    expect(engine.winners().map((player) => player.id)).toEqual(['p1']);
  });

  it('no permite responder si no hay frase activa', () => {
    const engine = createEngine();

    expect(() => engine.submitAnswer('jesus')).toThrow();
  });
});
