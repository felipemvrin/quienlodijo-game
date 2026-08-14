import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  inject,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { AnimationService } from '../../game/services/animation.service';
import { AudioService } from '../../game/services/audio.service';

/** Pantalla de bienvenida: presenta el concepto del juego y abre la partida. */
@Component({
  selector: 'app-welcome-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent],
  template: `
    <section class="welcome" #stage>
      <p class="welcome__kicker">Party trivia de citas históricas</p>

      <h1 class="welcome__title">¿Quién lo dijo?</h1>

      <div class="welcome__versus">
        <span class="welcome__fighter welcome__fighter--jesus">
          <span aria-hidden="true">✝️</span> Jesús
        </span>
        <span class="welcome__vs">VS</span>
        <span class="welcome__fighter welcome__fighter--marx">
          Karl Marx <span aria-hidden="true">☭</span>
        </span>
      </div>

      <p class="welcome__pitch">
        Una frase en pantalla. Dos sospechosos. De 2 a 6 jugadores intentando adivinar quién la
        dijo… y descubriendo por qué.
      </p>

      <app-button size="lg" (pressed)="onStart()">Comenzar</app-button>
    </section>
  `,
  styles: `
    .welcome {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--ql-space-5);
      padding: var(--ql-space-6) var(--ql-space-4);
      text-align: center;
    }

    .welcome__kicker {
      margin: 0;
      font-size: var(--ql-text-caption);
      letter-spacing: var(--ql-tracking-caption);
      text-transform: uppercase;
      color: var(--ql-color-accent);
    }

    .welcome__title {
      margin: 0;
      font-family: var(--ql-font-display);
      font-size: 65px;
      line-height: var(--ql-leading-display);
      letter-spacing: var(--ql-tracking-display);
      text-wrap: balance;
      text-shadow: 0 6px 0 rgb(0 0 0 / 0.35);
    }

    .welcome__versus {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: var(--ql-space-3);
      font-family: var(--ql-font-display);
      font-size: 1.5rem;
      text-transform: uppercase;
    }

    .welcome__fighter {
      padding: var(--ql-space-2) var(--ql-space-4);
      border-radius: var(--ql-radius-full);
    }

    .welcome__fighter--jesus {
      color: var(--ql-color-jesus);
    }

    .welcome__fighter--marx {
      color: var(--ql-color-marx);
    }
    .welcome__fighter--marx span {
      background: var(--ql-color-marx);
      color: #fff;
      border-radius: var(--ql-radius-full);
      padding: 0 var(--ql-space-1);
    }

    .welcome__vs {
      color: var(--ql-color-accent);
    }

    .welcome__pitch {
      max-width: 46ch;
      margin: 0;
      color: var(--ql-color-text-muted);
      text-wrap: pretty;
    }
  `,
})
export class WelcomePage {
  private readonly animations = inject(AnimationService);
  private readonly audio = inject(AudioService);
  private readonly router = inject(Router);
  private readonly stage = viewChild.required<ElementRef<HTMLElement>>('stage');

  constructor() {
    afterNextRender(() => this.animations.enter(this.stage().nativeElement));
  }

  protected onStart(): void {
    this.audio.play('sfx.button');
    void this.router.navigate(['/partida/nueva']);
  }
}
