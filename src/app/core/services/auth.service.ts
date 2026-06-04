import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { User } from '../models/models';
import { environment } from '../../environments/environment';

// Service d'authentification (session 5) — stocke l'utilisateur connecté dans localStorage
@Injectable({ providedIn: 'root' })
export class AuthService {

  private api = environment.apiUrl;
  private readonly KEY = 'fintrack_user';
  currentUser: User | null = null;

  constructor(private http: HttpClient, private router: Router) {
    const saved = localStorage.getItem(this.KEY);
    if (saved) this.currentUser = JSON.parse(saved);
  }

  register(data: { name: string; email: string; password: string }): Observable<User> {
    return this.http.post<User>(`${this.api}/auth/register`, data).pipe(
      tap(user => this.store(user))
    );
  }

  login(data: { email: string; password: string }): Observable<User> {
    return this.http.post<User>(`${this.api}/auth/login`, data).pipe(
      tap(user => this.store(user))
    );
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem(this.KEY);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  get userId(): number | null {
    return this.currentUser?.id ?? null;
  }

  private store(user: User): void {
    this.currentUser = user;
    localStorage.setItem(this.KEY, JSON.stringify(user));
  }
}
