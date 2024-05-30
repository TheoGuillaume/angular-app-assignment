import { Component,OnInit } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { SidenavComponent } from '../../sidenav/sidenav.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { AssignmentsService } from '../../assignment.service';
import { response } from 'express';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
@Component({
  selector: 'app-detail-assignment',
  standalone: true,
  imports: [NavbarComponent,SidenavComponent,MatSidenavModule,MatDividerModule
    ,MatButtonModule,FormsModule,CommonModule,MatProgressSpinnerModule],
  templateUrl: './detail-assignment.component.html',
  styleUrl: './detail-assignment.component.css'
})
export class DetailAssignmentComponent implements OnInit{
  imageUrl: string = '../../../assets/img/avatar.jpg';
  imageMatiere: string = '../../../assets/img/photo1.jpg';
  imageProf : string = '';
  assignmentId: string | null = null;
  data: any;
  isLoading = false;
  path = "";

  constructor(private assignmentService: AssignmentsService, private route : ActivatedRoute,private  authSerice : AuthService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params:any) => {
      this.assignmentId = params.get('id');
      if (this.assignmentId) {
        this.detailAssignment(this.assignmentId);
      }
    });
  }


  detailAssignment(id:string) {
    this.isLoading = true;
    this.assignmentService.getAssignment(id).subscribe((response: any) => {
       this.data = response.data;
       this.imageUrl = this.authSerice.getPathChemin() +"/"+ this.data.auteur.photo;
       this.imageMatiere =  this.authSerice.getPathChemin() +"/"+ this.data.matiere.photo;
       this.imageProf =  this.authSerice.getPathChemin() + "/" + this.data.matiere.photo_prof
       this.isLoading = false;
    })
  }

}
