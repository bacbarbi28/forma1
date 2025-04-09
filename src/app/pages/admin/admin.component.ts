import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
  articleForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.articleForm = this.fb.group({
      title: ['', Validators.required],
      imageUrl: [''],
      date: ['', Validators.required],
      content: ['', Validators.required],
    });
  }

  onCreate() {
    if (this.articleForm.valid) {
      console.log('Új cikk:', this.articleForm.value);
      alert('Cikk létrehozva DEMO');
      this.articleForm.reset();
    }
  }
}
