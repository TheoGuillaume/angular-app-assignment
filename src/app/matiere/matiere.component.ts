import { Component,OnInit } from '@angular/core';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { SidenavComponent } from '../sidenav/sidenav.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatiereService } from '../service/matiere/matiere.service';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import {MatPaginatorModule} from '@angular/material/paginator';
import { RouterLink } from '@angular/router'; 
export interface Matiere {
  photo: string;
  photo_prof: string;
  nom: string;
  professeur : string;
  action: number;
}
@Component({
  selector: 'app-matiere',
  standalone: true,
  imports: [NavbarComponent,SidenavComponent,MatSidenavModule,MatTableModule,MatIconModule,MatButtonModule
    ,MatProgressSpinnerModule,CommonModule,FormsModule,MatPaginatorModule,RouterLink
  ],
  templateUrl: './matiere.component.html',
  styleUrl: './matiere.component.css'
})
export class MatiereComponent implements OnInit{
  data :Matiere[] = [];
  path: any;
  isLoading: boolean = false;
  searchText : any;
  searchQuery: string = ''; 
  isAdmin : boolean = false;// Propriété pour stocker la valeur de recherche
  
  currentPage: number = 1;
  totalPages: number = 0;
  pageNumbers: number[] = [];

  constructor(private  serviceMatiere : MatiereService,private authService : AuthService,private router: Router) { 
  }

  displayedColumns: string[] = ['photo', 'nom','professeur', 'action'];

  ngOnInit() { 
    console.log(this.searchQuery);
    this.fetchData(this.searchText,this.currentPage);
    this.getPath();
    this.isAdmin = this.authService.getIsAdmin();
  }

  fetchData (search: string,page: number) {
    this.isLoading = true;
    this.searchText = search ? search : "";
      this.serviceMatiere.getMatieres(this.searchText, page, 10).subscribe((matiere: any) => {
        this.data = matiere.data.docs;
        this.totalPages = matiere.data.totalPages;
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

editlMatiere(id :string) {
  this.router.navigate(['/matiere/edit', id]);
}

detailMatiere(id :string) {
  this.router.navigate(['/matiere/detail', id]);
}



}
 