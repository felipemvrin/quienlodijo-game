import { Injectable, computed, inject, signal } from '@angular/core';
import { QUESTION_REPOSITORY } from '../../core/repositories/repository.tokens';
import { GameEngine } from '../engine/game-engine';
import type { AnswerResult } from '../models/answer.model';
import type { Avatar } from '../models/avatar.model';
import type { Character, CharacterId } from '../models/character.model';
import { GameStatus, type Game, type ScoreEntry } from '../models/game.model';
import type { Player, PlayerSetup } from '../models/player.model';

/**
 * Puente entre el Game Engine (TypeScript puro) y la UI (signals de Angular).
 *
 * Distingue explícitamente:
 * - **Game State**: lo que decide el motor (turno, frase, puntuación).
 * - **UI State**: lo que sólo afecta a la presentación (carga, catálogo, resultado visible).
 */
@Injectable({ providedIn: 'root' })
export class GameStateService {
  private readonly questionRepository = inject(QUESTION_REPOSITORY);
  private engine: GameEngine | null = null;

  // ---- Game State ----
  private readonly gameState = signal<Game | null>(null);
  private readonly answerResult = signal<AnswerResult | null>(null);

  readonly game = this.gameState.asReadonly();
  readonly lastResult = this.answerResult.asReadonly();
  readonly status = computed<GameStatus>(() => this.gameState()?.status ?? GameStatus.Idle);
  readonly players = computed<readonly Player[]>(() => this.gameState()?.players ?? []);
  readonly currentQuestion = computed(() => this.gameState()?.currentQuestion);
  readonly currentPlayer = computed<Player | undefined>(() => {
    const state = this.gameState();
    return state?.players[state.currentPlayerIndex];
  });
  readonly round = computed(() => this.gameState()?.round ?? 0);
  readonly ranking = computed<readonly ScoreEntry[]>(() => {
    // Depende de `gameState` para recalcularse en cada jugada.
    this.gameState();
    return this.engine?.ranking() ?? [];
  });
  readonly winners = computed<readonly Player[]>(() =>
    this.status() === GameStatus.Finished ? (this.engine?.winners() ?? []) : [],
  );
  readonly hasActiveGame = computed(() => this.gameState() !== null);

  // ---- UI State ----
  private readonly catalogLoading = signal(false);
  private readonly charactersState = signal<readonly Character[]>([]);
  private readonly avatarsState = signal<readonly Avatar[]>([]);

  readonly loading = this.catalogLoading.asReadonly();
  readonly characters = this.charactersState.asReadonly();
  readonly avatars = this.avatarsState.asReadonly();

  /** Carga el catálogo de personajes y avatares para las pantallas de creación. */
  async loadCatalog(): Promise<void> {
    if (this.charactersState().length > 0) {
      return;
    }
    this.catalogLoading.set(true);
    try {
      const [characters, avatars] = await Promise.all([
        this.questionRepository.getCharacters(),
        this.questionRepository.getAvatars(),
      ]);
      this.charactersState.set(characters);
      this.avatarsState.set(avatars);
    } finally {
      this.catalogLoading.set(false);
    }
  }

  /** Crea el motor con los jugadores dados y reparte la primera frase. */
  async startGame(players: readonly PlayerSetup[], totalRounds?: number): Promise<void> {
    const questions = await this.questionRepository.getQuestions();
    this.engine = new GameEngine({ players, questions, totalRounds });
    this.answerResult.set(null);
    this.gameState.set(this.engine.start());
  }

  answer(choice: CharacterId | null, elapsedMs = 0): AnswerResult {
    const engine = this.requireEngine();
    const result = engine.submitAnswer(choice, elapsedMs);
    this.answerResult.set(result);
    this.gameState.set(engine.getState());
    return result;
  }

  /** El jugador no respondió a tiempo. */
  timeout(elapsedMs = 0): AnswerResult {
    return this.answer(null, elapsedMs);
  }

  nextTurn(): void {
    const engine = this.requireEngine();
    this.answerResult.set(null);
    this.gameState.set(engine.nextTurn());
  }

  reset(): void {
    this.engine = null;
    this.gameState.set(null);
    this.answerResult.set(null);
  }

  private requireEngine(): GameEngine {
    if (!this.engine) {
      throw new Error('No hay una partida en curso.');
    }
    return this.engine;
  }
}
