import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-comments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-comments.html',
  styleUrl: './admin-comments.css',
})
export class AdminComments implements OnInit {
  comments: any[] = [];
  filteredComments: any[] = [];
  blogStats: any[] = [];
  searchTerm = '';
  isLoading = true;
  selectedBlogId = '';

  // Pagination
  currentPage = 1;
  pageSize = 15;

  private adminService = inject(AdminService);

  ngOnInit() {
    this.loadComments();
    this.loadBlogStats();
  }

  loadBlogStats() {
    this.adminService.getCommentStatsByBlog().subscribe({
      next: (res) => {
        this.blogStats = res || [];
      }
    });
  }

  loadComments() {
    this.isLoading = true;
    this.adminService.getAllComments().subscribe({
      next: (res) => {
        this.comments = res.comments || [];
        this.filteredComments = [...this.comments];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        Swal.fire('Error', 'Failed to load comments', 'error');
      },
    });
  }

  applyFilter() {
    let result = [...this.comments];

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(
        (c) =>
          c.content?.toLowerCase().includes(term) ||
          c.owner?.username?.toLowerCase().includes(term) ||
          c.blogId?.title?.toLowerCase().includes(term)
      );
    }

    if (this.selectedBlogId) {
      result = result.filter((c) => c.blogId?._id === this.selectedBlogId);
    }

    this.filteredComments = result;
    this.currentPage = 1;
  }

  filterByBlog(blogId: string) {
    this.selectedBlogId = this.selectedBlogId === blogId ? '' : blogId;
    this.applyFilter();
  }

  get paginatedComments(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredComments.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredComments.length / this.pageSize);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  deleteComment(commentId: string) {
    Swal.fire({
      title: 'Delete Comment?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#52525b',
      confirmButtonText: 'Yes, delete!',
      background: '#111218',
      color: '#fff',
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.adminDeleteComment(commentId).subscribe({
          next: () => {
            Swal.fire({
              title: 'Deleted!',
              text: 'Comment has been removed.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false,
              background: '#111218',
              color: '#fff',
            });
            this.comments = this.comments.filter((c) => c._id !== commentId);
            this.applyFilter();
          },
          error: (err) => {
            Swal.fire('Error', err.error?.error || 'Failed to delete comment', 'error');
          },
        });
      }
    });
  }
}
