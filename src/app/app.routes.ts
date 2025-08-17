import { Routes } from '@angular/router';
import { appRoutes, authRoutes } from './layouts'

export const routes: Routes = [
    ...appRoutes,
    ...authRoutes,
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', redirectTo: 'home', pathMatch: 'full' },
];
