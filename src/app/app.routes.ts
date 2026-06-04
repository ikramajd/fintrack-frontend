import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

// Définition des routes (session 6). Les pages privées sont protégées par authGuard.
export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  // Pages publiques
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register.component').then(m => m.RegisterComponent)
  },

  // Pages privées (protégées par le guard)
  {
    path: 'dashboard', canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'transactions', canActivate: [authGuard],
    loadComponent: () => import('./features/transactions/transactions.component').then(m => m.TransactionsComponent)
  },
  {
    path: 'categories', canActivate: [authGuard],
    loadComponent: () => import('./features/categories/categories.component').then(m => m.CategoriesComponent)
  },
  {
    path: 'categories/:id', canActivate: [authGuard],
    loadComponent: () => import('./features/category-detail/category-detail.component').then(m => m.CategoryDetailComponent)
  },
  {
    path: 'goals', canActivate: [authGuard],
    loadComponent: () => import('./features/goals/goals.component').then(m => m.GoalsComponent)
  },

  { path: '**', redirectTo: 'dashboard' }
];
