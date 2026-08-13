import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: '¿Quién lo dijo? — Jesús vs. Karl Marx',
    loadComponent: () => import('./features/welcome/welcome.page').then((m) => m.WelcomePage),
  },
  { path: '**', redirectTo: '' },
];
