import { Injectable } from '@angular/core';
import gsap from 'gsap';

/**
 * Envoltorio sobre GSAP con las transiciones recurrentes del juego.
 *
 * Centraliza duraciones y easings (alineados con los design tokens) y respeta
 * `prefers-reduced-motion`: si el usuario lo pide, los elementos aparecen sin animar.
 */
@Injectable({ providedIn: 'root' })
export class AnimationService {
  private readonly reducedMotion =
    typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /** Entrada de una carta o panel desde abajo. */
  enter(target: Element, delay = 0): gsap.core.Tween {
    return gsap.fromTo(
      target,
      { autoAlpha: 0, y: this.reducedMotion ? 0 : 32, scale: this.reducedMotion ? 1 : 0.96 },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: this.duration(0.5),
        delay: this.reducedMotion ? 0 : delay,
        ease: 'power3.out',
      },
    );
  }

  /** Entrada escalonada de una lista (jugadores, marcador…). */
  stagger(targets: Element[] | NodeListOf<Element>, step = 0.08): gsap.core.Tween {
    return gsap.fromTo(
      targets,
      { autoAlpha: 0, y: this.reducedMotion ? 0 : 24 },
      {
        autoAlpha: 1,
        y: 0,
        duration: this.duration(0.4),
        ease: 'power2.out',
        stagger: this.reducedMotion ? 0 : step,
      },
    );
  }

  /** Latido de énfasis para aciertos y puntuaciones. */
  pop(target: Element): gsap.core.Tween {
    return gsap.fromTo(
      target,
      { scale: this.reducedMotion ? 1 : 0.8 },
      { scale: 1, duration: this.duration(0.45), ease: 'back.out(2)' },
    );
  }

  /** Sacudida para respuestas incorrectas. */
  shake(target: Element): gsap.core.Tween {
    if (this.reducedMotion) {
      return gsap.to(target, { duration: 0 });
    }
    return gsap.fromTo(target, { x: -8 }, { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
  }

  private duration(seconds: number): number {
    return this.reducedMotion ? 0 : seconds;
  }
}
