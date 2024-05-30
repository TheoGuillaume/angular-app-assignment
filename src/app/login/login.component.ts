import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatCardModule,MatInputModule,MatButtonModule,CommonModule,ReactiveFormsModule,MatProgressSpinnerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  form: FormGroup = new FormGroup({
    email: new FormControl('guillaume1.haisoa@gmail.com'),
    mdp: new FormControl('123456'),
  });
  error: string | null | undefined;
  isLoading: boolean = false; // Ajout de la propriété pour gérer l'état du spinner


  constructor(private authService: AuthService,private router: Router) {} // Injectez le service AuthService

 
  submit() {
    this.isLoading = true; // Commencez par activer le spinner
    const { email, mdp } = this.form.value;
    
    // Utilisez setTimeout pour ajouter un délai avant que le spinner n'apparaisse
   
      this.authService.login(email, mdp).subscribe(
        (response:any) => {
          //this.toastr.success('Connexion', 'réussi', {timeOut : 5000});
          this.router.navigateByUrl('/acceuil');
        },
        (error: string) => {
          // Gestion de l'erreur de connexion
          this.error = error;
        }
      ).add(() => {
        this.isLoading = false; // Assurez-vous d'arrêter le spinner que la requête soit réussie ou non
      });
    // 2000ms (2 secondes) de délai avant que le spinner n'apparaisse
  }
}
