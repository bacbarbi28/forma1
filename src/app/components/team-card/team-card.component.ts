import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-team-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './team-card.component.html',
  styleUrls: ['./team-card.component.scss'],
})
export class TeamCardComponent {
  @Input() engine = '';
  @Input() teamName = '';
  @Input() drivers: string[] = [];
  @Input() points = 0;
  @Input() position = 1;
  @Input() imageUrl = '';
  @Input() logoUrl = '';
  @Input() colorClass = '';
  @Input() isAdmin = false;
  @Input() team: any;

  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  onEdit() {
    this.edit.emit(this.team);
  }

  onDelete() {
    this.delete.emit(this.team);
  }
}
