import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import type { Character } from '../../../game/models/character.model';
import { AudioService } from '../../../game/services/audio.service';

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

    .ql-reveal__points {
      margin: 0;
      font-family: var(--ql-font-display);
      font-size: var(--ql-text-score);
    }
  `,
})
export class AnswerRevealComponent {
  private readonly audio = inject(AudioService);

  readonly correct = input.required<boolean>();
  /** Personaje que realmente dijo la frase. */
  readonly character = input.required<Character>();
  readonly points = input.required<number>();
  /** Diferencia un fallo de una respuesta no enviada a tiempo. */
  readonly timedOut = input(false);

  constructor() {
    effect(() => {
      if (!this.correct() && !this.timedOut()) {
        this.audio.play('sfx.laugh');
      }
    });
  }
}
