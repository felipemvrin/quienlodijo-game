import { describe, expect, it } from 'vitest';
import { TurnManager } from './turn-manager';

describe('TurnManager', () => {
  it('empieza en el primer jugador y en la ronda 1', () => {
    const turns = new TurnManager(3);

    expect(turns.currentIndex).toBe(0);
    expect(turns.round).toBe(1);
  });

  it('avanza de jugador en jugador', () => {
    const turns = new TurnManager(3);

    expect(turns.next()).toBe(1);
    expect(turns.next()).toBe(2);
  });

  it('incrementa la ronda al completar la vuelta', () => {
    const turns = new TurnManager(2);

    turns.next();
    expect(turns.round).toBe(1);

    turns.next();
    expect(turns.currentIndex).toBe(0);
    expect(turns.round).toBe(2);
  });

  it('reinicia turno y ronda', () => {
    const turns = new TurnManager(2);
    turns.next();
    turns.next();

    turns.reset();

    expect(turns.currentIndex).toBe(0);
    expect(turns.round).toBe(1);
  });
});
