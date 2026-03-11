import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BlogService } from '../../services/blog.service';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.component.css',
})
export class Header {
  constructor(
    public authService: AuthService,
    private blogService: BlogService,
    public userService: UserService,
    private router: Router
  ) {}

  signOutHandler() {
    this.authService.logout().subscribe({
      next: () => {
        localStorage.clear();
        this.userService.myProfile.set(null);
        this.userService.otherProfile.set(null);
        this.blogService.blogs.set([]);
        this.blogService.triggerRefresh();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.log("sign-out Error ", err);
      }
    });
  }
}
