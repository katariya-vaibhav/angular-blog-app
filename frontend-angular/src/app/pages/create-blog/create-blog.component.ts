import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { QuillModule } from 'ngx-quill';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-blog',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule],
  templateUrl: './create-blog.component.html',
  styleUrl: './create-blog.component.css'
})
export class CreateBlogComponent {
  data = { title: '', category: '' };
  description = '';
  image: File | null = null;
  isLoading = false;
  isGenerating = false;

  @ViewChild('imageRef') imageRef!: ElementRef;

  constructor(private blogService: BlogService, private router: Router) {}

  submitHandler() {
    if (!this.data.title || !this.data.category || !this.description) {
      Swal.fire('Error', 'Please provide a title, category, and content.', 'error');
      return;
    }

    this.isLoading = true;

    const formData = new FormData();
    formData.append('title', this.data.title);
    formData.append('description', this.description);
    formData.append('category', this.data.category);
    if (this.image) {
      formData.append('image', this.image);
    }

    this.blogService.createBlog(formData).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res) {
          Swal.fire({
            title: 'Success!',
            text: res.message || 'Blog Created successful!',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
          this.data = { title: '', category: '' };
          this.description = '';
          this.image = null;
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.log('blog create error', err);
        Swal.fire('Error!', err.error?.error || 'blog created failed!', 'error');
      }
    });
  }

  handleFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.image = event.target.files[0];
    }
  }

  genContent() {
    if (!this.data.title) {
      Swal.fire('Warning', 'Please provide a title to act as a prompt for AI', 'warning');
      return;
    }

    this.isGenerating = true;
    this.blogService.genContent(this.data.title).subscribe({
      next: (res) => {
        this.isGenerating = false;
        if (res && res.text) {
          this.description = `<pre>${res.text}</pre>`;
          Swal.fire({
             title: 'Generated!',
             text: 'Content generated successfully from title.',
             icon: 'success',
             timer: 2000,
             showConfirmButton: false
          });
        }
      },
      error: (err) => {
        this.isGenerating = false;
        console.log('error while gen content', err);
        Swal.fire('Error', 'Failed to generate content', 'error');
      }
    });
  }
}
