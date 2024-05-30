import { Component,Input } from '@angular/core';
import { AssignmentsService } from '../assignment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Assignment } from './assignment.model';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DialogElementsExampleDialogComponent } from '../dialog-elements-example-dialog/dialog-elements-example-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { AuthService } from '../service/auth.service';
import { RouterLink } from '@angular/router'; 
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { NotifyServiceService } from '../service/notify-service.service';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-assignment',
  standalone: true,
  imports: [CdkDropListGroup,MatIcon,MatFormField,MatLabel, CdkDropList, CdkDrag, SidenavComponent, NavbarComponent,MatSidenavModule,MatCardModule, 
    MatDividerModule,MatAutocompleteModule, MatButtonModule, MatProgressBarModule,CommonModule,RouterLink,MatProgressSpinnerModule],
  templateUrl: './assignment.component.html',
  styleUrl: './assignment.component.css'
})
export class AssignmentComponent {
  @Input() id: any;
  done:any;
  todo:any;
  path: string = '';
  currentpageR:any;
  currentpageT:any;
  totalpageR:any;
  totalpageT:any;
  disablenextR:any=false;
  disableprevR:any=false;
  disablenextT:any=false;
  disableprevT:any=false;
  pageNumbersR:any=[];
  pageNumbersT:any=[];
  isPagineT:any=false;
  isPagineR:any=false;
  isLoading = false;
  constructor(public dialog: MatDialog,private assignmentService:AssignmentsService,private route:ActivatedRoute,
    private router:Router, private authService: AuthService, private notifyService : NotifyServiceService) {
    this.path = this.authService.getPathChemin();
   }
   
  ngOnInit() {
  //   this.assignmentService.getAssignment(this.id)
  // .subscribe((assignment: any) => {
  //   const datas = assignment.data;
  //   datas.forEach((dataList: any[]) => {
  //     // Séparer les données en deux groupes en fonction de `etat` par chatGpt
  //     this.done.push(...dataList.filter(item => item.etat === 0));
  //     this.done.push(...dataList.filter(item => item.etat === 1));
  //   });
  // });
  this.isLoading = true;
  const page: number=1;
  
    this.fetchAlldata(page,true)
    this.fetchAlldata(page,false)
    this.isLoading = false;

  }
  goToPageT(page: number) {
    if (page !== this.currentpageT) {
      this.fetchAlldata(page,false);
    }
  }
  goToPageR(page: number) {
    if (page !== this.currentpageR) {
      this.fetchAlldata(page,true);
    }
  }
  fetchAlldata(page:any,type:boolean)
  {
    
    this.assignmentService.getAssignmentsRendu(3,page,type).subscribe((assignment: any) => {
      console.log(assignment)
      if(type==true)
      {
        this.isPagineR=true
        
        this.done = assignment.data.docs;
        this.currentpageR = page;
        this.totalpageR=assignment.data.totalPages
        this.pageNumbersR=[]

        for(let i=1;i <=this.totalpageR; i++)
        {
          console.log(i)
          this.pageNumbersR.push(i)
        }
        if(this.currentpageR==this.totalpageR)
        {
          console.log(this.currentpageR==this.totalpageR)
          this.disablenextR=true
          this.disableprevR=false
        }
       if(this.currentpageR==1)
        {
          this.disableprevR=true
          this.disablenextR=false
        }
        else{
          this.disableprevR=false
          this.disablenextR=false
        }
        setTimeout(() => {
          this.isPagineR=false
        }, 500);
        
      }else{
        this.isPagineT=true
        this.todo = assignment.data.docs;
        this.currentpageT = page;
        this.totalpageT=assignment.data.totalPages
        for(let i=1;i <=this.totalpageT; i++)
          {
            this.pageNumbersT.push(i)
          }
        if(this.currentpageT==this.totalpageT)
          {
            this.disablenextT=true
            this.disableprevT=false
          }
         if(this.currentpageT==1)
          {
            this.disableprevT=true
            this.disablenextT=false
          }
          else{
            this.disableprevT=false
            this.disablenextT=false
          }
          setTimeout(() => {
            this.isPagineT=false
          }, 500);  
      }
      
      // this.totalPages = matiere.data.totalPages;
      // this.currentPage = page;
      // this.generatePageNumbers();
      // this.isLoading = false;
    });
  }
  prevrendue(){
    this.currentpageR--;
    console.log("this.currentpageR")
    this.fetchAlldata(this.currentpageR,true)
  }
  nextrendue(){
    this.currentpageR++
    // console.log(this.currentpageR)
    this.fetchAlldata(this.currentpageR,true)
  }
  prevtodo(){
    this.currentpageT--;
    console.log("this.currentpageR")
    this.fetchAlldata(this.currentpageT,false)
  }
  nexttodo(){
    this.currentpageT++
    // console.log(this.currentpageR)
    this.fetchAlldata(this.currentpageT,false)
  }
  drop(event: CdkDragDrop<Assignment[]>) {

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      // datainstance.rendu=false
      
    } else {
      console.log(event.currentIndex)
      let datainstance=event.previousContainer.data[event.previousIndex]
      console.log(event.container.data)
      console.log(datainstance.rendu)
      console.log(datainstance)

      // console.log(this.dialog)
      // event.container.data[event.currentIndex].rendue=true
      if(datainstance.rendu===false)
      {
        const dialoginstance=this.dialog.open(DialogElementsExampleDialogComponent,{
          data:datainstance,
          disableClose: true,  // Empêche la fermeture en cliquant en dehors ou avec la touche Escape
          hasBackdrop: true    // Affiche le fond noir
        });
        dialoginstance.afterClosed().subscribe((result: Assignment) => {
          datainstance = result;
            if(datainstance.note!==undefined){
              transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex,
              );
              this.assignmentService.updateAssignment(datainstance).subscribe((response:any)=> {
                if(response.statue == 'ok'){
                  this.notifyService.success(response.message);
                }
              }

              )
            }
          }
        // console.log(datainstance)
      );
      }
      // console.log(datainstance)


    }
  }
}
