import { Routes } from '@angular/router';

// Définition des routes (session 6)
export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'transactions',
    loadComponent: () => import('./features/transactions/transactions.component').then(m => m.TransactionsComponent)
  },
  {
    path: 'categories',
    loadComponent: () => import('./features/categories/categories.component').then(m => m.CategoriesComponent)
  },
  {
    // Route avec paramètre dynamique (session 6)
    path: 'categories/:id',
    loadComponent: () => import('./features/category-detail/category-detail.component').then(m => m.CategoryDetailComponent)
  },
  {
    path: 'goals',
    loadComponent: () => import('./features/goals/goals.component').then(m => m.GoalsComponent)
  },
  { path: '**', redirectTo: 'dashboard' }
];
