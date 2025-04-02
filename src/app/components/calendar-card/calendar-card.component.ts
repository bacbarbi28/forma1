import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatChipsModule, MatButtonModule],
  templateUrl: './calendar-card.component.html',
  styleUrl: './calendar-card.component.scss',
})
export class CalendarCardComponent {
  @Input() date = '';
  @Input() eventName = '';
  @Input() imageUrl = '';
  @Input() location = '';
}
