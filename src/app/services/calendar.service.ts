import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  query,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  where,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
  getDocs,
  QueryConstraint,
  CollectionReference,
} from '@angular/fire/firestore';
import { Observable, from, map, catchError, throwError } from 'rxjs';

export interface Event {
  id?: string;
  date: string;
  eventName: string;
  imageUrl: string;
  location: string;
}

export interface PaginatedEvents {
  events: Event[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
}

@Injectable({ providedIn: 'root' })
export class CalendarService {
  private readonly EVENTS_PER_PAGE = 5;
  private readonly EVENTS_COLLECTION = 'events';

  constructor(private firestore: Firestore) {}

  private getEventsCollection(): CollectionReference<Event> {
    return collection(
      this.firestore,
      this.EVENTS_COLLECTION
    ) as CollectionReference<Event>;
  }

  private handleError(error: any): Error {
    console.error('Firestore Error:', error);
    return new Error(
      error.message || 'An error occurred while accessing the database'
    );
  }

  getEvents(): Observable<Event[]> {
    const eventsRef = this.getEventsCollection();
    const q = query(eventsRef, orderBy('date', 'asc'));
    return collectionData(q, { idField: 'id' }) as Observable<Event[]>;
  }

  getUpcomingEvents(
    startAfterDoc?: QueryDocumentSnapshot<DocumentData>
  ): Observable<PaginatedEvents> {
    const eventsRef = this.getEventsCollection();
    const today = new Date().toISOString().split('T')[0];

    const queryConstraints: QueryConstraint[] = [
      where('date', '>=', today),
      orderBy('date', 'asc'),
      limit(this.EVENTS_PER_PAGE),
    ];

    if (startAfterDoc) {
      queryConstraints.push(startAfter(startAfterDoc));
    }

    const q = query(eventsRef, ...queryConstraints);

    return from(getDocs(q)).pipe(
      map((snapshot) => ({
        events: snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Event[],
        lastDoc:
          snapshot.docs.length > 0
            ? snapshot.docs[snapshot.docs.length - 1]
            : null,
      })),
      catchError((error) => throwError(() => this.handleError(error)))
    );
  }

  getEventsByLocation(
    location: string,
    maxEvents: number = 10
  ): Observable<Event[]> {
    if (!location) {
      return throwError(() => new Error('Location is required'));
    }

    const eventsRef = this.getEventsCollection();
    const queryConstraints: QueryConstraint[] = [
      where('location', '==', location),
      orderBy('location'),
      orderBy('date', 'desc'),
      limit(maxEvents),
    ];

    const q = query(eventsRef, ...queryConstraints);

    return collectionData(q, { idField: 'id' }).pipe(
      catchError((error) => {
        if (error?.message?.includes('index')) {
          const simpleQuery = query(
            eventsRef,
            where('location', '==', location),
            limit(maxEvents)
          );
          return collectionData(simpleQuery, { idField: 'id' }).pipe(
            map((events) => {
              return [...events].sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              );
            })
          );
        }
        return throwError(() => this.handleError(error));
      })
    ) as Observable<Event[]>;
  }

  getEventsInDateRange(
    startDate: string,
    endDate: string
  ): Observable<Event[]> {
    if (!startDate || !endDate) {
      return throwError(
        () => new Error('Both start and end dates are required')
      );
    }

    const eventsRef = this.getEventsCollection();
    const queryConstraints: QueryConstraint[] = [
      where('date', '>=', startDate),
      where('date', '<=', endDate),
      orderBy('date', 'asc'),
    ];

    const q = query(eventsRef, ...queryConstraints);

    return collectionData(q, { idField: 'id' }).pipe(
      catchError((error) => throwError(() => this.handleError(error)))
    ) as Observable<Event[]>;
  }

  searchEvents(searchTerm: string, location?: string): Observable<Event[]> {
    if (!searchTerm && !location) {
      return this.getEvents();
    }

    const eventsRef = this.getEventsCollection();
    const queryConstraints: QueryConstraint[] = [orderBy('date', 'asc')];

    if (location) {
      queryConstraints.unshift(where('location', '==', location));
    }

    const q = query(eventsRef, ...queryConstraints);

    return collectionData(q, { idField: 'id' }).pipe(
      map((events: Event[]) => {
        if (!searchTerm) return events;

        const normalizedSearch = searchTerm.toLowerCase().trim();
        return events.filter(
          (event) =>
            event.eventName.toLowerCase().includes(normalizedSearch) ||
            event.location.toLowerCase().includes(normalizedSearch)
        );
      }),
      catchError((error) => throwError(() => this.handleError(error)))
    );
  }

  getUniqueLocations(): Observable<string[]> {
    const eventsRef = this.getEventsCollection();
    const q = query(eventsRef);

    return from(getDocs(q)).pipe(
      map((snapshot) => {
        const locations = new Set<string>();
        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          if (data.location) {
            locations.add(data.location);
          }
        });
        return Array.from(locations).sort();
      }),
      catchError((error) => throwError(() => this.handleError(error)))
    );
  }

  async addEvent(event: Omit<Event, 'id'>): Promise<void> {
    if (!this.validateEvent(event)) {
      throw new Error('Invalid event data');
    }

    try {
      const eventsRef = this.getEventsCollection();
      await addDoc(eventsRef, {
        ...event,
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateEvent(id: string, event: Partial<Event>): Promise<void> {
    if (!id) {
      throw new Error('Event ID is required');
    }

    try {
      const eventRef = doc(this.firestore, this.EVENTS_COLLECTION, id);
      await updateDoc(eventRef, event);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteEvent(id: string): Promise<void> {
    if (!id) {
      throw new Error('Event ID is required');
    }

    try {
      const eventRef = doc(this.firestore, this.EVENTS_COLLECTION, id);
      await deleteDoc(eventRef);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private validateEvent(event: Omit<Event, 'id'>): boolean {
    const isValid = !!(
      event.eventName &&
      event.date &&
      event.location &&
      event.imageUrl &&
      typeof event.eventName === 'string' &&
      typeof event.location === 'string' &&
      typeof event.imageUrl === 'string' &&
      typeof event.date === 'string'
    );

    if (!isValid) {
      console.error('Event validation failed: missing required fields', event);
    }

    return isValid;
  }
}
