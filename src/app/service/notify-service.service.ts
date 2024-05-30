import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotifyServiceService {

  constructor(private snackBar: MatSnackBar) {}

  // Méthode pour afficher une notification d'erreur
  error(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 5000, // Durée de la notification en millisecondes (5 secondes)
      panelClass: ['error-notification'] // Classe CSS pour le style de la notification d'erreur
    });
  }

  success(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 5000, // Durée de la notification en millisecondes (5 secondes)
      panelClass: ['success-notification'] // Classe CSS pour le style de la notification de succès
    });
  }
}
