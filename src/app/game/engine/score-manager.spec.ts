import { describe, expect, it } from 'vitest';
import { DEFAULT_SCORE_RULES, ScoreManager } from './score-manager';

describe('ScoreManager', () => {
  it('todos los jugadores empiezan con 0 puntos', () => {
    const scores = new ScoreManager(['p1', 'p2']);

    expect(scores.scoreOf('p1')).toBe(0);
    expect(scores.scoreOf('p2')).toBe(0);
  });

  it('una respuesta correcta aumenta la puntuación', () => {
    const scores = new ScoreManager(['p1']);

    const points = scores.pointsFor(true, DEFAULT_SCORE_RULES.speedWindowMs);
    scores.award('p1', points);

    expect(points).toBe(DEFAULT_SCORE_RULES.pointsPerCorrect);
    expect(scores.scoreOf('p1')).toBe(DEFAULT_SCORE_RULES.pointsPerCorrect);
  });

  it('una respuesta incorrecta no suma', () => {
    const scores = new ScoreManager(['p1']);

    scores.award('p1', scores.pointsFor(false, 0));

    expect(scores.scoreOf('p1')).toBe(0);
  });

  it('otorga bonus por rapidez', () => {
    const scores = new ScoreManager(['p1']);

    const fast = scores.pointsFor(true, 0);
    const slow = scores.pointsFor(true, DEFAULT_SCORE_RULES.speedWindowMs);

    expect(fast).toBe(DEFAULT_SCORE_RULES.pointsPerCorrect + DEFAULT_SCORE_RULES.maxSpeedBonus);
    expect(fast).toBeGreaterThan(slow);
  });

  it('ordena la clasificación y comparte posición en caso de empate', () => {
    const scores = new ScoreManager(['p1', 'p2', 'p3']);
    scores.award('p1', 100);
    scores.award('p2', 100);
    scores.award('p3', 50);

    const ranking = scores.ranking();

    expect(ranking.map((entry) => entry.position)).toEqual([1, 1, 3]);
    expect(scores.winners()).toEqual(['p1', 'p2']);
  });
});
