import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatListItem, MatNavList } from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {DatePipe} from '@angular/common';
import {MatListModule} from '@angular/material/list';
import { Route } from '@angular/router';
import { RouterLink } from '@angular/router'; 

export interface Section {
  name: string;
  updated: Date;
}

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [MatSidenavModule,MatNavList,MatListItem,MatIcon,CommonModule,FormsModule,MatDividerModule,MatIconModule,DatePipe,MatListModule,RouterLink],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent {

  isExpanded = true;
  showSubmenu: boolean = false;
  isShowing = false;
  showSubSubMenu: boolean = false;


  mouseenter() {
    if (!this.isExpanded) {
      this.isShowing = true;
    }
  }

  mouseleave() {
    if (!this.isExpanded) {
      this.isShowing = false;
    }
  }

}
