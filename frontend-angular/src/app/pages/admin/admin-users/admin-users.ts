import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css',
})
export class AdminUsers implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  searchTerm = '';
  isLoading = true;

  // Pagination
  currentPage = 1;
  pageSize = 10;

  private adminService = inject(AdminService);

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.adminService.getAllUsers().subscribe({
      next: (res) => {
        this.users = res.users || [];
        this.filteredUsers = [...this.users];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        Swal.fire('Error', 'Failed to load users', 'error');
      },
    });
  }

  applyFilter() {
    if (!this.searchTerm.trim()) {
      this.filteredUsers = [...this.users];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredUsers = this.users.filter(
        (u) =>
          u.username?.toLowerCase().includes(term) ||
          u.email?.toLowerCase().includes(term)
      );
    }
    this.currentPage = 1;
  }

  get paginatedUsers(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredUsers.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.pageSize);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  deleteUser(id: string, username: string) {
    Swal.fire({
      title: 'Delete User?',
      text: `Are you sure you want to delete "${username}"? This will also remove all their blog posts.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#52525b',
      confirmButtonText: 'Yes, delete!',
      background: '#111218',
      color: '#fff',
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.deleteUser(id).subscribe({
          next: () => {
            Swal.fire({
              title: 'Deleted!',
              text: 'User has been removed.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false,
              background: '#111218',
              color: '#fff',
            });
            this.users = this.users.filter((u) => u._id !== id);
            this.applyFilter();
          },
          error: (err) => {
            Swal.fire('Error', err.error?.error || 'Failed to delete user', 'error');
          },
        });
      }
    });
  }
}
