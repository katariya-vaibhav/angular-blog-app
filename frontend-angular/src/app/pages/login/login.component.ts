import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BlogService } from '../../services/blog.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  data = { email: '', password: '' };
  isLoading = false;

  constructor(
    private authService: AuthService, 
    private blogService: BlogService,
    private router: Router
  ) {}

  submitHandler() {
    if (!this.data.email || !this.data.password) {
      Swal.fire('Error', 'Please fill in all fields', 'error');
      return;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.data.email)) {
      Swal.fire('Error', 'Please enter a valid email address', 'error');
      return;
    }

    this.isLoading = true;

    this.authService.login(this.data).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res) {
          Swal.fire({
            title: 'Success!',
            text: res.message || 'Login successful!',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
          this.blogService.triggerRefresh();
          this.router.navigate(['/']);
          this.data = { email: '', password: '' };
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.log('log error', err);
        Swal.fire('Error!', err.error?.error || 'Login failed! An error occurred.', 'error');
      }
    });
  }
}
