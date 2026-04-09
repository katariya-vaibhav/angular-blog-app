import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Blog, Comment } from '../models/models';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  blogs = signal<Blog[]>([]);
  refresh = signal<boolean>(false);

  constructor(private http: HttpClient) { }

  getAllBlogs(): Observable<any> {
    return this.http.get<any>('/api/v2/Blog/all').pipe(
      tap(res => {
        if (Array.isArray(res)) {
          this.blogs.set(res);
        }
      })
    );
  }

  getBlog(id: string): Observable<any> {
    return this.http.get<any>(`/api/v2/Blog/get/${id}`);
  }

  createBlog(formData: FormData): Observable<any> {
    return this.http.post<any>('/api/v2/Blog/upload', formData, { withCredentials: true }).pipe(
      tap(() => this.triggerRefresh())
    );
  }

  updateBlog(id: string, formData: FormData): Observable<any> {
    return this.http.put<any>(`/api/v2/Blog/update/${id}`, formData, { withCredentials: true }).pipe(
      tap(() => this.triggerRefresh())
    );
  }

  deleteBlog(id: string): Observable<any> {
    return this.http.delete<any>(`/api/v2/Blog/delete/${id}`, { withCredentials: true }).pipe(
      tap(() => this.triggerRefresh())
    );
  }

  getComments(blogId: string): Observable<any> {
    return this.http.get<any>(`/api/v2/comment/get-comment/${blogId}`, {
      withCredentials: true
    });
  }

  createComment(blogId: string, content: string): Observable<any> {
    return this.http.post<any>(`/api/v2/comment/create/${blogId}`, { content }, { withCredentials: true });
  }

  deleteComment(commentId: string): Observable<any> {
    return this.http.delete<any>(`/api/v2/comment/delete-comment/${commentId}`, { withCredentials: true });
  }

  updateComment(commentId: string, content: string): Observable<any> {
    return this.http.put<any>(
      `/api/v2/comment/update-comment/${commentId}`,
      { content },
      { withCredentials: true }
    );
  }

  genContent(prompt: string): Observable<any> {
    return this.http.post<any>('/api/v2/GenAI/gencontent', { prompt }, {
      withCredentials: true
    });
  }

  triggerRefresh() {
    this.refresh.set(!this.refresh());
  }
}
