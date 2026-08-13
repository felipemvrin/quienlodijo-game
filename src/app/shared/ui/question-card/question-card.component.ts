import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { Question } from '../../../game/models/question.model';

const DIFFICULTY_LABELS: Record<Question['difficulty'], string> = {
  easy: 'Fácil',
  medium: 'Media',
  hard: 'Difícil',
};

/** Carta con la frase a adivinar. Es el elemento central del tablero. */
@Component({
  selector: 'app-question-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="ql-card">
      <header class="ql-card__header">
        <span class="ql-card__tag">¿Quién lo dijo?</span>
        <span class="ql-card__tag ql-card__tag--muted">{{ difficultyLabel() }}</span>
      </header>

      <blockquote class="ql-card__quote">“{{ question().quote }}”</blockquote>

      @if (revealed()) {
        <footer class="ql-card__footer">
          <p class="ql-card__explanation">{{ question().explanation }}</p>
          @if (question().source; as source) {
            <p class="ql-card__source">
              {{ source }}
              @if (question().year) {
                , {{ question().year }}
              }
            </p>
          }
        </footer>
      }
    </article>
  `,
  styles: `
    :host {
      display: block;
    }

    .ql-card {
      display: flex;
      flex-direction: column;
      gap: var(--ql-space-4);
      padding: var(--ql-space-5);
      background: linear-gradient(
        160deg,
        var(--ql-color-surface-raised) 0%,
        var(--ql-color-surface) 100%
      );
      border: 2px solid var(--ql-color-border);
      border-radius: var(--ql-radius-xl);
      box-shadow: var(--ql-shadow-lg);
    }

    .ql-card__header {
      display: flex;
      justify-content: space-between;
      gap: var(--ql-space-2);
    }

    .ql-card__tag {
      font-size: var(--ql-text-caption);
      letter-spacing: var(--ql-tracking-caption);
      text-transform: uppercase;
      color: var(--ql-color-accent);
    }

    .ql-card__tag--muted {
      color: var(--ql-color-text-muted);
    }

    .ql-card__quote {
      margin: 0;
      font-family: var(--ql-font-display);
      font-size: var(--ql-text-heading);
      line-height: var(--ql-leading-heading);
      text-wrap: balance;
    }

    .ql-card__footer {
      padding-top: var(--ql-space-3);
      border-top: 1px dashed var(--ql-color-border);
    }

    .ql-card__explanation {
      margin: 0 0 var(--ql-space-2);
    }

    .ql-card__source {
      margin: 0;
      font-size: var(--ql-text-caption);
      color: var(--ql-color-text-muted);
    }
  `,
})
export class QuestionCardComponent {
  readonly question = input.required<Question>();
  /** Muestra explicación y fuente una vez revelada la respuesta. */
  readonly revealed = input(false);

  protected difficultyLabel(): string {
    return DIFFICULTY_LABELS[this.question().difficulty];
  }
}
