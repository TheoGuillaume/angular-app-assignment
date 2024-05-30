import { Component,OnInit } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { SidenavComponent } from '../../sidenav/sidenav.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { ActivatedRoute } from '@angular/router';
import { MatiereService } from '../../service/matiere/matiere.service';
import { AuthService } from '../../service/auth.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [NavbarComponent,SidenavComponent,MatSidenavModule,MatProgressSpinnerModule,CommonModule],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
})
export class DetailComponent implements OnInit{
  matieretId: string | null = null;
  data : any;
  isLoading = false;
  imageUrl: string | null = null;
  imageUrlM : string | null = null;
  constructor(private serviceMatiere : MatiereService, private routes : ActivatedRoute, private authService : AuthService) {
     
  }

  ngOnInit(): void {
    this.routes.paramMap.subscribe((params:any) => {
      this.matieretId = params.get('id');
      if (this.matieretId) {
        this.detailMatiere(this.matieretId);
      }
    });
  }

  detailMatiere(id:string){
    this.isLoading = true;
    this.serviceMatiere.getMatiere(id).subscribe((response: any) => {
      this.data = response.data;
      console.log(this.data)
      this.imageUrl = this.authService.getPathChemin() + "/" + response.data.photo_prof;
      this.imageUrlM = this.authService.getPathChemin() + "/" + response.data.photo;
      this.isLoading = false;
   });
  }

}
