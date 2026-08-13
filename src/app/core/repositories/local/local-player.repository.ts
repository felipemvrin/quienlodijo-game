import { Injectable } from '@angular/core';
import type { Player, PlayerId, PlayerSetup } from '../../../game/models/player.model';
import type { PlayerRepository } from '../player.repository';

/** Guarda los jugadores en memoria: suficiente para el modo local por turnos. */
@Injectable({ providedIn: 'root' })
export class LocalPlayerRepository implements PlayerRepository {
  private players: Player[] = [];

  async savePlayers(players: readonly PlayerSetup[]): Promise<void> {
    this.players = players.map((player) => ({ ...player, score: 0 }));
  }

  async getPlayers(): Promise<readonly Player[]> {
    return [...this.players];
  }

  async removePlayer(playerId: PlayerId): Promise<void> {
    this.players = this.players.filter((player) => player.id !== playerId);
  }
}
