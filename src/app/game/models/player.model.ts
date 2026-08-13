import type { AvatarId } from './avatar.model';

export type PlayerId = string;

export interface Player {
  readonly id: PlayerId;
  readonly name: string;
  readonly avatarId: AvatarId;
  readonly score: number;
}

/** Datos mínimos necesarios para incorporar un jugador a una partida. */
export type PlayerSetup = Omit<Player, 'score'>;
