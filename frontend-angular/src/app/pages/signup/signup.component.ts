import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  data = { username: '', email: '', password: '' };
  image: File | null = null;
  isLoading = false;
  
  @ViewChild('imageRef') imageRef!: ElementRef;

  constructor(private authService: AuthService, private router: Router) {}

  submitHandler() {
    if (!this.data.username || !this.data.email || !this.data.password) {
      Swal.fire('Error', 'Please fill in all required fields', 'error');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.data.email)) {
      Swal.fire('Error', 'Please enter a valid email address', 'error');
      return;
    }

    if (this.data.password.length < 6) {
      Swal.fire('Error', 'Password must be at least 6 characters long', 'error');
      return;
    }

    this.isLoading = true;

    const formData = new FormData();
    formData.append("username", this.data.username);
    formData.append("email", this.data.email);
    formData.append("password", this.data.password);
    if (this.image) {
      formData.append("avatar", this.image);
    }

    this.authService.register(formData).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res) {
          Swal.fire({
            title: 'Success!',
            text: 'Registration successful!',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
          this.data = { username: '', email: '', password: '' };
          this.image = null;
          this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.log('register error', err);
        Swal.fire('Error!', err.error?.error || 'Registration failed!', 'error');
      }
    });
  }

  handleFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.image = event.target.files[0];
    }
  }
}
