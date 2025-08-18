import { Routes } from "@angular/router";
import { withoutUserGuard } from "../../core/guards";

export const authRoutes: Routes = [
    {
        path: 'auth',
        canActivate: [withoutUserGuard],
        loadComponent: () => import('./auth-layout.component').then(m => m.AuthLayoutComponent),
        children: [
            { path: 'register', loadComponent: () => import('../../features/auth').then(c => c.RegisterFormComponent) },
            { path: 'login', loadComponent: () => import('../../features/auth').then(c => c.LoginFormComponent) },
            { path: "", redirectTo: 'login', pathMatch: 'full' }
        ]
    }
]