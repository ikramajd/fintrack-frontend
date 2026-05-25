import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category, Dashboard, Goal, Transaction, TransactionFilter } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Dashboard
  getDashboard(): Observable<Dashboard> {
    return this.http.get<Dashboard>(`${this.api}/dashboard`);
  }

  // Transactions
  getTransactions(filter?: TransactionFilter): Observable<Transaction[]> {
    let params = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          params = params.set(key, String(val));
        }
      });
    }
    return this.http.get<Transaction[]>(`${this.api}/transactions`, { params });
  }

  createTransaction(t: Partial<Transaction>): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.api}/transactions`, t);
  }

  updateTransaction(id: number, t: Partial<Transaction>): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.api}/transactions/${id}`, t);
  }

  deleteTransaction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/transactions/${id}`);
  }

  // Categories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.api}/categories`);
  }

  createCategory(c: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(`${this.api}/categories`, c);
  }

  updateCategory(id: number, c: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`${this.api}/categories/${id}`, c);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/categories/${id}`);
  }

  // Goals
  getGoals(): Observable<Goal[]> {
    return this.http.get<Goal[]>(`${this.api}/goals`);
  }

  createGoal(g: Partial<Goal>): Observable<Goal> {
    return this.http.post<Goal>(`${this.api}/goals`, g);
  }

  updateGoal(id: number, g: Partial<Goal>): Observable<Goal> {
    return this.http.put<Goal>(`${this.api}/goals/${id}`, g);
  }

  depositGoal(id: number, amount: number): Observable<Goal> {
    return this.http.patch<Goal>(`${this.api}/goals/${id}/deposit`, { amount });
  }

  deleteGoal(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/goals/${id}`);
  }
}
