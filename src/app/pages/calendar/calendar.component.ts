import { Component } from '@angular/core';
import { CalendarCardComponent } from '../../components/calendar-card/calendar-card.component';

@Component({
  selector: 'app-calendar',
  imports: [CalendarCardComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent {}
