import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/** Cabecera del tablero: ronda en curso, jugador en turno y control de sonido. */
@Component({
  selector: 'app-game-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="ql-header">
      <p class="ql-header__round">
        Ronda <strong>{{ round() }}</strong> / {{ totalRounds() }}
      </p>

      <p class="ql-header__turn">
        Turno de <strong>{{ currentPlayerName() }}</strong>
      </p>

      <button
        class="ql-header__mute"
        type="button"
        [attr.aria-pressed]="muted()"
        aria-label="Activar o silenciar el sonido"
        (click)="muteToggled.emit()"
      >
        {{ muted() ? '🔇' : '🔊' }}
      </button>
    </header>
  `,
  styles: `
    :host {
      display: block;
    }

    .ql-header {
      display: flex;
      align-items: center;
      gap: var(--ql-space-3);
      padding: var(--ql-space-3) var(--ql-space-4);
      background: var(--ql-color-surface);
      border-bottom: 2px solid var(--ql-color-border);
    }

    .ql-header p {
      margin: 0;
      font-size: var(--ql-text-caption);
      letter-spacing: var(--ql-tracking-caption);
      text-transform: uppercase;
      color: var(--ql-color-text-muted);
    }

    .ql-header strong {
      color: var(--ql-color-text);
    }

    .ql-header__turn {
      flex: 1;
      text-align: center;
    }

    .ql-header__mute {
      background: none;
      border: none;
      font-size: 1.25rem;
      cursor: pointer;
    }
  `,
})
export class GameHeaderComponent {
  readonly round = input.required<number>();
  readonly totalRounds = input.required<number>();
  readonly currentPlayerName = input.required<string>();
  readonly muted = input(false);

  readonly muteToggled = output<void>();
}
