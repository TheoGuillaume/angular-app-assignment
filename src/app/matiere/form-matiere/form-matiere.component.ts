import { Component,OnInit} from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { SidenavComponent } from '../../sidenav/sidenav.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Matiere } from '../../Model/matiere.model';
import { MatiereService } from '../../service/matiere/matiere.service';
import { NotifyServiceService } from '../../service/notify-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { AuthService } from '../../service/auth.service';
interface Prof {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-form-matiere',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [NavbarComponent,SidenavComponent,MatSidenavModule,MatInputModule,
    MatFormFieldModule,MatDatepickerModule,MatIconModule,MatSelectModule,ReactiveFormsModule,CommonModule,MatProgressSpinnerModule],
  templateUrl: './form-matiere.component.html',
  styleUrl: './form-matiere.component.css'
})
export class FormMatiereComponent implements OnInit{
  form: FormGroup;
  imageUrl: string = '../../../assets/img/avatar.jpg';
  imageUrlM : string = '../../../assets/img/photo1.jpg';
  selectedFileProf: File | null = null;
  selectedFileMatiere: File | null = null;
  messageError = "";
  isLoading = false;
  matiereId: string | null = null;
  profs: Prof[] = [
    {value: 'Richard Grin', viewValue: 'Richard Grin'},
    {value: 'Michel Buffal', viewValue: 'Michel Buffal'},
    {value: 'Gregory Galli', viewValue: 'Gregory Galli'},
  ];

  constructor(private fb: FormBuilder,private matiereService : MatiereService,private notifyService : NotifyServiceService,
    private route: ActivatedRoute,
    private router: Router, private authService : AuthService) {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      professeur: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params:any) => {
      this.matiereId = params.get('id');
      if (this.matiereId) {
        this.fetchData(this.matiereId);
      }
    });
  }

  fileProfClick(): void {
    const fileInput = document.getElementById('fileProf') as HTMLElement;
    fileInput.click();
  }

  fetchData(id: string) {
    this.matiereService.getMatiere(id).subscribe((response: any) => {
       this.form.patchValue(response.data);
       this.imageUrl = this.authService.getPathChemin() + "/" + response.data.photo_prof;
       this.imageUrlM = this.authService.getPathChemin() + "/" + response.data.photo;
    });
 }

 
  onFileSelectedProf(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      this.selectedFileProf = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
        this.form.patchValue({ photo_prof: this.imageUrl });
      };
      reader.readAsDataURL(file);
    }
  }


  fileMatiereClick(): void {
    const fileInput = document.getElementById('fileMatiere') as HTMLElement;
    fileInput.click();
  }
  
  onFileSelectedMatiere(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      this.selectedFileMatiere = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrlM = e.target.result;
        this.form.patchValue({ photo: this.imageUrlM });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
     try {
      if(this.form.valid) {
        this.isLoading = true;
        const matiere : Matiere = this.form.value;
        if(this.matiereId){
          console.log("file_prof", this.selectedFileProf)
          console.log("file_matiere", this.selectedFileMatiere)
          this.matiereService.updateMatiere({id : this.matiereId, matiere : matiere}, this.selectedFileProf,this.selectedFileMatiere).subscribe((response: any) => {
            if(response.statue == "ok") {
              this.isLoading = false;
              this.notifyService.success(response.message);
              this.router.navigate(['/matiere']);
            }
          });
        }else{
          if(this.selectedFileMatiere  && this.selectedFileProf) {
            this.matiereService.addMatiere(matiere, this.selectedFileProf,this.selectedFileMatiere).subscribe((response : any) => {
             if(response.statue == "ok") {
               this.isLoading = false;
               this.notifyService.success(response.message);
               this.router.navigate(['/matiere']);
             }
            })
         }else {
          this.isLoading = false
           throw new Error('Image obligatoire');
         }
        }
      }
     } catch (error : any) {
        this.messageError = error.message
        this.isLoading = false
     }
  }

  
}
