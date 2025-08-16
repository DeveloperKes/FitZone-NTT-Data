import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: 'home', loadComponent: () => import('./layouts').then(c => c.AppLayoutComponent) },
    { path: 'auth', loadComponent: () => import('./layouts').then(c => c.AuthLayoutComponent) },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
];
