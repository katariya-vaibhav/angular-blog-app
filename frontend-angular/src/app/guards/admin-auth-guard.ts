import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AdminService } from '../services/admin';

export const adminAuthGuard: CanActivateFn = (route, state) => {
  const adminService = inject(AdminService);
  const router = inject(Router);

  if (adminService.isLoggedIn()) {
    return true;
  }
  
  router.navigate(['/admin/login']);
  return false;
};
