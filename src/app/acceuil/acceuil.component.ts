import { Component } from '@angular/core';
import { AssignmentComponent } from '../assignment/assignment.component';
import { AssignmentsService } from '../assignment.service';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Assignment } from '../assignment/assignment.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {MatTable, MatTableModule} from '@angular/material/table';
import { MatPaginatorModule,PageEvent } from '@angular/material/paginator';
import { MatListModule } from '@angular/material/list';
import { MatSliderModule } from '@angular/material/slider';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { SidenavComponent } from '../sidenav/sidenav.component';

import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-acceuil',
  standalone: true,
  imports: [AssignmentComponent,CommonModule, FormsModule,CdkDropList, CdkDrag,
    RouterLink,
    MatButtonModule,
    MatTable, MatTableModule, MatPaginatorModule,
    MatListModule, MatSliderModule,NavbarComponent,MatSidenavModule,SidenavComponent],
  templateUrl: './acceuil.component.html',
  styleUrl: './acceuil.component.css'
})
export class AcceuilComponent {
  assignments!: any;
  assignments_done: any=[];
  assignments_todo: any=[];
  titre:string="Liste des Assignements";
  page = 1;
  limit = 10;
  totalDocs !: number;
  totalPages !: number;
  nextPage !: number;
  prevPage !: number;
  hasNextPage !: boolean;
  hasPrevPage !: boolean;
  displayedColumns: string[] = ['nom', 'dateDeRendu', 'rendu'];
  constructor(private assignmentService:AssignmentsService,private route:ActivatedRoute,private router:Router) { }
    ngOnInit() {
      this.assignmentService.getAssignmentsPagines(this.page, this.limit)
    .subscribe((assignment: any) => {
      this.assignments = assignment.data.docs;
      this.distributAssignment(this.assignments)
      this.totalDocs = assignment.totalDocs;
      this.totalPages = assignment.totalPages;
      this.nextPage = assignment.nextPage;
      this.prevPage = assignment.prevPage;
      this.hasNextPage = assignment.hasNextPage;
      this.hasPrevPage = assignment.hasPrevPage;
      console.log(assignment)
      console.log(this.assignments)
    });
    
    }
    distributAssignment(arrays:any){
      for(const element of arrays){
        if(element.etat=="1"){
          this.assignments_todo.push(element)
        }else{
          this.assignments_done.push(element)
        }
      }
    }
    getAssignmentsFromService() {
      // on récupère les assignments depuis le service
      this.assignmentService.getAssignmentsPagines(this.page, this.limit)
      .subscribe((data:any) => {
        // les données arrivent ici au bout d'un certain temps
        console.log('Données arrivées');
        // console.log(data)
        this.assignments = data.data.docs;
        this.distributAssignment(this.assignments)
        this.totalDocs = data.data.totalDocs;
        this.totalPages = data.data.totalPages;
        this.nextPage = data.data.nextPage;
        this.prevPage = data.data.prevPage;
        this.hasNextPage = data.data.hasNextPage;
        this.hasPrevPage = data.data.hasPrevPage;
      });
      console.log('Requête envoyée');
    }
  
    // Pour la pagination
    pagePrecedente() {
      this.page = this.prevPage;
      this.getAssignmentsFromService();
    }
    pageSuivante() {
      this.page = this.nextPage;
      this.getAssignmentsFromService();
    }
  
    premierePage() {
      this.page = 1;
      this.getAssignmentsFromService();
    }
  
    dernierePage() {
      this.page = this.totalPages;
      this.getAssignmentsFromService();
    }
  
    // Pour le composant angular material paginator
    handlePageEvent(event: PageEvent) {
      this.page = event.pageIndex + 1;
      this.limit = event.pageSize;
      this.getAssignmentsFromService();
    }

  drop(event: CdkDragDrop<string[]>) {
    console.log(event)
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      this.assignmentService.updateAssignments(event.container.data)
    }
  }
}
