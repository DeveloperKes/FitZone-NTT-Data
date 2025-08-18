import { Routes } from "@angular/router";
import { coursesResolver, headquartersResolver } from "../../core/resolver";
import { categoriesResolver } from "../../core/resolver/categories.resolver";

export const appRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./app-layout.component').then(m => m.AppLayoutComponent),
        children: [
            { path: '', loadComponent: () => import('../../features').then(c => c.LandingComponent) },
            { path: 'home', loadComponent: () => import('../../features').then(c => c.DashboardComponent) },
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
        ]
    }
]