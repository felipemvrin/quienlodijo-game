import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'md' | 'lg';

/** Botón base del juego. Estética de concurso: sólido, con relieve y respuesta táctil. */
@Component({
  selector: 'app-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      class="ql-button"
      [class]="'ql-button--' + variant() + ' ql-button--' + size()"
      [attr.type]="type()"
      [disabled]="disabled()"
      (click)="pressed.emit()"
    >
      <ng-content />
    </button>
  `,
  styles: `
    :host {
      display: inline-block;
    }

    .ql-button {
      font-family: var(--ql-font-display);
      letter-spacing: var(--ql-tracking-display);
      text-transform: uppercase;
      border: 2px solid transparent;
      border-radius: var(--ql-radius-full);
      cursor: pointer;
      transition:
        transform var(--ql-duration-fast) var(--ql-ease-bounce),
        box-shadow var(--ql-duration-fast) var(--ql-ease-out),
        background-color var(--ql-duration-fast) var(--ql-ease-out);
    }

    .ql-button:hover:not(:disabled) {
      transform: translateY(-2px);
    }

    .ql-button:active:not(:disabled) {
      transform: translateY(1px);
    }

    .ql-button:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }

    .ql-button--md {
      padding: var(--ql-space-3) var(--ql-space-5);
      font-size: 1.125rem;
    }

    .ql-button--lg {
      padding: var(--ql-space-4) var(--ql-space-7);
      font-size: 1.5rem;
    }

    .ql-button--primary {
      background: linear-gradient(
        180deg,
        var(--ql-color-accent) 0%,
        var(--ql-color-accent-strong) 100%
      );
      color: var(--ql-color-text-inverse);
      box-shadow: var(--ql-shadow-md), var(--ql-shadow-glow);
    }

    .ql-button--secondary {
      background: var(--ql-color-surface-raised);
      color: var(--ql-color-text);
      border-color: var(--ql-color-border);
      box-shadow: var(--ql-shadow-sm);
    }

    .ql-button--ghost {
      background: transparent;
      color: var(--ql-color-text-muted);
      border-color: var(--ql-color-border);
    }
  `,
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly type = input<'button' | 'submit'>('button');
  readonly disabled = input(false);

  readonly pressed = output<void>();
}
