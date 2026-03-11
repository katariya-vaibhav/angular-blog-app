import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent {
  data = { oldPassword: '', newPassword: '', confirmPassword: '' };
  message = '';

  constructor(private http: HttpClient) {}

  submitHandler() {
    this.message = '';
    if (!this.data.oldPassword || !this.data.newPassword) {
      this.message = 'Old password and new password are required.';
      return;
    }
    if (this.data.newPassword !== this.data.confirmPassword) {
      this.message = 'New password and confirm password do not match.';
      return;
    }

    this.http
      .put<any>(
        '/api/v2/users/change-password',
        { oldPassword: this.data.oldPassword, newPassword: this.data.newPassword },
        { withCredentials: true }
      )
      .subscribe({
        next: (res) => {
          this.message = res?.message || 'Password updated successfully.';
          this.data = { oldPassword: '', newPassword: '', confirmPassword: '' };
        },
        error: (err) => {
          this.message = err?.error?.message || err?.error?.error || 'Failed to update password.';
        },
      });
  }
}

