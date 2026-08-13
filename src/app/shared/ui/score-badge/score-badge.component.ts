import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Marcador compacto de puntos, pensado para cabeceras y tarjetas de jugador. */
@Component({
  selector: 'app-score-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="ql-score" [class.ql-score--highlight]="highlight()">
      <span class="ql-score__value">{{ score() }}</span>
      <span class="ql-score__label">pts</span>
    </span>
  `,
  styles: `
    :host {
      display: inline-block;
    }

    .ql-score {
      display: inline-flex;
      align-items: baseline;
      gap: var(--ql-space-1);
      padding: var(--ql-space-1) var(--ql-space-3);
      background: var(--ql-color-surface);
      border: 1px solid var(--ql-color-border);
      border-radius: var(--ql-radius-full);
    }

    .ql-score--highlight {
      background: var(--ql-color-accent);
      border-color: var(--ql-color-accent);
      color: var(--ql-color-text-inverse);
    }

    .ql-score__value {
      font-family: var(--ql-font-display);
      font-size: var(--ql-text-score);
      font-variant-numeric: tabular-nums;
    }

    .ql-score__label {
      font-size: var(--ql-text-caption);
      letter-spacing: var(--ql-tracking-caption);
      text-transform: uppercase;
      opacity: 0.75;
    }
  `,
})
export class ScoreBadgeComponent {
  readonly score = input.required<number>();
  readonly highlight = input(false);
}
