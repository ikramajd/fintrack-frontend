import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category, Dashboard, Goal, Transaction, TransactionFilter } from '../models/models';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

// Service HttpClient (session 5). Chaque appel transmet l'userId de l'utilisateur connecté.
@Injectable({ providedIn: 'root' })
export class ApiService {

  private api = environment.apiUrl;

  constructor(private http: HttpClient, private auth: AuthService) {}

  // Paramètre userId ajouté automatiquement à chaque requête
  private params(extra?: Record<string, unknown>): HttpParams {
    let p = new HttpParams().set('userId', String(this.auth.userId ?? ''));
    if (extra) {
      Object.entries(extra).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') p = p.set(k, String(v));
      });
    }
    return p;
  }

  // ---- Tableau de bord ----
  getDashboard(): Observable<Dashboard> {
    return this.http.get<Dashboard>(`${this.api}/dashboard`, { params: this.params() });
  }

  // ---- Transactions ----
  getTransactions(filter?: TransactionFilter): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.api}/transactions`, { params: this.params(filter as Record<string, unknown>) });
  }

  exportTransactions(): Observable<Blob> {
    return this.http.get(`${this.api}/transactions/export`, { params: this.params(), responseType: 'blob' });
  }

  createTransaction(t: Partial<Transaction>): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.api}/transactions`, t, { params: this.params() });
  }

  updateTransaction(id: number, t: Partial<Transaction>): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.api}/transactions/${id}`, t, { params: this.params() });
  }

  deleteTransaction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/transactions/${id}`, { params: this.params() });
  }

  // ---- Catégories ----
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.api}/categories`, { params: this.params() });
  }

  createCategory(c: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(`${this.api}/categories`, c, { params: this.params() });
  }

  updateCategory(id: number, c: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`${this.api}/categories/${id}`, c, { params: this.params() });
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/categories/${id}`, { params: this.params() });
  }

  // ---- Objectifs ----
  getGoals(): Observable<Goal[]> {
    return this.http.get<Goal[]>(`${this.api}/goals`, { params: this.params() });
  }

  createGoal(g: Partial<Goal>): Observable<Goal> {
    return this.http.post<Goal>(`${this.api}/goals`, g, { params: this.params() });
  }

  updateGoal(id: number, g: Partial<Goal>): Observable<Goal> {
    return this.http.put<Goal>(`${this.api}/goals/${id}`, g, { params: this.params() });
  }

  depositGoal(id: number, amount: number): Observable<Goal> {
    return this.http.post<Goal>(`${this.api}/goals/${id}/deposit`, { amount }, { params: this.params() });
  }

  deleteGoal(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/goals/${id}`, { params: this.params() });
  }
}
