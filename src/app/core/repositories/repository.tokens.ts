import { InjectionToken } from '@angular/core';
import type { GameRepository } from './game.repository';
import type { PlayerRepository } from './player.repository';
import type { QuestionRepository } from './question.repository';

export const QUESTION_REPOSITORY = new InjectionToken<QuestionRepository>('QUESTION_REPOSITORY');
export const PLAYER_REPOSITORY = new InjectionToken<PlayerRepository>('PLAYER_REPOSITORY');
export const GAME_REPOSITORY = new InjectionToken<GameRepository>('GAME_REPOSITORY');
