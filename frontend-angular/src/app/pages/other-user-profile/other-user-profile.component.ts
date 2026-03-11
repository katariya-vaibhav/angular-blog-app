import { Component, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { BlogService } from '../../services/blog.service';
import { BlogCardComponent } from '../../components/blog-card/blog-card.component';

@Component({
  selector: 'app-other-user-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, BlogCardComponent],
  templateUrl: './other-user-profile.component.html',
  styleUrl: './other-user-profile.component.css'
})
export class OtherUserProfileComponent implements OnInit {
  id: string | null = null;
  
  constructor(
    private route: ActivatedRoute,
    public userService: UserService,
    public authService: AuthService,
    public blogService: BlogService
  ) {
    effect(() => {
      // Refresh blogs if needed
      if(this.blogService.refresh()) {
        this.blogService.getAllBlogs().subscribe();
        if (this.id) {
          this.userService.getOtherProfile(this.id).subscribe();
        }
      }
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (this.id) {
        this.userService.getOtherProfile(this.id).subscribe();
      }
    });
    this.blogService.getAllBlogs().subscribe();
  }

  get userBlogs() {
    const otherUser = this.userService.otherProfile();
    const blogs = this.blogService.blogs();
    if (!otherUser?.user?._id) return [];
    
    return blogs.filter(item => item?.owner?._id === otherUser.user._id);
  }
}
