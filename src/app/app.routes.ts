import { Routes } from '@angular/router';
import { appRoutes } from './layouts'

export const routes: Routes = [
    ...appRoutes,
    { path: 'auth', loadComponent: () => import('./layouts').then(c => c.AuthLayoutComponent) },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
];
