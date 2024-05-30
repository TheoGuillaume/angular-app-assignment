import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { response } from 'express';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
// import { environment } from '../../environements/environements';

interface AuthStatus {
  isAdmin: boolean;
  loggedIn: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedIn = false;
  isAdminUser = false;
  token = "";
   uri = "https://backend-projet-m2.onrender.com/api/login";
   url = "https://backend-projet-m2.onrender.com"
  // uri = "http://localhost:3500/api/login";
  // url = "http://localhost:3500";
  private localStorageKey = 'currentUser';


  constructor(private http: HttpClient,private router: Router) { 
      // Récupérer les données de l'utilisateur à partir de la local storage au démarrage du service
      const user = JSON.parse(localStorage.getItem(this.localStorageKey) || '{}');
      this.loggedIn = user.loggedIn || false;
      this.isAdminUser = user.isAdmin || false;
      this.token = user.token || null;
  }

  

  login(email: string, mdp: string): Observable<any> {
    try {
      return this.http.post(this.uri, { email, mdp })
        .pipe(
          tap((response: any) => {
            console.log("response", response);
            if (response.statue === 'ok') {
              console.log("ok");
            //  console.log(environment.apiUrl);
              // Update login status
              this.loggedIn = true;
              // Update admin status based on API response
              this.isAdminUser = response.data.ls_user.isAdmin;
              this.token = response.data.access_token;
              localStorage.setItem(this.localStorageKey, JSON.stringify({
                loggedIn: this.loggedIn,
                isAdmin: this.isAdminUser,
                token : this.token
              }));
              
            }
          }),
          catchError((error: HttpErrorResponse) => {
            let errorMessage = 'Une erreur s\'est produite lors de la connexion.';
            if (error.error && error.error.message) {
              errorMessage = error.error.message;
            }
            return throwError(errorMessage);
          })
        );
    } catch (error) {
      // Gestion des erreurs inattendues
      console.error('Une erreur inattendue s\'est produite :', error);
      throw error
    }
  }

  logout() {
    this.loggedIn = false;
    this.isAdminUser = false;
    // Effacer les données de l'utilisateur de la local storage lors de la déconnexion
    localStorage.removeItem(this.localStorageKey);
    this.router.navigate(['/home']);
  }

  getToken() : string | null{
    return this.token;
  }

  isVerify(): Promise<{ isAdmin: boolean, loggedIn: boolean }> {
    return Promise.resolve({ isAdmin: this.isAdminUser, loggedIn: this.loggedIn });
  }

  getIsAdmin() {
     return this.isAdminUser;
  }

  getPathChemin () {
     return this.url+'/'+'file'+'/'+'upload'+'/'+'image';
  }
  

}
