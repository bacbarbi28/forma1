import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent {
  article = {
    title: 'Ferrari áttörés Imolában – új padlólemez teszt alatt',
    author: 'F1 Blog',
    date: '2025. április 15.',
    imageUrl: 'ferrari.jpg',
    content: `
      A Ferrari csapata új fejlesztéseket tesztelt az imolai futam előtti pénteki szabadedzéseken.
      Az új padlólemez célja, hogy csökkentse a porpoising jelenséget, miközben növeli a leszorítóerőt a gyors kanyarokban.
      
      Charles Leclerc elmondta, hogy az autó sokkal stabilabbnak érződik, különösen a nagysebességű kanyarokban.
      A csapat abban bízik, hogy a fejlesztések révén közelebb kerülhetnek a Red Bullhoz és a Mercedeshez a szezon második felére.
    `,
  };
}
