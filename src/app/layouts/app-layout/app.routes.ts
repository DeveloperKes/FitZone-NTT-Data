import { Routes } from "@angular/router";
import { coursesResolver, headquartersResolver } from "../../core/resolver";
import { categoriesResolver } from "../../core/resolver/categories.resolver";
import { authGuard } from "../../core/guards/auth.guard";
import { userProductsResolver } from "../../core/resolver/user-products.resolver";

export const appRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./app-layout.component').then(m => m.AppLayoutComponent),
        children: [
            { path: '', loadComponent: () => import('../../features').then(c => c.LandingComponent) },
            {
                path: 'home', canActivate: [authGuard], loadComponent: () => import('../../features').then(c => c.DashboardComponent),
                resolve: {
                    products: userProductsResolver
                }
            },
            {
                path: 'courses', loadComponent: () => import('../../features').then(c => c.CoursesComponent),
                resolve: {
                    courses: coursesResolver,
                    headquarters: headquartersResolver,
                    categories: categoriesResolver
                }
            },
            {
                path: 'course/details', loadComponent: () => import('../../shared/components').then(c => c.CourseDetailsComponent),
                outlet: "modal"
            },
            {
                path: 'filters', loadComponent: () => import('../../shared/components').then(c => c.FilterBoxComponent),
                outlet: "modal", resolve: {
                    headquarters: headquartersResolver,
                    categories: categoriesResolver
                }
            },
            {
                path: 'cart', loadComponent: () => import('../../shared/components').then(c => c.CartComponent),
                outlet: "modal",
            },
            {
                path: 'qrcode', loadComponent: () => import('../../shared/components').then(c => c.QrcodeComponent),
                outlet: "modal",
            },
            { path: '', redirectTo: 'home', pathMatch: 'full' },
        ]
    }
]