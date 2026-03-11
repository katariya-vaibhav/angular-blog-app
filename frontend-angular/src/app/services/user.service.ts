import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CurrentUserData, OtherUserData } from '../models/models';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  myProfile = signal<CurrentUserData | null>(null);
  otherProfile = signal<OtherUserData | null>(null);

  constructor(private http: HttpClient) { }

  getMyProfile(): Observable<any> {
    return this.http.get<any>('/api/v2/users/get-current-user', { withCredentials: true }).pipe(
      tap(res => {
        if (res && res.userData) {
          this.myProfile.set(res.userData);
        }
      })
    );
  }

  getOtherProfile(id: string): Observable<any> {
    return this.http.get<any>(`/api/v2/users/get-user/${id}`, { withCredentials: true }).pipe(
      tap(res => {
        if (res) {
          this.otherProfile.set(res);
        }
      })
    );
  }

  setMyProfile(profile: CurrentUserData | null) {
    this.myProfile.set(profile);
  }

  setOtherProfile(profile: OtherUserData | null) {
    this.otherProfile.set(profile);
  }
}
