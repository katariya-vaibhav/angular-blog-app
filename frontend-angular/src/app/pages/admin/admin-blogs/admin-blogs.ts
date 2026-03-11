import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-blogs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-blogs.html',
  styleUrl: './admin-blogs.css',
})
export class AdminBlogs implements OnInit {
  blogs: any[] = [];
  filteredBlogs: any[] = [];
  categories: string[] = [];
  searchTerm = '';
  selectedCategory = '';
  isLoading = true;

  // Pagination
  currentPage = 1;
  pageSize = 10;

  private adminService = inject(AdminService);

  ngOnInit() {
    this.loadBlogs();
  }

  loadBlogs() {
    this.isLoading = true;
    this.adminService.getAllBlogs().subscribe({
      next: (res) => {
        if (Array.isArray(res)) {
          this.blogs = res;
          this.categories = [...new Set(res.map((b: any) => b.category).filter(Boolean))];
          this.applyFilters();
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        Swal.fire('Error', 'Failed to load blogs', 'error');
      },
    });
  }

  applyFilters() {
    let result = [...this.blogs];

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(
        (b) =>
          b.title?.toLowerCase().includes(term) ||
          b.owner?.username?.toLowerCase().includes(term)
      );
    }

    if (this.selectedCategory) {
      result = result.filter((b) => b.category === this.selectedCategory);
    }

    this.filteredBlogs = result;
    this.currentPage = 1;
  }

  get paginatedBlogs(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredBlogs.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredBlogs.length / this.pageSize);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  deleteBlog(id: string, title: string) {
    Swal.fire({
      title: 'Delete Blog?',
      text: `Are you sure you want to delete "${title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#52525b',
      confirmButtonText: 'Yes, delete!',
      background: '#111218',
      color: '#fff',
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.adminDeleteBlog(id).subscribe({
          next: () => {
            Swal.fire({
              title: 'Deleted!',
              text: 'Blog has been removed.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false,
              background: '#111218',
              color: '#fff',
            });
            this.blogs = this.blogs.filter((b) => b._id !== id);
            this.applyFilters();
          },
          error: (err) => {
            Swal.fire('Error', err.error?.error || 'Failed to delete blog', 'error');
          },
        });
      }
    });
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.applyFilters();
  }
}
