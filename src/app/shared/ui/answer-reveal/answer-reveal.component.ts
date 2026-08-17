import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { Character } from '../../../game/models/character.model';
import type { Question } from '../../../game/models/question.model';

/** Panel de revelación: acierto o fallo, personaje correcto y puntos ganados. */
@Component({
  selector: 'app-answer-reveal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ql-reveal" [class.ql-reveal--correct]="correct()" role="status">
      <p class="ql-reveal__verdict">
        {{ correct() ? '¡Correcto!' : timedOut() ? '¡Se acabó el tiempo!' : 'Fallaste' }}
      </p>
      <p class="ql-reveal__author">
        <span aria-hidden="true">{{ character().symbol }}</span> Lo dijo {{ character().name }}
      </p>
      <footer class="ql-reveal__footer">
        <p class="ql-reveal__explanation">{{ question().explanation }}</p>
        @if (question().source; as source) {
          <p class="ql-reveal__source">
            {{ source }}
            @if (question().year) {
              , {{ question().year }}
            }
          </p>
        }
      </footer>
      <p class="ql-reveal__points">+{{ points() }} pts</p>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .ql-reveal {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--ql-space-1);
      padding: var(--ql-space-4);
      background: color-mix(in srgb, var(--ql-color-incorrect) 18%, var(--ql-color-surface));
      border: 2px solid var(--ql-color-incorrect);
      border-radius: var(--ql-radius-lg);
      text-align: center;
    }

    .ql-reveal--correct {
      background: color-mix(in srgb, var(--ql-color-correct) 18%, var(--ql-color-surface));
      border-color: var(--ql-color-correct);
    }

    .ql-reveal__verdict {
      margin: 0;
      font-family: var(--ql-font-display);
      font-size: var(--ql-text-heading);
      line-height: var(--ql-leading-heading);
      text-transform: uppercase;
    }

    .ql-reveal__author {
      margin: 0;
      color: var(--ql-color-text-muted);
    }

    .ql-reveal__footer {
      width: 100%;
      margin-top: var(--ql-space-2);
      padding-top: var(--ql-space-3);
      border-top: 1px dashed var(--ql-color-border);
    }

    .ql-reveal__explanation {
      margin: 0 0 var(--ql-space-2);
    }

    .ql-reveal__source {
      margin: 0;
      font-size: var(--ql-text-caption);
      color: var(--ql-color-text-muted);
    }

    .ql-reveal__points {
      margin: 0;
      font-family: var(--ql-font-display);
      font-size: var(--ql-text-score);
    }
  `,
})
export class AnswerRevealComponent {
  readonly correct = input.required<boolean>();
  /** Personaje que realmente dijo la frase. */
  readonly character = input.required<Character>();
  readonly question = input.required<Question>();
  readonly points = input.required<number>();
  /** Diferencia un fallo de una respuesta no enviada a tiempo. */
  readonly timedOut = input(false);
}
