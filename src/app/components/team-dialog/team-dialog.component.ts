import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-team-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    FormsModule,
  ],
  templateUrl: './team-dialog.component.html',
  styleUrls: ['./team-dialog.component.scss'],
})
export class TeamDialogComponent {
  form: FormGroup;
  driverInput: string = '';
  drivers: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<TeamDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.drivers = data?.drivers || [];

    this.form = this.fb.group({
      teamName: [data?.teamName || '', Validators.required],
      engine: [data?.engine || '', Validators.required],
      points: [data?.points || 0, Validators.required],
      position: [data?.position || 1, Validators.required],
      imageUrl: [data?.imageUrl || '', Validators.required],
      logoUrl: [data?.logoUrl || '', Validators.required],
      colorClass: [data?.colorClass || '', Validators.required],
    });
  }

  addDriver(): void {
    if (this.driverInput.trim()) {
      this.drivers.push(this.driverInput.trim());
      this.driverInput = '';
    }
  }

  removeDriver(index: number): void {
    this.drivers.splice(index, 1);
  }

  save(): void {
    if (this.form.valid) {
      const result: any = {
        ...this.form.value,
        drivers: this.drivers,
      };

      if (this.data?.id) {
        result.id = this.data.id;
      }

      this.dialogRef.close(result);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
