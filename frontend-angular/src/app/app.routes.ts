import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'sign-up', loadComponent: () => import('./pages/signup/signup.component').then(m => m.SignupComponent) },
  { path: 'create', loadComponent: () => import('./pages/create-blog/create-blog.component').then(m => m.CreateBlogComponent), canActivate: [authGuard] },
  { path: 'profile', loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent), canActivate: [authGuard] },
  { path: 'change-password', loadComponent: () => import('./pages/change-password/change-password.component').then(m => m.ChangePasswordComponent), canActivate: [authGuard] },
  { path: 'profile/:id', loadComponent: () => import('./pages/other-user-profile/other-user-profile.component').then(m => m.OtherUserProfileComponent) },
  { path: 'blog-details/:id', loadComponent: () => import('./pages/blog-details/blog-details').then(m => m.BlogDetails) },
  { path: '**', redirectTo: '' }
];
