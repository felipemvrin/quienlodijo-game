import type { PlayerId } from '../models/player.model';
import type { ScoreEntry } from '../models/game.model';

export interface ScoreRules {
  /** Puntos base por acierto. */
  readonly pointsPerCorrect: number;
  /** Puntos extra máximos por rapidez (0 desactiva el bonus). */
  readonly maxSpeedBonus: number;
  /** Ventana de tiempo, en ms, dentro de la cual se reparte el bonus. */
  readonly speedWindowMs: number;
}

export const DEFAULT_SCORE_RULES: ScoreRules = {
  pointsPerCorrect: 100,
  maxSpeedBonus: 50,
  speedWindowMs: 10_000,
};

/** Lleva la puntuación de la partida. Una respuesta incorrecta nunca resta ni suma. */
export class ScoreManager {
  private readonly scores = new Map<PlayerId, number>();

  constructor(
    playerIds: readonly PlayerId[],
    private readonly rules: ScoreRules = DEFAULT_SCORE_RULES,
  ) {
    playerIds.forEach((id) => this.scores.set(id, 0));
  }

  scoreOf(playerId: PlayerId): number {
    return this.scores.get(playerId) ?? 0;
  }

  /** Calcula los puntos de una respuesta sin aplicarlos. */
  pointsFor(correct: boolean, elapsedMs: number): number {
    if (!correct) {
      return 0;
    }
    const { pointsPerCorrect, maxSpeedBonus, speedWindowMs } = this.rules;
    if (maxSpeedBonus <= 0 || speedWindowMs <= 0) {
      return pointsPerCorrect;
    }
    const remaining = Math.max(0, speedWindowMs - Math.max(0, elapsedMs));
    return pointsPerCorrect + Math.round((remaining / speedWindowMs) * maxSpeedBonus);
  }

  /** Aplica los puntos de una respuesta y devuelve el total del jugador. */
  award(playerId: PlayerId, points: number): number {
    const total = this.scoreOf(playerId) + Math.max(0, points);
    this.scores.set(playerId, total);
    return total;
  }

  /** Clasificación ordenada de mayor a menor; los empates comparten posición. */
  ranking(): ScoreEntry[] {
    const sorted = [...this.scores.entries()].sort(([, a], [, b]) => b - a);
    let position = 0;
    let previousScore: number | null = null;
    return sorted.map(([playerId, score], index) => {
      if (score !== previousScore) {
        position = index + 1;
        previousScore = score;
      }
      return { playerId, score, position };
    });
  }

  /** Jugadores con la puntuación más alta (puede haber empate). */
  winners(): PlayerId[] {
    return this.ranking()
      .filter((entry) => entry.position === 1)
      .map((entry) => entry.playerId);
  }

  reset(): void {
    this.scores.forEach((_, id) => this.scores.set(id, 0));
  }
}
