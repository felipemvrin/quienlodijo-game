import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
  template: `
    <main class="app-shell">
      <router-outlet />
    </main>
  `,
  styles: `
    .app-shell {
      min-height: 100dvh;
      display: flex;
      flex-direction: column;
    }
  `,
})
export class App {}
