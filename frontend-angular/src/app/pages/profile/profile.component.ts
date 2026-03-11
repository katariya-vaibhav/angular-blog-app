import { Component, OnInit, ViewChild, ElementRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { BlogService } from '../../services/blog.service';
import { BlogCardComponent } from '../../components/blog-card/blog-card.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, BlogCardComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  showModal = false;
  userData = { username: '', email: '' };
  newAvatar: File | null = null;
  
  @ViewChild('imageRef') imageRef!: ElementRef;

  constructor(
    public userService: UserService,
    public authService: AuthService,
    public blogService: BlogService,
    private http: HttpClient
  ) {
    effect(() => {
      const profile = this.userService.myProfile();
      if (profile?.user) {
        this.userData = {
          username: profile.user.username || '',
          email: profile.user.email || ''
        };
      }
    });

    effect(() => {
      if (this.blogService.refresh()) {
        this.fetchBlogsAndProfile();
      }
    });
  }

  ngOnInit() {
    this.fetchBlogsAndProfile();
  }

  fetchBlogsAndProfile() {
    this.userService.getMyProfile().subscribe();
    this.blogService.getAllBlogs().subscribe();
  }

  get userBlogs() {
    const profile = this.userService.myProfile();
    const blogs = this.blogService.blogs();
    if (!profile?.user?._id) return [];
    
    return blogs.filter(item => item?.owner?._id === profile.user._id);
  }

  handleAvatarChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.newAvatar = event.target.files[0];
    }
  }

  handleSubmit() {
    const formData = new FormData();
    formData.append("username", this.userData.username);
    formData.append("email", this.userData.email);

    if (this.newAvatar) {
      formData.append("avatar", this.newAvatar);
    }

    this.http.put<any>('/api/v2/users/change-user-details', formData, { withCredentials: true }).subscribe({
      next: (res) => {
        if (res.updateUser) {
          this.authService.setUser(res.updateUser);
          this.blogService.triggerRefresh();
          this.showModal = false;
        }
      },
      error: (err) => console.error("Error updating profile:", err)
    });
  }
}
