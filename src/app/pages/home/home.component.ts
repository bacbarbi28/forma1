import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  featured = {
    title: 'Verstappen újra legyőzhetetlen!',
    subtitle: 'Red Bull dominancia a szezonnyitón',
    imageUrl: 'redbull.jpg',
  };

  articles = [
    {
      title: 'Ferrari technikai áttörése',
      description: 'Sainz és Leclerc új padlólemezt teszteltek Imolában.',
      imageUrl: 'ferrari.jpg',
      date: '2025. Március 15.',
    },
    {
      title: 'Hamilton: „Tudom, mit akarok”',
      description: 'Az átigazolási pletykák újabb hulláma érkezett.',
      imageUrl: 'astonmartin.jpg',
      date: '2025. Március 12.',
    },
    {
      title: 'McLaren bejelentette 2025-ös dizájnját',
      description: 'Narancs, fekete és egy csipetnyi kék – itt a jövő autója.',
      imageUrl: 'mclaren.jpg',
      date: '2025. Március 10.',
    },
  ];
}
