import { Routes } from '@angular/router';
import { partidaActivaGuard } from './core/guards/partida-activa.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: '¿Quién lo dijo? — Jesús vs. Karl Marx',
    loadComponent: () => import('./features/welcome/welcome.page').then((m) => m.WelcomePage),
  },
  {
    path: 'partida/nueva',
    title: 'Nueva partida — ¿Quién lo dijo?',
    loadComponent: () => import('./features/setup/setup.page').then((m) => m.SetupPage),
  },
  {
    path: 'partida',
    pathMatch: 'full',
    title: 'Partida — ¿Quién lo dijo?',
    canActivate: [partidaActivaGuard],
    loadComponent: () => import('./features/board/board.page').then((m) => m.BoardPage),
  },
  {
    path: 'partida/resultado',
    title: 'Resultado — ¿Quién lo dijo?',
    canActivate: [partidaActivaGuard],
    loadComponent: () => import('./features/results/results.page').then((m) => m.ResultsPage),
  },
  { path: '**', redirectTo: '' },
];
