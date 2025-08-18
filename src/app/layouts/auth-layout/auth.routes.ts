import { Routes } from "@angular/router";
import { withoutUserGuard } from "../../core/guards/auth.guard";

export const authRoutes: Routes = [
    {
        path: '',
        canActivate: [withoutUserGuard],
        loadComponent: () => import('./auth-layout.component').then(m => m.AuthLayoutComponent),
        children: [
            { path: 'auth/register', loadComponent: () => import('../../features/auth').then(c => c.RegisterFormComponent) },
            { path: 'auth/login', loadComponent: () => import('../../features/auth').then(c => c.LoginFormComponent) },
            { path: "", redirectTo: '/auth/login', pathMatch: 'full' }
        ]
    }
]