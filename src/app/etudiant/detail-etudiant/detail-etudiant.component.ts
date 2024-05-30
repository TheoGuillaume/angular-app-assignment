import { Component,OnInit } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { SidenavComponent } from '../../sidenav/sidenav.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { EtudiantService } from '../../service/etudiant/etudiant.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr);

@Component({
  selector: 'app-detail-etudiant',
  standalone: true,
  imports: [NavbarComponent,SidenavComponent,MatSidenavModule,CommonModule],
  templateUrl: './detail-etudiant.component.html',
  styleUrl: './detail-etudiant.component.css'
})
export class DetailEtudiantComponent implements OnInit {
  imageUrl: string = '../../../assets/img/avatar.jpg';
  studentId: string | null = null;
  data : any;
  isLoading = false;
  constructor(private etudiantSerice : EtudiantService, private route : ActivatedRoute
    ,private authService : AuthService
  ) {
     
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params:any) => {
      this.studentId = params.get('id');
      if (this.studentId) {
        this.detailEtudiant(this.studentId);
      }
    });
  }

  detailEtudiant(id:string){
    this.isLoading = true;
    this.etudiantSerice.getEtudiant(id).subscribe((response: any) => {
      this.data = response.data;
      this.imageUrl = this.authService.getPathChemin() + "/" + response.data.photo;
      this.isLoading = false;
   });
  }
}
