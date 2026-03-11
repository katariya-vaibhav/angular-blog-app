import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BlogService } from '../../services/blog.service';
import { AuthService } from '../../services/auth.service';
import { Blog } from '../../models/models';
import { CommentComponent } from '../../components/comment/comment.component';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-blog-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, CommentComponent, QuillModule],
  templateUrl: './blog-details.html',
  styleUrl: './blog-details.component.css',
})
export class BlogDetails implements OnInit {
  id: string | null = null;
  data: Blog | null = null;
  loading = true;
  editMode = false;
  titleInput = '';
  descriptionInput = '';
  categoryInput = '';
  imageFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public blogService: BlogService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (this.id) {
        this.fetchBlog();
      }
    });
  }

  fetchBlog() {
    if (!this.id) return;
    this.loading = true;
    this.blogService.getBlog(this.id).subscribe({
      next: (res) => {
        this.data = res;
        this.titleInput = res?.title || '';
        this.descriptionInput = res?.description || '';
        this.categoryInput = res?.category || '';
        this.imageFile = null;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching blog:', err);
        this.loading = false;
      }
    });
  }

  deleteHandler() {
    if (!this.id) return;
    this.blogService.deleteBlog(this.id).subscribe({
      next: () => {
        this.blogService.triggerRefresh();
        this.router.navigate(['/']);
      },
      error: (err) => console.error('Error deleting blog:', err)
    });
  }

  updateHandler() {
    if (!this.id) return;
    const formData = new FormData();
    formData.append('title', this.titleInput);
    formData.append('description', this.descriptionInput);
    formData.append('category', this.categoryInput);
    if (this.imageFile) {
      formData.append('image', this.imageFile);
    }

    this.blogService.updateBlog(this.id, formData).subscribe({
      next: () => {
        this.editMode = false;
        this.fetchBlog(); // Refresh local data
      },
      error: (err) => console.error('Error updating blog:', err)
    });
  }

  handleFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.imageFile = event.target.files[0];
    }
  }
}
