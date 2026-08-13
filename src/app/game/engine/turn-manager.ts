/**
 * Gestiona de quién es el turno y en qué ronda está la partida.
 * Sin dependencias de Angular: lógica pura y testeable.
 */
export class TurnManager {
  private index = 0;
  private currentRound = 1;

  constructor(private readonly playerCount: number) {
    if (playerCount < 1) {
      throw new Error('TurnManager requiere al menos un jugador.');
    }
  }

  get currentIndex(): number {
    return this.index;
  }

  get round(): number {
    return this.currentRound;
  }

  /** Avanza al siguiente jugador; al completar la vuelta incrementa la ronda. */
  next(): number {
    this.index = (this.index + 1) % this.playerCount;
    if (this.index === 0) {
      this.currentRound++;
    }
    return this.index;
  }

  /** `true` si el jugador actual es el último de la ronda. */
  isLastOfRound(): boolean {
    return this.index === this.playerCount - 1;
  }

  reset(): void {
    this.index = 0;
    this.currentRound = 1;
  }
}
