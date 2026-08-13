import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  type OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { CharacterAvatarComponent } from '../../shared/ui/character-avatar/character-avatar.component';
import { GameStateService } from '../../game/services/game-state.service';
import { AudioService } from '../../game/services/audio.service';
import { MAX_PLAYERS, MIN_PLAYERS } from '../../game/models/game.model';
import type { AvatarId } from '../../game/models/avatar.model';
import type { PlayerSetup } from '../../game/models/player.model';

interface PlayerDraft {
  readonly id: string;
  name: string;
  avatarId: AvatarId | null;
}

const PLAYER_COUNTS = Array.from(
  { length: MAX_PLAYERS - MIN_PLAYERS + 1 },
  (_, index) => MIN_PLAYERS + index,
);

/** Creación de partida: número de jugadores, nombres y avatares. */
@Component({
  selector: 'app-setup-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ButtonComponent, CharacterAvatarComponent],
  template: `
    <section class="setup">
      <header class="setup__head">
        <h1 class="setup__title">Nueva partida</h1>
        <p class="setup__subtitle">¿Cuántos vais a jugar?</p>
      </header>

      <div class="setup__counts" role="group" aria-label="Número de jugadores">
        @for (count of playerCounts; track count) {
          <button
            type="button"
            class="setup__count"
            [class.setup__count--active]="count === playerCount()"
            [attr.aria-pressed]="count === playerCount()"
            (click)="setPlayerCount(count)"
          >
            {{ count }}
          </button>
        }
      </div>

      @if (loading()) {
        <p class="setup__loading">Cargando avatares…</p>
      } @else {
        <ol class="setup__players">
          @for (player of players(); track player.id; let index = $index) {
            <li class="setup__player">
              <label class="setup__label" [attr.for]="'nombre-' + player.id">
                Jugador {{ index + 1 }}
              </label>
              <input
                class="setup__input"
                type="text"
                maxlength="14"
                [id]="'nombre-' + player.id"
                [ngModel]="player.name"
                (ngModelChange)="rename(player.id, $event)"
                [attr.placeholder]="'Jugador ' + (index + 1)"
              />

              <div class="setup__avatars" role="group" aria-label="Elegir avatar">
                @for (avatar of avatars(); track avatar.id) {
                  <button
                    type="button"
                    class="setup__avatar"
                    [disabled]="isTaken(avatar.id, player.id)"
                    [attr.aria-pressed]="avatar.id === player.avatarId"
                    [attr.aria-label]="avatar.name"
                    (click)="chooseAvatar(player.id, avatar.id)"
                  >
                    <app-character-avatar
                      size="sm"
                      [image]="avatar.image"
                      [label]="avatar.name"
                      [color]="avatar.color"
                      [active]="avatar.id === player.avatarId"
                    />
                  </button>
                }
              </div>
            </li>
          }
        </ol>

        <p class="setup__hint" role="status">
          @if (!allAvatarsChosen()) {
            Cada jugador necesita un avatar distinto.
          } @else {
            ¡Listos para empezar!
          }
        </p>

        <div class="setup__actions">
          <app-button variant="ghost" (pressed)="goBack()">Volver</app-button>
          <app-button size="lg" [disabled]="!allAvatarsChosen()" (pressed)="start()">
            Empezar
          </app-button>
        </div>
      }
    </section>
  `,
  styles: `
    .setup {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--ql-space-5);
      width: min(100%, 46rem);
      margin-inline: auto;
      padding: var(--ql-space-6) var(--ql-space-4);
    }

    .setup__head {
      text-align: center;
    }

    .setup__title {
      margin: 0;
      font-family: var(--ql-font-display);
      font-size: var(--ql-text-heading);
      letter-spacing: var(--ql-tracking-display);
      text-transform: uppercase;
    }

    .setup__subtitle {
      margin: var(--ql-space-2) 0 0;
      color: var(--ql-color-text-muted);
    }

    .setup__counts {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: var(--ql-space-2);
    }

    .setup__count {
      width: 3rem;
      height: 3rem;
      background: var(--ql-color-surface);
      color: var(--ql-color-text);
      border: 2px solid var(--ql-color-border);
      border-radius: var(--ql-radius-full);
      font-family: var(--ql-font-display);
      font-size: 1.25rem;
      cursor: pointer;
      transition: transform var(--ql-duration-fast) var(--ql-ease-bounce);
    }

    .setup__count:hover {
      transform: translateY(-2px);
    }

    .setup__count--active {
      background: var(--ql-color-accent);
      border-color: var(--ql-color-accent);
      color: var(--ql-color-text-inverse);
    }

    .setup__players {
      display: grid;
      gap: var(--ql-space-3);
      width: 100%;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .setup__player {
      display: grid;
      gap: var(--ql-space-2);
      padding: var(--ql-space-3);
      background: var(--ql-color-surface);
      border: 2px solid var(--ql-color-border);
      border-radius: var(--ql-radius-lg);
    }

    .setup__label {
      font-size: var(--ql-text-caption);
      letter-spacing: var(--ql-tracking-caption);
      text-transform: uppercase;
      color: var(--ql-color-text-muted);
    }

    .setup__input {
      padding: var(--ql-space-2) var(--ql-space-3);
      background: var(--ql-color-bg);
      color: var(--ql-color-text);
      border: 2px solid var(--ql-color-border);
      border-radius: var(--ql-radius-md);
      font: inherit;
    }

    .setup__avatars {
      display: flex;
      flex-wrap: wrap;
      gap: var(--ql-space-2);
    }

    .setup__avatar {
      padding: 0;
      background: none;
      border: none;
      border-radius: var(--ql-radius-full);
      cursor: pointer;
    }

    .setup__avatar:disabled {
      opacity: 0.25;
      cursor: not-allowed;
    }

    .setup__hint {
      margin: 0;
      font-size: var(--ql-text-caption);
      color: var(--ql-color-text-muted);
    }

    .setup__actions {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: var(--ql-space-3);
    }

    @media (min-width: 640px) {
      .setup__players {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `,
})
export class SetupPage implements OnInit {
  private readonly game = inject(GameStateService);
  private readonly audio = inject(AudioService);
  private readonly router = inject(Router);

