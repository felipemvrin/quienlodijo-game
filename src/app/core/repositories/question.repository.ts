import type { Avatar } from '../../game/models/avatar.model';
import type { Character } from '../../game/models/character.model';
import type { Question } from '../../game/models/question.model';

/**
 * Origen de datos del catálogo de contenido.
 * Implementaciones previstas: `LocalQuestionRepository` (JSON en assets) y,
 * más adelante, `SupabaseQuestionRepository` (PostgreSQL).
 */
export interface QuestionRepository {
  getQuestions(): Promise<readonly Question[]>;
  getCharacters(): Promise<readonly Character[]>;
  getAvatars(): Promise<readonly Avatar[]>;
}
