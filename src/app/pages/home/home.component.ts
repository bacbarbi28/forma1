import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import {
  HomeArticleService,
  Article,
} from '../../services/homeArticle.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private articleService = inject(HomeArticleService);

  featured: Article | null = null;
  articles: Article[] = [];

  ngOnInit(): void {
    this.articleService.getArticles().subscribe((articles) => {
      if (articles.length > 0) {
        this.featured = articles[0];
        this.articles = articles.slice(1);
      }
    });
  }
}
