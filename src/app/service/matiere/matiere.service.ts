import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Matiere } from '../../Model/matiere.model';
import { Etudiant } from '../../Model/etudiant.model';
@Injectable({
  providedIn: 'root'
})
export class MatiereService {

  constructor(private http:HttpClient,  private authService: AuthService, private router: Router) { }

  //uri = "http://localhost:3500/api/matiere";
  uri = "https://backend-projet-m2.onrender.com/api/matiere";

  getMatieres (search: string,page: number, limit: number):Observable<any> {

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}` // Use the token from AuthService
    });

    return this.http.get<Matiere[]>(`${this.uri}?search=${search}&page=${page}&limit=${limit}`, { headers })
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

  addMatiere(matiere : Matiere, fileProf : File, fileMatiere : File) : Observable<Matiere>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}` // Use the token from AuthService
    });

    const formData = new FormData();
    formData.append('nom', matiere.nom);
    formData.append('professeur', matiere.professeur);
    if (fileProf) {
      formData.append('photo_prof', fileProf, fileProf.name);
    }
    if(fileMatiere) {
      formData.append('photo', fileMatiere, fileMatiere.name);
    }

    return this.http.post<Matiere>(this.uri, formData, {headers}).pipe(
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

  getMatiere(id : string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}` // Use the token from AuthService
    });

    return this.http.get<Matiere>(`${this.uri}/${id}`, {headers}).pipe(
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

  updateMatiere(data : {id: string, matiere : Matiere}, fileProf : File | null, fileMatiere : File | null): Observable<Matiere>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}` // Use the token from AuthService
    });

    const formData = new FormData();
    formData.append('id', data.id);
    formData.append('matiere', JSON.stringify(data.matiere));
    if (fileProf) {
      formData.append('photo_prof', fileProf, fileProf.name);
    }
    if(fileMatiere) {
      formData.append('photo', fileMatiere, fileMatiere.name);
    }

    console.log("formData", formData);
    
    return this.http.put<Matiere>(this.uri, formData, {headers}).pipe(
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

}
