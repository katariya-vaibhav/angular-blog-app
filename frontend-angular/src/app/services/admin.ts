import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = '/api/v2/users';
  private blogUrl = '/api/v2/Blog';
  private commentUrl = '/api/v2/comment';
  admin$ = signal<any>(null);

  constructor(private http: HttpClient) {
    const admin = sessionStorage.getItem('adminUser');
    if (admin) {
      this.admin$.set(JSON.parse(admin));
    }
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/login`, data, { withCredentials: true }).pipe(
      tap((res: any) => {
        if (res && res.admin) {
          sessionStorage.setItem('adminUser', JSON.stringify(res.admin));
          this.admin$.set(res.admin);
        }
      })
    );
  }

  logout() {
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        sessionStorage.removeItem('adminUser');
        this.admin$.set(null);
      })
    );
  }

  isLoggedIn(): boolean {
    return this.admin$() !== null;
  }

  // Dashboard Stats
  getAdminStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/stats`, { withCredentials: true });
  }

  // Users
  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/users`, { withCredentials: true });
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/users/${id}`, { withCredentials: true });
  }

  // Blogs
  getAllBlogs(): Observable<any> {
    return this.http.get(`${this.blogUrl}/all`, { withCredentials: true });
  }

  adminDeleteBlog(id: string): Observable<any> {
    return this.http.delete(`${this.blogUrl}/admin/delete-blog/${id}`, { withCredentials: true });
  }

  // Comments
  getAllComments(): Observable<any> {
    return this.http.get(`${this.commentUrl}/admin/comments`, { withCredentials: true });
  }

  adminDeleteComment(id: string): Observable<any> {
    return this.http.delete(`${this.commentUrl}/admin/delete-comment/${id}`, { withCredentials: true });
  }

  getCommentStatsByBlog(): Observable<any> {
    return this.http.get(`${this.blogUrl}/admin/comment-stats`, { withCredentials: true });
  }
}
