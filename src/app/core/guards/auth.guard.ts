import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services';

export const authGuard: CanActivateFn = (route, state) => {
  const user = inject(UserService);
  const router = inject(Router);
  if (user.current) return true;
  router.navigate(["auth", "login"]);
  return false;
};
export const withoutUserGuard: CanActivateFn = (route, state) => {
  const user = inject(UserService);
  const router = inject(Router);
  if (!user.current) return true;
  router.navigate(["home"]);
  return false;
};
