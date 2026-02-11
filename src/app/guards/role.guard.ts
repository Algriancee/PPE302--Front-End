import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../service/auth.service';

export const roleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  if (!token) {
    return router.createUrlTree(['/connexion']);
  }

  const userRole = authService.decodeRole(token)?.toLowerCase();
  const allowedRoles: string[] = route.data['allowedRoles']?.map((r: string) => r.toLowerCase()) || [];

  return allowedRoles.includes(userRole)
    ? true
    : router.createUrlTree(['/unauthorized']);
};