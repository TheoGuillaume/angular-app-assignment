import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Assignment } from './assignment/assignment.model';
import { AuthService } from './service/auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AssignmentsService {

  constructor(private http:HttpClient,  private authService: AuthService, private router: Router) { }

  uri = "https://backend-projet-m2.onrender.com/api/assignments";
  //uri = "http://localhost:3500/api/assignments";

  // retourne tous les assignments
  getAssignments():Observable<Assignment[]> {
    return this.http.get<Assignment[]>(this.uri);
  }

  getAssignmentsRendu(limit: number, page: number, rendu: boolean) : Observable<any> {
    //console.log("this.authService.getToken", this.authService.getToken())
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}` // Use the token from AuthService
    });

    return this.http.get<Assignment[]>(`${this.uri}?rendu=${rendu}&page=${page}&limit=${limit}`, { headers })
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

  

  getAssignmentsPagines(page:number, limit:number):Observable<any> {
    //console.log("this.authService.getToken", this.authService.getToken())
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}` // Use the token from AuthService
    });

    return this.http.get<Assignment[]>(`${this.uri}?page=${page}&limit=${limit}`, { headers })
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

  // renvoie un assignment par son id, renvoie undefined si pas trouvé
  getAssignment(id:string):Observable<Assignment|undefined> {
    return this.http.get<Assignment>(this.uri + "/" + id)
    .pipe(
           catchError(this.handleError<any>('### catchError: getAssignments by id avec id=' + id))
    );
    //let a = this.assignments.find(a => a.id === id);
    //return of(a);
  }

  // Methode appelée par catchError, elle doit renvoyer
  // i, Observable<T> où T est le type de l'objet à renvoyer
  // (généricité de la méthode)

  private handleError<T>(operation: any, result?: T) {
    return (error: any): Observable<T> => {
      console.log(error); // pour afficher dans la console
      console.log(operation + ' a échoué ' + error.message);

      return of(result as T);
    }
 };

  // ajoute un assignment et retourne une confirmation
  addAssignment(data : any):Observable<any> {
    //this.assignments.push(assignment);
    // this.logService.log(assignment.nom, "ajouté");
    //return of("Assignment ajouté avec succès");
    return this.http.post<Assignment>(this.uri, data);
  }

  updateAssignment(assignment:Assignment):Observable<any> {
   // l'assignment passé en paramètre est le même objet que dans le tableau
   // plus tard on verra comment faire avec une base de données
   // il faudra faire une requête HTTP pour envoyer l'objet modifié
    // this.logService.log(assignment.nom, "modifié");
    //return of("Assignment modifié avec succès");
    console.log("szszsz0", assignment)
    return this.http.put<Assignment>(this.uri, {assignment : assignment});
  }
  updateAssignments(assignment:any):Observable<any> {
    // l'assignment passé en paramètre est le même objet que dans le tableau
    // plus tard on verra comment faire avec une base de données
    // il faudra faire une requête HTTP pour envoyer l'objet modifié
     // this.logService.log(assignment.nom, "modifié");
     //return of("Assignment modifié avec succès");
     return this.http.put<Assignment>(this.uri, assignment);
   }
  deleteAssignment(assignment:Assignment):Observable<any> {
    // on va supprimer l'assignment dans le tableau
    //let pos = this.assignments.indexOf(assignment);
    //this.assignments.splice(pos, 1);
    // this.logService.log(assignment.nom, "supprimé");
    //return of("Assignment supprimé avec succès");
    return this.http.delete(this.uri + "/" + assignment._id);
  }



}
