import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../services/admin';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  totalUsers = 0;
  totalBlogs = 0;
  totalComments = 0;
  users: any[] = [];
  blogs: any[] = [];
  recentUsers: any[] = [];
  recentBlogs: any[] = [];
  activeUserCount = 0;
  categoryMap: { name: string; count: number; color: string }[] = [];
  isLoading = true;

  private adminService = inject(AdminService);

  private categoryColors = [
    '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6',
    '#ec4899', '#06b6d4', '#f97316', '#14b8a6', '#6366f1',
  ];

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    let loaded = 0;
    const check = () => { loaded++; if (loaded >= 3) this.isLoading = false; };

    this.adminService.getAdminStats().subscribe({
      next: (res) => {
        this.totalUsers = res.totalUsers || 0;
        this.totalBlogs = res.totalBlogs || 0;
        this.totalComments = res.totalComments || 0;
        check();
      },
      error: () => check(),
    });

    this.adminService.getAllUsers().subscribe({
      next: (res) => {
        this.users = res.users || [];
        this.recentUsers = this.users.slice(0, 5);
        this.activeUserCount = this.users.filter((u: any) => u.posts && u.posts.length > 0).length;
        check();
      },
      error: () => check(),
    });

    this.adminService.getAllBlogs().subscribe({
      next: (res) => {
        if (Array.isArray(res)) {
          this.blogs = res;
          this.recentBlogs = res.slice(0, 5);
          this.buildCategoryMap(res);
        }
        check();
      },
      error: () => check(),
    });
  }

  private buildCategoryMap(blogs: any[]) {
    const map: Record<string, number> = {};
    blogs.forEach((b) => {
      const cat = b.category || 'Uncategorized';
      map[cat] = (map[cat] || 0) + 1;
    });
    this.categoryMap = Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count], i) => ({
        name,
        count,
        color: this.categoryColors[i % this.categoryColors.length],
      }));
  }

  getCategoryPercent(count: number): number {
    return this.totalBlogs > 0 ? Math.round((count / this.totalBlogs) * 100) : 0;
  }
}
