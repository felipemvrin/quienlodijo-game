import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  computed,
  effect,
  inject,
  signal,
  viewChild,
  type OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { GameHeaderComponent } from '../../shared/ui/game-header/game-header.component';
import { QuestionCardComponent } from '../../shared/ui/question-card/question-card.component';
import { AnswerButtonComponent } from '../../shared/ui/answer-button/answer-button.component';
import { AnswerRevealComponent } from '../../shared/ui/answer-reveal/answer-reveal.component';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { ScoreBadgeComponent } from '../../shared/ui/score-badge/score-badge.component';
import { TimerComponent } from '../../shared/ui/timer/timer.component';
import { GameStateService } from '../../game/services/game-state.service';
import { AnimationService } from '../../game/services/animation.service';
import { AudioService } from '../../game/services/audio.service';
import { GameStatus } from '../../game/models/game.model';
import type { AnswerState } from '../../shared/ui/answer-button/answer-button.component';
import type { CharacterId } from '../../game/models/character.model';

/** Milisegundos disponibles para responder cada frase. */
const TURN_TIME_MS = 15_000;
const TICK_MS = 100;

/** Tablero de juego: frase, respuestas, cuenta atrás y revelación. */
@Component({
  selector: 'app-board-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    GameHeaderComponent,
    QuestionCardComponent,
    AnswerButtonComponent,
    AnswerRevealComponent,
    ButtonComponent,
    ScoreBadgeComponent,
    TimerComponent,
  ],
  template: `
    <app-game-header
      [round]="game.round()"
      [totalRounds]="totalRounds()"
      [currentPlayerName]="game.currentPlayer()?.name ?? ''"
      [muted]="audio.muted()"
      (muteToggled)="audio.toggleMute()"
    />

    <section class="board">
      @if (question(); as currentQuestion) {
        <div class="board__timer">
          @if (!revealed()) {
            <app-timer [remainingMs]="remaining()" [totalMs]="turnTimeMs" />
          }
        </div>

        <div #card class="board__card">
          <app-question-card [question]="currentQuestion" [revealed]="revealed()" />
        </div>

        <div class="board__answers">
          @for (character of game.characters(); track character.id) {
            <app-answer-button
              [character]="character"
              [state]="answerState(character.id)"
              [disabled]="revealed()"
              (chosen)="answer($event)"
            />
          }
        </div>

        @if (game.lastResult(); as result) {
          <div class="board__reveal" role="presentation">
            <div
              #reveal
              class="board__reveal-dialog"
              role="dialog"
              aria-modal="true"
              aria-label="Resultado de la ronda"
            >
              <app-answer-reveal
                [correct]="result.correct"
                [character]="correctCharacter()!"
                [points]="result.pointsAwarded"
                [timedOut]="result.answer.choice === null"
              />
              <app-button size="lg" (pressed)="next()">
                {{ isLastTurn() ? 'Ver resultado' : 'Siguiente' }}
              </app-button>
            </div>
          </div>
        }
      }

      <ul class="board__scores">
        @for (player of game.players(); track player.id) {
          <li class="board__score" [class.board__score--active]="player.id === currentPlayerId()">
            <span class="board__score-name">{{ player.name }}</span>
            <app-score-badge [score]="player.score" [highlight]="player.id === currentPlayerId()" />
          </li>
        }
      </ul>
    </section>
  `,
  styles: `
    :host {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .board {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: var(--ql-space-4);
      width: min(100%, 46rem);
      margin-inline: auto;
      padding: var(--ql-space-4);
    }

    .board__timer {
      min-height: 2.25rem;
    }

    .board__answers {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--ql-space-3);
    }

    .board__reveal {
      position: fixed;
      inset: 0;
      z-index: var(--ql-z-overlay);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--ql-space-4);
      background: rgb(10 6 19 / 0.72);
      backdrop-filter: blur(4px);
    }

    .board__reveal-dialog {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--ql-space-3);
      width: min(100%, 28rem);
      padding: var(--ql-space-4);
      border-radius: var(--ql-radius-lg);
      box-shadow: var(--ql-shadow-lg);
    }

    .board__scores {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: var(--ql-space-2);
      margin: auto 0 0;
      padding: var(--ql-space-3) 0 0;
      list-style: none;
      border-top: 1px dashed var(--ql-color-border);
    }

    .board__score {
      display: flex;
      align-items: center;
      gap: var(--ql-space-2);
      padding: var(--ql-space-1) var(--ql-space-2);
      border-radius: var(--ql-radius-full);
    }

    .board__score--active {
      background: var(--ql-color-surface);
    }

    .board__score-name {
      font-size: var(--ql-text-caption);
      color: var(--ql-color-text-muted);
    }
  `,
})
export class BoardPage implements OnInit {
  protected readonly game = inject(GameStateService);
  protected readonly audio = inject(AudioService);
  private readonly animations = inject(AnimationService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private readonly card = viewChild<ElementRef<HTMLElement>>('card');
  private readonly reveal = viewChild<ElementRef<HTMLElement>>('reveal');

  protected readonly turnTimeMs = TURN_TIME_MS;
  private readonly remainingMs = signal(TURN_TIME_MS);

  protected readonly remaining = this.remainingMs.asReadonly();
  protected readonly question = this.game.currentQuestion;
  protected readonly revealed = computed(() => this.game.status() === GameStatus.Revealing);
  protected readonly totalRounds = computed(() => this.game.game()?.totalRounds ?? 0);
  protected readonly currentPlayerId = computed(() => this.game.currentPlayer()?.id);
  protected readonly correctCharacter = computed(() => {
    const answer = this.game.lastResult();
    return this.game.characters().find((character) => character.id === answer?.correctAnswer);
  });
  protected readonly isLastTurn = computed(() => {
    const state = this.game.game();
    return (
      !!state &&
      state.round >= state.totalRounds &&
      state.currentPlayerIndex === state.players.length - 1
    );
  });

  private countdownFrom = Date.now();
  private lastQuestionId: string | null = null;

  constructor() {
    // Reinicia el reloj y anima la carta cada vez que entra una frase nueva.
    effect(() => {
      const question = this.question();
      if (!question || question.id === this.lastQuestionId) {
        return;
      }
      this.lastQuestionId = question.id;
      this.restartCountdown();
      const element = this.card()?.nativeElement;
      if (element) {
        this.animations.enter(element);
      }
    });

    effect(() => {
      const element = this.reveal()?.nativeElement;
      const result = this.game.lastResult();
      if (!element || !result) {
        return;
      }
      if (result.correct) {
        this.animations.pop(element);
      } else {
        this.animations.shake(element);
      }
    });
  }

  ngOnInit(): void {
    void this.game.loadCatalog();
    this.audio.playMusic('music.game');
    this.audio.preload(['sfx.correct', 'sfx.incorrect', 'sfx.countdown']);

    const interval = setInterval(() => this.tick(), TICK_MS);
    this.destroyRef.onDestroy(() => clearInterval(interval));
  }

  protected answerState(characterId: CharacterId): AnswerState {
    const result = this.game.lastResult();
    if (!result) {
      return 'idle';
    }
    if (characterId === result.correctAnswer) {
      return 'correct';
    }
    return characterId === result.answer.choice ? 'incorrect' : 'dimmed';
  }

  protected answer(choice: CharacterId): void {
    if (this.revealed()) {
      return;
    }
    const result = this.game.answer(choice, TURN_TIME_MS - this.remainingMs());
    this.audio.play(result.correct ? 'sfx.correct' : 'sfx.incorrect');
  }

  protected next(): void {
    this.audio.play('sfx.button');
    this.game.nextTurn();

    if (this.game.status() === GameStatus.Finished) {
      this.audio.stopMusic();
      this.audio.play('sfx.victory');
      void this.router.navigate(['/partida/resultado']);
    }
  }

  private tick(): void {
    if (this.revealed()) {
      return;
    }
    const remaining = Math.max(0, TURN_TIME_MS - (Date.now() - this.countdownFrom));
    const previous = this.remainingMs();
    this.remainingMs.set(remaining);

    if (remaining <= 3000 && previous > 3000) {
      this.audio.play('sfx.countdown');
    }
    if (remaining === 0) {
      this.game.timeout(TURN_TIME_MS);
      this.audio.play('sfx.incorrect');
    }
  }

  private restartCountdown(): void {
    this.countdownFrom = Date.now();
    this.remainingMs.set(TURN_TIME_MS);
  }
}
