import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { inject } from '@angular/core';
import { NotifyServiceService } from '../service/notify-service.service';
import { response } from 'express';

export const authGuard: CanActivateFn = (route, state) => {
    // injection du service d'authentification
    const authService = inject(AuthService);
    // injection du router
    const router = inject(Router);

    const notificationService = inject(NotifyServiceService); 
    

    // C'est mieux d'utiliser une Promise car souvent
  // la fonction qui vérifie a besoin de faire une requête
  // à un serveur pour vérifier si l'utilisateur est bien
  // autorisé à accéder à la page. C'est ASYNCHRONE !
  // Donc la bonne pratique est d'implémenter isAdmin ou isLogged
  // comme une promesse qui renvoie un booléen.
  /*return authService.isAdmin()
  .then(admin => {
      console.log("isAdmin", admin);
      if (admin) {
        console.log("GUARD: Navigation autorisée");
        return true;
      } else {
        console.log("GUARD: Navigation NON autorisée");
        notificationService.error("Vous n'avez pas l'autorisation d'accéder à cette page.");
        router.navigate(['/home']);
        return false;
      }
    }
  )*/
  return authService.isVerify()
  .then(response => {
      if (response.loggedIn) {
        if(response.isAdmin){
          return true;
        }else{
          notificationService.error("Vous avez aucun droit pour cette action");
          return false;
        }
      } else {
        authService.logout();
        notificationService.error("une erreur s'est produit, veuillez se connecter");
        return false;
      }
    }
  )
};
