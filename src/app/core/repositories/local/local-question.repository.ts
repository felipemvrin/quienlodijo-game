import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import type { Avatar } from '../../../game/models/avatar.model';
import type { Character } from '../../../game/models/character.model';
import type { Question } from '../../../game/models/question.model';
import type { QuestionRepository } from '../question.repository';

const DATA_PATH = 'assets/data';

/** Lee el catálogo desde los JSON estáticos del bundle. Sin red, sin backend. */
@Injectable({ providedIn: 'root' })
export class LocalQuestionRepository implements QuestionRepository {
  private readonly http = inject(HttpClient);
  private readonly cache = new Map<string, Promise<unknown>>();

  getQuestions(): Promise<readonly Question[]> {
    return this.load<Question>('questions');
  }

  getCharacters(): Promise<readonly Character[]> {
    return this.load<Character>('characters');
  }

  getAvatars(): Promise<readonly Avatar[]> {
    return this.load<Avatar>('avatars');
  }

  private load<T>(name: string): Promise<readonly T[]> {
    const cached = this.cache.get(name) as Promise<readonly T[]> | undefined;
    if (cached) {
      return cached;
    }
    const request = firstValueFrom(this.http.get<T[]>(`${DATA_PATH}/${name}.json`));
    // Si la carga falla, se descarta del caché para permitir un reintento posterior.
    request.catch(() => this.cache.delete(name));
    this.cache.set(name, request);
    return request;
  }
}
