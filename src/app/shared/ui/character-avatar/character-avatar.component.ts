import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type AvatarSize = 'sm' | 'md' | 'lg';

/** Ficha circular con el emoji o ilustración de un avatar/personaje. */
@Component({
  selector: 'app-character-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="ql-avatar"
      [class]="'ql-avatar--' + size()"
      [class.ql-avatar--active]="active()"
      [style.--avatar-color]="color()"
      role="img"
      [attr.aria-label]="label()"
      >{{ image() }}</span
    >
  `,
  styles: `
    :host {
      display: inline-block;
    }

    .ql-avatar {
      display: grid;
      place-items: center;
      aspect-ratio: 1;
      background: var(--ql-color-surface);
      border: 3px solid var(--avatar-color, var(--ql-color-border));
      border-radius: var(--ql-radius-full);
      box-shadow: var(--ql-shadow-sm);
      transition: box-shadow var(--ql-duration-base) var(--ql-ease-out);
    }

    .ql-avatar--active {
      box-shadow: var(--ql-shadow-glow);
    }

    .ql-avatar--sm {
      width: 2.25rem;
      font-size: 1.125rem;
    }

    .ql-avatar--md {
      width: 3.5rem;
      font-size: 1.75rem;
    }

    .ql-avatar--lg {
      width: 5.5rem;
      font-size: 2.75rem;
    }
  `,
})
export class CharacterAvatarComponent {
  /** Emoji o carácter representativo del avatar. */
  readonly image = input.required<string>();
  readonly label = input.required<string>();
  readonly color = input('var(--ql-color-border)');
  readonly size = input<AvatarSize>('md');
  readonly active = input(false);
}
