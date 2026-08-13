import { Injectable } from '@angular/core';
import type { Game, GameId } from '../../../game/models/game.model';
import type { GameRepository } from '../game.repository';

/** Persistencia en memoria de la partida en curso. */
@Injectable({ providedIn: 'root' })
export class LocalGameRepository implements GameRepository {
  private readonly games = new Map<GameId, Game>();

  async saveGame(game: Game): Promise<void> {
    this.games.set(game.id, game);
  }

  async getGame(gameId: GameId): Promise<Game | null> {
    return this.games.get(gameId) ?? null;
  }

  async clear(): Promise<void> {
    this.games.clear();
  }
}
