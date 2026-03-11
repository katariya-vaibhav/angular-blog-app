import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminAuthGuard } from './guards/admin-auth-guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'sign-up', loadComponent: () => import('./pages/signup/signup.component').then(m => m.SignupComponent) },
  { path: 'create', loadComponent: () => import('./pages/create-blog/create-blog.component').then(m => m.CreateBlogComponent), canActivate: [authGuard] },
  { path: 'profile', loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent), canActivate: [authGuard] },
  { path: 'change-password', loadComponent: () => import('./pages/change-password/change-password.component').then(m => m.ChangePasswordComponent), canActivate: [authGuard] },
  { path: 'profile/:id', loadComponent: () => import('./pages/other-user-profile/other-user-profile.component').then(m => m.OtherUserProfileComponent) },
  { path: 'blog-details/:id', loadComponent: () => import('./pages/blog-details/blog-details').then(m => m.BlogDetails) },
  { path: 'admin/login', loadComponent: () => import('./pages/admin/admin-login/admin-login').then(m => m.AdminLogin) },
  { path: 'admin', loadComponent: () => import('./pages/admin/admin-layout/admin-layout').then(m => m.AdminLayout), canActivate: [adminAuthGuard], children: [
    { path: 'dashboard', loadComponent: () => import('./pages/admin/admin-dashboard/admin-dashboard').then(m => m.AdminDashboard) },
    { path: 'users', loadComponent: () => import('./pages/admin/admin-users/admin-users').then(m => m.AdminUsers) },
    { path: 'blogs', loadComponent: () => import('./pages/admin/admin-blogs/admin-blogs').then(m => m.AdminBlogs) },
    { path: 'comments', loadComponent: () => import('./pages/admin/admin-comments/admin-comments').then(m => m.AdminComments) },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
  ] },
  { path: '**', redirectTo: '' }
];
