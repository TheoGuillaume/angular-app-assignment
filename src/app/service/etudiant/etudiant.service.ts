import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Etudiant } from '../../Model/etudiant.model';

@Injectable({
  providedIn: 'root'
})
export class EtudiantService {


  constructor(private http:HttpClient,  private authService: AuthService, private router: Router) { }

  //uri = "http://localhost:3500/api/auteur";
  uri = "https://backend-projet-m2.onrender.com/api/auteur";

  getsEtudiants(search: string,page: number, limit: number):Observable<any> {

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}` // Use the token from AuthService
    });

    return this.http.get<Etudiant[]>(`${this.uri}?search=${search}&page=${page}&limit=${limit}`, { headers })
    .pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {

          this.authService.logout();
          // Rediriger vers la page d'accueil en cas d'erreur 403 (token invalide ou expiré)
        }
        // Propager l'erreur au composant consommateur
        throw error;
      })
    );

  }

  addEtudiant(etudiant : Etudiant, file : File) : Observable<Etudiant>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}` // Use the token from AuthService
    });

    const formData = new FormData();
    formData.append('nom', etudiant.nom);
    formData.append('prenom', etudiant.prenom);
    formData.append('dateNaissance', etudiant.dateNaissance.toISOString());
    if (file) {
      formData.append('photo', file, file.name);
    }
    return this.http.post<Etudiant>(this.uri, formData, {headers}).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {

          this.authService.logout();
          // Rediriger vers la page d'accueil en cas d'erreur 403 (token invalide ou expiré)
        }
        // Propager l'erreur au composant consommateur
        throw error;
      })
    );
  }

  updateEtudiant(data : {id: string, etudiant : Etudiant}, file : File | null): Observable<Etudiant>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}` // Use the token from AuthService
    });

    const formData = new FormData();
    formData.append('id', data.id);
    formData.append('etudiant', JSON.stringify(data.etudiant));
    if (file) {
      formData.append('photo', file, file.name);
    }
    
    return this.http.put<Etudiant>(this.uri, formData, {headers}).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {

          this.authService.logout();
          // Rediriger vers la page d'accueil en cas d'erreur 403 (token invalide ou expiré)
        }
        // Propager l'erreur au composant consommateur
        throw error;
      })
    );
  }

  getEtudiant(id : string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}` // Use the token from AuthService
    });

    return this.http.get<Etudiant>(`${this.uri}/${id}`, {headers}).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          this.authService.logout();
          // Rediriger vers la page d'accueil en cas d'erreur 403 (token invalide ou expiré)
        }

        if(error.status === 500) {
          this.authService.logout();
        }
        // Propager l'erreur au composant consommateur
        throw error;
      })
    );
  }

}
