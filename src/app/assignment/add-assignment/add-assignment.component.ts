import { Component,OnInit } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { SidenavComponent } from '../../sidenav/sidenav.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import { MatiereService } from '../../service/matiere/matiere.service';
import { EtudiantService } from '../../service/etudiant/etudiant.service';
import { Assignment } from '../assignment.model';
import { AssignmentsService } from '../../assignment.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { NotifyServiceService } from '../../service/notify-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-add-assignment',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [NavbarComponent,SidenavComponent,MatSidenavModule,
    FormsModule,ReactiveFormsModule,MatButtonModule,MatFormFieldModule,MatInputModule,MatStepperModule,
    MatDatepickerModule,MatIconModule,MatSelectModule,MatProgressSpinnerModule,CommonModule],
  templateUrl: './add-assignment.component.html',
  styleUrl: './add-assignment.component.css'
})
export class AddAssignmentComponent implements OnInit {
  firstFormGroup = this._formBuilder.group({
    titre: ['', Validators.required],
    dateDeRendu: ['', Validators.required]
  });
  secondFormGroup = this._formBuilder.group({
    description: ['', Validators.required],
    remarque: ['', Validators.required],
  });
  threeFormGroup = this._formBuilder.group({
    matiere: ['', Validators.required],
    auteur: ['', Validators.required],
  });
  isEditable = false;
  listMatiere : any;
 listeEtudiant : any;
 isLoading = false;

  constructor(private _formBuilder: FormBuilder,private matiereService : MatiereService, 
    private etudiantService : EtudiantService, private assignmentService : AssignmentsService, 
    private notifyService : NotifyServiceService,private router: Router) {}

  ngOnInit(): void {
      this.fetchData()
  }

  fetchData() {
    this.matiereService.getMatieres("", 1, 100).subscribe((response:any) => {
       this.listMatiere = response.data.docs
    })
    this.etudiantService.getsEtudiants("", 1, 100).subscribe((response:any) => {
      this.listeEtudiant = response.data.docs
    })
 }

  addAssignment() {
    try {
    this.isLoading = true;
    const titre = this.firstFormGroup.get('titre')?.value;
    const dateDeRendu = this.firstFormGroup.get('dateDeRendu')?.value;
    const description = this.secondFormGroup.get('description')?.value;
    const remarque = this.secondFormGroup.get('remarque')?.value;
    const matiere = this.threeFormGroup.get('matiere')?.value;
    const auteur = this.threeFormGroup.get('auteur')?.value;

    if (titre && dateDeRendu && description && remarque && matiere && auteur) {
      const newAssignment: any = {
        titre: titre,
        dateDeRendu: new Date(dateDeRendu),
        description: description,
        remarque: remarque,
        matiere: matiere,
        auteur: auteur
      };

      //console.log("dededdede", newAssignment);

      this.assignmentService.addAssignment(newAssignment).subscribe(response => {
        if(response.statue == "ok"){
           this.isLoading = false;
           this.notifyService.success(response.message);
           this.router.navigate(['/acceuil']);
        }
        // Optionally, reset the form or navigate to another view
      }, error => {
        console.error('Erreur lors de l\'ajout de l\'assignment', error);
      });

  }
    } catch (error) {
       this.isLoading = false
    }
    

}

}
