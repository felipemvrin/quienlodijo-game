import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { Player } from '../../../game/models/player.model';
import { CharacterAvatarComponent } from '../character-avatar/character-avatar.component';
import { ScoreBadgeComponent } from '../score-badge/score-badge.component';

/** Tarjeta de jugador para el lobby y el marcador. */
@Component({
  selector: 'app-player-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CharacterAvatarComponent, ScoreBadgeComponent],
  template: `
    <article class="ql-player" [class.ql-player--active]="active()">
      <app-character-avatar
        [image]="avatarImage()"
        [label]="player().name"
        [color]="avatarColor()"
        [active]="active()"
        size="md"
      />
      <div class="ql-player__info">
        <p class="ql-player__name">{{ player().name }}</p>
        @if (position(); as pos) {
          <p class="ql-player__position">#{{ pos }}</p>
        }
      </div>
      <app-score-badge [score]="player().score" [highlight]="active()" />
    </article>
  `,
  styles: `
    :host {
      display: block;
    }

    .ql-player {
      display: flex;
      align-items: center;
      gap: var(--ql-space-3);
      padding: var(--ql-space-3);
      background: var(--ql-color-surface);
      border: 2px solid var(--ql-color-border);
      border-radius: var(--ql-radius-lg);
      box-shadow: var(--ql-shadow-sm);
      transition: border-color var(--ql-duration-base) var(--ql-ease-out);
    }

    .ql-player--active {
      border-color: var(--ql-color-accent);
      box-shadow: var(--ql-shadow-md);
    }

    .ql-player__info {
      flex: 1;
      min-width: 0;
    }

    .ql-player__name {
      margin: 0;
      font-family: var(--ql-font-display);
      font-size: 1.125rem;
      letter-spacing: var(--ql-tracking-display);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .ql-player__position {
      margin: 0;
      font-size: var(--ql-text-caption);
      color: var(--ql-color-text-muted);
    }
  `,
})
export class PlayerCardComponent {
  readonly player = input.required<Player>();
  readonly avatarImage = input('🎭');
  readonly avatarColor = input('var(--ql-color-border)');
  readonly active = input(false);
  /** Posición en la clasificación; se oculta si no se indica. */
  readonly position = input<number | null>(null);
}
