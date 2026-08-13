import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Cuenta atrás visual. El componente es "tonto": recibe el tiempo restante y lo pinta.
 * La cuenta la lleva el motor/servicio, para que el estado del juego sea la única verdad.
 */
@Component({
  selector: 'app-timer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="ql-timer"
      [class.ql-timer--danger]="isDanger()"
      role="timer"
      [attr.aria-label]="'Quedan ' + seconds() + ' segundos'"
    >
      <span class="ql-timer__value">{{ seconds() }}</span>
      <div class="ql-timer__track">
        <div class="ql-timer__fill" [style.width.%]="progress()"></div>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .ql-timer {
      display: flex;
      align-items: center;
      gap: var(--ql-space-3);
    }

    .ql-timer__value {
      min-width: 2.5ch;
      font-family: var(--ql-font-display);
      font-size: var(--ql-text-score);
      font-variant-numeric: tabular-nums;
      text-align: right;
    }

    .ql-timer__track {
      flex: 1;
      height: 0.6rem;
      background: var(--ql-color-surface);
      border: 1px solid var(--ql-color-border);
      border-radius: var(--ql-radius-full);
      overflow: hidden;
    }

    .ql-timer__fill {
      height: 100%;
      background: var(--ql-color-accent);
      transition: width var(--ql-duration-base) linear;
    }

    .ql-timer--danger .ql-timer__value {
      color: var(--ql-color-incorrect);
    }

    .ql-timer--danger .ql-timer__fill {
      background: var(--ql-color-incorrect);
    }
  `,
})
export class TimerComponent {
  readonly remainingMs = input.required<number>();
  readonly totalMs = input.required<number>();
  /** Umbral, en segundos, a partir del cual el temporizador se muestra en alerta. */
  readonly dangerThresholdSeconds = input(3);

  protected readonly seconds = computed(() => Math.max(0, Math.ceil(this.remainingMs() / 1000)));
  protected readonly progress = computed(() =>
    Math.max(0, Math.min(100, (this.remainingMs() / this.totalMs()) * 100)),
  );
  protected readonly isDanger = computed(() => this.seconds() <= this.dangerThresholdSeconds());
}
