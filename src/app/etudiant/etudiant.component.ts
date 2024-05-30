import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { SidenavComponent } from '../sidenav/sidenav.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {TooltipPosition, MatTooltipModule} from '@angular/material/tooltip';
import { EtudiantService } from '../service/etudiant/etudiant.service';
import { AuthService } from '../service/auth.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import {MatPaginatorModule} from '@angular/material/paginator';
import { RouterLink } from '@angular/router'; 
import { Router } from '@angular/router';
export interface Etudiant {
  photo: string;
  name: string;
  prenom : string;
  dateNaissance : string;
  action: number;
}





@Component({
  selector: 'app-etudiant',
  standalone: true,
  imports: [SidenavComponent, NavbarComponent,MatSidenavModule,
    MatTableModule,MatIconModule,MatButtonModule, MatTooltipModule,MatProgressSpinnerModule,
    CommonModule,FormsModule,MatPaginatorModule,RouterLink],
  templateUrl: './etudiant.component.html',
  styleUrl: './etudiant.component.css'
})
export class EtudiantComponent implements OnInit{
  data :Etudiant[] = [];
  path: any;
  isLoading: boolean = false;
  searchText : any;
  searchQuery: string = ''; // Propriété pour stocker la valeur de recherche
  
  currentPage: number = 1;
  totalPages: number = 0;
  pageNumbers: number[] = [];

  constructor(private  serviceEtudiant : EtudiantService,private authService : AuthService,private router: Router) { 
   }

  displayedColumns: string[] = ['photo', 'name','prenom','dateNaissance', 'action'];

  ngOnInit() { 
    console.log(this.searchQuery);
    this.fetchData(this.searchText,this.currentPage);
    this.getPath();
  }

  fetchData (search: string,page: number) {
    this.isLoading = true;
    this.searchText = search ? search : "";
      this.serviceEtudiant.getsEtudiants(this.searchText, page, 10).subscribe((etudiant: any) => {
        this.data = etudiant.data.docs;
        this.totalPages = etudiant.data.totalPages;
        this.currentPage = page;
        this.generatePageNumbers();
        this.isLoading = false;
      });
  }

  getPath () {
     this.path =  this.authService.getPathChemin();
  }

  generatePageNumbers() {
    
    this.pageNumbers = [];
    for (let i = 1; i <= this.totalPages; i++) {
      this.pageNumbers.push(i);
    }
  }

  goToPage(page: number) {
    console.log(page);
    if (page !== this.currentPage) {
      this.fetchData(this.searchText, page);
    }
  }

  search() {
    if (!this.searchQuery || this.searchQuery.trim() === '') {
        // Si la recherche est vide, récupérez toutes les données
        this.fetchData('',this.currentPage);
    } else {
        // Sinon, effectuez la recherche en utilisant la valeur de l'entrée de recherche
        this.fetchData(this.searchQuery.trim(), 1);
    }
  }

  onSearchInputChange() {
    // Si l'entrée de recherche devient vide, afficher toutes les données
    if (!this.searchQuery || this.searchQuery.trim() === '') {
        this.fetchData('', 1);
    }
}

editStudent(id: string) {
  this.router.navigate(['/etudiant/detail', id]);
}

detailStudent(id :string) {
  this.router.navigate(['/etudiant/detail-etudiant', id]);
}

}