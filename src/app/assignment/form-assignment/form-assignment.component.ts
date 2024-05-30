import { Component,OnInit } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { SidenavComponent } from '../../sidenav/sidenav.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import { MatiereService } from '../../service/matiere/matiere.service';
import { EtudiantService } from '../../service/etudiant/etudiant.service';
import { response } from 'express';
import { ActivatedRoute } from '@angular/router';
import { AssignmentsService } from '../../assignment.service';

@Component({
  selector: 'app-form-assignment',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [NavbarComponent,SidenavComponent,MatSidenavModule,
    MatInputModule,MatFormFieldModule,MatDatepickerModule,MatIconModule,MatSelectModule],
  templateUrl: './form-assignment.component.html',
  styleUrl: './form-assignment.component.css'
})
export class FormAssignmentComponent implements OnInit {
 listMatiere : any;
 listeEtudiant : any;
 assigmentId:any;
constructor(private assigmentService: AssignmentsService,private route: ActivatedRoute,private matiereService : MatiereService, private etudiantService : EtudiantService){

}

  ngOnInit(): void {
      this.fetchData()
  }
  fetchAssigment(id: string) {
    try {
      this.assigmentService.getAssignment(id).subscribe((response: any) => {
        console.log("dedede", response)
          // this.form.patchValue(response.data);
          // this.imageUrl = this.authService.getPathChemin() + "/" + response.data.photo;
       });
    } catch (error) {
      console.log("dedede", error)
      throw error
    }
     
  }
  fetchData() {
    this.route.paramMap.subscribe((params:any) => {
      this.assigmentId = params.get('id');
      if (this.assigmentId) {
        //this.fetchData(this.studentId);
      }
    });
     this.matiereService.getMatieres("", 1, 100).subscribe((response:any) => {
        this.listMatiere = response.data.docs
     })
     this.etudiantService.getsEtudiants("", 1, 100).subscribe((response:any) => {
       this.listeEtudiant = response.data.docs
     })
  }

}
