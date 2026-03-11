import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../../services/admin';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.css',
})
export class AdminLogin {
  data = { email: '', password: '' };
  isLoading = false;

  private adminService = inject(AdminService);
  private router = inject(Router);

  submitHandler() {
    if (!this.data.email || !this.data.password) {
      Swal.fire('Error', 'Please fill in all fields', 'error');
      return;
    }

    this.isLoading = true;

    this.adminService.login(this.data).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res) {
          Swal.fire({
            title: 'Welcome Admin!',
            text: 'Login successful',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
          });
          this.router.navigate(['/admin/dashboard']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Admin login error', err);
        Swal.fire('Error!', err.error?.error || 'Admin login failed', 'error');
      },
    });
  }
}

