import type { Player, PlayerId } from './player.model';
import type { Question } from './question.model';

export type GameId = string;

export enum GameStatus {
  /** Aún no se ha creado la partida. */
  Idle = 'idle',
  /** Partida creada: jugadores eligiendo avatar. */
  Lobby = 'lobby',
  /** Frase en pantalla, esperando respuesta. */
  Playing = 'playing',
  /** Mostrando respuesta correcta y explicación. */
  Revealing = 'revealing',
  Finished = 'finished',
}

export interface Game {
  readonly id: GameId;
  readonly players: readonly Player[];
  readonly currentPlayerIndex: number;
  readonly currentQuestion?: Question;
  readonly status: GameStatus;
  /** Ronda actual, 1-indexada. Aumenta cuando todos los jugadores han jugado. */
  readonly round: number;
  readonly totalRounds: number;
}

export interface ScoreEntry {
  readonly playerId: PlayerId;
  readonly score: number;
  readonly position: number;
}

export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 6;
