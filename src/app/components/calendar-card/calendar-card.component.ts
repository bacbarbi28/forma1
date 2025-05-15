import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './calendar-card.component.html',
  styleUrl: './calendar-card.component.scss',
})
export class CalendarCardComponent {
  @Input() date = '';
  @Input() eventName = '';
  @Input() imageUrl = '';
  @Input() location = '';
  @Input() isAdmin = false;
  @Input() event: any;

  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  onEdit() {
    this.edit.emit(this.event);
  }

  onDelete() {
    this.delete.emit(this.event);
  }
}
