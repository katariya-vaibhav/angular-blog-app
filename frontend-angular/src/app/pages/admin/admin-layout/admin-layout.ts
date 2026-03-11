import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AdminService } from '../../../services/admin';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {
  isMobileMenuOpen = false;

  private adminService = inject(AdminService);
  private router = inject(Router);

  get adminUser() {
    return this.adminService.admin$();
  }

  logout() {
    this.adminService.logout().subscribe({
      next: () => {
        this.router.navigate(['/admin/login']);
      }
    });
  }
}
