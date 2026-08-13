import type { Answer, AnswerResult } from '../models/answer.model';
import type { CharacterId } from '../models/character.model';
import {
  GameStatus,
  MAX_PLAYERS,
  MIN_PLAYERS,
  type Game,
  type ScoreEntry,
} from '../models/game.model';
import type { Player, PlayerId, PlayerSetup } from '../models/player.model';
import type { Question } from '../models/question.model';
import { QuestionEngine } from './question-engine';
import { defaultRandom, type RandomFn } from './random';
import { DEFAULT_SCORE_RULES, ScoreManager, type ScoreRules } from './score-manager';
import { TurnManager } from './turn-manager';

export interface GameEngineConfig {
  readonly players: readonly PlayerSetup[];
  readonly questions: readonly Question[];
  /** Rondas completas a jugar (cada ronda = un turno por jugador). */
  readonly totalRounds?: number;
  readonly scoreRules?: ScoreRules;
  readonly random?: RandomFn;
  readonly gameId?: string;
}

/**
 * Motor de la partida: orquesta turnos, frases y puntuación.
 *
 * Es TypeScript puro (sin Angular, sin DOM) para poder testearlo de forma aislada
 * y reutilizarlo más adelante en un modo multijugador online.
 */
export class GameEngine {
  private readonly id: string;
  private readonly setups: readonly PlayerSetup[];
  private readonly totalRounds: number;
  private readonly turns: TurnManager;
  private readonly scores: ScoreManager;
  private readonly questions: QuestionEngine;

  private status: GameStatus = GameStatus.Lobby;
  private currentQuestion?: Question;
  private lastResult?: AnswerResult;

  constructor(config: GameEngineConfig) {
    const { players, questions } = config;

    if (players.length < MIN_PLAYERS || players.length > MAX_PLAYERS) {
      throw new Error(
        `La partida requiere entre ${MIN_PLAYERS} y ${MAX_PLAYERS} jugadores (recibidos: ${players.length}).`,
      );
    }
    if (new Set(players.map((player) => player.id)).size !== players.length) {
      throw new Error('Los identificadores de jugador deben ser únicos.');
    }

    const random = config.random ?? defaultRandom;
    this.id = config.gameId ?? `game-${Math.floor(random() * 1e9).toString(36)}`;
    this.setups = [...players];
    this.totalRounds =
      config.totalRounds ?? Math.max(1, Math.floor(questions.length / players.length));
    this.turns = new TurnManager(players.length);
    this.scores = new ScoreManager(
      players.map((player) => player.id),
      config.scoreRules ?? DEFAULT_SCORE_RULES,
    );
    this.questions = new QuestionEngine(questions, random);
  }

  /** Comienza la partida y reparte la primera frase. */
  start(): Game {
    this.status = GameStatus.Playing;
    this.currentQuestion = this.questions.next() ?? undefined;
    return this.getState();
  }

  /**
   * Evalúa la respuesta del jugador en turno y pasa a estado de revelación.
   * @param choice personaje elegido por el jugador
   * @param elapsedMs tiempo de reacción, usado para el bonus de rapidez
   */
  submitAnswer(choice: CharacterId | null, elapsedMs = 0): AnswerResult {
    if (this.status !== GameStatus.Playing || !this.currentQuestion) {
      throw new Error('No hay una frase activa para responder.');
    }

    const question = this.currentQuestion;
    const playerId = this.currentPlayerId();
    const correct = choice !== null && question.correctAnswer === choice;
    const points = this.scores.pointsFor(correct, elapsedMs);
    const totalScore = this.scores.award(playerId, points);

    const answer: Answer = { questionId: question.id, playerId, choice, elapsedMs };
    this.lastResult = {
      answer,
      correct,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      pointsAwarded: points,
      totalScore,
    };
    this.status = GameStatus.Revealing;
    return this.lastResult;
  }

  /** Se agotó el tiempo: cuenta como fallo y pasa a revelación. */
  timeout(elapsedMs = 0): AnswerResult {
    return this.submitAnswer(null, elapsedMs);
  }

  /** Pasa el turno al siguiente jugador o finaliza la partida. */
  nextTurn(): Game {
    if (this.status === GameStatus.Finished) {
      return this.getState();
    }

    this.turns.next();
    const outOfRounds = this.turns.round > this.totalRounds;
    const nextQuestion = outOfRounds ? null : this.questions.next();

    if (!nextQuestion) {
      this.currentQuestion = undefined;
      this.status = GameStatus.Finished;
    } else {
      this.currentQuestion = nextQuestion;
      this.status = GameStatus.Playing;
    }
    return this.getState();
  }

  currentPlayerId(): PlayerId {
    return this.setups[this.turns.currentIndex].id;
  }

  ranking(): ScoreEntry[] {
    return this.scores.ranking();
  }

  winners(): Player[] {
    if (this.status !== GameStatus.Finished) {
      return [];
    }
    const ids = new Set(this.scores.winners());
    return this.players().filter((player) => ids.has(player.id));
  }

  result(): AnswerResult | undefined {
    return this.lastResult;
  }

  /** Instantánea inmutable del estado, apta para alimentar signals. */
  getState(): Game {
    return {
      id: this.id,
      players: this.players(),
      currentPlayerIndex: this.turns.currentIndex,
      currentQuestion: this.currentQuestion,
      status: this.status,
      round: Math.min(this.turns.round, this.totalRounds),
      totalRounds: this.totalRounds,
    };
  }

  private players(): Player[] {
    return this.setups.map((setup) => ({ ...setup, score: this.scores.scoreOf(setup.id) }));
  }
}
