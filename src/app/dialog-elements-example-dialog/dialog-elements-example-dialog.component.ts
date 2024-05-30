import { Component, Inject } from '@angular/core';
import { FormControl, FormGroupDirective, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Assignment } from '../assignment/assignment.model';
import { ErrorStateMatcher } from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-dialog-elements-example-dialog',
  standalone: true,
  imports:  [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ReactiveFormsModule
  ],
  templateUrl: './dialog-elements-example-dialog.component.html',
  styleUrl: './dialog-elements-example-dialog.component.css'
})
export class DialogElementsExampleDialogComponent {
  emailFormControl = new FormControl('', [Validators.required,Validators.min(0),
  Validators.max(20)]
);
  matcher = new MyErrorStateMatcher();
  constructor(
    public dialogRef: MatDialogRef<DialogElementsExampleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data:Assignment,
  ) {}

  onNoClick(): void {
    this.data.rendu=false
    console.log(this.data)
  }
  onYesClick(): void {
    if(this.emailFormControl.valid){
      this.data.rendu=true
    }
   
  }
}
