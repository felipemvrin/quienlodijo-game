import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { GameStateService } from '../../game/services/game-state.service';

/** Impide entrar al tablero o al marcador sin una partida en curso. */
export const partidaActivaGuard: CanActivateFn = () => {
  const game = inject(GameStateService);
  const router = inject(Router);
  return game.hasActiveGame() ? true : router.createUrlTree(['/partida/nueva']);
};
