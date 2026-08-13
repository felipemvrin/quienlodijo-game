import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { PlayerCardComponent } from '../../shared/ui/player-card/player-card.component';
import { GameStateService } from '../../game/services/game-state.service';
import { AnimationService } from '../../game/services/animation.service';
import { AudioService } from '../../game/services/audio.service';

/** Marcador final y anuncio del ganador. */
@Component({
  selector: 'app-results-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent, PlayerCardComponent],
  template: `
    <section class="results">
      <p class="results__kicker">Fin de la partida</p>

      <h1 #trophy class="results__winner">
        @if (winners().length > 1) {
          ¡Empate!
        } @else {
          {{ winners()[0]?.name }} gana
        }
      </h1>

      <p class="results__subtitle">
        @if (winners().length > 1) {
          {{ winnerNames() }} comparten la victoria
        } @else {
          con {{ winners()[0]?.score ?? 0 }} puntos
        }
      </p>

      <ol #list class="results__list">
        @for (entry of game.ranking(); track entry.playerId) {
          @if (playerOf(entry.playerId); as player) {
            <li>
              <app-player-card
                [player]="player"
                [avatarImage]="avatarImage(player.avatarId)"
                [avatarColor]="avatarColor(player.avatarId)"
                [position]="entry.position"
                [active]="entry.position === 1"
              />
            </li>
          }
        }
      </ol>

      <div class="results__actions">
        <app-button variant="ghost" (pressed)="goHome()">Inicio</app-button>
        <app-button size="lg" (pressed)="playAgain()">Jugar otra vez</app-button>
      </div>
    </section>
  `,
  styles: `
    .results {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--ql-space-4);
      width: min(100%, 34rem);
      margin-inline: auto;
      padding: var(--ql-space-6) var(--ql-space-4);
      text-align: center;
    }

    .results__kicker {
      margin: 0;
      font-size: var(--ql-text-caption);
      letter-spacing: var(--ql-tracking-caption);
      text-transform: uppercase;
      color: var(--ql-color-accent);
    }

    .results__winner {
      margin: 0;
      font-family: var(--ql-font-display);
      font-size: var(--ql-text-heading);
      line-height: var(--ql-leading-heading);
      letter-spacing: var(--ql-tracking-display);
      text-transform: uppercase;
      text-wrap: balance;
    }

    .results__subtitle {
      margin: 0;
      color: var(--ql-color-text-muted);
    }

    .results__list {
      display: grid;
      gap: var(--ql-space-2);
      width: 100%;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .results__actions {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: var(--ql-space-3);
    }
  `,
})
export class ResultsPage {
  protected readonly game = inject(GameStateService);
  private readonly animations = inject(AnimationService);
  private readonly audio = inject(AudioService);
  private readonly router = inject(Router);

  private readonly trophy = viewChild<ElementRef<HTMLElement>>('trophy');
  private readonly list = viewChild<ElementRef<HTMLElement>>('list');

  protected readonly winners = this.game.winners;
  protected readonly winnerNames = computed(() =>
    this.winners()
      .map((player) => player.name)
      .join(' y '),
  );

  constructor() {
    afterNextRender(() => {
      const trophy = this.trophy()?.nativeElement;
      if (trophy) {
        this.animations.pop(trophy);
      }
      const items = this.list()?.nativeElement.querySelectorAll('li');
      if (items?.length) {
        this.animations.stagger(items);
      }
    });
  }

  protected playerOf(playerId: string) {
    return this.game.players().find((player) => player.id === playerId);
  }

  protected avatarImage(avatarId: string): string {
    return this.game.avatars().find((avatar) => avatar.id === avatarId)?.image ?? '🎭';
  }

  protected avatarColor(avatarId: string): string {
    return (
      this.game.avatars().find((avatar) => avatar.id === avatarId)?.color ??
      'var(--ql-color-border)'
    );
  }

  protected goHome(): void {
    this.audio.play('sfx.button');
    this.game.reset();
    void this.router.navigate(['/']);
  }

  protected playAgain(): void {
    this.audio.play('sfx.button');
    this.game.reset();
    void this.router.navigate(['/partida/nueva']);
  }
}
