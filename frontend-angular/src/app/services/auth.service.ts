import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/models';
import { Observable, catchError, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser = signal<User | null>(null);

  constructor(private http: HttpClient) { }

  loadCurrentUser(): Observable<any> {
    return this.http.get<any>('/api/v2/users/get-current-user', { withCredentials: true }).pipe(
      tap((res) => {
        const user = res?.userData?.user ?? null;
        this.currentUser.set(user);
      }),
      catchError((err) => {
        this.currentUser.set(null);
        return of(null);
      })
    );
  }

  login(data: any): Observable<any> {
    return this.http.post<any>('/api/v2/users/login', data, { withCredentials: true }).pipe(
      tap(res => {
        if (res && res.loggedInUser) {
          this.currentUser.set(res.loggedInUser);
        }
      })
    );
  }

  register(formData: FormData): Observable<any> {
    return this.http.post<any>('/api/v2/users/register', formData);
  }

  logout(): Observable<any> {
    return this.http.post<any>('/api/v2/users/logout', {}, { withCredentials: true }).pipe(
      tap(() => {
        this.currentUser.set(null);
      })
    );
  }

  setUser(user: User | null) {
    this.currentUser.set(user);
  }
}
