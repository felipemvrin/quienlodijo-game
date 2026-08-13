import type { Player, PlayerId, PlayerSetup } from '../../game/models/player.model';

/** Persistencia de los jugadores de la sesión (local hoy, remota en el futuro). */
export interface PlayerRepository {
  savePlayers(players: readonly PlayerSetup[]): Promise<void>;
  getPlayers(): Promise<readonly Player[]>;
  removePlayer(playerId: PlayerId): Promise<void>;
}
