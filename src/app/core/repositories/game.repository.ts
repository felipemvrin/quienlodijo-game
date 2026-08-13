import type { Game, GameId } from '../../game/models/game.model';

/**
 * Persistencia de la partida. El motor nunca habla con la red directamente:
 * así se podrá cambiar `LocalGameRepository` por `SupabaseGameRepository`
 * (con Realtime para el modo online) sin tocar el Game Engine.
 */
export interface GameRepository {
  saveGame(game: Game): Promise<void>;
  getGame(gameId: GameId): Promise<Game | null>;
  clear(): Promise<void>;
}
