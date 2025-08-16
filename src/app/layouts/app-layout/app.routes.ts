import { Routes } from "@angular/router";

export const appRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./app-layout.component').then(m => m.AppLayoutComponent),
        children: [
            
        ]
    }
]