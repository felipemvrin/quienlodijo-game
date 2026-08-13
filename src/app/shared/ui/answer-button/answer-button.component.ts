import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import type { Character } from '../../../game/models/character.model';

export type AnswerState = 'idle' | 'correct' | 'incorrect' | 'dimmed';

/** Botón con el que se atribuye una frase a un personaje. */
@Component({
  selector: 'app-answer-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      class="ql-answer"
      [class]="'ql-answer--' + state()"
      [style.--answer-color]="accent()"
      [disabled]="disabled()"
      [attr.aria-label]="'Responder ' + character().name"
      (click)="chosen.emit(character().id)"
    >
      <span class="ql-answer__symbol" aria-hidden="true">{{ character().symbol }}</span>
      <span class="ql-answer__name">{{ character().name }}</span>
    </button>
  `,
  styles: `
    :host {
      display: block;
    }

    .ql-answer {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--ql-space-2);
      padding: var(--ql-space-5) var(--ql-space-4);
      background: var(--ql-color-surface-raised);
      color: var(--ql-color-text);
      border: 3px solid var(--answer-color, var(--ql-color-border));
      border-radius: var(--ql-radius-lg);
      box-shadow: var(--ql-shadow-md);
      cursor: pointer;
      transition:
        transform var(--ql-duration-fast) var(--ql-ease-bounce),
        opacity var(--ql-duration-base) var(--ql-ease-out),
        background-color var(--ql-duration-base) var(--ql-ease-out);
    }

    .ql-answer:hover:not(:disabled) {
      transform: translateY(-3px) scale(1.02);
    }

    .ql-answer:disabled {
      cursor: not-allowed;
    }

    .ql-answer__symbol {
      font-size: 2.5rem;
      line-height: 1;
    }

    .ql-answer__name {
      font-family: var(--ql-font-display);
      font-size: 1.25rem;
      letter-spacing: var(--ql-tracking-display);
      text-transform: uppercase;
    }

    .ql-answer--correct {
      background: color-mix(in srgb, var(--ql-color-correct) 25%, var(--ql-color-surface-raised));
      border-color: var(--ql-color-correct);
    }

    .ql-answer--incorrect {
      background: color-mix(in srgb, var(--ql-color-incorrect) 25%, var(--ql-color-surface-raised));
      border-color: var(--ql-color-incorrect);
    }

    .ql-answer--dimmed {
      opacity: 0.4;
    }
  `,
})
export class AnswerButtonComponent {
  readonly character = input.required<Character>();
  readonly state = input<AnswerState>('idle');
  readonly disabled = input(false);

  readonly chosen = output<string>();

  protected readonly accent = computed(() => `var(--ql-color-${this.character().colorToken})`);
}
