import { Routes } from "@angular/router";

export const appRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./app-layout.component').then(m => m.AppLayoutComponent),
        children: [
            { path: '', loadComponent: () => import('../../features/home').then(c => c.LandingComponent) }
        ]
    }
]