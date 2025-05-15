import { Injectable, inject } from '@angular/core';
import { Auth, authState, User } from '@angular/fire/auth';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { Observable, of, switchMap, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  user$: Observable<User | null> = authState(this.auth);

  role$: Observable<string | null> = this.user$.pipe(
    switchMap((user) => {
      if (!user) return of(null);
      const ref = doc(this.firestore, 'users', user.uid);
      return docData(ref).pipe(map((data: any) => data?.role || null));
    })
  );

  async logout(): Promise<void> {
    await this.auth.signOut();
  }
}
