import { Component,OnInit } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { SidenavComponent } from '../../sidenav/sidenav.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EtudiantService } from '../../service/etudiant/etudiant.service';
import { Etudiant } from '../../Model/etudiant.model';
import { CommonModule } from '@angular/common';
import { NotifyServiceService } from '../../service/notify-service.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { AuthService } from '../../service/auth.service';
import { response } from 'express';
@Component({
  selector: 'app-form',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [NavbarComponent,SidenavComponent,
    MatSidenavModule,MatInputModule,MatFormFieldModule,
    MatDatepickerModule, MatIconModule,ReactiveFormsModule,CommonModule,MatProgressSpinnerModule
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent implements OnInit{

  form: FormGroup;
  selectedFile: File | null = null;
  imageUrl: string = '../../../assets/img/avatar.jpg';
  messageError = "";
  isLoading = false;
  studentId: string | null = null;

  constructor( private fb: FormBuilder,private route: ActivatedRoute,
    private router: Router,private etudiantSerice: EtudiantService, private notifyService : NotifyServiceService,
    private authService : AuthService) {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      dateNaissance: ['', Validators.required],
      // photo: [null]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params:any) => {
      this.studentId = params.get('id');
      if (this.studentId) {
        this.fetchData(this.studentId);
      }
    });
  }


  triggerFileInputClick(): void {
    const fileInput = document.getElementById('fileInput') as HTMLElement;
    fileInput.click();
  }
  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      this.selectedFile = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
        this.form.patchValue({ photo: this.imageUrl });
      };
      reader.readAsDataURL(file);
    }
  }

  fetchData(id: string) {
    try {
      this.etudiantSerice.getEtudiant(id).subscribe((response: any) => {
        console.log("dedede", response)
          this.form.patchValue(response.data);
          this.imageUrl = this.authService.getPathChemin() + "/" + response.data.photo;
       });
    } catch (error) {
      console.log("dedede", error)
      throw error
    }
     
  }

  onSubmit () {
    try {
      if(this.form.valid) {
        const etudiant: Etudiant = this.form.value;
        if(this.studentId){
          this.isLoading = true;
          this.etudiantSerice.updateEtudiant({id : this.studentId, etudiant: etudiant}, this.selectedFile).subscribe((response: any) => {
            if(response.statue == "ok") {
              this.isLoading = false;
              this.notifyService.success(response.message);
              this.router.navigate(['/etudiant']);
            }
          });
        }else{
          if(this.selectedFile){
            this.isLoading = true;
            this.etudiantSerice.addEtudiant(etudiant, this.selectedFile).subscribe((response : any) => {
               if(response.statue == "ok") {
                this.isLoading = false;
                this.notifyService.success(response.message);
                this.router.navigate(['/etudiant']);
               }
            })
          }else {
            this.isLoading = false;
            throw new Error('Photo obligatoire')
          }
        }
      }
    } catch (error : any) {
      this.isLoading = false;
      this.messageError = error.message;
  
    }
     
  }

}
