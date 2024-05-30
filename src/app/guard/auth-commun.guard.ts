import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { NotifyServiceService } from '../service/notify-service.service';
import { inject } from '@angular/core';

export const authCommunGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  // injection du router
  const router = inject(Router);

  const notificationService = inject(NotifyServiceService);


  return authService.isVerify()
  .then(response => {
      if (response.loggedIn) {
        console.log("connecté");
         return true;
      } else {
        authService.logout();
        notificationService.error("une erreur s'est produit, veuillez se connecter");
        return false;
      }
    }
  )
  return true;
};
