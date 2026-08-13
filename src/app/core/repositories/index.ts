import type { Provider } from '@angular/core';
import { LocalGameRepository } from './local/local-game.repository';
import { LocalPlayerRepository } from './local/local-player.repository';
import { LocalQuestionRepository } from './local/local-question.repository';
import { GAME_REPOSITORY, PLAYER_REPOSITORY, QUESTION_REPOSITORY } from './repository.tokens';

/**
 * Implementación local por defecto. Para activar Supabase en el futuro bastará
 * con proveer las clases `Supabase*Repository` en estos mismos tokens.
 */
export const localRepositoryProviders: Provider[] = [
  { provide: QUESTION_REPOSITORY, useExisting: LocalQuestionRepository },
  { provide: PLAYER_REPOSITORY, useExisting: LocalPlayerRepository },
  { provide: GAME_REPOSITORY, useExisting: LocalGameRepository },
];

export * from './game.repository';
export * from './player.repository';
export * from './question.repository';
export * from './repository.tokens';