  protected readonly playerCounts = PLAYER_COUNTS;
  protected readonly avatars = this.game.avatars;
  protected readonly loading = this.game.loading;

  private readonly drafts = signal<PlayerDraft[]>(createDrafts(MIN_PLAYERS));

  protected readonly players = this.drafts.asReadonly();
  protected readonly playerCount = computed(() => this.drafts().length);
  protected readonly allAvatarsChosen = computed(() =>
    this.drafts().every((player) => player.avatarId !== null),
  );

  ngOnInit(): void {
    void this.game.loadCatalog();
    this.audio.playMusic('music.menu');
  }

  protected setPlayerCount(count: number): void {
    this.audio.play('sfx.button');
    this.drafts.update((current) =>
      count <= current.length
        ? current.slice(0, count)
        : [...current, ...createDrafts(count - current.length, current.length)],
    );
  }

  protected rename(id: string, name: string): void {
    this.drafts.update((current) =>
      current.map((player) => (player.id === id ? { ...player, name } : player)),
    );
  }

  protected chooseAvatar(id: string, avatarId: AvatarId): void {
    this.audio.play('sfx.button');
    this.drafts.update((current) =>
      current.map((player) => (player.id === id ? { ...player, avatarId } : player)),
    );
  }

  protected isTaken(avatarId: AvatarId, playerId: string): boolean {
    return this.drafts().some((player) => player.avatarId === avatarId && player.id !== playerId);
  }

  protected goBack(): void {
    void this.router.navigate(['/']);
  }

  protected async start(): Promise<void> {
    const players: PlayerSetup[] = this.drafts().map((draft, index) => ({
      id: draft.id,
      name: draft.name.trim() || `Jugador ${index + 1}`,
      avatarId: draft.avatarId as AvatarId,
    }));

    this.audio.play('sfx.button');
    await this.game.startGame(players);
    await this.router.navigate(['/partida']);
  }
}

function createDrafts(count: number, offset = 0): PlayerDraft[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `p${offset + index + 1}`,
    name: '',
    avatarId: null,
  }));
}
