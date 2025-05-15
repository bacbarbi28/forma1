import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ArticleService } from '../../services/article.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
  articleForm: FormGroup;

  constructor(private fb: FormBuilder, private articleService: ArticleService) {
    this.articleForm = this.fb.group({
      title: ['', Validators.required],
      imageUrl: [''],
      content: ['', Validators.required],
    });
  }

  onCreate() {
    if (this.articleForm.valid) {
      this.articleService
        .createArticle(this.articleForm.value)
        .then(() => {
          alert('Cikk sikeresen létrehozva!');
          this.articleForm.reset();
        })
        .catch((err) => {
          console.error('Hiba a cikk mentésekor:', err);
          alert('Hiba történt a mentés során.');
        });
    }
  }
}
