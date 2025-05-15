import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, User } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class LoginService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  async login(
    email: string,
    password: string
  ): Promise<{ user: User; role: string | null }> {
    const userCredential = await signInWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    const user = userCredential.user;

    const userDocRef = doc(this.firestore, 'users', user.uid);
    const userSnap = await getDoc(userDocRef);

    const role = userSnap.exists() ? userSnap.data()['role'] || null : null;

    localStorage.setItem('userRole', role || '');
    localStorage.setItem('userEmail', user.email || '');

    return { user, role };
  }
}
