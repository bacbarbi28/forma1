import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarCardComponent } from '../../components/calendar-card/calendar-card.component';
import { CalendarService } from '../../services/calendar.service';
import { AuthService } from '../../services/auth.service';
import { Event, PaginatedEvents } from '../../services/calendar.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { EventDialogComponent } from '../../components/event-dialog/event-dialog.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { QueryDocumentSnapshot, DocumentData } from '@angular/fire/firestore';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    CalendarCardComponent,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  events$!: Observable<Event[]>;
  role$!: Observable<string | null>;
  locations$!: Observable<string[]>;

  searchControl = new FormControl('');
  locationControl = new FormControl('');
  lastDoc: QueryDocumentSnapshot<DocumentData> | null = null;
  loading = false;

  private eventsSubject = new BehaviorSubject<Event[]>([]);
  private dialog = inject(MatDialog);
  private snackbar = inject(MatSnackBar);

  constructor(
    private calendarService: CalendarService,
    private authService: AuthService
  ) {
    this.role$ = this.authService.role$;
    this.events$ = this.eventsSubject.asObservable();
    this.locations$ = this.calendarService.getUniqueLocations();
  }

  ngOnInit(): void {
    this.loadUpcomingEvents();

    this.searchControl.valueChanges.subscribe((searchTerm) => {
      if (searchTerm) {
        this.searchEvents(searchTerm);
      } else {
        this.loadUpcomingEvents();
      }
    });
  }

  loadUpcomingEvents(loadMore: boolean = false): void {
    if (this.loading) return;

    this.loading = true;
    const lastDocument = loadMore ? this.lastDoc : undefined;

    this.calendarService
      .getUpcomingEvents(lastDocument ? lastDocument : undefined)
      .subscribe({
        next: (data: PaginatedEvents) => {
          const currentEvents = loadMore ? this.eventsSubject.value : [];
          this.eventsSubject.next([...currentEvents, ...data.events]);
          this.lastDoc = data.lastDoc;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading events:', error);
          this.loading = false;
          this.snackbar.open(
            'Hiba történt az események betöltésekor.',
            'Bezárás',
            {
              duration: 3000,
            }
          );
        },
      });
  }

  searchEvents(searchTerm: string): void {
    const location = this.locationControl.value || undefined;
    this.calendarService.searchEvents(searchTerm, location).subscribe({
      next: (events) => {
        this.eventsSubject.next(events);
      },
      error: (error) => {
        console.error('Error searching events:', error);
        this.snackbar.open('Hiba történt a keresés során.', 'Bezárás', {
          duration: 3000,
        });
      },
    });
  }

  filterByLocation(): void {
    const location = this.locationControl.value;
    if (location) {
      this.calendarService.getEventsByLocation(location).subscribe({
        next: (events) => {
          this.eventsSubject.next(events);
        },
        error: (error) => {
          console.error('Error filtering events:', error);
          this.snackbar.open('Hiba történt a szűrés során.', 'Bezárás', {
            duration: 3000,
          });
        },
      });
    } else {
      this.loadUpcomingEvents();
    }
  }

  loadMore(): void {
    if (!this.loading && this.lastDoc) {
      this.loadUpcomingEvents(true);
    }
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(EventDialogComponent, {
      width: '100%',
      maxWidth: '500px',
      data: null,
    });

    dialogRef.afterClosed().subscribe((data: Event | null) => {
      if (data) {
        this.calendarService.addEvent(data).then(() => {
          this.snackbar.open('Esemény hozzáadva.', 'Bezárás', {
            duration: 3000,
          });
        });
      }
    });
  }

  openEditDialog(event: Event): void {
    const dialogRef = this.dialog.open(EventDialogComponent, {
      width: '100%',
      maxWidth: '500px',
      data: event,
    });

    dialogRef.afterClosed().subscribe((updatedEvent: Event | null) => {
      if (updatedEvent?.id) {
        this.calendarService
          .updateEvent(updatedEvent.id, updatedEvent)
          .then(() => {
            this.snackbar.open('Esemény frissítve.', 'Bezárás', {
              duration: 3000,
            });
          });
      }
    });
  }

  deleteEvent(event: Event): void {
    if (!event.id) return;

    const confirmed = confirm(
      `Biztosan törlöd a(z) ${event.eventName} eseményt?`
    );
    if (confirmed) {
      this.calendarService.deleteEvent(event.id).then(() => {
        this.snackbar.open('Esemény törölve.', 'Bezárás', { duration: 3000 });
      });
    }
  }
}
